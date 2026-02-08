import Link from "next/link";

import { getAllProducts } from "@/lib/db/products";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const dbEnabled = Boolean(process.env.DATABASE_URL);
  const [products, orderCount] = await Promise.all([
    getAllProducts(),
    dbEnabled
      ? prisma.order.count().catch((error) => {
          console.warn("Order count failed, defaulting to 0", error);
          return 0;
        })
      : Promise.resolve(0),
  ]);

  const statCards = [
    { label: "Active Products", value: products.length.toString(), hint: "Catalog live" },
    { label: "Orders Logged", value: orderCount.toString(), hint: dbEnabled ? "Includes test" : "DB offline" },
    { label: "Seed Product", value: "Atelier Tee", hint: "Always available" },
  ];

  return (
    <div className="rounded-3xl border border-border bg-surface/95 p-8 shadow-[0_30px_80px_rgba(30,107,133,0.08)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Admin Dashboard</p>
          <h1 className="font-display text-3xl text-text sm:text-4xl">Atelier control room</h1>
          <p className="text-sm text-muted">Add luxe products, drop test orders, and advance fulfillment — authentication is relaxed for preview.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          <span className="h-2 w-2 rounded-full bg-accent" />
          Preview Mode
        </span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-border bg-surface p-5 shadow-[0_16px_40px_rgba(30,107,133,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(30,107,133,0.14)]"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{card.label}</p>
            <p className="mt-2 font-display text-2xl text-text">{card.value}</p>
            <p className="text-xs font-semibold text-primary">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-background p-6 shadow-[0_20px_60px_rgba(30,107,133,0.1)]">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="font-display text-xl text-text">Product tools</h2>
              <p className="text-xs text-muted">Seed the catalog or adjust pricing.</p>
            </div>
            <Link
              href="/admin/products/new"
              className="rounded-full bg-accent px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5 hover:bg-accent-hover"
            >
              Add Product
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {products.slice(0, 3).map((product) => (
              <div key={product.slug} className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3 text-sm">
                <div>
                  <p className="font-semibold text-text">{product.name}</p>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted">Slug · {product.slug}</p>
                </div>
                <span className="text-xs font-semibold text-primary">{product.stock} in stock</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right">
            <Link href="/admin/products" className="text-xs font-semibold uppercase tracking-[0.18em] text-primary hover:text-accent">
              View catalog ↗
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-surface p-6 shadow-[0_20px_60px_rgba(30,107,133,0.08)]">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="font-display text-xl text-text">Orders workflow</h2>
              <p className="text-xs text-muted">Advance from Preparing → Shipping → Shipped.</p>
            </div>
            <Link
              href="/admin/orders"
              className="rounded-full border border-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(30,107,133,0.15)]"
            >
              Open board
            </Link>
          </div>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3">
              <span>1. Place a test order from any product page.</span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Prepare</span>
            </li>
            <li className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3">
              <span>2. Visit orders dashboard to advance status.</span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Ship</span>
            </li>
            <li className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3">
              <span>3. Confirm shipped — button disables automatically.</span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Deliver</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
