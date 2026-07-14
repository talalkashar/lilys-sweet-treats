import Link from "next/link";
import { Suspense } from "react";
import { OrderForm } from "@/components/OrderForm";
import { mapsUrl, site } from "@/data/site";

export const metadata = {
  title: `Order pickup | ${site.name}`,
  description: "Pre-order and pay for porch pickup in Haymarket, VA.",
};

export default function OrderPage() {
  return (
    <div className="min-h-[70vh] bg-[var(--cream)]/80">
      <div className="shell py-8 sm:py-12">
        <Link
          href="/#menu"
          className="text-sm font-medium text-[var(--cocoa-soft)] transition hover:text-[var(--rose)]"
        >
          ← Back to menu
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,17.5rem)_minmax(0,1fr)] lg:items-start lg:gap-10">
          <aside className="lg:sticky lg:top-20">
            <p className="section-label">Checkout</p>
            <h1 className="section-title mt-2">Order for pickup</h1>
            <p className="prose-soft mt-3">
              Choose from this week&apos;s menu, pick a window, and pay here.
              Flavors rotate often, so grab what looks good now. We bake for
              your slot. No delivery.
            </p>

            <ol className="mt-6 space-y-2 text-sm text-[var(--cocoa-soft)]">
              {[
                "Enter details and choose a treat",
                "Pay securely on this page",
                "Pick up at the porch when ready",
              ].map((line, i) => (
                <li
                  key={line}
                  className="flex gap-2.5 rounded-lg border border-[var(--blush)]/40 bg-white px-3 py-2.5"
                >
                  <span className="font-semibold tabular-nums text-[var(--rose)]">
                    {i + 1}
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ol>

            <div className="mt-6 rounded-lg border border-[var(--blush)]/40 bg-white px-3 py-3 text-sm leading-relaxed text-[var(--cocoa-soft)]">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                Pickup address
              </p>
              <a
                href={mapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 block font-medium text-[var(--cocoa)] transition hover:text-[var(--rose)]"
              >
                {site.address.line1}
                <br />
                {site.address.line2}
                <br />
                {site.address.city}, {site.address.state} {site.address.zip}
              </a>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[var(--ink-muted)]">
              {site.leadTime}
              <br />
              {site.pickupNote}
            </p>
          </aside>

          <div className="min-w-0 max-w-xl lg:max-w-none">
            <Suspense
              fallback={
                <div className="form-shell p-8 text-center text-sm text-[var(--cocoa-soft)]">
                  Loading checkout…
                </div>
              }
            >
              <OrderForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
