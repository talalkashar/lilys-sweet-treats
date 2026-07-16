import { NextResponse } from "next/server";
import { validateOrderInput } from "@/lib/order-validation";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { site } from "@/data/site";
import { getStripe } from "@/lib/stripe";
import { calculatePickupTax, formatCents } from "@/lib/tax";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    const limited = rateLimit(`pi:${ip}`, 12, 60_000);
    if (!limited.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Try again shortly." },
        {
          status: 429,
          headers: { "Retry-After": String(limited.retryAfterSec) },
        },
      );
    }

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Expected JSON body" },
        { status: 415 },
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = validateOrderInput(
      (body && typeof body === "object" ? body : {}) as Record<string, unknown>,
    );
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
      amountCents: subtotalCents,
    } = parsed.data;

    // Stripe Tax (porch pickup → tax at bakery address)
    let tax;
    try {
      tax = await calculatePickupTax(lines);
    } catch (taxErr) {
      console.error("stripe tax calculation failed", taxErr);
      const msg =
        taxErr &&
        typeof taxErr === "object" &&
        "message" in taxErr &&
        typeof (taxErr as { message: unknown }).message === "string"
          ? (taxErr as { message: string }).message
          : "";
      if (msg.includes("not been activated") || msg.includes("stripe_tax")) {
        return NextResponse.json(
          {
            error:
              "Sales tax is not set up in Stripe yet. Enable Stripe Tax in the Dashboard (Tax → Get started), register Virginia, then try again.",
          },
          { status: 503 },
        );
      }
      return NextResponse.json(
        { error: "Could not calculate sales tax. Please try again." },
        { status: 502 },
      );
    }

    // Compact cart for Stripe metadata (500 char value limit)
    const orderLinesCompact = JSON.stringify(
      lines.map((l) => ({
        p: l.product.id,
        k: l.pack.id,
        q: l.quantity,
        c: l.amountCents,
      })),
    ).slice(0, 490);

    const stripe = getStripe();
    const packCount = lines.length;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: tax.totalCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      receipt_email: email,
      description: `${orderSummary} (porch pickup)`.slice(0, 900),
      // Link Stripe Tax calculation to this payment for reporting
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
        fulfillment: "porch_pickup",
        pickupAddress: site.addressLine,
        subtotalCents: String(tax.subtotalCents),
        taxCents: String(tax.taxCents),
        totalCents: String(tax.totalCents),
        taxCalculationId: tax.calculationId,
        taxRateLabel: tax.rateLabel.slice(0, 100),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      productName: orderSummary,
      quantity: totalTreats,
      packLabel: `${packCount} pack${packCount === 1 ? "" : "s"}`,
      lineCount: packCount,
      // Money breakdown for checkout UI
      subtotalCents: tax.subtotalCents,
      taxCents: tax.taxCents,
      totalCents: tax.totalCents,
      amount: tax.totalCents,
      taxRateLabel: tax.rateLabel,
      subtotalLabel: formatCents(tax.subtotalCents),
      taxLabel: formatCents(tax.taxCents),
      totalLabel: formatCents(tax.totalCents),
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
