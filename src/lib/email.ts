import { Resend } from "resend";
import { site } from "@/data/site";

export type OrderEmailPayload = {
  paymentIntentId: string;
  amountCents: number;
  productName: string;
  quantity: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  pickupWindow: string;
  notes: string;
  pickupAddress: string;
};

export type SendOrderEmailResult =
  | {
      sent: true;
      ownerTo: string;
      customerTo?: string;
      ownerId?: string;
      customerId?: string;
    }
  | {
      sent: false;
      reason: string;
      ownerTo?: string;
      ownerError?: string;
      customerError?: string;
    };

function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

/**
 * From address.
 * Default uses Resend's test sender so emails work before a custom domain is verified.
 * After verifying lilyssweettreatsva.com in Resend, set:
 *   EMAIL_FROM="Lily's Sweet Treats <orders@lilyssweettreatsva.com>"
 */
function fromAddress() {
  return (
    process.env.EMAIL_FROM || "Lily's Sweet Treats <onboarding@resend.dev>"
  );
}

function ownerInbox() {
  return (process.env.ORDER_NOTIFY_EMAIL || site.email).trim();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function ownerHtml(order: OrderEmailPayload) {
  const notes = order.notes
    ? `<p><strong>Notes:</strong> ${escapeHtml(order.notes)}</p>`
    : "";
  return `
  <div style="font-family: system-ui, sans-serif; line-height: 1.5; color: #2c2228;">
    <h2 style="color: #c93670;">New paid order — ${escapeHtml(site.shortName)}</h2>
    <p>A customer just completed payment for porch pickup.</p>
    <table style="border-collapse: collapse; width: 100%; max-width: 480px;">
      <tr><td style="padding: 6px 0;"><strong>Product</strong></td><td>${escapeHtml(order.productName)} × ${escapeHtml(order.quantity)}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Total paid</strong></td><td>${formatMoney(order.amountCents)}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Pickup window</strong></td><td>${escapeHtml(order.pickupWindow)}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Customer</strong></td><td>${escapeHtml(order.customerName)}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Phone</strong></td><td>${escapeHtml(order.customerPhone)}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Email</strong></td><td>${escapeHtml(order.customerEmail)}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Pickup at</strong></td><td>${escapeHtml(order.pickupAddress)}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Stripe ID</strong></td><td style="font-size: 12px;">${escapeHtml(order.paymentIntentId)}</td></tr>
    </table>
    ${notes}
    <p style="margin-top: 20px; font-size: 13px; color: #5c4f56;">Confirm the order with the customer by text or email when you can.</p>
  </div>`;
}

function customerHtml(order: OrderEmailPayload) {
  const notes = order.notes
    ? `<p><strong>Your notes:</strong> ${escapeHtml(order.notes)}</p>`
    : "";
  return `
  <div style="font-family: system-ui, sans-serif; line-height: 1.5; color: #2c2228;">
    <h2 style="color: #c93670;">Thanks for your order!</h2>
    <p>Hi ${escapeHtml(order.customerName)},</p>
    <p>We received your payment for <strong>${escapeHtml(order.productName)} × ${escapeHtml(order.quantity)}</strong> (${formatMoney(order.amountCents)}).</p>
    <p><strong>Pickup window:</strong> ${escapeHtml(order.pickupWindow)}<br/>
    <strong>Pickup address:</strong> ${escapeHtml(order.pickupAddress)}</p>
    ${notes}
    <p>We'll follow up by phone or email if we need anything. Porch pickup only — no delivery.</p>
    <p style="margin-top: 20px;">Questions? Call or text <a href="tel:${site.phone.replace(/\D/g, "")}">${escapeHtml(site.phone)}</a>
    or email <a href="mailto:${escapeHtml(site.email)}">${escapeHtml(site.email)}</a>.</p>
    <p style="color: #5c4f56;">— ${escapeHtml(site.name)}</p>
  </div>`;
}

/**
 * Notify bakery owner + customer after a successful Stripe payment.
 */
export async function sendOrderEmails(
  order: OrderEmailPayload,
): Promise<SendOrderEmailResult> {
  const resend = getResend();
  if (!resend) {
    console.warn(
      "[email] RESEND_API_KEY missing — skipped order emails for",
      order.paymentIntentId,
    );
    return { sent: false, reason: "missing_resend_key" };
  }

  const from = fromAddress();
  const ownerTo = ownerInbox();
  let ownerError: string | undefined;
  let customerError: string | undefined;
  let ownerId: string | undefined;
  let customerId: string | undefined;

  try {
    const ownerResult = await resend.emails.send({
      from,
      to: [ownerTo],
      replyTo: order.customerEmail || undefined,
      subject: `New order: ${order.productName} × ${order.quantity} — ${formatMoney(order.amountCents)}`,
      html: ownerHtml(order),
    });
    if (ownerResult.error) {
      ownerError =
        ownerResult.error.message || JSON.stringify(ownerResult.error);
      console.error("[email] owner notify failed", ownerTo, ownerResult.error);
    } else {
      ownerId = ownerResult.data?.id;
      console.log("[email] owner notify ok", ownerId, "→", ownerTo);
    }
  } catch (err) {
    ownerError = err instanceof Error ? err.message : "owner send threw";
    console.error("[email] owner notify exception", err);
  }

  if (order.customerEmail) {
    try {
      const customerResult = await resend.emails.send({
        from,
        to: [order.customerEmail],
        replyTo: site.email,
        subject: `Order confirmed — ${site.shortName}`,
        html: customerHtml(order),
      });
      if (customerResult.error) {
        customerError =
          customerResult.error.message || JSON.stringify(customerResult.error);
        console.error(
          "[email] customer confirm failed",
          order.customerEmail,
          customerResult.error,
        );
      } else {
        customerId = customerResult.data?.id;
        console.log(
          "[email] customer confirm ok",
          customerId,
          "→",
          order.customerEmail,
        );
      }
    } catch (err) {
      customerError =
        err instanceof Error ? err.message : "customer send threw";
      console.error("[email] customer confirm exception", err);
    }
  }

  const anyOk = Boolean(ownerId || customerId);
  if (!anyOk) {
    return {
      sent: false,
      reason: "resend_rejected",
      ownerTo,
      ownerError,
      customerError,
    };
  }

  return {
    sent: true,
    ownerTo,
    customerTo: order.customerEmail || undefined,
    ownerId,
    customerId,
  };
}
