/** Business details — update these anytime */
export const site = {
  name: "Lily's Sweet Treats",
  tagline: "Homemade treats, made with love",
  description:
    "Pre-order online and pick up in person. Fresh baked goods for porch pickup — no delivery.",
  // Update when she provides real info
  phone: "(555) 000-0000",
  email: "hello@lilyssweettreats.com",
  instagram: "", // e.g. https://instagram.com/lilyssweettreats
  locationNote: "Local porch pickup — exact address shared after you order",
  pickupNote: "Porch pickup only. We do not offer delivery.",
  leadTime: "Please order at least 24 hours in advance when possible.",
  pickupWindows: [
    "Friday 4:00–6:00 PM",
    "Saturday 9:00 AM–12:00 PM",
    "Saturday 1:00–3:00 PM",
    "Other (we'll confirm by text)",
  ],
} as const;
