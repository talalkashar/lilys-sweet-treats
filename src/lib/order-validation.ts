import { availableProducts, getProduct } from "@/data/products";
import {
  formatPackLabel,
  getPackDeal,
  maxPacksPerOrder,
  packDeals,
  packPriceCents,
  type PackDeal,
} from "@/data/packs";
import { site } from "@/data/site";

export type OrderLineInput = {
  productId?: string;
  packId?: string;
  quantity?: number;
};

export type OrderInput = {
  /** Multi-pack cart (preferred) */
  items?: OrderLineInput[];
  /** Legacy single-line fields still accepted */
  productId?: string;
  packId?: string;
  quantity?: number;
  name?: string;
  phone?: string;
  email?: string;
  pickupWindow?: string;
  notes?: string;
};

export type ValidOrderLine = {
  product: (typeof availableProducts)[number];
  pack: PackDeal;
  quantity: number;
  packLabel: string;
  lineLabel: string;
  amountCents: number;
};

export type ValidOrder = {
  lines: ValidOrderLine[];
  /** Joined summary for Stripe / emails */
  orderSummary: string;
  totalTreats: number;
  name: string;
  phone: string;
  email: string;
  pickupWindow: string;
  notes: string;
  amountCents: number;
  /**
   * First line kept for any older readers of product/pack fields.
   * Prefer `lines` + `orderSummary`.
   */
  product: (typeof availableProducts)[number];
  pack: PackDeal;
  quantity: number;
  packLabel: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clampText(value: string, max: number) {
  return value.trim().slice(0, max);
}

function resolvePack(line: OrderLineInput, productId: string): PackDeal | null {
  if (line.packId) {
    return getPackDeal(String(line.packId), productId) ?? null;
  }
  const qty = Math.floor(Number(line.quantity));
  if (!Number.isFinite(qty)) return null;
  return (
    packDeals.find(
      (pack) =>
        pack.quantity === qty &&
        (!pack.productIds || pack.productIds.includes(productId)),
    ) ?? null
  );
}

function normalizeLineInputs(body: OrderInput): OrderLineInput[] {
  if (Array.isArray(body.items) && body.items.length > 0) {
    return body.items;
  }
  // Legacy single-line order
  if (body.productId) {
    return [
      {
        productId: body.productId,
        packId: body.packId,
        quantity: body.quantity,
      },
    ];
  }
  return [];
}

function parseLine(
  raw: OrderLineInput,
): { ok: true; line: ValidOrderLine } | { ok: false; error: string } {
  const product = getProduct(raw.productId || "");
  if (!product) {
    return { ok: false, error: "Invalid product in cart" };
  }
  const pack = resolvePack(raw, product.id);
  if (!pack) {
    return {
      ok: false,
      error: "Each cart item needs a pack size: 4-pack, 8-pack, or party tray (12).",
    };
  }
  const amountCents = packPriceCents(product.price, pack);
  const packLabel = formatPackLabel(pack);
  return {
    ok: true,
    line: {
      product,
      pack,
      quantity: pack.quantity,
      packLabel,
      lineLabel: `${product.name} — ${packLabel}`,
      amountCents,
    },
  };
}

/**
 * Server-side order validation. Never trust client prices.
 * Supports multiple packs per checkout (mixed flavors / sizes).
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
