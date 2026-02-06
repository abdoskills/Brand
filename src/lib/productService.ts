import { Prisma } from "@prisma/client";

import { dummyProducts } from "@/lib/dummyData";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serializers";
import { slugify } from "@/lib/slug";
import type { Product } from "@/types";

const hasDatabase = Boolean(process.env.DATABASE_URL);

function mapBadge(badge: Product["badge"] | null | undefined): Prisma.ProductBadge | null {
  if (!badge) return null;
  if (badge === "Best Seller") return "Best_Seller";
  return badge as Prisma.ProductBadge;
}

function mapCategory(category: Product["category"]): Prisma.ProductCategory {
  return category as Prisma.ProductCategory;
}

function buildProductCreateInput(product: Product): Prisma.ProductCreateInput {
  return {
    slug: product.slug ?? slugify(product.name),
    name: product.name,
    shortDescription: product.shortDescription,
    description: product.description,
    features: product.features,
    materials: product.materials ?? undefined,
    care: product.care ?? undefined,
    price: product.price,
    currency: product.currency ?? "USD",
    compareAt: product.compareAt ?? undefined,
    images: product.images,
    category: mapCategory(product.category),
    badge: mapBadge(product.badge),
    ratingAvg: product.ratingAvg,
    reviewsCount: product.reviewsCount,
    stock: product.stock,
    sizes: product.sizes,
  };
}

export async function fetchProductsFromDb() {
  if (!hasDatabase) {
    return [];
  }
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    return products.map(serializeProduct);
  } catch (error) {
    console.warn("Failed to read products from database, falling back to dummy data", error);
    return [];
  }
}

export async function listProductsWithFallback(): Promise<Product[]> {
  const products = await fetchProductsFromDb();
  if (products.length) {
    return products;
  }
  return dummyProducts;
}

export async function findProductBySlugWithFallback(slug: string): Promise<Product | null> {
  const normalized = slugify(slug);
  if (hasDatabase) {
    try {
      const product = await prisma.product.findUnique({ where: { slug: normalized } });
      if (product) {
        return serializeProduct(product);
      }
    } catch (error) {
      console.warn(`Product lookup failed for ${normalized}, using fallback`, error);
    }
  }
  const fallback = dummyProducts.find((item) => item.slug.toLowerCase() === normalized);
  return fallback ?? null;
}

export async function ensureProductExists(product: Product): Promise<Product> {
  const slug = slugify(product.slug ?? product.id ?? product.name);
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    return serializeProduct(existing);
  }
  const created = await prisma.product.create({
    data: {
      ...buildProductCreateInput({ ...product, slug }),
      // Preserve incoming id if provided for deterministic fixtures
      ...(product.id ? { id: product.id } : {}),
    },
  });
  return serializeProduct(created);
}

export async function createProductRecord(product: Product) {
  const slug = slugify(product.slug ?? product.name);
  const created = await prisma.product.create({ data: buildProductCreateInput({ ...product, slug }) });
  return serializeProduct(created);
}

export { mapBadge as toPrismaBadge, mapCategory as toPrismaCategory };
