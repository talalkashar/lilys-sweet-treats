export type Review = {
  id: string;
  name: string;
  /** Optional place or context, e.g. "Haymarket" */
  place?: string;
  stars: 5 | 4;
  quote: string;
};

/**
 * Guest reviews for the homepage.
 * Swap these with real customer quotes when you have them.
 */
export const reviews: Review[] = [
  {
    id: "maya",
    name: "Maya R.",
    place: "Haymarket",
    stars: 5,
    quote:
      "Ordered the apple caramel cinnamon rolls for Sunday brunch. They were still soft when we got home and the kids fought over the last one. Already placed another order for next weekend.",
  },
  {
    id: "james",
    name: "James T.",
    place: "Gainesville",
    stars: 5,
    quote:
      "Porch pickup was super easy. Texted when I was there, grabbed the box, done. Sticky buns were honestly better than what I've had at a few bakeries in the area.",
  },
  {
    id: "priya",
    name: "Priya S.",
    place: "Haymarket",
    stars: 5,
    quote:
      "Got the cake pop bouquet for my niece's birthday. She was so excited when she saw it. Looked cute and they actually tasted good, not just pretty for photos.",
  },
  {
    id: "derek",
    name: "Derek M.",
    stars: 5,
    quote:
      "I'm not usually a cinnamon roll person but the peach cobbler ones converted me. Sweet but not too sweet. Will be checking the menu every week now.",
  },
  {
    id: "ana",
    name: "Ana L.",
    place: "Manassas",
    stars: 5,
    quote:
      "The alfajores reminded me of the ones my mom used to buy. Soft cookies, good filling. Ordered a box for work and they disappeared before lunch.",
  },
  {
    id: "chris",
    name: "Chris W.",
    place: "Haymarket",
    stars: 5,
    quote:
      "Friendly and on time. We do sticky buns without nuts for my wife and they never mess that up. Feels like a real home bakery, not a chain.",
  },
];
