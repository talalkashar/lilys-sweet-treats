import { availableProducts, getProduct } from "@/data/products";
import {
  getPackDeal,
  packDeals,
  packPriceCents,
  type PackDeal,
} from "@/data/packs";
import { site } from "@/data/site";

export type OrderInput = {
  productId?: string;
  /** Preferred: pack-4 | pack-8 | pack-12 */
  packId?: string;
  /** Legacy fallback: raw quantity if packId omitted */
  quantity?: number;
  name?: string;
  phone?: string;
  email?: string;
  pickupWindow?: string;
  notes?: string;
};

export type ValidOrder = {
  product: (typeof availableProducts)[number];
  pack: PackDeal;
  quantity: number;
  name: string;
  phone: string;
  email: string;
  pickupWindow: string;
  notes: string;
  amountCents: number;
  /** Human label for emails / Stripe e.g. "Party tray (12)" */
  packLabel: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clampText(value: string, max: number) {
  return value.trim().slice(0, max);
}

function resolvePack(body: OrderInput): PackDeal | null {
  if (body.packId) {
    return getPackDeal(String(body.packId)) ?? null;
  }
  // Fallback: match quantity to a known pack size
  const qty = Math.floor(Number(body.quantity));
  if (!Number.isFinite(qty)) return null;
  return packDeals.find((p) => p.quantity === qty) ?? null;
}

/**
 * Server-side order validation. Never trust client prices.
 * Only pack sizes (4 / 8 / 12) of available products can be ordered.
 */
export function validateOrderInput(body: OrderInput):
  | { ok: true; data: ValidOrder }
  | { ok: false; error: string; status: number } {
  const product = getProduct(body.productId || "");
  if (!product) {
    return { ok: false, error: "Invalid product", status: 400 };
  }

  const pack = resolvePack(body);
  if (!pack) {
    return {
      ok: false,
      error: "Choose a pack size: 4-pack, 8-pack, or party tray (12).",
      status: 400,
    };
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

  const amountCents = packPriceCents(product.price, pack);
  if (amountCents < 50) {
    return { ok: false, error: "Amount too small", status: 400 };
  }

  const packLabel =
    pack.displayName === pack.label
      ? `${pack.label} (${pack.quantity})`
      : `${pack.displayName} (${pack.quantity})`;

  return {
    ok: true,
    data: {
      product,
      pack,
      quantity: pack.quantity,
      name,
      phone,
      email,
      pickupWindow,
      notes,
      amountCents,
      packLabel,
    },
  };
}
