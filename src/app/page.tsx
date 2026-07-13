import Image from "next/image";
import Link from "next/link";
import { MenuGrid } from "@/components/MenuGrid";
import { Reveal } from "@/components/Reveal";
import { site } from "@/data/site";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero-shell">
        <div className="hero-pattern" aria-hidden />
        <div className="hero-pattern-veil" aria-hidden />

        <div className="hero-content shell section-pad">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="anim-fade-up section-label">
                Home bakery · Porch pickup
              </p>

              <h1 className="anim-fade-up anim-delay-1 mt-4 font-display text-[clamp(2.6rem,5.5vw,3.75rem)] leading-[1.05] tracking-tight text-[var(--cocoa)]">
                Handmade treats,{" "}
                <span className="hero-accent">ready for pickup</span>
              </h1>

              <p className="anim-fade-up anim-delay-2 prose-soft mt-5">
                Pre-order cinnamon rolls, sticky buns, and specialty sweets.
                Pay online, pick up in person. No delivery.
              </p>

              <div className="anim-fade-up anim-delay-3 mt-8 flex flex-wrap gap-3">
                <Link href="/order" className="btn-primary">
                  Order and pay
                </Link>
                <a href="#menu" className="btn-secondary">
                  Browse the menu
                </a>
              </div>

              <p className="anim-fade-up anim-delay-4 mt-8 text-sm text-[var(--cocoa-soft)]">
                {site.leadTime}
              </p>
            </div>

            <div className="anim-fade-up anim-delay-2">
              <div className="logo-frame relative mx-auto aspect-[17/10] w-full max-w-lg lg:max-w-none">
                <Image
                  src={site.logoFull}
                  alt={`${site.name} logo`}
                  fill
                  priority
                  quality={95}
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 90vw, 520px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="brand-divider" aria-hidden />

      {/* MENU */}
      <section id="menu" className="section-menu section-pad">
        <div className="shell">
          <Reveal>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="section-label">Menu</p>
                <h2 className="section-title mt-2">What we bake</h2>
                <p className="prose-soft mt-3">
                  Open any treat for details. When you are ready, head to
                  checkout.
                </p>
              </div>
              <Link href="/order" className="btn-primary shrink-0 self-start">
                Order and pay
              </Link>
            </div>
          </Reveal>

          <MenuGrid />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="section-steps section-pad">
        <div className="shell">
          <Reveal>
            <div className="mx-auto max-w-xl text-center">
              <p className="section-label">How it works</p>
              <h2 className="section-title mt-2">Order in three steps</h2>
              <p className="prose-soft mx-auto mt-3 text-center">
                Simple porch pickup. No delivery, no hassle.
              </p>
            </div>
          </Reveal>

          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                n: "1",
                t: "Choose treats",
                d: "Browse the menu and pick what you want.",
              },
              {
                n: "2",
                t: "Pay online",
                d: "Secure checkout on our order page.",
              },
              {
                n: "3",
                t: "Porch pickup",
                d: "We bake for your window. You pick up.",
              },
            ].map((step, i) => (
              <Reveal key={step.n} delayMs={i * 80}>
                <li className="step-card h-full p-6 sm:p-7">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--rose)] text-sm font-bold text-white">
                    {step.n}
                  </span>
                  <h3 className="mt-4 font-display text-xl text-[var(--cocoa)] sm:text-2xl">
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
            <div className="mt-11 text-center">
              <Link href="/order" className="btn-primary">
                Start your order
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section-contact section-pad">
        <div className="shell flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <Reveal>
            <div>
              <p className="section-label">Contact</p>
              <h2 className="section-title mt-2">Questions?</h2>
              <p className="prose-soft mt-3">
                Custom orders or pickup details? Reach out anytime.
              </p>
            </div>
          </Reveal>
          <Reveal delayMs={60}>
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
