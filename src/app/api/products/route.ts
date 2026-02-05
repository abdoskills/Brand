import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { connectMongo } from "@/lib/db";
import { dummyProducts } from "@/lib/dummyData";
import { serializeProduct } from "@/lib/serializers";
import { Product } from "@/models/Product";

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ products: dummyProducts });
    }
    await connectMongo();
    const products = await Product.find().sort({ createdAt: -1 }).lean();
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

    await connectMongo();
    const product = await Product.create(data);

    return NextResponse.json(
      { product: serializeProduct(product.toObject()) },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error("Products POST error", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
