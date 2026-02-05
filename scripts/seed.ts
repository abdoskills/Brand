import "dotenv/config";

import bcrypt from "bcryptjs";

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
      where: { id: product.id },
      update: {},
      create: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        compareAt: product.compareAt,
        images: product.images,
        category: product.category as any,
        badge: product.badge ? (product.badge === "Best Seller" ? "Best_Seller" : product.badge) as any : null,
        ratingAvg: product.ratingAvg,
        reviewsCount: product.reviewsCount,
        stock: product.stock,
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
