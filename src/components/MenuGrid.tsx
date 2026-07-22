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
      <div className="menu-grid-stack">
        {menuCategories.map((cat, catIndex) => {
          const items = productsInCategory(cat.id);
          if (items.length === 0) return null;

          return (
            <section key={cat.id} aria-labelledby={`menu-${cat.id}`}>
              <Reveal delayMs={catIndex * 40}>
                <div className="menu-cat-header">
                  <h3
                    id={`menu-${cat.id}`}
                    className="font-display text-lg text-[var(--cocoa)] sm:text-xl"
                  >
                    {cat.title}
                  </h3>
                  <p className="mt-0.5 text-sm text-[var(--cocoa-soft)]">
                    {cat.blurb}
                  </p>
                </div>
              </Reveal>

              {/* Full-width stacked rows — no incomplete multi-col holes */}
              <div className="menu-product-list">
                {items.map((p, i) => (
                  <Reveal key={p.id} delayMs={catIndex * 40 + i * 65}>
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
