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
    ? `<tr><td style="padding:10px 0;border-top:1px solid #f5c6d6;"><strong>Notes</strong><br/>${escapeHtml(order.notes)}</td></tr>`
    : "";
  return `
  <div style="margin:0;padding:24px 16px;background:#f7ebe6;font-family:Georgia,'Times New Roman',serif;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #f5c6d6;">
      <div style="background:linear-gradient(135deg,#e84a88,#c93670);padding:20px 24px;color:#fff;">
        <p style="margin:0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;opacity:0.9;">New sale</p>
        <h1 style="margin:8px 0 0;font-size:24px;font-weight:600;">Paid order ready to bake</h1>
      </div>
      <div style="padding:24px;color:#2c2228;font-family:system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.55;">
        <p style="margin:0 0 16px;">Someone just paid online for porch pickup.</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#8a7a82;width:38%;">Order</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(order.productName)} × ${escapeHtml(order.quantity)}</td></tr>
          <tr><td style="padding:8px 0;color:#8a7a82;">Paid</td><td style="padding:8px 0;font-weight:600;color:#c93670;">${formatMoney(order.amountCents)}</td></tr>
          <tr><td style="padding:8px 0;color:#8a7a82;">Pickup window</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(order.pickupWindow)}</td></tr>
          <tr><td style="padding:8px 0;color:#8a7a82;">Customer</td><td style="padding:8px 0;">${escapeHtml(order.customerName)}</td></tr>
          <tr><td style="padding:8px 0;color:#8a7a82;">Phone</td><td style="padding:8px 0;"><a href="tel:${escapeHtml(order.customerPhone.replace(/\D/g, ""))}" style="color:#c93670;text-decoration:none;">${escapeHtml(order.customerPhone)}</a></td></tr>
          <tr><td style="padding:8px 0;color:#8a7a82;">Email</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(order.customerEmail)}" style="color:#c93670;text-decoration:none;">${escapeHtml(order.customerEmail)}</a></td></tr>
          <tr><td style="padding:8px 0;color:#8a7a82;">Pickup at</td><td style="padding:8px 0;">${escapeHtml(order.pickupAddress)}</td></tr>
          ${notes}
        </table>
        <p style="margin:20px 0 0;font-size:13px;color:#8a7a82;">Stripe: ${escapeHtml(order.paymentIntentId)}</p>
      </div>
    </div>
  </div>`;
}

