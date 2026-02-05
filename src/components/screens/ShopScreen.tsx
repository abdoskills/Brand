"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { MobileShell } from "@/components/layout/MobileShell";
import { BottomNav } from "@/components/ui/BottomNav";
import { ProductCard } from "@/components/ui/ProductCard";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { useCart } from "@/components/providers/CartProvider";
import type { Product } from "@/types";

type SortOption = "latest" | "price-asc" | "price-desc" | "rating";
type CategoryFilter = "all" | Product["category"];

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: "latest", label: "Latest" },
  { value: "price-asc", label: "Price: Low" },
  { value: "price-desc", label: "Price: High" },
  { value: "rating", label: "Top Rated" },
];

function formatCategory(category: Product["category"]): string {
  return category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

interface ShopScreenProps {
  products: Product[];
}

export function ShopScreen({ products }: ShopScreenProps) {
  const router = useRouter();
  const { count } = useCart();

  const [category, setCategory] = useState<CategoryFilter>("all");
  const [sort, setSort] = useState<SortOption>("latest");
  const [query, setQuery] = useState("");

  const categories: CategoryFilter[] = [
    "all",
    ...Array.from(new Set(products.map((product) => product.category))),
  ];

  const filteredProducts = useMemo(() => {
    const term = query.trim().toLowerCase();
    let list = [...products];

    if (category !== "all") {
      list = list.filter((product) => product.category === category);
    }

    if (term) {
      list = list.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term)
      );
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.ratingAvg - a.ratingAvg);
        break;
      case "latest":
      default:
        list.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
        break;
    }

    return list;
  }, [products, category, sort, query]);

  const highlight = products[0];
  const heroImage = highlight?.images[0];

  return (
    <MobileShell>
      <TopAppBar cartCount={count} onCartClick={() => router.push("/cart")} />
      <main className="flex-1 px-4 pb-24 lg:px-10 lg:pb-20">
        <section className="relative overflow-hidden rounded-none border border-neutral-800 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 py-10 lg:rounded-3xl lg:border-white/10 lg:px-12 lg:py-14 lg:shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
          {heroImage ? (
            <div
              className="absolute inset-0 opacity-50"
              style={{ backgroundImage: `url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
          <div className="relative flex flex-col gap-4 lg:w-2/3">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-neutral-400">New Season</p>
            <h1 className="font-display text-4xl font-black uppercase italic leading-tight text-white lg:text-5xl">
              Build the rotation.
              <br />
              Street essentials that hit different.
            </h1>
            <p className="text-sm text-neutral-300 lg:text-base">
              Technical layers, bold graphics, and engineered fits. Shop the drop and filter by what matters most to you.
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => router.push("/collections/featured")}
                className="rounded-full bg-street-red px-5 py-3 text-sm font-bold uppercase tracking-widest text-white transition-transform hover:-translate-y-0.5 hover:bg-red-700"
              >
                View Featured
              </button>
              <button
                type="button"
                onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}
                className="rounded-full border border-white/30 px-5 py-3 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:border-white"
              >
                Browse Catalog
              </button>
            </div>
          </div>
        </section>

        <section className="pt-8 lg:pt-12" id="catalog">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <h2 className="font-display text-3xl font-black uppercase italic tracking-tight text-white lg:text-4xl">
                Products
              </h2>
              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-neutral-500 lg:text-sm">
                Curated for movement, everyday, and late nights.
              </p>
            </div>
            <div className="flex w-full flex-col gap-4 lg:w-auto lg:flex-row lg:items-center lg:gap-3">
              <div className="flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/60 px-4 py-2 shadow-inner lg:w-64 lg:border-white/10">
                <span className="material-symbols-outlined text-neutral-500">search</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by name or vibe"
                  className="w-full bg-transparent text-sm text-white placeholder:text-neutral-500 focus:outline-none"
                />
              </div>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortOption)}
                className="rounded-full border border-neutral-800 bg-neutral-900/80 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-inner focus:border-street-red focus:outline-none lg:border-white/10"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-neutral-900">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {categories.map((item) => {
              const isActive = item === category;
              const label = item === "all" ? "All" : formatCategory(item as Product["category"]);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                    isActive
                      ? "border-street-red bg-street-red text-white"
                      : "border-neutral-800 bg-neutral-900/70 text-neutral-300 hover:border-neutral-600"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-white/10 bg-neutral-900/60 p-8 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-400">
                  No matches. Try another filter.
                </p>
              </div>
            ) : (
              filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
            )}
          </div>
        </section>
      </main>
      <BottomNav />
      <div className="h-10 bg-background-dark lg:hidden" />
    </MobileShell>
  );
}
