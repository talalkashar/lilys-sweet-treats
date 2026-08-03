import type Stripe from "stripe";
import { createHash } from "crypto";

const CANCELABLE: ReadonlySet<Stripe.PaymentIntent.Status> = new Set([
  "requires_payment_method",
  "requires_confirmation",
]);

/** Statuses we may cancel (never succeeded / processing / canceled). */
export function isCancelablePaymentIntentStatus(
  status: Stripe.PaymentIntent.Status,
): boolean {
  return CANCELABLE.has(status);
}

async function cancelIfOpen(
  stripe: Stripe,
  pi: Stripe.PaymentIntent,
  reason: Stripe.PaymentIntentCancelParams.CancellationReason = "abandoned",
): Promise<boolean> {
  if (!CANCELABLE.has(pi.status)) return false;
  try {
    await stripe.paymentIntents.cancel(pi.id, { cancellation_reason: reason });
    return true;
  } catch (err) {
    console.warn("[pi-hygiene] cancel failed", pi.id, err);
    return false;
  }
}

/**
 * Cancel an abandoned PaymentIntent so Stripe Dashboard is not cluttered
 * with incomplete attempts (and so retries don't multiply PI rows).
 * Only cancels intents that still need a payment method and match the email.
 */
export async function cancelAbandonedPaymentIntent(
  stripe: Stripe,
  paymentIntentId: string | undefined | null,
  customerEmail: string,
): Promise<void> {
  if (!paymentIntentId || !/^pi_[a-zA-Z0-9_]+$/.test(paymentIntentId)) {
    return;
  }

  try {
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
    const metaEmail = (pi.metadata?.customerEmail || "").toLowerCase();
    if (metaEmail && metaEmail !== customerEmail.toLowerCase()) {
      return;
    }
    await cancelIfOpen(stripe, pi);
  } catch (err) {
    // Best-effort — never fail checkout because cleanup failed
    console.warn("[pi-hygiene] cancel skipped", paymentIntentId, err);
  }
}

/**
 * Cancel a PaymentIntent when the browser proves ownership with client_secret.
 * Used when the customer hits Back or closes the tab on the pay step.
 */
export async function cancelPaymentIntentWithClientSecret(
  stripe: Stripe,
  paymentIntentId: string,
  clientSecret: string,
): Promise<{ ok: boolean; status?: string; error?: string }> {
  if (!/^pi_[a-zA-Z0-9_]+$/.test(paymentIntentId)) {
    return { ok: false, error: "Invalid payment session" };
  }
  if (
    !clientSecret.startsWith(`${paymentIntentId}_secret_`) ||
    clientSecret.length > 200
  ) {
    return { ok: false, error: "Invalid payment session" };
  }

  try {
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (pi.client_secret !== clientSecret) {
      return { ok: false, error: "Invalid payment session" };
    }
    if (pi.status === "canceled") {
      return { ok: true, status: "canceled" };
    }
    if (!CANCELABLE.has(pi.status)) {
      // Succeeded / processing — do not cancel
      return { ok: true, status: pi.status };
    }
    await stripe.paymentIntents.cancel(pi.id, {
      cancellation_reason: "abandoned",
    });
    return { ok: true, status: "canceled" };
  } catch (err) {
    console.warn("[pi-hygiene] client cancel failed", paymentIntentId, err);
    return { ok: false, error: "Could not cancel" };
  }
}

/**
 * Cancel other incomplete intents for this email so one shopper does not leave
 * a pile of Incomplete rows when they retry from another device/session.
 * Keeps `keepId` if provided (the PI we are about to replace is canceled separately).
 */
export async function cancelOtherIncompleteForEmail(
  stripe: Stripe,
  email: string,
  keepId?: string | null,
): Promise<number> {
  const emailLower = email.toLowerCase().trim();
  if (!emailLower || !emailLower.includes("@")) return 0;

  let canceled = 0;
  try {
    // Bakery volume is low — recent list is enough without Search API.
    const list = await stripe.paymentIntents.list({ limit: 40 });
    for (const pi of list.data) {
      if (keepId && pi.id === keepId) continue;
      if (!CANCELABLE.has(pi.status)) continue;
      const metaEmail = (
        pi.metadata?.customerEmail ||
        pi.receipt_email ||
        ""
      ).toLowerCase();
      if (metaEmail !== emailLower) continue;
      if (await cancelIfOpen(stripe, pi)) canceled += 1;
    }
  } catch (err) {
    console.warn("[pi-hygiene] email sweep failed", err);
  }
  return canceled;
}

/**
 * Opportunistic cleanup: cancel old incomplete intents (any customer).
 * Called during checkout so we do not need a separate cron on Hobby.
 * Caps work so create-payment-intent stays fast.
 */
export async function cancelStaleIncompleteIntents(
  stripe: Stripe,
  options?: { olderThanHours?: number; maxCancel?: number },
): Promise<number> {
  const olderThanHours = options?.olderThanHours ?? 48;
  const maxCancel = options?.maxCancel ?? 8;
  const cutoff = Math.floor(Date.now() / 1000) - olderThanHours * 3600;

  let canceled = 0;
  try {
    const list = await stripe.paymentIntents.list({
      limit: 30,
      created: { lt: cutoff },
    });
    for (const pi of list.data) {
      if (canceled >= maxCancel) break;
      if (!CANCELABLE.has(pi.status)) continue;
      // Only bakery checkout intents (metadata fingerprint)
      if (!pi.metadata?.customerEmail && !pi.metadata?.fulfillment) continue;
      if (await cancelIfOpen(stripe, pi, "abandoned")) canceled += 1;
    }
  } catch (err) {
    console.warn("[pi-hygiene] stale sweep failed", err);
  }
  return canceled;
}

/**
 * Stable idempotency key so double-clicks / flaky networks do not create
 * multiple PaymentIntents for the same intentional checkout attempt.
 *
 * `attemptId` is generated once per "Continue to payment" session on the client.
 * Going Back regenerates it so a canceled intent is never returned from Stripe's
 * idempotency cache.
 */
export function checkoutIdempotencyKey(parts: {
  email: string;
  orderFingerprint: string;
  totalCents: number;
  attemptId: string;
}): string {
  const attempt = parts.attemptId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64);
  const raw = [
    parts.email.toLowerCase(),
    parts.orderFingerprint,
    String(parts.totalCents),
    attempt || "na",
  ].join("|");
  const hash = createHash("sha256").update(raw).digest("hex").slice(0, 40);
  return `lst_checkout_${hash}`;
}
