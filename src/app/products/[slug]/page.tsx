import Image from "next/image";
import Link from "next/link";

import { PurchasePanel } from "@/components/product/PurchasePanel";
import { TestOrderButton } from "@/components/product/TestOrderButton";
import { ProductCard } from "@/components/ui/ProductCard";
import { getAllProducts, getProductBySlug } from "@/lib/db/products";
import { slugify } from "@/lib/slug";
import { addToCartAction, createTestOrderAction, startBuyNowAction } from "@/app/products/[slug]/actions";
import type { Product } from "@/types";

interface ProductPageProps {
  params: Promise<{ slug?: string | string[] }>;
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
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-background via-surface to-background px-8 py-12 shadow-[0_28px_90px_rgba(30,107,133,0.08)] sm:px-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-20 -top-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -right-12 bottom-0 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
        </div>
        <div className="relative flex flex-col gap-4 text-center">
          <span className="mx-auto h-px w-14 bg-accent/60" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">Not Found</p>
          <h1 className="font-display text-3xl text-text sm:text-4xl">This atelier piece is still in the vault.</h1>
          <p className="text-sm leading-7 text-muted sm:text-base">
            The requested product isn&apos;t available yet. Explore the featured drop below while we prepare the next release.
          </p>
          <div className="mt-2 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-full border border-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(30,107,133,0.2)]"
            >
              Return Home
            </Link>
            <Link
              href="/shop"
              className="rounded-full bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)]"
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
  const resolvedParams = await params;
  const rawSlug =
    typeof resolvedParams?.slug === "string"
      ? resolvedParams.slug
      : Array.isArray(resolvedParams?.slug)
        ? resolvedParams.slug[0]
        : "";
  const normalizedSlug = slugify(rawSlug);
  const [directProduct, allProducts] = await Promise.all([
    getProductBySlug(rawSlug),
    getAllProducts(),
  ]);
  const product =
    directProduct ??
    allProducts.find((item) => {
      const slugMatch = item.slug?.toLowerCase() === normalizedSlug;
      const idMatch = item.id?.toLowerCase() === normalizedSlug;
      const nameMatch = slugify(item.name) === normalizedSlug;
      return slugMatch || idMatch || nameMatch;
    }) ??
    null;
  const suggestions = allProducts.filter((item) => item.slug !== normalizedSlug).slice(0, 4);

  if (!product) {
    return (
      <>
        <main className="bg-background px-6 py-14 lg:px-10 lg:py-16">
          <div className="mx-auto max-w-6xl">
            <LuxuryNotFound suggestions={suggestions} />
          </div>
        </main>
      </>
    );
  }

  const priceLabel = formatCurrency(product.price, product.currency);
  const compareLabel = product.compareAt ? formatCurrency(product.compareAt, product.currency) : null;

  return (
    <>
      <main className="bg-background text-text">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-12 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-[1.05fr,0.95fr]">
            <div className="space-y-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_24px_70px_rgba(30,107,133,0.12)]">
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
                      className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-surface"
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
              <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">Atelier Line</span>
                <span className="h-px w-10 bg-border" aria-hidden />
                <span className="text-muted">{product.category}</span>
              </div>

              <div className="space-y-2">
                <h1 className="font-display text-3xl sm:text-4xl">{product.name}</h1>
                <p className="text-sm leading-7 text-muted">{product.shortDescription}</p>
              </div>

              <div className="flex items-center gap-3">
                <p className="text-2xl font-semibold text-text">{priceLabel}</p>
                {compareLabel ? (
                  <span className="text-sm font-semibold text-muted line-through">{compareLabel}</span>
                ) : null}
                {product.badge ? (
                  <span className="rounded-full bg-accent/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                    {product.badge}
                  </span>
                ) : null}
              </div>

                <PurchasePanel
                  product={product}
                  onAddToCart={addToCartAction.bind(null, product.id)}
                  onBuyNow={startBuyNowAction.bind(null, product.id)}
                />
                <div className="rounded-3xl border border-border bg-background p-5 shadow-[0_16px_40px_rgba(30,107,133,0.1)]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Studio Tooling</p>
                      <p className="font-display text-xl text-text">Place a test order</p>
                      <p className="text-sm text-muted">Creates a single-item order so you can review the workflow inside the admin console.</p>
                  </div>
                  <TestOrderButton onCreate={createTestOrderAction.bind(null, product.id)} />
                </div>
              </div>

                <div className="space-y-4 rounded-3xl border border-border bg-surface p-6 shadow-[0_22px_70px_rgba(30,107,133,0.08)]">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h2 className="font-display text-2xl text-text">Details</h2>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Edition 01</span>
                  </div>
                  <div className="space-y-3">
                    <details open className="group rounded-2xl border border-border bg-background/70 p-4">
                      <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-text">
                        Description
                        <span className="text-accent">+</span>
                      </summary>
                      <p className="mt-3 text-sm leading-7 text-muted">{product.description}</p>
                      <ul className="mt-3 space-y-2 text-sm text-muted">
                        {product.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <span className="mt-1.5 h-2 w-2 rounded-full bg-accent" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </details>
                    <details className="group rounded-2xl border border-border bg-surface p-4">
                      <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-text">
                        Materials & Care
                        <span className="text-primary">+</span>
                      </summary>
                      <p className="mt-3 text-sm text-muted">
                        {product.materials ?? "Italian-milled textiles curated for a soft yet architectural drape."}
                      </p>
                      <p className="mt-3 text-sm text-muted">
                        {product.care ?? "Dry clean only. Store flat away from direct light."}
                      </p>
                    </details>
                    <details className="group rounded-2xl border border-border bg-background/70 p-4">
                      <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-text">
                        Shipping & Returns
                        <span className="text-primary">+</span>
                      </summary>
                      <p className="mt-3 text-sm text-muted">
                        Complimentary standard shipping over $200. Express options available. Returns accepted within 30 days in original condition.
                      </p>
                    </details>
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
    </>
  );
}
