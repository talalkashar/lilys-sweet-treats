import { MenuGrid } from "@/components/MenuGrid";
import { OrderForm } from "@/components/OrderForm";
import { Reveal } from "@/components/Reveal";
import { site } from "@/data/site";

const stripItems = [
  "Cinnamon rolls",
  "Sticky buns",
  "Cake pops",
  "Alfajores",
  "Porch pickup",
  "Handmade",
  "Pre-order",
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero-shell">
        <div className="hero-pattern" aria-hidden />
        <div className="hero-pattern-veil" aria-hidden />
        <div className="orb orb-a" aria-hidden />
        <div className="orb orb-b" aria-hidden />

        <div className="hero-content mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
          <div className="max-w-4xl">
            <p className="anim-fade-up inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/85 px-3.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--rose)] shadow-sm backdrop-blur-sm">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--rose)]" />
              Home bakery, porch pickup only
            </p>

            <h1 className="anim-fade-up anim-delay-1 mt-7 font-display text-[clamp(3rem,7vw,4.75rem)] leading-[1.02] tracking-tight text-[var(--cocoa)]">
              Handmade treats,{" "}
              <span className="hero-accent">ready for pickup</span>
            </h1>

            <p className="anim-fade-up anim-delay-2 prose-soft-wide mt-7">
              {site.name} makes small-batch sweets you pre-order online and
              collect in person. No delivery. Just fresh baking and a simple
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
              <strong className="text-[var(--cocoa)]">{site.leadTime}</strong>{" "}
              {site.locationNote}
            </p>
          </div>
        </div>
      </section>

      {/* Colorful animated strip */}
      <div className="color-strip" aria-hidden>
        <div className="marquee-track">
          {[...stripItems, ...stripItems].map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--cocoa)]"
            >
              <span className="text-white/90">✦</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* MENU */}
      <section id="menu" className="section-menu section-pad">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="orb orb-c opacity-60" aria-hidden />
          <Reveal>
            <div>
              <p className="section-label">Menu</p>
              <h2 className="section-title mt-2">What we bake</h2>
              <p className="prose-soft mt-3">
                Browse by category. Tap a treat for details and to start an order.
              </p>
            </div>
          </Reveal>

          <MenuGrid />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="section-steps section-pad">
        <div className="orb orb-a opacity-40" aria-hidden />
        <div className="orb orb-b opacity-40" aria-hidden />
        <div className="relative z-[1] mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="mx-auto max-w-xl text-center">
              <p className="section-label">How pickup works</p>
              <h2 className="section-title mt-2">Simple as 1, 2, 3</h2>
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
                bg: "from-[#ffe4f0] to-white",
                num: "bg-gradient-to-br from-[var(--rose)] to-[#c084fc]",
              },
              {
                n: "2",
                t: "Pick a window",
                d: "Choose a pickup time that works. We prepare your order for that slot.",
                bg: "from-[#e0f2fe] to-white",
                num: "bg-gradient-to-br from-[var(--sky)] to-[var(--lilac)]",
              },
              {
                n: "3",
                t: "Pay & pick up",
                d: "Complete payment online, then collect from the porch. No delivery fees.",
                bg: "from-[#d4fff0] to-white",
                num: "bg-gradient-to-br from-[var(--mint)] to-[var(--sky)]",
              },
            ].map((step, i) => (
              <Reveal key={step.n} delayMs={i * 100}>
                <li
                  className={`step-card h-full rounded-[1.5rem] border-2 border-white bg-gradient-to-br ${step.bg} p-6 shadow-[var(--shadow-soft)] sm:p-7`}
                >
                  <span
                    className={`step-num flex h-10 w-10 items-center justify-center rounded-full ${step.num} text-sm font-bold text-white shadow-md`}
                  >
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

      {/* ORDER */}
      <section id="order" className="section-order section-pad">
        <div className="orb orb-c opacity-50" aria-hidden />
        <div className="relative z-[1] mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="mx-auto max-w-xl text-center">
              <p className="section-label">Order</p>
              <h2 className="section-title mt-2">Reserve your pickup</h2>
              <p className="prose-soft mx-auto mt-3 text-center">
                {site.pickupNote} We&apos;ll confirm details by text or email.
              </p>
            </div>
          </Reveal>
          <Reveal delayMs={80}>
            <div className="mx-auto mt-10 max-w-2xl">
              <OrderForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section-contact py-14 sm:py-16">
        <div className="relative z-[1] mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6">
          <Reveal>
            <div>
              <p className="section-label">Questions?</p>
              <h2 className="mt-2 font-display text-3xl text-[var(--cocoa)] sm:text-4xl">
                Call or email us
              </h2>
              <p className="mt-2 max-w-md text-[var(--cocoa-soft)]">
                Custom requests, larger orders, or pickup questions? We are happy
                to help.
              </p>
            </div>
          </Reveal>
          <Reveal delayMs={80}>
            <div className="flex flex-col gap-3 sm:items-end">
              <a
                href={`tel:${site.phone.replace(/\D/g, "")}`}
                className="btn-primary"
              >
                {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="btn-secondary">
                {site.email}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
