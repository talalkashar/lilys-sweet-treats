"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
};

/**
 * Soft fade-up when the block scrolls into view.
 * Starts early (rootMargin) so motion feels continuous while scrolling.
 * Always falls back to visible so content never stays stuck at opacity: 0.
 */
export function Reveal({ children, className = "", delayMs = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Generous fallback so nothing stays hidden if the observer never fires
    const fallback = window.setTimeout(() => setVisible(true), 1400);

    const show = () => {
      setVisible(true);
      window.clearTimeout(fallback);
    };

    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || 800;
    // Already on screen (or almost) — ease in after a frame so paint is ready
    if (rect.top < vh * 0.92 && rect.bottom > 0) {
      const raf = requestAnimationFrame(() => show());
      return () => {
        cancelAnimationFrame(raf);
        window.clearTimeout(fallback);
      };
    }

    if (typeof IntersectionObserver === "undefined") {
      show();
      return () => window.clearTimeout(fallback);
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          show();
          obs.disconnect();
        }
      },
      // Start the glide before the block is fully in view — feels continuous
      { threshold: 0.06, rootMargin: "12% 0px 8% 0px" },
    );

    obs.observe(el);
    return () => {
      obs.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "reveal-in" : ""} ${className}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}
