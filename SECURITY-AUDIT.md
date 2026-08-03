# Security audit — Lily’s Sweet Treats + FORGE

**Date:** 2026-08-03  
**Scope:** Localhost static + dynamic analysis (no production changes).  
**Sites:** `lilys-sweet-treats` (port 3000), `forge-site` (port 3001).

## Customer data model (what a “hacker” could target)

| Data | Where it lives | Card numbers? |
|------|----------------|---------------|
| Name, phone, email, order notes | Stripe PaymentIntent **metadata** + Resend emails | **No** — Stripe Elements; cards never touch our servers |
| Order lines / tax | Stripe Tax + PI metadata | — |
| Inventory / products (FORGE) | Supabase (service role server-only; anon for storefront reads) | — |
| Admin inventory (FORGE) | Password-gated `/admin` + service role | — |

**Neither site stores card PANs or CVVs.** PCI surface is Stripe-hosted.

---

## Static analysis

| Check | Lily’s | FORGE | Result |
|-------|--------|-------|--------|
| Hardcoded secrets in source | Done | Done | **Clean** (no `sk_live_`, webhook secrets, service role keys in source) |
| Semgrep OWASP + TypeScript + React | Done | Done | **No findings** |
| `npm audit` high | Next/postcss/sharp transitive | Same + babel/js-yaml | See residual deps below |
| Next.js | Upgraded **16.2.12** | Upgraded **16.2.12** | Latest stable as of audit |

### Residual dependency notes

- Nested **postcss** / **sharp** under Next still flag high in `npm audit`; fixing requires a newer Next release that bumps those deps. Do **not** run `npm audit fix --force` (it can downgrade Next).
- **brace-expansion** overridden to `2.0.2` where possible.
- Re-run: `npm run security` in each repo.

---

## Dynamic analysis (localhost)

### Security headers

Both sites set: `HSTS`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, **CSP** (Stripe allowed).  
FORGE: removed `X-Powered-By`; API responses `no-store`.

### API probes — Lily’s

| Probe | Expected | Observed |
|-------|----------|----------|
| POST `/api/create-payment-intent` no Origin | 403 | 403 |
| Bad Origin | 403 | 403 |
| Oversized Content-Length | 413 | 413 |
| Honeypot field filled | 400 | 400 |
| Webhook no / fake signature | 400 | 400 |
| GET payment intent | 405 | 405 |
| Early IP rate limit | 429 | 429 (after fix) |

### API probes — FORGE

| Probe | Expected | Observed (before → after fix) |
|-------|----------|-------------------------------|
| Checkout no Origin | 403 | **was 400 → now 403** |
| Checkout evil Origin | 403 | **was processed → now 403** |
| Checkout legitimate Origin | 200 + server price | 200; **client `price:1` ignored** (server uses catalog) |
| Webhook no signature | 400 | 400 |
| attach-email without secret | 400 / 403 | 403 with no Origin |
| Rate limit checkout empty cart | 429 | 429 after ~12 |
| `/admin` unauthenticated | login only | login form (no product dump) |
| `/.env` | 404 | 404 |

### Price / inventory integrity (FORGE)

Server reloads product + variant from Supabase; **does not trust client price**. Out-of-stock / invalid size rejected.

### Admin (FORGE)

- Cookie `httpOnly`, `sameSite=lax`, HMAC session, timing-safe password compare  
- Login rate-limited (5 / 15 min)  
- Mutations require admin session + service role client (server-only)

---

## Findings fixed in this pass

### HIGH — Lily’s success-page IDOR (PII)

**Issue:** `/order/success?payment_intent=pi_…` retrieved the PaymentIntent with the **secret key** and displayed **customer email**, and could trigger confirmation emails, with **no proof of ownership**.

**Risk:** Anyone who obtains a PI id (logs, shared URL, referrer) could see that customer’s email.

**Fix:**
- Require `payment_intent_client_secret` matching Stripe’s secret on that PI before showing email or calling `notifyOrderPaidOnce` from the page.
- `CheckoutPayment` now appends `payment_intent_client_secret` on client-side redirect.
- Stripe webhooks remain the backup path for emails (signature-verified).

### HIGH — FORGE checkout Origin not enforced

**Issue:** `allowedCheckoutOrigin()` was computed but **never used to reject** requests. Cross-site scripts could create PaymentIntents.

**Fix:** `assertBrowserOrigin()` on `/api/checkout`, `/api/checkout/attach-email`, `/api/checkout/send-confirmation`.

### MEDIUM — Lily’s rate limit after validation

**Issue:** Invalid carts never counted toward limits → cheap flood of validation/tax attempts.

**Fix:** IP rate limit runs **before** honeypot/validation; per-email limit still after parse.

### LOW — FORGE `X-Powered-By` + API cache headers

**Fix:** `poweredByHeader: false` + `Cache-Control: no-store` on `/api/*`.

---

## Remaining residual risks (not fully eliminable in app code)

1. **Stripe dashboard access** — anyone with Stripe login sees all customer metadata. Use 2FA + limited team access.  
2. **Client secret** — possession of `pi_…_secret_…` allows attach-email / confirm-email APIs (by design; high entropy). Don’t log secrets; don’t put them in third-party analytics.  
3. **In-memory rate limits** on Vercel — per-isolate; FORGE can use Upstash/Supabase durable limiters when env is set.  
4. **CSP** still allows `'unsafe-inline'` / `'unsafe-eval'` for Next + Stripe — industry-typical; tighten later with nonces if needed.  
5. **Supabase RLS** — inventory/catalog security depends on policies; service role is server-only (good). Periodically review RLS so anon cannot read customer tables if any are added.  
6. **Admin password** — single shared password; prefer strong secret + `ADMIN_SESSION_SECRET` + rotate.  
7. **Transitive npm CVEs** under Next (postcss/sharp) — monitor Next releases.

---

## How to re-run

```bash
# Static (each repo)
npm run security

# Dynamic (servers running)
curl -sI http://localhost:3000/ | grep -i content-security
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/create-payment-intent \
  -H 'Content-Type: application/json' -d '{}'   # expect 403
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3001/api/checkout \
  -H 'Content-Type: application/json' -H 'Origin: https://evil.example' \
  -d '{"items":[]}'   # expect 403
```

## Production note

These changes are **local only** until you explicitly approve deploy/push.  
Do not enable live Stripe testing against production for security probes.
