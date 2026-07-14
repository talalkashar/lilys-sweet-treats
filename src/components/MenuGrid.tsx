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
      <div className="mt-10 space-y-12">
        {menuCategories.map((cat, catIndex) => {
          const items = productsInCategory(cat.id);
          if (items.length === 0) return null;

          return (
            <section key={cat.id} aria-labelledby={`menu-${cat.id}`}>
              <Reveal delayMs={catIndex * 25}>
                <div className="mb-4 border-b border-[var(--blush)]/35 pb-2.5">
                  <h3
                    id={`menu-${cat.id}`}
                    className="font-display text-xl text-[var(--cocoa)]"
                  >
                    {cat.title}
                  </h3>
                  <p className="mt-0.5 text-sm text-[var(--cocoa-soft)]">
                    {cat.blurb}
                  </p>
                </div>
              </Reveal>

              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                {items.map((p, i) => (
                  <Reveal key={p.id} delayMs={catIndex * 25 + i * 40}>
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
