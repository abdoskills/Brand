import { ProductsPageClient } from "@/components/product/ProductsPageClient";
import { getAllProducts } from "@/lib/db/products";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <>
      <main className="bg-background py-14 lg:py-16">
        <div className="mx-auto max-w-[1280px] px-6">
          <ProductsPageClient products={products} />
        </div>
      </main>
    </>
  );
}
