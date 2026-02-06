import "dotenv/config";

import bcrypt from "bcryptjs";
import { Prisma, PrismaClient } from "@prisma/client";

import { dummyProducts } from "../src/lib/dummyData";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.SEED_ADMIN ?? "admin@fitin.test";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "fitin-admin-123";

function toBadge(badge: string | null | undefined): Prisma.ProductBadge | null {
  if (!badge) return null;
  if (badge === "Best Seller") return "Best_Seller";
  return badge as Prisma.ProductBadge;
}

function toCategory(category: string): Prisma.ProductCategory {
  return category as Prisma.ProductCategory;
}

export async function runSeed() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const admin = await prisma.user.upsert({
    where: { emailOrPhone: ADMIN_EMAIL.toLowerCase() },
    update: {},
    create: {
      name: "FIT IN Admin",
      emailOrPhone: ADMIN_EMAIL.toLowerCase(),
      passwordHash,
      role: "admin",
    },
  });
  console.log(`[seed] Admin ready: ${admin.emailOrPhone}`);

  for (const product of dummyProducts) {
    const slug = product.slug ?? product.id;
    await prisma.product.upsert({
      where: { slug },
      update: {
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription,
        price: product.price,
        compareAt: product.compareAt,
        images: product.images,
        category: toCategory(product.category),
        badge: toBadge(product.badge),
        ratingAvg: product.ratingAvg,
        reviewsCount: product.reviewsCount,
        stock: product.stock,
        features: product.features,
        sizes: product.sizes,
        materials: product.materials ?? undefined,
        care: product.care ?? undefined,
        currency: product.currency,
      },
      create: {
        id: product.id,
        slug,
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription,
        price: product.price,
        compareAt: product.compareAt,
        images: product.images,
        category: toCategory(product.category),
        badge: toBadge(product.badge),
        ratingAvg: product.ratingAvg,
        reviewsCount: product.reviewsCount,
        stock: product.stock,
        features: product.features,
        sizes: product.sizes,
        materials: product.materials ?? undefined,
        care: product.care ?? undefined,
        currency: product.currency,
        createdAt: new Date(product.createdAt),
      },
    });
  }

  console.log(`[seed] Seeded ${dummyProducts.length} products (including Atelier Tee)`);
}

if (require.main === module) {
  runSeed()
    .then(async () => {
      console.log("[seed] Completed successfully");
      await prisma.$disconnect();
    })
    .catch(async (error) => {
      console.error("[seed] Failed", error);
      await prisma.$disconnect();
      process.exit(1);
    });
}
