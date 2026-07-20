"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
};

/**
 * Soft fade-up when the block scrolls into view.
 * Always falls back to visible so content never stays stuck at opacity: 0.
 */
export function Reveal({ children, className = "", delayMs = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fallback = window.setTimeout(() => setVisible(true), 600);

    const show = () => {
      setVisible(true);
      window.clearTimeout(fallback);
    };

    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || 800;
    if (rect.top < vh && rect.bottom > 0) {
      show();
      return () => window.clearTimeout(fallback);
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
      { threshold: 0.01, rootMargin: "80px 0px 80px 0px" },
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
