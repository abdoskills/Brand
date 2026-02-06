"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { slugify } from "@/lib/slug";

const CATEGORY_OPTIONS = [
  "tops",
  "tees",
  "hoodies",
  "outerwear",
  "bottoms",
  "pants",
  "jackets",
  "essentials",
  "accessories",
  "headwear",
];

const BADGE_OPTIONS = ["New", "Hot", "Limited", "Trending", "Best Seller"] as const;

type BadgeOption = (typeof BADGE_OPTIONS)[number] | "";

type FormState = {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  badge: BadgeOption;
  price: string;
  compareAt: string;
  stock: string;
  features: string;
  images: string;
  materials: string;
  care: string;
};

const INITIAL_STATE: FormState = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  category: "tops",
  badge: "",
  price: "",
  compareAt: "",
  stock: "20",
  features: "Hand-cut panels\nOrganic cotton",
  images: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
  materials: "Italian brushed cotton",
  care: "Dry clean recommended",
};

export function NewProductForm() {
  const router = useRouter();
  const [formValues, setFormValues] = useState<FormState>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolvedSlug = useMemo(() => {
    return slugify(formValues.slug || formValues.name || "signature-piece");
  }, [formValues.slug, formValues.name]);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }

  function parseList(value: string) {
    return value
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = {
      name: formValues.name.trim(),
      slug: resolvedSlug,
      shortDescription: formValues.shortDescription.trim() || formValues.description.trim(),
      description: formValues.description.trim(),
      category: formValues.category,
      badge: formValues.badge || null,
      price: Number(formValues.price),
      compareAt: formValues.compareAt ? Number(formValues.compareAt) : null,
      stock: Number(formValues.stock || 0),
      features: parseList(formValues.features),
      images: parseList(formValues.images),
      materials: formValues.materials.trim() || null,
      care: formValues.care.trim() || null,
      currency: "USD",
      sizes: ["S", "M", "L", "XL"],
    };

    if (!payload.name || !payload.description || Number.isNaN(payload.price)) {
      setError("Name, description, and price are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response.json().catch(() => ({ message: "Failed to create product" }));
        setError(message.message ?? "Failed to create product");
        setIsSubmitting(false);
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch (submissionError) {
      console.error(submissionError);
      setError("Unexpected error while saving product.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="rounded-3xl border border-[#eadcb7] bg-white p-6 shadow-[0_25px_70px_rgba(0,0,0,0.06)]">
        <div className="mb-6 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b3862a]">Story</p>
          <h2 className="font-[playfair] text-2xl text-neutral-900">Describe the piece</h2>
          <p className="text-sm text-neutral-600">Clients see this copy above the fold. Lead with feeling.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-medium text-neutral-700">
            Name
            <input
              name="name"
              value={formValues.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-[#f3ead5] bg-[#fffdf7] px-4 py-3 text-base text-neutral-900 focus:border-[#c9a646] focus:outline-none"
              placeholder="Atelier Field Jacket"
            />
          </label>
          <label className="text-sm font-medium text-neutral-700">
            Slug
            <input
              name="slug"
              value={formValues.slug}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-[#f3ead5] bg-[#fefbf2] px-4 py-3 text-base text-neutral-900 focus:border-[#c9a646] focus:outline-none"
              placeholder="atelier-field-jacket"
            />
            <span className="mt-1 block text-xs uppercase tracking-[0.2em] text-neutral-400">/{resolvedSlug}</span>
          </label>
          <label className="md:col-span-2 text-sm font-medium text-neutral-700">
            Short description
            <textarea
              name="shortDescription"
              value={formValues.shortDescription}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-[#f3ead5] bg-[#fffdf7] px-4 py-3 text-base text-neutral-900 focus:border-[#c9a646] focus:outline-none"
              rows={2}
              placeholder="Architectural tailoring for modern travel."
            />
          </label>
          <label className="md:col-span-2 text-sm font-medium text-neutral-700">
            Full description
            <textarea
              name="description"
              value={formValues.description}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-[#f3ead5] bg-[#fefbf2] px-4 py-3 text-base text-neutral-900 focus:border-[#c9a646] focus:outline-none"
              rows={5}
              placeholder="Enter the full story, fabrication details, and styling notes."
            />
          </label>
        </div>
      </div>

      <div className="rounded-3xl border border-[#eadcb7] bg-white p-6 shadow-[0_25px_70px_rgba(0,0,0,0.06)]">
        <div className="mb-6 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b3862a]">Merchandising</p>
          <h2 className="font-[playfair] text-2xl text-neutral-900">Positioning</h2>
          <p className="text-sm text-neutral-600">Price, availability, and signals for the team.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-medium text-neutral-700">
            Category
            <select
              name="category"
              value={formValues.category}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-[#f3ead5] bg-[#fffdf7] px-4 py-3 text-base text-neutral-900 focus:border-[#c9a646] focus:outline-none"
            >
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-neutral-700">
            Badge
            <select
              name="badge"
              value={formValues.badge}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-[#f3ead5] bg-[#fffdf7] px-4 py-3 text-base text-neutral-900 focus:border-[#c9a646] focus:outline-none"
            >
              <option value="">None</option>
              {BADGE_OPTIONS.map((badge) => (
                <option key={badge} value={badge}>
                  {badge}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-neutral-700">
            Price (USD)
            <input
              type="number"
              step="0.01"
              name="price"
              value={formValues.price}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-[#f3ead5] bg-[#fffdf7] px-4 py-3 text-base text-neutral-900 focus:border-[#c9a646] focus:outline-none"
              placeholder="420"
            />
          </label>
          <label className="text-sm font-medium text-neutral-700">
            Compare-at price
            <input
              type="number"
              step="0.01"
              name="compareAt"
              value={formValues.compareAt}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-[#f3ead5] bg-[#fffdf7] px-4 py-3 text-base text-neutral-900 focus:border-[#c9a646] focus:outline-none"
              placeholder="520"
            />
          </label>
          <label className="text-sm font-medium text-neutral-700">
            On-hand units
            <input
              type="number"
              name="stock"
              value={formValues.stock}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-[#f3ead5] bg-[#fffdf7] px-4 py-3 text-base text-neutral-900 focus:border-[#c9a646] focus:outline-none"
              placeholder="24"
            />
          </label>
        </div>
      </div>

      <div className="rounded-3xl border border-[#eadcb7] bg-white p-6 shadow-[0_25px_70px_rgba(0,0,0,0.06)]">
        <div className="mb-6 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b3862a]">Details</p>
          <h2 className="font-[playfair] text-2xl text-neutral-900">Textures & references</h2>
          <p className="text-sm text-neutral-600">Tell fulfillment how to speak about the garment.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-medium text-neutral-700">
            Materials & fabrication
            <textarea
              name="materials"
              value={formValues.materials}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-[#f3ead5] bg-[#fffdf7] px-4 py-3 text-base text-neutral-900 focus:border-[#c9a646] focus:outline-none"
              rows={2}
            />
          </label>
          <label className="text-sm font-medium text-neutral-700">
            Care instructions
            <textarea
              name="care"
              value={formValues.care}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-[#f3ead5] bg-[#fffdf7] px-4 py-3 text-base text-neutral-900 focus:border-[#c9a646] focus:outline-none"
              rows={2}
            />
          </label>
          <label className="md:col-span-2 text-sm font-medium text-neutral-700">
            Features (new line or comma separated)
            <textarea
              name="features"
              value={formValues.features}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-[#f3ead5] bg-[#fffdf7] px-4 py-3 text-base text-neutral-900 focus:border-[#c9a646] focus:outline-none"
              rows={3}
            />
          </label>
          <label className="md:col-span-2 text-sm font-medium text-neutral-700">
            Image URLs
            <textarea
              name="images"
              value={formValues.images}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-[#f3ead5] bg-[#fffdf7] px-4 py-3 text-base text-neutral-900 focus:border-[#c9a646] focus:outline-none"
              rows={3}
              placeholder="One URL per line"
            />
          </label>
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-[#c9a646] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5 hover:bg-[#b3862a] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Saving" : "Save product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-full border border-[#eadcb7] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-700 transition hover:-translate-y-0.5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
