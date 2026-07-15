"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { Product } from "@/data/products";
import { packDeals, packPriceDollars } from "@/data/packs";

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
              <span className="block text-[0.65rem] font-medium text-[var(--ink-muted)]">
                each
              </span>
            </p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[var(--cocoa-soft)] sm:text-base">
            {product.description}
          </p>

          <div className="mt-4 rounded-xl border border-[var(--blush)]/60 bg-[var(--cream)]/80 px-3.5 py-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--rose)]">
              Pack deals
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-[var(--cocoa)]">
              {packDeals.map((pack) => (
                <li
                  key={pack.id}
                  className="flex items-baseline justify-between gap-2"
                >
                  <span>
                    <span className="font-semibold">{pack.displayName}</span>
                    <span className="text-[var(--ink-muted)]">
                      {" "}
                      · {pack.quantity} treats
                    </span>
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums text-[var(--rose)]">
                    ${packPriceDollars(product.price, pack).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {product.ingredients.length > 0 ? (
            <div className="product-ingredients mt-4">
              <p className="product-ingredients-label">Made with</p>
              <ul className="product-ingredients-list">
                {product.ingredients.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <p className="product-allergen-note mt-3">
            Baked with flour, eggs, butter, and sugar. May contain wheat, eggs,
            milk, soy, and nuts. Home kitchen with shared equipment — nut
            cross-contact is possible on every product. Porch pickup only.
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <a
              href={`/order?product=${product.id}`}
              onClick={onClose}
              className="btn-primary min-h-11 flex-1 text-center"
            >
              Order a pack
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
