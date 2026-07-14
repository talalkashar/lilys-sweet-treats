import type Stripe from "stripe";
import { site } from "@/data/site";
import { sendOrderEmails, type SendOrderEmailResult } from "@/lib/email";
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

export type NotifyResult =
  | SendOrderEmailResult
  | { sent: false; reason: "not_paid" | "already_sent" };

/**
 * Send owner + customer emails once per successful payment.
 * Uses Stripe metadata as a lock so webhook + success page don't double-send.
 */
export async function notifyOrderPaidOnce(
  pi: Stripe.PaymentIntent,
): Promise<NotifyResult> {
  if (pi.status !== "succeeded" && pi.status !== "processing") {
    return { sent: false, reason: "not_paid" };
  }

  if (pi.metadata?.emailsSent === "true") {
    return { sent: false, reason: "already_sent" };
  }

  const stripe = getStripe();

  // Claim the send (best-effort lock) BEFORE sending so parallel paths don't double
  try {
    await stripe.paymentIntents.update(pi.id, {
      metadata: {
        ...pi.metadata,
        emailsSent: "pending",
      },
    });
  } catch (err) {
    console.error("[order-notify] could not set emailsSent pending", err);
  }

  const result = await sendOrderEmails(orderPayloadFromIntent(pi));
  console.log("[order-notify] result", pi.id, JSON.stringify(result));

  try {
    await stripe.paymentIntents.update(pi.id, {
      metadata: {
        ...pi.metadata,
        emailsSent: result.sent ? "true" : "failed",
        emailsSentAt: new Date().toISOString(),
        emailError: result.sent
          ? ""
          : ("reason" in result ? result.reason : "unknown").slice(0, 450),
      },
    });
  } catch (err) {
    console.error("[order-notify] could not finalize emailsSent metadata", err);
  }

  return result;
}
