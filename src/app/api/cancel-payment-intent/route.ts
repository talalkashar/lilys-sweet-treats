import { NextResponse } from "next/server";
import { cancelPaymentIntentWithClientSecret } from "@/lib/payment-intent-hygiene";
import { clientIp, rateLimitAll } from "@/lib/rate-limit";
import {
  assertBodySize,
  assertBrowserOrigin,
} from "@/lib/request-guards";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

/** Small body: id + secret only */
const MAX_BODY = 512;

/**
 * Best-effort cancel when the customer leaves the pay step (Back / tab close).
 * Requires payment_intent_client_secret so strangers cannot cancel arbitrary PIs.
 */
export async function POST(req: Request) {
  try {
    const originCheck = assertBrowserOrigin(req);
    if (!originCheck.ok) {
      return NextResponse.json(
        { error: originCheck.error },
        { status: originCheck.status },
      );
    }

    const sizeCheck = assertBodySize(req, MAX_BODY);
    if (!sizeCheck.ok) {
      return NextResponse.json(
        { error: sizeCheck.error },
        { status: sizeCheck.status },
      );
    }

    const limited = rateLimitAll([
      { key: `pi-cancel:${clientIp(req)}`, limit: 30, windowMs: 60_000 },
    ]);
    if (!limited.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: { "Retry-After": String(limited.retryAfterSec) },
        },
      );
    }

    let body: { paymentIntentId?: string; clientSecret?: string };
    try {
      body = (await req.json()) as typeof body;
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const paymentIntentId =
      typeof body.paymentIntentId === "string"
        ? body.paymentIntentId.trim()
        : "";
    const clientSecret =
      typeof body.clientSecret === "string" ? body.clientSecret.trim() : "";

    if (!paymentIntentId || !clientSecret) {
      return NextResponse.json(
        { error: "paymentIntentId and clientSecret required" },
        { status: 400 },
      );
    }

    const result = await cancelPaymentIntentWithClientSecret(
      getStripe(),
      paymentIntentId,
      clientSecret,
    );

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error || "Could not cancel" },
        { status: 400 },
      );
    }

    return NextResponse.json({ ok: true, status: result.status });
  } catch (err) {
    console.error("cancel-payment-intent", err);
    return NextResponse.json({ error: "Could not cancel" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
