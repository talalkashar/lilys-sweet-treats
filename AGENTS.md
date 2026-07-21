<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Lily’s Sweet Treats — agent notes

## Client handoff

- Owner guide: **CLIENT-HANDOFF.md** (GitHub, Vercel, Stripe, Resend, domain).  
- Menu edits: **PRODUCT-MENU.md**.  
- Teaching Codex: **CODEX-FOR-CLIENT.md**.  
- Vercel **Hobby** cannot invite collaborators — transfer the project to her account or upgrade to Pro.

## Localhost-only rule (HARD — never violate)

**Default mode: work ONLY on localhost.** Do not touch the live site without explicit user approval.

### Allowed without asking
- Edit local files under this repo
- Run / restart `start.sh` / `npm run dev` on localhost
- Local builds, lint, smoke tests against `http://localhost:3000`

### NEVER do unless the user clearly approves in this conversation
- Deploy to Vercel / production / preview that replaces live
- `git push` (especially `main`) if it can auto-deploy
- Change Vercel production env vars, domains, or project settings
- Run production Stripe/live charges for testing
- Anything that updates **https://www.lilyssweettreatsva.com** (or the apex domain)

### If live/production work is needed
1. Finish and verify on **localhost** first.
2. Tell the user what would go live.
3. Wait for explicit approval (e.g. “push”, “deploy”, “go live”, “update production”).
4. Only then push/deploy.

**No implied approval.** “Looks good”, “ship it later”, or prior session deploys do **not** authorize a new production update.

## Menu / products (most common task)

**Read `PRODUCT-MENU.md` first.** That is the single guide for adding, hiding, or changing menu items.

| Task | Where |
|------|--------|
| Catalog | `src/data/products.ts` |
| Pack pricing | `src/data/packs.ts` |
| Homepage story photos | `src/data/story.ts` |
| Product images | `public/products/` |

### Rules of thumb

1. **Hide** products with `available: false` — do not delete unless asked.
2. **Prices:** $8 no toppings · $8.75 with toppings.
3. **Checkout** already reads `availableProducts` — no API changes for menu-only edits.
4. **Images:** paths start with `/products/...` (files under `public/products/`).
5. Optional **`images: []`** = extra photos in the product modal gallery.
6. Prefer small diffs; do not refactor unrelated checkout/tax/email code for a menu change.

### After a menu edit

- Confirm TypeScript still builds if you changed types.
- Spot-check `/` menu and `/order` product dropdown.

## Stripe

- Dual keys + mode: `STRIPE_LIVE_MODE` / `NEXT_PUBLIC_STRIPE_LIVE_MODE` (`false` = test).
- Helpers: `src/lib/stripe-mode.ts`, `src/lib/stripe.ts`.
- Never commit real secrets; use `.env.local` / Vercel env only.

## Tax

- Checkout tax: **Stripe Tax** via `src/lib/tax.ts` (pickup address Haymarket, VA).
- Cart estimate (client): `src/lib/tax-rate.ts` (6% VA) — final amount always from Stripe Tax.
- PaymentIntent amount = subtotal + tax; calculation id linked for Stripe Tax reporting.
- Client finished VA registration — test + live tax calculations return 6.0% (`standard_rated`).
- Do not charge without a successful `stripe.tax.calculations.create` (fail closed).

## Email

- Resend after pay: `src/lib/email.ts` + `src/lib/order-notify.ts`.
- Requires `RESEND_API_KEY` in the environment.
