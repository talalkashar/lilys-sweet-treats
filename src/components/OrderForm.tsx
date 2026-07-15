"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { CheckoutPayment } from "@/components/CheckoutPayment";
import {
  availableProducts,
  menuCategories,
  productsInCategory,
} from "@/data/products";
import {
  defaultPackId,
  getPackDeal,
  packDeals,
  packFullPrice,
  packPriceDollars,
  packSavings,
} from "@/data/packs";
import { site } from "@/data/site";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
);

type FormState = {
  name: string;
  phone: string;
  email: string;
  productId: string;
  packId: string;
  pickupWindow: string;
  notes: string;
};

type Step = "details" | "pay";

const initial: FormState = {
  name: "",
  phone: "",
  email: "",
  productId: availableProducts[0]?.id ?? "",
  packId: defaultPackId,
  pickupWindow: site.pickupWindows[0] ?? "",
  notes: "",
};

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
  const packParam = searchParams.get("pack");

  const initialProductId =
    productParam && availableProducts.some((p) => p.id === productParam)
      ? productParam
      : initial.productId;
  const initialPackId =
    packParam && getPackDeal(packParam) ? packParam : initial.packId;

  const [form, setForm] = useState<FormState>(() => ({
    ...initial,
    productId: initialProductId,
    packId: initialPackId,
  }));
  const [step, setStep] = useState<Step>("details");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = useMemo(
    () => availableProducts.find((p) => p.id === form.productId),
    [form.productId],
  );

  const pack = useMemo(() => getPackDeal(form.packId), [form.packId]);

  const total =
    selected && pack ? packPriceDollars(selected.price, pack) : 0;
  const savings =
    selected && pack ? packSavings(selected.price, pack) : 0;
  const full =
    selected && pack ? packFullPrice(selected.price, pack) : 0;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onContinueToPayment(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    if (!pack) {
      setError("Choose a pack size: 4-pack, 8-pack, or party tray (12).");
      setBusy(false);
      return;
    }

    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: form.productId,
          packId: form.packId,
          quantity: pack.quantity,
          name: form.name,
          phone: form.phone,
          email: form.email,
          pickupWindow: form.pickupWindow,
          notes: form.notes,
        }),
      });

      const data = (await res.json()) as {
        clientSecret?: string;
        error?: string;
      };

      if (!res.ok || !data.clientSecret) {
        throw new Error(data.error || "Could not start payment");
      }

      setClientSecret(data.clientSecret);
      setStep("pay");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  const packSummary = pack
    ? pack.displayName === pack.label
      ? `${pack.label} (${pack.quantity})`
      : `${pack.displayName} (${pack.quantity})`
    : "";

  if (step === "pay" && clientSecret) {
    return (
      <div className="form-shell p-5 sm:p-6">
        <div className="mb-5">
          <p className="section-label">Step 2 of 2</p>
          <h3 className="mt-1 font-display text-xl text-[var(--cocoa)]">
            Payment
          </h3>
          <p className="mt-1.5 text-sm text-[var(--cocoa-soft)]">
            {selected?.name} — {packSummary}, {form.pickupWindow}
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
            totalLabel={`$${total.toFixed(2)}`}
            onBack={() => {
              setStep("details");
              setClientSecret(null);
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
          Porch pickup in Haymarket, VA. Choose a flavor and a pack — 4, 8, or
          a party tray of 12. Pay securely on the next step.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[var(--cocoa)]">
            Your name
          </span>
          <input
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
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
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
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
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="field"
            placeholder="you@email.com"
            autoComplete="email"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-[var(--cocoa)]">
            Treat
          </span>
          <select
            required
            value={form.productId}
            onChange={(e) => update("productId", e.target.value)}
            className="field"
          >
            {menuCategories.map((cat) => {
              const items = productsInCategory(cat.id);
              if (items.length === 0) return null;
              return (
                <optgroup key={cat.id} label={cat.title}>
                  {items.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (${p.price} each)
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
        </label>

        <fieldset className="block sm:col-span-2">
          <legend className="mb-2 block text-sm font-medium text-[var(--cocoa)]">
            Pack size
          </legend>
          <div className="grid gap-2.5 sm:grid-cols-3">
            {packDeals.map((p) => {
              const price = selected
                ? packPriceDollars(selected.price, p)
                : null;
              const save = selected ? packSavings(selected.price, p) : 0;
              const active = form.packId === p.id;
              return (
                <label
                  key={p.id}
                  className={`relative flex cursor-pointer flex-col rounded-2xl border-2 px-3.5 py-3 transition ${
                    active
                      ? "border-[var(--rose)] bg-[var(--lavender-soft)] shadow-[var(--shadow-soft)]"
                      : "border-[var(--blush)]/70 bg-white hover:border-[var(--blush-deep)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="packId"
                    value={p.id}
                    checked={active}
                    onChange={() => update("packId", p.id)}
                    className="sr-only"
                  />
                  {p.featured ? (
                    <span className="absolute -top-2 right-3 rounded-full bg-[var(--rose)] px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-white">
                      Party
                    </span>
                  ) : null}
                  <span className="font-display text-lg text-[var(--cocoa)]">
                    {p.displayName}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
                    {p.quantity} treats
                  </span>
                  <span className="mt-1 text-xs leading-snug text-[var(--cocoa-soft)]">
                    {p.blurb}
                  </span>
                  {price != null ? (
                    <span className="mt-2 text-sm font-semibold tabular-nums text-[var(--rose)]">
                      ${price.toFixed(2)}
                      {save > 0 ? (
                        <span className="ml-1.5 text-xs font-medium text-[var(--mint)]">
                          save ${save.toFixed(2)}
                        </span>
                      ) : null}
                    </span>
                  ) : null}
                </label>
              );
            })}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-[var(--ink-muted)]">
            Bigger packs unlock a little savings. One flavor per checkout —
            party trays are great for birthdays and get-togethers.
          </p>
        </fieldset>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-[var(--cocoa)]">
            Pickup window
          </span>
          <select
            required
            value={form.pickupWindow}
            onChange={(e) => update("pickupWindow", e.target.value)}
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
              (optional: message on box, allergies note for your group)
            </span>
          </span>
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
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

      <div className="mt-6 flex flex-col gap-3 border-t border-[var(--blush)]/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-[var(--cocoa-soft)]">
          <p>
            Estimated total
            <span className="ml-2 font-display text-2xl font-medium tabular-nums text-[var(--cocoa)]">
              ${total.toFixed(2)}
            </span>
          </p>
          {savings > 0 ? (
            <p className="mt-0.5 text-xs text-[var(--mint)]">
              Pack deal — you save ${savings.toFixed(2)} vs ${full.toFixed(2)}{" "}
              single price
            </p>
          ) : (
            <p className="mt-0.5 text-xs text-[var(--ink-muted)]">
              {packSummary}
              {selected ? ` · $${selected.price} each` : ""}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="btn-primary w-full sm:w-auto"
          disabled={busy}
        >
          {busy ? "Preparing…" : "Continue to payment"}
        </button>
      </div>
    </form>
  );
}
