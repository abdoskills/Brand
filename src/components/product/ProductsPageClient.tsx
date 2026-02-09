"use client";

import type { Product } from "@/types";
import { ProductCard } from "@/components/ui/ProductCard";

interface ProductsPageClientProps {
  products: Product[];
}

export function ProductsPageClient({ products }: ProductsPageClientProps) {
  return (
    <section className="space-y-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="font-display text-4xl text-text sm:text-5xl">All Products</h1>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
      </div>

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
    </section>
  );
}
