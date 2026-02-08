"use server";

import { revalidatePath } from "next/cache";

import { enforceAdminAccess } from "@/lib/admin";
import { createProduct } from "@/lib/db/products";
import type { Product } from "@/types";

type CreateProductPayload = Omit<Product, "id" | "createdAt" | "inStock"> & { id?: string };

export async function createProductAction(payload: CreateProductPayload) {
  await enforceAdminAccess();
  if (!payload.name || !payload.description || Number.isNaN(Number(payload.price))) {
    return { ok: false, message: "Name, description, and price are required." } as const;
  }

  await createProduct(payload);
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/collections");
  revalidatePath("/");
  return { ok: true } as const;
}
