import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { sendOrderEmails } from "@/lib/email";
import { getStripe } from "@/lib/stripe";
import { site } from "@/data/site";

export const runtime = "nodejs";

/**
 * Stripe webhook: fires when payment succeeds so we can email Lily + the customer.
 * Configure in Stripe Dashboard → Developers → Webhooks:
 *   URL: https://www.lilyssweettreatsva.com/api/webhooks/stripe
 *   Events: payment_intent.succeeded
 *   Signing secret → STRIPE_WEBHOOK_SECRET
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[stripe webhook] STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 },
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object as Stripe.PaymentIntent;
      const meta = pi.metadata || {};

      await sendOrderEmails({
        paymentIntentId: pi.id,
        amountCents: pi.amount_received || pi.amount,
        productName: meta.productName || "Order",
        quantity: meta.quantity || "1",
        customerName: meta.customerName || "Customer",
        customerPhone: meta.customerPhone || "",
        customerEmail: meta.customerEmail || pi.receipt_email || "",
        pickupWindow: meta.pickupWindow || "TBD",
        notes: meta.notes || "",
        pickupAddress: meta.pickupAddress || site.addressLine,
      });
    }

    // Acknowledge quickly so Stripe doesn't retry forever
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[stripe webhook] handler error", err);
    // Return 500 so Stripe retries
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
