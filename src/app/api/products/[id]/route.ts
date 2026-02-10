import { NextRequest, NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { serializeProduct } from "@/lib/serializers";
import { slugify } from "@/lib/slug";

interface Params {
  params: Promise<{ id: string }>;
}

async function ensureAdmin(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  return null;
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
    const authError = await ensureAdmin(request);
    if (authError) return authError;
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
    const authError = await ensureAdmin(request);
    if (authError) return authError;
    const { id } = await params;
    const requestBody = await request.json().catch(() => null);
    const normalized = slugify(id);
    const target = await prisma.product.findFirst({ where: { OR: [{ id }, { slug: normalized }] } });
    if (!target) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    console.info("Product DELETE request", { productId: target.id, requestBody });
    const product = await prisma.product.update({
      where: { id: target.id },
      data: { isActive: false },
    });
    return NextResponse.json({ message: "Product archived", product: serializeProduct(product) });
  } catch (error: unknown) {
    if (error instanceof Response) {
      throw error;
    }
    const code = typeof error === "object" && error && "code" in error ? (error as { code?: string }).code : undefined;
    const detail = error instanceof Error ? error.message : undefined;
    if (code === "P2025") {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    if (code === "P2003") {
      return NextResponse.json({ message: "Product is referenced by other records" }, { status: 409 });
    }
    console.error(error);
    console.error("Product DELETE error", { code, detail, error });
    return NextResponse.json({ error: "delete failed", detail: String(detail ?? error) }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const authError = await ensureAdmin(request);
    if (authError) return authError;
    const { id } = await params;
    const requestBody = await request.json().catch(() => null);
    const normalized = slugify(id);
    const target = await prisma.product.findFirst({ where: { OR: [{ id }, { slug: normalized }] } });
    if (!target) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    console.info("Product PATCH request", { productId: target.id, requestBody });
    const isActive = typeof requestBody?.isActive === "boolean" ? requestBody.isActive : true;
    const product = await prisma.product.update({
      where: { id: target.id },
      data: { isActive },
    });
    return NextResponse.json({ message: "Product updated", product: serializeProduct(product) });
  } catch (error: unknown) {
    if (error instanceof Response) {
      throw error;
    }
    const code = typeof error === "object" && error && "code" in error ? (error as { code?: string }).code : undefined;
    const detail = error instanceof Error ? error.message : undefined;
    if (code === "P2025") {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    console.error(error);
    console.error("Product PATCH error", { code, detail, error });
    return NextResponse.json({ error: "update failed", detail: String(detail ?? error) }, { status: 400 });
  }
}
