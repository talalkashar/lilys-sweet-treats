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
      <div className="mt-12 space-y-16">
        {menuCategories.map((cat, catIndex) => {
          const items = productsInCategory(cat.id);
          if (items.length === 0) return null;

          return (
            <section key={cat.id} aria-labelledby={`menu-${cat.id}`}>
              <Reveal delayMs={catIndex * 30}>
                <div className="mb-6 border-b border-[var(--blush)]/40 pb-3">
                  <h3
                    id={`menu-${cat.id}`}
                    className="font-display text-2xl text-[var(--cocoa)]"
                  >
                    {cat.title}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--cocoa-soft)]">
                    {cat.blurb}
                  </p>
                </div>
              </Reveal>

              <div className="grid gap-5 sm:grid-cols-2">
                {items.map((p, i) => (
                  <Reveal key={p.id} delayMs={catIndex * 30 + i * 50}>
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
