import { notFound } from "next/navigation";

import { ProductScreen } from "@/components/screens/ProductScreen";
import { fetchProduct, fetchProducts } from "@/lib/apiClient";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage(props: ProductPageProps) {
  const params = await props.params;
  const product = await fetchProduct(params.id);
  if (!product) {
    notFound();
  }
  const catalog = await fetchProducts();
  const related = catalog.filter((item) => item.id !== product.id).slice(0, 6);
  return <ProductScreen product={product} related={related} />;
}
