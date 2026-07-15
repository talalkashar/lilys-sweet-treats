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
      className={`site-header sticky top-0 z-50 transition-[box-shadow] duration-200 ${
        scrolled ? "site-header--scrolled shadow-[var(--shadow-soft)]" : ""
      }`}
    >
      <div className="site-header-inner shell flex h-[5.5rem] items-center justify-between gap-3 sm:h-[6.5rem] lg:h-[7rem]">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3"
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
            <p className="truncate font-display text-lg text-[var(--cocoa)] sm:text-xl">
              {site.shortName}
            </p>
            <p className="hidden text-xs font-medium uppercase tracking-[0.1em] text-[var(--ink-muted)] sm:block">
              Porch pickup only
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-base font-medium text-[var(--cocoa-soft)] lg:flex">
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

        <div className="flex items-center gap-2.5">
          <Link href="/order" className="btn-primary hidden sm:inline-flex">
            Order pickup
          </Link>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--blush)] bg-white lg:hidden"
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
