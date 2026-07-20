/**
 * Client-safe tax helpers for porch-pickup orders in Haymarket, VA.
 *
 * Combined rate for Prince William County / Northern Virginia:
 * 4.3% state + 1% local + 0.7% regional transit = 6.0%.
 *
 * Server checkout prefers Stripe Tax when activated; this rate is used for
 * live cart estimates and as a fallback if Stripe Tax is unavailable.
 */
export const VA_PICKUP_TAX_PERCENT = 6.0;

export const VA_PICKUP_TAX_RATE = VA_PICKUP_TAX_PERCENT / 100;

export const VA_PICKUP_TAX_LABEL = `VA sales tax (${VA_PICKUP_TAX_PERCENT}%)`;

/** Round half-up to whole cents (matches typical sales-tax rounding). */
export function taxCentsFromSubtotal(
  subtotalCents: number,
  rate = VA_PICKUP_TAX_RATE,
): number {
  if (subtotalCents <= 0) return 0;
  return Math.round(subtotalCents * rate);
}

export function estimatePickupTax(subtotalCents: number) {
  const taxCents = taxCentsFromSubtotal(subtotalCents);
  return {
    subtotalCents,
    taxCents,
    totalCents: subtotalCents + taxCents,
    ratePercent: String(VA_PICKUP_TAX_PERCENT),
    rateLabel: VA_PICKUP_TAX_LABEL,
  };
}

export function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatDollars(amount: number) {
  return `$${amount.toFixed(2)}`;
}
