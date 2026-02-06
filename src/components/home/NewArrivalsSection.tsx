"use client";

import { useEffect, useMemo, useState } from "react";

import { ProductCard } from "@/components/home/ProductCard";
import { getAllProducts, type Product } from "@/lib/products";

export function NewArrivalsSection() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const list = await getAllProducts();
      if (mounted) setProducts(list);
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const visible = useMemo(() => products.slice(0, 8), [products]);
  return (
    <section className="w-full bg-[#f9f9f9] py-16" id="shop">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 lg:px-12">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">Latest Drops</p>
          <h2 className="font-[playfair] text-3xl sm:text-4xl text-text-default">New Arrivals</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
