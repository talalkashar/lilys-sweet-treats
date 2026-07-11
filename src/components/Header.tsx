import Image from "next/image";
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
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        <Link href="/" className="group flex min-w-0 items-center gap-2.5">
          <Image
            src={site.logo}
            alt={`${site.name} logo`}
            width={48}
            height={48}
            className="h-11 w-11 rounded-full border-2 border-[var(--blush)] object-cover shadow-sm sm:h-12 sm:w-12"
            priority
          />
          <span className="font-display text-lg leading-tight tracking-tight text-[var(--cocoa)] sm:text-xl">
            {site.shortName}
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
          className="btn-pop shrink-0 rounded-full bg-[var(--rose)] px-4 py-2 text-sm font-semibold text-white shadow-md"
        >
          Order pickup
        </a>
      </div>
    </header>
  );
}
