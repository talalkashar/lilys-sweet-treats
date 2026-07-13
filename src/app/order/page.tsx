import Link from "next/link";
import { Suspense } from "react";
import { OrderForm } from "@/components/OrderForm";
import { site } from "@/data/site";

export const metadata = {
  title: `Order pickup | ${site.name}`,
  description: "Pre-order and pay for porch pickup.",
};

export default function OrderPage() {
  return (
    <div className="min-h-[70vh] bg-[var(--cream)]">
      <div className="shell py-10 sm:py-14">
        <Link
          href="/#menu"
          className="text-sm font-medium text-[var(--cocoa-soft)] transition hover:text-[var(--rose)]"
        >
          ← Back to menu
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-14">
          <aside className="lg:sticky lg:top-28">
            <p className="section-label">Checkout</p>
            <h1 className="section-title mt-2">Order for pickup</h1>
            <p className="prose-soft mt-4">
              Choose your treats, pick a window, and pay here. We bake for your
              slot. No delivery.
            </p>

            <ol className="mt-8 space-y-3 text-sm text-[var(--cocoa-soft)]">
              {[
                "Enter your details and choose a treat",
                "Pay securely on this page",
                "Pick up at the porch when ready",
              ].map((line, i) => (
                <li
                  key={line}
                  className="flex gap-3 rounded-xl border border-[var(--blush)]/40 bg-white px-4 py-3"
                >
                  <span className="font-semibold text-[var(--rose)]">
                    {i + 1}
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ol>

            <p className="mt-8 text-sm text-[var(--ink-muted)]">
              {site.leadTime}
              <br />
              {site.pickupNote}
            </p>
          </aside>

          <div className="min-w-0">
            <Suspense
              fallback={
                <div className="form-shell p-10 text-center text-[var(--cocoa-soft)]">
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
