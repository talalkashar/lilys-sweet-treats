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
    console.log("Order draft (Stripe next):", { ...form, total });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-[1.75rem] border border-[var(--mint)] bg-[var(--mint-soft)] p-8 text-center sm:p-10">
        <div className="text-4xl" aria-hidden>
          ✨
        </div>
        <h3 className="mt-3 font-display text-3xl text-[var(--cocoa)]">
          You&apos;re on the list
        </h3>
        <p className="mx-auto mt-3 max-w-md text-[var(--cocoa-soft)]">
          We have your pickup request. Online payment is next — for now Lily
          will confirm by text or call.
        </p>
        <p className="mt-5 text-sm font-semibold text-[var(--cocoa)]">
          {selected?.name} × {form.quantity} · ${total.toFixed(2)} ·{" "}
          {form.pickupWindow}
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setForm(initial);
          }}
          className="btn-secondary mt-8"
        >
          Place another order
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[1.75rem] border border-[var(--blush)] bg-white p-6 shadow-[var(--shadow-soft)] sm:p-9"
    >
      <div className="mb-7 rounded-2xl bg-gradient-to-r from-[var(--lavender-soft)] via-[var(--blush)]/40 to-[var(--mint-soft)] px-4 py-3.5 text-sm text-[var(--cocoa-soft)]">
        <strong className="text-[var(--cocoa)]">Porch pickup only.</strong>{" "}
        {site.leadTime} Card checkout connects when Stripe is ready.
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
            Notes (flavors, message, allergies…)
          </span>
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            className="field min-h-[110px] resize-y"
            placeholder="Optional"
          />
        </label>
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t border-[var(--blush)]/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--cocoa-soft)]">
          Estimated total
          <span className="ml-2 font-display text-3xl font-medium text-[var(--cocoa)]">
            ${total.toFixed(2)}
          </span>
        </p>
        <button type="submit" className="btn-primary">
          Request pickup order
        </button>
      </div>
    </form>
  );
}
