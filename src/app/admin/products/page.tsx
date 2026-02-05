import { Suspense } from "react";
import { AdminProductsScreen } from "@/components/screens/AdminProductsScreen";

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminProductsScreen />
    </Suspense>
  );
}
