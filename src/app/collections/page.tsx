import Link from "next/link";

import Footer from "@/components/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { getAllProducts } from "@/lib/db/products";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const products = await getAllProducts();
  const grouped = products.reduce<Record<string, typeof products>>((acc, product) => {
    const key = product.collectionTag?.trim() || product.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(product);
    return acc;
  }, {});

  const sections = Object.entries(grouped);
  return (
    <>
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <header className="mb-12 text-center fade-in">
          <h1 className="font-serif text-4xl md:text-5xl text-text-main-light dark:text-text-main-dark mb-4">
            The Collection
          </h1>
          <div className="w-16 h-0.5 bg-primary mx-auto mb-4" />
          <p className="text-text-muted-light dark:text-text-muted-dark max-w-2xl mx-auto font-light text-sm tracking-wide">
            Discover our curated selection of timeless pieces designed for the modern connoisseur.
          </p>
        </header>

        <div className="flex flex-col gap-12 fade-in" style={{ animationDelay: "0.2s" }}>
          {sections.length ? (
            sections.map(([title, list]) => (
              <section key={title} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-2xl text-text-main-light dark:text-text-main-dark uppercase tracking-[0.2em]">
                    {title}
                  </h2>
                  <span className="text-xs uppercase tracking-[0.18em] text-text-muted-light dark:text-text-muted-dark">
                    {list.length} pieces
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="rounded-3xl border border-border-light dark:border-border-dark bg-white/80 dark:bg-surface-dark px-8 py-10 text-center shadow-subtle">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Empty catalog</p>
              <h3 className="mt-3 font-serif text-2xl text-text-main-light dark:text-text-main-dark">No collections yet.</h3>
              <p className="mt-2 text-sm text-text-muted-light dark:text-text-muted-dark">Add a product to begin the collection.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
