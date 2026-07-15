import Image from "next/image";
import { site } from "@/data/site";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer id="contact" className="site-footer relative z-[1]">
      <div className="shell footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="logo-mark logo-mark--footer">
              <Image
                src={site.logo}
                alt=""
                fill
                className="object-cover object-center"
                sizes="80px"
              />
            </span>
            <div className="footer-brand-text">
              <p className="footer-brand-name font-display">{site.name}</p>
              <p className="footer-brand-blurb">
                Porch pickup in Haymarket, VA · No delivery
              </p>
            </div>
          </div>

          <div className="footer-social-row" aria-label="Social and contact">
            {site.instagram ? (
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social"
                aria-label="Instagram"
              >
                <InstagramIcon className="footer-social-icon" />
              </a>
            ) : null}
            <a
              href={`mailto:${site.email}`}
              className="footer-social"
              aria-label={`Email ${site.email}`}
            >
              <EmailIcon className="footer-social-icon" />
            </a>
            <a
              href={`tel:${site.phone.replace(/\D/g, "")}`}
              className="footer-social"
              aria-label={`Call ${site.phone}`}
            >
              <PhoneIcon className="footer-social-icon" />
            </a>
          </div>
        </div>

        <div className="footer-divider" aria-hidden />

        <div className="footer-details">
          <a
            className="footer-detail"
            href={`tel:${site.phone.replace(/\D/g, "")}`}
          >
            {site.phone}
          </a>
          <span className="footer-detail-sep" aria-hidden>
            ·
          </span>
          <a className="footer-detail" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <span className="footer-detail-sep footer-detail-sep--wide" aria-hidden>
            ·
          </span>
          <p className="footer-detail footer-detail--plain">
            Porch pickup only
          </p>
        </div>
      </div>

      <div className="footer-copy">
        © {new Date().getFullYear()} {site.name}
      </div>
    </footer>
  );
}
