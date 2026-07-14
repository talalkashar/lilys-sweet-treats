/** Business details. Update anytime. */
export const site = {
  name: "Lily's Sweet Treats & More",
  shortName: "Lily's Sweet Treats",
  tagline: "Homemade treats, made with love",
  description:
    "Pre-order online and pick up in person. Fresh baked goods for porch pickup in Haymarket, VA. No delivery.",
  logo: "/brand/logo.png",
  /** Full brand board for large display (hero) */
  logoFull: "/brand/logo-full.png",
  pattern: "/brand/pattern.png",
  phone: "(571) 788-6168",
  email: "sweettreats0077@gmail.com",
  instagram: "",
  /** Pickup address */
  address: {
    line1: "14658 Gap Way",
    line2: "PO Box #237",
    city: "Haymarket",
    state: "VA",
    zip: "20169",
  },
  /** Single-line for forms / Stripe metadata */
  addressLine: "14658 Gap Way, PO Box #237, Haymarket, VA 20169",
  locationNote:
    "Porch pickup in Haymarket, VA. Address is listed below for orders.",
  pickupNote: "Porch pickup only. We do not offer delivery.",
  leadTime: "Please order at least 24 hours in advance when possible.",
  /** Rotating menu messaging */
  menuNote:
    "New flavors drop every week. The menu is flexible and changes with the season, so check back often.",
  menuNoteShort: "New treats every week. Menu rotates.",
  pickupWindows: [
    "Friday 4:00 to 6:00 PM",
    "Saturday 9:00 AM to 12:00 PM",
    "Saturday 1:00 to 3:00 PM",
    "Other (we'll confirm by text)",
  ],
} as const;

/** Google Maps search URL for the pickup address */
export function mapsUrl() {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.addressLine)}`;
}
