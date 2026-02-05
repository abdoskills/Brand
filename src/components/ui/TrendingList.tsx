import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";

interface TrendingListProps {
  products: Product[];
}

export function TrendingList({ products }: TrendingListProps) {
  return (
    <section className="w-full px-4 pb-12 lg:flex lg:h-full lg:flex-col lg:px-0">
      <h2 className="mb-6 font-display text-2xl font-black uppercase italic tracking-tighter text-white lg:text-3xl">
        Trending Now
      </h2>
      <div className="flex flex-col gap-4 lg:grid lg:flex-1 lg:grid-cols-1 xl:grid-cols-2 lg:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} orientation="horizontal" />
        ))}
      </div>
    </section>
  );
}
