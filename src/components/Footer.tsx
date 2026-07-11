import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-[var(--blush)] bg-[var(--cream-deep)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-10 text-center sm:px-6 sm:text-left sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-xl text-[var(--cocoa)]">{site.name}</p>
          <p className="mt-1 text-sm text-[var(--cocoa-soft)]">{site.pickupNote}</p>
        </div>
        <div className="text-sm text-[var(--cocoa-soft)]">
          <p>
            <a className="hover:text-[var(--rose)]" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </p>
          <p className="mt-1">
            <a className="hover:text-[var(--rose)]" href={`tel:${site.phone.replace(/\D/g, "")}`}>
              {site.phone}
            </a>
          </p>
        </div>
      </div>
      <div className="border-t border-[var(--blush)]/70 py-4 text-center text-xs text-[var(--cocoa-soft)]">
        © {new Date().getFullYear()} {site.name}. Pre-order · Porch pickup only.
      </div>
    </footer>
  );
}
