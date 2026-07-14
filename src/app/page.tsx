import Image from "next/image";
import Link from "next/link";
import { MenuGrid } from "@/components/MenuGrid";
import { Reveal } from "@/components/Reveal";
import { products } from "@/data/products";
import { site } from "@/data/site";

const marqueeLine = "Made fresh for porch pickup";

export default function Home() {
  const gallery = products.filter((p) => p.image).slice(0, 3);

  return (
    <>
      {/* HERO — identity + logo (inspired by Dolce: clear “who we are” + order CTA) */}
      <section className="hero-shell">
        <div className="hero-pattern" aria-hidden />
        <div className="hero-pattern-veil" aria-hidden />

        <div className="hero-content shell section-pad">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="max-w-xl">
              <p className="anim-fade-up section-label">We are {site.shortName}</p>

              <h1 className="anim-fade-up anim-delay-1 hero-title mt-3">
                A home bakery made to{" "}
                <span className="hero-accent">sweeten your day</span>
              </h1>

              <p className="anim-fade-up anim-delay-2 prose-soft mt-4">
                Small-batch cinnamon rolls, sticky buns, cake pops, and
                alfajores. Pre-order online and pick up in person. Every bite is
                baked fresh for you.
              </p>

              <div className="anim-fade-up anim-delay-3 mt-7 flex flex-wrap gap-2.5">
                <Link href="/order" className="btn-primary">
                  Order pickup
                </Link>
                <a href="#menu" className="btn-secondary">
                  View menu
                </a>
              </div>

              <p className="anim-fade-up anim-delay-4 mt-6 text-sm text-[var(--cocoa-soft)]">
                {site.leadTime} {site.pickupNote}
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
                  className="object-contain object-center"
                  sizes="(max-width: 768px) 90vw, 448px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee like Dolce’s “every bite is made fresh” */}
      <div className="marquee-bar" aria-hidden>
        <div className="marquee-track">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i}>
              {marqueeLine}
              <span className="mx-3 opacity-40">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* STORY + food photos (Dolce-style photo storytelling) */}
      <section className="story-band section-pad">
        <div className="shell grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="story-photo story-photo--main relative col-span-1 row-span-2">
                {gallery[0]?.image ? (
                  <Image
                    src={gallery[0].image}
                    alt={gallery[0].name}
                    fill
                    quality={90}
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 280px"
                  />
                ) : null}
              </div>
              <div className="story-photo story-photo--wide relative">
                {gallery[1]?.image ? (
                  <Image
                    src={gallery[1].image}
                    alt={gallery[1].name}
                    fill
                    quality={90}
                    className="object-cover"
                    sizes="(max-width: 1024px) 45vw, 240px"
                  />
                ) : null}
              </div>
              <div className="story-photo story-photo--wide relative">
                {gallery[2]?.image ? (
                  <Image
                    src={gallery[2].image}
                    alt={gallery[2].name}
                    fill
                    quality={90}
                    className="object-cover"
                    sizes="(max-width: 1024px) 45vw, 240px"
                  />
                ) : null}
              </div>
            </div>
          </Reveal>

          <Reveal delayMs={80}>
            <div>
              <p className="section-label">From our kitchen</p>
              <h2 className="section-title mt-2">
                Every treat is made fresh, right here
              </h2>
              <p className="prose-soft mt-4">
                From apple caramel and peach cobbler cinnamon rolls to sticky
                buns, cake pop bouquets, and classic alfajores, everything is
                prepared to order for porch pickup. No storefront rush. Just
                careful baking for your day.
              </p>
              <Link href="#menu" className="btn-secondary mt-7">
                Explore the menu
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="brand-divider" aria-hidden />

      {/* MENU */}
      <section id="menu" className="section-menu section-pad">
        <div className="shell">
          <Reveal>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
              <div className="max-w-lg">
                <p className="section-label">Menu</p>
                <h2 className="section-title mt-2">
                  From scratch treats for pickup
                </h2>
                <p className="prose-soft mt-2.5">
                  Browse by category. Tap a treat for details, then order when
                  you are ready.
                </p>
              </div>
              <Link href="/order" className="btn-primary shrink-0 self-start">
                Order pickup
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
            <div className="mx-auto max-w-md text-center">
              <p className="section-label">How pickup works</p>
              <h2 className="section-title mt-2">Simple as 1, 2, 3</h2>
              <p className="prose-soft mx-auto mt-2.5 text-center">
                Order ahead. We bake. You pick up.
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
                d: "We bake for your window. You collect.",
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
        </div>
      </section>

      {/* CTA band (Dolce: “Let’s make your day sweeter”) */}
      <section className="cta-band section-pad">
        <div className="shell text-center">
          <Reveal>
            <p className="section-label">Ready when you are</p>
            <h2 className="section-title mt-2">Let&apos;s make your day sweeter</h2>
            <p className="prose-soft mx-auto mt-3 text-center">
              Pre-order online for porch pickup. We will confirm your order and
              have it ready for you.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
              <Link href="/order" className="btn-primary">
                Order pickup
              </Link>
              <a
                href={`tel:${site.phone.replace(/\D/g, "")}`}
                className="btn-secondary"
              >
                Call {site.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section-contact section-pad">
        <div className="shell grid gap-8 sm:grid-cols-2 sm:items-start sm:gap-12">
          <Reveal>
            <div>
              <p className="section-label">Contact</p>
              <h2 className="section-title mt-2">Say hello</h2>
              <p className="prose-soft mt-2.5">
                Questions about custom orders or pickup? We are happy to help.
              </p>
            </div>
          </Reveal>
          <Reveal delayMs={50}>
            <ul className="space-y-4 text-sm sm:text-base">
              <li>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                  Email
                </p>
                <a
                  className="font-medium text-[var(--cocoa)] hover:text-[var(--rose)]"
                  href={`mailto:${site.email}`}
                >
                  {site.email}
                </a>
              </li>
              <li>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                  Phone
                </p>
                <a
                  className="font-medium text-[var(--cocoa)] hover:text-[var(--rose)]"
                  href={`tel:${site.phone.replace(/\D/g, "")}`}
                >
                  {site.phone}
                </a>
              </li>
              <li>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                  Pickup
                </p>
                <p className="font-medium text-[var(--cocoa)]">
                  {site.pickupNote}
                </p>
              </li>
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}
