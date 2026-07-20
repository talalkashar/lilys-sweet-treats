# Lily’s Sweet Treats — full handoff (for the owner)

This doc is for **you (the bakery owner)** so you can run and update the website without waiting on a developer.  
Share this file + your **GitHub** invite with anyone helping you (or open it with **Codex / Claude / Cursor**).

**Live site:** https://www.lilyssweettreatsva.com  
**Code (GitHub):** https://github.com/talalkashar/lilys-sweet-treats  

---

## What you need access to (checklist)

| # | Service | What it’s for | You should have |
|---|---------|----------------|-----------------|
| 1 | **GitHub** | Edit menu, photos, code | Collaborator on `talalkashar/lilys-sweet-treats` |
| 2 | **Vercel** | Hosts the live site; auto-deploys when you push to GitHub | Member of the project team (invite sent to bakery email if listed) |
| 3 | **Stripe** | Card payments + sales tax | Login to the **business** Stripe account (not a personal test account) |
| 4 | **Resend** | Order confirmation emails | Login or team invite on the Resend account that owns `orders@…` |
| 5 | **Domain** | `lilyssweettreatsva.com` | Access where the domain was bought (GoDaddy, Namecheap, Google Domains, etc.) |

You do **not** need:

- A server password  
- FTP  
- To “upload” files to a host by hand  

Pushing to **GitHub `main`** → Vercel rebuilds → site updates.

---

## 1. GitHub (already a collaborator)

1. Sign in: https://github.com  
2. Open: https://github.com/talalkashar/lilys-sweet-treats  
3. If you don’t see the repo, check email for the **collaborator invite** and accept it.

### Daily menu work (no coding required if you use Codex)

| Change | File |
|--------|------|
| Add / hide / reprice products | `src/data/products.ts` |
| Pack sizes / discounts | `src/data/packs.ts` |
| Story photos | `src/data/story.ts` + `public/brand/story/` |
| Product photos | `public/products/` |

**Full guide:** [PRODUCT-MENU.md](./PRODUCT-MENU.md)

### Optional: transfer ownership later

When you’re ready for the repo to live under **your** GitHub account:

1. Repo → **Settings** → **General** → **Danger zone** → **Transfer ownership**  
2. Type the client GitHub username  
3. Accept the transfer email  

Until then, collaborator access is enough to edit and push.

---

## 2. Vercel (hosting + deploys)

**Dashboard:** https://vercel.com/dashboard  

Project name: **`lilys-sweet-treats`**  
Production URL: https://www.lilyssweettreatsva.com  

### Important: Hobby plan can’t add collaborators

The current Vercel team is on the **Hobby (free)** plan. Vercel does **not** allow inviting other people on Hobby.

**You still get full control** one of these ways:

#### Option A — Transfer project to her Vercel (recommended, free)

1. Client creates a free account at https://vercel.com/signup with **her** email (e.g. bakery Gmail).  
2. She connects **GitHub** to Vercel and accepts the repo collaborator access.  
3. Current owner (Talal): Vercel → **lilys-sweet-treats** → **Settings** → **General** → **Transfer Project** → her team/account.  
4. After transfer, **re-add Environment Variables** on her account (copy from `.env.example` list; get live keys from Stripe/Resend — never email secrets in plain text if you can screen-share into Vercel instead).  
5. Confirm **Domains** still point `lilyssweettreatsva.com` / `www` at the project.  
6. Redeploy Production once.

#### Option B — Upgrade current team to Vercel Pro

Then invite works:

```bash
vercel teams invite her-email@example.com
```

Or Dashboard → Team Settings → Members → Invite.

#### Option C — Temporary (not ideal)

She uses the existing Vercel login with the current owner until transfer is done. Prefer A or B.

### What you can do in Vercel

- See **Deployments** (every GitHub push)  
- Open **Domains** (should show `lilyssweettreatsva.com` + `www`)  
- Open **Settings → Environment Variables** (Stripe, Resend — **don’t delete these**)  
- **Redeploy** if something failed  

### How a change goes live

1. Edit files on GitHub (or with Codex → push).  
2. Wait 1–2 minutes.  
3. Refresh https://www.lilyssweettreatsva.com  

Green check on the latest deployment = good.

---

## 3. Stripe (payments + tax) — **critical**

**Dashboard:** https://dashboard.stripe.com  

Production is in **LIVE mode** (real charges).

### Give the owner access

1. Log in as the **account owner**.  
2. **Settings** → **Team** (or **Business settings → Team**).  
3. **Invite member** with the bakery email.  
4. Role: **Administrator** (or at least can view payments + Tax).  

### What to check monthly

| Item | Where |
|------|--------|
| Payments / payouts | **Payments**, **Balances** |
| Sales tax | **Tax** (Virginia registration must stay active) |
| Webhook | **Developers → Webhooks** → endpoint: `https://www.lilyssweettreatsva.com/api/webhooks/stripe` · event: `payment_intent.succeeded` |
| Test vs Live | Top-right toggle — **Live** for real money |

**Never** paste secret keys (`sk_live_…`) into chat, email, or GitHub. Keys live only in Vercel **Environment Variables**.

---

## 4. Resend (order emails)

**Dashboard:** https://resend.com  

Used for:

- Customer: “You’re all set” confirmation  
- Bakery inbox: new paid order alert  

### Access

1. Owner logs into Resend.  
2. **Team** / invite bakery email.  
3. Confirm domain **lilyssweettreatsva.com** stays **verified**.  
4. API key stays in Vercel as `RESEND_API_KEY` (never commit to GitHub).

