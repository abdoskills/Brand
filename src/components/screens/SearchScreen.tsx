"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { MobileShell } from "@/components/layout/MobileShell";
import { BottomNav } from "@/components/ui/BottomNav";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { useCart } from "@/components/providers/CartProvider";

export function SearchScreen() {
  const { count } = useCart();
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <MobileShell>
      <TopAppBar cartCount={count} onCartClick={() => router.push("/cart")} />
      <main className="flex-1 px-4 pb-24">
        <section className="py-6">
          <h1 className="font-display text-3xl font-black uppercase italic tracking-tight text-white">
            Search
          </h1>
          <p className="mt-2 text-xs uppercase tracking-widest text-neutral-500">
            Coming soon — curated search across the catalog.
          </p>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search fit essentials..."
            className="mt-6 h-12 w-full rounded-sm border border-neutral-700 bg-transparent px-3 text-sm text-white"
          />
        </section>
      </main>
      <BottomNav />
      <div className="h-10 bg-background-dark" />
    </MobileShell>
  );
}
