import { NextRequest, NextResponse } from "next/server";

import { requireAdmin, requireUser } from "@/lib/auth";
import { connectMongo } from "@/lib/db";
import { serializeOrder } from "@/lib/serializers";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { dummyProducts } from "@/lib/dummyData";
import type { Order as OrderType, OrderItem } from "@/types";

const fallbackOrders: OrderType[] = [];

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser(request);
    const { items, shipping } = await request.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    if (!shipping?.name || !shipping?.phone || !shipping?.address || !shipping?.city) {
      return NextResponse.json({ message: "Shipping information incomplete" }, { status: 400 });
    }

    if (!process.env.MONGODB_URI) {
      const allowedSizes = new Set(["S", "M", "L", "XL"]);
      const orderItems: OrderItem[] = [];
      let subtotal = 0;

      for (const item of items) {
        const product = dummyProducts.find((entry) => entry.id === item.productId);
        if (!product) {
          return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }
        const qty = Number(item.qty ?? 1);
        if (!qty || qty < 1) {
          return NextResponse.json({ message: "Invalid quantity" }, { status: 400 });
        }
        const size = typeof item.size === "string" ? item.size.toUpperCase() : null;
        if (!size || !allowedSizes.has(size)) {
          return NextResponse.json({ message: "Invalid size selection" }, { status: 400 });
        }
        subtotal += product.price * qty;
        orderItems.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          qty,
          size: size as OrderItem["size"],
          image: product.images[0],
        });
      }

      const total = subtotal;
      const now = new Date().toISOString();
      const order: OrderType = {
        id: `order_${Date.now()}`,
        userId: user.id,
        items: orderItems,
        shipping,
        subtotal,
        total,
        status: "pending",
        createdAt: now,
        updatedAt: now,
      };

      fallbackOrders.unshift(order);
      return NextResponse.json({ order }, { status: 201 });
    }

    await connectMongo();

    const productIds = items.map((item: { productId: string }) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } }).lean();

    const productsMap = new Map(products.map((product) => [product._id.toString(), product]));

    const orderItems = [] as {
      productId: string;
      name: string;
      price: number;
      qty: number;
      size: "S" | "M" | "L" | "XL";
      image?: string;
    }[];

    let subtotal = 0;

    const allowedSizes = new Set(["S", "M", "L", "XL"]);

    for (const item of items) {
      const product = productsMap.get(item.productId);
      if (!product) {
        return NextResponse.json({ message: "Product not found" }, { status: 404 });
      }
      const qty = Number(item.qty ?? 1);
      if (!qty || qty < 1) {
        return NextResponse.json({ message: "Invalid quantity" }, { status: 400 });
      }
      if (product.stock < qty) {
        return NextResponse.json({ message: `${product.name} is out of stock` }, { status: 400 });
      }
      const size = typeof item.size === "string" ? item.size.toUpperCase() : null;
      if (!size || !allowedSizes.has(size)) {
        return NextResponse.json({ message: "Invalid size selection" }, { status: 400 });
      }
      subtotal += product.price * qty;
      orderItems.push({
        productId: product._id.toString(),
        name: product.name,
        price: product.price,
        qty,
        size: size as "S" | "M" | "L" | "XL",
        image: product.images?.[0],
      });
    }

    await Promise.all(
      orderItems.map((item) =>
        Product.updateOne(
          { _id: item.productId },
          { $inc: { stock: -item.qty } }
        )
      )
    );

    const total = subtotal;

    const order = await Order.create({
      userId: user.id,
      items: orderItems,
      shipping,
      subtotal,
      total,
      status: "pending",
    });

    return NextResponse.json({ order: serializeOrder(order.toObject()) }, { status: 201 });
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error("Order POST error", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ orders: fallbackOrders });
    }

    await connectMongo();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ orders: orders.map(serializeOrder) });
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error("Order GET error", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
