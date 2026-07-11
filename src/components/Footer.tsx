import Image from "next/image";
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--blush)]/60 bg-[var(--cocoa)] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(${site.pattern})`,
          backgroundSize: "380px",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <Image
                src={site.logo}
                alt=""
                width={56}
                height={56}
                className="h-14 w-14 rounded-full border-2 border-white/20 object-cover"
              />
              <div>
                <p className="font-display text-2xl text-white">{site.name}</p>
                <p className="text-sm text-white/65">Handmade · Local porch pickup</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-white/70">
              {site.pickupNote} Pre-order your favorites and we&apos;ll have them
              ready when you arrive.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--gold)]">
                Visit
              </p>
              <ul className="mt-3 space-y-2 text-sm text-white/75">
                <li>
                  <a className="hover:text-white" href="#menu">
                    Menu
                  </a>
                </li>
                <li>
                  <a className="hover:text-white" href="#order">
                    Order pickup
                  </a>
                </li>
                <li>
                  <a className="hover:text-white" href="#how-it-works">
                    How it works
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--gold)]">
                Contact
              </p>
              <ul className="mt-3 space-y-2 text-sm text-white/75">
                <li>
                  <a className="hover:text-white" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-white"
                    href={`tel:${site.phone.replace(/\D/g, "")}`}
                  >
                    {site.phone}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All treats made with love.
          </p>
          <p>No delivery · Porch pickup only</p>
        </div>
      </div>
    </footer>
  );
}
