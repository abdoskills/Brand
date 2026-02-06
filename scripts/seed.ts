import "dotenv/config";

import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

import { prisma } from "../src/lib/db";
import { dummyProducts } from "../src/lib/dummyData";

async function main() {
  const adminIdentifier = process.env.SEED_ADMIN ?? "admin@streetwear.io";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "admin123";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { emailOrPhone: adminIdentifier.toLowerCase() },
    update: {},
    create: {
      name: "Streetwear Admin",
      emailOrPhone: adminIdentifier.toLowerCase(),
      passwordHash,
      role: "admin",
    },
  });
  console.log(`Ensured admin account ${adminIdentifier}`);

  for (const product of dummyProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug ?? product.id },
      update: {},
      create: {
        id: product.id,
        slug: product.slug ?? product.id,
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription,
        price: product.price,
        compareAt: product.compareAt,
        images: product.images,
        category: product.category as Prisma.ProductCategory,
        badge: product.badge
          ? (product.badge === "Best Seller" ? "Best_Seller" : product.badge) as Prisma.ProductBadge
          : null,
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
  console.log(`Upserted ${dummyProducts.length} starter products`);
}

main()
  .then(() => {
    console.log("Seed completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
