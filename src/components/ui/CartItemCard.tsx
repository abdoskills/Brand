"use client";

import { QuantityStepper } from "@/components/ui/QuantityStepper";
import type { CartItem } from "@/types";

interface CartItemCardProps {
  item: CartItem;
  onQuantityChange: (qty: number) => void;
  onRemove: () => void;
}

export function CartItemCard({ item, onQuantityChange, onRemove }: CartItemCardProps) {
  const image = item.product.images[0];

  return (
    <div className="flex gap-4 rounded-sm border border-neutral-800 bg-neutral-900 p-4 lg:gap-6 lg:rounded-3xl lg:border-white/10 lg:bg-neutral-900/70 lg:p-6 lg:shadow-[0_24px_70px_rgba(0,0,0,0.4)] lg:backdrop-blur-xl">
      <div
        className="aspect-square h-24 w-24 rounded-sm bg-cover bg-center lg:h-32 lg:w-32 lg:rounded-2xl"
        style={{
          backgroundImage: image
            ? `url(${image})`
            : "linear-gradient(135deg,#262626,#0a0a0a)",
        }}
      />
      <div className="flex flex-1 flex-col justify-between gap-2 lg:gap-4">
        <div className="flex flex-col gap-1">
          <p className="font-display text-lg font-bold uppercase tracking-tight text-white lg:text-2xl">
            {item.product.name}
          </p>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 lg:text-sm">
            <span>{item.product.category}</span>
            <span>•</span>
            <span>Size {item.size}</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-base font-bold text-white lg:text-lg">
            ${(item.product.price * item.qty).toFixed(2)}
          </div>
          <QuantityStepper value={item.qty} onChange={onQuantityChange} />
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="w-fit text-xs font-bold uppercase tracking-widest text-street-red hover:underline lg:text-sm"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
