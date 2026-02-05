import Link from "next/link";

import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";

interface NewArrivalsCarouselProps {
  products: Product[];
}

export function NewArrivalsCarousel({ products }: NewArrivalsCarouselProps) {
  return (
    <section className="w-full px-4 pb-10 pt-10 lg:flex lg:h-full lg:flex-col lg:px-0 lg:pt-16">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl font-black uppercase italic tracking-tighter text-white lg:text-3xl">
          New Arrivals
        </h2>
        <Link
          href="/collections/new"
          className="text-xs font-bold uppercase tracking-widest text-street-red hover:underline"
        >
          View All
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory lg:flex-1 lg:grid lg:grid-cols-3 lg:content-start lg:gap-6 lg:overflow-visible lg:pb-0 lg:snap-none">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
