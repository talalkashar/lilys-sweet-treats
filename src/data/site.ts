/** Business details. Update anytime. */
export const site = {
  name: "Lily's Sweet Treats",
  shortName: "Lily's Sweet Treats",
  tagline: "Homemade treats, made with love",
  /**
   * Meta / search description only (Google, social previews).
   * Not the on-page marketing copy.
   */
  description:
    "Homemade bakery in Gainesville, VA. Pre-order cinnamon rolls, sticky buns, and sweet treats online for pickup at Atlas Walk Friday and Saturday.",
  /**
   * Search + social title focus (shorter than legal/display name).
   * Used in default <title> / Open Graph where we want a cleaner result.
   */
  searchTitle: "Lily's Sweet Treats | Homemade Bakery in Gainesville, VA",
  /**
   * Canonical production origin (www). Apex redirects here via Vercel.
   * Used for sitemap, robots, metadataBase, Open Graph, and JSON-LD.
   */
  url: "https://www.lilyssweettreatsva.com",
  logo: "/brand/logo-badge.png",
  /** Full brand board for large display (hero) */
  logoFull: "/brand/logo-badge.png",
  /**
   * Primary image for Google / Open Graph / link previews.
   * Square 1200×1200 food photo (same pattern as FORGE) so LinkedIn
   * auto-pulls a real thumbnail for Experience / share cards.
   */
  // Root path is easiest for LinkedIn/crawlers (same idea as a dedicated OG asset)
  ogImage: "/og.jpg",
  /** Purple cupcake wall — sitewide texture */
  pattern: "/brand/pattern.png",
  /** Soft line-art cupcakes for lighter section washes */
  patternSoft: "/brand/backgrounds/cupcake-pattern-soft.png",
  /** Client banner: “Baked with love just for you!” */
  loveBanner: "/brand/backgrounds/baked-with-love.png",
  phone: "(571) 788-6168",
  email: "sweettreats0077@gmail.com",
  instagram: "https://www.instagram.com/lilys_sweet_treats_va/",
  /**
   * Public plaza meetup (not a home address).
   * Shown on the order page, confirmation screen, and emails.
   */
  address: {
    line1: "Atlas Walk Way",
    city: "Gainesville",
    state: "VA",
    zip: "20155",
  },
  /** Single-line for forms / Stripe metadata / confirmation emails */
  addressLine: "Atlas Walk Way, Gainesville / Haymarket, VA 20155",
  locationNote: "Pickup at Atlas Walk Way, Gainesville / Haymarket, VA.",
  /** Short header tagline (CSS uppercases this) */
  headerTagline: "Atlas Walkway · Gainesville / Haymarket",
  pickupNote:
    "Meet us at Atlas Walk Way in Gainesville / Haymarket on Friday and Saturday. See weekly schedule for times.",
  pickupCoordinateNote:
    "Text or call after you pay so we can coordinate the exact meetup at Atlas Walk Way, Gainesville / Haymarket.",

  /** Weekly baking schedule */
  qualityNote:
    "Every treat is homemade in small batches using fresh ingredients to ensure the best quality and flavor.",
  orderingWindow: "Monday through Wednesday at 12:00 PM",
  orderingClosesLabel: "Wednesday (12:00 PM)",
  orderingClosesNote:
    "Pre-orders close promptly at noon so we can source the freshest ingredients and bake every order fresh for pickup and delivery.",
  leadTime:
    "Orders are accepted Monday through Wednesday by 12:00 PM. Pre-orders close Wednesday at noon.",
  howToOrder:
    "Browse our available treats and place your order directly through our website. If you have any questions or special requests, feel free to contact us.",
  thankYouNote:
    "Thank you for supporting Lily's Sweet Treats! Every order is baked fresh with care, and we can't wait to make something sweet for you.",

  /** Rotating menu messaging */
  menuNote:
    "New flavors drop every week. Order Monday–Wednesday by noon for this week's Friday or Saturday pickup.",
  menuNoteShort: "Order Mon–Wed by noon. Menu rotates weekly.",

  /** Official pickup windows (validated on checkout) */
  pickupWindows: [
    "Friday 4:00 PM – 6:00 PM",
    "Saturday 9:00 AM – 11:00 AM",
  ],

  /**
   * Pack checkout only (2 / 4 / 6 / 8 / 12). Kept for copy fallbacks.
   * Real pack definitions live in `src/data/packs.ts`.
   */
  minOrderQuantity: 2,
  maxOrderQuantity: 12,
} as const;

/** Google Maps search URL for the plaza pickup address */
export function mapsUrl() {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.addressLine)}`;
}
