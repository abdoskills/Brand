import { notFound } from "next/navigation";

import { CollectionScreen } from "@/components/screens/CollectionScreen";
import { fetchProducts } from "@/lib/apiClient";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CollectionPage(props: CollectionPageProps) {
  const params = await props.params;
  const products = await fetchProducts();
  if (!products) {
    notFound();
  }
  const title = params.slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  return <CollectionScreen title={title} products={products.slice(0, 6)} />;
}
