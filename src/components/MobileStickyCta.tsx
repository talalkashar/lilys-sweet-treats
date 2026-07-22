"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Thumb-friendly order bar on phone + tablet (≤1023px).
 * Hidden on /order, desktop (CSS), and while the hero is still on screen
 * so it never covers the full-bleed video.
 */
export function MobileStickyCta() {
  const pathname = usePathname() || "";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/order")) return;

    let last = false;
    let ticking = false;

    const measure = () => {
      const hero = document.querySelector(".hero-video");
      let next: boolean;
      if (!hero) {
        // No hero (inner pages) — show after a little scroll
        next = window.scrollY > 120;
      } else {
        const bottom = hero.getBoundingClientRect().bottom;
        // Reveal once hero has mostly left the viewport
        next = bottom < window.innerHeight * 0.45;
      }
      if (next !== last) {
        last = next;
        setVisible(next);
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        measure();
      });
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, [pathname]);

  if (pathname.startsWith("/order")) return null;

  return (
    <div
      className={`mobile-sticky-cta${visible ? " mobile-sticky-cta--visible" : ""}`}
      role="region"
      aria-label="Order pickup"
      aria-hidden={!visible}
    >
      <div className="mobile-sticky-cta-inner">
        <div className="mobile-sticky-cta-copy">
          <p className="mobile-sticky-cta-title">Porch pickup</p>
          <p className="mobile-sticky-cta-meta">Fri 4–6 · Sat 9–11</p>
        </div>
        <Link href="/order" className="btn-primary mobile-sticky-cta-btn">
          Order pickup
        </Link>
      </div>
    </div>
  );
}
