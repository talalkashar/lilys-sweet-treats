import { availableProducts, getProduct } from "@/data/products";
import {
  formatPackLabel,
  formatPairComposition,
  getPackById,
  maxPacksPerOrder,
  packDeals,
  packPriceCentsFromPairUnitPrices,
  pairSlotsForPack,
  type PackDeal,
} from "@/data/packs";
import { site } from "@/data/site";

export type OrderLineInput = {
  packId?: string;
  /**
   * Flavor for each pair slot (length = pack.quantity / 2).
   * Each entry = two treats of that flavor.
   */
  pairProductIds?: string[];
  /** Legacy: entire pack is one flavor */
  productId?: string;
  quantity?: number;
};

export type OrderInput = {
  items?: OrderLineInput[];
  productId?: string;
  packId?: string;
  pairProductIds?: string[];
  quantity?: number;
  name?: string;
  phone?: string;
  email?: string;
  pickupWindow?: string;
  notes?: string;
};

export type ValidOrderLine = {
  pack: PackDeal;
  /** One product id per pair slot */
  pairProductIds: string[];
  pairProducts: (typeof availableProducts)[number][];
  quantity: number;
  packLabel: string;
  lineLabel: string;
  amountCents: number;
  /** Primary product (first pair) — legacy / tax reference */
  product: (typeof availableProducts)[number];
};

export type ValidOrder = {
  lines: ValidOrderLine[];
  orderSummary: string;
  totalTreats: number;
  name: string;
  phone: string;
  email: string;
  pickupWindow: string;
  notes: string;
  amountCents: number;
  product: (typeof availableProducts)[number];
  pack: PackDeal;
  quantity: number;
  packLabel: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clampText(value: string, max: number) {
  return value.trim().slice(0, max);
}

function resolvePack(line: OrderLineInput): PackDeal | null {
  if (line.packId) {
    return getPackById(String(line.packId)) ?? null;
  }
  const qty = Math.floor(Number(line.quantity));
  if (!Number.isFinite(qty)) return null;
  return packDeals.find((pack) => pack.quantity === qty) ?? null;
}

function normalizeLineInputs(body: OrderInput): OrderLineInput[] {
  if (Array.isArray(body.items) && body.items.length > 0) {
    return body.items;
  }
  if (body.productId || body.packId || body.pairProductIds) {
    return [
      {
        productId: body.productId,
        packId: body.packId,
        pairProductIds: body.pairProductIds,
        quantity: body.quantity,
      },
    ];
  }
  return [];
}

function parseLine(
  raw: OrderLineInput,
): { ok: true; line: ValidOrderLine } | { ok: false; error: string } {
  const pack = resolvePack(raw);
  if (!pack) {
    return {
      ok: false,
      error:
        "Each cart item needs a pack size: 2-pack, 4-pack, 6-pack, 8-pack, or party tray (12).",
    };
  }

  const slots = pairSlotsForPack(pack);
  let pairIds: string[] = [];

  if (Array.isArray(raw.pairProductIds) && raw.pairProductIds.length > 0) {
    pairIds = raw.pairProductIds.map(String);
  } else if (raw.productId) {
    // Legacy mono-flavor: fill every pair with that product
    pairIds = Array.from({ length: slots }, () => String(raw.productId));
  } else {
    return {
      ok: false,
      error: "Choose a flavor pair for every slot in the pack.",
    };
  }

  if (pairIds.length !== slots) {
    return {
      ok: false,
      error: `A ${pack.label} needs exactly ${slots} flavor pair${slots === 1 ? "" : "s"} (${pack.quantity} treats, two of each chosen flavor).`,
    };
  }

  const pairProducts: (typeof availableProducts)[number][] = [];
  for (const id of pairIds) {
    const product = getProduct(id);
    if (!product) {
      return { ok: false, error: "Invalid flavor in pack" };
    }
    // Pack restricted to specific products (if any)
    if (pack.productIds && !pack.productIds.includes(product.id)) {
      return {
        ok: false,
        error: `${product.name} is not available in a ${pack.label}.`,
      };
    }
    pairProducts.push(product);
  }

  const amountCents = packPriceCentsFromPairUnitPrices(
    pairProducts.map((p) => p.price),
    pack,
  );
  const packLabel = formatPackLabel(pack);
  const composition = formatPairComposition(pairProducts.map((p) => p.name));
  const lineLabel = `${packLabel}: ${composition}`;
  const product = pairProducts[0]!;

  return {
    ok: true,
    line: {
      pack,
      pairProductIds: pairIds,
      pairProducts,
      quantity: pack.quantity,
      packLabel,
      lineLabel,
      amountCents,
      product,
    },
  };
}

/**
 * Server-side order validation. Never trust client prices.
 * Packs are pair-based: each pair = 2 of the same flavor.
 */
export function validateOrderInput(body: OrderInput):
  | { ok: true; data: ValidOrder }
  | { ok: false; error: string; status: number } {
  const rawLines = normalizeLineInputs(body);
  if (rawLines.length === 0) {
    return {
      ok: false,
      error: "Add at least one pack to your order.",
      status: 400,
    };
  }
  if (rawLines.length > maxPacksPerOrder) {
    return {
      ok: false,
      error: `You can add up to ${maxPacksPerOrder} packs per order.`,
      status: 400,
    };
  }

  const lines: ValidOrderLine[] = [];
  for (const raw of rawLines) {
    const parsed = parseLine(raw);
    if (!parsed.ok) {
      return { ok: false, error: parsed.error, status: 400 };
    }
    lines.push(parsed.line);
  }

  const name = clampText(body.name || "", 80);
  const phone = clampText(body.phone || "", 40);
  const email = clampText(body.email || "", 120).toLowerCase();
  const pickupWindow = clampText(body.pickupWindow || "", 80);
  const notes = clampText(body.notes || "", 450);

  if (!name || name.length < 2) {
    return { ok: false, error: "Name is required", status: 400 };
  }
  if (!phone || phone.replace(/\D/g, "").length < 7) {
    return { ok: false, error: "Valid phone is required", status: 400 };
  }
  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, error: "Valid email is required", status: 400 };
  }
  if (
    !pickupWindow ||
    !(site.pickupWindows as readonly string[]).includes(pickupWindow)
  ) {
    return { ok: false, error: "Invalid pickup window", status: 400 };
  }

  const amountCents = lines.reduce((sum, line) => sum + line.amountCents, 0);
  if (amountCents < 50) {
    return { ok: false, error: "Amount too small", status: 400 };
  }

  const totalTreats = lines.reduce((sum, line) => sum + line.quantity, 0);
  const orderSummary = lines.map((l) => l.lineLabel).join(" + ");
  const first = lines[0]!;

  return {
    ok: true,
    data: {
      lines,
      orderSummary,
      totalTreats,
      name,
      phone,
      email,
      pickupWindow,
      notes,
      amountCents,
      product: first.product,
      pack: first.pack,
      quantity: totalTreats,
      packLabel: first.packLabel,
    },
  };
}
