"use client";

import { useMemo, useState } from "react";

import type { Product } from "@/types";
import { ProductCard } from "@/components/ui/ProductCard";

interface CollectionEntry {
  title: string;
  items: Product[];
}

interface CollectionsPageClientProps {
  collections: CollectionEntry[];
  allProducts: Product[];
}

export function CollectionsPageClient({ collections, allProducts }: CollectionsPageClientProps) {
  const [active, setActive] = useState("All");

  const activeItems = useMemo(() => {
    if (active === "All") return allProducts;
    const match = collections.find((entry) => entry.title === active);
    return match?.items ?? [];
  }, [active, collections, allProducts]);

  const countLabel = `${activeItems.length} ${activeItems.length === 1 ? "piece" : "pieces"}`;

  return (
    <section className="space-y-12">
      <header className="space-y-4 text-center lg:text-left">
        <h1 className="font-display text-4xl text-text sm:text-5xl">The Collection</h1>
        <div className="mx-auto h-px w-16 bg-accent lg:mx-0" />
        <p className="text-sm text-muted/80">
          Discover curated pieces designed for the modern connoisseur.
        </p>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{countLabel}</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[220px,1fr]">
        <aside className="space-y-4">
          <div className="hidden lg:block">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Collections</h2>
            <div className="mt-4 flex flex-col gap-2">
              {["All", ...collections.map((entry) => entry.title)].map((item) => {
                const isActive = item === active;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setActive(item)}
                    className={
                      isActive
                        ? "rounded-full border border-primary bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
                        : "rounded-full border border-border/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted hover:border-primary hover:text-primary"
                    }
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:hidden">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
              {["All", ...collections.map((entry) => entry.title)].map((item) => {
                const isActive = item === active;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setActive(item)}
                    className={
                      isActive
                        ? "flex-shrink-0 rounded-full border border-primary bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
                        : "flex-shrink-0 rounded-full border border-border/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted"
                    }
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          {activeItems.length ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 xl:grid-cols-4">
              {activeItems.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-surface px-8 py-10 text-center shadow-[0_20px_60px_rgba(26,78,97,0.12)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Empty collection</p>
              <h3 className="mt-3 font-display text-2xl text-text">No products in this collection.</h3>
              <p className="mt-2 text-sm text-muted">Choose another collection to explore.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
