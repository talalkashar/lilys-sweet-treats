export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  emoji: string;
  /** Path under /public */
  image?: string;
  popular?: boolean;
};

/**
 * Live menu. Prices are placeholders until confirmed.
 * Photos: sticky bun shots used for rolls until dedicated product photos arrive.
 */
export const products: Product[] = [
  {
    id: "apple-caramel-cinnamon-rolls",
    name: "Apple Caramel Cinnamon Rolls",
    price: 6,
    description:
      "Soft cinnamon rolls with warm apple and rich caramel. Sweet, gooey, and made to order for pickup.",
    emoji: "🍎",
    image: "/products/sticky-bun-no-nuts.jpg",
  },
  {
    id: "peach-cobbler-cinnamon-rolls",
    name: "Peach Cobbler Cinnamon Rolls",
    price: 6,
    description:
      "Cinnamon rolls inspired by peach cobbler. Soft dough, peach flavor, and a bakery finish you will want again.",
    emoji: "🍑",
    image: "/products/sticky-bun-with-nuts.jpg",
  },
  {
    id: "sticky-buns-with-nuts",
    name: "Sticky Buns with Nuts",
    price: 6,
    description:
      "Classic sticky buns with caramel glaze and toasted nuts. Gooey, crunchy, and baked fresh for pickup.",
    emoji: "🥜",
    image: "/products/sticky-bun-with-nuts.jpg",
  },
  {
    id: "sticky-buns-without-nuts",
    name: "Sticky Buns without Nuts",
    price: 5,
    description:
      "Same soft sticky bun and shiny caramel glaze, with no nuts. Simple and delicious.",
    emoji: "🌀",
    image: "/products/sticky-bun-no-nuts.jpg",
  },
];
