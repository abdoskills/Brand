"use client";

import { useMemo } from "react";

import type { Product } from "@/types";
import { ProductCard } from "@/components/ui/ProductCard";

interface ProductsPageClientProps {
  products: Product[];
}

export function ProductsPageClient({ products }: ProductsPageClientProps) {
  const { inStockCount, outOfStockCount, minPrice, maxPrice } = useMemo(() => {
    const inStock = products.filter((product) => product.inStock).length;
    const prices = products.map((product) => product.price).filter((price) => Number.isFinite(price));
    const min = prices.length ? Math.min(...prices) : 0;
    const max = prices.length ? Math.max(...prices) : 0;

    return {
      inStockCount: inStock,
      outOfStockCount: products.length - inStock,
      minPrice: min,
      maxPrice: max,
    };
  }, [products]);

  return (
    <section className="space-y-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="font-display text-4xl text-text sm:text-5xl">All Products</h1>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
      </div>

      <div className="grid grid-cols-12 gap-10">
        <aside className="col-span-12 lg:col-span-3">
          <div className="space-y-6 text-sm">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Filters</p>
              <div className="h-px w-10 bg-border/60" />
            </div>

            <div className="space-y-3 border-b border-border/40 pb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Availability</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">In stock</span>
                <span className="font-semibold text-text">{inStockCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Out of stock</span>
                <span className="font-semibold text-text">{outOfStockCount}</span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Price range</p>
              <div className="space-y-3">
                <div className="h-1 rounded-full bg-border/60">
                  <div className="h-1 w-2/3 rounded-full bg-primary" />
                </div>
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-muted">
                  <span>${minPrice.toFixed(0)}</span>
                  <span>${maxPrice.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="col-span-12 lg:col-span-9">
          {products.length ? (
            <div className="grid grid-cols-2 gap-x-10 gap-y-14 md:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-border/60 bg-surface px-8 py-10 text-center shadow-[0_20px_60px_rgba(26,78,97,0.12)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Empty catalog</p>
              <h3 className="mt-3 font-display text-2xl text-text">No products have been released yet.</h3>
              <p className="mt-2 text-sm text-muted">Add your first item in the admin studio to populate the storefront.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
