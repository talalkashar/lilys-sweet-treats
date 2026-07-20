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
  subtotalCents?: number;
  taxCents?: number;
  taxRateLabel?: string;
};

export type SendOrderEmailResult = {
  /** True only when every required recipient succeeded */
  sent: boolean;
  ownerTo: string;
  ownerSent: boolean;
  ownerId?: string;
  ownerError?: string;
  customerTo?: string;
  customerSent: boolean;
  customerId?: string;
  customerError?: string;
  reason?: string;
};

function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Read + validate RESEND_API_KEY.
 * Empty / placeholder values (common after env pull templates) are treated as missing.
 */
function getResendApiKey(): string | null {
  const raw = process.env.RESEND_API_KEY;
  if (raw == null) return null;
  const key = raw.trim().replace(/^["']|["']$/g, "");
  if (!key) return null;
  // Placeholders from .env.example / incomplete setup
  if (
    key === "re_..." ||
    key === "re_xxx" ||
    key.toLowerCase().includes("your_api_key") ||
    key.toLowerCase().includes("paste")
  ) {
    return null;
  }
  if (!key.startsWith("re_")) {
    console.warn(
      "[email] RESEND_API_KEY does not look like a Resend key (expected re_…)",
    );
  }
  return key;
}

function getResend() {
  const key = getResendApiKey();
  if (!key) return null;
  return new Resend(key);
}

/** From address — branded domain (verified in Resend). */
function fromAddress() {
  const raw =
    process.env.EMAIL_FROM ||
    `Lily's Sweet Treats <orders@lilyssweettreatsva.com>`;
  return raw.trim().replace(/^["']|["']$/g, "");
}

/** Owner inbox — Lily by default. */
function ownerInbox() {
  return (process.env.ORDER_NOTIFY_EMAIL || site.email)
    .trim()
    .replace(/^["']|["']$/g, "");
}

/** True when order confirmation emails can send in this environment. */
export function isResendConfigured() {
  return Boolean(getResendApiKey());
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Order summary may list packs joined with " + " — break for readability in HTML. */
function formatOrderLinesHtml(summary: string) {
  return escapeHtml(summary).replace(/ \+ /g, "<br/>");
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
          <tr><td style="padding:8px 0;color:#8a7a82;width:38%;vertical-align:top;">Order</td><td style="padding:8px 0;font-weight:600;">${formatOrderLinesHtml(order.productName)}<br/><span style="font-weight:500;color:#8a7a82;">${escapeHtml(order.quantity)}</span></td></tr>
          ${
            order.subtotalCents != null
              ? `<tr><td style="padding:8px 0;color:#8a7a82;">Subtotal</td><td style="padding:8px 0;">${formatMoney(order.subtotalCents)}</td></tr>`
              : ""
          }
          ${
            order.taxCents != null
              ? `<tr><td style="padding:8px 0;color:#8a7a82;">${escapeHtml(order.taxRateLabel || "Sales tax")}</td><td style="padding:8px 0;">${formatMoney(order.taxCents)}</td></tr>`
              : ""
          }
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
  const firstName = escapeHtml(
    order.customerName.split(" ")[0] || order.customerName,
  );
  const notesBlock = order.notes
    ? `<p style="margin:12px 0 0;font-family:system-ui,sans-serif;font-size:13px;line-height:1.45;color:#5c4f56;"><strong style="color:#2c2228;">Your notes:</strong> ${escapeHtml(order.notes)}</p>`
    : "";
  const preheader = `You're all set! ${order.productName} × ${order.quantity}. Pickup ${order.pickupWindow}.`;

  /*
    Match the live success page look exactly (sampled from site screenshot):
    Outer wallpaper: near-white blush #fbf6f8 + FAINT cupcakes (pre-composited tile)
    Card: mint #ebf7f1, green border #2f9e6b, soft rounded
    Accents: rose #e84a88, blush border #f5c6d6
  */
  const OUTER = "#fbf6f8";
  const MINT = "#ebf7f1";
  const MINT_BORDER = "#2f9e6b";
  const ROSE = "#e84a88";
  const BLUSH = "#f5c6d6";
  const COCOA = "#2c2228";
  const SOFT = "#5c4f56";
  /* Soft pastel pink — matches site Order pickup buttons */
  const PINK_BTN = "#ffc2db";
  const PINK_BTN_BORDER = "#ffb6d4";
  const PINK_BTN_TEXT = "#5c2a42";
  /* Pre-faded wallpaper — do NOT use full-strength cupcake-pattern-soft.png */
  const wallpaper =
    "https://www.lilyssweettreatsva.com/brand/backgrounds/email-wallpaper-tile.png";

  return `
  <div style="margin:0;padding:0;background-color:${OUTER};background-image:url('${wallpaper}');background-repeat:repeat;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      ${escapeHtml(preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
    </div>
    <!--[if gte mso 9]>
    <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
      <v:fill type="tile" src="${wallpaper}" color="${OUTER}"/>
    </v:background>
    <![endif]-->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background-color:${OUTER};background-image:url('${wallpaper}');background-repeat:repeat;">
      <tr>
        <td align="center" style="padding:40px 16px;font-family:Georgia,'Times New Roman',serif;background-color:${OUTER};background-image:url('${wallpaper}');background-repeat:repeat;">

          <!-- Mint success card (same proportions as website success page) -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:440px;border-collapse:separate;border-spacing:0;background-color:${MINT};border:2px solid ${MINT_BORDER};border-radius:28px;overflow:hidden;">
            <tr>
              <td align="center" style="padding:36px 26px 32px;background-color:${MINT};">

                <p style="margin:0;font-size:34px;line-height:1;color:${COCOA};font-family:Georgia,serif;">✓</p>

                <h1 style="margin:14px 0 0;font-size:30px;font-weight:500;color:${COCOA};line-height:1.2;letter-spacing:-0.02em;">
                  You&apos;re all set
                </h1>

                <p style="margin:12px auto 0;max-width:320px;font-family:system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.55;color:${SOFT};">
                  Thanks for your order. Here are your pickup details so you can find them later.
                </p>

                <!-- White detail card (matches success “confirmation email” chip) -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 0;border-collapse:separate;border-spacing:0;background-color:#ffffff;border:1.5px solid ${BLUSH};border-radius:14px;">
                  <tr>
                    <td style="padding:16px 16px 14px;text-align:left;background-color:#ffffff;border-radius:14px;">
                      <p style="margin:0 0 6px;font-family:system-ui,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${ROSE};">
                        Your order
                      </p>
                      <p style="margin:0;font-family:system-ui,sans-serif;font-size:16px;font-weight:700;color:${COCOA};line-height:1.45;">
                        ${formatOrderLinesHtml(order.productName)}
                      </p>
                      <p style="margin:6px 0 0;font-family:system-ui,sans-serif;font-size:14px;color:${SOFT};">
                        ${escapeHtml(order.quantity)}
                      </p>
                      ${
                        order.subtotalCents != null
                          ? `<p style="margin:10px 0 0;font-family:system-ui,sans-serif;font-size:13px;color:${SOFT};">Subtotal ${formatMoney(order.subtotalCents)}</p>`
                          : ""
                      }
                      ${
                        order.taxCents != null
                          ? `<p style="margin:4px 0 0;font-family:system-ui,sans-serif;font-size:13px;color:${SOFT};">${escapeHtml(order.taxRateLabel || "Sales tax")} ${formatMoney(order.taxCents)}</p>`
                          : ""
                      }
                      <p style="margin:6px 0 0;font-family:system-ui,sans-serif;font-size:14px;color:${SOFT};">
                        <strong style="color:${ROSE};">${formatMoney(order.amountCents)} paid</strong>
                      </p>
                      <p style="margin:14px 0 0;font-family:system-ui,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${SOFT};">
                        Pickup window
                      </p>
                      <p style="margin:4px 0 0;font-family:system-ui,sans-serif;font-size:15px;font-weight:700;color:${COCOA};">
                        ${escapeHtml(order.pickupWindow)}
                      </p>
                      ${notesBlock}
                    </td>
                  </tr>
                </table>

                <p style="margin:22px 0 0;font-family:system-ui,sans-serif;font-size:14px;font-weight:600;color:${COCOA};">
                  Pickup at
                </p>
                <p style="margin:6px 0 0;font-family:system-ui,sans-serif;font-size:14px;line-height:1.45;font-weight:600;color:${ROSE};">
                  ${escapeHtml(order.pickupAddress)}
                </p>

                <p style="margin:18px 0 0;font-family:system-ui,sans-serif;font-size:14px;color:${SOFT};">
                  Questions?
                  <a href="tel:${site.phone.replace(/\D/g, "")}" style="color:${ROSE};font-weight:600;text-decoration:none;">${escapeHtml(site.phone)}</a>
                </p>

                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px auto 0;border-collapse:collapse;">
                  <tr>
                    <td style="padding:0 6px 0 0;">
                      <a href="https://www.lilyssweettreatsva.com/#menu" style="display:inline-block;padding:12px 20px;border-radius:999px;border:1.5px solid ${PINK_BTN_BORDER};background:${PINK_BTN};color:${PINK_BTN_TEXT};font-family:system-ui,sans-serif;font-size:14px;font-weight:600;text-decoration:none;">
                        Back to menu
                      </a>
                    </td>
                    <td style="padding:0 0 0 6px;">
                      <a href="https://www.lilyssweettreatsva.com/order" style="display:inline-block;padding:12px 20px;border-radius:999px;border:1.5px solid ${PINK_BTN_BORDER};background:${PINK_BTN};color:${PINK_BTN_TEXT};font-family:system-ui,sans-serif;font-size:14px;font-weight:600;text-decoration:none;">
                        Order again
                      </a>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  </div>`;
}

function customerText(order: OrderEmailPayload) {
  const moneyLines = [
    order.subtotalCents != null
      ? `Subtotal: ${formatMoney(order.subtotalCents)}`
      : "",
    order.taxCents != null
      ? `${order.taxRateLabel || "Sales tax"}: ${formatMoney(order.taxCents)}`
      : "",
    `Total paid: ${formatMoney(order.amountCents)}`,
  ].filter(Boolean);

  return [
    `You're all set — ${site.shortName}`,
    "",
    `Hi ${order.customerName.split(" ")[0] || order.customerName},`,
    "",
    `Payment received for ${order.productName} × ${order.quantity}.`,
    ...moneyLines,
    "",
    `PICKUP WINDOW: ${order.pickupWindow}`,
    `ADDRESS: ${order.pickupAddress}`,
    order.notes ? `NOTES: ${order.notes}` : "",
    "",
    "Porch pickup only — no delivery. All sales final once baked (see Policies).",
    "Contains common bakery allergens (wheat, eggs, milk, soy; nuts possible).",
    `Questions? ${site.phone} or ${site.email}`,
    "",
    `— ${site.name}`,
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Notify bakery owner + customer after a successful Stripe payment.
 * Tracks each recipient separately so a bakery alert success never hides a
 * failed customer confirmation (and we can retry the missing one).
 */
export async function sendOrderEmails(
  order: OrderEmailPayload,
  options?: {
    /** Skip bakery owner alert (already delivered for this payment) */
    skipOwner?: boolean;
    /** Skip customer confirmation (already delivered for this payment) */
    skipCustomer?: boolean;
  },
): Promise<SendOrderEmailResult> {
  const resend = getResend();
  const ownerTo = ownerInbox();
  const customerTo = (order.customerEmail || "").trim() || undefined;

  if (!resend) {
    console.error(
      "[email] RESEND_API_KEY missing or empty — skipped order emails for",
      order.paymentIntentId,
      "| Set RESEND_API_KEY=re_… in .env.local (local) or Vercel env (production), then restart the server.",
    );
    return {
      sent: false,
      reason: "missing_resend_key",
      ownerTo,
      ownerSent: false,
      customerTo,
      customerSent: false,
    };
  }

  const from = fromAddress();
  if (!from || !from.includes("@")) {
    console.error("[email] EMAIL_FROM missing or invalid:", from);
    return {
      sent: false,
      reason: "missing_from_address",
      ownerTo,
      ownerSent: false,
      customerTo,
      customerSent: false,
    };
  }
  let ownerError: string | undefined;
  let customerError: string | undefined;
  let ownerId: string | undefined;
  let customerId: string | undefined;
  let ownerSent = Boolean(options?.skipOwner);
  let customerSent = Boolean(options?.skipCustomer) || !customerTo;

  if (!options?.skipOwner) {
    try {
      const ownerResult = await resend.emails.send({
        from,
        to: [ownerTo],
        replyTo: customerTo,
        subject: `New order: ${order.productName} × ${order.quantity} — ${formatMoney(order.amountCents)}`,
        html: ownerHtml(order),
      });
      if (ownerResult.error) {
        ownerError =
          ownerResult.error.message || JSON.stringify(ownerResult.error);
        console.error("[email] owner notify failed", ownerTo, ownerResult.error);
      } else {
        ownerId = ownerResult.data?.id;
        ownerSent = true;
        console.log("[email] owner notify ok", ownerId, "→", ownerTo);
      }
    } catch (err) {
      ownerError = err instanceof Error ? err.message : "owner send threw";
      console.error("[email] owner notify exception", err);
    }
  }

  if (customerTo && !options?.skipCustomer) {
    try {
      const first = order.customerName.split(" ")[0] || "there";
      const customerResult = await resend.emails.send({
        from,
        to: [customerTo],
        replyTo: site.email,
        subject: `You're all set — ${order.productName}`,
        html: customerHtml(order),
        text: customerText(order),
      });
      if (customerResult.error) {
        customerError =
          customerResult.error.message || JSON.stringify(customerResult.error);
        console.error(
          "[email] customer confirm failed",
          customerTo,
          customerResult.error,
        );
      } else {
        customerId = customerResult.data?.id;
        customerSent = true;
        console.log(
          "[email] customer confirm ok",
          customerId,
          "→",
          customerTo,
          `(hi ${first})`,
        );
      }
    } catch (err) {
      customerError =
        err instanceof Error ? err.message : "customer send threw";
      console.error("[email] customer confirm exception", err);
    }
  }

  const allRequiredOk = ownerSent && customerSent;
  return {
    sent: allRequiredOk,
    reason: allRequiredOk
      ? undefined
      : !ownerSent && !customerSent
        ? "resend_rejected"
        : "partial_failure",
    ownerTo,
    ownerSent,
    ownerId,
    ownerError,
    customerTo,
    customerSent,
    customerId,
    customerError,
  };
}
