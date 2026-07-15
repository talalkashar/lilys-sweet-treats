import Link from "next/link";
import { site } from "@/data/site";
import { notifyOrderPaidOnce } from "@/lib/order-notify";
import { getStripe } from "@/lib/stripe";

/** Always run on the server with the payment_intent query — never cache this page. */
export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ payment_intent?: string; redirect_status?: string }>;
};

export default async function OrderSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const paymentIntentId = params.payment_intent?.trim();

  let status: "succeeded" | "processing" | "failed" | "unknown" = "unknown";
  let customerEmail: string | null = null;
  let emailSentToCustomer = false;
  let emailFailed = false;
  let emailFailReason: string | null = null;

  if (paymentIntentId && /^pi_[a-zA-Z0-9_]+$/.test(paymentIntentId)) {
    try {
      const stripe = getStripe();
      const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
      customerEmail = pi.metadata?.customerEmail || pi.receipt_email || null;

      if (pi.status === "succeeded") {
        status = "succeeded";
        const notify = await notifyOrderPaidOnce(pi);

        if ("customerSent" in notify && notify.customerSent) {
          emailSentToCustomer = true;
        } else if (notify.reason === "already_sent") {
          // Only trust explicit customer delivery flags from this path
          emailSentToCustomer = Boolean(
            "customerSent" in notify ? notify.customerSent : false,
          );
        }

        if (!emailSentToCustomer && customerEmail) {
          emailFailed = true;
          emailFailReason =
            "reason" in notify && notify.reason && notify.reason !== "already_sent"
              ? String(notify.reason)
              : "customer_email_not_confirmed";
          // Surface the most common misconfig clearly in logs
          if (emailFailReason === "missing_resend_key") {
            console.error(
              "[success] RESEND_API_KEY is missing in this environment — emails cannot send. Set it in Vercel Production env and local .env.local for dev.",
            );
          }
          console.error(
            "[success] customer email not confirmed",
            paymentIntentId,
            emailFailReason,
            notify,
          );
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
    // Payment may have succeeded, but without payment_intent we cannot send mail here.
    // Stripe webhook is the backup path.
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
      ? emailFailed
        ? "Thanks for your order — payment went through. We had trouble sending the confirmation email; please check spam or contact us and we will resend your pickup details."
        : "Thanks for your order. A confirmation email is on the way with your pickup details."
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
              {emailSentToCustomer ? (
                <>
                  We sent a confirmation to{" "}
                  <strong className="break-all">{customerEmail}</strong> with
                  your order and pickup details.
                </>
              ) : (
                <>
                  We could not confirm delivery to{" "}
                  <strong className="break-all">{customerEmail}</strong>. Check
                  spam/junk, or call us and we will resend.
                </>
              )}
            </p>
            <p className="mt-2 text-xs text-[var(--cocoa-soft)]">
              From: Lily&apos;s Sweet Treats · Subject: You&apos;re all set
            </p>
          </div>
        ) : null}

        {ok ? (
          <p className="mt-5 text-sm leading-relaxed text-[var(--cocoa-soft)]">
            <span className="font-semibold text-[var(--cocoa)]">Pickup</span>
            <br />
            Porch pickup at
            <br />
            <span className="mt-1 block font-semibold text-[var(--cocoa)]">
              {site.addressLine}
            </span>
            <span className="mt-1 block text-xs">
              {emailSentToCustomer
                ? "This address is also in your confirmation email."
                : "We will also share the address by phone or email if needed."}
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
