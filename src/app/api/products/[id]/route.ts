import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { serializeProduct } from "@/lib/serializers";
import { slugify } from "@/lib/slug";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const normalized = slugify(id);
    const product = await prisma.product.findFirst({ where: { OR: [{ id }, { slug: normalized }] } });
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product: serializeProduct(product) });
  } catch (error) {
    console.error("Product GET error", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    const data = await request.json();
    const normalized = slugify(id);
    const target = await prisma.product.findFirst({ where: { OR: [{ id }, { slug: normalized }] } });
    if (!target) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    const product = await prisma.product.update({
      where: { id: target.id },
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
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product: serializeProduct(product) });
  } catch (error: unknown) {
    if (error instanceof Response) {
      throw error;
    }
    if (typeof error === "object" && error && "code" in error && (error as { code?: string }).code === "P2025") {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    console.error("Product PUT error", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    const normalized = slugify(id);
    const target = await prisma.product.findFirst({ where: { OR: [{ id }, { slug: normalized }] } });
    if (!target) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    await prisma.product.delete({ where: { id: target.id } });
    return NextResponse.json({ message: "Product deleted" });
  } catch (error: unknown) {
    if (error instanceof Response) {
      throw error;
    }
    if (typeof error === "object" && error && "code" in error && (error as { code?: string }).code === "P2025") {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    console.error("Product DELETE error", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
