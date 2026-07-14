"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { Product } from "@/data/products";

type Props = {
  product: Product | null;
  onClose: () => void;
};

export function ProductModal({ product, onClose }: Props) {
  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div
      className="modal-backdrop fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[var(--cocoa)]/50 backdrop-blur-sm"
        aria-label="Close product details"
        onClick={onClose}
      />

      <div className="modal-panel relative z-10 flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl border border-white bg-white shadow-[var(--shadow-lift)] sm:max-h-[85vh] sm:rounded-2xl">
        <div className="relative aspect-[3/2] shrink-0 bg-[var(--cream-deep)]">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              quality={90}
              className="object-cover object-center"
              sizes="(max-width: 640px) 100vw, 448px"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-5xl">
              {product.emoji}
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-lg text-[var(--cocoa)] shadow-sm"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <h2
              id="product-modal-title"
              className="font-display text-xl leading-snug text-[var(--cocoa)] sm:text-2xl"
            >
              {product.name}
            </h2>
            <p className="shrink-0 text-sm font-semibold tabular-nums text-[var(--rose)]">
              ${product.price.toFixed(0)}
            </p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[var(--cocoa-soft)] sm:text-base">
            {product.description}
          </p>

          {product.ingredients.length > 0 ? (
            <div className="product-ingredients mt-4">
              <p className="product-ingredients-label">Ingredients</p>
              <ul className="product-ingredients-list">
                {product.ingredients.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-[var(--ink-muted)]">
                Major ingredients listed. Weekly specials may vary slightly.
              </p>
              <p className="product-allergen-note mt-2.5">
                <strong>Contains / may contain:</strong> wheat (flour), eggs,
                milk (butter, cream cheese powder), and soy. Sticky buns with
                nuts contain tree nuts or peanuts. Baked in a home kitchen that
                handles shared equipment. Ask us if you have a serious allergy.
              </p>
            </div>
          ) : null}

          <p className="mt-3 text-xs text-[var(--ink-muted)]">
            Porch pickup only. Pre-order required.
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <a
              href={`/order?product=${product.id}`}
              onClick={onClose}
              className="btn-primary min-h-11 flex-1 text-center"
            >
              Order and pay
            </a>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary min-h-11 flex-1"
            >
              Keep browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
