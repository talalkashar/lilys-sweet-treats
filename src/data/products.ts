export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  emoji: string;
  /** Path under /public, e.g. /products/cupcakes.jpg */
  image?: string;
  popular?: boolean;
};

/**
 * Menu items.
 * Drop photos into public/products/ then set image: "/products/filename.jpg"
 */
export const products: Product[] = [
  {
    id: "cupcakes-half-dozen",
    name: "Cupcakes (Half Dozen)",
    price: 18,
    description:
      "Six soft cupcakes with buttercream. Choose classic vanilla, chocolate, or mixed.",
    emoji: "🧁",
    image: "/products/1.jpg",
    popular: true,
  },
  {
    id: "cookie-box",
    name: "Cookie Box",
    price: 15,
    description:
      "A dozen assorted cookies — chocolate chip, sugar, and seasonal favorites.",
    emoji: "🍪",
    image: "/products/2.jpg",
  },
  {
    id: "celebration-cake",
    name: "Celebration Cake (6\")",
    price: 45,
    description:
      "Small round cake, perfect for birthdays and get-togethers. Custom message available.",
    emoji: "🎂",
    image: "/products/3.jpg",
    popular: true,
  },
];
