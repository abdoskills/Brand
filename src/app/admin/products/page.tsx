import Link from "next/link";

import { enforceAdminAccess } from "@/lib/admin";
import { getAllProducts } from "@/lib/db/products";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await enforceAdminAccess();
  const products = await getAllProducts();

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Catalog</p>
          <h1 className="font-display text-3xl text-text">Products overview</h1>
          <p className="text-sm text-muted">Every edit auto-syncs with the live product page.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-accent px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5 hover:bg-accent-hover"
        >
          Add Product
        </Link>
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <div
            key={product.slug}
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
              {product.badge ? (
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  {product.badge}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
