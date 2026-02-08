"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { getCartSummary, clearCart } from "@/lib/db/cart";
import { clearBuyNowDraft, getCheckoutDraft, getCheckoutDraftById, clearCheckoutCookies } from "@/lib/db/checkout";
import { createOrderFromItems } from "@/lib/db/orders";
import { getSessionUserId } from "@/lib/db/session";
import { getOrCreateGuestId } from "@/lib/db/cart";

export async function confirmOrderAction(formData: FormData) {
  const shipping = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    country: String(formData.get("country") ?? "").trim(),
    postalCode: String(formData.get("postalCode") ?? "").trim(),
  };

  if (!shipping.name || !shipping.email || !shipping.phone || !shipping.address || !shipping.city || !shipping.country || !shipping.postalCode) {
    redirect("/checkout?error=shipping");
  }

  const orderId = String(formData.get("orderId") ?? "");
  const draft = orderId ? await getCheckoutDraftById(orderId) : await getCheckoutDraft();
  let items = draft.items;
  let cartId: string | null = null;

  if (draft.mode !== "buyNow" || items.length === 0) {
    const cart = await getCartSummary();
    items = cart.items;
    cartId = cart.cart?.id ?? null;
  }

  if (!items.length) {
    redirect("/checkout?error=empty");
  }

  const orderItems = items.map((item) => ({
    productId: item.productId,
    name: item.name,
    image: item.image ?? null,
    qty: item.qty,
    unitPrice: item.price,
    size: item.size,
  }));

  const userId = await getSessionUserId();
  const guestId = userId ? null : await getOrCreateGuestId(true);
  const order = await createOrderFromItems(orderItems, shipping, userId, guestId);

  if (draft.mode === "buyNow" && draft.draftId) {
    await clearBuyNowDraft(draft.draftId);
  }
  if (cartId) {
    await clearCart(cartId);
  }
  await clearCheckoutCookies();

  revalidatePath("/cart");
  revalidatePath("/checkout");
  revalidatePath("/admin/orders");

  redirect(`/checkout/success?order=${order.id}`);
}
