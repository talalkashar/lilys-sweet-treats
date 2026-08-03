/**
 * Request guards for checkout / payment APIs.
 * Reduce casual abuse and scripted POSTs without blocking real customers.
 */

/** Max JSON body size for create-payment-intent (bytes). */
export const MAX_CHECKOUT_BODY_BYTES = 12_000;

/**
 * Allow only browser requests from our own site (and localhost in dev).
 * Stripe webhooks must NOT use this — they come from Stripe's servers.
 */
export function assertBrowserOrigin(req: Request): {
  ok: true;
} | {
  ok: false;
  status: number;
  error: string;
} {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const host = req.headers.get("host") || "";

  // Same-origin fetch always sends Origin on POST in modern browsers.
  const allowedHosts = new Set<string>();
  if (host) allowedHosts.add(host.toLowerCase());

  // Production domains
  allowedHosts.add("www.lilyssweettreatsva.com");
  allowedHosts.add("lilyssweettreatsva.com");

  // Local / preview
  if (process.env.NODE_ENV !== "production") {
    allowedHosts.add("localhost:3000");
    allowedHosts.add("127.0.0.1:3000");
  }
  // Vercel preview URLs (*.vercel.app) when Host matches
  if (host.endsWith(".vercel.app")) {
    allowedHosts.add(host.toLowerCase());
  }

  const candidate = origin || referer;
  if (!candidate) {
    // Non-browser clients / curl without Origin — reject payment creation
    return { ok: false, status: 403, error: "Forbidden" };
  }

  try {
    const url = new URL(candidate);
    const candidateHost = url.host.toLowerCase();
    if (!allowedHosts.has(candidateHost)) {
      return { ok: false, status: 403, error: "Forbidden" };
    }
  } catch {
    return { ok: false, status: 403, error: "Forbidden" };
  }

  return { ok: true };
}

/** Reject oversized bodies early when Content-Length is present. */
export function assertBodySize(req: Request, maxBytes = MAX_CHECKOUT_BODY_BYTES): {
  ok: true;
} | {
  ok: false;
  status: number;
  error: string;
} {
  const raw = req.headers.get("content-length");
  if (!raw) return { ok: true };
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) {
    return { ok: false, status: 400, error: "Invalid request" };
  }
  if (n > maxBytes) {
    return { ok: false, status: 413, error: "Request too large" };
  }
  return { ok: true };
}

/**
 * Honeypot: real users leave this empty (hidden field).
 * Bots that fill every input get blocked silently.
 */
export function honeypotTripped(body: Record<string, unknown>): boolean {
  const trap = body.website ?? body.company ?? body.fax;
  if (trap == null || trap === "") return false;
  if (typeof trap === "string" && trap.trim() === "") return false;
  return true;
}
