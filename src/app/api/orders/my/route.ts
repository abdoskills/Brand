import { NextRequest, NextResponse } from "next/server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { serializeOrder } from "@/lib/serializers";

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser(request);

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
    return NextResponse.json({ orders: orders.map(serializeOrder) });
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error("Order MY error", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
