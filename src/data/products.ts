export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  emoji: string;
  category: "rolls" | "sticky" | "specialty";
  /** Path under /public */
  image?: string;
  popular?: boolean;
  /**
   * When false, product stays in the catalog data for later but is hidden
   * from the menu, order form, and checkout validation.
   * Default: true (available).
   */
  available?: boolean;
  /** Main ingredients for customer transparency */
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
 * Full menu. Prices are placeholders until confirmed.
 * Ingredients are product-specific (major components only).
 * Weekly specials may vary slightly.
 */
export const products: Product[] = [
  // Yeasted cinnamon dough + fruit filling + frosting
  {
    id: "apple-caramel-cinnamon-rolls",
    name: "Apple Caramel Cinnamon Rolls",
    price: 6,
    category: "rolls",
    description: "Warm apple, rich caramel, and soft cinnamon dough.",
    emoji: "🍎",
    image: "/products/apple-caramel-cinnamon-rolls.png",
    ingredients: [
      "Flour",
      "Yeast",
      "Eggs",
      "Butter",
      "White sugar",
      "Brown sugar",
      "Cinnamon",
      "Apples",
      "Caramel",
      "Cornstarch",
      "Cream cheese powder",
    ],
  },
  // Same dough family; peach filling instead of apple/caramel
  {
    id: "peach-cobbler-cinnamon-rolls",
    name: "Peach Cobbler Cinnamon Rolls",
    price: 6,
    category: "rolls",
    description: "Peach cobbler flavor in a soft cinnamon roll.",
    emoji: "🍑",
    image: "/products/peach-cobbler-cinnamon-rolls.png",
    ingredients: [
      "Flour",
      "Yeast",
      "Eggs",
      "Butter",
      "White sugar",
      "Brown sugar",
      "Cinnamon",
      "Peaches",
      "Cornstarch",
      "Cream cheese powder",
    ],
  },
  // Sticky bun: caramel glaze + nuts (no cream cheese frosting)
  {
    id: "sticky-buns-with-nuts",
    name: "Sticky Buns with Nuts",
    price: 6,
    category: "sticky",
    description: "Caramel glaze topped with toasted nuts.",
    emoji: "🥜",
    image: "/products/sticky-bun-with-nuts.png",
    ingredients: [
      "Flour",
      "Yeast",
      "Eggs",
      "Butter",
      "White sugar",
      "Brown sugar",
      "Cinnamon",
      "Caramel",
      "Nuts",
    ],
  },
  {
    id: "sticky-buns-without-nuts",
    name: "Sticky Buns without Nuts",
    price: 5,
    category: "sticky",
    description: "Classic sticky bun and caramel, no nuts.",
    emoji: "🌀",
    image: "/products/sticky-bun-no-nuts.png",
    ingredients: [
      "Flour",
      "Yeast",
      "Eggs",
      "Butter",
      "White sugar",
      "Brown sugar",
      "Cinnamon",
      "Caramel",
    ],
  },
  // Cake + frosting ball (no yeast / fruit)
  // Kept in data for later — not currently selling
  {
    id: "cake-pops",
    name: "Cake Pop Bouquet",
    price: 35,
    category: "specialty",
    description: "Pastel cake pops arranged as a gift bouquet.",
    emoji: "🍭",
    image: "/products/cake-pops.png",
    available: false,
    ingredients: [
      "Flour",
      "Eggs",
      "Butter",
      "White sugar",
      "Brown sugar",
      "Cream cheese powder",
      "Cornstarch",
    ],
  },
  // Shortbread-style cookie + dulce de leche (cornstarch is classic here)
  // Kept in data for later — not currently selling
  {
    id: "alfajores",
    name: "Alfajores",
    price: 16,
    category: "specialty",
    description: "Buttery cookies filled with dulce de leche.",
    emoji: "🍪",
    image: "/products/alfajores.png",
    available: false,
    ingredients: [
      "Flour",
      "Cornstarch",
      "Butter",
      "White sugar",
      "Eggs",
      "Caramel",
    ],
  },
];

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
