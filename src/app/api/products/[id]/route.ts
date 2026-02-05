import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { connectMongo } from "@/lib/db";
import { serializeProduct } from "@/lib/serializers";
import { Product } from "@/models/Product";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    await connectMongo();
    const { id } = await params;
    const product = await Product.findById(id).lean();
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
    await connectMongo();
    const product = await Product.findByIdAndUpdate(id, data, {
      new: true,
      lean: true,
    });
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product: serializeProduct(product) });
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error("Product PUT error", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    await connectMongo();
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error("Product DELETE error", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
