"use server";

import { revalidatePath } from "next/cache";

import { enforceAdminAccess } from "@/lib/admin";
import { updateOrderStatus } from "@/lib/db/orders";

const orderFlow = ["preparing", "shipping", "shipped"] as const;

type Status = (typeof orderFlow)[number];

function getNextStatus(current: string): Status {
  const index = orderFlow.indexOf(current as Status);
  if (index === -1 || index === orderFlow.length - 1) return "shipped";
  return orderFlow[index + 1];
}

export async function advanceOrderStatusAction(formData: FormData) {
  await enforceAdminAccess();
  const orderId = String(formData.get("orderId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!orderId) {
    return;
  }
  const nextStatus = getNextStatus(status);
  await updateOrderStatus(orderId, nextStatus);
  revalidatePath("/admin/orders");
}
