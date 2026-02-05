import { Suspense } from "react";
import { AdminScreen } from "@/components/screens/AdminScreen";

export default function AdminPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminScreen />
    </Suspense>
  );
}
