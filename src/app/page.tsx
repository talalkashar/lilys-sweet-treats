import Image from "next/image";
import Link from "next/link";
import { MenuGrid } from "@/components/MenuGrid";
import { Reveal } from "@/components/Reveal";
import { site } from "@/data/site";

export default function Home() {
  return (
    <>
      <section className="hero-shell">
        <div className="hero-pattern" aria-hidden />
        <div className="hero-pattern-veil" aria-hidden />

        <div className="hero-content shell section-pad">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="max-w-xl">
              <p className="anim-fade-up section-label">
                Home bakery, porch pickup
              </p>

              <h1 className="anim-fade-up anim-delay-1 hero-title mt-3">
                Handmade treats,{" "}
                <span className="hero-accent">ready for pickup</span>
              </h1>

              <p className="anim-fade-up anim-delay-2 prose-soft mt-4">
                Pre-order cinnamon rolls, sticky buns, and specialty sweets.
                Pay online, pick up in person. No delivery.
              </p>

              <div className="anim-fade-up anim-delay-3 mt-7 flex flex-wrap gap-2.5">
                <Link href="/order" className="btn-primary">
                  Order and pay
                </Link>
                <a href="#menu" className="btn-secondary">
                  Browse the menu
                </a>
              </div>

              <p className="anim-fade-up anim-delay-4 mt-6 text-sm leading-relaxed text-[var(--cocoa-soft)]">
                {site.leadTime}
              </p>
            </div>

            <div className="anim-fade-up anim-delay-2 w-full">
              <div className="logo-frame">
                <Image
                  src={site.logoFull}
                  alt={`${site.name} logo`}
                  fill
                  priority
                  quality={95}
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) min(90vw, 22rem), 22rem"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="brand-divider" aria-hidden />

      <section id="menu" className="section-menu section-pad">
        <div className="shell">
          <Reveal>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
              <div className="max-w-lg">
                <p className="section-label">Menu</p>
                <h2 className="section-title mt-2">What we bake</h2>
                <p className="prose-soft mt-2.5">
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

      <section id="how-it-works" className="section-steps section-pad">
        <div className="shell">
          <Reveal>
            <div className="mx-auto max-w-md text-center">
              <p className="section-label">How it works</p>
              <h2 className="section-title mt-2">Order in three steps</h2>
              <p className="prose-soft mx-auto mt-2.5 text-center">
                Simple porch pickup. No delivery.
              </p>
            </div>
          </Reveal>

          <ol className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
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
              <Reveal key={step.n} delayMs={i * 70}>
                <li className="step-card h-full">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--rose)] text-xs font-bold text-white">
                    {step.n}
                  </span>
                  <h3 className="mt-3 font-display text-lg text-[var(--cocoa)]">
                    {step.t}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--cocoa-soft)]">
                    {step.d}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal>
            <div className="mt-10 text-center">
              <Link href="/order" className="btn-primary">
                Start your order
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="contact" className="section-contact section-pad">
        <div className="shell flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <Reveal>
            <div className="max-w-md">
              <p className="section-label">Contact</p>
              <h2 className="section-title mt-2">Questions?</h2>
              <p className="prose-soft mt-2.5">
                Custom orders or pickup details? Reach out anytime.
              </p>
            </div>
          </Reveal>
          <Reveal delayMs={50}>
            <div className="flex flex-col gap-2.5 sm:items-end">
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
