"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { CheckoutPayment } from "@/components/CheckoutPayment";
import {
  availableProducts,
  menuCategories,
  productsInCategory,
} from "@/data/products";
import {
  formatPackLabel,
  getPackDeal,
  maxPacksPerOrder,
  packDeals,
  packDealsForProduct,
  packFullPrice,
  packPriceDollars,
  packSavings,
  type PackDeal,
} from "@/data/packs";
import { site } from "@/data/site";
import {
  estimatePickupTax,
  formatCents,
  VA_PICKUP_TAX_LABEL,
} from "@/lib/tax-rate";
import { getStripePublishableKey } from "@/lib/stripe-mode";

const stripePromise = loadStripe(getStripePublishableKey());

type CartLine = {
  id: string;
  productId: string;
  packId: string;
};

type ContactState = {
  name: string;
  phone: string;
  email: string;
  pickupWindow: string;
  notes: string;
};

type Step = "details" | "pay";

function newLineId() {
  return `line-${Math.random().toString(36).slice(2, 10)}`;
}

const elementsAppearance: StripeElementsOptions["appearance"] = {
  theme: "stripe",
  variables: {
    colorPrimary: "#ffb6d4",
    colorBackground: "#ffffff",
    colorText: "#2a1f2d",
    colorDanger: "#df1b41",
    fontFamily: "system-ui, sans-serif",
    borderRadius: "12px",
    spacingUnit: "4px",
  },
};

