"use client";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";

type Props = {
  totalLabel: string;
  onBack: () => void;
};

export function CheckoutPayment({ totalLabel, onBack }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onPay(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setBusy(true);
    setError(null);

    const returnUrl = `${window.location.origin}/order/success`;

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
    });

    // If we get here, payment failed (success redirects away)
    if (submitError) {
      setError(submitError.message || "Payment failed. Try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onPay} className="space-y-6">
      <div className="rounded-2xl border border-[var(--blush)] bg-[var(--cream)]/80 p-4">
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--cocoa-soft)]">
          Total{" "}
          <span className="ml-1 font-display text-xl font-medium tabular-nums text-[var(--cocoa)]">
            {totalLabel}
          </span>
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onBack}
            disabled={busy}
            className="btn-secondary"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!stripe || busy}
            className="btn-primary disabled:opacity-60"
          >
            {busy ? "Processing…" : "Pay now"}
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-[var(--ink-muted)]">
        Secure card payment powered by Stripe. You stay on this site.
        {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith("pk_test")
          ? " Test mode: use card 4242 4242 4242 4242."
          : ""}
      </p>
    </form>
  );
}
