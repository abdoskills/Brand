import { Suspense } from "react";
import { AccountScreen } from "@/components/screens/AccountScreen";

export default function AccountPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountScreen />
    </Suspense>
  );
}
