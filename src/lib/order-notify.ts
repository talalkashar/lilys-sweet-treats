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
    // Multi-pack: productName is full summary; quantity is total treats
    quantity:
      meta.lineCount && Number(meta.lineCount) > 1
        ? `${meta.quantity || "?"} treats · ${meta.lineCount} packs`
        : meta.packLabel || meta.quantity || "1",
    customerName: meta.customerName || "Customer",
    customerPhone: meta.customerPhone || "",
    customerEmail: meta.customerEmail || pi.receipt_email || "",
    pickupWindow: meta.pickupWindow || "TBD",
    notes: meta.notes || "",
    pickupAddress: meta.pickupAddress || site.addressLine,
  };
}

export type NotifyResult =
  | (SendOrderEmailResult & { reason?: string })
  | { sent: false; reason: "not_paid"; customerSent?: false; ownerSent?: false }
  | {
      sent: boolean;
      reason: "already_sent";
      ownerSent: boolean;
      customerSent: boolean;
      customerTo?: string;
    };

function metaFlagTrue(value: string | undefined) {
  return value === "true" || value === "1" || value === "yes";
}

/**
 * Send owner + customer emails once per successful payment.
 * Tracks owner/customer delivery separately so a bakery alert success never
 * prevents retrying a failed customer confirmation.
 */
export async function notifyOrderPaidOnce(
  pi: Stripe.PaymentIntent,
): Promise<NotifyResult> {
  if (pi.status !== "succeeded" && pi.status !== "processing") {
    return { sent: false, reason: "not_paid" };
  }

  const meta = pi.metadata || {};
  const ownerAlready = metaFlagTrue(meta.ownerEmailSent);
  const customerAlready = metaFlagTrue(meta.customerEmailSent);
  // Backward compatible with older lock that only set emailsSent
  const legacyDone = meta.emailsSent === "true";

  if (legacyDone || (ownerAlready && customerAlready)) {
    return {
      sent: true,
      reason: "already_sent",
      ownerSent: true,
      customerSent: true,
      customerTo: meta.customerEmail || pi.receipt_email || undefined,
    };
  }

  // If only one side landed before, retry the missing side only
  if (ownerAlready && !customerAlready && !meta.customerEmail && !pi.receipt_email) {
    return {
      sent: true,
      reason: "already_sent",
      ownerSent: true,
      customerSent: true,
    };
  }

  const stripe = getStripe();

  // Soft lock so webhook + success page don't double-send the same side
  try {
    await stripe.paymentIntents.update(pi.id, {
      metadata: {
        ...meta,
        emailsSent: "pending",
      },
    });
  } catch (err) {
    console.error("[order-notify] could not set emailsSent pending", err);
  }

  const result = await sendOrderEmails(orderPayloadFromIntent(pi), {
    skipOwner: ownerAlready || legacyDone,
    skipCustomer: customerAlready,
  });

  console.log("[order-notify] result", pi.id, JSON.stringify(result));

  const ownerSent = ownerAlready || legacyDone || result.ownerSent;
  const customerSent = customerAlready || result.customerSent;
  const fullySent = ownerSent && customerSent;

  const errorBits = [
    result.ownerError ? `owner:${result.ownerError}` : "",
    result.customerError ? `customer:${result.customerError}` : "",
  ]
    .filter(Boolean)
    .join(" | ")
    .slice(0, 450);

  try {
    await stripe.paymentIntents.update(pi.id, {
      metadata: {
        ...meta,
        ownerEmailSent: ownerSent ? "true" : "false",
        customerEmailSent: customerSent ? "true" : "false",
        emailsSent: fullySent ? "true" : "failed",
        emailsSentAt: new Date().toISOString(),
        emailError: fullySent ? "" : errorBits || result.reason || "unknown",
      },
    });
  } catch (err) {
    console.error("[order-notify] could not finalize emailsSent metadata", err);
  }

  return {
    ...result,
    sent: fullySent,
    ownerSent,
    customerSent,
  };
}
