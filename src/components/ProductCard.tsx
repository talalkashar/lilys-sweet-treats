"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = Boolean(product.image) && !imgFailed;

  return (
    <article className="card-lift group flex flex-col overflow-hidden rounded-3xl border-2 border-white bg-white/95 shadow-md">
      <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--blush)] via-[var(--lemon)]/50 to-[var(--sky)]/60">
        {showImage ? (
          <Image
            src={product.image!}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span className="text-6xl float-soft" aria-hidden>
            {product.emoji}
          </span>
        )}
        {product.popular ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[var(--lemon)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--cocoa)] shadow-sm">
            Popular
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-2xl text-[var(--cocoa)]">
          {product.name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--cocoa-soft)]">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-lg font-bold text-[var(--rose)]">
            ${product.price.toFixed(2)}
          </p>
          <a
            href="#order"
            className="rounded-full bg-[var(--mint-soft)] px-3 py-1.5 text-sm font-semibold text-[var(--cocoa)] transition hover:bg-[var(--mint)]"
          >
            Order →
          </a>
        </div>
      </div>
    </article>
  );
}