**Notify email** (owner alerts): `ORDER_NOTIFY_EMAIL` in Vercel (currently bakery Gmail).

---

## 5. Domain (`lilyssweettreatsva.com`)

- Site traffic is pointed at **Vercel**.  
- Domain registrar is **Third Party** (wherever it was purchased).  
- For full ownership transfer: log into that registrar and either  
  - keep DNS pointed at Vercel, or  
  - transfer the domain into the client’s registrar account.

If the domain account is still under a developer login, **transfer that login or the domain** to the bakery — otherwise renewals can fail.

---

## 6. How to use Codex (or any coding AI) on this site

### Setup (once)

1. Install **VS Code** or **Cursor**, or use **Codex** / **Claude Code** as you prefer.  
2. Clone the repo:

```bash
git clone https://github.com/talalkashar/lilys-sweet-treats.git
cd lilys-sweet-treats
```

3. Open that folder in the editor.  
4. Tell the AI (first message every session):

```text
You are helping with Lily's Sweet Treats bakery site.
Read CLIENT-HANDOFF.md, PRODUCT-MENU.md, and AGENTS.md first.
Rules:
- Prefer localhost before production unless I say deploy.
- Menu changes = src/data/products.ts (+ images under public/products/).
- Never commit .env or secrets.
- Don't force-push or delete the repo.
```

### Example prompts that work well

**Hide a flavor this week:**

```text
Read PRODUCT-MENU.md. Hide sticky buns with nuts from the menu using available: false. Commit with a clear message.
```

**Add a product:**

```text
Add "Lemon Cinnamon Rolls" at $8.75. I put the photo at public/products/lemon-cinnamon-rolls.jpg.
Update products.ts and keep ids URL-safe. Summarize what you changed.
```

**Check tax still works (dev):**

```text
Don't deploy. Explain how Stripe Tax works for porch pickup and what env vars production needs.
```

### Local test (optional)

```bash
cp .env.example .env.local
# fill keys from Vercel (test keys preferred for local)
./start.sh
```

Open http://localhost:3000 — local should stay on **test** Stripe cards unless you intentionally flip live.

### Deploy (production)

After a good change:

```text
Commit and push to main so Vercel deploys production.
```

Or on GitHub: edit file → Commit to `main` → wait for Vercel.

---

## 7. Pricing & tax (don’t break these)

| Rule | Value |
|------|--------|
| Plain (no toppings) | **$8** each |
| Topped | **$8.75** each |
| Packs | 4 / 8 / party tray 12 (`packs.ts`) |
| Sales tax | Stripe Tax, Haymarket VA porch pickup (~6%) |
| Charge amount | **Subtotal + tax** (shown at payment) |

Checkout re-prices on the **server** — customers can’t hack lower prices.

---

## 8. Important pages on the site

| URL | Purpose |
|-----|---------|
| `/` | Home, menu, story |
| `/order` | Checkout |
| `/policies` | Pickup, refunds, allergens |
| `/privacy` | Privacy policy |

---

## 9. Emergency contacts / if something breaks

| Problem | First check |
|---------|-------------|
| Site down | Vercel → Deployments → latest red? Redeploy |
| Card errors | Stripe Live mode, keys in Vercel, Tax still registered in VA |
| No emails | Resend domain verified, `RESEND_API_KEY` in Vercel Production |
| Wrong menu | `products.ts` on GitHub `main` + latest Vercel deploy finished |
| Tax $0 | Stripe → Tax → Virginia registration active |

---

## 10. Transfer “everything” ownership (when ready)

Do these when the client is fully taking over:

1. **GitHub** — transfer repo ownership to her account (Settings → Transfer).  
2. **Vercel** — **Transfer Project** to her account (Hobby can’t invite members). Re-add env vars + domain.  
3. **Stripe** — Settings → Team → invite her as **Admin/Owner** of the **business** Stripe account (this is the money).  
4. **Resend** — invite her or move domain verification under her Resend account; update `RESEND_API_KEY` in Vercel.  
5. **Domain registrar** — transfer `lilyssweettreatsva.com` into her registrar login.  
6. **Rotate secrets** after transfer if anyone else had keys: new Stripe keys + Resend key only in Vercel.

### Env vars production must have (checklist for transfer)

Copy names from [`.env.example`](./.env.example). Production should have:

- `STRIPE_LIVE_MODE=true`  
- `NEXT_PUBLIC_STRIPE_LIVE_MODE=true`  
- `STRIPE_SECRET_KEY_LIVE` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE`  
- `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (live aliases)  
- `STRIPE_SECRET_KEY_TEST` + test publishable (optional, for previews)  
- `RESEND_API_KEY`  
- `EMAIL_FROM`  
- `ORDER_NOTIFY_EMAIL`  
- `STRIPE_WEBHOOK_SECRET` (update webhook in Stripe if URL/project changes)

---

## Quick “first hour” for the owner

1. Accept **GitHub** collaborator invite.  
2. Accept **Vercel** team invite (same email).  
3. Log into **Stripe** (get Owner invite if needed).  
4. Log into **Resend** (or get invite).  
5. Open [PRODUCT-MENU.md](./PRODUCT-MENU.md).  
6. Open the repo in Codex and paste the setup prompt from section 6.  
7. Practice: hide one product → push → confirm it disappears on the live menu after deploy.

You’re in charge of the menu and the business; the stack is GitHub → Vercel → Stripe/Resend.
