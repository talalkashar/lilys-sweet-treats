# Menu & product guide (Lily’s Sweet Treats)

This site is set up so **you or an AI agent** can change the menu by editing a few files and committing to GitHub. You do **not** need a custom admin panel.

## The only files that matter

| What you want to change | File |
|-------------------------|------|
| **Add / hide / rename / reprice products** | `src/data/products.ts` |
| **Pack sizes & pack discounts** | `src/data/packs.ts` |
| **Story photos + kitchen strip photos** | `src/data/story.ts` |
| **Product image files** | `public/products/` |
| **Story / kitchen image files** | `public/brand/story/` · `public/brand/kitchen/` |

Checkout, tax, and email **automatically** use whatever is listed as available in `products.ts`. No other code changes needed for a normal menu update.

---

## Pricing rules (keep consistent)

| Type | Unit price |
|------|------------|
| No toppings (e.g. sticky bun without nuts) | **$8** |
| With toppings (frosting, fruit, nuts, etc.) | **$8.75** |

Customers buy **packs only** (4 / 8 / 12) — defined in `src/data/packs.ts`.

---

## Hide a product (soft delete — recommended)

In `src/data/products.ts`, find the product and set:

```ts
available: false,
```

It stays in the file for later but **disappears** from:

- homepage menu  
- order form  
- checkout validation  

To put it back: set `available: true` or **delete** the `available` line.

### Example — hide sticky buns with nuts this week

```ts
{
  id: "sticky-buns-with-nuts",
  // ...
  available: false,
},
```

---

## Show a paused product again

Find the product (e.g. Apple Caramel) and either:

- change `available: false` → `available: true`, or  
- remove the `available` line entirely.

---

## Add a new product

### 1. Add photo(s) under `public/products/`

Use clear names:

```text
public/products/blueberry-cinnamon-rolls.jpg      ← main card photo
public/products/blueberry-cinnamon-rolls-2.jpg    ← optional gallery
public/products/blueberry-cinnamon-rolls-3.jpg
```

Tips:

- Prefer **JPG** ~1200–1600px wide  
- Keep files under ~300KB if possible  
- Path in code starts with `/products/...` (the `public` folder is the web root)

### 2. Copy a product block in `src/data/products.ts`

```ts
{
  id: "blueberry-cinnamon-rolls",           // unique, lowercase, hyphens
  name: "Blueberry Cinnamon Rolls",
  price: 8.75,                              // 8 or 8.75
  category: "rolls",                        // "rolls" | "sticky" | "specialty"
  description: "Soft rolls with blueberry filling and cream cheese frosting.",
  emoji: "🫐",
  image: "/products/blueberry-cinnamon-rolls.jpg",
  images: [
    "/products/blueberry-cinnamon-rolls-2.jpg",
    "/products/blueberry-cinnamon-rolls-3.jpg",
  ],
  ingredients: ["Blueberries", "Cream cheese frosting", "Cinnamon"],
  // available: false,   // uncomment to draft without selling yet
},
```

### 3. Commit & push (or open a PR)

After deploy, the product appears on the menu and in the order form.

---

## Permanently remove a product

1. Prefer `available: false` first (safer).  
2. To fully delete: remove the whole `{ ... },` block from `products` **and** delete unused images from `public/products/`.

Do **not** change an `id` after people may have linked `/order?product=that-id`.

---

## Product fields (cheat sheet)

| Field | Required | Meaning |
|-------|----------|---------|
| `id` | yes | Stable key for URLs & checkout |
| `name` | yes | Label customers see |
| `price` | yes | Unit $ (8 or 8.75) |
| `category` | yes | `rolls` · `sticky` · `specialty` |
| `description` | yes | Short blurb |
| `emoji` | yes | Fallback if image missing |
| `image` | recommended | Main photo |
| `images` | optional | Extra photos in the product popup |
| `ingredients` | yes | “Made with” chips (can be `[]`) |
| `available` | optional | `false` hides it |
| `popular` | optional | Highlight if UI uses it |

---

## Categories

Edit section titles in `menuCategories` in the same file if needed:

- `rolls` → Cinnamon rolls  
- `sticky` → Sticky buns  
- `specialty` → Specialty treats  

---

## Story & kitchen photos (homepage layout stays the same)

| List | File | Used for |
|------|------|----------|
| `storyPhotos` | `src/data/story.ts` | 3-photo story grid |
| `kitchenStripPhotos` | `src/data/story.ts` | Horizontal “Baked this week” strip |

Swap `src` / `alt` only — no layout code required.

---

## Prompt for an AI agent (copy/paste)

```text
Read PRODUCT-MENU.md and src/data/products.ts.

Task: [describe change, e.g. "Hide sticky buns with nuts" or
"Add Lemon Cinnamon Rolls at $8.75 with image public/products/lemon-cinnamon-rolls.jpg"].

Rules:
- Only edit products.ts / story.ts / public images unless something is broken.
- Use available: false to hide; don't delete unless asked.
- Topped treats $8.75, plain $8.
- Keep product ids URL-safe and stable.
- Run a quick build check if you change TypeScript.
```

---

## Current live-style menu (for humans)

| Product | Price | Status |
|---------|-------|--------|
| Strawberry Cinnamon Rolls | $8 | On menu |
| Peach Cobbler Cinnamon Rolls | $8.75 | On menu |
| Sticky Buns with Nuts | $8.75 | On menu |
| Sticky Buns without Nuts | $8 | On menu |
| Apple Caramel Cinnamon Rolls | $8.75 | Hidden (`available: false`) |
| Cake pops / Alfajores | — | Hidden |

Update this table when you change the menu so the next person stays oriented.
