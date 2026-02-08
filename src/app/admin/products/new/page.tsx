import Link from "next/link";

import { enforceAdminAccess } from "@/lib/admin";
import { NewProductForm } from "@/components/admin/NewProductForm";
import { createProductAction } from "@/app/admin/products/new/actions";

export default async function AdminNewProductPage() {
  await enforceAdminAccess();
  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b3862a]">Launch pad</p>
          <h1 className="font-[playfair] text-3xl text-neutral-900">New product brief</h1>
          <p className="text-sm text-neutral-600">Draft the story once. We sync it everywhere else.</p>
        </div>
        <Link
          href="/admin/products"
          className="rounded-full border border-[#eadcb7] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-700 transition hover:-translate-y-0.5"
        >
          Back to catalog
        </Link>
      </div>
      <NewProductForm onCreate={createProductAction} />
    </section>
  );
}
