"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Thumb-friendly order bar on small screens only.
 * Hidden on /order (already checking out) and desktop (CSS).
 */
export function MobileStickyCta() {
  const pathname = usePathname() || "";
  if (pathname.startsWith("/order")) return null;

  return (
    <div className="mobile-sticky-cta" role="region" aria-label="Order pickup">
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
