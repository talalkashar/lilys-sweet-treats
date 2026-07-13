import Link from "next/link";
import { site } from "@/data/site";

type Props = {
  searchParams: Promise<{ payment_intent?: string; redirect_status?: string }>;
};

export default async function OrderSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const ok = params.redirect_status === "succeeded" || !params.redirect_status;

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
      <div className="rounded-[1.75rem] border-2 border-[var(--mint)] bg-[var(--mint-soft)] p-8 sm:p-10">
        <p className="text-4xl" aria-hidden>
          {ok ? "✓" : "!"}
        </p>
        <h1 className="mt-4 font-display text-3xl text-[var(--cocoa)] sm:text-4xl">
          {ok ? "Payment received" : "Payment status unclear"}
        </h1>
        <p className="mt-3 text-[var(--cocoa-soft)]">
          {ok
            ? "Thanks for your order. We will confirm pickup details by phone or email soon. Porch pickup only."
            : "If you were charged, we will still receive your order. Contact us if you need help."}
        </p>
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
          <Link href="/#order" className="btn-primary">
            Order again
          </Link>
        </div>
      </div>
    </div>
  );
}
