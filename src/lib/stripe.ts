import Stripe from "stripe";
import { getStripeSecretKey, stripeModeLabel } from "@/lib/stripe-mode";

let stripe: Stripe | null = null;
let stripeKeyFingerprint: string | null = null;

export function getStripe() {
  const key = getStripeSecretKey();
  // Recreate client if mode/key changed (dev HMR / env flip)
  if (!stripe || stripeKeyFingerprint !== key.slice(0, 12)) {
    stripe = new Stripe(key);
    stripeKeyFingerprint = key.slice(0, 12);
    if (process.env.NODE_ENV !== "production") {
      console.log(`[stripe] using ${stripeModeLabel()} mode`);
    }
  }
  return stripe;
}

export {
  getStripePublishableKey,
  getStripeSecretKey,
  getStripeWebhookSecret,
  isStripeLiveMode,
  isStripeLiveModePublic,
  stripeModeLabel,
} from "@/lib/stripe-mode";
