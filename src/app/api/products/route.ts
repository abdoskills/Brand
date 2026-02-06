import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { dummyProducts } from "@/lib/dummyData";
import { serializeProduct } from "@/lib/serializers";
import { slugify } from "@/lib/slug";

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

    const name = (data.name ?? "").trim();
    const description = (data.description ?? "").trim();
    const price = Number(data.price);

    if (!name || !description || Number.isNaN(price)) {
      return NextResponse.json({ message: "Name, description, and price are required" }, { status: 400 });
    }

    const slug = slugify(data.slug ?? name);
    const compareAtValue = data.compareAt !== undefined && data.compareAt !== null ? Number(data.compareAt) : null;

    const product = await prisma.product.create({
      data: {
        slug,
        name,
        shortDescription: data.shortDescription ?? description,
        description,
        features: Array.isArray(data.features) ? data.features : [],
        materials: data.materials ?? null,
        care: data.care ?? null,
        price,
        currency: data.currency ?? "USD",
        compareAt: compareAtValue,
        images: Array.isArray(data.images) ? data.images : [],
        category: data.category,
        badge: data.badge ? (data.badge === "Best Seller" ? "Best_Seller" : data.badge) : null,
        ratingAvg: data.ratingAvg ?? 0,
        reviewsCount: data.reviewsCount ?? 0,
        stock: data.stock ?? 0,
        sizes: Array.isArray(data.sizes) && data.sizes.length ? data.sizes : ["S", "M", "L", "XL"],
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
