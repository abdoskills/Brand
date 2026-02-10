"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { Product } from "@/types";

type Props = {
  products: Product[];
  showArchived?: boolean;
};

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function AdminProductsList({ products, showArchived = false }: Props) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [items, setItems] = useState<Product[]>(products);

  useEffect(() => {
    setItems(products);
  }, [products]);

  async function handleToggleActive(productId: string, nextActive: boolean) {
    setDeletingId(productId);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextActive }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        const message = payload?.message || payload?.error || `Failed to update product (${res.status})`;
        throw new Error(message);
      }
      setItems((prev) => {
        if (showArchived) {
          return prev
            .map((item) => (item.id === productId ? { ...item, isActive: nextActive } : item))
            .filter((item) => (nextActive ? item.id !== productId : true));
        }
        return nextActive ? prev : prev.filter((item) => item.id !== productId);
      });
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update product";
      alert(message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="grid gap-4">
      {items.map((product) => (
        <div
          key={product.id}
          className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5 shadow-[0_18px_60px_rgba(15,20,24,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(15,20,24,0.12)] sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{product.category}</p>
            <h2 className="font-display text-2xl text-text">{product.name}</h2>
            <p className="text-sm text-muted">/{product.slug}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-text">
            <span className="font-semibold text-text">{currency.format(product.price)}</span>
            <span className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted">
              Stock · {product.stock}
            </span>
            {!product.isActive ? (
              <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-red-500">
                Archived
              </span>
            ) : null}
            {product.badge ? (
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {product.badge}
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => handleToggleActive(product.id, !product.isActive)}
              disabled={deletingId === product.id}
              className={
                product.isActive
                  ? "rounded-full border border-red-200 bg-red-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-600 transition hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  : "rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
              }
            >
              {deletingId === product.id
                ? product.isActive
                  ? "Archiving"
                  : "Restoring"
                : product.isActive
                  ? "Archive"
                  : "Restore"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
