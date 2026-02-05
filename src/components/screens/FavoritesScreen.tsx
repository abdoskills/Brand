"use client";

import { useRouter } from "next/navigation";

import { MobileShell } from "@/components/layout/MobileShell";
import { BottomNav } from "@/components/ui/BottomNav";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { useCart } from "@/components/providers/CartProvider";

export function FavoritesScreen() {
  const { count } = useCart();
  const router = useRouter();

  return (
    <MobileShell>
      <TopAppBar cartCount={count} onCartClick={() => router.push("/cart")} />
      <main className="flex-1 px-4 pb-24">
        <section className="py-6">
          <h1 className="font-display text-3xl font-black uppercase italic tracking-tight text-white">
            Favorites
          </h1>
          <div className="mt-4 rounded-sm border border-neutral-800 bg-neutral-900 p-6 text-sm text-neutral-300">
            Save your go-to pieces once wishlists launch. For now, keep them in cart so they stay on your radar.
          </div>
        </section>
      </main>
      <BottomNav />
      <div className="h-10 bg-background-dark" />
    </MobileShell>
  );
}
