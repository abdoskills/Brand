import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { connectMongo } from "@/lib/db";
import { serializeOrder } from "@/lib/serializers";
import { Order } from "@/models/Order";

interface Params {
  params: Promise<{ id: string }>;
}

const allowedStatuses = new Set(["pending", "processing", "shipped", "cancelled"]);

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const status = typeof body.status === "string" ? body.status : "";
    if (!allowedStatuses.has(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    await connectMongo();
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, lean: true }
    );

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order: serializeOrder(order) });
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error("Order status PATCH error", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
