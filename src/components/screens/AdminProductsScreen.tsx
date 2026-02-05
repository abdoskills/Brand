"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { RequireAuth } from "@/components/features/auth/RequireAuth";
import { MobileShell } from "@/components/layout/MobileShell";
import { BottomNav } from "@/components/ui/BottomNav";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { useCart } from "@/components/providers/CartProvider";
import { fetchProducts } from "@/lib/apiClient";
import { PRODUCT_BADGES, PRODUCT_CATEGORIES } from "@/lib/constants";
import type { Product } from "@/types";

interface ProductFormState {
  id?: string;
  name: string;
  description: string;
  price: string;
  compareAt: string;
  images: string;
  category: Product["category"];
  badge: Product["badge"] | "";
  ratingAvg: string;
  reviewsCount: string;
  stock: string;
}

const emptyForm: ProductFormState = {
  name: "",
  description: "",
  price: "",
  compareAt: "",
  images: "",
  category: "hoodies",
  badge: "",
  ratingAvg: "4.5",
  reviewsCount: "25",
  stock: "10",
};

function serializeForm(form: ProductFormState) {
  const images = form.images
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    name: form.name,
    description: form.description,
    price: Number(form.price),
    compareAt: form.compareAt ? Number(form.compareAt) : undefined,
    images,
    category: form.category,
    badge: form.badge || undefined,
    ratingAvg: form.ratingAvg ? Number(form.ratingAvg) : 0,
    reviewsCount: form.reviewsCount ? Number(form.reviewsCount) : 0,
    stock: form.stock ? Number(form.stock) : 0,
  } satisfies Partial<Product> & {
    name: string;
    description: string;
    price: number;
    images: string[];
    category: Product["category"];
    ratingAvg: number;
    reviewsCount: number;
    stock: number;
  };
}

