"use client";

import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { Reveal } from "@/components/Reveal";
import {
  menuCategories,
  productsInCategory,
  type Product,
} from "@/data/products";

export function MenuGrid() {
  const [active, setActive] = useState<Product | null>(null);

  return (
    <>
      <div className="mt-12 space-y-14">
        {menuCategories.map((cat, catIndex) => {
          const items = productsInCategory(cat.id);
          if (items.length === 0) return null;

          return (
            <section key={cat.id} aria-labelledby={`menu-${cat.id}`}>
              <Reveal delayMs={catIndex * 40}>
                <div className="mb-6 flex flex-col gap-1 border-b border-[var(--blush)]/50 pb-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3
                      id={`menu-${cat.id}`}
                      className="font-display text-2xl text-[var(--cocoa)] sm:text-3xl"
                    >
                      {cat.title}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--cocoa-soft)]">
                      {cat.blurb}
                    </p>
                  </div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[var(--ink-muted)]">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </Reveal>

              <div className="grid gap-6 sm:grid-cols-2">
                {items.map((p, i) => (
                  <Reveal key={p.id} delayMs={catIndex * 40 + i * 60}>
                    <ProductCard product={p} onOpen={setActive} />
                  </Reveal>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <ProductModal product={active} onClose={() => setActive(null)} />
    </>
  );
}
