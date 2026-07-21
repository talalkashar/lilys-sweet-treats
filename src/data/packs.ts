/**
 * Pack / tray deals for rolls & sticky buns.
 * Checkout only sells these pack sizes (no one-offs).
 *
 * Pricing = unit price × count − savingsPerTreat × count
 * (server recalculates — never trust the client total).
 */
export type PackDeal = {
  id: string;
  /** How many treats in the pack */
  quantity: number;
  /** Short name on buttons / selects */
  label: string;
  /** Friendlier name for trays */
  displayName: string;
  blurb: string;
  /** Dollars off each treat vs single-unit price */
  savingsPerTreat: number;
  /** Highlight as the party option */
  featured?: boolean;
  /** Limit this deal to specific products; omitted = available for all */
  productIds?: string[];
};

export const packDeals: PackDeal[] = [
  {
    id: "pack-2-sticky-buns-with-nuts",
    quantity: 2,
    label: "2-pack",
    displayName: "2-pack",
    blurb: "A pair of caramel-glazed sticky buns with toasted nuts.",
    savingsPerTreat: 0,
    productIds: ["sticky-buns-with-nuts"],
  },
  {
    id: "pack-2-sticky-buns-without-nuts",
    quantity: 2,
    label: "2-pack",
    displayName: "2-pack",
    blurb: "A pair of classic caramel-glazed sticky buns without nuts.",
    savingsPerTreat: 0,
    productIds: ["sticky-buns-without-nuts"],
  },
  {
    id: "pack-4",
    quantity: 4,
    label: "4-pack",
    displayName: "4-pack",
    blurb: "Small box — perfect for a cozy treat night.",
    savingsPerTreat: 0,
  },
  {
    id: "pack-8",
    quantity: 8,
    label: "8-pack",
    displayName: "8-pack",
    blurb: "Share box — great for the table.",
    savingsPerTreat: 0.5,
  },
  {
    id: "pack-12",
    quantity: 12,
    label: "12-pack",
    displayName: "Party tray",
    blurb: "Party tray — ready for gatherings.",
    savingsPerTreat: 1,
    featured: true,
  },
];

export const defaultPackId = packDeals.find((pack) => !pack.productIds)!.id;

export function packDealsForProduct(productId: string) {
  return packDeals.filter(
    (pack) => !pack.productIds || pack.productIds.includes(productId),
  );
}

export function getPackDeal(
  id: string | null | undefined,
  productId?: string,
) {
  if (!id) return undefined;
  return packDeals.find(
    (pack) =>
      pack.id === id &&
      (!pack.productIds ||
        (Boolean(productId) && pack.productIds.includes(productId!))),
  );
}

export function getPackByQuantity(quantity: number, productId?: string) {
  return packDeals.find(
    (pack) =>
      pack.quantity === quantity &&
      (!pack.productIds ||
        (Boolean(productId) && pack.productIds.includes(productId!))),
  );
}

/** Full unit × qty before pack savings */
export function packFullPrice(unitPrice: number, pack: PackDeal) {
  return unitPrice * pack.quantity;
}

/** Dollars saved on this pack */
export function packSavings(unitPrice: number, pack: PackDeal) {
  return Math.min(
    packFullPrice(unitPrice, pack) - pack.quantity, // never below $1/treat
    Math.max(0, pack.savingsPerTreat) * pack.quantity,
  );
}

/** Final pack price in dollars (2-decimal safe via cents helpers) */
export function packPriceDollars(unitPrice: number, pack: PackDeal) {
  return packPriceCents(unitPrice, pack) / 100;
}

export function packPriceCents(unitPrice: number, pack: PackDeal) {
  const fullCents = Math.round(unitPrice * 100) * pack.quantity;
  const saveCents = Math.round(pack.savingsPerTreat * 100) * pack.quantity;
  // Keep at least $1 per treat as a floor
  const minCents = pack.quantity * 100;
  return Math.max(minCents, fullCents - saveCents);
}

/** Lowest pack total for a product (for “from $X” labels) */
export function startingPackPrice(unitPrice: number, productId?: string) {
  const deals = productId
    ? packDealsForProduct(productId)
    : packDeals.filter((pack) => !pack.productIds);
  return Math.min(...deals.map((pack) => packPriceDollars(unitPrice, pack)));
}

/** Human pack label e.g. "Party tray (12)" */
export function formatPackLabel(pack: PackDeal) {
  return pack.displayName === pack.label
    ? `${pack.label} (${pack.quantity})`
    : `${pack.displayName} (${pack.quantity})`;
}

/** Max separate packs in one checkout */
export const maxPacksPerOrder = 8;
