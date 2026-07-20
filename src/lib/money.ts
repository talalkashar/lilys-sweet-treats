/** Display unit prices consistently ($8 or $8.75). */
export function formatUnitPrice(price: number): string {
  return Number.isInteger(price) ? price.toFixed(0) : price.toFixed(2);
}

/** Format cents as $X.XX */
export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/** Format dollars as $X.XX */
export function formatDollars(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
