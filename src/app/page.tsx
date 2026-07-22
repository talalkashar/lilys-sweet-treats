import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MenuGrid } from "@/components/MenuGrid";
import { Reveal } from "@/components/Reveal";
import { HeroVideo } from "@/components/HeroVideo";
import { reviews } from "@/data/reviews";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: {
    absolute: site.searchTitle,
  },
  description: site.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: site.searchTitle,
    description: site.description,
    url: site.url,
    images: [
      {
        url: site.ogImage,
        width: 1200,
        height: 630,
        alt: "Fresh homemade cinnamon rolls from Lily's Sweet Treats in Haymarket, VA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.searchTitle,
    description: site.description,
    images: [site.ogImage],
  },
};

const marqueeLines = [
  "Order Monday–Wednesday by noon",
  "Pickup Friday 4–6 PM · Saturday 9–11 AM",
  "Haymarket, VA · porch pickup only",
];

const storyCollage = [
  {
    src: "/brand/story/tray-rolls-v4.jpg",
    alt: "Fresh tray of strawberry cinnamon rolls just out of the oven",
    slot: "main" as const,
  },
  {
    src: "/products/peach-main-studio-v2.jpg",
    alt: "Peach cobbler cinnamon roll",
    slot: "wide" as const,
    // Keep peach toppings in frame (same as menu product crop)
    objectPosition: "center 22%",
  },
  {
    src: "/products/strawberry-main-studio-v2.jpg",
    alt: "Strawberry cinnamon roll with cream cheese frosting and jam",
    slot: "wide" as const,
  },
];

export default function Home() {
  const storyMain = storyCollage.find((p) => p.slot === "main")!;
  const storyWide = storyCollage.filter((p) => p.slot === "wide");

  return (
    <>
        {/* Full-bleed kitchen video hero — flush with top of browser under header */}
      <HeroVideo />
     {/* Schedule marquee */}
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

      {/* Weekly schedule */}
      <section
        className="love-banner"
        aria-label="Weekly ordering and pickup schedule"
      >
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
          <p className="love-banner-kicker">This week</p>
          <h2 className="love-banner-title">
            How ordering works
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
              <strong>Order:</strong> Monday–Wednesday by noon
            </p>
            <p className="love-schedule-line">
              <strong>Pickup:</strong> Friday 4–6 PM or Saturday 9–11 AM
            </p>
            <p className="love-schedule-note">
              We bake your order fresh for the weekend.
            </p>
          </div>
        </div>
      </section>

      {/* Kitchen photos + custom orders — images left, copy right on desktop */}
      <section className="story-band section-pad" aria-label="From our kitchen">
        <div className="shell">
          <div className="story-band-row">
            <div className="story-photo-grid">
              <div className="story-photo story-photo--main">
                <Image
                  src={storyMain.src}
                  alt={storyMain.alt}
                  fill
                  quality={90}
                  className="story-photo-img story-photo-img--main"
                  sizes="(max-width: 1024px) 55vw, 420px"
                />
              </div>
              {storyWide.map((photo) => (
                <div key={photo.src} className="story-photo story-photo--wide">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    quality={90}
                    className="story-photo-img"
                    style={
                      photo.objectPosition
                        ? { objectPosition: photo.objectPosition }
                        : undefined
                    }
                    sizes="(max-width: 1024px) 45vw, 340px"
                  />
                </div>
              ))}
            </div>

            <Reveal delayMs={120} className="story-band-copy">
              <div>
                <p className="section-label">Custom flavors</p>
                <h2 className="section-title mt-2">
                  Want something special?
                </h2>
                <p className="prose-soft mt-4">
                  Menu rotates weekly. Looking for a flavor you don&apos;t see?
                  Call us — we&apos;re happy to talk through custom orders when
                  we can.
                </p>
                <div className="mt-7 flex flex-wrap gap-2.5">
                  <Link href="#menu" className="btn-secondary">
                    See the menu
                  </Link>
                  <a
                    href={`tel:${site.phone.replace(/\D/g, "")}`}
                    className="btn-primary"
                  >
                    Call {site.phone}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="brand-divider" aria-hidden />

      {/* MENU */}
      <section id="menu" className="section-menu section-pad section-menu--dense">
        <div className="shell menu-shell">
          <Reveal>
            <div className="menu-intro">
              <p className="section-label">Menu</p>
              <h2 className="section-title mt-2">What we&apos;re baking</h2>
              <p className="prose-soft mt-3">
                Tap a treat for details, then pre-order in packs of 2, 4, 6, 8,
                or 12. Flavors come in pairs of two of the same kind — mix pairs
                in larger packs.
              </p>
            </div>
          </Reveal>

          <MenuGrid />
        </div>
      </section>

      {/* Reviews — note-style quotes, not equal SaaS cards */}
      <section id="reviews" className="section-reviews section-pad">
        <div className="shell relative">
          <Reveal>
            <div className="reviews-header">
              <p className="section-label">From the porch</p>
              <h2 className="section-title mt-2">What guests say</h2>
              <p className="prose-soft reviews-header-lead mt-3">
                Real weekend pickups from neighbors around Haymarket.
              </p>
            </div>
          </Reveal>

          <div className="reviews-board mt-8">
            {reviews.map((review, i) => (
              <Reveal key={review.id} delayMs={i * 70}>
                <figure
                  className={`review-note review-note--${(i % 6) + 1}${
                    i === 0 ? " review-note--featured" : ""
                  }`}
                >
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
                    <span className="review-name">{review.name}</span>
                    {review.place ? (
                      <span className="review-place"> · {review.place}</span>
                    ) : null}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-band section-pad">
        <div className="shell text-center">
          <Reveal>
            <h2 className="section-title" style={{ color: "#6f4fa0" }}>
              Ready to order?
            </h2>
            <p
              className="prose-soft mx-auto mt-3 text-center"
              style={{ color: "#6f4fa0" }}
            >
              Pre-order by Wednesday noon for weekend pickup.
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
