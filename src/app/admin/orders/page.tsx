import { Suspense } from "react";
import { AdminOrdersScreen } from "@/components/screens/AdminOrdersScreen";

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminOrdersScreen />
    </Suspense>
  );
}
