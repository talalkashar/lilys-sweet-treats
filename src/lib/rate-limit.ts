/**
 * Lightweight in-memory rate limit (per server instance).
 * Good enough to blunt casual abuse on serverless; not a substitute for WAF.
 * On Vercel, each isolate has its own map — still reduces burst abuse per instance.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 5_000;

function pruneIfNeeded(now: number) {
  if (buckets.size < MAX_BUCKETS) return;
  for (const [k, v] of buckets) {
    if (v.resetAt <= now) buckets.delete(k);
  }
  // Hard cap: drop oldest half if still huge
  if (buckets.size >= MAX_BUCKETS) {
    let i = 0;
    for (const k of buckets.keys()) {
      buckets.delete(k);
      if (++i > MAX_BUCKETS / 2) break;
    }
  }
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  pruneIfNeeded(now);
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSec: 0 };
}

/**
 * Require all named limits to pass (e.g. per-IP and per-email).
 * Returns the first failure, or allowed with the max retry-after of any check.
 */
export function rateLimitAll(
  checks: Array<{ key: string; limit: number; windowMs: number }>,
): { allowed: boolean; retryAfterSec: number } {
  let maxRetry = 0;
  for (const c of checks) {
    const r = rateLimit(c.key, c.limit, c.windowMs);
    if (!r.allowed) {
      return r;
    }
    maxRetry = Math.max(maxRetry, r.retryAfterSec);
  }
  return { allowed: true, retryAfterSec: maxRetry };
}

/** Best-effort client IP from common proxy headers */
export function clientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) {
    const first = xf.split(",")[0]?.trim();
    if (first && first.length <= 64) return first;
  }
  const real = req.headers.get("x-real-ip")?.trim();
  if (real && real.length <= 64) return real;
  return "unknown";
}
