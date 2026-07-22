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
 * iOS Safari is strict: muted + playsInline must be real DOM attributes *and*
 * element properties before play(). React's muted prop alone is not enough on
 * some WebKit builds. Gesture unlock covers Low Power Mode / blocked autoplay.
 */
function armInlinePlayback(el: HTMLVideoElement) {
  el.defaultMuted = true;
  el.muted = true;
  el.volume = 0;
  el.playsInline = true;
  el.setAttribute("muted", "");
  el.setAttribute("playsinline", "");
  el.setAttribute("webkit-playsinline", "");
}

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
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    const section = sectionRef.current;
    if (!el || reducedMotion) return;

    let cancelled = false;
    let revealed = false;
    let inView = true;

    const reveal = () => {
      if (cancelled || revealed) return;
      revealed = true;
      setMediaReady(true);
    };

    const tryPlay = () => {
      if (cancelled || !inView) return;
      armInlinePlayback(el);

      const playPromise = el.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise
          .then(() => {
            reveal();
          })
          .catch(() => {
            // Autoplay blocked (common on iOS Low Power Mode) — unlock on gesture.
          });
      }
    };

    armInlinePlayback(el);

    const onPlaying = () => {
      reveal();
    };
    const onCanPlay = () => {
      if (!revealed) tryPlay();
    };
    const onLoadedData = () => {
      if (el.readyState >= 2) tryPlay();
    };

    el.addEventListener("playing", onPlaying);
    el.addEventListener("canplay", onCanPlay);
    el.addEventListener("loadeddata", onLoadedData);

    // First attempt as soon as the element is in the tree
    tryPlay();

    // If autoplay is blocked, the first user gesture must start playback.
    // Scroll/touchstart are enough — no need to tap the video itself.
    const unlock = () => {
      if (cancelled || revealed) return;
      tryPlay();
    };
    const unlockOpts: AddEventListenerOptions = { capture: true, passive: true };
    window.addEventListener("touchstart", unlock, unlockOpts);
    window.addEventListener("pointerdown", unlock, unlockOpts);
    window.addEventListener("click", unlock, unlockOpts);
    window.addEventListener("scroll", unlock, unlockOpts);

    // Pause when offscreen so mobile scroll isn't fighting 1080p decode.
    let io: IntersectionObserver | null = null;
    if (section && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([entry]) => {
          inView = Boolean(entry?.isIntersecting);
          if (!inView) {
            el.pause();
            return;
          }
          tryPlay();
        },
        { threshold: 0.12, rootMargin: "8% 0px" },
      );
      io.observe(section);
    }

    const onVisibility = () => {
      if (document.hidden) {
        el.pause();
      } else if (inView) {
        tryPlay();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      el.removeEventListener("playing", onPlaying);
      el.removeEventListener("canplay", onCanPlay);
      el.removeEventListener("loadeddata", onLoadedData);
      window.removeEventListener("touchstart", unlock, unlockOpts);
      window.removeEventListener("pointerdown", unlock, unlockOpts);
      window.removeEventListener("click", unlock, unlockOpts);
      window.removeEventListener("scroll", unlock, unlockOpts);
      document.removeEventListener("visibilitychange", onVisibility);
      io?.disconnect();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="hero-video"
      aria-label={`${site.shortName} kitchen`}
    >
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
