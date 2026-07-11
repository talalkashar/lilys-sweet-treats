"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = Boolean(product.image) && !imgFailed;

  return (
    <article className="card-product group flex flex-col">
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
          href="#order"
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--rose)] transition hover:gap-3"
        >
          Order for pickup
          <span aria-hidden>→</span>
        </a>
      </div>
    </article>
  );
}
