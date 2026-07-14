import Image from "next/image";
import Link from "next/link";
import { mapsUrl, site } from "@/data/site";

export function Footer() {
  return (
    <footer id="contact" className="relative z-[1] bg-[var(--cocoa)] text-white">
      <div className="shell flex flex-col gap-8 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="logo-mark logo-mark--footer">
            <Image
              src={site.logo}
              alt=""
              fill
              className="object-cover object-center"
              sizes="48px"
            />
          </span>
          <div className="min-w-0 leading-tight">
            <p className="font-display text-lg text-white">{site.name}</p>
            <p className="mt-0.5 text-sm text-white/55">
              Porch pickup in Haymarket. No delivery.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 text-sm text-white/70 sm:items-end sm:text-right">
          <Link className="hover:text-white" href="/order">
            Order and pay
          </Link>
          <a
            className="hover:text-white"
            href={`tel:${site.phone.replace(/\D/g, "")}`}
          >
            {site.phone}
          </a>
          <a className="hover:text-white" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <a
            className="mt-1 max-w-xs hover:text-white"
            href={mapsUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            {site.address.line1}
            <br />
            {site.address.line2}
            <br />
            {site.address.city}, {site.address.state} {site.address.zip}
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 py-3 text-center text-xs text-white/40">
        © {new Date().getFullYear()} {site.name}
      </div>
    </footer>
  );
}
