import { site } from "@/data/site";
import type { ValidOrderLine } from "@/lib/order-validation";
import { getStripe } from "@/lib/stripe";
import {
  formatCents,
  VA_PICKUP_TAX_LABEL,
} from "@/lib/tax-rate";

export { formatCents, estimatePickupTax } from "@/lib/tax-rate";

/**
 * Stripe tax code: prepared food / bakery for human consumption.
 * Stripe Tax applies the correct jurisdiction rate for the pickup address.
 * @see https://docs.stripe.com/tax/tax-codes
 */
export const BAKERY_TAX_CODE = "txcd_40060003";

export type TaxBreakdown = {
  /** Stripe Tax calculation id (taxcalc_…) — linked on the PaymentIntent */
  calculationId: string;
  /** Pre-tax cart total (cents) */
  subtotalCents: number;
  /** Tax to collect (cents) from Stripe Tax */
  taxCents: number;
  /** subtotal + tax — this is what we charge on the PaymentIntent */
  totalCents: number;
  /** e.g. "6.0" from Stripe */
  ratePercent: string | null;
  /** Human label for UI */
  rateLabel: string;
  /** Always Stripe for charged amounts */
  source: "stripe";
};

/**
 * Real sales tax for porch-pickup via Stripe Tax.
 * Location = bakery address (customer picks up in Haymarket, VA).
 * Throws if Stripe Tax is not activated or the API call fails — we never
 * invent a charge amount that Stripe Tax did not calculate.
 */
export async function calculatePickupTax(
  lines: ValidOrderLine[],
): Promise<TaxBreakdown> {
  const stripe = getStripe();
  const subtotalCents = lines.reduce((sum, l) => sum + l.amountCents, 0);

  const calculation = await stripe.tax.calculations.create({
    currency: "usd",
    customer_details: {
      address: {
        line1: site.address.line1,
        ...(site.address.line2 ? { line2: site.address.line2 } : {}),
        city: site.address.city,
        state: site.address.state,
        postal_code: site.address.zip,
        country: "US",
      },
      // Pickup at our location — tax from business address
      address_source: "shipping",
    },
    line_items: lines.map((line, i) => ({
      amount: line.amountCents,
      quantity: 1,
      reference: `${line.pack.id}:${line.pairProductIds.join("+")}:${i}`.slice(0, 500),
      tax_code: BAKERY_TAX_CODE,
      tax_behavior: "exclusive" as const,
    })),
  });

  if (!calculation.id) {
    throw new Error("Stripe Tax calculation missing id");
  }

  const taxCents = calculation.tax_amount_exclusive ?? 0;
  const totalCents = calculation.amount_total ?? subtotalCents + taxCents;

  const breakdown = calculation.tax_breakdown?.[0];
  const firstRate = breakdown?.tax_rate_details;
  const ratePercent = firstRate?.percentage_decimal ?? null;
  const taxability = breakdown?.taxability_reason;

  // Fail closed when Stripe is not collecting VA tax (misconfigured registration).
  // Prepared bakery food for porch pickup in Haymarket must charge sales tax.
  if (
    subtotalCents > 0 &&
    taxCents === 0 &&
    (taxability === "not_collecting" ||
      taxability === "not_supported" ||
      taxability === "not_subject_to_tax")
  ) {
    throw new Error(
      `Stripe Tax is not collecting for this location (${taxability || "unknown"}). Enable Stripe Tax and complete Virginia registration in the Dashboard.`,
    );
  }

  if (subtotalCents > 0 && taxCents === 0) {
    console.warn(
      "[tax] Stripe Tax returned $0 for Haymarket pickup",
      taxability,
      calculation.id,
    );
  }

  const rateLabel =
    taxCents > 0
      ? ratePercent
        ? `VA sales tax (${ratePercent}%)`
        : "Sales tax"
      : "Sales tax";

  return {
    calculationId: calculation.id,
    subtotalCents,
    taxCents,
    totalCents,
    ratePercent,
    rateLabel,
    source: "stripe",
  };
}

export function taxBreakdownLabels(tax: TaxBreakdown) {
  return {
    subtotalLabel: formatCents(tax.subtotalCents),
    taxLabel: formatCents(tax.taxCents),
    totalLabel: formatCents(tax.totalCents),
    taxRateLabel: tax.rateLabel || VA_PICKUP_TAX_LABEL,
  };
}

/** Human-readable Stripe Tax setup errors for the checkout UI */
export function stripeTaxErrorMessage(err: unknown): {
  status: number;
  error: string;
} {
  const msg =
    err &&
    typeof err === "object" &&
    "message" in err &&
    typeof (err as { message: unknown }).message === "string"
      ? (err as { message: string }).message
      : "";

  if (
    msg.includes("not been activated") ||
    msg.includes("stripe_tax") ||
    msg.toLowerCase().includes("tax is not enabled") ||
    msg.toLowerCase().includes("not collecting") ||
    msg.toLowerCase().includes("virginia registration")
  ) {
    return {
      status: 503,
      error:
        "Sales tax is not fully set up in Stripe yet. In the Stripe Dashboard go to Tax → Get started, enable Stripe Tax, register Virginia (Haymarket pickup), then try again.",
    };
  }

  console.error("Stripe Tax calculation failed", err);
  return {
    status: 502,
    error: "Could not calculate sales tax with Stripe. Please try again.",
  };
}
