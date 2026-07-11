import Link from "next/link";
import { site } from "@/data/site";

const links = [
  { href: "#menu", label: "Menu" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#order", label: "Order" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--blush)]/60 bg-[var(--cream)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group min-w-0">
          <span className="font-display text-xl tracking-tight text-[var(--cocoa)] sm:text-2xl">
            {site.name}
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--cocoa-soft)] md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition hover:text-[var(--rose)]"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#order"
          className="shrink-0 rounded-full bg-[var(--rose)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--rose-deep)]"
        >
          Order pickup
        </a>
      </div>
    </header>
  );
}
