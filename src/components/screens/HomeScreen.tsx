"use client";

import { useRouter } from "next/navigation";

import { MobileShell } from "@/components/layout/MobileShell";
import { BottomNav } from "@/components/ui/BottomNav";
import { CTASection } from "@/components/ui/CTASection";
import { Hero } from "@/components/ui/Hero";
import { NewArrivalsCarousel } from "@/components/ui/NewArrivalsCarousel";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { TrendingList } from "@/components/ui/TrendingList";
import { useCart } from "@/components/providers/CartProvider";
import type { Product } from "@/types";

interface HomeScreenProps {
  products: Product[];
}

export function HomeScreen({ products }: HomeScreenProps) {
  const router = useRouter();
  const { count } = useCart();

  const newArrivals = products.slice(0, 6);
  const trending = products.slice(0, 6);

  return (
    <MobileShell>
      <TopAppBar cartCount={count} onCartClick={() => router.push("/cart")} />
      <main className="@container flex-1 pb-24 lg:px-10 lg:pb-20">
        <div className="flex flex-col gap-12 lg:gap-16">
          <Hero
            imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuCFdjqwkVoyEJpSVs8rfa2Egxr8TPkPO8iU7Ls4PcNpfeLys2oDKqKZvBoEVYDb01wQMq-Crf-H4Z-J8OL0ndV283JlrTL2eqLDifEJOqtCT9MlGLWY-v7U8N-lZRprRFuDFWZ0Dm4yr0wOLqE3obpILAX2A0HYZn-Tr9pgSZdEkWqvGYRCmQg4M6T3-d7mvlGAFZvwo-I6GNeXxZmHR-nQaJvTXhnWDywq729vsTbvTbW5JyO_Y7KfTKUvl00W41-_EaW9Kh5uKRaf"
            tag="Featured Drop"
            headline={"Urban\nLegend\nVol. 2"}
            ctaLabel="Shop Collection"
            onCtaClick={() => router.push("/collections/featured")}
          />
          <div className="flex flex-col gap-12 lg:grid lg:grid-cols-[2fr,1fr] lg:items-start lg:gap-12 xl:grid-cols-[3fr,2fr]">
            <NewArrivalsCarousel products={newArrivals} />
            <TrendingList products={trending} />
          </div>
          <CTASection
            title="Winter Sale"
            subtitle="Up to 50% Off Selected Styles"
            ctaLabel="Access Now"
            imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuDnHAs9vITbWm-VxtoQdYVD38TWUC-OvwvYRDLmb0cO_TdAyj7bZ9LyNpz5ltPMsi2aOh9rBaeiHHRVSwTc5zt-4FrzPyEGb13uQ62we_brc1ruR3DmpMITdw_SJjeBfmxzLEuTRmyuJUqz0SUVUvbP2UROlJ5UQ1JjKxk_lGvhNHHnEjOwi-7iJUu7SAbQFWoL8VFAy6ctHst5ujxhcu4FFamkLldo3OP_iocoLJ1xiV_iRV9RFMMs4PK7osc0DU5Bs2bq4BoGyyao"
            onClick={() => router.push("/collections/winter")}
          />
        </div>
      </main>
      <BottomNav />
      <div className="h-10 bg-background lg:hidden" />
    </MobileShell>
  );
}
