"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/data/products";

type Props = {
  product: Product;
  onOpen?: (product: Product) => void;
};

export function ProductCard({ product, onOpen }: Props) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = Boolean(product.image) && !imgFailed;

  return (
    <article className="card-product group flex h-full flex-col">
      <button
        type="button"
        onClick={() => onOpen?.(product)}
        className="flex h-full flex-1 flex-col text-left"
        aria-label={`View ${product.name}`}
      >
        <div className="relative aspect-[3/2] w-full overflow-hidden bg-[var(--lavender-soft)]">
          {showImage ? (
            <Image
              src={product.image!}
              alt={product.name}
              fill
              quality={90}
              className="card-product-img object-cover object-center"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl">
              <span aria-hidden>{product.emoji}</span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg leading-snug text-[var(--cocoa)]">
              {product.name}
            </h3>
            {product.showUnitPrice !== false ? (
              <p className="shrink-0 pt-0.5 text-sm font-semibold tabular-nums text-[var(--rose)]">
                $
                {Number.isInteger(product.price)
                  ? product.price.toFixed(0)
                  : product.price.toFixed(2)}
                <span className="block text-[0.65rem] font-medium normal-case tracking-normal text-[var(--ink-muted)]">
                  each
                </span>
              </p>
            ) : null}
          </div>
          <p className="line-clamp-2 text-sm leading-relaxed text-[var(--cocoa-soft)]">
            {product.description}
          </p>
          <p className="text-xs font-medium text-[var(--cocoa-soft)]">
            {product.category === "sticky" ? "2-pack · " : ""}
            4-pack · 8-pack · party tray (12)
          </p>
          <span className="mt-auto pt-3 text-sm font-semibold text-[var(--rose)]">
            View details →
          </span>
        </div>
      </button>
    </article>
  );
}
