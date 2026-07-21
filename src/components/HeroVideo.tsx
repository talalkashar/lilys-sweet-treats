"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { site } from "@/data/site";

const POSTER_SRC = "/brand/video/peach-cobbler-roll-poster.jpg";
const VIDEO_SRC = "/brand/video/peach-cobbler-higgsfield.mp4";

/**
 * Full-bleed hero video — edge-to-edge under the floating header so it
 * reads as part of the top of the browser viewport.
 */
export function HeroVideo() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || reducedMotion) return;
    el.muted = true;
    el.load();
    const play = el.play();
    if (play && typeof play.catch === "function") {
      play.catch(() => {
        /* autoplay blocked */
      });
    }
  }, [reducedMotion]);

  return (
    <section className="hero-video" aria-label={`${site.shortName} kitchen`}>
      <div className="hero-video-media-wrap">
        {reducedMotion || failed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={POSTER_SRC} alt="" className="hero-video-media" />
        ) : (
          <video
            ref={videoRef}
            className="hero-video-media"
            src={VIDEO_SRC}
            poster={POSTER_SRC}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="Peach cobbler cinnamon rolls from our kitchen"
            onError={() => setFailed(true)}
          />
        )}
        <div className="hero-video-shade" aria-hidden />
        <div className="hero-video-vignette" aria-hidden />
      </div>

      <div className="hero-video-content shell">
        <div className="hero-video-brand">
          <div className="hero-video-logo">
            <Image
              src="/brand/logo-mark-hero.png"
              alt={`${site.name} logo`}
              width={1254}
              height={1254}
              priority
              quality={95}
              className="hero-video-logo-img"
              sizes="(max-width: 640px) min(42vw, 9.5rem), min(28vw, 11rem)"
            />
          </div>
          <h1 className="hero-video-title">
            Baked with love{" "}
            <span className="hero-video-title-accent">just for you</span>
          </h1>
          <p className="hero-video-sub">
            Homemade treats for porch pickup in Haymarket, VA.
          </p>
          <div className="hero-video-actions">
            <Link href="/order" className="btn-primary">
              Order pickup
            </Link>
            <Link href="#menu" className="btn-secondary hero-video-btn-ghost">
              See the menu
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
