import Link from "next/link";
import { site } from "@/data/site";
import { notifyOrderPaidOnce } from "@/lib/order-notify";
import { getStripe } from "@/lib/stripe";

type Props = {
  searchParams: Promise<{ payment_intent?: string; redirect_status?: string }>;
};

export default async function OrderSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const paymentIntentId = params.payment_intent?.trim();

  let status: "succeeded" | "processing" | "failed" | "unknown" = "unknown";
  let customerEmail: string | null = null;
  let emailSentToCustomer = false;

  if (paymentIntentId && /^pi_[a-zA-Z0-9_]+$/.test(paymentIntentId)) {
    try {
      const stripe = getStripe();
      const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
      customerEmail = pi.metadata?.customerEmail || pi.receipt_email || null;

      if (pi.status === "succeeded") {
        status = "succeeded";
        const notify = await notifyOrderPaidOnce(pi);
        if (notify.sent) {
          emailSentToCustomer = Boolean(notify.customerId || notify.customerTo);
        } else if (notify.reason === "already_sent") {
          emailSentToCustomer = Boolean(customerEmail);
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
    }
  } else if (params.redirect_status === "succeeded") {
    status = "succeeded";
  } else if (params.redirect_status) {
    status = "failed";
  }

  const ok = status === "succeeded" || status === "processing";
  const title =
    status === "succeeded"
      ? "You're all set"
      : status === "processing"
        ? "Payment processing"
        : status === "failed"
          ? "Payment not completed"
          : "Payment status unclear";

  const body =
    status === "succeeded"
      ? "Thanks for your order. A confirmation email is on the way with your pickup details."
      : status === "processing"
        ? "Your payment is still processing. We will confirm by phone or email when it clears."
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

        {ok && customerEmail ? (
          <div className="mt-5 rounded-xl border border-[var(--blush)]/60 bg-white px-4 py-4 text-left shadow-[var(--shadow-soft)]">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--rose)]">
              Confirmation email
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--cocoa)]">
              {emailSentToCustomer ? "We sent a confirmation to" : "We will email"}{" "}
              <strong className="break-all">{customerEmail}</strong>
              {emailSentToCustomer
                ? " with your order and pickup details."
                : " with your order and pickup details shortly."}
            </p>
            <p className="mt-2 text-xs text-[var(--cocoa-soft)]">
              From: Lily&apos;s Sweet Treats · Subject: Order confirmed
            </p>
          </div>
        ) : null}

        {ok ? (
          <p className="mt-5 text-sm leading-relaxed text-[var(--cocoa-soft)]">
            <span className="font-semibold text-[var(--cocoa)]">Pickup</span>
            <br />
            Porch pickup in Haymarket, VA.
            <br />
            <span className="text-xs">
              Full address is in your confirmation email.
            </span>
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
