import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@/lib/localDrops";
import type { Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images?.[0];

  const slug = product.slug ?? product.id;

  return (
    <Link
      href={`/products/${slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-md border border-border-light bg-[#f9f9f9] shadow-subtle transition duration-300 hover:-translate-y-1 hover:shadow-luxury/40"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f3f0ea]">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition duration-500 group-hover:scale-105"
            priority={false}
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 px-4 pb-4 pt-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">Fit In</span>
        <h3 className="line-clamp-2 font-[playfair] text-lg text-text-default">{product.name}</h3>
        <p className="text-sm font-semibold text-text-default">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
