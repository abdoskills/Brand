import Link from "next/link";

import { HomeHero } from "@/components/home/HomeHero";
import { NewArrivalsSection } from "@/components/home/NewArrivalsSection";
import { getNewArrivals } from "@/lib/db/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getNewArrivals(6);
  return (
    <>
      <HomeHero />

      <main className="flex-grow w-full" id="shop">
        <NewArrivalsSection products={products} />
      </main>

      <section className="w-full bg-surface py-20 border-t border-border">
        <div className="mx-auto w-full max-w-[1280px] px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="font-display text-3xl text-text">The Golden Standard</h3>
              <p className="text-muted text-sm leading-7">
                At FIT IN, we believe in the transformative power of the perfect fit. Our upcoming collection blends timeless silhouette with modern audacity. Gold isn&apos;t just a color in our palette; it&apos;s the standard of our craftsmanship.
              </p>
              <Link
                className="inline-block text-xs font-bold uppercase tracking-[0.2em] border-b border-primary text-text pb-1 hover:text-primary transition-colors"
                href="/about"
              >
                Read Our Story
              </Link>
            </div>
            <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-sm">
              <img
                alt="Luxury Texture"
                className="absolute inset-0 w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-1000 grayscale"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuALrmU7ZO0zpfkzysIAGCdIB2fME0Qx65hyR1LCAhW4NC10wdKKIgBFkUc35F2U_cpsjj4kZqgThMNInNdg0K_lRImf9LkzNqjPwcGdfjNZoQtOtsQBT8loJ_BAWOkVMCl2ZDzE_F8LZSKr1b3oI0neffM1zhkyE6Ebr7yjp0Q8XplTzlVR3el2DbzXKeKoiYhkahU-1J_RkDxk35_RemzpU0nB668025ciNPSy8gk9SwkDMS5gECrRvR8ijdJbs2aViuNG-ioNLYBD"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
