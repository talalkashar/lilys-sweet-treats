import { availableProducts } from "@/data/products";

/**
 * Pack / tray deals.
 * Checkout sells pack sizes only (4 / 6 / 8 / 12). Each treat in a pack
 * can be any mixable flavor — variety packs, pick flavors one by one.
 *
 * Pricing = sum(unit price per treat) − savingsPerTreat × count
 * (server recalculates — never trust the client total).
 */
export type PackDeal = {
  id: string;
  /** How many treats (or loaves) in the pack */
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
    id: "pack-4",
    quantity: 4,
    label: "4-pack",
    displayName: "4-pack",
    blurb: "Variety pack — pick a flavor for each treat.",
    savingsPerTreat: 0,
  },
  {
    id: "pack-6",
    quantity: 6,
    label: "6-pack",
    displayName: "6-pack",
    blurb: "Variety pack — pick a flavor for each treat.",
    savingsPerTreat: 0,
  },
  {
    id: "pack-8",
    quantity: 8,
    label: "8-pack",
    displayName: "8-pack",
    blurb: "Variety pack — pick a flavor for each treat.",
    savingsPerTreat: 0.5,
  },
  {
    id: "pack-12",
    quantity: 12,
    label: "12-pack",
    displayName: "Party tray",
    blurb: "Variety tray — pick a flavor for each treat.",
    savingsPerTreat: 1,
    featured: true,
  },
  {
    id: "loaf-banana-bread",
    quantity: 1,
    label: "loaf",
    displayName: "Banana loaf",
    blurb: "One whole loaf — $22.",
    savingsPerTreat: 0,
    productIds: ["banana-bread"],
  },
];

export const defaultPackId = packDeals.find((pack) => !pack.productIds)!.id;

/** How many flavor slots a pack has (one per treat) */
export function treatSlotsForPack(pack: PackDeal): number {
  return pack.quantity;
}

/** @deprecated Use treatSlotsForPack — packs are no longer pair-locked */
export function pairSlotsForPack(pack: PackDeal): number {
  return treatSlotsForPack(pack);
}

export function exclusiveProductIds() {
  const ids = new Set<string>();
  for (const pack of packDeals) {
    for (const id of pack.productIds ?? []) ids.add(id);
  }
  return ids;
}

/** Packs a product can actually be sold in */
export function packDealsForProduct(productId: string) {
  const exclusive = packDeals.filter((pack) =>
    pack.productIds?.includes(productId),
  );
  if (exclusive.length > 0) return exclusive;
  return packDeals.filter((pack) => !pack.productIds);
}

/** Flavors allowed in a pack (exclusive items stay on their own packs) */
export function productsEligibleForPack(pack: PackDeal) {
  if (pack.productIds?.length) {
    return availableProducts.filter((p) => pack.productIds!.includes(p.id));
  }
  const exclusive = exclusiveProductIds();
  return availableProducts.filter((p) => !exclusive.has(p.id));
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

/** Resolve pack by id only (universal packs — preferred for pair carts) */
export function getPackById(id: string | null | undefined) {
  if (!id) return undefined;
  return packDeals.find((pack) => pack.id === id);
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

/** Each entry is one treat’s unit price (or a legacy pair price). */
export function packPriceCentsFromPairUnitPrices(
  pairUnitPrices: number[],
  pack: PackDeal,
) {
  if (pairUnitPrices.length === pack.quantity) {
    return packPriceCentsFromTreatPrices(pairUnitPrices, pack);
  }
  const pairSlots = Math.floor(pack.quantity / 2);
  if (pairUnitPrices.length === pairSlots) {
    return packPriceCentsFromTreatPrices(
      pairUnitPrices.flatMap((p) => [p, p]),
      pack,
    );
  }
  throw new Error(
    `Expected ${pack.quantity} treat prices (or ${pairSlots} pair prices), got ${pairUnitPrices.length}`,
  );
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
 * Human composition e.g. "1× Strawberry + 1× Peach" or "4× Sticky buns"
 */
export function formatTreatComposition(treatNames: string[]): string {
  const counts = new Map<string, number>();
  for (const name of treatNames) {
    counts.set(name, (counts.get(name) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, n]) => `${n}× ${name}`)
    .join(" + ");
}

/** @deprecated Use formatTreatComposition */
export function formatPairComposition(names: string[]): string {
  return formatTreatComposition(names);
}

export function packPriceDollarsFromTreatUnitPrices(
  treatUnitPrices: number[],
  pack: PackDeal,
) {
  return packPriceCentsFromTreatPrices(treatUnitPrices, pack) / 100;
}

export const maxPacksPerOrder = 8;

export const packSizesCopy =
  "4-pack · 6-pack · 8-pack · party tray (12)";
export const packSizesShort = "4, 6, 8, or 12";
export const pairRuleCopy =
  "Every pack is a variety pack. Pick a flavor for each treat — mix or match."
