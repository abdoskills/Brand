import { HomeScreen } from "@/components/screens/HomeScreen";
import { fetchProducts } from "@/lib/apiClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await fetchProducts();
  return <HomeScreen products={products} />;
}
