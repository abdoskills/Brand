import Link from "next/link";

import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  orientation?: "vertical" | "horizontal";
}

const badgeTone: Record<NonNullable<Product["badge"]>, string> = {
  New: "bg-primary/10 text-primary",
  Hot: "bg-amber-100 text-amber-700",
  Limited: "bg-neutral-900 text-white",
  Trending: "bg-slate-100 text-slate-700",
  "Best Seller": "bg-emerald-50 text-emerald-700",
};

const currencyFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

function formatPrice(value: number) {
  return currencyFormatter.format(value);
}

export function ProductCard({ product, orientation = "vertical" }: ProductCardProps) {
  const hasImage = Boolean(product.images[0]);
  const backgroundImage = hasImage
    ? `url(${product.images[0]})`
    : "linear-gradient(135deg,#f5f3ef,#e7e1d5)";
  const slug = product.slug ?? product.id;

  if (orientation === "horizontal") {
    return (
      <Link
        href={`/products/${slug}`}
        className="group grid grid-cols-[140px,1fr] items-stretch gap-4 rounded-2xl border border-border-light bg-white p-4 shadow-subtle transition duration-300 hover:-translate-y-1 hover:shadow-luxury/40 sm:grid-cols-[160px,1fr]"
      >
        <div className="relative overflow-hidden rounded-xl bg-muted/40">
          <div
            className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
            style={{ backgroundImage }}
          />
        </div>
        <div className="flex flex-col justify-center gap-2">
          {product.badge ? (
            <span className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${badgeTone[product.badge]}`}>
              {product.badge}
            </span>
          ) : null}
          <p className="font-[playfair] text-lg leading-tight text-text-default sm:text-xl">
            {product.name}
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            {product.category}
          </p>
          <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-text-default">
            <span>{formatPrice(product.price)}</span>
            {product.compareAt ? (
              <span className="text-text-muted line-through">{formatPrice(product.compareAt)}</span>
            ) : null}
          </div>
          <span className="mt-1 inline-flex w-fit items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            View
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/products/${slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border-light bg-white shadow-subtle transition duration-300 hover:-translate-y-1 hover:shadow-luxury/50"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted/40">
        <div
          className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
          style={{ backgroundImage }}
        />
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
          {product.badge ? (
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${badgeTone[product.badge]}`}>
              {product.badge}
            </span>
          ) : <span />}
          <span className="rounded-full bg-white/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted backdrop-blur">
            View
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 px-4 pb-4 pt-4">
        <h3 className="line-clamp-2 font-[playfair] text-lg text-text-default">{product.name}</h3>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">{product.category}</p>
        <p className="mt-2 text-base font-semibold text-text-default">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
