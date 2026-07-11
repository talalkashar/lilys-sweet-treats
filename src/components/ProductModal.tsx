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

      <div className="modal-panel relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border-2 border-white bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-3xl">
        {/* Fixed height frame: image fits fully (contain) so nothing looks stretched */}
        <div className="relative h-[min(48vh,360px)] shrink-0 bg-[var(--cream-deep)] sm:h-[380px]">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              quality={92}
              className="object-contain object-center p-2 sm:p-3"
              sizes="(max-width: 640px) 100vw, 512px"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl">
              {product.emoji}
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-xl text-[var(--cocoa)] shadow-md backdrop-blur transition hover:bg-white"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto p-6 sm:p-8">
          <div className="flex items-start justify-between gap-3">
            <h2
              id="product-modal-title"
              className="font-display text-3xl leading-tight text-[var(--cocoa)]"
            >
              {product.name}
            </h2>
            <p className="shrink-0 rounded-full bg-[var(--lavender-soft)] px-3 py-1 text-base font-semibold text-[var(--cocoa)]">
              ${product.price.toFixed(0)}
            </p>
          </div>
          <p className="mt-4 text-[1.05rem] leading-relaxed text-[var(--cocoa-soft)]">
            {product.description}
          </p>
          <p className="mt-4 text-sm text-[var(--ink-muted)]">
            Porch pickup only · Pre-order required
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={`#order?product=${product.id}`}
              onClick={onClose}
              className="btn-primary flex-1 text-center"
            >
              Order for pickup
            </a>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Keep browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
