import Link from "next/link";
import { mapsUrl, site } from "@/data/site";
import { notifyOrderPaidOnce } from "@/lib/order-notify";
import { getStripe } from "@/lib/stripe";

type Props = {
  searchParams: Promise<{ payment_intent?: string; redirect_status?: string }>;
};

function isTestMode() {
  return (
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith("pk_test") ??
    false
  );
}

export default async function OrderSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const paymentIntentId = params.payment_intent?.trim();
  const testMode = isTestMode();

  let status: "succeeded" | "processing" | "failed" | "unknown" = "unknown";
  let emailDebug: string | null = null;

  if (paymentIntentId && /^pi_[a-zA-Z0-9_]+$/.test(paymentIntentId)) {
    try {
      const stripe = getStripe();
      const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (pi.status === "succeeded") {
        status = "succeeded";
        const notify = await notifyOrderPaidOnce(pi);
        if (notify.sent) {
          emailDebug = testMode
            ? `Emails OK → owner: ${notify.ownerTo}${notify.customerTo ? ` · customer: ${notify.customerTo}` : ""}`
            : "Confirmation emails were sent.";
        } else if (notify.reason === "already_sent") {
          emailDebug = testMode
            ? "Emails already sent for this payment (not sent again)."
            : null;
        } else if (notify.reason === "missing_resend_key") {
          emailDebug = testMode
            ? "Email failed: RESEND_API_KEY missing on Vercel Production."
            : null;
        } else if (notify.reason === "resend_rejected") {
          emailDebug = testMode
            ? `Email failed (Resend): owner=${notify.ownerError || "n/a"} customer=${notify.customerError || "n/a"} (to: ${notify.ownerTo || "?"})`
            : "We could not send confirmation email automatically. We still have your order.";
        } else {
          emailDebug = testMode
            ? `Email not sent: ${"reason" in notify ? notify.reason : "unknown"}`
            : null;
        }
      } else if (
        pi.status === "processing" ||
        pi.status === "requires_capture"
      ) {
        status = "processing";
      } else {
        status = "failed";
      }
    } catch (err) {
      console.error("[success] payment verify failed", err);
      status = "unknown";
      if (testMode) {
        emailDebug = `Payment verify error: ${err instanceof Error ? err.message : "unknown"}`;
      }
    }
  } else if (params.redirect_status === "succeeded") {
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
        {emailDebug ? (
          <p className="mt-3 rounded-lg bg-white/80 px-3 py-2 text-left text-xs leading-relaxed text-[var(--cocoa-soft)]">
            <strong className="text-[var(--cocoa)]">Email status (test mode):</strong>
            <br />
            {emailDebug}
          </p>
        ) : null}
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
