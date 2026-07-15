import { availableProducts, getProduct } from "@/data/products";
import { site } from "@/data/site";

export type OrderInput = {
  productId?: string;
  quantity?: number;
  name?: string;
  phone?: string;
  email?: string;
  pickupWindow?: string;
  notes?: string;
};

export type ValidOrder = {
  product: (typeof availableProducts)[number];
  quantity: number;
  name: string;
  phone: string;
  email: string;
  pickupWindow: string;
  notes: string;
  amountCents: number;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clampText(value: string, max: number) {
  return value.trim().slice(0, max);
}

/**
 * Server-side order validation. Never trust client prices or free-form enums.
 * Only currently available products can be ordered.
 */
export function validateOrderInput(body: OrderInput):
  | { ok: true; data: ValidOrder }
  | { ok: false; error: string; status: number } {
  const product = getProduct(body.productId || "");
  if (!product) {
    return { ok: false, error: "Invalid product", status: 400 };
  }

  const quantity = Math.max(1, Math.min(20, Number(body.quantity) || 1));
  if (!Number.isFinite(quantity) || quantity < 1) {
    return { ok: false, error: "Invalid quantity", status: 400 };
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

  const amountCents = Math.round(product.price * quantity * 100);
  if (amountCents < 50) {
    return { ok: false, error: "Amount too small", status: 400 };
  }

  return {
    ok: true,
    data: {
      product,
      quantity,
      name,
      phone,
      email,
      pickupWindow,
      notes,
      amountCents,
    },
  };
}
