"use client";

import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { Reveal } from "@/components/Reveal";
import { products, type Product } from "@/data/products";

export function MenuGrid() {
  const [active, setActive] = useState<Product | null>(null);

  return (
    <>
      <div className="mt-12 grid gap-7 sm:grid-cols-2">
        {products.map((p, i) => (
          <Reveal key={p.id} delayMs={i * 70}>
            <ProductCard product={p} onOpen={setActive} />
          </Reveal>
        ))}
      </div>
      <ProductModal product={active} onClose={() => setActive(null)} />
    </>
  );
}
