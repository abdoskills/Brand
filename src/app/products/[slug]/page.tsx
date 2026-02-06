import Image from "next/image";
import Link from "next/link";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { PurchasePanel } from "@/components/product/PurchasePanel";
import { TestOrderButton } from "@/components/product/TestOrderButton";
import { ProductCard } from "@/components/ui/ProductCard";
import { findProductBySlugWithFallback, listProductsWithFallback } from "@/lib/productService";
import type { Product } from "@/types";

interface ProductPageProps {
  params: { slug: string };
}

export const dynamic = "force-dynamic";

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

function LuxuryNotFound({ suggestions }: { suggestions: Product[] }) {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-[#e7dcc1] bg-gradient-to-br from-[#fdfaf5] via-white to-[#f5e9cf] px-8 py-12 shadow-[0_28px_90px_rgba(0,0,0,0.08)] sm:px-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[#c9a646]/10 blur-3xl" />
          <div className="absolute -right-12 bottom-0 h-48 w-48 rounded-full bg-[#d4b46a]/10 blur-3xl" />
        </div>
        <div className="relative flex flex-col gap-4 text-center">
          <span className="mx-auto h-px w-14 bg-[#c9a646]/60" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b3862a]">Not Found</p>
          <h1 className="font-[playfair] text-3xl text-neutral-900 sm:text-4xl">This atelier piece is still in the vault.</h1>
          <p className="text-sm leading-7 text-neutral-600 sm:text-base">
            The requested product isn&apos;t available yet. Explore the featured drop below while we prepare the next release.
          </p>
          <div className="mt-2 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-full border border-[#c9a646] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6a1d] transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(201,166,70,0.25)]"
            >
              Return Home
            </Link>
            <Link
              href="/shop"
              className="rounded-full bg-[#c9a646] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5 hover:bg-[#b3862a] hover:shadow-[0_10px_30px_rgba(201,166,70,0.35)]"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </section>

      {suggestions.length ? (
        <section className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">You may also like</p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {suggestions.slice(0, 4).map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const [product, allProducts] = await Promise.all([
    findProductBySlugWithFallback(params.slug),
    listProductsWithFallback(),
  ]);
  const suggestions = allProducts.filter((item) => item.slug !== params.slug).slice(0, 4);

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="bg-white px-6 py-14 lg:px-10 lg:py-16">
          <div className="mx-auto max-w-6xl">
            <LuxuryNotFound suggestions={suggestions} />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const priceLabel = formatCurrency(product.price, product.currency);
  const compareLabel = product.compareAt ? formatCurrency(product.compareAt, product.currency) : null;

  return (
    <>
      <Navbar />
      <main className="bg-white text-neutral-900">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-12 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-[1.05fr,0.95fr]">
            <div className="space-y-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-[#e7dcc1] bg-[#fdfaf5] shadow-[0_24px_70px_rgba(201,166,70,0.14)]">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 48vw, 90vw"
                  className="object-cover"
                  priority
                />
              </div>
              {product.images.length > 1 ? (
                <div className="grid grid-cols-4 gap-3 sm:gap-4">
                  {product.images.slice(0, 4).map((image, index) => (
                    <div
                      key={image}
                      className="relative aspect-square overflow-hidden rounded-2xl border border-[#e7dcc1] bg-white"
                    >
                      <Image
                        src={image}
                        alt={`${product.name} detail ${index + 1}`}
                        fill
                        sizes="160px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                <span className="rounded-full bg-[#f3e8d2] px-3 py-1 text-[#8a6a1d]">Atelier Line</span>
                <span className="h-px w-10 bg-[#e7dcc1]" aria-hidden />
                <span className="text-neutral-600">{product.category}</span>
              </div>

              <div className="space-y-2">
                <h1 className="font-[playfair] text-3xl sm:text-4xl">{product.name}</h1>
                <p className="text-sm leading-7 text-neutral-600">{product.shortDescription}</p>
              </div>

              <div className="flex items-center gap-3">
                <p className="text-2xl font-semibold text-neutral-900">{priceLabel}</p>
                {compareLabel ? (
                  <span className="text-sm font-semibold text-neutral-400 line-through">{compareLabel}</span>
                ) : null}
                {product.badge ? (
                  <span className="rounded-full bg-[#c9a646]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6a1d]">
                    {product.badge}
                  </span>
                ) : null}
              </div>

              <PurchasePanel product={product} />
              <div className="rounded-3xl border border-[#eadcb7] bg-[#fdfaf5] p-5 shadow-[0_16px_40px_rgba(201,166,70,0.12)]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b3862a]">Studio Tooling</p>
                    <p className="font-[playfair] text-xl text-neutral-900">Place a test order</p>
                    <p className="text-sm text-neutral-600">Creates a single-item order so you can review the workflow inside the admin console.</p>
                  </div>
                  <TestOrderButton slug={product.slug} />
                </div>
              </div>

              <div className="space-y-4 rounded-3xl border border-[#e7dcc1] bg-white/95 p-6 shadow-[0_22px_70px_rgba(0,0,0,0.06)]">
                <div className="flex items-center justify-between border-b border-[#f0e6cf] pb-3">
                  <h2 className="font-[playfair] text-2xl text-neutral-900">Description</h2>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b3862a]">Edition 01</span>
                </div>
                <p className="text-sm leading-7 text-neutral-700">{product.description}</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-[#f2e6c7] bg-[#fdfaf5] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">Details</p>
                    <ul className="mt-2 space-y-2 text-sm text-neutral-700">
                      {product.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <span className="mt-1.5 h-2 w-2 rounded-full bg-[#c9a646]" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-[#f2e6c7] bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">Materials & Care</p>
                    <p className="mt-2 text-sm text-neutral-700">{product.materials ?? "Italian-milled textiles curated for a soft yet architectural drape."}</p>
                    <p className="mt-3 text-sm text-neutral-700 text-opacity-80">{product.care ?? "Dry clean only. Store flat away from direct light."}</p>
                  </div>
                  <div className="rounded-2xl border border-[#f2e6c7] bg-[#fdfaf5] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">Shipping & Returns</p>
                    <p className="mt-2 text-sm text-neutral-700">
                      Complimentary standard shipping over $200. Express options available. Returns accepted within 30 days in original condition.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="mt-12 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">You may also like</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {suggestions.slice(0, 4).map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
