import type { Order as PrismaOrder, OrderItem as PrismaOrderItem, Product as PrismaProduct, User as PrismaUser } from "@prisma/client";

import type { Order as ApiOrder, Product as ApiProduct } from "@/types";

function normalizeBadge(badge: PrismaProduct["badge"]): ApiProduct["badge"] {
  if (!badge) return null;
  if (badge === "Best_Seller") return "Best Seller";
  return badge as ApiProduct["badge"];
}

export function serializeUser(user: PrismaUser) {
  return {
    id: user.id,
    name: user.name,
    emailOrPhone: user.emailOrPhone,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export function serializeProduct(product: PrismaProduct): ApiProduct {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    shortDescription: product.shortDescription ?? product.description,
    description: product.description,
    price: Number(product.price),
    compareAt: product.compareAt ? Number(product.compareAt) : null,
    currency: product.currency,
    images: product.images,
    category: product.category,
    badge: normalizeBadge(product.badge),
    ratingAvg: product.ratingAvg ?? 0,
    reviewsCount: product.reviewsCount,
    stock: product.stock,
    inStock: product.stock > 0,
    features: product.features,
    sizes: product.sizes,
    createdAt: product.createdAt.toISOString(),
    materials: product.materials ?? undefined,
    care: product.care ?? undefined,
  };
}

export function serializeOrder(order: PrismaOrder & { items?: PrismaOrderItem[] }): ApiOrder {
  return {
    id: order.id,
    userId: order.userId ?? "",
    items: (order.items ?? []).map((item) => ({
      productId: item.productId,
      name: item.name,
      image: item.image ?? undefined,
      price: Number(item.unitPrice),
      qty: item.qty,
      size: item.size as ApiOrder["items"][number]["size"],
    })),
    shipping: {
      name: order.shippingName,
      phone: order.shippingPhone,
      address: order.shippingAddress,
      city: order.shippingCity,
    },
    subtotal: Number(order.subtotal),
    total: Number(order.total),
    status: order.status as ApiOrder["status"],
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}
