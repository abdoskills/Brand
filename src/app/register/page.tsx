import { Suspense } from "react";
import { RegisterScreen } from "@/components/screens/RegisterScreen";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterScreen />
    </Suspense>
  );
}
