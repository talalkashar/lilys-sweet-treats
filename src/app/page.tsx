import Image from "next/image";
import { OrderForm } from "@/components/OrderForm";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { products } from "@/data/products";
import { site } from "@/data/site";

/**
 * Page structure (each block must earn its place):
 * 1. Hero — who we are + what to do next + food proof
 * 2. Menu — the products (core)
 * 3. How it works — pickup model (reduces confusion)
 * 4. Order — conversion (core)
 * 5. Contact — reach Lily (core)
 *
 * Removed as redundant: marquee, 4-up trust strip, floating logo badge,
 * generic long story that only restated the menu.
 */

export default function Home() {
  const featured = products[0];
  const sideA = products[1];
  const sideB = products[2];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 top-0 h-[28rem] w-[28rem] rounded-full bg-[var(--lavender)]/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-[22rem] w-[22rem] rounded-full bg-[var(--blush)]/35 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <p className="anim-fade-up inline-flex items-center gap-2 rounded-full border border-[var(--blush)] bg-white/90 px-3.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--rose)] shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--rose)]" />
              Home bakery · Porch pickup only
            </p>

            <h1 className="anim-fade-up anim-delay-1 mt-6 font-display text-[clamp(2.75rem,6vw,4.1rem)] leading-[1.02] text-[var(--cocoa)]">
              Handmade treats,{" "}
              <span className="text-[var(--rose)]">ready for pickup</span>
            </h1>

            <p className="anim-fade-up anim-delay-2 prose-soft mt-6">
              {site.name} makes small-batch sweets you pre-order online and
              collect in person. No delivery — just fresh baking and a simple
              porch pickup.
            </p>

            <div className="anim-fade-up anim-delay-3 mt-9 flex flex-wrap gap-3">
              <a href="#order" className="btn-primary">
                Pre-order treats
              </a>
              <a href="#menu" className="btn-secondary">
                See the menu
              </a>
            </div>

            {/* One honest trust line — not vanity metrics */}
            <p className="anim-fade-up anim-delay-4 mt-8 max-w-md border-t border-[var(--blush)]/70 pt-6 text-sm leading-relaxed text-[var(--cocoa-soft)]">
              <strong className="text-[var(--cocoa)]">{site.leadTime}</strong>
              {" · "}
              {site.locationNote}
            </p>
          </div>

          {/* Food proof collage — purpose: appetite + brand quality at first glance */}
          <div className="anim-fade-up anim-delay-2 relative lg:col-span-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-[1.75rem] shadow-[var(--shadow-lift)] sm:col-span-1 sm:row-span-2 sm:aspect-auto sm:min-h-[400px]">
                <Image
                  src={featured.image!}
                  alt={featured.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--cocoa)]/50 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <p className="font-display text-2xl">{featured.name}</p>
                  <p className="mt-0.5 text-sm text-white/85">
                    From ${featured.price} · Gift-ready
                  </p>
                </div>
              </div>
              {[sideA, sideB].map((p, i) => (
                <div
                  key={p.id}
                  className={`relative aspect-square overflow-hidden rounded-[1.5rem] shadow-[var(--shadow-soft)] ${i === 1 ? "sm:translate-y-4" : ""}`}
                >
                  <Image
                    src={p.image!}
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MENU — core purpose: show what you can buy */}
      <section
        id="menu"
        className="section-pad mx-auto max-w-6xl border-t border-[var(--blush)]/40 px-4 sm:px-6"
      >
        <Reveal>
          <div>
            <p className="section-label">Menu</p>
            <h2 className="section-title mt-2">What we bake</h2>
            <p className="prose-soft mt-3">
              Made to order for porch pickup. Tap a treat to start your order —
              prices finalize when we confirm (placeholders until locked in).
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-7 sm:grid-cols-2">
          {products.map((p, i) => (
            <Reveal key={p.id} delayMs={i * 70}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS — purpose: explain pickup model for people used to delivery */}
      <section
        id="how-it-works"
        className="section-pad border-y border-[var(--blush)]/40 bg-[var(--lavender-soft)]/40"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="mx-auto max-w-xl text-center">
              <p className="section-label">How pickup works</p>
              <h2 className="section-title mt-2">Simple as 1–2–3</h2>
              <p className="prose-soft mx-auto mt-3 text-center">
                We don&apos;t deliver. You order ahead, we bake, you pick up.
              </p>
            </div>
          </Reveal>

          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                n: "1",
                t: "Choose treats",
                d: "Pick from the menu and add notes (flavors, allergies, cake messages).",
              },
              {
                n: "2",
                t: "Pick a window",
                d: "Choose a pickup time that works. We prepare your order for that slot.",
              },
              {
                n: "3",
                t: "Pay & pick up",
                d: "Complete payment online, then collect from the porch. No delivery fees.",
              },
            ].map((step, i) => (
              <Reveal key={step.n} delayMs={i * 80}>
                <li className="h-full rounded-[1.5rem] border border-white bg-white p-6 shadow-[var(--shadow-soft)] sm:p-7">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--rose)] text-sm font-bold text-white">
                    {step.n}
                  </span>
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

      {/* ORDER — core purpose: capture the request / (soon) take payment */}
      <section id="order" className="section-pad bg-[var(--cream)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="mx-auto max-w-xl text-center">
              <p className="section-label">Order</p>
              <h2 className="section-title mt-2">Reserve your pickup</h2>
              <p className="prose-soft mx-auto mt-3 text-center">
                {site.pickupNote} We&apos;ll confirm details by text or email.
              </p>
            </div>
          </Reveal>
          <Reveal delayMs={60}>
            <div className="mx-auto mt-10 max-w-2xl">
              <OrderForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTACT — purpose: questions / custom orders (not a second footer) */}
      <section id="contact" className="border-t border-[var(--blush)]/40 bg-white py-14 sm:py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6">
          <div>
            <p className="section-label">Questions?</p>
            <h2 className="mt-2 font-display text-3xl text-[var(--cocoa)] sm:text-4xl">
              Call or email us
            </h2>
            <p className="mt-2 max-w-md text-[var(--cocoa-soft)]">
              Custom requests, larger orders, or pickup questions — happy to help.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <a href={`tel:${site.phone.replace(/\D/g, "")}`} className="btn-primary">
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="btn-secondary">
              {site.email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
