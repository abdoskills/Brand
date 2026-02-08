import { ProductCard } from "@/components/ui/ProductCard";
import type { Product } from "@/types";

interface NewArrivalsSectionProps {
  products: Product[];
}

export function NewArrivalsSection({ products }: NewArrivalsSectionProps) {
  const visible = products.slice(0, 8);
  return (
    <section className="w-full bg-[#f9f9f9] py-16" id="shop">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 lg:px-12">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">Latest Drops</p>
          <h2 className="font-[playfair] text-3xl sm:text-4xl text-text-default">New Arrivals</h2>
        </div>

        {visible.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-[#e7dcc1] bg-white px-8 py-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b3862a]">Empty catalog</p>
            <h3 className="mt-3 font-[playfair] text-2xl text-neutral-900">No products have been released yet.</h3>
            <p className="mt-2 text-sm text-neutral-600">Add your first item in the admin studio to populate the storefront.</p>
          </div>
        )}
      </div>
    </section>
  );
}
