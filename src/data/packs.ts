/**
 * Pack / tray deals.
 * Checkout sells pack sizes only. Flavors are filled in **pairs of 2**
 * of the same flavor (no singles). Larger packs = multiple pairs
 * (same flavor or mixed flavors, two at a time).
 *
 * Pricing = sum(unit price per treat) − savingsPerTreat × count
 * (server recalculates — never trust the client total).
 */
export type PackDeal = {
  id: string;
  /** How many treats in the pack (always even — pair-based) */
  quantity: number;
  label: string;
  displayName: string;
  blurb: string;
  /** Dollars off each treat vs single-unit price */
  savingsPerTreat: number;
  featured?: boolean;
  /** Limit this deal to specific products; omitted = available for all */
  productIds?: string[];
};

export const packDeals: PackDeal[] = [
  {
    id: "pack-2",
    quantity: 2,
    label: "2-pack",
    displayName: "2-pack",
    blurb: "One pair — two of the same flavor.",
    savingsPerTreat: 0,
  },
  {
    id: "pack-4",
    quantity: 4,
    label: "4-pack",
    displayName: "4-pack",
    blurb: "Two pairs — same flavor, or two different flavors.",
    savingsPerTreat: 0,
  },
  {
    id: "pack-6",
    quantity: 6,
    label: "6-pack",
    displayName: "6-pack",
    blurb: "Three pairs — mix flavors in twos.",
    savingsPerTreat: 0,
  },
  {
    id: "pack-8",
    quantity: 8,
    label: "8-pack",
    displayName: "8-pack",
    blurb: "Four pairs — great for sharing.",
    savingsPerTreat: 0.5,
  },
  {
    id: "pack-12",
    quantity: 12,
    label: "12-pack",
    displayName: "Party tray",
    blurb: "Six pairs — party tray, mix flavors in twos.",
    savingsPerTreat: 1,
    featured: true,
  },
];

export const defaultPackId = packDeals.find((pack) => !pack.productIds)!.id;

/** How many flavor-pair slots a pack has (quantity ÷ 2) */
export function pairSlotsForPack(pack: PackDeal): number {
  return Math.floor(pack.quantity / 2);
}

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

  const normalizedId =
    id === "pack-2-sticky-buns-with-nuts" ||
    id === "pack-2-sticky-buns-without-nuts"
      ? "pack-2"
      : id;

  return packDeals.find(
    (pack) =>
      pack.id === normalizedId &&
      (!pack.productIds ||
        (Boolean(productId) && pack.productIds.includes(productId!))),
  );
}

/** Resolve pack by id only (universal packs — preferred for pair carts) */
export function getPackById(id: string | null | undefined) {
  if (!id) return undefined;
  const normalizedId =
    id === "pack-2-sticky-buns-with-nuts" ||
    id === "pack-2-sticky-buns-without-nuts"
      ? "pack-2"
      : id;
  return packDeals.find((pack) => pack.id === normalizedId);
}

export function getPackByQuantity(quantity: number, productId?: string) {
  return packDeals.find(
    (pack) =>
      pack.quantity === quantity &&
      (!pack.productIds ||
        (Boolean(productId) && pack.productIds.includes(productId!))),
  );
}

/** Full unit × qty before pack savings (mono-flavor) */
export function packFullPrice(unitPrice: number, pack: PackDeal) {
  return unitPrice * pack.quantity;
}

export function packSavings(unitPrice: number, pack: PackDeal) {
  return Math.min(
    packFullPrice(unitPrice, pack) - pack.quantity,
    Math.max(0, pack.savingsPerTreat) * pack.quantity,
  );
}

export function packPriceDollars(unitPrice: number, pack: PackDeal) {
  return packPriceCents(unitPrice, pack) / 100;
}

/** Mono-flavor pack price (all treats same unit price) */
export function packPriceCents(unitPrice: number, pack: PackDeal) {
  return packPriceCentsFromTreatPrices(
    Array.from({ length: pack.quantity }, () => unitPrice),
    pack,
  );
}

/**
 * Price from each treat’s unit price (length must equal pack.quantity).
 * Used when pairs mix flavors with different unit prices.
 */
export function packPriceCentsFromTreatPrices(
  treatUnitPrices: number[],
  pack: PackDeal,
) {
  if (treatUnitPrices.length !== pack.quantity) {
    throw new Error(
      `Expected ${pack.quantity} treat prices, got ${treatUnitPrices.length}`,
    );
  }
  const fullCents = treatUnitPrices.reduce(
    (sum, p) => sum + Math.round(p * 100),
    0,
  );
  const saveCents = Math.round(pack.savingsPerTreat * 100) * pack.quantity;
  const minCents = pack.quantity * 100;
  return Math.max(minCents, fullCents - saveCents);
}

/** Each entry is one pair’s unit price (2 treats of that price) */
export function packPriceCentsFromPairUnitPrices(
  pairUnitPrices: number[],
  pack: PackDeal,
) {
  const slots = pairSlotsForPack(pack);
  if (pairUnitPrices.length !== slots) {
    throw new Error(`Expected ${slots} pair prices, got ${pairUnitPrices.length}`);
  }
  const treatPrices = pairUnitPrices.flatMap((p) => [p, p]);
  return packPriceCentsFromTreatPrices(treatPrices, pack);
}

export function packPriceDollarsFromPairUnitPrices(
  pairUnitPrices: number[],
  pack: PackDeal,
) {
  return packPriceCentsFromPairUnitPrices(pairUnitPrices, pack) / 100;
}

export function startingPackPrice(unitPrice: number, productId?: string) {
  const deals = productId
    ? packDealsForProduct(productId)
    : packDeals.filter((pack) => !pack.productIds);
  return Math.min(...deals.map((pack) => packPriceDollars(unitPrice, pack)));
}

export function formatPackLabel(pack: PackDeal) {
  return pack.displayName === pack.label
    ? `${pack.label} (${pack.quantity})`
    : `${pack.displayName} (${pack.quantity})`;
}

/**
 * Human composition e.g. "2× Strawberry + 2× Peach" or "4× Sticky buns"
 */
export function formatPairComposition(
  pairNames: string[],
): string {
  const counts = new Map<string, number>();
  for (const name of pairNames) {
    counts.set(name, (counts.get(name) || 0) + 2);
  }
  return Array.from(counts.entries())
    .map(([name, n]) => `${n}× ${name}`)
    .join(" + ");
}

export const maxPacksPerOrder = 8;

export const packSizesCopy =
  "2-pack · 4-pack · 6-pack · 8-pack · party tray (12)";
export const packSizesShort = "2, 4, 6, 8, or 12";
export const pairRuleCopy =
  "Flavors come in pairs of 2 of the same kind. No singles — a 4-pack is two pairs (same flavor or two different).";
