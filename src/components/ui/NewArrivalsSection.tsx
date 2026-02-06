"use client";

import { useMemo, useState } from "react";

import { ensureProducts, simulateNewDrop } from "@/lib/localDrops";
import type { Product } from "@/types";

import { Button } from "./Button";
import { NotifyMeBlock } from "./NotifyMeBlock";
import { ProductCard } from "./ProductCard";

const DEV_ADMIN = true;

export function NewArrivalsSection() {
  const [products, setProducts] = useState<Product[]>(() => ensureProducts());
  const [adminMessage, setAdminMessage] = useState<string | null>(null);

  const visibleProducts = useMemo(() => {
    return products.slice(0, 9);
  }, [products]);

  const handleSimulate = () => {
    const current = products.length ? products : ensureProducts();
    const { products: next, notification } = simulateNewDrop(current);
    setProducts(next);
    setAdminMessage(`Subscribers notified (simulated): ${notification.title}`);
  };

  return (
    <section className="w-full bg-white py-16" id="shop">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 lg:px-12">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/70">New Arrivals</p>
          <h2 className="font-[playfair] text-3xl sm:text-4xl text-text-default">Curated drops for the season</h2>
          <p className="max-w-2xl text-sm text-text-muted sm:text-base">
            Sculpted tailoring, silk essentials, and quiet statements crafted for a refined wardrobe.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <NotifyMeBlock />

        {DEV_ADMIN ? (
          <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-border-light bg-white/90 px-5 py-5 shadow-subtle">
            <div className="flex flex-col gap-1 text-sm text-text-muted">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">Demo only</span>
              <p>Simulate a new drop, store it locally, and notify stored subscribers.</p>
              <p className="text-xs">Notifications stored in localStorage: fitin_notifications</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" onClick={handleSimulate}>
                Simulate New Drop
              </Button>
              {adminMessage ? <span className="text-sm font-semibold text-primary">{adminMessage}</span> : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
