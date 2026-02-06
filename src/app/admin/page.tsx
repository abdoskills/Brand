import Link from "next/link";

import { listProductsWithFallback } from "@/lib/productService";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const dbEnabled = Boolean(process.env.DATABASE_URL);
  const [products, orderCount] = await Promise.all([
    listProductsWithFallback(),
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
    <div className="rounded-3xl border border-[#e7dcc1] bg-white/90 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b3862a]">Admin Dashboard</p>
          <h1 className="font-[playfair] text-3xl text-neutral-900 sm:text-4xl">Atelier control room</h1>
          <p className="text-sm text-neutral-600">Add luxe products, drop test orders, and advance fulfillment — authentication is relaxed for preview.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-[#e7dcc1] bg-[#fdfaf5] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Preview Mode
        </span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-[#e7dcc1] bg-white p-5 shadow-[0_16px_40px_rgba(201,166,70,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(201,166,70,0.18)]"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">{card.label}</p>
            <p className="mt-2 font-[playfair] text-2xl text-neutral-900">{card.value}</p>
            <p className="text-xs font-semibold text-[#8a6a1d]">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-[#e7dcc1] bg-[#fdfaf5] p-6 shadow-[0_20px_60px_rgba(201,166,70,0.12)]">
          <div className="flex items-center justify-between border-b border-[#eadcb7] pb-3">
            <div>
              <h2 className="font-[playfair] text-xl text-neutral-900">Product tools</h2>
              <p className="text-xs text-neutral-500">Seed the catalog or adjust pricing.</p>
            </div>
            <Link
              href="/admin/products/new"
              className="rounded-full bg-[#c9a646] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5 hover:bg-[#b3862a]"
            >
              Add Product
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {products.slice(0, 3).map((product) => (
              <div key={product.slug} className="flex items-center justify-between rounded-2xl border border-white/60 bg-white px-4 py-3 text-sm">
                <div>
                  <p className="font-semibold text-neutral-900">{product.name}</p>
                  <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">Slug · {product.slug}</p>
                </div>
                <span className="text-xs font-semibold text-[#c9a646]">{product.stock} in stock</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right">
            <Link href="/admin/products" className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6a1d] hover:text-[#c9a646]">
              View catalog ↗
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-[#e7dcc1] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between border-b border-[#eadcb7] pb-3">
            <div>
              <h2 className="font-[playfair] text-xl text-neutral-900">Orders workflow</h2>
              <p className="text-xs text-neutral-500">Advance from Preparing → Shipping → Shipped.</p>
            </div>
            <Link
              href="/admin/orders"
              className="rounded-full border border-[#c9a646] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a6a1d] transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(201,166,70,0.15)]"
            >
              Open board
            </Link>
          </div>
          <ul className="mt-4 space-y-3 text-sm text-neutral-700">
            <li className="flex items-center justify-between rounded-2xl border border-[#f1e6cb] bg-[#fdfaf5] px-4 py-3">
              <span>1. Place a test order from any product page.</span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9a646]">Prepare</span>
            </li>
            <li className="flex items-center justify-between rounded-2xl border border-[#f1e6cb] bg-white px-4 py-3">
              <span>2. Visit orders dashboard to advance status.</span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9a646]">Ship</span>
            </li>
            <li className="flex items-center justify-between rounded-2xl border border-[#f1e6cb] bg-[#fdfaf5] px-4 py-3">
              <span>3. Confirm shipped — button disables automatically.</span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9a646]">Deliver</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
