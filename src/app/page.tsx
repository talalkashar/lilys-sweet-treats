import Image from "next/image";
import Link from "next/link";
import { MenuGrid } from "@/components/MenuGrid";
import { Reveal } from "@/components/Reveal";
import { site } from "@/data/site";

const stripItems = [
  "Cinnamon rolls",
  "Sticky buns",
  "Cake pops",
  "Alfajores",
  "Porch pickup",
  "Handmade",
];

export default function Home() {
  return (
    <>
      {/* HERO — big brand logo + copy */}
      <section className="hero-shell">
        <div className="hero-pattern" aria-hidden />
        <div className="hero-pattern-veil" aria-hidden />
        <div className="orb orb-a" aria-hidden />
        <div className="orb orb-b" aria-hidden />

        <div className="hero-content mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div className="max-w-2xl">
              <p className="anim-fade-up inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/85 px-3.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--rose)] shadow-sm backdrop-blur-sm">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--rose)]" />
                Home bakery, porch pickup only
              </p>

              <h1 className="anim-fade-up anim-delay-1 mt-6 font-display text-[clamp(2.75rem,6vw,4.25rem)] leading-[1.02] tracking-tight text-[var(--cocoa)]">
                Handmade treats,{" "}
                <span className="hero-accent">ready for pickup</span>
              </h1>

              <p className="anim-fade-up anim-delay-2 prose-soft-wide mt-6">
                {site.name} makes small-batch sweets you pre-order online and
                collect in person. No delivery. Just fresh baking and a simple
                porch pickup.
              </p>

              <div className="anim-fade-up anim-delay-3 mt-9 flex flex-wrap gap-3">
                <Link href="/order" className="btn-primary">
                  Order and pay
                </Link>
                <a href="#menu" className="btn-secondary">
                  See the menu
                </a>
              </div>

              <p className="anim-fade-up anim-delay-4 mt-9 max-w-2xl border-t border-[var(--blush)]/60 pt-6 text-sm leading-relaxed text-[var(--cocoa-soft)] sm:text-base">
                <strong className="text-[var(--cocoa)]">{site.leadTime}</strong>{" "}
                {site.locationNote}
              </p>
            </div>

            {/* Large brand logo */}
            <div className="anim-fade-up anim-delay-2 mx-auto w-full max-w-md lg:max-w-none">
              <div className="relative mx-auto aspect-[17/10] w-full overflow-hidden rounded-[1.75rem] border-4 border-white shadow-[var(--shadow-lift)] sm:aspect-[16/10]">
                <Image
                  src={site.logoFull}
                  alt={`${site.name} logo`}
                  fill
                  priority
                  quality={95}
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 90vw, 480px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="section-label">Menu</p>
                <h2 className="section-title mt-2">What we bake</h2>
                <p className="prose-soft mt-3">
                  Browse by category. Open a treat for details, then order when
                  you are ready.
                </p>
              </div>
              <Link href="/order" className="btn-primary shrink-0 self-start sm:self-auto">
                Order and pay
              </Link>
            </div>
          </Reveal>

          <MenuGrid />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="section-steps section-pad">
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
                d: "Pick from the menu and add any notes you need.",
                bg: "from-[#ffe4f0] to-white",
                num: "bg-gradient-to-br from-[var(--rose)] to-[#c084fc]",
              },
              {
                n: "2",
                t: "Pay online",
                d: "Checkout on a dedicated order page. Secure and simple.",
                bg: "from-[#e0f2fe] to-white",
                num: "bg-gradient-to-br from-[var(--sky)] to-[var(--lilac)]",
              },
              {
                n: "3",
                t: "Porch pickup",
                d: "We confirm your window. You collect when ready.",
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

          <Reveal>
            <div className="mt-12 text-center">
              <Link href="/order" className="btn-primary">
                Start your order
              </Link>
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
