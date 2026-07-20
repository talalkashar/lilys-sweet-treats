/**
 * Stripe test/live mode switch.
 *
 * Set both env flags the same way:
 *   STRIPE_LIVE_MODE=false
 *   NEXT_PUBLIC_STRIPE_LIVE_MODE=false
 *
 * When true, secret + publishable live keys are used (real charges).
 * When false, test keys are used (safe).
 *
 * Keys can live in either classic names or explicit _TEST / _LIVE suffixes.
 */

function envFlagTrue(value: string | undefined) {
  if (!value) return false;
  const v = value.trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes" || v === "live";
}

/** Server + build: prefer server flag, fall back to public flag. */
export function isStripeLiveMode() {
  if (typeof process.env.STRIPE_LIVE_MODE === "string") {
    return envFlagTrue(process.env.STRIPE_LIVE_MODE);
  }
  return envFlagTrue(process.env.NEXT_PUBLIC_STRIPE_LIVE_MODE);
}

/** Browser-safe: only NEXT_PUBLIC_ is available client-side. */
export function isStripeLiveModePublic() {
  return envFlagTrue(process.env.NEXT_PUBLIC_STRIPE_LIVE_MODE);
}

export function getStripeSecretKey() {
  const live = isStripeLiveMode();
  const key = live
    ? process.env.STRIPE_SECRET_KEY_LIVE || process.env.STRIPE_SECRET_KEY
    : process.env.STRIPE_SECRET_KEY_TEST || process.env.STRIPE_SECRET_KEY;

  if (!key) {
    throw new Error(
      live
        ? "Missing STRIPE_SECRET_KEY_LIVE (or STRIPE_SECRET_KEY) for live mode"
        : "Missing STRIPE_SECRET_KEY_TEST (or STRIPE_SECRET_KEY) for test mode",
    );
  }

  if (live && !key.startsWith("sk_live_")) {
    throw new Error(
      "STRIPE_LIVE_MODE is on but secret key is not sk_live_… — refusing to charge",
    );
  }
  if (!live && key.startsWith("sk_live_")) {
    throw new Error(
      "STRIPE_LIVE_MODE is off but a live secret key is configured as active — check env",
    );
  }

  return key;
}

export function getStripePublishableKey() {
  const live = isStripeLiveModePublic();
  const key = live
    ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE ||
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST ||
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  return key || "";
}

export function getStripeWebhookSecret() {
  const live = isStripeLiveMode();
  return (
    (live
      ? process.env.STRIPE_WEBHOOK_SECRET_LIVE ||
        process.env.STRIPE_WEBHOOK_SECRET
      : process.env.STRIPE_WEBHOOK_SECRET_TEST ||
        process.env.STRIPE_WEBHOOK_SECRET) || ""
  );
}

export function stripeModeLabel() {
  return isStripeLiveMode() ? "live" : "test";
}
