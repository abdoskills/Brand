import { NextRequest, NextResponse } from "next/server";

import { requireUser } from "@/lib/auth";
import { connectMongo } from "@/lib/db";
import { serializeOrder } from "@/lib/serializers";
import { Order } from "@/models/Order";
import type { Order as OrderType } from "@/types";
import { dummyProducts } from "@/lib/dummyData";

// Reuse fallback orders from the main orders route when available
let fallbackOrders: OrderType[] | null = null;

function getFallbackStore() {
  if (!fallbackOrders) {
    const mod = require("../route");
    fallbackOrders = mod.fallbackOrders as OrderType[];
  }
  return fallbackOrders ?? [];
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser(request);

    if (!process.env.MONGODB_URI) {
      const orders = getFallbackStore().filter((order) => order.userId === user.id);
      return NextResponse.json({ orders });
    }

    await connectMongo();
    const orders = await Order.find({ userId: user.id }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ orders: orders.map(serializeOrder) });
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error("Order MY error", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
