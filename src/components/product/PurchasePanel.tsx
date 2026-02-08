"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import type { Product } from "@/types";

interface PurchasePanelProps {
  product: Product;
  onAddToCart: (size: string, qty: number) => Promise<{ ok: boolean; message?: string }>;
  onBuyNow: (size: string, qty: number) => Promise<{ ok: boolean; draftId?: string; message?: string }>;
}

export function PurchasePanel({ product, onAddToCart, onBuyNow }: PurchasePanelProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(product.sizes[0] ?? null);
  const [quantity, setQuantity] = useState(1);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const decrement = () => setQuantity((q) => Math.max(1, q - 1));
  const increment = () => setQuantity((q) => q + 1);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-600">Sizes</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {product.sizes.map((size) => {
            const active = selectedSize === size;
            return (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                disabled={!product.inStock}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#C7A76C] disabled:cursor-not-allowed ${
                  active
                    ? "border-[#C7A76C] bg-[#fdf7eb] text-neutral-900 shadow-[0_10px_24px_rgba(199,167,108,0.18)]"
                    : "border-[#e7dcc1] text-neutral-700 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)]"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-600">Quantity</p>
        <div className="flex items-center overflow-hidden rounded-full border border-[#e7dcc1] bg-white shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
          <button
            type="button"
            onClick={decrement}
            className="h-10 w-10 text-lg font-semibold text-neutral-700 transition hover:bg-[#f5ebd6]"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="px-4 text-sm font-semibold text-neutral-900">{quantity}</span>
          <button
            type="button"
            onClick={increment}
            className="h-10 w-10 text-lg font-semibold text-neutral-700 transition hover:bg-[#f5ebd6]"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          disabled={!product.inStock || !selectedSize || pending}
          onClick={() => {
            if (!selectedSize) return;

            // Call global increment for immediate UI feedback
            const inc = (globalThis as any).__incCart;
            if (inc) inc(quantity);

            toast.success("Added to bag", { description: product.name });

            startTransition(async () => {
              const result = await onAddToCart(selectedSize, quantity);
              if (!result.ok) {
                 toast.error(result.message || "Failed to add to cart");
              }
            });
          }}
          className="w-full rounded-full bg-[#C7A76C] py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5 hover:bg-[#b68f57] hover:shadow-[0_14px_40px_rgba(199,167,108,0.35)] disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          {product.inStock ? (pending ? "Adding" : "Add to Bag") : "Sold Out"}
        </Button>
        <Button
          variant="outline"
          disabled={!product.inStock || !selectedSize || pending}
          onClick={() => {
            if (!selectedSize) return;
            startTransition(async () => {
              const result = await onBuyNow(selectedSize, quantity);
              if (result.ok) {
                const target = result.draftId ? `/checkout?orderId=${result.draftId}` : "/checkout";
                router.push(target);
              }
            });
          }}
          className="w-full rounded-full border border-[#C7A76C] py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-900 transition hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(0,0,0,0.08)] disabled:cursor-not-allowed"
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
}
