import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { serializeOrder } from "@/lib/serializers";
import { ensureProductExists, findProductBySlugWithFallback } from "@/lib/productService";
import { slugify } from "@/lib/slug";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const slug = typeof body.slug === "string" ? body.slug : "";
    if (!slug) {
      return NextResponse.json({ message: "Missing product slug" }, { status: 400 });
    }

    const normalized = slugify(slug);
    const productFromDb = await prisma.product.findUnique({ where: { slug: normalized } });
    const hydrated = productFromDb
      ? productFromDb
      : await (async () => {
          const fallback = await findProductBySlugWithFallback(normalized);
          if (!fallback) {
            return null;
          }
          const ensured = await ensureProductExists(fallback);
          return await prisma.product.findUnique({ where: { slug: ensured.slug } });
        })();

    if (!hydrated) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    const order = await prisma.order.create({
      data: {
        shippingName: "Test Client",
        shippingPhone: "+1 (555) 010-1988",
        shippingAddress: "123 Atelier Row",
        shippingCity: "Preview City",
        subtotal: Number(hydrated.price),
        total: Number(hydrated.price),
        status: "preparing",
        items: {
          create: [
            {
              productId: hydrated.id,
              name: hydrated.name,
              qty: 1,
              unitPrice: Number(hydrated.price),
              size: "M",
              image: hydrated.images[0] ?? null,
            },
          ],
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ order: serializeOrder(order) }, { status: 201 });
  } catch (error) {
    console.error("Test order error", error);
    return NextResponse.json({ message: "Failed to place test order" }, { status: 500 });
  }
}
