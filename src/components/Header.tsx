"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/data/site";

const links = [
  { href: "#menu", label: "Menu" },
  { href: "#story", label: "Our story" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#order", label: "Order" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[var(--blush)]/50 bg-white/90 shadow-[var(--shadow-soft)] backdrop-blur-xl"
          : "border-b border-transparent bg-[var(--cream)]/70 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <Image
            src={site.logo}
            alt={`${site.name} logo`}
            width={52}
            height={52}
            className="h-11 w-11 rounded-full border border-[var(--blush)] object-cover shadow-sm sm:h-12 sm:w-12"
            priority
          />
          <div className="min-w-0 leading-tight">
            <p className="font-display text-lg text-[var(--cocoa)] sm:text-xl">
              {site.shortName}
            </p>
            <p className="hidden text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--ink-muted)] sm:block">
              &amp; More · Porch pickup
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-[0.9rem] font-medium text-[var(--cocoa-soft)] lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative transition-colors hover:text-[var(--rose)] after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-[var(--rose)] after:transition-all hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href="#order" className="btn-primary hidden sm:inline-flex !py-2.5 !px-5 !text-sm">
            Order now
          </a>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--blush)] bg-white text-[var(--cocoa)] lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <div className="flex w-4 flex-col gap-1">
              <span
                className={`h-0.5 w-full rounded bg-[var(--cocoa)] transition ${open ? "translate-y-1.5 rotate-45" : ""}`}
              />
              <span
                className={`h-0.5 w-full rounded bg-[var(--cocoa)] transition ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`h-0.5 w-full rounded bg-[var(--cocoa)] transition ${open ? "-translate-y-1.5 -rotate-45" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-[var(--blush)]/40 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-xl px-3 py-3 text-[var(--cocoa)] font-medium hover:bg-[var(--lavender-soft)]"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#order"
              className="btn-primary mt-2"
              onClick={() => setOpen(false)}
            >
              Order now
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
