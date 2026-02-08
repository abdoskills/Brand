import { unstable_noStore as noStore } from "next/cache";

import { prisma } from "@/lib/db";
import { serializeOrder } from "@/lib/serializers";

const allowedSizes = new Set(["XS", "S", "M", "L", "XL"]);

export async function getOrders() {
  noStore();
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, include: { items: true } });
  return orders.map(serializeOrder);
}

export async function getOrdersGroupedByStatus(options?: { query?: string; limit?: number }) {
  noStore();
  const limit = options?.limit ?? 100;
  const query = options?.query?.trim();
  const where = query
    ? {
        OR: [
          { id: { contains: query, mode: "insensitive" as const } },
          { shippingEmail: { contains: query, mode: "insensitive" as const } },
          { shippingName: { contains: query, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { items: true },
  });

  const serialized = orders.map(serializeOrder);
  return {
    preparing: serialized.filter((order) => order.status === "preparing"),
    shipping: serialized.filter((order) => order.status === "shipping"),
    shipped: serialized.filter((order) => order.status === "shipped"),
  };
}

export async function updateOrderStatus(orderId: string, status: "preparing" | "shipping" | "shipped") {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: { items: true },
  });
  return serializeOrder(order);
}

export async function getOrderById(orderId: string) {
  noStore();
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  return order ? serializeOrder(order) : null;
}

type OrderItemInput = {
  productId: string;
  name: string;
  image?: string | null;
  qty: number;
  unitPrice: number;
  size: string;
};

type ShippingInput = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
};

export async function createOrderFromItems(items: OrderItemInput[], shipping: ShippingInput, userId?: string | null, guestId?: string | null) {
  if (!items.length) {
    throw new Error("No items to checkout");
  }

  const sanitizedItems = items.map((item) => {
    const size = item.size.toUpperCase();
    if (!allowedSizes.has(size)) {
      throw new Error("Invalid size selection");
    }
    return {
      ...item,
      size: size as "XS" | "S" | "M" | "L" | "XL",
      qty: Math.max(1, Number(item.qty) || 1),
      unitPrice: Number(item.unitPrice),
    };
  });

  const subtotal = sanitizedItems.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  const total = subtotal;

  const order = await prisma.$transaction(async (tx) => {
    for (const item of sanitizedItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.qty } },
      });
    }

    return tx.order.create({
      data: {
        userId: userId ?? null,
        guestId: guestId ?? null,
        shippingName: shipping.name,
        shippingEmail: shipping.email,
        shippingPhone: shipping.phone,
        shippingAddress: shipping.address,
        shippingCity: shipping.city,
        shippingCountry: shipping.country,
        shippingPostal: shipping.postalCode,
        subtotal,
        total,
        status: "preparing",
        items: {
          create: sanitizedItems.map((item) => ({
            productId: item.productId,
            name: item.name,
            image: item.image ?? null,
            qty: item.qty,
            unitPrice: item.unitPrice,
            size: item.size,
          })),
        },
      },
      include: { items: true },
    });
  });

  return serializeOrder(order);
}

export async function createTestOrder(productId: string, userId?: string | null) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return null;
  }

  const subtotal = Number(product.price);
  const order = await prisma.order.create({
    data: {
      userId: userId ?? null,
      shippingName: "Test Client",
      shippingEmail: "test@fitin.local",
      shippingPhone: "+1 (555) 010-1988",
      shippingAddress: "123 Atelier Row",
      shippingCity: "Preview City",
      shippingCountry: "US",
      shippingPostal: "00000",
      subtotal,
      total: subtotal,
      status: "preparing",
      items: {
        create: [
          {
            productId: product.id,
            name: product.name,
            qty: 1,
            unitPrice: Number(product.price),
            size: "M",
            image: product.images?.[0] ?? null,
          },
        ],
      },
    },
    include: { items: true },
  });

  return serializeOrder(order);
}
