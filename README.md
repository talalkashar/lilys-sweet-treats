# Lily’s Sweet Treats & More

**Live:** https://www.lilyssweettreatsva.com  
**Repo:** https://github.com/talalkashar/lilys-sweet-treats  

Homemade bakery site — pre-order + porch pickup (Haymarket, VA).  
Stack: Next.js · Stripe (payments + Tax) · Resend (emails) · Vercel.

---

## Start here (client / owner)

| Doc | Who |
|-----|-----|
| **[CLIENT-HANDOFF.md](./CLIENT-HANDOFF.md)** | Full access checklist: GitHub, Vercel, Stripe, Resend, domain |
| **[PRODUCT-MENU.md](./PRODUCT-MENU.md)** | Change menu, prices, photos without an admin panel |
| **[CODEX-FOR-CLIENT.md](./CODEX-FOR-CLIENT.md)** | Teach Codex / AI editing in one session |
| **[AGENTS.md](./AGENTS.md)** | Rules for AI coding agents |

---

## Local dev

```bash
cp .env.example .env.local   # fill keys (prefer Stripe *test*)
./start.sh                   # or npm run dev
```

Open http://localhost:3000  

Keep **`STRIPE_LIVE_MODE=false`** locally so you don’t charge real cards while testing.

---

## Production

- Hosted on **Vercel** project `lilys-sweet-treats`  
- Push to **`main`** → auto deploy  
- Production uses **Stripe live** + VA sales tax  

---

## Menu source of truth

`src/data/products.ts` — hide with `available: false`, prices $8 / $8.75, packs in `src/data/packs.ts`.
