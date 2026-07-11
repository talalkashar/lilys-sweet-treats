"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/data/products";

type Props = {
  product: Product;
  /** Compact card for order picker */
  variant?: "menu" | "select";
  selected?: boolean;
  onSelect?: (productId: string) => void;
};

export function ProductCard({
  product,
  variant = "menu",
  selected = false,
  onSelect,
}: Props) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = Boolean(product.image) && !imgFailed;

  if (variant === "select") {
    return (
      <button
        type="button"
        onClick={() => onSelect?.(product.id)}
        aria-pressed={selected}
        className={`flex w-full flex-col overflow-hidden rounded-2xl border-2 bg-white text-left transition ${
          selected
            ? "border-[var(--rose)] shadow-[0_0_0_3px_rgba(232,90,139,0.18)]"
            : "border-[var(--blush)] hover:border-[var(--rose)]/50"
        }`}
      >
        <div className="relative aspect-[5/4] bg-[var(--lavender-soft)]">
          {showImage ? (
            <Image
              src={product.image!}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, 180px"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-3xl">
              {product.emoji}
            </div>
          )}
          {selected ? (
            <span className="absolute right-2 top-2 rounded-full bg-[var(--rose)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              Selected
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-0.5 p-3">
          <p className="font-display text-lg leading-tight text-[var(--cocoa)]">
            {product.name}
          </p>
          <p className="text-sm font-semibold text-[var(--rose)]">
            ${product.price.toFixed(0)}
          </p>
        </div>
      </button>
    );
  }

  return (
    <article className="card-product group flex flex-col" id={`product-${product.id}`}>
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--lavender-soft)]">
        {showImage ? (
          <Image
            src={product.image!}
            alt={product.name}
            fill
            className="card-product-img object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-6xl">
            <span className="float-soft" aria-hidden>
              {product.emoji}
            </span>
          </div>
        )}
        {product.popular ? (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--rose)] shadow-sm backdrop-blur">
            Bestseller
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-[1.65rem] leading-tight text-[var(--cocoa)]">
            {product.name}
          </h3>
          <p className="shrink-0 rounded-full bg-[var(--lavender-soft)] px-3 py-1 text-sm font-semibold text-[var(--cocoa)]">
            ${product.price.toFixed(0)}
          </p>
        </div>
        <p className="mt-2.5 flex-1 text-[0.95rem] leading-relaxed text-[var(--cocoa-soft)]">
          {product.description}
        </p>
        <a
          href={`#order?product=${product.id}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--rose)] transition hover:gap-3"
        >
          Order for pickup
          <span aria-hidden>→</span>
        </a>
      </div>
    </article>
  );
}
