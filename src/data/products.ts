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

/** Menu items. Prices are placeholders until confirmed. */
export const products: Product[] = [
  {
    id: "cake-pops",
    name: "Cake Pop Bouquet",
    price: 35,
    description:
      "A gift arrangement of pastel cake pops with florals. Perfect for birthdays, showers, and celebrations.",
    emoji: "🍭",
    image: "/products/cake-pops.png",
  },
  {
    id: "alfajores",
    name: "Alfajores",
    price: 16,
    description:
      "Buttery sandwich cookies filled with rich dulce de leche and dusted with powdered sugar. Soft, sweet, and classic.",
    emoji: "🍪",
    image: "/products/alfajores.jpg",
  },
  {
    id: "sticky-bun-pecan",
    name: "Sticky Bun (Pecan)",
    price: 6,
    description:
      "Gooey caramel sticky bun topped with toasted pecans and a touch of sea salt. Warm bakery comfort.",
    emoji: "🌀",
    image: "/products/sticky-bun-with-nuts.jpg",
  },
  {
    id: "sticky-bun-classic",
    name: "Sticky Bun (Classic)",
    price: 5,
    description:
      "Soft cinnamon sticky bun glazed in shiny caramel, with no nuts. Simple and delicious.",
    emoji: "🍩",
    image: "/products/sticky-bun-no-nuts.jpg",
  },
];
