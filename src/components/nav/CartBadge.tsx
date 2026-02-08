import { Suspense } from "react";
import CartBadgeClient from "./CartBadgeClient";
import { getCartCountTagged } from "@/lib/db/cart";

export default async function CartBadge() {
  const { count } = await getCartCountTagged();
  
  return (
    <Suspense fallback={
      <div className="relative text-text">
        <span className="material-icons-outlined">shopping_bag</span>
      </div>
    }>
      <CartBadgeClient initialCount={count} />
    </Suspense>
  );
}
