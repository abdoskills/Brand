import { cookies } from "next/headers";
import { unstable_noStore as noStore, unstable_cache } from "next/cache";

import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/db/session";

const GUEST_COOKIE = "fitin_guest";

const sizeOptions = new Set(["XS", "S", "M", "L", "XL"]);

function normalizeSize(size: string) {
  const normalized = size.toUpperCase();
  return sizeOptions.has(normalized) ? (normalized as "XS" | "S" | "M" | "L" | "XL") : null;
}

export async function getOrCreateGuestId(allowWrite = false) {
  const jar = await cookies();
  const existing = jar.get(GUEST_COOKIE)?.value;
  if (existing) return existing;
  if (!allowWrite) return null;
  const id = crypto.randomUUID();
  jar.set(GUEST_COOKIE, id, { path: "/", httpOnly: true, sameSite: "lax" });
  return id;
}

export async function resolveCartOwner(allowWrite = false) {
  const userId = await getSessionUserId();
  const guestId = userId ? null : await getOrCreateGuestId(allowWrite);
  return { userId, guestId };
}

export async function getCart() {
  noStore();
  const { userId, guestId } = await resolveCartOwner();
  if (!userId && !guestId) return null;
  return prisma.cart.findFirst({
    where: userId ? { userId } : { guestId: guestId ?? undefined },
    include: { items: true },
  });
}

export async function getCartSummary() {
  const cart = await getCart();
  if (!cart) return { cart: null, items: [], subtotal: 0, total: 0 };
  const items = cart.items.map((item) => {
    const lineTotal = Number(item.unitPrice) * item.qty;
    return {
      id: item.id,
      productId: item.productId,
      name: item.name,
      image: item.image ?? undefined,
      qty: item.qty,
      size: item.size,
      price: Number(item.unitPrice),
      lineTotal,
    };
  });
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  return { cart, items, subtotal, total: subtotal };
}

export async function addToCart(productId: string, size: string, qty: number) {
  const normalizedSize = normalizeSize(size);
  if (!normalizedSize) {
    throw new Error("Invalid size selection");
  }
  const safeQty = Math.max(1, Number(qty) || 1);
  const { userId, guestId } = await resolveCartOwner(true);
  const product = await prisma.product.findFirst({ where: { id: productId, isActive: true } });
  if (!product) {
    throw new Error("Product not available");
  }

  const cart = await prisma.cart.upsert({
    where: userId ? { userId } : { guestId: guestId ?? "" },
    update: {},
    create: {
      userId: userId ?? undefined,
      guestId: guestId ?? undefined,
    },
  });

  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId, size: normalizedSize },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { qty: existing.qty + safeQty },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: product.id,
        name: product.name,
        image: product.images?.[0] ?? null,
        qty: safeQty,
        unitPrice: product.price,
        size: normalizedSize,
      },
    });
  }
}

export async function updateCartItemQty(itemId: string, qty: number) {
  const safeQty = Math.max(1, Number(qty) || 1);
  await prisma.cartItem.update({ where: { id: itemId }, data: { qty: safeQty } });
}

export async function removeCartItem(itemId: string) {
  await prisma.cartItem.delete({ where: { id: itemId } });
}

export async function clearCart(cartId: string) {
  await prisma.cartItem.deleteMany({ where: { cartId } });
}

export async function setCheckoutMode(mode: "cart" | "buyNow") {
  const jar = await cookies();
  jar.set("fitin_checkout_mode", mode, { path: "/", httpOnly: true, sameSite: "lax" });
}

export async function clearCheckoutMode() {
  const jar = await cookies();
  jar.delete("fitin_checkout_mode");
}

export const getCartCount = unstable_cache(
  async (ownerId: string, isUser: boolean) => {
    const where = isUser ? { userId: ownerId } : { guestId: ownerId };
    const cart = await prisma.cart.findFirst({
      where,
      select: { items: { select: { qty: true } } },
    });
    return cart?.items.reduce((sum, i) => sum + i.qty, 0) ?? 0;
  },
  ["cart-count"],
  { tags: [] }
);

export async function getCartCountTagged() {
  const { userId, guestId } = await resolveCartOwner();
  const ownerId = userId ?? guestId;
  const isUser = !!userId;
  
  if (!ownerId) return { count: 0, tag: "", ownerId: "" };
  
  const tag = `cart-count:${ownerId}`;

  const cached = unstable_cache(
    () => getCartCount(ownerId, isUser),
    ["cart-count", ownerId],
    { tags: [tag] }
  );

  return { count: await cached(), tag, ownerId };
}
