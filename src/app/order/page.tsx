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
              Choose flavors and pack sizes, then pay here. Pickup is Friday or
              Saturday in Haymarket.
            </p>

            <div className="mt-6 space-y-3 text-sm leading-relaxed text-[var(--cocoa-soft)]">
              <div className="rounded-lg border border-[var(--blush)]/40 bg-white px-3 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                  Order window
                </p>
                <p className="mt-1.5 font-medium text-[var(--cocoa)]">
                  Monday–Wednesday by noon
                </p>
              </div>

              <div className="rounded-lg border border-[var(--blush)]/40 bg-white px-3 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                  Pickup
                </p>
                <ul className="mt-1.5 space-y-1 font-medium text-[var(--cocoa)]">
                  {site.pickupWindows.map((window) => (
                    <li key={window}>{window}</li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-[var(--ink-muted)]">
                  Full address is on your confirmation after payment.
                </p>
              </div>

              <div className="rounded-lg border border-[var(--blush)]/40 bg-white px-3 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                  Packs
                </p>
                <p className="mt-1.5 font-medium text-[var(--cocoa)]">
                  4-pack · 8-pack · Party tray (12)
                </p>
              </div>
            </div>
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
