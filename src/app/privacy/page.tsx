import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.shortName} collects and uses your information for porch-pickup orders.`,
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: `Privacy Policy | ${site.shortName}`,
    description: `How ${site.shortName} collects and uses your information for porch-pickup orders.`,
    url: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="section-pad">
      <article className="shell prose-soft mx-auto max-w-2xl">
        <p className="section-label">Legal</p>
        <h1 className="section-title mt-2">Privacy Policy</h1>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">
          Last updated: July 20, 2026
        </p>

        <div className="mt-8 space-y-6 text-[var(--cocoa-soft)] leading-relaxed">
          <section>
            <h2 className="font-display text-xl text-[var(--cocoa)]">
              Who we are
            </h2>
            <p className="mt-2">
              {site.name} (“we”, “us”) is a home bakery offering pre-orders for
              porch pickup in Haymarket, VA. Contact:{" "}
              <a className="font-semibold text-[var(--rose)]" href={`mailto:${site.email}`}>
                {site.email}
              </a>{" "}
              ·{" "}
              <a
                className="font-semibold text-[var(--rose)]"
                href={`tel:${site.phone.replace(/\D/g, "")}`}
              >
                {site.phone}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-[var(--cocoa)]">
              Information we collect
            </h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>
                <strong className="text-[var(--cocoa)]">Order details:</strong>{" "}
                name, phone, email, pickup window, order notes, and items
                ordered.
              </li>
              <li>
                <strong className="text-[var(--cocoa)]">Payment data:</strong>{" "}
                card payments are processed by Stripe. We do not store full card
                numbers on our servers. Stripe may receive billing details
                needed to process your payment and calculate sales tax.
              </li>
              <li>
                <strong className="text-[var(--cocoa)]">Technical data:</strong>{" "}
                basic server logs (e.g. IP address, browser type) for security
                and abuse prevention.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-[var(--cocoa)]">
              How we use your information
            </h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>Fulfill porch-pickup orders and contact you about pickup.</li>
              <li>Process payments and collect applicable Virginia sales tax.</li>
              <li>Send order confirmations (email) and bakery order alerts.</li>
              <li>Prevent fraud, rate-limit abuse, and keep the site secure.</li>
            </ul>
            <p className="mt-3">
              We do not sell your personal information. We do not use your order
              email for marketing unless you separately opt in.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-[var(--cocoa)]">
              Service providers
            </h2>
            <p className="mt-2">
              We use trusted processors to run the site:{" "}
              <strong className="text-[var(--cocoa)]">Stripe</strong> (payments
              &amp; tax),{" "}
              <strong className="text-[var(--cocoa)]">Resend</strong> (order
              emails), and{" "}
              <strong className="text-[var(--cocoa)]">Vercel</strong> (website
              hosting). Each processes data only as needed to provide their
              service under their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-[var(--cocoa)]">
              How long we keep data
            </h2>
            <p className="mt-2">
              Order and payment records are kept as needed for baking, customer
              service, tax, and legal accounting requirements. You may email us
              to request access or correction of contact details we hold for
              recent orders.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-[var(--cocoa)]">
              Children
            </h2>
            <p className="mt-2">
              This site is not directed at children under 13. We do not knowingly
              collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-[var(--cocoa)]">
              Changes
            </h2>
            <p className="mt-2">
              We may update this policy as the business or laws change. The
              “Last updated” date at the top will change when we do.
            </p>
          </section>
        </div>

        <p className="mt-10">
          <Link href="/policies" className="btn-secondary">
            Order &amp; allergen policies
          </Link>
        </p>
      </article>
    </div>
  );
}
