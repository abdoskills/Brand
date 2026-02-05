import type { IOrder } from "@/models/Order";
import type { IProduct } from "@/models/Product";
import type { IUser } from "@/models/User";

export function serializeUser(user: IUser & { _id: any }) {
  return {
    id: user._id.toString(),
    name: user.name,
    emailOrPhone: user.emailOrPhone,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export function serializeProduct(product: IProduct & { _id: any }) {
  return {
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    compareAt: product.compareAt ?? null,
    images: product.images,
    category: product.category,
    badge: product.badge ?? null,
    ratingAvg: product.ratingAvg,
    reviewsCount: product.reviewsCount,
    stock: product.stock,
    createdAt: product.createdAt,
  };
}

export function serializeOrder(order: IOrder & { _id: any }) {
  return {
    id: order._id.toString(),
    userId: order.userId,
    items: order.items,
    shipping: order.shipping,
    subtotal: order.subtotal,
    total: order.total,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}
