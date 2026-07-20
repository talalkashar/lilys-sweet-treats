/**
 * Homepage “From our kitchen” collage + kitchen strip.
 *
 * Photos are pure iCloud shoot exports (*-v3.jpg), resized for web only.
 * Layout: tall main left + two 3:2 tiles stacked right.
 */
export const storyPhotos = [
  {
    // Tall left tile — portrait tray from shoot (DSC07080)
    src: "/brand/story/tray-rolls-v3.jpg",
    alt: "Fresh tray of strawberry cinnamon rolls just out of the oven",
    slot: "main" as const,
  },
  {
    // Top right — fresh trays
    src: "/brand/story/fresh-trays-v3.jpg",
    alt: "Fresh trays of cinnamon rolls just out of the oven",
    slot: "wide" as const,
  },
  {
    // Bottom right — packaged order
    src: "/brand/story/packaged-v3.jpg",
    alt: "Order packaged with Made with Care band and Lily’s Sweet Treats sticker",
    slot: "wide" as const,
  },
];

export const kitchenStripPhotos = [
  {
    src: "/brand/kitchen/crumb-tray-v3.jpg",
    alt: "Tray of fresh baked cinnamon rolls",
  },
  {
    src: "/brand/kitchen/fruit-tray-v3.jpg",
    alt: "Fruit swirl cinnamon rolls fresh from the oven",
  },
  {
    src: "/brand/kitchen/two-flavors-v3.jpg",
    alt: "Peach cobbler and strawberry cinnamon rolls ready for pickup",
  },
  {
    src: "/brand/kitchen/branded-box-v3.jpg",
    alt: "Packaged treats with Lily’s Sweet Treats thank-you sticker",
  },
];
