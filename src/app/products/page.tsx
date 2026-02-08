import Footer from "@/components/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { getAllProducts } from "@/lib/db/products";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <>
      <main className="bg-white px-6 py-14 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b3862a]">Catalog</p>
            <h1 className="font-[playfair] text-3xl text-neutral-900 sm:text-4xl">All products</h1>
            <p className="text-sm text-neutral-600">Curated pieces, stocked and ready to ship.</p>
          </div>

          {products.length ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => (
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
      </main>
      <Footer />
    </>
  );
}
