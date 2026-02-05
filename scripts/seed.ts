import "dotenv/config";

import bcrypt from "bcryptjs";

import { connectMongo } from "../src/lib/db";
import { dummyProducts } from "../src/lib/dummyData";
import { Product } from "../src/models/Product";
import { User } from "../src/models/User";

async function main() {
  await connectMongo();

  const adminIdentifier = process.env.SEED_ADMIN ?? "admin@streetwear.io";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "admin123";

  const existingAdmin = await User.findOne({ emailOrPhone: adminIdentifier });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await User.create({
      name: "Streetwear Admin",
      emailOrPhone: adminIdentifier,
      passwordHash,
      role: "admin",
    });
    console.log(`Created admin account ${adminIdentifier}`);
  } else {
    console.log(`Admin account ${adminIdentifier} already exists`);
  }

  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.insertMany(
      dummyProducts.map((product) => {
        const { id: _unusedId, createdAt: _unusedCreatedAt, ...rest } = product;
        void _unusedId;
        void _unusedCreatedAt;
        return {
          ...rest,
          compareAt: rest.compareAt ?? undefined,
        };
      })
    );
    console.log(`Inserted ${dummyProducts.length} starter products`);
  } else {
    console.log("Products already present, skipping seed");
  }
}

main()
  .then(() => {
    console.log("Seed completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  });
