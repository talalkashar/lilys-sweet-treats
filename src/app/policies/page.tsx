import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Order Policies",
  description: `Pickup, refunds, allergens, and sales tax for ${site.shortName} porch pickup.`,
};

export default function PoliciesPage() {
  return (
    <div className="section-pad">
      <article className="shell prose-soft mx-auto max-w-2xl">
        <p className="section-label">Legal</p>
        <h1 className="section-title mt-2">Order policies</h1>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">
          Last updated: July 20, 2026 · Porch pickup only · Haymarket, VA
        </p>

        <div className="mt-8 space-y-6 text-[var(--cocoa-soft)] leading-relaxed">
          <section>
            <h2 className="font-display text-xl text-[var(--cocoa)]">
              Ordering &amp; pickup
            </h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>
                Pre-orders: <strong className="text-[var(--cocoa)]">{site.orderingWindow}</strong>.
                Pre-orders close {site.orderingClosesLabel}.
              </li>
              <li>
                Pickup windows:{" "}
                {site.pickupWindows.map((w, i) => (
                  <span key={w}>
                    {i > 0 ? "; " : ""}
                    <strong className="text-[var(--cocoa)]">{w}</strong>
                  </span>
                ))}
                .
              </li>
              <li>
                Fulfillment is <strong className="text-[var(--cocoa)]">porch pickup only</strong> —
                no delivery. The full street address is shown after payment and
                in your confirmation email (not listed publicly on the homepage
                for privacy).
              </li>
              <li>
                Menu items and flavors can change weekly. Only products shown as
                available on the site can be ordered.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-[var(--cocoa)]">
              Pricing &amp; sales tax
            </h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>
                Prices are per treat; checkout sells pack sizes (4 / 8 / party
                tray of 12). Pack savings are calculated automatically.
              </li>
              <li>
                <strong className="text-[var(--cocoa)]">Virginia sales tax</strong>{" "}
                is calculated by Stripe Tax for porch pickup at our Haymarket
                location and is shown before you pay. Your card is charged{" "}
                <strong className="text-[var(--cocoa)]">subtotal + tax</strong>.
              </li>
              <li>
                The amount on the payment screen is the final charged total.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-[var(--cocoa)]">
              Payments
            </h2>
            <p className="mt-2">
              Card payments are processed securely by Stripe on this website. We
              never see or store your full card number. By placing an order you
              authorize the charge for the displayed total (including tax).
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-[var(--cocoa)]">
              Cancellations &amp; refunds
            </h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>
                Because every order is baked fresh to order,{" "}
                <strong className="text-[var(--cocoa)]">
                  sales are generally final once baking has started
                </strong>
                .
              </li>
              <li>
                If you need to cancel or change an order, contact us as soon as
                possible at{" "}
                <a
                  className="font-semibold text-[var(--rose)]"
                  href={`tel:${site.phone.replace(/\D/g, "")}`}
                >
                  {site.phone}
                </a>{" "}
                or{" "}
                <a
                  className="font-semibold text-[var(--rose)]"
                  href={`mailto:${site.email}`}
                >
                  {site.email}
                </a>
                . We will help when we still can before bake day.
              </li>
              <li>
                If we cannot fulfill your order (sold out ingredients, emergency
                closure, etc.), we will refund the amount paid or offer a
                comparable replacement with your consent.
              </li>
              <li>
                No-shows: if you miss your pickup window without notice, we may
                not be able to hold or refund the order. Call us if you are
                running late.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-[var(--cocoa)]">
              Allergens &amp; home kitchen
            </h2>
            <p className="mt-2">
              Our treats are made in a home kitchen with shared equipment and
              utensils. Products typically include flour (wheat), eggs, butter
              (milk), sugar, and other common bakery ingredients. Some items
              contain nuts;{" "}
              <strong className="text-[var(--cocoa)]">
                nut cross-contact is possible on every product
              </strong>
              .
            </p>
            <p className="mt-3">
              Ingredient lists on the menu highlight standout flavors, not a full
              lab analysis. If you have a severe allergy or dietary restriction,
              please call before ordering — we cannot guarantee allergen-free
              products.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-[var(--cocoa)]">
              Food safety
            </h2>
            <p className="mt-2">
              Treats are homemade for same-week porch pickup. Refrigerate or
              follow any care notes we provide, and enjoy promptly. We are not
              responsible for improper storage after pickup.
            </p>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/order" className="btn-primary">
            Order pickup
          </Link>
          <Link href="/privacy" className="btn-secondary">
            Privacy policy
          </Link>
        </div>
      </article>
    </div>
  );
}
