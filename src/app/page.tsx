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
      {/* HERO — Dolce-inspired: copy + floating logo, treats on the sides */}
      <section className="hero-shell">
        <div className="hero-deco hero-deco--blob" aria-hidden />
        <div className="hero-deco hero-deco--dot" aria-hidden />

        {/* Bakery treats: left of text · right of logo */}
        <div className="hero-treats" aria-hidden>
          <div className="hero-treat hero-treat--L1">
            <Image
              src="/brand/hero/macaron-tower.png"
              alt=""
              width={225}
              height={239}
              className="hero-treat-img"
              sizes="(max-width: 899px) 3.5rem, 5.75rem"
            />
          </div>
          <div className="hero-treat hero-treat--L2">
            <Image
              src="/brand/hero/cinnamon-roll.png"
              alt=""
              width={208}
              height={156}
              className="hero-treat-img"
              sizes="(max-width: 899px) 3.25rem, 5.25rem"
            />
          </div>
          <div className="hero-treat hero-treat--L3">
            <Image
              src="/brand/hero/macaron-bow.png"
              alt=""
              width={196}
              height={224}
              className="hero-treat-img"
              sizes="(max-width: 899px) 3.1rem, 5rem"
            />
          </div>
          <div className="hero-treat hero-treat--R1">
            <Image
              src="/brand/hero/cookie-bow.png"
              alt=""
              width={164}
              height={229}
              className="hero-treat-img"
              sizes="(max-width: 899px) 3.25rem, 5.25rem"
            />
          </div>
          <div className="hero-treat hero-treat--R2">
            <Image
              src="/brand/hero/floral-cake.png"
              alt=""
              width={151}
              height={253}
              className="hero-treat-img"
              sizes="(max-width: 899px) 3.1rem, 5rem"
            />
          </div>
          <div className="hero-treat hero-treat--R3">
            <Image
              src="/brand/hero/swiss-rolls.png"
              alt=""
              width={205}
              height={146}
              className="hero-treat-img"
              sizes="(max-width: 899px) 3.5rem, 5.5rem"
            />
          </div>
        </div>

        <div className="shell hero-grid">
          {/* Copy sits beside the logo, never on top of it */}
          <div className="hero-copy">
            <p className="anim-fade-up hero-eyebrow">
              We are {site.shortName}
            </p>

            <h1 className="anim-fade-up anim-delay-1 hero-title mt-4">
              A home bakery made to{" "}
              <span className="hero-accent">sweeten your day</span>
            </h1>

            <p className="anim-fade-up anim-delay-2 hero-lead mt-5">
              Small-batch cinnamon rolls, sticky buns, cake pops, and alfajores.
              Pre-order online and pick up in person. Every bite is baked fresh
              for you.
            </p>

            <div className="anim-fade-up anim-delay-3 mt-8 flex flex-wrap gap-2.5">
              <Link href="/order" className="btn-primary">
                Order pickup
              </Link>
              <a href="#menu" className="btn-secondary">
                View menu
              </a>
            </div>

            <p className="anim-fade-up anim-delay-4 hero-meta mt-6">
              {site.leadTime} {site.pickupNote}
            </p>
          </div>

          {/* Logo cutout: floats gently up and down */}
          <div className="hero-logo-stage">
            <div className="hero-logo-glow" aria-hidden />
            <div className="hero-logo-float">
              <Image
                src="/brand/logo-mark.png"
                alt={`${site.name} logo`}
                width={811}
                height={811}
                priority
                quality={95}
                className="hero-logo-img"
                sizes="(max-width: 899px) min(72vw, 22rem), min(40vw, 26rem)"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Rainbow marquee — colorful porch pickup banner */}
      <div className="marquee-bar" aria-hidden>
        <div className="marquee-track">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="marquee-item">
              <span className="marquee-rainbow">{marqueeLine}</span>
              <span className="marquee-spark">✦</span>
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
    </>
  );
}
