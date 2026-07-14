import type Stripe from "stripe";
import { site } from "@/data/site";
import { sendOrderEmails } from "@/lib/email";
import { getStripe } from "@/lib/stripe";

/**
 * Build email payload from a PaymentIntent + metadata set at checkout.
 */
export function orderPayloadFromIntent(pi: Stripe.PaymentIntent) {
  const meta = pi.metadata || {};
  return {
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
  };
}

/**
 * Send owner + customer emails once per successful payment.
 * Uses Stripe metadata as a lock so webhook + success page don't double-send.
 */
export async function notifyOrderPaidOnce(pi: Stripe.PaymentIntent) {
  if (pi.status !== "succeeded" && pi.status !== "processing") {
    return { sent: false as const, reason: "not_paid" };
  }

  if (pi.metadata?.emailsSent === "true") {
    return { sent: false as const, reason: "already_sent" };
  }

  const stripe = getStripe();

  // Claim the send (best-effort lock)
  try {
    await stripe.paymentIntents.update(pi.id, {
      metadata: {
        ...pi.metadata,
        emailsSent: "true",
        emailsSentAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("[order-notify] could not set emailsSent metadata", err);
  }

  const result = await sendOrderEmails(orderPayloadFromIntent(pi));
  console.log("[order-notify] result", pi.id, result);
  return result;
}
