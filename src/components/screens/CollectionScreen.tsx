"use client";

import { useRouter } from "next/navigation";

import { MobileShell } from "@/components/layout/MobileShell";
import { BottomNav } from "@/components/ui/BottomNav";
import { ProductCard } from "@/components/ui/ProductCard";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { useCart } from "@/components/providers/CartProvider";
import type { Product } from "@/types";

interface CollectionScreenProps {
  title: string;
  products: Product[];
}

export function CollectionScreen({ title, products }: CollectionScreenProps) {
  const { count } = useCart();
  const router = useRouter();

  return (
    <MobileShell>
      <TopAppBar cartCount={count} onCartClick={() => router.push("/cart")} />
      <main className="flex-1 px-4 pb-24">
        <section className="py-6">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-text">
            {title}
          </h1>
          <div className="mt-6 grid gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} orientation="horizontal" />
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
      <div className="h-10 bg-background" />
    </MobileShell>
  );
}
