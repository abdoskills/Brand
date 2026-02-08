"use client";

import { useRouter } from "next/navigation";

import { RequireAuth } from "@/components/features/auth/RequireAuth";
import { MobileShell } from "@/components/layout/MobileShell";
import { BottomNav } from "@/components/ui/BottomNav";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { useCart } from "@/components/providers/CartProvider";

export function AdminScreen() {
  const { count } = useCart();
  const router = useRouter();

  const sections = [
    {
      title: "Products",
      description: "Curate drops, adjust pricing, and manage inventory.",
      action: () => router.push("/admin/products"),
    },
    {
      title: "Orders",
      description: "Track statuses and keep shipments moving.",
      action: () => router.push("/admin/orders"),
    },
  ];

  return (
    <RequireAuth requireAdmin>
      <MobileShell>
        <TopAppBar cartCount={count} onCartClick={() => router.push("/cart")} />
        <main className="flex-1 px-4 pb-24 lg:px-10 lg:pb-20">
          <section className="py-6">
            <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-10">
              <div className="rounded-sm border border-border bg-surface p-6 lg:rounded-3xl lg:p-10 lg:shadow-[0_30px_80px_rgba(30,107,133,0.12)] lg:backdrop-blur-xl">
                <h1 className="font-display text-3xl font-black uppercase italic tracking-tight text-text lg:text-4xl">
                  Admin Hub
                </h1>
                <p className="mt-2 text-xs uppercase tracking-widest text-muted lg:text-sm">
                  Oversee your streetwear marketplace.
                </p>
              </div>
              <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-6">
                {sections.map((section) => (
                  <button
                    key={section.title}
                    type="button"
                    onClick={section.action}
                    className="rounded-sm border border-border bg-surface p-6 text-left transition-transform hover:-translate-y-1 lg:rounded-3xl lg:p-8 lg:text-left"
                  >
                    <p className="font-display text-2xl font-black uppercase italic tracking-tight text-text lg:text-3xl">
                      {section.title}
                    </p>
                    <p className="mt-2 text-sm text-muted lg:text-base">{section.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </main>
        <BottomNav />
        <div className="h-10 bg-background lg:hidden" />
      </MobileShell>
    </RequireAuth>
  );
}
