"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { MobileShell } from "@/components/layout/MobileShell";
import { BottomNav } from "@/components/ui/BottomNav";
import { ProductGallery } from "@/components/ui/ProductGallery";
import { RatingBadge } from "@/components/ui/RatingBadge";
import { SizeSelector } from "@/components/ui/SizeSelector";
import { StockIndicator } from "@/components/ui/StockIndicator";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { ProductCard } from "@/components/ui/ProductCard";
import { useCart } from "@/components/providers/CartProvider";
import type { Product } from "@/types";

interface ProductScreenProps {
  product: Product;
  related: Product[];
}

export function ProductScreen({ product, related }: ProductScreenProps) {
  const router = useRouter();
  const { addToCart, count } = useCart();
  const [size, setSize] = useState<"S" | "M" | "L" | "XL" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = () => {
    if (!size) {
      setError("Select a size");
      return;
    }
    setError(null);
    addToCart(product, size, 1);
    router.push("/cart");
  };

  const heroImages = product.images.length > 0 ? product.images : [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCFdjqwkVoyEJpSVs8rfa2Egxr8TPkPO8iU7Ls4PcNpfeLys2oDKqKZvBoEVYDb01wQMq-Crf-H4Z-J8OL0ndV283JlrTL2eqLDifEJOqtCT9MlGLWY-v7U8N-lZRprRFuDFWZ0Dm4yr0wOLqE3obpILAX2A0HYZn-Tr9pgSZdEkWqvGYRCmQg4M6T3-d7mvlGAFZvwo-I6GNeXxZmHR-nQaJvTXhnWDywq729vsTbvTbW5JyO_Y7KfTKUvl00W41-_EaW9Kh5uKRaf",
  ];

  return (
    <MobileShell>
      <TopAppBar cartCount={count} onCartClick={() => router.push("/cart")} />
      <main className="flex-1 overflow-y-auto px-4 pb-24 lg:px-10 lg:pb-20">
        <div className="py-6">
          <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
            <ProductGallery images={heroImages} />
            <div className="flex flex-col gap-4 rounded-none lg:sticky lg:top-24 lg:rounded-3xl lg:border lg:border-border lg:bg-surface lg:p-10 lg:backdrop-blur-xl">
              <div className="flex items-center gap-2">
              {product.badge ? (
                <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-accent">
                  {product.badge}
                </span>
              ) : null}
              <span className="text-xs font-medium uppercase tracking-widest text-muted">
                {product.category}
              </span>
            </div>
              <h1 className="font-display text-3xl font-black uppercase italic tracking-tight text-text lg:text-4xl">
                {product.name}
              </h1>
              <RatingBadge rating={product.ratingAvg} reviews={product.reviewsCount} />
              <div className="flex items-center gap-3">
                <p className="text-2xl font-bold text-text lg:text-3xl">${product.price.toFixed(2)}</p>
                {product.compareAt ? (
                  <p className="text-sm font-medium text-muted line-through lg:text-base">
                    ${product.compareAt.toFixed(2)}
                  </p>
                ) : null}
              </div>
              <p className="text-sm text-muted lg:text-base">{product.description}</p>
              <StockIndicator stock={product.stock} />
              <div className="mt-4 flex flex-col gap-3">
                <div className="text-xs font-bold uppercase tracking-widest text-muted">
                  Select Size
                </div>
                <SizeSelector
                  value={size}
                  onChange={(value) => {
                    setError(null);
                    setSize(value);
                  }}
                />
                {error ? (
                  <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                    {error}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                className="mt-4 w-full rounded-full bg-accent py-3 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-accent-hover lg:py-3.5 lg:text-base"
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? "Sold Out" : "Add to Cart"}
              </button>
            </div>
          </div>
          <div className="mt-10 grid gap-4 rounded-2xl border border-border bg-surface p-6 lg:grid-cols-3 lg:gap-6 lg:p-8">
            <div className="rounded-xl border border-border bg-background/70 p-4 lg:p-5">
              <h3 className="font-display text-lg font-semibold text-text">Delivery & Returns</h3>
              <p className="mt-2 text-sm text-muted">Free standard delivery over $150. Express options available. Returns accepted within 30 days in original condition.</p>
            </div>
            <div className="rounded-xl border border-border bg-background/70 p-4 lg:p-5">
              <h3 className="font-display text-lg font-semibold text-text">Payment & Security</h3>
              <p className="mt-2 text-sm text-muted">Secure checkout with major cards and wallets. Payment is encrypted end-to-end for your protection.</p>
            </div>
            <div className="rounded-xl border border-border bg-background/70 p-4 lg:p-5">
              <h3 className="font-display text-lg font-semibold text-text">Fit & Care</h3>
              <p className="mt-2 text-sm text-muted">True to size with a tailored drape. Machine wash cold, lay flat to dry to preserve shape and fabric integrity.</p>
            </div>
          </div>
        </div>
        <section className="pb-12 pt-10 lg:pb-4">
          <h2 className="mb-4 font-display text-2xl font-black uppercase italic tracking-tighter text-text lg:text-3xl">
            You may also like
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-0 lg:snap-none">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
      <div className="h-10 bg-background lg:hidden" />
    </MobileShell>
  );
}
