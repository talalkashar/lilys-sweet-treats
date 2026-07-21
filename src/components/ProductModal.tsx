"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { getProductGallery, type Product } from "@/data/products";
import { packDealsForProduct, packPriceDollars } from "@/data/packs";

type Props = {
  product: Product | null;
  onClose: () => void;
};

export function ProductModal({ product, onClose }: Props) {
  const gallery = product ? getProductGallery(product) : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  // Client-only portal (SSR-safe)
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  // Reset gallery UI when product changes (React-recommended render adjust)
  const [seenProductId, setSeenProductId] = useState(product?.id);
  if (product?.id !== seenProductId) {
    setSeenProductId(product?.id);
    setActiveIndex(0);
    setLightboxOpen(false);
  }

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxOpen) {
          setLightboxOpen(false);
          return;
        }
        onClose();
        return;
      }
      if (gallery.length < 2) return;
      if (e.key === "ArrowRight") {
        setActiveIndex((i) => (i + 1) % gallery.length);
      }
      if (e.key === "ArrowLeft") {
        setActiveIndex((i) => (i - 1 + gallery.length) % gallery.length);
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [product, onClose, gallery.length, lightboxOpen]);

  if (!product || !mounted) return null;

  const activeSrc = gallery[activeIndex];

  // Portal to body so sticky header (z-50) cannot cover the modal.
  return createPortal(
    <>
      <div
        className="modal-backdrop fixed inset-0 z-[200] flex items-end justify-center p-0 sm:items-center sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
      >
        <button
          type="button"
          className="absolute inset-0 bg-[var(--cocoa)]/50 backdrop-blur-sm"
          aria-label="Close product details"
          onClick={onClose}
        />

        <div className="modal-panel relative z-10 flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl border border-white bg-white shadow-[var(--shadow-lift)] sm:max-h-[85vh] sm:rounded-2xl">
          <div className="relative aspect-[3/2] shrink-0 bg-[var(--cream-deep)]">
            {activeSrc ? (
              <button
                type="button"
                className="group absolute inset-0 cursor-zoom-in"
                onClick={() => setLightboxOpen(true)}
                aria-label={`Enlarge photo of ${product.name}`}
              >
                <Image
                  src={activeSrc}
                  alt={product.name}
                  fill
                  quality={90}
                  className="object-cover object-center transition duration-200 group-hover:scale-[1.02]"
                  sizes="(max-width: 640px) 100vw, 448px"
                  priority
                />
                <span className="pointer-events-none absolute bottom-2.5 right-2.5 rounded-full bg-white/95 px-2.5 py-1 text-[0.65rem] font-semibold text-[var(--cocoa)] shadow-sm">
                  Tap to enlarge
                </span>
              </button>
            ) : (
              <div className="flex h-full items-center justify-center text-5xl">
                {product.emoji}
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-2.5 top-2.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-lg text-[var(--cocoa)] shadow-sm"
              aria-label="Close"
            >
              ×
            </button>
            {gallery.length > 1 ? (
              <p className="pointer-events-none absolute bottom-2.5 left-2.5 rounded-full bg-white/90 px-2.5 py-0.5 text-[0.65rem] font-semibold tabular-nums text-[var(--cocoa)]">
                {activeIndex + 1} / {gallery.length}
              </p>
            ) : null}
          </div>

          {gallery.length > 1 ? (
            <div className="flex gap-2.5 overflow-x-auto border-b border-[var(--blush)]/50 px-3 py-2.5 [-ms-overflow-style:none] [scrollbar-width:thin]">
              {gallery.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`relative h-14 w-[4.25rem] min-w-[4.25rem] shrink-0 grow-0 overflow-hidden rounded-lg border-2 ${
                    i === activeIndex
                      ? "border-[var(--rose)] ring-1 ring-[var(--rose)]/30"
                      : "border-[var(--blush)]/40 opacity-85 hover:opacity-100"
                  }`}
                  aria-label={`Photo ${i + 1} of ${product.name}`}
                  aria-current={i === activeIndex}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover object-center"
                    sizes="68px"
                  />
                </button>
              ))}
            </div>
          ) : null}

          <div className="overflow-y-auto p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <h2
                id="product-modal-title"
                className="font-display text-xl leading-snug text-[var(--cocoa)] sm:text-2xl"
              >
                {product.name}
              </h2>
              {product.showUnitPrice !== false ? (
                <p className="shrink-0 text-sm font-semibold tabular-nums text-[var(--rose)]">
                  $
                  {Number.isInteger(product.price)
                    ? product.price.toFixed(0)
                    : product.price.toFixed(2)}
                  <span className="block text-[0.65rem] font-medium text-[var(--ink-muted)]">
                    each
                  </span>
                </p>
              ) : null}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[var(--cocoa-soft)] sm:text-base">
              {product.description}
            </p>

            <div className="mt-4 rounded-xl border border-[var(--blush)]/60 bg-[var(--cream)]/80 px-3.5 py-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--rose)]">
                Pack deals
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-[var(--cocoa)]">
                {packDealsForProduct(product.id).map((pack) => (
                  <li
                    key={pack.id}
                    className="flex items-baseline justify-between gap-2"
                  >
                    <span>
                      <span className="font-semibold">{pack.displayName}</span>
                      <span className="text-[var(--ink-muted)]">
                        {" "}
                        · {pack.quantity} treats
                      </span>
                    </span>
                    <span className="shrink-0 font-semibold tabular-nums text-[var(--rose)]">
                      ${packPriceDollars(product.price, pack).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {product.ingredients.length > 0 ? (
              <div className="product-ingredients mt-4">
                <p className="product-ingredients-label">Made with</p>
                <ul className="product-ingredients-list">
                  {product.ingredients.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <p className="product-allergen-note mt-3">
              Baked with flour, eggs, butter, and sugar. May contain wheat,
              eggs, milk, soy, and nuts. Home kitchen with shared equipment —
              nut cross-contact is possible on every product. Porch pickup only.
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <a
                href={`/order?product=${product.id}`}
                onClick={onClose}
                className="btn-primary min-h-11 flex-1 text-center"
              >
                Order a pack
              </a>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary min-h-11 flex-1"
              >
                Keep browsing
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full-screen enlarge — above product modal + nav */}
      {lightboxOpen && activeSrc ? (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-[var(--cocoa)]/90 p-3 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Enlarged photo of ${product.name}`}
        >
          <button
            type="button"
            className="absolute inset-0 cursor-zoom-out"
            aria-label="Close enlarged photo"
            onClick={() => setLightboxOpen(false)}
          />

          <div className="relative z-10 flex max-h-full w-full max-w-4xl flex-col items-center">
            <div className="relative aspect-[4/3] w-full max-h-[min(85vh,900px)] overflow-hidden rounded-2xl bg-black/20 shadow-[var(--shadow-lift)] sm:aspect-[3/2]">
              <Image
                src={activeSrc}
                alt={product.name}
                fill
                quality={95}
                className="object-contain"
                sizes="(max-width: 896px) 100vw, 896px"
                priority
              />
            </div>

            <div className="mt-3 flex w-full items-center justify-between gap-3 px-1">
              <p className="text-sm font-medium text-white/90">{product.name}</p>
              <div className="flex items-center gap-2">
                {gallery.length > 1 ? (
                  <>
                    <button
                      type="button"
                      className="rounded-full bg-white/95 px-3 py-1.5 text-sm font-semibold text-[var(--cocoa)]"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveIndex(
                          (i) => (i - 1 + gallery.length) % gallery.length,
                        );
                      }}
                      aria-label="Previous photo"
                    >
                      ‹
                    </button>
                    <span className="text-xs tabular-nums text-white/80">
                      {activeIndex + 1}/{gallery.length}
                    </span>
                    <button
                      type="button"
                      className="rounded-full bg-white/95 px-3 py-1.5 text-sm font-semibold text-[var(--cocoa)]"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveIndex((i) => (i + 1) % gallery.length);
                      }}
                      aria-label="Next photo"
                    >
                      ›
                    </button>
                  </>
                ) : null}
                <button
                  type="button"
                  className="rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-[var(--cocoa)]"
                  onClick={() => setLightboxOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>,
    document.body,
  );
}
