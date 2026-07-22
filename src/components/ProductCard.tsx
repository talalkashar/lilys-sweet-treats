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
  const priceLabel = Number.isInteger(product.price)
    ? product.price.toFixed(0)
    : product.price.toFixed(2);

  return (
    <article className="card-product card-product--fill group">
      <button
        type="button"
        onClick={() => onOpen?.(product)}
        className="card-product-hit"
        aria-label={`View ${product.name}`}
      >
        <div className="card-product-media bg-[var(--lavender-soft)]">
          {showImage ? (
            <Image
              src={product.image!}
              alt={product.name}
              fill
              quality={90}
              className="card-product-img object-cover"
              style={{
                objectPosition: product.imagePosition ?? "center center",
              }}
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 62vw, 68vw"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="flex h-full min-h-[12rem] items-center justify-center text-4xl">
              <span aria-hidden>{product.emoji}</span>
            </div>
          )}
        </div>

        <div className="card-product-body">
          <div className="card-product-top">
            <h3 className="card-product-name font-display text-[var(--cocoa)]">
              {product.name}
            </h3>
            {product.showUnitPrice !== false ? (
              <p className="card-product-price shrink-0 text-sm font-semibold tabular-nums text-[var(--rose)]">
                ${priceLabel}
                <span className="block text-[0.65rem] font-medium normal-case tracking-normal text-[var(--ink-muted)]">
                  each
                </span>
              </p>
            ) : null}
          </div>
          <p className="card-product-desc text-[var(--cocoa-soft)]">
            {product.description}
          </p>
          <span className="card-product-cta">
            View details
            <span aria-hidden> →</span>
          </span>
        </div>
      </button>
    </article>
  );
}
