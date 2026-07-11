"use client";

import { useMemo, useState } from "react";
import { products } from "@/data/products";
import { site } from "@/data/site";

type FormState = {
  name: string;
  phone: string;
  email: string;
  productId: string;
  quantity: string;
  pickupWindow: string;
  notes: string;
};

const initial: FormState = {
  name: "",
  phone: "",
  email: "",
  productId: products[0]?.id ?? "",
  quantity: "1",
  pickupWindow: site.pickupWindows[0] ?? "",
  notes: "",
};

export function OrderForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [submitted, setSubmitted] = useState(false);

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

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Stripe checkout plugs in here later.
    // For now we collect the order details so the flow is ready.
    console.log("Order draft (Stripe next):", { ...form, total });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-[var(--blush)] bg-white p-8 text-center shadow-sm">
        <div className="text-4xl" aria-hidden>
          ✨
        </div>
        <h3 className="mt-3 font-display text-2xl text-[var(--cocoa)]">
          Order details received
        </h3>
        <p className="mt-2 text-[var(--cocoa-soft)]">
          Online card checkout is coming next (Stripe). For now we&apos;ve saved
          your pickup request — Lily will confirm by phone or text.
        </p>
        <p className="mt-4 text-sm font-medium text-[var(--cocoa)]">
          {selected?.name} × {form.quantity} · ~${total.toFixed(2)} ·{" "}
          {form.pickupWindow}
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setForm(initial);
          }}
          className="mt-6 rounded-full border border-[var(--blush)] px-5 py-2 text-sm font-semibold text-[var(--cocoa)] hover:bg-[var(--cream)]"
        >
          Place another order
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-[var(--blush)] bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="mb-6 rounded-2xl bg-[var(--cream)] px-4 py-3 text-sm text-[var(--cocoa-soft)]">
        <strong className="text-[var(--cocoa)]">Porch pickup only.</strong>{" "}
        {site.leadTime} Payment online will be enabled once Stripe is connected.
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block sm:col-span-1">
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
            placeholder="For pickup updates"
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
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — ${p.price}
              </option>
            ))}
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
            Notes (flavors, message on cake, allergies…)
          </span>
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            className="field min-h-[100px] resize-y"
            placeholder="Optional"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--cocoa-soft)]">
          Estimated total:{" "}
          <span className="text-lg font-semibold text-[var(--cocoa)]">
            ${total.toFixed(2)}
          </span>
        </p>
        <button
          type="submit"
          className="rounded-full bg-[var(--rose)] px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--rose-deep)]"
        >
          Request pickup order
        </button>
      </div>
    </form>
  );
}
