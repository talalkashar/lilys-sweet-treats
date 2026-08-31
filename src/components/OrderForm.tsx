"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { CheckoutPayment } from "@/components/CheckoutPayment";
import {
  availableProducts,
  menuCategories,
} from "@/data/products";
import {
  formatPackLabel,
  formatPairComposition,
  getPackById,
  maxPacksPerOrder,
  packDeals,
  packDealsForProduct,
  packPriceDollarsFromPairUnitPrices,
  pairRuleCopy,
  productsEligibleForPack,
  treatSlotsForPack,
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
  packId: string;
  /** One product id per treat */
  pairProductIds: string[];
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

function defaultProductId(preferred?: string | null) {
  if (preferred && availableProducts.some((p) => p.id === preferred)) {
    return preferred;
  }
  return availableProducts[0]?.id ?? "";
}

function defaultPackIdForProduct(productId: string) {
  const deals = packDealsForProduct(productId);
  return (
    deals.find((pack) => pack.quantity === 4)?.id ??
    deals[0]?.id ??
    packDeals[0]!.id
  );
}

/**
 * Best-effort cancel of an incomplete PaymentIntent when the customer leaves
 * the pay step. Uses keepalive so tab-close still has a chance to land.
 * Server only cancels if status is still open (never cancels a successful charge).
 * Never throws — checkout UX must not depend on cancel succeeding.
 */
function abandonPaymentIntent(
  paymentIntentId: string | null,
  clientSecret: string | null,
): void {
  if (!paymentIntentId || !clientSecret) return;
  const body = JSON.stringify({ paymentIntentId, clientSecret });
  // Prefer fetch+keepalive so Origin is sent (our API requires same-site Origin).
  try {
    void fetch("/api/cancel-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
    return;
  } catch {
    // fall through
  }
  try {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.sendBeacon === "function"
    ) {
      navigator.sendBeacon(
        "/api/cancel-payment-intent",
        new Blob([body], { type: "application/json" }),
      );
    }
  } catch {
    // ignore
  }
}

export function OrderForm() {
  const searchParams = useSearchParams();
  const productParam = searchParams.get("product");
  const starterId = defaultProductId(productParam);

  const [contact, setContact] = useState<ContactState>({
    name: "",
    phone: "",
    email: "",
    pickupWindow: site.pickupWindows[0] ?? "",
    notes: "",
  });

  /** Pack size currently being built */
  const [builderPackId, setBuilderPackId] = useState(() =>
    defaultPackIdForProduct(starterId),
  );
  /** Flavor for each treat in the builder */
  const [pairSlots, setPairSlots] = useState<string[]>(() => {
    const pack =
      packDeals.find((p) => p.id === defaultPackIdForProduct(starterId)) ??
      packDeals[0]!;
    const eligible = productsEligibleForPack(pack);
    const flavor =
      eligible.some((p) => p.id === starterId) ? starterId : eligible[0]?.id ?? starterId;
    const n = treatSlotsForPack(pack);
    return Array.from({ length: n }, () => flavor);
  });

  const [cart, setCart] = useState<CartLine[]>([]);
  const [step, setStep] = useState<Step>("details");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  /** Last PaymentIntent id — canceled when customer goes back / retries */
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  /** Honeypot — leave empty; bots that fill it are rejected server-side */
  const [websiteTrap, setWebsiteTrap] = useState("");
  const [taxQuote, setTaxQuote] = useState<{
    subtotalLabel: string;
    taxLabel: string;
    totalLabel: string;
    taxRateLabel: string;
  } | null>(null);
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Prevent double-submit race before React re-renders busy=true */
  const submitLock = useRef(false);
  /** Stable per "Continue to payment" click-session — changes on Back */
  const checkoutAttemptId = useRef("");

  function makeAttemptId() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return `att_${Math.floor(performance.now())}_${checkoutAttemptId.current.length}`;
  }

  function ensureCheckoutAttemptId() {
    if (!checkoutAttemptId.current) {
      checkoutAttemptId.current = makeAttemptId();
    }
    return checkoutAttemptId.current;
  }

  function newCheckoutAttempt() {
    checkoutAttemptId.current = makeAttemptId();
  }

  /** Refs so pagehide can cancel without stale closures */
  const paySessionRef = useRef<{
    paymentIntentId: string | null;
    clientSecret: string | null;
    step: Step;
  }>({ paymentIntentId: null, clientSecret: null, step: "details" });
  paySessionRef.current = { paymentIntentId, clientSecret, step };

  useEffect(() => {
    return () => {
      if (highlightTimer.current) clearTimeout(highlightTimer.current);
    };
  }, []);

  // Cancel incomplete PI if the customer closes the tab while on the pay step.
  useEffect(() => {
    function onLeave() {
      const s = paySessionRef.current;
      if (s.step !== "pay") return;
      abandonPaymentIntent(s.paymentIntentId, s.clientSecret);
    }
    window.addEventListener("pagehide", onLeave);
    return () => {
      window.removeEventListener("pagehide", onLeave);
    };
  }, []);

  function leavePayStep() {
    const s = paySessionRef.current;
    abandonPaymentIntent(s.paymentIntentId, s.clientSecret);
    newCheckoutAttempt();
    setStep("details");
    setClientSecret(null);
    setTaxQuote(null);
    // Clear id so we do not try to cancel a canceled PI on next continue
    // (server still sweeps same-email incompletes).
    setPaymentIntentId(null);
  }

  const builderPack = useMemo(
    () => getPackById(builderPackId) ?? packDeals[0]!,
    [builderPackId],
  );

  const slotsNeeded = treatSlotsForPack(builderPack);

  const builderPairProducts = useMemo(() => {
    return pairSlots.map(
      (id) => availableProducts.find((p) => p.id === id) ?? availableProducts[0]!,
    );
  }, [pairSlots]);

  const builderPrice = useMemo(() => {
    if (builderPairProducts.length !== slotsNeeded) return null;
    return packPriceDollarsFromPairUnitPrices(
      builderPairProducts.map((p) => p.price),
      builderPack,
    );
  }, [builderPairProducts, builderPack, slotsNeeded]);

  const builderComposition = useMemo(
    () => formatPairComposition(builderPairProducts.map((p) => p.name)),
    [builderPairProducts],
  );

  const resolvedCart = useMemo(() => {
    return cart
      .map((line) => {
        const pack = getPackById(line.packId);
        if (!pack) return null;
        if (line.pairProductIds.length !== treatSlotsForPack(pack)) return null;
        const pairProducts = line.pairProductIds.map(
          (id) => availableProducts.find((p) => p.id === id)!,
        );
        if (pairProducts.some((p) => !p)) return null;
        const price = packPriceDollarsFromPairUnitPrices(
          pairProducts.map((p) => p.price),
          pack,
        );
        const composition = formatPairComposition(
          pairProducts.map((p) => p.name),
        );
        return {
          ...line,
          pack,
          pairProducts,
          price,
          composition,
          label: `${formatPackLabel(pack)}: ${composition}`,
        };
      })
      .filter(Boolean) as Array<{
      id: string;
      packId: string;
      pairProductIds: string[];
      pack: PackDeal;
      pairProducts: (typeof availableProducts)[number][];
      price: number;
      composition: string;
      label: string;
    }>;
  }, [cart]);

  const total = resolvedCart.reduce((sum, line) => sum + line.price, 0);
  const totalTreats = resolvedCart.reduce(
    (sum, line) => sum + line.pack.quantity,
    0,
  );

  const cartTax = useMemo(() => {
    const subtotalCents = Math.round(total * 100);
    return estimatePickupTax(subtotalCents);
  }, [total]);

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

  function setPairSlot(index: number, productId: string) {
    setPairSlots((prev) => {
      const next = [...prev];
      next[index] = productId;
      return next;
    });
  }

  function fillAllPairs(productId: string) {
    setPairSlots(Array.from({ length: slotsNeeded }, () => productId));
  }

  function selectPackSize(pack: PackDeal) {
    setBuilderPackId(pack.id);
    setError(null);
    const eligible = productsEligibleForPack(pack);
    const fallback = eligible[0]?.id ?? starterId;
    const n = treatSlotsForPack(pack);
    setPairSlots((prev) =>
      Array.from({ length: n }, (_, i) => {
        const id = prev[i] || prev[0] || fallback;
        return eligible.some((p) => p.id === id) ? id : fallback;
      }),
    );
  }

  function addBuiltPack() {
    if (cart.length >= maxPacksPerOrder) {
      setError(`You can add up to ${maxPacksPerOrder} packs per order.`);
      return;
    }
    if (pairSlots.length !== slotsNeeded || pairSlots.some((id) => !id)) {
      setError("Pick a flavor for every treat in this pack.");
      return;
    }
    // Validate products exist
    for (const id of pairSlots) {
      if (!availableProducts.some((p) => p.id === id)) {
        setError("Invalid flavor selected.");
        return;
      }
    }
    setError(null);
    const id = newLineId();
    setCart((prev) => [
      ...prev,
      {
        id,
        packId: builderPack.id,
        pairProductIds: [...pairSlots],
      },
    ]);
    setJustAdded(id);
    if (highlightTimer.current) clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(() => {
      setJustAdded((cur) => (cur === id ? null : cur));
    }, 1200);
  }

  async function onContinueToPayment(e: React.FormEvent) {
    e.preventDefault();
    if (submitLock.current || busy) return;
    submitLock.current = true;
    setBusy(true);
    setError(null);

    if (resolvedCart.length === 0) {
      setError("Add at least one pack to your order.");
      setBusy(false);
      submitLock.current = false;
      return;
    }

    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: resolvedCart.map((line) => ({
            packId: line.packId,
            pairProductIds: line.pairProductIds,
          })),
          name: contact.name,
          phone: contact.phone,
          email: contact.email,
          pickupWindow: contact.pickupWindow,
          notes: contact.notes,
          // Honeypot (must stay empty for real users)
          website: websiteTrap,
          // Cancel previous incomplete intent if customer retried
          previousPaymentIntentId: paymentIntentId,
          // Double-click protection (same attempt → same Stripe idempotency key)
          checkoutAttemptId: ensureCheckoutAttemptId(),
        }),
      });

      const data = (await res.json()) as {
        clientSecret?: string;
        paymentIntentId?: string;
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
      if (data.paymentIntentId) {
        setPaymentIntentId(data.paymentIntentId);
      }
      setStep("pay");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
      submitLock.current = false;
    }
  }

  const flavorOptions = (
    <>
      {menuCategories.map((cat) => {
        const items = productsEligibleForPack(builderPack).filter(
          (p) => p.category === cat.id,
        );
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
    </>
  );

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
            onBack={leavePayStep}
          />
        </Elements>
      </div>
    );
  }

  return (
    <form
      onSubmit={onContinueToPayment}
      className="form-shell relative p-4 sm:p-6"
    >
      <div className="mb-5">
        <p className="section-label">Step 1 of 2</p>
        <h3 className="mt-1 font-display text-xl text-[var(--cocoa)] sm:text-2xl">
          Your order
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--cocoa-soft)]">
          {pairRuleCopy} Pick a pack size, choose each treat&apos;s flavor, then
          add it to your cart. Add more packs anytime.
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
            name="name"
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
            name="phone"
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
            name="email"
            className="field"
            placeholder="you@email.com"
            autoComplete="email"
          />
        </label>

        {/* Honeypot — hidden from humans; bots that fill it are blocked */}
        <div
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
        >
          <label>
            Website
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={websiteTrap}
              onChange={(e) => setWebsiteTrap(e.target.value)}
            />
          </label>
        </div>

        {/* 1. Pack size */}
        <div className="sm:col-span-2">
          <p className="mb-2 text-sm font-medium text-[var(--cocoa)]">
            1. Choose a pack size
          </p>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
            {packDeals.map((pack) => {
              const selected = pack.id === builderPackId;
              return (
                <button
                  key={pack.id}
                  type="button"
                  onClick={() => selectPackSize(pack)}
                  className={`relative flex flex-col rounded-2xl border-2 px-3 py-3 text-left transition duration-500 ease-out ${
                    selected
                      ? "border-[var(--rose)] bg-[var(--lavender-soft)] shadow-[var(--shadow-soft)]"
                      : "border-[var(--blush)]/70 bg-white hover:border-[var(--rose)] hover:bg-[var(--lavender-soft)]/50"
                  }`}
                >
                  {pack.featured ? (
                    <span className="absolute -top-2 right-2 rounded-full bg-[var(--rose)] px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-white">
                      Party
                    </span>
                  ) : null}
                  <span className="font-display text-lg text-[var(--cocoa)]">
                    {pack.displayName}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
                    {pack.quantity} treat{pack.quantity === 1 ? "" : "s"}
                  </span>
                  <span className="mt-1 text-xs leading-snug text-[var(--cocoa-soft)]">
                    {pack.blurb}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Pair flavors */}
        <div className="sm:col-span-2">
          <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
            <p className="text-sm font-medium text-[var(--cocoa)]">
              2. Choose flavor for each treat
              <span className="font-normal text-[var(--ink-muted)]">
                {" "}
                · {builderPack.displayName} ({slotsNeeded} treat
                {slotsNeeded === 1 ? "" : "s"})
              </span>
            </p>
            <label className="flex items-center gap-2 text-xs text-[var(--cocoa-soft)]">
              <span className="whitespace-nowrap">Fill all treats:</span>
              <select
                className="field !py-1.5 !text-xs"
                value=""
                onChange={(e) => {
                  if (e.target.value) fillAllPairs(e.target.value);
                  e.target.value = "";
                }}
                aria-label="Fill all treats with one flavor"
              >
                <option value="">Same flavor…</option>
                {flavorOptions}
              </select>
            </label>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {Array.from({ length: slotsNeeded }, (_, i) => (
              <label
                key={`treat-${builderPackId}-${i}`}
                className="block rounded-2xl border border-[var(--blush)]/70 bg-white px-3.5 py-3"
              >
                <span className="mb-1.5 flex items-center justify-between gap-2 text-sm font-medium text-[var(--cocoa)]">
                  <span>Treat {i + 1}</span>
                </span>
                <select
                  value={pairSlots[i] || starterId}
                  onChange={(e) => setPairSlot(i, e.target.value)}
                  className="field"
                  required
                >
                  {flavorOptions}
                </select>
              </label>
            ))}
          </div>

          <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-[var(--blush)]/50 bg-[var(--cream)]/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 text-sm">
              <p className="font-medium text-[var(--cocoa)]">
                {formatPackLabel(builderPack)}
              </p>
              <p className="text-[var(--cocoa-soft)]">{builderComposition}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {builderPrice != null ? (
                <span className="text-lg font-semibold tabular-nums text-[var(--rose)]">
                  ${builderPrice.toFixed(2)}
                </span>
              ) : null}
              <button
                type="button"
                onClick={addBuiltPack}
                disabled={cart.length >= maxPacksPerOrder}
                className="btn-primary"
              >
                Add pack
              </button>
            </div>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-[var(--ink-muted)]">
            Example: a 4-pack can be four of one flavor, or four different treats.
          </p>
        </div>

        {/* Live cart */}
        <div className="sm:col-span-2">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-[var(--cocoa)]">Your cart</p>
            <p className="text-xs text-[var(--ink-muted)]">
              {resolvedCart.length === 0
                ? "Empty — build a pack above"
                : `${resolvedCart.length} pack${resolvedCart.length === 1 ? "" : "s"} · ${totalTreats} treats`}
            </p>
          </div>

          {resolvedCart.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--blush)] bg-[var(--cream)]/60 px-4 py-6 text-center text-sm text-[var(--ink-muted)]">
              No packs yet. Choose a size, pick each treat&apos;s flavor, then tap{" "}
              <strong className="text-[var(--cocoa)]">Add pack</strong>.
            </div>
          ) : (
            <ul className="space-y-2">
              {resolvedCart.map((line) => {
                const highlight = justAdded === line.id;
                return (
                  <li
                    key={line.id}
                    className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3 transition duration-500 ease-out ${
                      highlight
                        ? "border-[var(--rose)] bg-[var(--lavender-soft)]"
                        : "border-[var(--blush)]/70 bg-white"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--cocoa)]">
                        {formatPackLabel(line.pack)}
                      </p>
                      <p className="text-xs text-[var(--ink-muted)]">
                        {line.composition}
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
                {resolvedCart.length === 1 ? "" : "s"} · {totalTreats} treats.
                Exact sales tax is calculated by Stripe Tax when you continue to
                payment (Atlas Walk Way pickup, Gainesville / Haymarket). By continuing you agree to
                our{" "}
                <a
                  href="/policies"
                  className="font-semibold text-[var(--rose)] underline-offset-2 hover:underline"
                >
                  order policies
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="font-semibold text-[var(--rose)] underline-offset-2 hover:underline"
                >
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
