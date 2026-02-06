import type { Product } from "@/types";

export interface NotificationEntry {
  id: string;
  title: string;
  message: string;
  dateISO: string;
  productId: string;
}

const STORAGE_KEYS = {
  products: "fitin_products",
  subscribers: "fitin_subscribers",
  notifications: "fitin_notifications",
} as const;

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const FALLBACK_SIZES = ["XS", "S", "M", "L", "XL"];
const FALLBACK_FEATURES = [
  "Hand-finished seams",
  "Edition stamped interior label",
  "Complimentary atelier alterations",
];

const defaultProducts: Product[] = [
  {
    id: "atelier-blazer",
    slug: "atelier-blazer",
    name: "Atelier Wool Blazer",
    description: "Hand-finished Italian wool blazer with satin lining.",
    shortDescription: "Hand-finished Italian wool blazer with satin lining.",
    price: 1290,
    compareAt: 1490,
    currency: "USD",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80"],
    category: "jackets",
    badge: "New",
    ratingAvg: 4.9,
    reviewsCount: 142,
    stock: 6,
    inStock: true,
    createdAt: new Date().toISOString(),
    isNew: true,
    features: FALLBACK_FEATURES,
    sizes: FALLBACK_SIZES,
    materials: "Italian wool, satin lining",
    care: "Dry clean only.",
  },
  {
    id: "silk-midi-dress",
    slug: "silk-midi-dress",
    name: "Silk Midi Dress",
    description: "Bias-cut silk with hand-rolled hems and removable sash.",
    shortDescription: "Bias-cut silk midi dress with hand-rolled hems.",
    price: 980,
    compareAt: null,
    currency: "USD",
    images: ["https://images.unsplash.com/photo-1520962922320-2038eebab146?auto=format&fit=crop&w=1200&q=80"],
    category: "essentials",
    badge: "Limited",
    ratingAvg: 4.8,
    reviewsCount: 87,
    stock: 10,
    inStock: true,
    createdAt: new Date().toISOString(),
    isNew: true,
    features: FALLBACK_FEATURES,
    sizes: FALLBACK_SIZES,
    materials: "100% silk",
    care: "Dry clean only.",
  },
  {
    id: "cashmere-coat",
    slug: "cashmere-coat",
    name: "Cashmere Long Coat",
    description: "Double-faced cashmere with horn buttons and pick stitching.",
    shortDescription: "Double-faced cashmere coat with horn buttons.",
    price: 1850,
    compareAt: 2100,
    currency: "USD",
    images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80"],
    category: "outerwear",
    badge: "Hot",
    ratingAvg: 4.9,
    reviewsCount: 95,
    stock: 5,
    inStock: true,
    createdAt: new Date().toISOString(),
    isNew: true,
    features: FALLBACK_FEATURES,
    sizes: FALLBACK_SIZES,
    materials: "Double-faced cashmere",
    care: "Dry clean only.",
  },
  {
    id: "pleated-trouser",
    slug: "pleated-trouser",
    name: "Pleated Wool Trouser",
    description: "High-rise, single-pleat trouser in superfine wool.",
    shortDescription: "High-rise pleated wool trouser in superfine yarns.",
    price: 620,
    compareAt: 720,
    currency: "USD",
    images: ["https://images.unsplash.com/photo-1521572267363-8c9c9e1e3a59?auto=format&fit=crop&w=1200&q=80"],
    category: "pants",
    badge: "Trending",
    ratingAvg: 4.7,
    reviewsCount: 121,
    stock: 18,
    inStock: true,
    createdAt: new Date().toISOString(),
    isNew: true,
    features: FALLBACK_FEATURES,
    sizes: FALLBACK_SIZES,
    materials: "Superfine wool",
    care: "Dry clean only.",
  },
  {
    id: "atelier-heel",
    slug: "atelier-heel",
    name: "Atelier Heel 85",
    description: "Nappa leather slingback with sculpted heel.",
    shortDescription: "Nappa leather slingback with sculpted heel.",
    price: 790,
    compareAt: null,
    currency: "USD",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80"],
    category: "accessories",
    badge: "New",
    ratingAvg: 4.6,
    reviewsCount: 63,
    stock: 14,
    inStock: true,
    createdAt: new Date().toISOString(),
    isNew: true,
    features: FALLBACK_FEATURES,
    sizes: FALLBACK_SIZES,
    materials: "Nappa leather, leather sole",
    care: "Store in dust bag.",
  },
  {
    id: "sculpted-bag",
    slug: "sculpted-bag",
    name: "Sculpted Leather Bag",
    description: "Calfskin shoulder bag with brushed gold hardware.",
    shortDescription: "Calfskin shoulder bag with brushed gold hardware.",
    price: 1450,
    compareAt: null,
    currency: "USD",
    images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80"],
    category: "accessories",
    badge: "Limited",
    ratingAvg: 4.8,
    reviewsCount: 74,
    stock: 9,
    inStock: true,
    createdAt: new Date().toISOString(),
    isNew: true,
    features: FALLBACK_FEATURES,
    sizes: FALLBACK_SIZES,
    materials: "Calfskin, gold-plated hardware",
    care: "Store in dust bag, avoid sun.",
  },
];

