import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { notifyOrderPaidOnce } from "@/lib/order-notify";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * Stripe webhook backup path for order emails.
 * Primary path also runs on /order/success after payment.
 *
 * Dashboard → Webhooks:
 *   URL: https://www.lilyssweettreatsva.com/api/webhooks/stripe
 *   Event: payment_intent.succeeded
 *   Secret → STRIPE_WEBHOOK_SECRET
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
      // Re-fetch so we have latest metadata (emailsSent lock)
      const fresh = await stripe.paymentIntents.retrieve(pi.id);
      await notifyOrderPaidOnce(fresh);
    } else {
      console.log("[stripe webhook] ignored event", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[stripe webhook] handler error", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
