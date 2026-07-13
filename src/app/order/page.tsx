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
    <div className="relative min-h-[70vh] overflow-hidden bg-gradient-to-b from-[#f5ecff] via-[#fff8fc] to-white">
      <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-[var(--rose)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-20 h-56 w-56 rounded-full bg-[var(--sky)]/15 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <Link
          href="/#menu"
          className="text-sm font-medium text-[var(--cocoa-soft)] transition hover:text-[var(--rose)]"
        >
          ← Back to menu
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-12">
          <aside className="lg:sticky lg:top-28">
            <p className="section-label">Checkout</p>
            <h1 className="section-title mt-2">Order for pickup</h1>
            <p className="prose-soft mt-4">
              Choose your treats, pick a window, and pay on this page. We bake
              for your slot. No delivery.
            </p>

            <ul className="mt-8 space-y-4 text-sm text-[var(--cocoa-soft)]">
              <li className="flex gap-3 rounded-2xl border border-white bg-white/80 px-4 py-3 shadow-[var(--shadow-soft)]">
                <span className="font-semibold text-[var(--rose)]">1</span>
                <span>Enter your details and choose a treat</span>
              </li>
              <li className="flex gap-3 rounded-2xl border border-white bg-white/80 px-4 py-3 shadow-[var(--shadow-soft)]">
                <span className="font-semibold text-[var(--rose)]">2</span>
                <span>Pay securely without leaving this site</span>
              </li>
              <li className="flex gap-3 rounded-2xl border border-white bg-white/80 px-4 py-3 shadow-[var(--shadow-soft)]">
                <span className="font-semibold text-[var(--rose)]">3</span>
                <span>We confirm and you pick up at the porch</span>
              </li>
            </ul>

            <p className="mt-8 text-sm text-[var(--ink-muted)]">
              {site.leadTime}
              <br />
              {site.pickupNote}
            </p>
          </aside>

          <div className="min-w-0">
            <Suspense
              fallback={
                <div className="rounded-[1.75rem] border-2 border-[var(--blush)] bg-white p-10 text-center text-[var(--cocoa-soft)]">
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
