import Link from "next/link";
import { Suspense } from "react";
import { OrderForm } from "@/components/OrderForm";
import { site } from "@/data/site";

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
          <aside className="lg:sticky lg:top-32">
            <p className="section-label">Checkout</p>
            <h1 className="section-title mt-2">Order for pickup</h1>
            <p className="prose-soft mt-3">
              {site.qualityNote} Order Monday–Wednesday by noon, then choose a
              Friday or Saturday pickup window.
            </p>

            <ol className="mt-6 space-y-2 text-sm text-[var(--cocoa-soft)]">
              {[
                "Pick a flavor + pack (4, 8, or party tray of 12)",
                "Pay securely on this page",
                "Pick up Friday 4–6 PM or Saturday 9–11 AM",
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
                Ordering window
              </p>
              <p className="mt-1.5 font-medium text-[var(--cocoa)]">
                {site.orderingWindow}
              </p>
              <p className="mt-1 text-xs text-[var(--ink-muted)]">
                {site.orderingClosesNote}
              </p>
            </div>

            <div className="mt-3 rounded-lg border border-[var(--blush)]/40 bg-white px-3 py-3 text-sm leading-relaxed text-[var(--cocoa-soft)]">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                Pack deals
              </p>
              <p className="mt-1.5 font-medium text-[var(--cocoa)]">
                4-pack · 8-pack · Party tray (12)
              </p>
              <p className="mt-1 text-xs text-[var(--ink-muted)]">
                One flavor per checkout. Bigger packs unlock a little savings —
                party trays are perfect for birthdays and get-togethers.
              </p>
            </div>

            <div className="mt-3 rounded-lg border border-[var(--blush)]/40 bg-white px-3 py-3 text-sm leading-relaxed text-[var(--cocoa-soft)]">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                Pickup windows
              </p>
              <ul className="mt-1.5 space-y-1 font-medium text-[var(--cocoa)]">
                {site.pickupWindows.map((window) => (
                  <li key={window}>{window}</li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-[var(--ink-muted)]">
                {site.locationNote} Exact details are shared after you order.
              </p>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[var(--ink-muted)]">
              {site.howToOrder}
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