const isBrowser = typeof window !== "undefined";

function readArray<T>(key: string, fallback: T[]): T[] {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as T[];
    return fallback;
  } catch (error) {
    console.warn("Failed to read localStorage", key, error);
    return fallback;
  }
}

function writeArray<T>(key: string, value: T[]) {
  if (!isBrowser) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function formatPrice(value: number) {
  return formatter.format(value);
}

export function getProducts(): Product[] {
  return readArray<Product>(STORAGE_KEYS.products, defaultProducts);
}

export function saveProducts(products: Product[]) {
  writeArray(STORAGE_KEYS.products, products);
}

export function ensureProducts(): Product[] {
  const existing = getProducts();
  if (!existing.length) {
    saveProducts(defaultProducts);
    return defaultProducts;
  }
  return existing;
}

export function addSubscriber(email: string): { added: boolean; alreadyExists: boolean } {
  const subscribers = readArray<string>(STORAGE_KEYS.subscribers, []);
  const alreadyExists = subscribers.includes(email.toLowerCase());
  if (alreadyExists) return { added: false, alreadyExists: true };
  const next = [...subscribers, email.toLowerCase()];
  writeArray(STORAGE_KEYS.subscribers, next);
  return { added: true, alreadyExists: false };
}

export function getNotifications(): NotificationEntry[] {
  return readArray<NotificationEntry>(STORAGE_KEYS.notifications, []);
}

export function announceNewDrop(product: Product) {
  const notifications = getNotifications();
  const hasCrypto = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function";
  const entry: NotificationEntry = {
    id: hasCrypto ? crypto.randomUUID() : `notif-${Date.now()}`,
    title: `New Drop: ${product.name}`,
    message: `We just released ${product.name}. Explore the details now.`,
    dateISO: new Date().toISOString(),
    productId: product.id,
  };
  const next = [entry, ...notifications].slice(0, 50);
  writeArray(STORAGE_KEYS.notifications, next);
  return entry;
}

export function createDemoProduct(): Product {
  const timestamp = Date.now();
  return {
    id: `demo-${timestamp}`,
    slug: `demo-${timestamp}`,
    name: `Studio Capsule ${new Date(timestamp).getFullYear()}-${String(timestamp).slice(-3)}`,
    description: "Limited capsule crafted for the next drop.",
    shortDescription: "Limited capsule crafted for the next drop.",
    price: 1120,
    compareAt: 1380,
    currency: "USD",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80"],
    category: "jackets",
    badge: "New",
    ratingAvg: 5,
    reviewsCount: 0,
    stock: 10,
    inStock: true,
    createdAt: new Date().toISOString(),
    isNew: true,
    features: FALLBACK_FEATURES,
    sizes: FALLBACK_SIZES,
    materials: "Italian wool blend",
    care: "Dry clean only.",
  };
}

export function simulateNewDrop(existing: Product[]): { products: Product[]; notification: NotificationEntry } {
  const demo = createDemoProduct();
  const nextProducts = [demo, ...existing];
  saveProducts(nextProducts);
  const notification = announceNewDrop(demo);
  return { products: nextProducts, notification };
}
