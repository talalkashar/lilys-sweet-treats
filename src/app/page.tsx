import Image from "next/image";
import Link from "next/link";
import { MenuGrid } from "@/components/MenuGrid";
import { Reveal } from "@/components/Reveal";
import { products } from "@/data/products";
import { reviews } from "@/data/reviews";
import { site } from "@/data/site";

const marqueeLines = [
  "Baked with love just for you",
  "Made fresh for porch pickup",
  "New flavors every week",
  "Menu rotates with the season",
];

export default function Home() {
  const gallery = products.filter((p) => p.image).slice(0, 3);

  return (
    <>
      {/* HERO — big centered logo, copy stacked below */}
      <section className="hero-shell">
        <div className="hero-deco hero-deco--blob" aria-hidden />
        <div className="hero-deco hero-deco--dot" aria-hidden />

        {/* Bakery treats frame the logo */}
        <div className="hero-treats" aria-hidden>
          <div className="hero-treat hero-treat--L1">
            <Image
              src="/brand/hero/macaron-tower.png"
              alt=""
              width={225}
              height={239}
              className="hero-treat-img"
              sizes="(max-width: 899px) 4.25rem, 10rem"
            />
          </div>
          <div className="hero-treat hero-treat--L2">
            <Image
              src="/brand/hero/cinnamon-roll.png"
              alt=""
              width={208}
              height={156}
              className="hero-treat-img"
              sizes="(max-width: 899px) 3.9rem, 9rem"
            />
          </div>
          <div className="hero-treat hero-treat--L3">
            <Image
              src="/brand/hero/macaron-bow.png"
              alt=""
              width={196}
              height={224}
              className="hero-treat-img"
              sizes="(max-width: 899px) 4.1rem, 8.5rem"
            />
          </div>
          <div className="hero-treat hero-treat--R1">
            <Image
              src="/brand/hero/cookie-bow.png"
              alt=""
              width={164}
              height={229}
              className="hero-treat-img"
              sizes="(max-width: 899px) 3.9rem, 9rem"
            />
          </div>
          <div className="hero-treat hero-treat--R2">
            <Image
              src="/brand/hero/floral-cake.png"
              alt=""
              width={151}
              height={253}
              className="hero-treat-img"
              sizes="(max-width: 899px) 4.1rem, 8.5rem"
            />
          </div>
          <div className="hero-treat hero-treat--R3">
            <Image
              src="/brand/hero/swiss-rolls.png"
              alt=""
              width={205}
              height={146}
              className="hero-treat-img"
              sizes="(max-width: 899px) 4.25rem, 10rem"
            />
          </div>
        </div>

        <div className="shell hero-stack">
          {/* Large centered logo */}
          <div className="hero-logo-stage">
            <div className="hero-logo-glow" aria-hidden />
            <div className="hero-logo-float">
              <Image
                src="/brand/logo-mark-hero.png"
                alt={`${site.name} logo`}
                width={1254}
                height={1254}
                priority
                quality={95}
                className="hero-logo-img"
                sizes="(max-width: 640px) min(88vw, 26rem), min(70vw, 36rem)"
              />
            </div>
          </div>

          {/* Copy below logo, centered */}
          <div className="hero-copy">
            <p className="anim-fade-up hero-eyebrow">
              We are {site.shortName}
            </p>

            <h1 className="anim-fade-up anim-delay-1 hero-title mt-3">
              A home bakery made to{" "}
              <span className="hero-accent">sweeten your day</span>
            </h1>

            <p className="anim-fade-up anim-delay-2 hero-lead mt-4">
              Small-batch cinnamon rolls, sticky buns, cake pops, and alfajores.
              Pre-order online and pick up in person. We bake something new
              almost every week, so the menu stays fresh.
            </p>

            <p className="anim-fade-up anim-delay-2 hero-week-pill mt-4">
              This week&apos;s menu is up · Pre-order for porch pickup
            </p>

            <div className="anim-fade-up anim-delay-3 hero-actions mt-6">
              <Link href="/order" className="btn-primary">
                Order this week&apos;s treats
              </Link>
              <a href="#menu" className="btn-secondary">
                Browse the menu
              </a>
            </div>

            <p className="anim-fade-up anim-delay-4 hero-meta mt-5">
              {site.leadTime} {site.pickupNote}
            </p>
          </div>
        </div>
      </section>

      {/* Rainbow marquee — colorful porch pickup banner */}
      <div className="marquee-bar" aria-hidden>
        <div className="marquee-track">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="marquee-item">
              <span className="marquee-rainbow">
                {marqueeLines[i % marqueeLines.length]}
              </span>
              <span className="marquee-spark">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Client brand banner — “Baked with love just for you!” */}
      <section className="love-banner" aria-label="Baked with love just for you">
        <div className="love-banner-frame">
          <Image
            src={site.loveBanner}
            alt="Baked with love just for you! We bake fresh in small batches. Get them before it's gone!"
            width={1384}
            height={442}
            className="love-banner-img"
            sizes="(max-width: 640px) 100vw, 48rem"
            quality={92}
            priority
          />
        </div>
      </section>

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
                From cinnamon rolls and sticky buns to cake pop bouquets and
                alfajores, everything is prepared to order for porch pickup. We
                rotate flavors week to week, so there is always something new
                to try. No storefront rush. Just careful baking for your day.
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
            <div className="max-w-xl">
              <p className="section-label">This week&apos;s menu</p>
              <h2 className="section-title mt-2">
                Fresh bakes for porch pickup
              </h2>
              <p className="prose-soft mt-2.5">
                Browse what we are baking right now. Tap a treat for details and
                ingredients, then pre-order when you are ready.
              </p>
              <p className="menu-flex-note mt-3">{site.menuNote}</p>
              <Link href="/order" className="btn-primary mt-5 inline-flex">
                Pre-order pickup
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
                d: "Browse this week's menu and pick what you want.",
              },
              {
                n: "2",
                t: "Pay online",
                d: "Secure checkout on our order page.",
              },
              {
                n: "3",
                t: "Porch pickup",
                d: `We bake for your window. Pickup at ${site.address.line1}, ${site.address.city}.`,
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

      {/* Guest reviews */}
      <section id="reviews" className="section-reviews section-pad">
        <div className="section-reviews-glow" aria-hidden />
        <div className="shell relative">
          <Reveal>
            <div className="reviews-header">
              <p className="section-label">From our guests</p>
              <h2 className="section-title mt-2">
                Sweet words from people nearby
              </h2>
              <p className="prose-soft mx-auto mt-2.5 text-center">
                A few notes from folks who have ordered for porch pickup.
              </p>
              <div className="reviews-rating-pill" aria-hidden>
                <span className="reviews-rating-stars">★★★★★</span>
                <span className="reviews-rating-text">Loved by local guests</span>
              </div>
            </div>
          </Reveal>

          <div className="reviews-grid mt-10">
            {reviews.map((review, i) => {
              const initials = review.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2);

              return (
                <Reveal key={review.id} delayMs={i * 45}>
                  <figure
                    className={`review-card${i === 0 ? " review-card--featured" : ""}`}
                  >
                    <span className="review-mark" aria-hidden>
                      “
                    </span>

                    <div
                      className="review-stars"
                      aria-label={`${review.stars} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }).map((_, s) => (
                        <span
                          key={s}
                          className={
                            s < review.stars
                              ? "review-star review-star--on"
                              : "review-star"
                          }
                          aria-hidden
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    <blockquote className="review-quote">
                      {review.quote}
                    </blockquote>

                    <figcaption className="review-author">
                      <span className="review-avatar" aria-hidden>
                        {initials}
                      </span>
                      <span className="review-meta">
                        <span className="review-name">{review.name}</span>
                        {review.place ? (
                          <span className="review-place">{review.place}</span>
                        ) : (
                          <span className="review-place">Local guest</span>
                        )}
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              );
            })}
          </div>
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
