import Image from "next/image";
import { site } from "@/data/site";

/**
 * Footer purpose: identity + legal quiet end + contact backup.
 * No decorative pattern (was competing with content).
 * No long link tree — page is short enough already.
 */
export function Footer() {
  return (
    <footer className="border-t border-[var(--blush)]/50 bg-[var(--cocoa)] text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-4">
          <span className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white sm:h-20 sm:w-20">
            <Image
              src={site.logo}
              alt=""
              width={80}
              height={80}
              className="h-full w-full object-cover object-center"
            />
          </span>
          <div>
            <p className="font-display text-xl text-white sm:text-2xl">{site.name}</p>
            <p className="text-sm text-white/60">Porch pickup. No delivery.</p>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-sm text-white/70 sm:items-end">
          <a className="hover:text-white" href={`tel:${site.phone.replace(/\D/g, "")}`}>
            {site.phone}
          </a>
          <a className="hover:text-white" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} {site.name}
      </div>
    </footer>
  );
}
