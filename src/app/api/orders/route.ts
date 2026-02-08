import { NextRequest, NextResponse } from "next/server";

import { requireAdmin, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { serializeOrder } from "@/lib/serializers";

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser(request);
    const { items, shipping } = await request.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    if (!shipping?.name || !shipping?.email || !shipping?.phone || !shipping?.address || !shipping?.city || !shipping?.country || !shipping?.postalCode) {
      return NextResponse.json({ message: "Shipping information incomplete" }, { status: 400 });
    }

    const allowedSizes = new Set(["XS", "S", "M", "L", "XL"]);
    const productIds = items.map((item: { productId: string }) => item.productId);

    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    if (!products.length) {
      return NextResponse.json({ message: "Products not found" }, { status: 404 });
    }

    const map = new Map(products.map((p) => [p.id, p]));
    const orderItems: {
      productId: string;
      name: string;
      image?: string;
      qty: number;
      unitPrice: number;
      size: "S" | "M" | "L" | "XL";
    }[] = [];
    let subtotal = 0;

    for (const item of items) {
      const product = map.get(item.productId);
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
      subtotal += Number(product.price) * qty;
      orderItems.push({
        productId: product.id,
        name: product.name,
        image: product.images?.[0],
        qty,
        unitPrice: Number(product.price),
        size: size as "S" | "M" | "L" | "XL",
      });
    }

    const total = subtotal;

    const order = await prisma.$transaction(async (tx) => {
      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.qty } },
        });
      }

      return tx.order.create({
        data: {
          userId: user.id,
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
            create: orderItems.map((item) => ({
              productId: item.productId,
              qty: item.qty,
              unitPrice: item.unitPrice,
              size: item.size,
              name: item.name,
              image: item.image,
            })),
          },
        },
        include: { items: true },
      });
    });

    return NextResponse.json({ order: serializeOrder(order) }, { status: 201 });
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
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
    return NextResponse.json({ orders: orders.map(serializeOrder) });
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error("Order GET error", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
