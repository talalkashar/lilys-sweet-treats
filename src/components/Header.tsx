"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/data/site";

const links = [
  { href: "/#menu", label: "Menu" },
  { href: "/order", label: "Order" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname() || "/";
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    // Enable transitions only after the real scroll position is known
    // so refresh never animates purple → glass (or the reverse).
    requestAnimationFrame(() => setReady(true));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Glass-over-video only on homepage hero. Inner pages always use solid bar
  // (otherwise white type / hidden title on cream looks broken).
  const overHero = isHome && !scrolled;

  return (
    <header
      className={[
        "site-header sticky top-0 z-50",
        ready ? "site-header--ready" : "site-header--boot",
        overHero ? "site-header--over-hero" : "site-header--scrolled",
      ].join(" ")}
    >
      <div className="site-header-inner shell site-header-bar">
        <Link
          href="/"
          className="site-header-brand flex min-w-0 items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <span className="logo-mark">
            <Image
              src={site.logo}
              alt={`${site.name} logo`}
              fill
              className="object-cover object-center"
              sizes="80px"
              priority
            />
          </span>
          <div className="min-w-0 leading-tight">
            <p className="site-header-title truncate font-display text-lg sm:text-xl">
              {site.shortName}
            </p>
            <p className="site-header-subtitle hidden text-xs font-medium uppercase tracking-[0.1em] sm:block">
              Porch pickup only
            </p>
          </div>
        </Link>

        <nav className="header-nav-desktop hidden items-center text-base font-medium lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="header-nav-link">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="site-header-actions flex items-center justify-end gap-2.5">
          <Link
            href="/order"
            className="btn-primary header-cta-desktop hidden lg:inline-flex"
          >
            Order pickup
          </Link>
          <button
            type="button"
            className="header-menu-btn flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur-md lg:hidden sm:h-11 sm:w-11"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <div className="header-menu-icon" aria-hidden>
              <span
                className={
                  open ? "translate-y-[0.28rem] rotate-45" : undefined
                }
              />
              <span className={open ? "opacity-0" : undefined} />
              <span
                className={
                  open ? "-translate-y-[0.28rem] -rotate-45" : undefined
                }
              />
            </div>
          </button>
        </div>
      </div>

      {open ? (
        <div className="site-header-menu border-t border-[var(--blush)]/40 px-5 py-3 lg:hidden">
          <nav className="flex flex-col">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-md px-2 py-2.5 text-sm font-medium text-[var(--cocoa)] hover:bg-[var(--lavender-soft)]"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/order"
              className="btn-primary mt-2 text-center"
              onClick={() => setOpen(false)}
            >
              Order pickup
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
