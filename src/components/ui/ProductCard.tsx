import Link from "next/link";

import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  orientation?: "vertical" | "horizontal";
}

export function ProductCard({ product, orientation = "vertical" }: ProductCardProps) {
  const hasImage = Boolean(product.images[0]);
  const backgroundImage = hasImage
    ? `url(${product.images[0]})`
    : "linear-gradient(135deg,#262626,#0a0a0a)";

  if (orientation === "horizontal") {
    return (
      <Link
        href={`/product/${product.id}`}
        className="flex items-stretch justify-between gap-4 rounded-sm border border-neutral-800 bg-neutral-900 p-4 transition-transform hover:-translate-y-1 lg:gap-6 lg:rounded-2xl lg:border-white/10 lg:bg-neutral-900/80 lg:p-6 lg:shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
      >
        <div className="flex flex-[1.5] flex-col justify-center gap-2">
          {product.badge ? (
            <span className="w-fit rounded-sm border border-street-red px-1 text-[10px] font-bold uppercase tracking-wider text-street-red lg:px-1.5 lg:text-[11px]">
              {product.badge}
            </span>
          ) : null}
          <p className="font-display text-lg font-bold uppercase leading-tight text-white lg:text-xl">
            {product.name}
          </p>
          <p className="text-xs font-medium uppercase text-neutral-400 lg:text-sm">
            {product.category}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-base font-bold text-white lg:text-lg">${product.price.toFixed(2)}</p>
            {product.compareAt ? (
              <p className="text-xs font-medium text-neutral-500 line-through lg:text-sm">
                ${product.compareAt.toFixed(2)}
              </p>
            ) : null}
          </div>
        </div>
        <div
          className="aspect-[3/4] w-24 shrink-0 rounded-sm bg-cover bg-center lg:w-32 lg:rounded-xl"
          style={{ backgroundImage }}
        />
      </Link>
    );
  }

  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex min-w-[200px] snap-center cursor-pointer flex-col gap-3 lg:min-w-0"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-neutral-800 lg:rounded-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage }}
        />
        {product.badge ? (
          <div className="absolute right-2 top-2 rounded-sm bg-street-red px-1.5 py-0.5 text-[10px] font-bold uppercase text-white lg:right-3 lg:top-3 lg:px-2 lg:py-1 lg:text-xs">
            {product.badge}
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-0.5">
        <h3 className="truncate text-sm font-bold uppercase text-white lg:text-base">{product.name}</h3>
        <p className="text-xs font-medium uppercase text-neutral-400 lg:text-sm">{product.category}</p>
        <p className="mt-1 text-sm font-bold text-white lg:text-base">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}
