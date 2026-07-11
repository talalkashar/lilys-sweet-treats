import Image from "next/image";
import { OrderForm } from "@/components/OrderForm";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { products } from "@/data/products";
import { site } from "@/data/site";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--blush)]/80">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `url(${site.pattern})`,
            backgroundSize: "420px",
          }}
          aria-hidden
        />
        <div
          className="blob pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[var(--rose)]/25 blur-3xl"
          aria-hidden
        />
        <div
          className="blob pointer-events-none absolute -right-16 top-10 h-64 w-64 rounded-full bg-[var(--sky)]/40 blur-3xl"
          style={{ animationDelay: "2s" }}
          aria-hidden
        />
        <div
          className="blob pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-[var(--lavender)]/35 blur-3xl"
          style={{ animationDelay: "4s" }}
          aria-hidden
        />

        <div className="relative mx-auto grid max-w-5xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="anim-fade-up inline-flex items-center rounded-full border-2 border-white bg-gradient-to-r from-[var(--lemon)] to-[var(--peach)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--cocoa)] shadow-sm">
              Pre-order · Porch pickup only
            </p>
            <h1 className="anim-fade-up anim-delay-1 mt-5 font-display text-5xl leading-[1.05] text-[var(--cocoa)] sm:text-6xl">
              Sweet treats,{" "}
              <span className="bg-gradient-to-r from-[var(--rose)] via-[#ff6b9d] to-[var(--lavender)] bg-clip-text text-transparent">
                ready for pickup
              </span>
            </h1>
            <p className="anim-fade-up anim-delay-2 mt-5 max-w-lg text-lg leading-relaxed text-[var(--cocoa-soft)]">
              {site.tagline}. Order online, pay when checkout is live, and grab
              your goodies from the porch — no delivery, just fresh local
              baking.
            </p>
            <div className="anim-fade-up anim-delay-3 mt-8 flex flex-wrap gap-3">
              <a
                href="#order"
                className="btn-pop rounded-full bg-[var(--rose)] px-6 py-3 text-sm font-semibold text-white shadow-md"
              >
                Start an order
              </a>
              <a
                href="#menu"
                className="btn-pop rounded-full border-2 border-[var(--sky)] bg-white/90 px-6 py-3 text-sm font-semibold text-[var(--cocoa)]"
              >
                See the menu
              </a>
            </div>
            <p className="anim-fade-up anim-delay-4 mt-6 text-sm text-[var(--cocoa-soft)]">
              {site.locationNote}
            </p>
          </div>

          <div className="anim-fade-up anim-delay-2 relative mx-auto w-full max-w-md">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-[var(--rose)] via-[var(--lemon)] to-[var(--sky)] opacity-80 blur-[2px]" />
            <div className="relative overflow-hidden rounded-[1.75rem] border-2 border-white bg-white/95 p-6 shadow-xl backdrop-blur sm:p-8">
              <div className="relative mx-auto aspect-square w-full max-w-[280px]">
                <Image
                  src={site.logo}
                  alt={`${site.name} logo`}
                  fill
                  className="object-contain"
                  sizes="280px"
                  priority
                />
              </div>
              <ul className="mt-4 space-y-3 text-sm text-[var(--cocoa-soft)]">
                <li className="flex gap-3 rounded-2xl bg-[var(--mint-soft)]/80 px-3 py-2">
                  <span className="text-xl" aria-hidden>
                    🧁
                  </span>
                  <span>
                    <strong className="text-[var(--cocoa)]">Handmade</strong> —
                    cake pops, alfajores, sticky buns & more
                  </span>
                </li>
                <li className="flex gap-3 rounded-2xl bg-[var(--blush)]/50 px-3 py-2">
                  <span className="text-xl" aria-hidden>
                    🏡
                  </span>
                  <span>
                    <strong className="text-[var(--cocoa)]">Porch pickup</strong>{" "}
                    — pay online (soon), pick up in person
                  </span>
                </li>
                <li className="flex gap-3 rounded-2xl bg-[var(--sky)]/25 px-3 py-2">
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
        <Reveal>
          <div className="max-w-xl">
            <p className="text-sm font-bold uppercase tracking-wider text-[var(--rose)]">
              Menu
            </p>
            <h2 className="mt-2 font-display text-4xl text-[var(--cocoa)] sm:text-5xl">
              Today&apos;s favorites
            </h2>
            <p className="mt-3 text-[var(--cocoa-soft)]">
              Real treats from Lily&apos;s kitchen — pre-order for porch
              pickup. Prices can be confirmed anytime.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {products.map((p, i) => (
            <Reveal key={p.id} delayMs={i * 90}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-y border-[var(--blush)]/80 bg-gradient-to-b from-white/40 to-[var(--lavender)]/15"
      >
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <Reveal>
            <h2 className="text-center font-display text-4xl text-[var(--cocoa)] sm:text-5xl">
              How it works
            </h2>
            <p className="mx-auto mt-3 max-w-md text-center text-[var(--cocoa-soft)]">
              Simple flow — order, pick a time, grab from the porch.
            </p>
          </Reveal>
          <ol className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              {
                n: "1",
                t: "Choose your treats",
                d: "Pick from the menu and add any flavor or cake notes.",
                color: "from-[var(--rose)] to-[var(--peach)]",
              },
              {
                n: "2",
                t: "Pick a pickup window",
                d: "Tell us when you’ll stop by. We bake with your time in mind.",
                color: "from-[var(--sky)] to-[var(--lavender)]",
              },
              {
                n: "3",
                t: "Pay & porch pickup",
                d: "Online payment is next via Stripe. Then grab your order — no delivery.",
                color: "from-[var(--mint)] to-[var(--lemon)]",
              },
            ].map((step, i) => (
              <Reveal key={step.n} delayMs={i * 100}>
                <li className="card-lift rounded-3xl border-2 border-white bg-white/95 p-6 text-center shadow-md">
                  <div
                    className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${step.color} text-lg font-bold text-white shadow-md`}
                  >
                    {step.n}
                  </div>
                  <h3 className="mt-4 font-display text-2xl text-[var(--cocoa)]">
                    {step.t}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--cocoa-soft)]">
                    {step.d}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Order */}
      <section id="order" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-[var(--rose)]">
              Pre-order
            </p>
            <h2 className="mt-2 font-display text-4xl text-[var(--cocoa)] sm:text-5xl">
              Request your pickup
            </h2>
            <p className="mt-3 text-[var(--cocoa-soft)]">
              {site.pickupNote} Card checkout connects after Stripe is set up.
            </p>
          </div>
        </Reveal>
        <Reveal delayMs={80}>
          <div className="mx-auto mt-10 max-w-2xl">
            <OrderForm />
          </div>
        </Reveal>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="border-t border-[var(--blush)]/80 bg-gradient-to-r from-[var(--sky)]/20 via-white to-[var(--blush)]/30"
      >
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6">
          <Reveal>
            <h2 className="font-display text-4xl text-[var(--cocoa)] sm:text-5xl">
              Say hello
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[var(--cocoa-soft)]">
              Questions about custom orders or pickup? We&apos;d love to hear
              from you.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={`mailto:${site.email}`}
                className="btn-pop rounded-full border-2 border-white bg-white px-5 py-2.5 text-sm font-semibold text-[var(--cocoa)] shadow-sm"
              >
                {site.email}
              </a>
              <a
                href={`tel:${site.phone.replace(/\D/g, "")}`}
                className="btn-pop rounded-full bg-[var(--rose)] px-5 py-2.5 text-sm font-semibold text-white shadow-md"
              >
                {site.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
