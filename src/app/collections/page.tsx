import { CollectionsPageClient } from "@/components/collections/CollectionsPageClient";
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

  const sections = Object.entries(grouped)
    .map(([title, items]) => ({ title, items }))
    .sort((a, b) => a.title.localeCompare(b.title));
  return (
    <>
      <main className="bg-background px-6 py-14 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <CollectionsPageClient collections={sections} allProducts={products} />
        </div>
      </main>
    </>
  );
}
