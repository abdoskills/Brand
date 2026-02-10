import Link from "next/link";

import { AdminProductsList } from "@/components/admin/AdminProductsList";
import { enforceAdminAccess } from "@/lib/admin";
import { getAdminProducts } from "@/lib/db/products";

export const dynamic = "force-dynamic";

interface AdminProductsPageProps {
  searchParams?: { archived?: string };
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  await enforceAdminAccess();
  const showArchived = searchParams?.archived === "1";
  const products = await getAdminProducts({ showArchived });

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Catalog</p>
          <h1 className="font-display text-3xl text-text">Products overview</h1>
          <p className="text-sm text-muted">Every edit auto-syncs with the live product page.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={showArchived ? "/admin/products" : "/admin/products?archived=1"}
            className="rounded-full border border-border px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-text transition hover:-translate-y-0.5 hover:border-border/60"
          >
            {showArchived ? "Show Active" : "Show Archived"}
          </Link>
          <Link
            href="/admin/products/new"
            className="rounded-full bg-accent px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5 hover:bg-accent-hover"
          >
            Add Product
          </Link>
        </div>
      </div>

      <AdminProductsList products={products} showArchived={showArchived} />
    </section>
  );
}
