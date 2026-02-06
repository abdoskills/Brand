import { dummyProducts } from "@/lib/dummyData";
import { getProductBySlug, mockProducts } from "@/lib/mockProducts";
import type { Order, Product } from "@/types";

function resolveBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

async function safeFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const base = resolveBaseUrl();
    const res = await fetch(`${base}${path}`, {
      cache: "no-store",
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });

    if (!res.ok) {
      return null;
    }

    return (await res.json()) as T;
  } catch (error) {
    console.warn("API fetch failed", error);
    return null;
  }
}

export async function fetchProducts(): Promise<Product[]> {
  const data = await safeFetch<{ products: Product[] }>("/api/products");
  if (!data || !Array.isArray(data.products) || data.products.length === 0) {
    return mockProducts;
  }
  return data.products;
}

export async function fetchProduct(id: string): Promise<Product | null> {
  const data = await safeFetch<{ product: Product }>(`/api/products/${id}`);
  if (!data) {
    const localProduct = getProductBySlug(id) ?? dummyProducts.find((product) => product.id === id);
    return localProduct ?? null;
  }
  return data.product;
}

export async function fetchTrending(): Promise<Product[]> {
  const products = await fetchProducts();
  return products.slice(0, 6);
}

export async function fetchOrders(scope: "my" | "all" = "my"): Promise<Order[]> {
  const path = scope === "all" ? "/api/orders" : "/api/orders/my";
  const data = await safeFetch<{ orders: Order[] }>(path, {
    credentials: "include",
  });
  if (!data) {
    return [];
  }
  return data.orders;
}
