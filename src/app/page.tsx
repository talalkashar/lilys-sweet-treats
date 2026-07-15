import Image from "next/image";
import Link from "next/link";
import { MenuGrid } from "@/components/MenuGrid";
import { Reveal } from "@/components/Reveal";
import { availableProducts } from "@/data/products";
import { reviews } from "@/data/reviews";
import { site } from "@/data/site";

const marqueeLines = [
  "Baked with love just for you",
  "Order Monday through Wednesday by noon",
  "Pickup Friday 4–6 PM · Saturday 9–11 AM",
  "Small batches · fresh ingredients",
];

export default function Home() {
  const gallery = availableProducts.filter((p) => p.image).slice(0, 3);

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
              width={1254}
              height={1254}
              className="hero-treat-img"
              sizes="(max-width: 899px) 4.75rem, 12rem"
            />
          </div>
          <div className="hero-treat hero-treat--L2">
            <Image
              src="/brand/hero/cinnamon-roll.png"
              alt=""
              width={1254}
              height={1254}
              className="hero-treat-img"
              sizes="(max-width: 899px) 4.5rem, 11rem"
            />
          </div>
          <div className="hero-treat hero-treat--L3">
            <Image
              src="/brand/hero/macaron-bow.png"
              alt=""
              width={1254}
              height={1254}
              className="hero-treat-img"
              sizes="(max-width: 899px) 4.6rem, 10.5rem"
            />
          </div>
          <div className="hero-treat hero-treat--R1">
            <Image
              src="/brand/hero/cookie-bow.png"
              alt=""
              width={1254}
              height={1254}
              className="hero-treat-img"
              sizes="(max-width: 899px) 4.5rem, 11rem"
            />
          </div>
          <div className="hero-treat hero-treat--R2">
            <Image
              src="/brand/hero/floral-cake.png"
              alt=""
              width={1254}
              height={1254}
              className="hero-treat-img"
              sizes="(max-width: 899px) 4.6rem, 10.5rem"
            />
          </div>
          <div className="hero-treat hero-treat--R3">
            <Image
              src="/brand/hero/swiss-rolls.png"
              alt=""
              width={1254}
              height={1254}
              className="hero-treat-img"
              sizes="(max-width: 899px) 4.75rem, 12rem"
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
              Baked with love{" "}
              <span className="hero-accent">just for you!</span>
            </h1>

            <p className="anim-fade-up anim-delay-1 hero-subline">
              We bake fresh in small batches.
            </p>

            <p className="anim-fade-up anim-delay-2 hero-lead mt-6 sm:mt-7">
              {site.qualityNote}
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

      {/* Weekly schedule band — floating treats + order/pickup info */}
      <section
        className="love-banner"
        aria-label="Weekly ordering and pickup schedule"
      >
        {/* Fewer pink rolls — more motion around the edges */}
        <div className="love-banner-floaters" aria-hidden>
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className={`love-floater love-floater--drift love-floater--d${i + 1}`}
              style={{
                animationDelay: `${-i * 0.55}s`,
              }}
            >
              <Image
                src="/brand/hero/cute-cinnamon-roll.png"
                alt=""
                width={518}
                height={462}
                className="love-floater-img"
                sizes="(max-width: 640px) 3.5rem, 5.5rem"
              />
            </div>
          ))}
        </div>

        <div className="love-banner-copy">
          <p className="love-banner-kicker">From our kitchen</p>
          <h2 className="love-banner-title">
            A home bakery made to
            <span className="love-banner-title-line">sweeten your day</span>
          </h2>
          <div
            className="love-schedule"
            style={{
              backgroundColor: "#f3faf6",
              border: "2px solid #5bb88a",
              boxShadow: "0 12px 32px rgba(47, 158, 107, 0.1)",
            }}
          >
            <p className="love-schedule-line">
              <strong>Order:</strong> {site.orderingWindow}
            </p>
            <p className="love-schedule-line">
              <strong>Closes:</strong> {site.orderingClosesLabel} — pre-orders
              close promptly at noon.
            </p>
            <p className="love-schedule-line">
              <strong>Pickup:</strong> {site.pickupWindows.join(" · ")}
            </p>
            <p className="love-schedule-note">{site.locationNote}</p>
          </div>
        </div>
      </section>

      {/* STORY + food photos */}
      <section className="story-band section-pad">
        <div className="shell grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <div className="story-photo-grid">
              <div className="story-photo story-photo--main">
                {gallery[0]?.image ? (
                  <Image
                    src={gallery[0].image}
                    alt={gallery[0].name}
                    fill
                    quality={90}
                    className="story-photo-img story-photo-img--main"
                    sizes="(max-width: 1024px) 50vw, 300px"
                  />
                ) : null}
              </div>
              <div className="story-photo story-photo--wide">
                {gallery[1]?.image ? (
                  <Image
                    src={gallery[1].image}
                    alt={gallery[1].name}
                    fill
                    quality={90}
                    className="story-photo-img"
                    sizes="(max-width: 1024px) 45vw, 240px"
                  />
                ) : null}
              </div>
              <div className="story-photo story-photo--wide">
                {gallery[2]?.image ? (
                  <Image
                    src={gallery[2].image}
                    alt={gallery[2].name}
                    fill
                    quality={90}
                    className="story-photo-img"
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
                From cinnamon rolls to sticky buns, everything is prepared fresh
                to order for porch pickup.{" "}
                <span
                  className="text-highlight-soft"
                  style={{
                    backgroundColor: "#ffd6e8",
                    padding: "0.12em 0.28em",
                    borderRadius: "0.35em",
                    fontWeight: 700,
                    color: "#2c2228",
                  }}
                >
                  Be on the lookout for new flavors and let us know what
                  you&apos;d like to see on the menu next. Looking for something
                  specific? Give us a call to discuss custom flavors. We&apos;d
                  be happy to make something just for you.
                </span>
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
            <div className="menu-intro max-w-2xl">
              <p className="section-label">This week&apos;s menu</p>
              <h2 className="section-title mt-2">
                Fresh bakes for porch pickup
              </h2>
              <p className="prose-soft mt-3">
                Browse what we are baking right now. Tap a treat for details and
                ingredients, then pre-order Monday–Wednesday by noon.
              </p>
            </div>
          </Reveal>

          <MenuGrid />
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
            <p className="section-label" style={{ color: "#6f4fa0" }}>
              Ready when you are
            </p>
            <h2 className="section-title mt-2" style={{ color: "#6f4fa0" }}>
              Let&apos;s make your day sweeter
            </h2>
            <p
              className="prose-soft mx-auto mt-3 text-center"
              style={{ color: "#6f4fa0" }}
            >
              {site.thankYouNote}
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
              <Link href="/order" className="btn-primary">
                Order pickup
              </Link>
              <a
                href={`tel:${site.phone.replace(/\D/g, "")}`}
                className="btn-primary"
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
