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
    blurb: "Soft rolls with seasonal fillings.",
  },
  {
    id: "sticky",
    title: "Sticky buns",
    blurb: "Caramel glazed. With nuts or without.",
  },
  {
    id: "specialty",
    title: "Specialty treats",
    blurb: "Giftable favorites beyond the rolls.",
  },
];

/**
 * Full menu. Prices are placeholders until confirmed.
 * Some photos are stand-ins until dedicated shots arrive.
 */
export const products: Product[] = [
  // Cinnamon rolls
  {
    id: "apple-caramel-cinnamon-rolls",
    name: "Apple Caramel Cinnamon Rolls",
    price: 6,
    category: "rolls",
    description: "Warm apple, rich caramel, and soft cinnamon dough.",
    emoji: "🍎",
    image: "/products/apple-caramel-cinnamon-rolls.png",
  },
  {
    id: "peach-cobbler-cinnamon-rolls",
    name: "Peach Cobbler Cinnamon Rolls",
    price: 6,
    category: "rolls",
    description: "Peach cobbler flavor in a soft cinnamon roll.",
    emoji: "🍑",
    image: "/products/peach-cobbler-cinnamon-rolls.png",
  },
  // Sticky buns
  {
    id: "sticky-buns-with-nuts",
    name: "Sticky Buns with Nuts",
    price: 6,
    category: "sticky",
    description: "Caramel glaze topped with toasted nuts.",
    emoji: "🥜",
    image: "/products/sticky-bun-with-nuts.png",
  },
  {
    id: "sticky-buns-without-nuts",
    name: "Sticky Buns without Nuts",
    price: 5,
    category: "sticky",
    description: "Classic sticky bun and caramel, no nuts.",
    emoji: "🌀",
    image: "/products/sticky-bun-no-nuts.png",
  },
  // Specialty (kept on the menu)
  {
    id: "cake-pops",
    name: "Cake Pop Bouquet",
    price: 35,
    category: "specialty",
    description: "Pastel cake pops arranged as a gift bouquet.",
    emoji: "🍭",
    image: "/products/cake-pops.png",
  },
  {
    id: "alfajores",
    name: "Alfajores",
    price: 16,
    category: "specialty",
    description: "Buttery cookies filled with dulce de leche.",
    emoji: "🍪",
    image: "/products/alfajores.png",
  },
];

export function productsInCategory(categoryId: Product["category"]) {
  return products.filter((p) => p.category === categoryId);
}
