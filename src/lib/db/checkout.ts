import { cookies } from "next/headers";
import { unstable_noStore as noStore } from "next/cache";

import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/db/session";
import { getOrCreateGuestId } from "@/lib/db/cart";

const DRAFT_COOKIE = "fitin_checkout_draft";
const MODE_COOKIE = "fitin_checkout_mode";

const sizeOptions = new Set(["XS", "S", "M", "L", "XL"]);

function normalizeSize(size: string) {
  const normalized = size.toUpperCase();
  return sizeOptions.has(normalized) ? (normalized as "XS" | "S" | "M" | "L" | "XL") : null;
}

export async function createBuyNowDraft(productId: string, size: string, qty: number) {
  const normalizedSize = normalizeSize(size);
  if (!normalizedSize) {
    throw new Error("Invalid size selection");
  }
  const safeQty = Math.max(1, Number(qty) || 1);
  const userId = await getSessionUserId();
  const guestId = userId ? null : await getOrCreateGuestId(true);

  const product = await prisma.product.findFirst({ where: { id: productId, isActive: true } });
  if (!product) {
    throw new Error("Product not available");
  }

  const existingDraft = await prisma.checkoutDraft.findFirst({
    where: userId ? { userId } : { guestId: guestId ?? undefined },
  });
  if (existingDraft) {
    await prisma.checkoutDraftItem.deleteMany({ where: { draftId: existingDraft.id } });
  }

  const draft = await prisma.checkoutDraft.upsert({
    where: userId ? { userId } : { guestId: guestId ?? "" },
    update: {},
    create: { userId: userId ?? undefined, guestId: guestId ?? undefined },
  });

  await prisma.checkoutDraftItem.create({
    data: {
      draftId: draft.id,
      productId: product.id,
      name: product.name,
      image: product.images?.[0] ?? null,
      qty: safeQty,
      unitPrice: product.price,
      size: normalizedSize,
    },
  });

  const jar = await cookies();
  jar.set(DRAFT_COOKIE, draft.id, { path: "/", httpOnly: true, sameSite: "lax" });
  jar.set(MODE_COOKIE, "buyNow", { path: "/", httpOnly: true, sameSite: "lax" });

  return draft.id;
}

export async function clearBuyNowDraft(draftId: string) {
  await prisma.checkoutDraftItem.deleteMany({ where: { draftId } });
}

export async function getCheckoutDraftById(draftId: string) {
  noStore();
  const draft = await prisma.checkoutDraft.findUnique({
    where: { id: draftId },
    include: { items: true },
  });
  if (!draft) {
    return { mode: "cart" as const, items: [], subtotal: 0, total: 0, draftId: null };
  }
  const items = draft.items.map((item) => {
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
  return { mode: "buyNow" as const, items, subtotal, total: subtotal, draftId: draft.id };
}

export async function getCheckoutDraft() {
  noStore();
  const jar = await cookies();
  const mode = jar.get(MODE_COOKIE)?.value ?? "cart";
  if (mode !== "buyNow") {
    return { mode: "cart" as const, items: [], subtotal: 0, total: 0, draftId: null };
  }
  const draftId = jar.get(DRAFT_COOKIE)?.value;
  if (!draftId) {
    return { mode: "cart" as const, items: [], subtotal: 0, total: 0, draftId: null };
  }

  const draft = await prisma.checkoutDraft.findUnique({
    where: { id: draftId },
    include: { items: true },
  });
  if (!draft) {
    return { mode: "cart" as const, items: [], subtotal: 0, total: 0, draftId: null };
  }

  const items = draft.items.map((item) => {
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
  return { mode: "buyNow" as const, items, subtotal, total: subtotal, draftId: draft.id };
}

export async function clearCheckoutCookies() {
  const jar = await cookies();
  jar.delete(DRAFT_COOKIE);
  jar.delete(MODE_COOKIE);
}
