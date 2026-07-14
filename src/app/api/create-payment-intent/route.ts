import { NextResponse } from "next/server";
import { validateOrderInput } from "@/lib/order-validation";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { site } from "@/data/site";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    const limited = rateLimit(`pi:${ip}`, 12, 60_000);
    if (!limited.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Try again shortly." },
        {
          status: 429,
          headers: { "Retry-After": String(limited.retryAfterSec) },
        },
      );
    }

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Expected JSON body" },
        { status: 415 },
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = validateOrderInput(
      (body && typeof body === "object" ? body : {}) as Record<string, unknown>,
    );
    if (!parsed.ok) {
      return NextResponse.json(
        { error: parsed.error },
        { status: parsed.status },
      );
    }

    const {
      product,
      quantity,
      name,
      phone,
      email,
      pickupWindow,
      notes,
      amountCents,
    } = parsed.data;

    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
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
        notes,
        fulfillment: "porch_pickup",
        pickupAddress: site.addressLine,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: amountCents,
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

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
