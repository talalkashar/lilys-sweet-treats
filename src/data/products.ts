/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MENU / PRODUCT CATALOG — edit this file to add, hide, or change products.
 * Full how-to for humans + AI agents: PRODUCT-MENU.md (repo root)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Pricing (unit, each treat):
 *   - No toppings → $8
 *   - With toppings → $8.75
 * Sold in packs only (4 / 8 / party tray 12) — see src/data/packs.ts
 *
 * Quick actions:
 *   - HIDE a product: set available: false  (keeps data for later)
 *   - SHOW a product: set available: true or delete the available field
 *   - ADD a product: copy a block below, change id/name/price/images
 *   - Images live in public/products/  (path starts with /products/...)
 */

export type Product = {
  /**
   * Stable URL-safe id. Used in /order?product=… and checkout.
   * Example: "strawberry-cinnamon-rolls"
   * Do not change after customers may have bookmarked it.
   */
  id: string;
  /** Display name on menu + order form */
  name: string;
  /** Unit price in dollars (e.g. 8 or 8.75) */
  price: number;
  /** Set false to hide the per-treat price while retaining pack calculations */
  showUnitPrice?: boolean;
  description: string;
  emoji: string;
  /** Which menu section: rolls | sticky | specialty */
  category: "rolls" | "sticky" | "specialty";
  /**
   * Main card/list image — path under /public
   * Example: "/products/strawberry-cinnamon-rolls.jpg"
   */
  image?: string;
  /**
   * Extra photos for the product modal gallery (optional).
   * Main `image` is always shown first; do not duplicate it here.
   */
  images?: string[];
  popular?: boolean;
  /**
   * false = hidden from menu, order form, and checkout (soft delete).
   * true or omitted = for sale.
   */
  available?: boolean;
  /**
   * Standout flavors only (not flour/eggs/butter).
   * Shown as “Made with” chips in the modal.
   */
  ingredients: string[];
};

export type MenuCategory = {
  id: Product["category"];
  title: string;
  blurb: string;
};

/** Category order for the menu page */
export const menuCategories: MenuCategory[] = [
  {
    id: "rolls",
    title: "Cinnamon rolls",
    blurb: "Soft rolls with rotating seasonal fillings.",
  },
  {
    id: "sticky",
    title: "Sticky buns",
    blurb: "Caramel glazed. With nuts or without. Flavors change often.",
  },
  {
    id: "specialty",
    title: "Specialty treats",
    blurb: "Giftable favorites, with new specials mixed in weekly.",
  },
];

/**
 * Full menu catalog.
 * Order here = order on the menu (within each category section).
 */
export const products: Product[] = [
  // ── Cinnamon rolls (topped $8.75) ────────────────────────────────────────
  {
    id: "strawberry-cinnamon-rolls",
    name: "Strawberry Cinnamon Rolls",
    price: 8.75,
    category: "rolls",
    description:
      "Soft cinnamon roll with cream cheese frosting and sweet strawberry jam.",
    emoji: "🍓",
    // Card = best side hero. Gallery = top-down → high → mid → side (no dups).
    // v3 = pure iCloud shoot → Photoshop MCP (auto levels/contrast/bright + warm_film + web export)
    image: "/products/strawberry-main-v4.jpg",
    images: [
      "/products/strawberry-g2-v4.jpg",
      "/products/strawberry-g3-v4.jpg",
      "/products/strawberry-g4-v4.jpg",
      "/products/strawberry-g5-v4.jpg",
    ],
    popular: true,
    ingredients: [
      "Strawberry jam",
      "Cream cheese frosting",
      "Cinnamon",
    ],
  },
  {
    id: "peach-cobbler-cinnamon-rolls",
    name: "Caramel Peach Cobbler Cinnamon Rolls",
    price: 8.75,
    category: "rolls",
    description:
      "Peach cobbler flavor with cream cheese frosting, peach topping, and caramel drizzle.",
    emoji: "🍑",
    // Card = best side hero. Gallery = top-down → mid → 3/4 → side (no dups).
    image: "/products/peach-main-v4.jpg",
    images: [
      "/products/peach-g2-v4.jpg",
      "/products/peach-g3-v4.jpg",
      "/products/peach-g4-v4.jpg",
      "/products/peach-g5-v4.jpg",
    ],
    ingredients: [
      "Peaches",
      "Caramel",
      "Cream cheese frosting",
      "Cinnamon",
    ],
  },
  {
    id: "apple-caramel-cinnamon-rolls",
    name: "Apple Caramel Cinnamon Rolls",
    price: 8.75,
    category: "rolls",
    description: "Warm apple, rich caramel, and soft cinnamon dough.",
    emoji: "🍎",
    image: "/products/apple-caramel-cinnamon-rolls.png",
    // Soft-hidden: not featured this week — set available: true to put back on menu
    available: false,
    ingredients: ["Apples", "Caramel", "Cinnamon", "Cream cheese frosting"],
  },

  // ── Sticky buns ──────────────────────────────────────────────────────────
  {
    id: "sticky-buns-with-nuts",
    name: "Sticky Buns with Nuts",
    price: 8.75,
    showUnitPrice: false,
    category: "sticky",
    description: "Caramel glaze topped with toasted nuts.",
    emoji: "🥜",
    image: "/products/sticky-bun-with-nuts.png",
    ingredients: ["Caramel", "Toasted nuts", "Cinnamon"],
  },
  {
    id: "sticky-buns-without-nuts",
    name: "Sticky Buns without Nuts",
    price: 8,
    showUnitPrice: false,
    category: "sticky",
    description: "Classic sticky bun and caramel, no nuts.",
    emoji: "🌀",
    image: "/products/sticky-bun-no-nuts.png",
    ingredients: ["Caramel", "Cinnamon"],
  },

  // ── Specialty (paused) ───────────────────────────────────────────────────
  {
    id: "cake-pops",
    name: "Cake Pop Bouquet",
    price: 35,
    category: "specialty",
    description: "Pastel cake pops arranged as a gift bouquet.",
    emoji: "🍭",
    image: "/products/cake-pops.png",
    available: false,
    ingredients: ["Cake", "Frosting", "Decorations"],
  },
  {
    id: "alfajores",
    name: "Alfajores",
    price: 16,
    category: "specialty",
    description: "Buttery cookies filled with dulce de leche.",
    emoji: "🍪",
    image: "/products/alfajores.png",
    available: false,
    ingredients: ["Dulce de leche", "Butter cookie"],
  },
];

/** Main image + gallery images (deduped), for product modal */
export function getProductGallery(product: Product): string[] {
  const list: string[] = [];
  if (product.image) list.push(product.image);
  for (const src of product.images ?? []) {
    if (src && !list.includes(src)) list.push(src);
  }
  return list;
}

/** Products customers can see and order right now */
export function isProductAvailable(product: Product) {
  return product.available !== false;
}

export const availableProducts = products.filter(isProductAvailable);

export function productsInCategory(categoryId: Product["category"]) {
  return availableProducts.filter((p) => p.category === categoryId);
}

export function getProduct(id: string) {
  return availableProducts.find((p) => p.id === id);
}

/** Full catalog including paused items (admin / future use) */
export function getProductIncludingUnavailable(id: string) {
  return products.find((p) => p.id === id);
}
