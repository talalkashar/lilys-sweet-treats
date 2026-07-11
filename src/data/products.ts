export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  /** Emoji placeholder until real photos are added */
  emoji: string;
  popular?: boolean;
};

/** Starting menu — swap names/prices/photos when Lily sends them */
export const products: Product[] = [
  {
    id: "cupcakes-half-dozen",
    name: "Cupcakes (Half Dozen)",
    price: 18,
    description:
      "Six soft cupcakes with buttercream. Choose classic vanilla, chocolate, or mixed.",
    emoji: "🧁",
    popular: true,
  },
  {
    id: "cookie-box",
    name: "Cookie Box",
    price: 15,
    description:
      "A dozen assorted cookies — chocolate chip, sugar, and seasonal favorites.",
    emoji: "🍪",
  },
  {
    id: "celebration-cake",
    name: "Celebration Cake (6\")",
    price: 45,
    description:
      "Small round cake, perfect for birthdays and get-togethers. Custom message available.",
    emoji: "🎂",
    popular: true,
  },
];
