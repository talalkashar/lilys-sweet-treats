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
    <article className="card-product group flex flex-col">
      <button
        type="button"
        onClick={() => onOpen?.(product)}
        className="flex flex-1 flex-col text-left"
        aria-label={`View ${product.name}`}
      >
        <div className="relative aspect-[5/4] w-full overflow-hidden bg-[var(--lavender-soft)] sm:aspect-square">
          {showImage ? (
            <Image
              src={product.image!}
              alt={product.name}
              fill
              quality={90}
              className="card-product-img object-cover object-center"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 480px"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-5xl">
              <span aria-hidden>{product.emoji}</span>
            </div>
          )}
          <span className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[var(--cocoa)] shadow-sm opacity-0 transition group-hover:opacity-100">
            Details
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-xl leading-snug text-[var(--cocoa)] sm:text-[1.4rem]">
              {product.name}
            </h3>
            <p className="shrink-0 rounded-full bg-[var(--lavender-soft)] px-2.5 py-1 text-sm font-semibold text-[var(--cocoa)]">
              ${product.price.toFixed(0)}
            </p>
          </div>
          <p className="line-clamp-2 text-sm leading-relaxed text-[var(--cocoa-soft)]">
            {product.description}
          </p>
        </div>
      </button>
    </article>
  );
}
