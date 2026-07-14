import Link from "next/link";
import { site } from "@/data/site";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="section-label">404</p>
      <h1 className="section-title mt-2">Page not found</h1>
      <p className="prose-soft mx-auto mt-3 text-center">
        That page does not exist. Head back for this week&apos;s menu or place a
        porch pickup order.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
        <Link href="/" className="btn-primary">
          Back home
        </Link>
        <Link href="/order" className="btn-secondary">
          Order pickup
        </Link>
        <Link href="/#menu" className="btn-secondary">
          View menu
        </Link>
      </div>
      <p className="mt-10 text-sm text-[var(--ink-muted)]">
        Need help?{" "}
        <a
          className="font-semibold text-[var(--rose)]"
          href={`tel:${site.phone.replace(/\D/g, "")}`}
        >
          {site.phone}
        </a>
      </p>
    </div>
  );
}
