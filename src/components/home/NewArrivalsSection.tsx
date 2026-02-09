import { ProductCard } from "@/components/ui/ProductCard";
import type { Product } from "@/types";

interface NewArrivalsSectionProps {
  products: Product[];
}

export function NewArrivalsSection({ products }: NewArrivalsSectionProps) {
  const visible = products.slice(0, 8);
  return (
    <section className="w-full bg-background py-16" id="shop">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">Latest Drops</p>
          <h2 className="font-display text-3xl sm:text-4xl text-text">New Arrivals</h2>
        </div>

        {visible.length ? (
          <div className="grid items-start justify-start gap-x-8 gap-y-12 grid-cols-[repeat(auto-fit,minmax(220px,280px))]">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-border bg-surface px-8 py-10 text-center shadow-[0_20px_60px_rgba(15,20,24,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Empty catalog</p>
            <h3 className="mt-3 font-display text-2xl text-text">No products have been released yet.</h3>
            <p className="mt-2 text-sm text-muted">Add your first item in the admin studio to populate the storefront.</p>
          </div>
        )}
      </div>
    </section>
  );
}
