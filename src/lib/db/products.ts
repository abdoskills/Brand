import { Prisma } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

import { prisma } from "@/lib/db";
import { serializeProduct } from "@/lib/serializers";
import { slugify } from "@/lib/slug";
import type { Product } from "@/types";

type CreateProductInput = Omit<Product, "id" | "createdAt" | "inStock"> & {
  id?: string;
};

function mapBadge(badge: Product["badge"] | null | undefined): Prisma.ProductCreateInput["badge"] {
  if (!badge) return null;
  if (badge === "Best Seller") return "Best_Seller";
  return badge as Prisma.ProductCreateInput["badge"];
}

function mapCategory(category: Product["category"]): Prisma.ProductCreateInput["category"] {
  return category as Prisma.ProductCreateInput["category"];
}

export async function getNewArrivals(limit = 6) {
  noStore();
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return products.map(serializeProduct);
}

export async function getAllProducts(filters?: { category?: Product["category"]; collectionTag?: string }) {
  noStore();
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(filters?.category ? { category: filters.category } : {}),
      ...(filters?.collectionTag ? { collectionTag: filters.collectionTag } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
  return products.map(serializeProduct);
}

export async function getAdminProducts(options?: { showArchived?: boolean }) {
  noStore();
  const products = await prisma.product.findMany({
    where: options?.showArchived ? { isActive: false } : { isActive: true },
    orderBy: { createdAt: "desc" },
  });
  return products.map(serializeProduct);
}

export async function getProductBySlug(slug: string) {
  noStore();
  const normalized = slugify(slug);
  if (!normalized) return null;
  const product = await prisma.product.findFirst({
    where: { isActive: true, OR: [{ slug: normalized }, { id: normalized }] },
  });
  return product ? serializeProduct(product) : null;
}

async function ensureUniqueSlug(base: string) {
  let slug = slugify(base);
  if (!slug) slug = "product";
  let counter = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    counter += 1;
    slug = `${slugify(base)}-${counter}`;
  }
  return slug;
}

export async function createProduct(data: CreateProductInput) {
  const slug = await ensureUniqueSlug(data.slug ?? data.name);
  const created = await prisma.product.create({
    data: {
      ...(data.id ? { id: data.id } : {}),
      slug,
      name: data.name,
      shortDescription: data.shortDescription,
      description: data.description,
      features: data.features ?? [],
      materials: data.materials ?? undefined,
      care: data.care ?? undefined,
      price: data.price,
      currency: data.currency ?? "USD",
      compareAt: data.compareAt ?? undefined,
      images: data.images ?? [],
      category: mapCategory(data.category),
      badge: mapBadge(data.badge),
      isActive: data.isActive ?? true,
      isFeatured: data.isFeatured ?? false,
      collectionTag: data.collectionTag ?? undefined,
      ratingAvg: data.ratingAvg ?? 0,
      reviewsCount: data.reviewsCount ?? 0,
      stock: data.stock ?? 0,
      sizes: data.sizes ?? ["S", "M", "L", "XL"],
    },
  });
  return serializeProduct(created);
}

export type { CreateProductInput };
