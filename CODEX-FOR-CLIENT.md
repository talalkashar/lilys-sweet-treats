# Teaching the client: Codex + this bakery site

Short script you can follow while screen-sharing with Lily (or any non-developer owner).

---

## Goal of the session (30–45 min)

By the end she can:

1. Open the GitHub repo  
2. Open the project in Codex (or Cursor / Claude Code)  
3. Ask the AI to **hide** or **add** a menu item  
4. See the change go live on https://www.lilyssweettreatsva.com  

---

## Before the call (you / Talal)

- [ ] She’s a **GitHub collaborator** (done)  
- [ ] **Vercel** invite accepted (`vercel teams invite her@email`)  
- [ ] She can log into **Stripe** (Owner or Admin)  
- [ ] She can log into **Resend** (or knows emails still work)  
- [ ] Repo has `CLIENT-HANDOFF.md` + `PRODUCT-MENU.md` on `main`  

---

## Session outline

### 1. Map of the system (5 min)

Draw this simply:

```text
GitHub (code + photos)
    ↓ push main
Vercel (hosts website)
    ↓
www.lilyssweettreatsva.com

Stripe  = money + tax
Resend  = emails after pay
```

She does **not** FTP upload. She changes GitHub → site updates.

### 2. GitHub tour (5 min)

1. Open https://github.com/talalkashar/lilys-sweet-treats  
2. Show `PRODUCT-MENU.md` — “this is the menu instruction manual”  
3. Show `src/data/products.ts` — “this is the actual menu”  
4. Show `public/products/` — “photos live here”

### 3. Codex setup (10 min)

1. Install / open Codex (or Cursor).  
2. Clone or open the repo folder.  
3. Paste this **system** prompt once:

```text
You are helping with Lily's Sweet Treats (Haymarket VA porch pickup bakery).
Read CLIENT-HANDOFF.md, PRODUCT-MENU.md, and AGENTS.md first.

Rules:
- Menu = src/data/products.ts + public/products/ images.
- Hide with available: false (don't delete unless I say).
- $8 plain, $8.75 topped.
- Never commit secrets or .env files.
- Prefer explaining what you'll change before editing.
- After changes, commit and push to main so Vercel deploys (when I ask).
```

### 4. Practice task A — hide a product (10 min)

Prompt:

```text
Hide "Sticky Buns with Nuts" from the menu this week using available: false.
Show me the diff, then commit and push to main.
```

Then:

1. Open Vercel → Deployments → wait for green.  
2. Open live site → Menu → confirm it’s gone.

### 5. Practice task B — unhide (5 min)

```text
Show Sticky Buns with Nuts again (available true or remove available line). Commit and push.
```

### 6. Practice task C — change a price (optional)

```text
Confirm strawberry and peach are $8.75 and sticky without nuts is $8. Don't change if already correct.
```

### 7. Boundaries (5 min)

Tell her **not** to ask Codex for:

- Deleting the whole repo  
- Changing Stripe secret keys in chat  
- Force push / rewrite history  
- Turning off tax  

Tell her **to** ask Codex for:

- Menu / photos / copy / “hide this flavor”  
- “Why did deploy fail?” (paste Vercel error)  
- “Update story photo to this new JPG”

### 8. Where money lives (2 min)

- **Stripe Dashboard** = orders paid, tax, bank payouts  
- Site only **starts** the payment; Stripe holds the money  

### 9. Homework for her

1. Accept all invites (GitHub, Vercel, Stripe, Resend).  
2. Bookmark CLIENT-HANDOFF.md on GitHub.  
3. Next week: hide one seasonal flavor herself with Codex.

---

## Copy/paste prompts library

**Weekly menu reset**

```text
Read products.ts. List every product with price and available status in a table. Ask me which to hide this week before editing.
```

**Add new flavor**

```text
I added public/products/NAME.jpg. Create a new product in products.ts at $8.75 under rolls, with a short description, and commit.
```

**Safe deploy**

```text
Commit all menu changes with a clear message and push to main. Do not change env or tax code.
```

**Something broken**

```text
Don't deploy. Explain what might be wrong. Check recent changes to products.ts and checkout only if needed.
```

---

## If she only wants the menu, not code

She can still:

1. Message you / Codex with a photo + “add this as Peach…”  
2. Or edit only `products.ts` on GitHub.com in the browser (Edit button → Commit to main).

Codex is optional power; GitHub + PRODUCT-MENU.md is enough for simple hides.
