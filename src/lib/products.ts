import type { Product as CatalogProduct } from "@/types";

import { slugify } from "@/lib/slug";

export type Product = CatalogProduct;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

type ApiProduct = Partial<CatalogProduct> & {
  id?: string;
  slug?: string;
  stock?: number;
  createdAt?: string;
};

const fallbackProducts: Product[] = [
  {
    id: "atelier-tee",
    slug: "atelier-tee",
    name: "Atelier Cotton Tee",
    category: "tees",
    price: 180,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=80&sat=-10",
    ],
    shortDescription: "Architected cotton tee with atelier-grade finishing and a relaxed tailored drape.",
    description: "Heavyweight organic cotton tee with a soft matte finish, bound neckline, and subtle atelier detailing.",
    features: [
      "GOTS-certified organic cotton",
      "Bound collar with tonal stay-stitch",
      "Matte mercerized hand feel",
      "Signature gold bartack at side seam",
      "Tailored shoulder, relaxed waist",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true,
    badge: "New",
    compareAt: 240,
    ratingAvg: 4.9,
    reviewsCount: 128,
    stock: 8,
    createdAt: new Date().toISOString(),
    materials: "100% organic cotton",
    care: "Dry clean or cold hand wash.",
  },
  {
    id: "sculpted-hoodie",
    slug: "sculpted-hoodie",
    name: "Sculpted Fleece Hoodie",
    category: "hoodies",
    price: 210,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80&sat=-5",
    ],
    shortDescription: "Structured fleece with dropped shoulders and clean hem.",
    description: "Engineered fleece with sculpted panels, dropped shoulders, and clean bonded hems for a refined street silhouette.",
    features: ["Structured fleece", "Dropped shoulders", "Clean bonded hem", "Hidden media pocket"],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true,
    badge: "Best Seller",
    compareAt: 240,
    ratingAvg: 4.8,
    reviewsCount: 212,
    stock: 14,
    createdAt: new Date().toISOString(),
    materials: "Structured fleece blend",
    care: "Machine wash cold, lay flat.",
  },
  {
    id: "linen-shirt",
    slug: "linen-shirt",
    name: "Pure Linen Shirt",
    category: "tops",
    price: 260,
    currency: "USD",
    images: ["https://images.unsplash.com/photo-1521572267363-8c9c9e1e3a59?auto=format&fit=crop&w=1200&q=80"],
    shortDescription: "Italian linen shirt with concealed placket and crisp collar.",
    description: "Italian-spun linen cut with a crisp collar, concealed placket, and minimal seams for a featherlight drape.",
    features: ["Italian linen", "Concealed placket", "Crisp collar", "Mother-of-pearl buttons"],
    sizes: ["S", "M", "L"],
    inStock: true,
    badge: "Trending",
    compareAt: null,
    ratingAvg: 4.7,
    reviewsCount: 84,
    stock: 10,
    createdAt: new Date().toISOString(),
    materials: "100% Italian linen",
    care: "Dry clean only.",
  },
  {
    id: "modal-tee",
    slug: "modal-tee",
    name: "Modal Signature Tee",
    category: "tees",
    price: 115,
    currency: "USD",
    images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80"],
    shortDescription: "Featherweight modal tee with smooth drape and minimal seams.",
    description: "Signature modal jersey with a fluid drape, laser-cut hems, and bonded neckline for zero bulk.",
    features: ["Featherweight modal", "Laser-cut hems", "Bonded neckline"],
    sizes: ["XS", "S", "M", "L"],
    inStock: true,
    badge: "New",
    compareAt: null,
    ratingAvg: 4.6,
    reviewsCount: 65,
    stock: 20,
    createdAt: new Date().toISOString(),
    materials: "Modal-spandex blend",
    care: "Machine wash cold, lay flat.",
  },
  {
    id: "drape-top",
    slug: "drape-top",
    name: "Draped Silk Top",
    category: "tops",
    price: 290,
    currency: "USD",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80"],
    shortDescription: "Fluid silk top cut on the bias with minimal seams.",
    description: "Bias-cut silk with fluid drape, French seams, and barely-there finishing for an atelier-level silhouette.",
    features: ["Bias cut", "French seams", "Fluid silk"],
    sizes: ["XS", "S", "M", "L"],
    inStock: true,
    badge: "Limited",
    compareAt: null,
    ratingAvg: 4.8,
    reviewsCount: 52,
    stock: 6,
    createdAt: new Date().toISOString(),
    materials: "100% silk",
    care: "Dry clean only.",
  },
  {
    id: "atelier-blazer",
    slug: "atelier-blazer",
    name: "Atelier Wool Blazer",
    category: "jackets",
    price: 1290,
    currency: "USD",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80"],
    shortDescription: "Hand-finished Italian wool blazer with satin lining.",
    description: "Hand-finished Italian wool blazer with satin lining, pick stitching, and sculpted lapels for a gallery-ready profile.",
    features: ["Italian wool", "Satin lining", "Pick stitching", "Sculpted lapels"],
    sizes: ["S", "M", "L"],
    inStock: true,
    badge: "New",
    compareAt: 1490,
    ratingAvg: 4.95,
    reviewsCount: 44,
    stock: 5,
    createdAt: new Date().toISOString(),
    materials: "Italian wool with satin lining",
    care: "Dry clean only.",
  },
];

