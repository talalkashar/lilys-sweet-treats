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
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background,box-shadow,border-color] duration-200 ${
        scrolled
          ? "border-[var(--blush)]/45 bg-white/95 shadow-[var(--shadow-soft)] backdrop-blur-md"
          : "border-transparent bg-white/90 backdrop-blur-md"
      }`}
    >
      <div className="shell flex h-14 items-center justify-between gap-3 sm:h-[3.75rem]">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <span className="logo-mark">
            <Image
              src={site.logo}
              alt={`${site.name} logo`}
              fill
              className="object-cover object-center"
              sizes="44px"
              priority
            />
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate font-display text-base text-[var(--cocoa)] sm:text-lg">
              {site.shortName}
            </p>
            <p className="hidden text-[0.65rem] font-medium uppercase tracking-[0.1em] text-[var(--ink-muted)] sm:block">
              Porch pickup only
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--cocoa-soft)] lg:flex">
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
          <Link href="/order" className="btn-primary hidden sm:inline-flex">
            Order now
          </Link>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--blush)] bg-white lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <div className="flex w-3.5 flex-col gap-0.5">
              <span
                className={`h-0.5 w-full rounded bg-[var(--cocoa)] transition ${open ? "translate-y-[3px] rotate-45" : ""}`}
              />
              <span
                className={`h-0.5 w-full rounded bg-[var(--cocoa)] transition ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`h-0.5 w-full rounded bg-[var(--cocoa)] transition ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-[var(--blush)]/40 bg-white px-5 py-3 lg:hidden">
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
              Order now
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
