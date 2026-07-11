import { OrderForm } from "@/components/OrderForm";
import { products } from "@/data/products";
import { site } from "@/data/site";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--blush)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#f8dfe4_0%,_transparent_55%),radial-gradient(ellipse_at_bottom_left,_#e8f2ee_0%,_transparent_50%)]" />
        <div className="relative mx-auto grid max-w-5xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="inline-flex items-center rounded-full border border-[var(--blush)] bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--rose)]">
              Pre-order · Porch pickup only
            </p>
            <h1 className="mt-5 font-display text-5xl leading-[1.05] text-[var(--cocoa)] sm:text-6xl">
              Sweet treats,{" "}
              <span className="text-[var(--rose)]">ready for pickup</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-[var(--cocoa-soft)]">
              {site.tagline}. Order online, pay when checkout is live, and grab
              your goodies from the porch — no delivery, just fresh local
              baking.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#order"
                className="rounded-full bg-[var(--rose)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--rose-deep)]"
              >
                Start an order
              </a>
              <a
                href="#menu"
                className="rounded-full border border-[var(--blush)] bg-white/80 px-6 py-3 text-sm font-semibold text-[var(--cocoa)] transition hover:bg-white"
              >
                See the menu
              </a>
            </div>
            <p className="mt-6 text-sm text-[var(--cocoa-soft)]">
              {site.locationNote}
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-[var(--blush)] to-[var(--mint)] opacity-70 blur-sm" />
            <div className="relative rounded-[1.75rem] border border-white/80 bg-white/90 p-8 shadow-xl backdrop-blur">
              <p className="font-display text-3xl text-[var(--cocoa)]">
                {site.name}
              </p>
              <ul className="mt-6 space-y-4 text-sm text-[var(--cocoa-soft)]">
                <li className="flex gap-3">
                  <span className="text-xl" aria-hidden>
                    🧁
                  </span>
                  <span>
                    <strong className="text-[var(--cocoa)]">Handmade</strong> —
                    small-batch treats, not grocery-store cakes
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-xl" aria-hidden>
                    🏡
                  </span>
                  <span>
                    <strong className="text-[var(--cocoa)]">Porch pickup</strong>{" "}
                    — pay online (soon), pick up in person
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-xl" aria-hidden>
                    📅
                  </span>
                  <span>
                    <strong className="text-[var(--cocoa)]">Pre-order</strong> —{" "}
                    {site.leadTime}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--rose)]">
            Menu
          </p>
          <h2 className="mt-2 font-display text-4xl text-[var(--cocoa)]">
            Today&apos;s favorites
          </h2>
          <p className="mt-3 text-[var(--cocoa-soft)]">
            Starting lineup — names, prices, and photos will match Lily&apos;s
            real menu as she sends them over.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <article
              key={p.id}
              className="group flex flex-col rounded-3xl border border-[var(--blush)] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-28 items-center justify-center rounded-2xl bg-[var(--cream-deep)] text-5xl">
                <span aria-hidden>{p.emoji}</span>
              </div>
              <div className="mt-5 flex items-start justify-between gap-2">
                <h3 className="font-display text-2xl text-[var(--cocoa)]">
                  {p.name}
                </h3>
                {p.popular ? (
                  <span className="shrink-0 rounded-full bg-[var(--mint)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--cocoa)]">
                    Popular
                  </span>
                ) : null}
              </div>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--cocoa-soft)]">
                {p.description}
              </p>
              <div className="mt-5 flex items-center justify-between">
                <p className="text-lg font-semibold text-[var(--cocoa)]">
                  ${p.price.toFixed(2)}
                </p>
                <a
                  href="#order"
                  className="text-sm font-semibold text-[var(--rose)] hover:text-[var(--rose-deep)]"
                >
                  Order →
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-y border-[var(--blush)] bg-[var(--cream-deep)]/60"
      >
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="text-center font-display text-4xl text-[var(--cocoa)]">
            How it works
          </h2>
          <ol className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              {
                n: "1",
                t: "Choose your treats",
                d: "Pick from the menu and add any flavor or cake notes.",
              },
              {
                n: "2",
                t: "Pick a pickup window",
                d: "Tell us when you’ll stop by. We bake with your time in mind.",
              },
              {
                n: "3",
                t: "Pay & porch pickup",
                d: "Online payment is next via Stripe. Then grab your order from the porch — no delivery.",
              },
            ].map((step) => (
              <li
                key={step.n}
                className="rounded-3xl border border-[var(--blush)] bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[var(--rose)] font-semibold text-white">
                  {step.n}
                </div>
                <h3 className="mt-4 font-display text-2xl text-[var(--cocoa)]">
                  {step.t}
                </h3>
                <p className="mt-2 text-sm text-[var(--cocoa-soft)]">{step.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Order */}
      <section id="order" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--rose)]">
            Pre-order
          </p>
          <h2 className="mt-2 font-display text-4xl text-[var(--cocoa)]">
            Request your pickup
          </h2>
          <p className="mt-3 text-[var(--cocoa-soft)]">
            {site.pickupNote} Card checkout connects after Lily finishes Stripe
            setup.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl">
          <OrderForm />
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="border-t border-[var(--blush)] bg-white"
      >
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6">
          <h2 className="font-display text-4xl text-[var(--cocoa)]">Say hello</h2>
          <p className="mx-auto mt-3 max-w-md text-[var(--cocoa-soft)]">
            Questions about custom orders or pickup? Reach out — real contact
            info goes here once Lily confirms.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${site.email}`}
              className="rounded-full border border-[var(--blush)] px-5 py-2.5 text-sm font-semibold text-[var(--cocoa)] hover:bg-[var(--cream)]"
            >
              {site.email}
            </a>
            <a
              href={`tel:${site.phone.replace(/\D/g, "")}`}
              className="rounded-full border border-[var(--blush)] px-5 py-2.5 text-sm font-semibold text-[var(--cocoa)] hover:bg-[var(--cream)]"
            >
              {site.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