const defaultFeatures = [
  "Signature atelier fabrication",
  "Clean finishing with minimal seams",
  "Limited seasonal release",
];

const defaultSizes = ["XS", "S", "M", "L", "XL"];

const fallbackImage = fallbackProducts[0]?.images?.[0] ?? "";

function coerceShortDescription(description?: string, fallback?: string) {
  if (fallback) return fallback;
  if (!description) return "";
  const sentence = description.split(".")[0]?.trim();
  return sentence ? `${sentence}.` : description;
}

function normalizeProduct(product: ApiProduct): Product | null {
  const name = product.name?.trim() || "Untitled Product";
  const id = product.id?.trim() || slugify(name) || "product";
  const slug = (product.slug?.trim() || slugify(name) || id).toLowerCase();
  const description = product.description?.trim() || "";
  const shortDescription = coerceShortDescription(description, product.shortDescription?.trim());
  const images = Array.isArray(product.images) && product.images.length ? product.images : fallbackImage ? [fallbackImage] : [];
  const features = Array.isArray(product.features) && product.features.length ? product.features : defaultFeatures;
  const sizes = Array.isArray(product.sizes) && product.sizes.length ? product.sizes : defaultSizes;
  const inStock = typeof product.inStock === "boolean" ? product.inStock : typeof product.stock === "number" ? product.stock > 0 : true;
  const createdAt = product.createdAt ?? new Date().toISOString();
  const stock = typeof product.stock === "number" ? product.stock : inStock ? 5 : 0;

  return {
    id,
    slug,
    name,
    category: product.category?.trim() || "tops",
    price: Number(product.price ?? 0),
    currency: product.currency?.trim() || "USD",
    images,
    shortDescription,
    description: description || shortDescription,
    features,
    sizes,
    inStock,
    badge: product.badge ?? null,
    compareAt: product.compareAt ?? null,
    brand: product.brand ?? null,
    ratingAvg: typeof product.ratingAvg === "number" ? product.ratingAvg : 0,
    reviewsCount: typeof product.reviewsCount === "number" ? product.reviewsCount : 0,
    createdAt,
    stock,
    materials: product.materials ?? null,
    care: product.care ?? null,
  };
}

function buildApiBase() {
  if (API_BASE) return API_BASE.replace(/\/$/, "");
  return ""; // relative to same origin
}

async function safeFetch<T>(path: string): Promise<T | null> {
  const base = buildApiBase();
  const url = `${base}${path}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[products] fetch failed", url, error);
    }
    return null;
  }
}

function coerceProducts(payload: unknown): Product[] | null {
  if (!payload) return null;
  if (Array.isArray(payload)) {
    const list = payload.map((item) => normalizeProduct(item as ApiProduct)).filter(Boolean) as Product[];
    return list.length ? list : null;
  }
  if (typeof payload === "object" && payload && "products" in payload) {
    const list = (payload as { products?: ApiProduct[] }).products ?? [];
    const normalized = list.map((item) => normalizeProduct(item)).filter(Boolean) as Product[];
    return normalized.length ? normalized : null;
  }
  return null;
}

function coerceProduct(payload: unknown): Product | null {
  if (!payload) return null;
  if (typeof payload === "object" && payload && "product" in payload) {
    const wrapped = (payload as { product?: ApiProduct }).product;
    return wrapped ? normalizeProduct(wrapped) : null;
  }
  if (typeof payload === "object") {
    return normalizeProduct(payload as ApiProduct);
  }
  return null;
}

export async function getAllProducts(): Promise<Product[]> {
  const apiData = await safeFetch<unknown>("/products");
  const normalized = coerceProducts(apiData);
  if (normalized?.length) return normalized;

  const apiFallback = await safeFetch<unknown>("/api/products");
  const normalizedFallback = coerceProducts(apiFallback);
  if (normalizedFallback?.length) return normalizedFallback;

  return fallbackProducts;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const normalized = decodeURIComponent(slug).toLowerCase();
  const direct = await safeFetch<unknown>(`/products/${encodeURIComponent(normalized)}`);
  const directProduct = coerceProduct(direct);
  if (directProduct) return directProduct;

  const apiDirect = await safeFetch<unknown>(`/api/products/${encodeURIComponent(normalized)}`);
  const apiDirectProduct = coerceProduct(apiDirect);
  if (apiDirectProduct) return apiDirectProduct;

  const all = await getAllProducts();
  const match = all.find((item) => {
    const slugMatch = item.slug?.toLowerCase() === normalized;
    const idMatch = item.id?.toLowerCase() === normalized;
    const nameMatch = slugify(item.name) === normalized;
    return slugMatch || idMatch || nameMatch;
  });
  if (match) return match;

  const local = fallbackProducts.find((item) => item.slug.toLowerCase() === normalized || item.id.toLowerCase() === normalized);
  if (local) return local;

  return null;
}
