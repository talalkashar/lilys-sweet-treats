"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * Kitchen loop for the story band.
 * Muted autoplay + loop. Reduced-motion users get the poster only.
 *
 * Development only: one featured player + clean clip switcher so Higgsfield
 * previews stay organized without shipping multi-clip UI to production.
 */
const POSTER_SRC = "/brand/video/peach-cobbler-roll-poster.jpg";

type Clip = {
  id: string;
  src: string;
  label: string;
  caption: string;
  poster?: string;
};

const PROD_CLIPS: Clip[] = [
  {
    id: "kitchen",
    src: "/brand/video/peach-cobbler-roll.mp4",
    label: "Kitchen",
    caption: "Peach cobbler cinnamon rolls",
    poster: POSTER_SRC,
  },
];

const DEV_CLIPS: Clip[] = [
  {
    id: "higgsfield",
    src: "/brand/video/peach-cobbler-higgsfield.mp4",
    label: "Cinema",
    caption: "Peach cobbler cinnamon rolls",
    poster: POSTER_SRC,
  },
  {
    id: "alt",
    src: "/brand/video/peach-cobbler-hero-alt.mp4",
    label: "Hero",
    caption: "Peach cobbler cinnamon rolls",
    poster: POSTER_SRC,
  },
  {
    id: "original",
    src: "/brand/video/peach-cobbler-roll.mp4",
    label: "Shoot",
    caption: "Peach cobbler cinnamon rolls",
    poster: POSTER_SRC,
  },
];

const IS_DEV = process.env.NODE_ENV === "development";

export function StoryVideo() {
  const clips = IS_DEV ? DEV_CLIPS : PROD_CLIPS;
  const [activeId, setActiveId] = useState(clips[0].id);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tabListId = useId();

  const active = clips.find((c) => c.id === activeId) ?? clips[0];
  const poster = active.poster ?? POSTER_SRC;
  const showSwitcher = clips.length > 1;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    setFailed(false);
  }, [active.src]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || reducedMotion) return;
    el.muted = true;
    el.load();
    const play = el.play();
    if (play && typeof play.catch === "function") {
      play.catch(() => {
        /* autoplay blocked — poster still shows */
      });
    }
  }, [reducedMotion, active.src]);

  return (
    <figure className="story-video">
      {showSwitcher ? (
        <div className="story-video-toolbar">
          <p className="story-video-toolbar-note">Local preview</p>
          <div
            className="story-video-tabs"
            role="tablist"
            aria-label="Video version"
            id={tabListId}
          >
            {clips.map((clip) => {
              const selected = clip.id === active.id;
              return (
                <button
                  key={clip.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  className={
                    selected
                      ? "story-video-tab story-video-tab--active"
                      : "story-video-tab"
                  }
                  onClick={() => setActiveId(clip.id)}
                >
                  {clip.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="story-video-frame">
        {reducedMotion || failed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt="Peach cobbler cinnamon roll with cream cheese frosting and caramel"
            className="story-video-media"
          />
        ) : (
          <video
            key={active.src}
            ref={videoRef}
            className="story-video-media"
            src={active.src}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={active.caption}
            onError={() => setFailed(true)}
          />
        )}
      </div>

      <figcaption className="story-video-caption">{active.caption}</figcaption>
    </figure>
  );
}
