import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { dummyProducts } from "@/lib/dummyData";
import { serializeProduct } from "@/lib/serializers";

export async function GET() {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    if (!products.length) {
      return NextResponse.json({ products: dummyProducts });
    }
    return NextResponse.json({ products: products.map(serializeProduct) });
  } catch (error) {
    console.error("Products GET error", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    const data = await request.json();
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        compareAt: data.compareAt ?? null,
        images: Array.isArray(data.images) ? data.images : [],
        category: data.category,
        badge: data.badge ? (data.badge === "Best Seller" ? "Best_Seller" : data.badge) : null,
        ratingAvg: data.ratingAvg ?? 0,
        reviewsCount: data.reviewsCount ?? 0,
        stock: data.stock ?? 0,
      },
    });

    return NextResponse.json({ product: serializeProduct(product) }, { status: 201 });
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error("Products POST error", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