function customerHtml(order: OrderEmailPayload) {
  const notes = order.notes
    ? `<p style="margin:16px 0 0;padding:12px 14px;background:#fffaf8;border-radius:10px;border:1px solid #f5c6d6;"><strong>Your notes:</strong> ${escapeHtml(order.notes)}</p>`
    : "";
  const preheader = `Order confirmed: ${order.productName} × ${order.quantity}. Pickup ${order.pickupWindow}.`;
  return `
  <div style="margin:0;padding:0;background:#f7ebe6;">
    <!-- preheader (inbox preview text) -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      ${escapeHtml(preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
    </div>
    <div style="padding:28px 16px;font-family:Georgia,'Times New Roman',serif;">
      <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #f0d4de;box-shadow:0 8px 28px rgba(44,34,40,0.08);">
        <div style="background:linear-gradient(135deg,#fff5f8 0%,#f3ecfa 100%);padding:28px 24px 20px;text-align:center;border-bottom:1px solid #f5c6d6;">
          <p style="margin:0;font-family:system-ui,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#c93670;">
            ${escapeHtml(site.shortName)}
          </p>
          <h1 style="margin:12px 0 0;font-size:28px;font-weight:600;color:#2c2228;line-height:1.2;">
            You&apos;re all set
          </h1>
          <p style="margin:10px 0 0;font-family:system-ui,sans-serif;font-size:15px;color:#5c4f56;">
            Payment received · porch pickup only
          </p>
        </div>

        <div style="padding:24px;font-family:system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.55;color:#2c2228;">
          <p style="margin:0 0 16px;">Hi ${escapeHtml(order.customerName.split(" ")[0] || order.customerName)},</p>
          <p style="margin:0 0 18px;">Thanks for ordering from us. Here&apos;s your confirmation so it&apos;s easy to find later.</p>

          <div style="border-radius:14px;background:#fffaf8;border:1px solid #f5c6d6;padding:16px 18px;margin-bottom:18px;">
            <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#c93670;">Your order</p>
            <p style="margin:0;font-size:18px;font-weight:700;">${escapeHtml(order.productName)}</p>
            <p style="margin:6px 0 0;color:#5c4f56;">Qty ${escapeHtml(order.quantity)} · <strong style="color:#c93670;">${formatMoney(order.amountCents)} paid</strong></p>
          </div>

          <div style="border-radius:14px;background:#f3ecfa;border:1px solid #e0d4f0;padding:16px 18px;margin-bottom:18px;">
            <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#7a5fad;">Pickup</p>
            <p style="margin:0;font-size:16px;font-weight:700;">${escapeHtml(order.pickupWindow)}</p>
            <p style="margin:8px 0 0;color:#5c4f56;font-size:14px;">${escapeHtml(order.pickupAddress)}</p>
            <p style="margin:10px 0 0;font-size:13px;color:#8a7a82;">We&apos;ll text or email if anything changes. Please arrive in your window.</p>
          </div>

          ${notes}

          <p style="margin:20px 0 0;font-size:14px;color:#5c4f56;">
            Questions? Call or text
            <a href="tel:${site.phone.replace(/\D/g, "")}" style="color:#c93670;font-weight:600;text-decoration:none;">${escapeHtml(site.phone)}</a>
            or email
            <a href="mailto:${escapeHtml(site.email)}" style="color:#c93670;font-weight:600;text-decoration:none;">${escapeHtml(site.email)}</a>.
          </p>
          <p style="margin:18px 0 0;font-family:Georgia,serif;font-size:16px;color:#2c2228;">
            See you soon,<br/>
            <span style="color:#c93670;">${escapeHtml(site.name)}</span>
          </p>
        </div>

        <div style="padding:14px 20px 18px;text-align:center;background:#faf7f8;border-top:1px solid #f0d4de;font-family:system-ui,sans-serif;font-size:11px;color:#8a7a82;">
          You received this because you ordered on lilyssweettreatsva.com<br/>
          Tip: search your inbox for &quot;Lily&apos;s Sweet Treats&quot; if this landed in Spam or Promotions.
        </div>
      </div>
    </div>
  </div>`;
}

function customerText(order: OrderEmailPayload) {
  return [
    `You're all set — ${site.shortName}`,
    "",
    `Hi ${order.customerName.split(" ")[0] || order.customerName},`,
    "",
    `Payment received for ${order.productName} × ${order.quantity} (${formatMoney(order.amountCents)}).`,
    "",
    `PICKUP WINDOW: ${order.pickupWindow}`,
    `ADDRESS: ${order.pickupAddress}`,
    order.notes ? `NOTES: ${order.notes}` : "",
    "",
    "Porch pickup only — no delivery.",
    `Questions? ${site.phone} or ${site.email}`,
    "",
    `— ${site.name}`,
  ]
    .filter(Boolean)
    .join("\n");
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
      subject: `🧁 New order · ${order.productName} × ${order.quantity} · ${formatMoney(order.amountCents)}`,
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
      const first = order.customerName.split(" ")[0] || "there";
      const customerResult = await resend.emails.send({
        from,
        to: [order.customerEmail],
        replyTo: site.email,
        subject: `Your Lily's Sweet Treats order is confirmed · ${order.productName}`,
        html: customerHtml(order),
        text: customerText(order),
        headers: {
          "X-Entity-Ref-ID": order.paymentIntentId,
        },
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
          `(hi ${first})`,
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
