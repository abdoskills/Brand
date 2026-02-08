"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { removeCartItem, updateCartItemQty, setCheckoutMode } from "@/lib/db/cart";

export async function updateCartItemAction(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  const qty = Number(formData.get("qty") ?? 1);
  if (!itemId) return;
  await updateCartItemQty(itemId, qty);
  revalidatePath("/cart");
}

export async function removeCartItemAction(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  if (!itemId) return;
  await removeCartItem(itemId);
  revalidatePath("/cart");
}

export async function startCartCheckoutAction() {
  await setCheckoutMode("cart");
  redirect("/checkout");
}
