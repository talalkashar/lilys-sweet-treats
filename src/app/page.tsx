import { MenuGrid } from "@/components/MenuGrid";
import { OrderForm } from "@/components/OrderForm";
import { Reveal } from "@/components/Reveal";
import { site } from "@/data/site";

/**
 * Page structure:
 * 1. Hero — brand promise + CTAs (animated purple pattern bg)
 * 2. Menu — products + click-to-open detail modal
 * 3. How it works — pickup model
 * 4. Order — form
 * 5. Contact
 */

export default function Home() {
  return (
    <>
      {/* HERO — full-width copy, moving purple cupcake pattern */}
      <section className="hero-shell">
        <div className="hero-pattern" aria-hidden />
        <div className="hero-pattern-veil" aria-hidden />

        <div className="hero-content mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
          <div className="max-w-4xl">
            <p className="anim-fade-up inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--rose)] shadow-sm backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--rose)]" />
              Home bakery · Porch pickup only
            </p>

            <h1 className="anim-fade-up anim-delay-1 mt-7 font-display text-[clamp(3rem,7vw,4.75rem)] leading-[1.02] tracking-tight text-[var(--cocoa)]">
              Handmade treats,{" "}
              <span className="text-[var(--rose)]">ready for pickup</span>
            </h1>

            <p className="anim-fade-up anim-delay-2 prose-soft-wide mt-7">
              {site.name} makes small-batch sweets you pre-order online and
              collect in person. No delivery — just fresh baking and a simple
              porch pickup.
            </p>

            <div className="anim-fade-up anim-delay-3 mt-10 flex flex-wrap gap-3">
              <a href="#order" className="btn-primary">
                Pre-order treats
              </a>
              <a href="#menu" className="btn-secondary">
                See the menu
              </a>
            </div>

            <p className="anim-fade-up anim-delay-4 mt-10 max-w-2xl border-t border-[var(--blush)]/60 pt-7 text-sm leading-relaxed text-[var(--cocoa-soft)] sm:text-base">
              <strong className="text-[var(--cocoa)]">{site.leadTime}</strong>
              {" · "}
              {site.locationNote}
            </p>
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
              Made to order for porch pickup. Click any treat for full details —
              prices finalize when we confirm (placeholders until locked in).
            </p>
          </div>
        </Reveal>

        <MenuGrid />
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
