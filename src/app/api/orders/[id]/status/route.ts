import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { serializeOrder } from "@/lib/serializers";

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

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order: serializeOrder(order) });
  } catch (error: any) {
    if (error instanceof Response) {
      throw error;
    }
    if (error?.code === "P2025") {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    console.error("Order status PATCH error", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
