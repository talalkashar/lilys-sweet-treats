import { NextResponse } from "next/server";
import { validateOrderInput } from "@/lib/order-validation";
import { clientIp, rateLimitAll } from "@/lib/rate-limit";
import {
  cancelAbandonedPaymentIntent,
  cancelOtherIncompleteForEmail,
  cancelStaleIncompleteIntents,
  checkoutIdempotencyKey,
} from "@/lib/payment-intent-hygiene";
import {
  assertBodySize,
  assertBrowserOrigin,
  honeypotTripped,
} from "@/lib/request-guards";
import { site } from "@/data/site";
import { getStripe } from "@/lib/stripe";
import {
  calculatePickupTax,
  stripeTaxErrorMessage,
  taxBreakdownLabels,
} from "@/lib/tax";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const originCheck = assertBrowserOrigin(req);
    if (!originCheck.ok) {
      return NextResponse.json(
        { error: originCheck.error },
        { status: originCheck.status },
      );
    }

    const sizeCheck = assertBodySize(req);
    if (!sizeCheck.ok) {
      return NextResponse.json(
        { error: sizeCheck.error },
        { status: sizeCheck.status },
      );
    }

    const ip = clientIp(req);

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Expected JSON body" },
        { status: 415 },
      );
    }

    let body: Record<string, unknown>;
    try {
      const raw = (await req.json()) as unknown;
      body =
        raw && typeof raw === "object" && !Array.isArray(raw)
          ? (raw as Record<string, unknown>)
          : {};
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // Rate-limit early (per IP) so invalid payloads cannot flood validation/tax APIs.
    const earlyLimited = rateLimitAll([
      { key: `pi:ip:${ip}`, limit: 6, windowMs: 60_000 },
      { key: `pi:ip-hour:${ip}`, limit: 30, windowMs: 60 * 60_000 },
    ]);
    if (!earlyLimited.allowed) {
      return NextResponse.json(
        {
          error:
            "Too many payment attempts. Please wait a few minutes and try again.",
        },
        {
          status: 429,
          headers: { "Retry-After": String(earlyLimited.retryAfterSec) },
        },
      );
    }

    // Bots filling hidden fields — look like success to waste their time
    if (honeypotTripped(body)) {
      return NextResponse.json(
        { error: "Could not start payment" },
        { status: 400 },
      );
    }

    const parsed = validateOrderInput(body);
    if (!parsed.ok) {
      return NextResponse.json(
        { error: parsed.error },
        { status: parsed.status },
      );
    }

    const {
      lines,
      orderSummary,
      totalTreats,
      name,
      phone,
      email,
      pickupWindow,
      notes,
    } = parsed.data;

    // Per-email cap after we know the address (stops one inbox card-testing)
    const emailLimited = rateLimitAll([
      { key: `pi:email:${email}`, limit: 8, windowMs: 10 * 60_000 },
    ]);
    if (!emailLimited.allowed) {
      return NextResponse.json(
        {
          error:
            "Too many payment attempts. Please wait a few minutes and try again.",
        },
        {
          status: 429,
          headers: { "Retry-After": String(emailLimited.retryAfterSec) },
        },
      );
    }

    // Real tax: Stripe Tax at bakery pickup address
    let tax;
    try {
      tax = await calculatePickupTax(lines);
    } catch (taxErr) {
      const { status, error } = stripeTaxErrorMessage(taxErr);
      return NextResponse.json({ error }, { status });
    }

    const labels = taxBreakdownLabels(tax);

    // Compact cart for Stripe metadata (500 char value limit)
    const orderLinesCompact = JSON.stringify(
      lines.map((l) => ({
        k: l.pack.id,
        q: l.quantity,
        c: l.amountCents,
        pairs: l.pairProductIds,
      })),
    ).slice(0, 490);

    const stripe = getStripe();
    const packCount = lines.length;

    // Hygiene: cancel this session's previous PI, other incompletes for same
    // email, and a few stale incompletes (dashboard declutter, no cron needed).
    const previousId =
      typeof body.previousPaymentIntentId === "string"
        ? body.previousPaymentIntentId
        : null;
    await cancelAbandonedPaymentIntent(stripe, previousId, email);
    await cancelOtherIncompleteForEmail(stripe, email, previousId);
    // Fire-and-forget-ish: await but best-effort; never blocks on full success
    await cancelStaleIncompleteIntents(stripe, {
      olderThanHours: 48,
      maxCancel: 8,
    });

    const attemptId =
      typeof body.checkoutAttemptId === "string" ? body.checkoutAttemptId : "";
    const idempotencyKey = checkoutIdempotencyKey({
      email,
      orderFingerprint: orderLinesCompact,
      totalCents: tax.totalCents,
      attemptId,
    });

    // Charge = Stripe Tax total; calculation linked for Tax reporting / remittance
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: tax.totalCents,
        currency: "usd",
        automatic_payment_methods: { enabled: true },
        // Prefer 3D Secure when banks/Radar want it (fraud reduction, no fee change)
        payment_method_options: {
          card: {
            request_three_d_secure: "automatic",
          },
        },
        receipt_email: email,
        description: `${orderSummary} (Atlas Walk pickup)`.slice(0, 900),
        // Bank statement line (suffix; account name is set in Stripe Dashboard)
        statement_descriptor_suffix: "LILYS TREATS",
        hooks: {
          inputs: {
            tax: {
              calculation: tax.calculationId,
            },
          },
        },
        metadata: {
          productName: orderSummary.slice(0, 490),
          packLabel: `${packCount} pack${packCount === 1 ? "" : "s"}`,
          quantity: String(totalTreats),
          orderLines: orderLinesCompact,
          lineCount: String(packCount),
          productId: lines[0]!.product.id,
          packId: lines[0]!.pack.id,
          customerName: name,
          customerPhone: phone,
          customerEmail: email,
          pickupWindow,
          notes,
          fulfillment: "local_pickup",
          pickupAddress: site.addressLine,
          subtotalCents: String(tax.subtotalCents),
          taxCents: String(tax.taxCents),
          totalCents: String(tax.totalCents),
          taxCalculationId: tax.calculationId,
          taxSource: "stripe",
          taxRateLabel: tax.rateLabel.slice(0, 100),
          clientIp: ip.slice(0, 64),
        },
      },
      { idempotencyKey },
    );

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      productName: orderSummary,
      quantity: totalTreats,
      packLabel: `${packCount} pack${packCount === 1 ? "" : "s"}`,
      lineCount: packCount,
      // Money breakdown for checkout UI (from Stripe Tax)
      subtotalCents: tax.subtotalCents,
      taxCents: tax.taxCents,
      totalCents: tax.totalCents,
      amount: tax.totalCents,
      taxSource: "stripe",
      taxCalculationId: tax.calculationId,
      ...labels,
    });
  } catch (err) {
    console.error("create-payment-intent", err);
    return NextResponse.json(
      { error: "Could not start payment" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
