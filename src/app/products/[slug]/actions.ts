"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { addToCart, resolveCartOwner } from "@/lib/db/cart";
import { createBuyNowDraft } from "@/lib/db/checkout";
import { createTestOrder } from "@/lib/db/orders";

export async function createTestOrderAction(productId: string) {
  const order = await createTestOrder(productId);
  if (!order) {
    return { ok: false, message: "Product not found" } as const;
  }
  revalidatePath("/admin/orders");
  return { ok: true } as const;
}

export async function addToCartAction(productId: string, size: string, qty: number) {
  await addToCart(productId, size, qty);
  
  const { userId, guestId } = await resolveCartOwner();
  const ownerId = userId ?? guestId;
  if (ownerId) {
    revalidateTag(`cart-count:${ownerId}`, { expire: 0 });
  }
  
  revalidatePath("/cart");
  return { ok: true } as const;
}

export async function startBuyNowAction(productId: string, size: string, qty: number) {
  const draftId = await createBuyNowDraft(productId, size, qty);
  revalidatePath("/checkout");
  return { ok: true, draftId } as const;
}
