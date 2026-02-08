import type { Product } from "@/types";

export const dummyProducts: Product[] = [
  {
    id: "atelier-tee",
    slug: "atelier-tee",
    name: "Atelier Tee",
    shortDescription: "A sculpted cotton tee with atelier-grade finishing and quiet structure.",
    description:
      "Architected from brushed cotton jersey with a soft matte finish, the Atelier Tee balances a tailored shoulder with a relaxed drape. Subtle gold bartacking and hand-finishing keep the silhouette refined.",
    price: 1450,
    compareAt: null,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=80&sat=-10",
    ],
    category: "tops",
    badge: "New",
    isActive: true,
    isFeatured: true,
    collectionTag: "atelier",
    ratingAvg: 4.9,
    reviewsCount: 18,
    stock: 8,
    inStock: true,
    features: [
      "GOTS-certified brushed cotton",
      "Bound neckline with tonal stay-stitch",
      "Signature gold bartack at side seam",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    materials: "100% brushed cotton",
    care: "Dry clean or cold hand wash.",
    createdAt: new Date().toISOString(),
  },
];
