"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Thumb-friendly order bar on small screens only.
 * Hidden on /order, desktop (CSS), and while the hero is still on screen
 * so it never covers the full-bleed video.
 */
export function MobileStickyCta() {
  const pathname = usePathname() || "";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/order")) return;

    const update = () => {
      const hero = document.querySelector(".hero-video");
      if (!hero) {
        // No hero (inner pages) — show after a little scroll
        setVisible(window.scrollY > 120);
        return;
      }
      const bottom = hero.getBoundingClientRect().bottom;
      // Reveal once hero has mostly left the viewport
      setVisible(bottom < window.innerHeight * 0.45);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
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
