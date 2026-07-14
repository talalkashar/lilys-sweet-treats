import Link from "next/link";
import { mapsUrl, site } from "@/data/site";
import { getStripe } from "@/lib/stripe";

type Props = {
  searchParams: Promise<{ payment_intent?: string; redirect_status?: string }>;
};

export default async function OrderSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const paymentIntentId = params.payment_intent?.trim();

  let status: "succeeded" | "processing" | "failed" | "unknown" = "unknown";

  // Prefer server-side Stripe verification over trusting query params alone
  if (paymentIntentId && /^pi_[a-zA-Z0-9]+$/.test(paymentIntentId)) {
    try {
      const stripe = getStripe();
      const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (pi.status === "succeeded") status = "succeeded";
      else if (
        pi.status === "processing" ||
        pi.status === "requires_capture"
      ) {
        status = "processing";
      } else {
        status = "failed";
      }
    } catch {
      status = "unknown";
    }
  } else if (params.redirect_status === "succeeded") {
    // Fallback only if Stripe redirected without id (should be rare)
    status = "succeeded";
  } else if (params.redirect_status) {
    status = "failed";
  }

  const ok = status === "succeeded" || status === "processing";
  const title =
    status === "succeeded"
      ? "Payment received"
      : status === "processing"
        ? "Payment processing"
        : status === "failed"
          ? "Payment not completed"
          : "Payment status unclear";

  const body =
    status === "succeeded"
      ? "Thanks for your order. We will confirm your pickup window by phone or email soon. Porch pickup only."
      : status === "processing"
        ? "Your payment is still processing. We will confirm by phone or email when it clears. Porch pickup only."
        : status === "failed"
          ? "We could not confirm a successful payment. If you were charged, contact us and we will sort it out."
          : "If you were charged, we will still receive your order. Contact us if you need help.";

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
      <div
        className={`rounded-[1.75rem] border-2 p-8 sm:p-10 ${
          ok
            ? "border-[var(--mint)] bg-[var(--mint-soft)]"
            : "border-[var(--blush)] bg-white"
        }`}
      >
        <p className="text-4xl" aria-hidden>
          {ok ? "✓" : "!"}
        </p>
        <h1 className="mt-4 font-display text-3xl text-[var(--cocoa)] sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-[var(--cocoa-soft)]">{body}</p>
        {ok ? (
          <p className="mt-4 text-sm leading-relaxed text-[var(--cocoa-soft)]">
            <span className="font-semibold text-[var(--cocoa)]">Pickup at</span>
            <br />
            <a
              href={mapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--rose)] hover:underline"
            >
              {site.addressLine}
            </a>
          </p>
        ) : null}
        <p className="mt-6 text-sm text-[var(--cocoa-soft)]">
          Questions?{" "}
          <a
            className="font-semibold text-[var(--rose)]"
            href={`tel:${site.phone.replace(/\D/g, "")}`}
          >
            {site.phone}
          </a>
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/#menu" className="btn-secondary">
            Back to menu
          </Link>
          <Link href="/order" className="btn-primary">
            {ok ? "Order again" : "Try order again"}
          </Link>
        </div>
      </div>
    </div>
  );
}
