import { ShopScreen } from "@/components/screens/ShopScreen";
import { fetchProducts } from "@/lib/apiClient";

export default async function ShopPage() {
  const products = await fetchProducts();
  return <ShopScreen products={products} />;
}
