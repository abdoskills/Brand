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
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b3862a]">Catalog</p>
          <h1 className="font-[playfair] text-3xl text-neutral-900">Products overview</h1>
          <p className="text-sm text-neutral-600">Every edit auto-syncs with the live product page.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-[#c9a646] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5 hover:bg-[#b3862a]"
        >
          Add Product
        </Link>
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <div
            key={product.slug}
            className="flex flex-col gap-4 rounded-3xl border border-[#eadcb7] bg-white p-5 shadow-[0_18px_60px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(0,0,0,0.08)] sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">{product.category}</p>
              <h2 className="font-[playfair] text-2xl text-neutral-900">{product.name}</h2>
              <p className="text-sm text-neutral-600">/{product.slug}</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-700">
              <span className="font-semibold text-neutral-900">{currency.format(product.price)}</span>
              <span className="rounded-full border border-[#e7dcc1] px-3 py-1 text-xs uppercase tracking-[0.18em] text-neutral-500">
                Stock · {product.stock}
              </span>
              {product.badge ? (
                <span className="rounded-full bg-[#fdf3d3] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#b3862a]">
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
