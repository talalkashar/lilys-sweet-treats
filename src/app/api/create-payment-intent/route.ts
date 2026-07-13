import { NextResponse } from "next/server";
import { products } from "@/data/products";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

type Body = {
  productId?: string;
  quantity?: number;
  name?: string;
  phone?: string;
  email?: string;
  pickupWindow?: string;
  notes?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const product = products.find((p) => p.id === body.productId);
    const quantity = Math.max(1, Math.min(20, Number(body.quantity) || 1));

    if (!product) {
      return NextResponse.json({ error: "Invalid product" }, { status: 400 });
    }

    const name = (body.name || "").trim();
    const phone = (body.phone || "").trim();
    const email = (body.email || "").trim();
    const pickupWindow = (body.pickupWindow || "").trim();
    const notes = (body.notes || "").trim();

    if (!name || !phone || !email || !pickupWindow) {
      return NextResponse.json(
        { error: "Missing order details" },
        { status: 400 },
      );
    }

    // Always compute amount on the server (never trust the client total)
    const amount = Math.round(product.price * quantity * 100);
    if (amount < 50) {
      return NextResponse.json({ error: "Amount too small" }, { status: 400 });
    }

    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      receipt_email: email,
      description: `${product.name} × ${quantity} (porch pickup)`,
      metadata: {
        productId: product.id,
        productName: product.name,
        quantity: String(quantity),
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        pickupWindow,
        notes: notes.slice(0, 450),
        fulfillment: "porch_pickup",
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount,
      productName: product.name,
      quantity,
    });
  } catch (err) {
    console.error("create-payment-intent", err);
    return NextResponse.json(
      { error: "Could not start payment" },
      { status: 500 },
    );
  }
}
