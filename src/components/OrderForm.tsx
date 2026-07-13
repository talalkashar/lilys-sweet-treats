"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CheckoutPayment } from "@/components/CheckoutPayment";
import { menuCategories, products, productsInCategory } from "@/data/products";
import { site } from "@/data/site";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
);

type FormState = {
  name: string;
  phone: string;
  email: string;
  productId: string;
  quantity: string;
  pickupWindow: string;
  notes: string;
};

type Step = "details" | "pay";

const initial: FormState = {
  name: "",
  phone: "",
  email: "",
  productId: products[0]?.id ?? "",
  quantity: "1",
  pickupWindow: site.pickupWindows[0] ?? "",
  notes: "",
};

const elementsAppearance: StripeElementsOptions["appearance"] = {
  theme: "stripe",
  variables: {
    colorPrimary: "#ff4d94",
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
  const [form, setForm] = useState<FormState>(initial);
  const [step, setStep] = useState<Step>("details");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get("product");
    if (id && products.some((p) => p.id === id)) {
      setForm((f) => ({ ...f, productId: id }));
    }
  }, [searchParams]);

  const selected = useMemo(
    () => products.find((p) => p.id === form.productId),
    [form.productId],
  );

  const total =
    selected && form.quantity
      ? selected.price * Math.max(1, Number(form.quantity) || 1)
      : 0;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onContinueToPayment(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: form.productId,
          quantity: Number(form.quantity) || 1,
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

  if (step === "pay" && clientSecret) {
    return (
      <div className="form-shell rounded-[1.75rem] border-2 border-[var(--blush)] bg-white p-6 shadow-[var(--shadow-soft)] sm:p-9">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--rose)]">
            Step 2 of 2
          </p>
          <h3 className="mt-1 font-display text-2xl text-[var(--cocoa)]">
            Payment
          </h3>
          <p className="mt-2 text-sm text-[var(--cocoa-soft)]">
            {selected?.name} × {form.quantity}, {form.pickupWindow}
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
    <form
      onSubmit={onContinueToPayment}
      className="form-shell rounded-[1.75rem] border-2 border-[var(--blush)] bg-white p-6 shadow-[var(--shadow-soft)] sm:p-9"
    >
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--rose)]">
          Step 1 of 2
        </p>
        <h3 className="mt-1 font-display text-2xl text-[var(--cocoa)]">
          Your order
        </h3>
      </div>

      <div className="mb-7 rounded-2xl bg-[var(--lavender-soft)] px-4 py-3.5 text-sm text-[var(--cocoa-soft)]">
        <strong className="text-[var(--cocoa)]">Porch pickup only.</strong>{" "}
        {site.leadTime} Pay securely on this page (no redirect to another site).
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
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
        <label className="block">
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
                      {p.name} (${p.price})
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[var(--cocoa)]">
            Quantity
          </span>
          <input
            required
            type="number"
            min={1}
            max={20}
            value={form.quantity}
            onChange={(e) => update("quantity", e.target.value)}
            className="field"
          />
        </label>
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
              (optional: flavors, allergies, message)
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

      <div className="mt-8 flex flex-col gap-4 border-t border-[var(--blush)]/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--cocoa-soft)]">
          Estimated total
          <span className="ml-2 font-display text-3xl font-medium text-[var(--cocoa)]">
            ${total.toFixed(2)}
          </span>
        </p>
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? "Preparing…" : "Continue to payment"}
        </button>
      </div>
    </form>
  );
}
