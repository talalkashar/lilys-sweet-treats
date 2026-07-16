import { site } from "@/data/site";
import type { ValidOrderLine } from "@/lib/order-validation";
import { getStripe } from "@/lib/stripe";

/**
 * Stripe tax code: food for human consumption.
 * VA still may apply sales tax to prepared bakery goods — Stripe Tax decides.
 */
export const BAKERY_TAX_CODE = "txcd_40060003";

export type TaxBreakdown = {
  calculationId: string;
  /** Pre-tax cart total (cents) */
  subtotalCents: number;
  /** Tax to collect (cents) */
  taxCents: number;
  /** subtotal + tax */
  totalCents: number;
  /** e.g. "6.0" */
  ratePercent: string | null;
  /** Human label for UI */
  rateLabel: string;
};

/**
 * Calculate sales tax for porch-pickup orders using Stripe Tax.
 * Tax location = bakery address (customer picks up in Haymarket, VA).
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
      reference: `${line.product.id}:${line.pack.id}:${i}`.slice(0, 500),
      tax_code: BAKERY_TAX_CODE,
      tax_behavior: "exclusive" as const,
    })),
  });

  const taxCents = calculation.tax_amount_exclusive ?? 0;
  const totalCents = calculation.amount_total ?? subtotalCents + taxCents;

  const firstRate = calculation.tax_breakdown?.[0]?.tax_rate_details;
  const ratePercent = firstRate?.percentage_decimal ?? null;
  const rateLabel =
    taxCents > 0
      ? ratePercent
        ? `VA sales tax (${ratePercent}%)`
        : "Sales tax"
      : "Sales tax";

  if (!calculation.id) {
    throw new Error("Stripe Tax calculation missing id");
  }

  return {
    calculationId: calculation.id,
    subtotalCents,
    taxCents,
    totalCents,
    ratePercent,
    rateLabel,
  };
}

export function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}
