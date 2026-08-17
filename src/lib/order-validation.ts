import { availableProducts, getProduct } from "@/data/products";
import {
  formatPackLabel,
  formatPairComposition,
  getPackById,
  maxPacksPerOrder,
  packDeals,
  packPriceCentsFromPairUnitPrices,
  type PackDeal,
} from "@/data/packs";
import { site } from "@/data/site";

export type OrderLineInput = {
  packId?: string;
  /**
   * Flavor for each treat (length = pack.quantity).
   * Also accepts a legacy pair list (length = quantity / 2).
   */
  pairProductIds?: string[];
  treatProductIds?: string[];
  /** Legacy: entire pack is one flavor */
  productId?: string;
  quantity?: number;
};

export type OrderInput = {
  items?: OrderLineInput[];
  productId?: string;
  packId?: string;
  pairProductIds?: string[];
  treatProductIds?: string[];
  quantity?: number;
  name?: string;
  phone?: string;
  email?: string;
  pickupWindow?: string;
  notes?: string;
};

export type ValidOrderLine = {
  pack: PackDeal;
  /** One product id per treat */
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
  if (body.productId || body.packId || body.pairProductIds || body.treatProductIds) {
    return [
      {
        productId: body.productId,
        packId: body.packId,
        pairProductIds: body.pairProductIds,
        treatProductIds: body.treatProductIds,
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

  const treatSlots = pack.quantity;
  const pairSlots = Math.floor(pack.quantity / 2);
  let treatIds: string[] = [];

  if (Array.isArray(raw.treatProductIds) && raw.treatProductIds.length > 0) {
    treatIds = raw.treatProductIds.map(String);
  } else if (Array.isArray(raw.pairProductIds) && raw.pairProductIds.length > 0) {
    const ids = raw.pairProductIds.map(String);
    if (ids.length === treatSlots) {
      treatIds = ids;
    } else if (ids.length === pairSlots) {
      treatIds = ids.flatMap((id) => [id, id]);
    } else {
      treatIds = ids;
    }
  } else if (raw.productId) {
    treatIds = Array.from({ length: treatSlots }, () => String(raw.productId));
  } else {
    return {
      ok: false,
      error: "Choose a flavor for every treat in the pack.",
    };
  }

  if (treatIds.length !== treatSlots) {
    return {
      ok: false,
      error: `A ${pack.label} needs exactly ${treatSlots} flavor${treatSlots === 1 ? "" : "s"} (one per treat).`,
    };
  }

  const pairProducts: (typeof availableProducts)[number][] = [];
  for (const id of treatIds) {
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
      pairProductIds: treatIds,
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
 * Each treat in a pack can be any available flavor.
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
