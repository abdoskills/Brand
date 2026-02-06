import type { Product as CatalogProduct } from "@/types";

export type Product = CatalogProduct;

export const mockProducts: Product[] = [
  {
    id: "atelier-tee",
    slug: "atelier-tee",
    name: "Atelier Cotton Tee",
    description: "Heavyweight organic cotton tee with a soft matte finish and precision-bound collar.",
    shortDescription: "Architected cotton tee with atelier-grade finishing and a relaxed tailored drape.",
    price: 180,
    compareAt: 240,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80&sat=-10",
    ],
    category: "tees",
    badge: "New",
    ratingAvg: 4.9,
    reviewsCount: 128,
    stock: 18,
    createdAt: "2025-02-01T00:00:00.000Z",
    isNew: true,
    brand: "Atelier Line",
    sizes: ["XS", "S", "M", "L", "XL"],
    highlights: ["GOTS-certified cotton", "Bound collar", "Matte mercerized hand"],
    features: [
      "Made with long-staple organic cotton for a dense, luxe drape",
      "Bound neckline with tonal stay-stitching to prevent rolling",
      "Matte mercerized finish that resists pilling and fading",
      "Signature gold bartack at the side seam for a subtle accent",
      "Tailored shoulder with a relaxed waist for easy layering",
    ],
    sku: "FIT-ATELIER-TEE-001",
    inStock: true,
    materials: "100% organic cotton",
    care: "Dry clean or delicate wash, lay flat.",
  },
];

export function getProductBySlug(slug: string): Product | null {
  const normalized = decodeURIComponent(slug).toLowerCase();
  return mockProducts.find((product) => product.slug.toLowerCase() === normalized) ?? null;
}
