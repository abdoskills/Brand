"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";

interface ProductActionsProps {
  sizes?: string[];
}

const defaultSizes = ["XS", "S", "M", "L", "XL"];

export function ProductActions({ sizes = defaultSizes }: ProductActionsProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(sizes[0] ?? null);
  const [qty, setQty] = useState(1);

  const decrement = () => setQty((v) => Math.max(1, v - 1));
  const increment = () => setQty((v) => Math.min(9, v + 1));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => setSelectedSize(size)}
            className={`border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
              selectedSize === size
                ? "border-primary text-primary"
                : "border-border text-text hover:border-primary"
            }`}
          >
            {size}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center border border-border">
          <button type="button" onClick={decrement} className="px-3 py-2 text-sm text-text hover:text-primary">
            –
          </button>
          <span className="px-4 text-sm font-semibold text-text">{qty}</span>
          <button type="button" onClick={increment} className="px-3 py-2 text-sm text-text hover:text-primary">
            +
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button size="lg">Add to Cart</Button>
        <Button size="lg" variant="outline" className="border-primary text-primary hover:border-primary hover:text-primary">
          Buy Now
        </Button>
      </div>
    </div>
  );
}
