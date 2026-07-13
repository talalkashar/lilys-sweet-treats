"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/data/site";

const links = [
  { href: "/#menu", label: "Menu" },
  { href: "/#how-it-works", label: "Pickup" },
  { href: "/order", label: "Order" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-[var(--blush)]/50 bg-white/95 shadow-[var(--shadow-soft)] backdrop-blur-md"
          : "border-transparent bg-white/80 backdrop-blur-md"
      }`}
    >
      <div className="shell flex items-center justify-between gap-4 py-3">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[var(--blush)]/60 bg-white sm:h-[3.75rem] sm:w-[3.75rem]">
            <Image
              src={site.logo}
              alt={`${site.name} logo`}
              fill
              className="object-cover object-center"
              sizes="60px"
              priority
            />
          </span>
          <div className="min-w-0 leading-tight">
            <p className="font-display text-lg text-[var(--cocoa)] sm:text-xl">
              {site.shortName}
            </p>
            <p className="hidden text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--ink-muted)] sm:block">
              Porch pickup only
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-[0.9rem] font-medium text-[var(--cocoa-soft)] lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-[var(--rose)]"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/order"
            className="btn-primary hidden !px-5 !py-2.5 !text-sm sm:inline-flex"
          >
            Order now
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--blush)] bg-white lg:hidden"
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
        <div className="border-t border-[var(--blush)]/40 bg-white px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-3 font-medium text-[var(--cocoa)] hover:bg-[var(--lavender-soft)]"
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
              Order now
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