export function AdminProductsScreen() {
  const router = useRouter();
  const { count } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [createForm, setCreateForm] = useState<ProductFormState>(emptyForm);
  const [editForm, setEditForm] = useState<ProductFormState | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProducts(withSpinner = false) {
    if (withSpinner) {
      setLoading(true);
    }
    try {
      const data = await fetchProducts();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    const payload = serializeForm(createForm);
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMessage(data.message ?? "Failed to create product");
      return;
    }
    setCreateForm(emptyForm);
    setMessage("Product created");
    await loadProducts(true);
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editForm?.id) {
      return;
    }
    setMessage(null);
    const payload = serializeForm(editForm);
    const res = await fetch(`/api/products/${editForm.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMessage(data.message ?? "Failed to update product");
      return;
    }
    setMessage("Product updated");
    setEditForm(null);
    await loadProducts(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) {
      return;
    }
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMessage(data.message ?? "Failed to delete product");
      return;
    }
    setMessage("Product deleted");
    await loadProducts(true);
  };

  const startEditing = (product: Product) => {
    setEditForm({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      compareAt: product.compareAt ? product.compareAt.toString() : "",
      images: product.images.join("\n"),
      category: product.category,
      badge: product.badge ?? "",
      ratingAvg: product.ratingAvg.toString(),
      reviewsCount: product.reviewsCount.toString(),
      stock: product.stock.toString(),
    });
  };

  return (
    <RequireAuth requireAdmin>
      <MobileShell>
        <TopAppBar cartCount={count} onCartClick={() => router.push("/cart")} />
        <main className="flex-1 px-4 pb-24">
          <section className="py-6">
            <h1 className="font-display text-3xl font-black uppercase italic tracking-tight text-white">
              Admin · Products
            </h1>
            <p className="mt-2 text-xs uppercase tracking-widest text-neutral-500">
              Manage catalog, pricing, and availability.
            </p>
          </section>
          <section className="mb-10 rounded-sm border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="mb-4 font-display text-xl font-black uppercase italic tracking-tight text-white">
              Add Product
            </h2>
            <form onSubmit={handleCreate} className="grid gap-4">
              <input
                placeholder="Name"
                value={createForm.name}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, name: event.target.value }))}
                className="h-12 rounded-sm border border-neutral-700 bg-transparent px-3 text-sm text-white"
                required
              />
              <textarea
                placeholder="Description"
                value={createForm.description}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, description: event.target.value }))}
                className="min-h-[96px] rounded-sm border border-neutral-700 bg-transparent px-3 py-2 text-sm text-white"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="Price"
                  type="number"
                  step="0.01"
                  value={createForm.price}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, price: event.target.value }))}
                  className="h-12 rounded-sm border border-neutral-700 bg-transparent px-3 text-sm text-white"
                  required
                />
                <input
                  placeholder="Compare at"
                  type="number"
                  step="0.01"
                  value={createForm.compareAt}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, compareAt: event.target.value }))}
                  className="h-12 rounded-sm border border-neutral-700 bg-transparent px-3 text-sm text-white"
                />
              </div>
              <textarea
                placeholder="Image URLs (one per line)"
                value={createForm.images}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, images: event.target.value }))}
                className="min-h-[96px] rounded-sm border border-neutral-700 bg-transparent px-3 py-2 text-sm text-white"
              />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <select
                  value={createForm.category}
                  onChange={(event) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      category: event.target.value as Product["category"],
                    }))
                  }
                  className="h-12 rounded-sm border border-neutral-700 bg-transparent px-3 text-white"
                >
                  {PRODUCT_CATEGORIES.map((category) => (
                    <option key={category} value={category} className="bg-neutral-900">
                      {category}
                    </option>
                  ))}
                </select>
                <select
                  value={createForm.badge || ""}
                  onChange={(event) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      badge: (event.target.value as Product["badge"]) || null,
                    }))
                  }
                  className="h-12 rounded-sm border border-neutral-700 bg-transparent px-3 text-white"
                >
                  <option value="" className="bg-neutral-900">
                    No badge
                  </option>
                  {PRODUCT_BADGES.map((badge) => (
                    <option key={badge} value={badge} className="bg-neutral-900">
                      {badge}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <input
                  placeholder="Rating"
                  type="number"
                  step="0.1"
                  value={createForm.ratingAvg}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, ratingAvg: event.target.value }))}
                  className="h-12 rounded-sm border border-neutral-700 bg-transparent px-3 text-sm text-white"
                />
                <input
                  placeholder="Reviews"
                  type="number"
                  value={createForm.reviewsCount}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, reviewsCount: event.target.value }))}
                  className="h-12 rounded-sm border border-neutral-700 bg-transparent px-3 text-sm text-white"
                />
                <input
                  placeholder="Stock"
                  type="number"
                  value={createForm.stock}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, stock: event.target.value }))}
                  className="h-12 rounded-sm border border-neutral-700 bg-transparent px-3 text-sm text-white"
                />
              </div>
              <button
                type="submit"
                className="mt-2 w-full rounded-sm bg-street-red py-3 text-sm font-bold uppercase tracking-widest text-white hover:bg-red-700"
              >
                Create Product
              </button>
            </form>
          </section>

          <section className="pb-12">
            <h2 className="mb-4 font-display text-xl font-black uppercase italic tracking-tight text-white">
              Catalog
            </h2>
            {message ? (
              <div className="mb-4 rounded-sm border border-street-red bg-street-red/20 p-3 text-xs font-bold uppercase tracking-widest text-street-red">
                {message}
              </div>
            ) : null}
            {loading ? (
              <div className="rounded-sm border border-neutral-800 bg-neutral-900 p-6 text-center text-sm text-neutral-400">
                Loading products...
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {products.map((product) => (
                  <div key={product.id} className="rounded-sm border border-neutral-800 bg-neutral-900 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-display text-lg font-bold uppercase tracking-tight text-white">
                          {product.name}
                        </p>
                        <p className="text-xs uppercase tracking-widest text-neutral-500">
                          {product.category} · Stock {product.stock}
                        </p>
                      </div>
                      <div className="flex gap-3 text-xs font-bold uppercase tracking-widest">
                        <button
                          type="button"
                          onClick={() => startEditing(product)}
                          className="text-street-red hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id)}
                          className="text-neutral-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-neutral-300">{product.description}</p>
                    <p className="mt-2 text-base font-bold text-white">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {editForm ? (
            <section className="mb-12 rounded-sm border border-neutral-800 bg-neutral-900 p-6">
              <h2 className="mb-4 font-display text-xl font-black uppercase italic tracking-tight text-white">
                Edit Product
              </h2>
              <form onSubmit={handleSave} className="grid gap-4">
                <input
                  placeholder="Name"
                  value={editForm.name}
                  onChange={(event) => setEditForm((prev) => prev && { ...prev, name: event.target.value })}
                  className="h-12 rounded-sm border border-neutral-700 bg-transparent px-3 text-sm text-white"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={editForm.description}
                  onChange={(event) => setEditForm((prev) => prev && { ...prev, description: event.target.value })}
                  className="min-h-[96px] rounded-sm border border-neutral-700 bg-transparent px-3 py-2 text-sm text-white"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    placeholder="Price"
                    type="number"
                    step="0.01"
                    value={editForm.price}
                    onChange={(event) => setEditForm((prev) => prev && { ...prev, price: event.target.value })}
                    className="h-12 rounded-sm border border-neutral-700 bg-transparent px-3 text-sm text-white"
                    required
                  />
                  <input
                    placeholder="Compare at"
                    type="number"
                    step="0.01"
                    value={editForm.compareAt}
                    onChange={(event) => setEditForm((prev) => prev && { ...prev, compareAt: event.target.value })}
                    className="h-12 rounded-sm border border-neutral-700 bg-transparent px-3 text-sm text-white"
                  />
                </div>
                <textarea
                  placeholder="Image URLs"
                  value={editForm.images}
                  onChange={(event) => setEditForm((prev) => prev && { ...prev, images: event.target.value })}
                  className="min-h-[96px] rounded-sm border border-neutral-700 bg-transparent px-3 py-2 text-sm text-white"
                />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <select
                    value={editForm.category}
                    onChange={(event) =>
                      setEditForm((prev) =>
                        prev && {
                          ...prev,
                          category: event.target.value as Product["category"],
                        }
                      )
                    }
                    className="h-12 rounded-sm border border-neutral-700 bg-transparent px-3 text-white"
                  >
                    {PRODUCT_CATEGORIES.map((category) => (
                      <option key={category} value={category} className="bg-neutral-900">
                        {category}
                      </option>
                    ))}
                  </select>
                  <select
                    value={editForm.badge || ""}
                    onChange={(event) =>
                      setEditForm((prev) =>
                        prev && {
                          ...prev,
                          badge: (event.target.value as Product["badge"]) || null,
                        }
                      )
                    }
                    className="h-12 rounded-sm border border-neutral-700 bg-transparent px-3 text-white"
                  >
                    <option value="" className="bg-neutral-900">
                      No badge
                    </option>
                    {PRODUCT_BADGES.map((badge) => (
                      <option key={badge} value={badge} className="bg-neutral-900">
                        {badge}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <input
                    placeholder="Rating"
                    type="number"
                    step="0.1"
                    value={editForm.ratingAvg}
                    onChange={(event) => setEditForm((prev) => prev && { ...prev, ratingAvg: event.target.value })}
                    className="h-12 rounded-sm border border-neutral-700 bg-transparent px-3 text-sm text-white"
                  />
                  <input
                    placeholder="Reviews"
                    type="number"
                    value={editForm.reviewsCount}
                    onChange={(event) => setEditForm((prev) => prev && { ...prev, reviewsCount: event.target.value })}
                    className="h-12 rounded-sm border border-neutral-700 bg-transparent px-3 text-sm text-white"
                  />
                  <input
                    placeholder="Stock"
                    type="number"
                    value={editForm.stock}
                    onChange={(event) => setEditForm((prev) => prev && { ...prev, stock: event.target.value })}
                    className="h-12 rounded-sm border border-neutral-700 bg-transparent px-3 text-sm text-white"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 rounded-sm bg-street-red py-3 text-sm font-bold uppercase tracking-widest text-white hover:bg-red-700"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditForm(null)}
                    className="flex-1 rounded-sm border border-neutral-700 py-3 text-sm font-bold uppercase tracking-widest text-neutral-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          ) : null}
        </main>
        <BottomNav />
        <div className="h-10 bg-background-dark" />
      </MobileShell>
    </RequireAuth>
  );
}
