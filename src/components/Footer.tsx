import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-[var(--cocoa)] bg-[var(--cocoa)] text-white">
      <div className="shell flex flex-col gap-10 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white sm:h-[4.5rem] sm:w-[4.5rem]">
            <Image
              src={site.logo}
              alt=""
              fill
              className="object-cover object-center"
              sizes="72px"
            />
          </span>
          <div>
            <p className="font-display text-xl text-white sm:text-2xl">
              {site.name}
            </p>
            <p className="mt-0.5 text-sm text-white/55">
              Porch pickup. No delivery.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm text-white/70 sm:items-end">
          <Link className="hover:text-white" href="/order">
            Order and pay
          </Link>
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
