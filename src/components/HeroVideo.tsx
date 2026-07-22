"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { site } from "@/data/site";

/** Bump when media is re-exported so reloads never show a stale poster/video pair. */
const MEDIA_VERSION = "3";
const POSTER_SRC = `/brand/video/peach-cobbler-roll-poster.jpg?v=${MEDIA_VERSION}`;
const VIDEO_SRC = `/brand/video/peach-cobbler-higgsfield.mp4?v=${MEDIA_VERSION}`;

/**
 * Full-bleed hero video.
 * Poster is the exact first frame of the trimmed cinema clip so reload
 * never flashes a different image before playback starts.
 */
export function HeroVideo() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [failed, setFailed] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);
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

    let cancelled = false;
    let revealed = false;

    const reveal = () => {
      if (cancelled || revealed) return;
      revealed = true;
      setMediaReady(true);
      el.muted = true;
      const play = el.play();
      if (play && typeof play.catch === "function") {
        play.catch(() => {
          /* autoplay blocked — matching poster stays */
        });
      }
    };

    el.muted = true;
    el.playsInline = true;
    el.currentTime = 0;

    // Prefer painted frames (not just metadata) before crossfade
    const onPlaying = () => reveal();
    const onLoadedData = () => {
      if (el.readyState >= 2) reveal();
    };

    el.addEventListener("playing", onPlaying);
    el.addEventListener("loadeddata", onLoadedData);

    if (el.readyState >= 2) {
      el.play()
        .then(() => reveal())
        .catch(() => {
          /* keep poster */
        });
    } else {
      el.load();
      el.play().catch(() => {
        /* keep poster until playing */
      });
    }

    return () => {
      cancelled = true;
      el.removeEventListener("playing", onPlaying);
      el.removeEventListener("loadeddata", onLoadedData);
    };
  }, [reducedMotion]);

  return (
    <section className="hero-video" aria-label={`${site.shortName} kitchen`}>
      <div className="hero-video-media-wrap">
        {/* Exact first frame of the trimmed clip — seamless with video start */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={POSTER_SRC}
          alt=""
          className="hero-video-poster"
          fetchPriority="high"
          decoding="sync"
        />

        {reducedMotion || failed ? null : (
          <video
            ref={videoRef}
            className={`hero-video-media${mediaReady ? " hero-video-media--ready" : ""}`}
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