export function OrderForm() {
  const searchParams = useSearchParams();
  const productParam = searchParams.get("product");

  const starterProductId =
    productParam && availableProducts.some((p) => p.id === productParam)
      ? productParam
      : (availableProducts[0]?.id ?? "");

  const [contact, setContact] = useState<ContactState>({
    name: "",
    phone: "",
    email: "",
    pickupWindow: site.pickupWindows[0] ?? "",
    notes: "",
  });
  /** Flavor currently selected for the next pack click */
  const [activeProductId, setActiveProductId] = useState(starterProductId);
  /** Cart starts empty — packs only appear when customer clicks a pack option */
  const [cart, setCart] = useState<CartLine[]>([]);

  const [step, setStep] = useState<Step>("details");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  /** Tax breakdown from Stripe Tax (set when starting payment) */
  const [taxQuote, setTaxQuote] = useState<{
    subtotalLabel: string;
    taxLabel: string;
    totalLabel: string;
    taxRateLabel: string;
  } | null>(null);
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (highlightTimer.current) clearTimeout(highlightTimer.current);
    };
  }, []);

  const activeProduct = useMemo(
    () => availableProducts.find((p) => p.id === activeProductId),
    [activeProductId],
  );

  const resolvedCart = useMemo(() => {
    return cart
      .map((line) => {
        const product = availableProducts.find((p) => p.id === line.productId);
        const pack = getPackDeal(line.packId, line.productId);
        if (!product || !pack) return null;
        const price = packPriceDollars(product.price, pack);
        const save = packSavings(product.price, pack);
        const full = packFullPrice(product.price, pack);
        return {
          ...line,
          product,
          pack,
          price,
          save,
          full,
          label: `${product.name} — ${formatPackLabel(pack)}`,
        };
      })
      .filter(Boolean) as Array<{
      id: string;
      productId: string;
      packId: string;
      product: (typeof availableProducts)[number];
      pack: PackDeal;
      price: number;
      save: number;
      full: number;
      label: string;
    }>;
  }, [cart]);

  const total = resolvedCart.reduce((sum, line) => sum + line.price, 0);
  const activePackDeals = activeProduct
    ? packDealsForProduct(activeProduct.id)
    : packDeals.filter((pack) => !pack.productIds);
  const totalSavings = resolvedCart.reduce((sum, line) => sum + line.save, 0);
  const totalTreats = resolvedCart.reduce(
    (sum, line) => sum + line.pack.quantity,
    0,
  );

  /** Live cart tax estimate (Haymarket VA porch pickup). Final amount confirmed at payment. */
  const cartTax = useMemo(() => {
    const subtotalCents = Math.round(total * 100);
    return estimatePickupTax(subtotalCents);
  }, [total]);

  /** How many of each pack size are already in cart for the active flavor */
  const countInCartForActive = (packId: string) =>
    cart.filter(
      (l) => l.productId === activeProductId && l.packId === packId,
    ).length;

  function updateContact<K extends keyof ContactState>(
    key: K,
    value: ContactState[K],
  ) {
    setContact((c) => ({ ...c, [key]: value }));
  }

  function removeLine(id: string) {
    setCart((prev) => prev.filter((l) => l.id !== id));
    setJustAdded(null);
  }

  /** Clicking a pack option always ADDS that pack for the selected flavor */
  function addPack(pack: PackDeal) {
    if (!activeProductId) {
      setError("Choose a treat flavor first.");
      return;
    }
    if (cart.length >= maxPacksPerOrder) {
      setError(`You can add up to ${maxPacksPerOrder} packs per order.`);
      return;
    }
    setError(null);
    const id = newLineId();
    setCart((prev) => [
      ...prev,
      { id, productId: activeProductId, packId: pack.id },
    ]);
    setJustAdded(`${activeProductId}:${pack.id}:${id}`);
    if (highlightTimer.current) clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(() => {
      setJustAdded((cur) => (cur?.endsWith(id) ? null : cur));
    }, 1200);
  }

  async function onContinueToPayment(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    if (resolvedCart.length === 0) {
      setError("Tap a pack size to add it to your order.");
      setBusy(false);
      return;
    }

    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: resolvedCart.map((line) => ({
            productId: line.productId,
            packId: line.packId,
            quantity: line.pack.quantity,
          })),
          name: contact.name,
          phone: contact.phone,
          email: contact.email,
          pickupWindow: contact.pickupWindow,
          notes: contact.notes,
        }),
      });

      const data = (await res.json()) as {
        clientSecret?: string;
        error?: string;
        subtotalLabel?: string;
        taxLabel?: string;
        totalLabel?: string;
        taxRateLabel?: string;
      };

      if (!res.ok || !data.clientSecret) {
        throw new Error(data.error || "Could not start payment");
      }

      setTaxQuote({
        subtotalLabel:
          data.subtotalLabel || formatCents(cartTax.subtotalCents),
        taxLabel: data.taxLabel || formatCents(cartTax.taxCents),
        totalLabel: data.totalLabel || formatCents(cartTax.totalCents),
        taxRateLabel: data.taxRateLabel || VA_PICKUP_TAX_LABEL,
      });
      setClientSecret(data.clientSecret);
      setStep("pay");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (step === "pay" && clientSecret && taxQuote) {
    return (
      <div className="form-shell p-5 sm:p-6">
        <div className="mb-5">
          <p className="section-label">Step 2 of 2</p>
          <h3 className="mt-1 font-display text-xl text-[var(--cocoa)]">
            Payment
          </h3>
          <ul className="mt-2 space-y-1 text-sm text-[var(--cocoa-soft)]">
            {resolvedCart.map((line) => (
              <li key={line.id}>
                {line.label}{" "}
                <span className="tabular-nums text-[var(--rose)]">
                  ${line.price.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 space-y-1 border-t border-[var(--blush)]/50 pt-3 text-sm">
            <div className="flex justify-between gap-3 text-[var(--cocoa-soft)]">
              <span>Subtotal</span>
              <span className="tabular-nums text-[var(--cocoa)]">
                {taxQuote.subtotalLabel}
              </span>
            </div>
            <div className="flex justify-between gap-3 text-[var(--cocoa-soft)]">
              <span>{taxQuote.taxRateLabel}</span>
              <span className="tabular-nums text-[var(--cocoa)]">
                {taxQuote.taxLabel}
              </span>
            </div>
            <div className="flex justify-between gap-3 font-semibold text-[var(--cocoa)]">
              <span>Total due</span>
              <span className="tabular-nums">{taxQuote.totalLabel}</span>
            </div>
            <p className="pt-1 text-xs text-[var(--ink-muted)]">
              Tax from Stripe Tax · charged with your payment
            </p>
          </div>
          <p className="mt-2 text-sm text-[var(--cocoa-soft)]">
            {contact.pickupWindow}
          </p>
        </div>

        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: elementsAppearance,
          }}
        >
          <CheckoutPayment
            subtotalLabel={taxQuote.subtotalLabel}
            taxLabel={taxQuote.taxLabel}
            totalLabel={taxQuote.totalLabel}
            taxRateLabel={taxQuote.taxRateLabel}
            onBack={() => {
              setStep("details");
              setClientSecret(null);
              setTaxQuote(null);
            }}
          />
        </Elements>
      </div>
    );
  }

  return (
    <form onSubmit={onContinueToPayment} className="form-shell p-4 sm:p-6">
      <div className="mb-5">
        <p className="section-label">Step 1 of 2</p>
        <h3 className="mt-1 font-display text-xl text-[var(--cocoa)] sm:text-2xl">
          Your order
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--cocoa-soft)]">
          Pick a flavor, then tap each pack you want — 4-pack, 8-pack, or party
          tray. Every tap adds to your cart. Switch flavors anytime and keep
          adding.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[var(--cocoa)]">
            Your name
          </span>
          <input
            required
            value={contact.name}
            onChange={(e) => updateContact("name", e.target.value)}
            className="field"
            placeholder="Full name"
            autoComplete="name"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[var(--cocoa)]">
            Phone
          </span>
          <input
            required
            type="tel"
            value={contact.phone}
            onChange={(e) => updateContact("phone", e.target.value)}
            className="field"
            placeholder="Best number for pickup day"
            autoComplete="tel"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-[var(--cocoa)]">
            Email
          </span>
          <input
            required
            type="email"
            value={contact.email}
            onChange={(e) => updateContact("email", e.target.value)}
            className="field"
            placeholder="you@email.com"
            autoComplete="email"
          />
        </label>

        {/* Flavor picker */}
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-[var(--cocoa)]">
            1. Choose a flavor
          </span>
          <select
            value={activeProductId}
            onChange={(e) => setActiveProductId(e.target.value)}
            className="field"
            required
          >
            {menuCategories.map((cat) => {
              const items = productsInCategory(cat.id);
              if (items.length === 0) return null;
              return (
                <optgroup key={cat.id} label={cat.title}>
                  {items.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                      {p.showUnitPrice !== false
                        ? ` ($${Number.isInteger(p.price) ? p.price.toFixed(0) : p.price.toFixed(2)} each)`
                        : ""}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
        </label>

        {/* Pack options — each click ADDS to cart */}
        <div className="sm:col-span-2">
          <p className="mb-2 text-sm font-medium text-[var(--cocoa)]">
            2. Tap packs to add them
            {activeProduct ? (
              <span className="font-normal text-[var(--ink-muted)]">
                {" "}
                · for {activeProduct.name}
              </span>
            ) : null}
          </p>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {activePackDeals.map((pack) => {
              const price = activeProduct
                ? packPriceDollars(activeProduct.price, pack)
                : null;
              const save = activeProduct
                ? packSavings(activeProduct.price, pack)
                : 0;
              const inCart = countInCartForActive(pack.id);
              const disabled = cart.length >= maxPacksPerOrder;

              return (
                <button
                  key={pack.id}
                  type="button"
                  disabled={disabled || !activeProduct}
                  onClick={() => addPack(pack)}
                  className={`relative flex flex-col rounded-2xl border-2 px-3.5 py-3.5 text-left transition ${
                    inCart > 0
                      ? "border-[var(--rose)] bg-[var(--lavender-soft)] shadow-[var(--shadow-soft)]"
                      : "border-[var(--blush)]/70 bg-white hover:border-[var(--rose)] hover:bg-[var(--lavender-soft)]/50"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {pack.featured ? (
                    <span className="absolute -top-2 right-3 rounded-full bg-[var(--rose)] px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-white">
                      Party
                    </span>
                  ) : null}
                  {inCart > 0 ? (
                    <span className="absolute -top-2 left-3 rounded-full bg-[var(--cocoa)] px-2 py-0.5 text-[0.65rem] font-bold tabular-nums text-white">
                      ×{inCart} in cart
                    </span>
                  ) : null}
                  <span className="font-display text-lg text-[var(--cocoa)]">
                    {pack.displayName}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
                    {pack.quantity} treats
                  </span>
                  <span className="mt-1 text-xs leading-snug text-[var(--cocoa-soft)]">
                    {pack.blurb}
                  </span>
                  {price != null ? (
                    <span className="mt-2 text-sm font-semibold tabular-nums text-[var(--rose)]">
                      + ${price.toFixed(2)}
                      {save > 0 ? (
                        <span className="ml-1.5 text-xs font-medium text-[var(--mint)]">
                          save ${save.toFixed(2)}
                        </span>
                      ) : null}
                    </span>
                  ) : null}
                  <span className="mt-2 text-xs font-bold uppercase tracking-wide text-[var(--rose)]">
                    Tap to add
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-[var(--ink-muted)]">
            Want a 4-pack <em>and</em> an 8-pack? Tap both — each adds to your
            total. Change the flavor above, then tap more packs to mix.
          </p>
        </div>

        {/* Live cart */}
        <div className="sm:col-span-2">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-[var(--cocoa)]">Your cart</p>
            <p className="text-xs text-[var(--ink-muted)]">
              {resolvedCart.length === 0
                ? "Empty — tap a pack above"
                : `${resolvedCart.length} pack${resolvedCart.length === 1 ? "" : "s"} · ${totalTreats} treats`}
            </p>
          </div>

          {resolvedCart.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--blush)] bg-[var(--cream)]/60 px-4 py-6 text-center text-sm text-[var(--ink-muted)]">
              No packs yet. Choose a flavor, then tap{" "}
              <strong className="text-[var(--cocoa)]">4-pack</strong>,{" "}
              <strong className="text-[var(--cocoa)]">8-pack</strong>, or{" "}
              <strong className="text-[var(--cocoa)]">Party tray</strong>.
            </div>
          ) : (
            <ul className="space-y-2">
              {resolvedCart.map((line) => {
                const highlight = justAdded?.endsWith(line.id);
                return (
                  <li
                    key={line.id}
                    className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3 transition ${
                      highlight
                        ? "border-[var(--rose)] bg-[var(--lavender-soft)]"
                        : "border-[var(--blush)]/70 bg-white"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--cocoa)]">
                        {line.product.name}
                      </p>
                      <p className="text-xs text-[var(--ink-muted)]">
                        {formatPackLabel(line.pack)}
                        {line.save > 0
                          ? ` · save $${line.save.toFixed(2)}`
                          : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-sm font-semibold tabular-nums text-[var(--rose)]">
                        ${line.price.toFixed(2)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeLine(line.id)}
                        className="rounded-full border border-[var(--blush)] px-2.5 py-1 text-xs font-semibold text-[var(--cocoa-soft)] hover:border-[var(--rose)] hover:text-[var(--rose)]"
                        aria-label={`Remove ${line.label}`}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-[var(--cocoa)]">
            Pickup window
          </span>
          <select
            required
            value={contact.pickupWindow}
            onChange={(e) => updateContact("pickupWindow", e.target.value)}
            className="field"
          >
            {site.pickupWindows.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-[var(--cocoa)]">
            Notes{" "}
            <span className="font-normal text-[var(--ink-muted)]">
              (optional)
            </span>
          </span>
          <textarea
            value={contact.notes}
            onChange={(e) => updateContact("notes", e.target.value)}
            className="field min-h-[100px] resize-y"
            placeholder="Anything we should know?"
          />
        </label>
      </div>

      {error ? (
        <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col gap-4 border-t border-[var(--blush)]/60 pt-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1 text-sm">
          {resolvedCart.length === 0 ? (
            <p className="text-[var(--ink-muted)]">
              Add at least one pack to continue
            </p>
          ) : (
            <div className="rounded-2xl border border-[var(--blush)]/60 bg-[var(--cream)]/70 px-4 py-3.5">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--rose)]">
                Estimated total with tax
              </p>
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center justify-between gap-3 text-[var(--cocoa-soft)]">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-medium text-[var(--cocoa)]">
                    {formatCents(cartTax.subtotalCents)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 text-[var(--cocoa-soft)]">
                  <span>Est. {cartTax.rateLabel}</span>
                  <span className="tabular-nums font-medium text-[var(--cocoa)]">
                    {formatCents(cartTax.taxCents)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-[var(--blush)]/50 pt-2 font-semibold text-[var(--cocoa)]">
                  <span>Est. total</span>
                  <span className="font-display text-2xl font-medium tabular-nums">
                    {formatCents(cartTax.totalCents)}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[var(--ink-muted)]">
                {resolvedCart.length} pack
                {resolvedCart.length === 1 ? "" : "s"} · {totalTreats} treats
                {totalSavings > 0
                  ? ` · save $${totalSavings.toFixed(2)}`
                  : ""}
                . Exact sales tax is calculated by Stripe Tax when you continue
                to payment (Haymarket, VA porch pickup). By continuing you agree
                to our{" "}
                <a href="/policies" className="font-semibold text-[var(--rose)] underline-offset-2 hover:underline">
                  order policies
                </a>{" "}
                and{" "}
                <a href="/privacy" className="font-semibold text-[var(--rose)] underline-offset-2 hover:underline">
                  privacy policy
                </a>
                .
              </p>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="btn-primary w-full sm:w-auto sm:shrink-0"
          disabled={busy || resolvedCart.length === 0}
        >
          {busy
            ? "Preparing…"
            : resolvedCart.length === 0
              ? "Continue to payment"
              : `Continue · ${formatCents(cartTax.totalCents)}`}
        </button>
      </div>
    </form>
  );
}
