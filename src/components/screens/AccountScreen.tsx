"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { RequireAuth } from "@/components/features/auth/RequireAuth";
import { MobileShell } from "@/components/layout/MobileShell";
import { BottomNav } from "@/components/ui/BottomNav";
import { OrderCard } from "@/components/ui/OrderCard";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import type { Order } from "@/types";

export function AccountScreen() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/orders/my", { credentials: "include" });
        if (!res.ok) {
          setOrders([]);
          return;
        }
        const data = await res.json();
        setOrders(data.orders as Order[]);
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, []);

  return (
    <RequireAuth>
      <MobileShell>
        <TopAppBar cartCount={count} onCartClick={() => router.push("/cart")} />
        <main className="flex-1 px-4 pb-24 lg:px-10 lg:pb-20">
          <section className="py-6">
            <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:items-start lg:gap-12">
              <div className="rounded-sm border border-neutral-800 bg-neutral-900 p-4 text-sm text-neutral-300 lg:sticky lg:top-24 lg:rounded-3xl lg:border-white/10 lg:bg-neutral-900/70 lg:p-8 lg:shadow-[0_30px_80px_rgba(0,0,0,0.45)] lg:backdrop-blur-xl">
                <h1 className="font-display text-3xl font-black uppercase italic tracking-tight text-white lg:text-4xl">
                  Account
                </h1>
                {user ? (
                  <div className="mt-6 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 lg:text-sm">
                      Profile
                    </p>
                    <p className="text-white lg:text-lg">{user.name}</p>
                    <p className="text-neutral-400">{user.emailOrPhone}</p>
                    <button
                      type="button"
                      onClick={logout}
                      className="mt-4 text-xs font-bold uppercase tracking-widest text-street-red hover:underline lg:text-sm"
                    >
                      Logout
                    </button>
                  </div>
                ) : null}
              </div>
              <div className="pb-12">
                <h2 className="mb-4 font-display text-2xl font-black uppercase italic tracking-tighter text-white lg:text-3xl">
                  My Orders
                </h2>
                {isLoading ? (
                  <div className="rounded-sm border border-neutral-800 bg-neutral-900 p-6 text-center text-sm text-neutral-400 lg:rounded-3xl lg:border-white/10 lg:bg-neutral-900/70 lg:px-10 lg:py-16 lg:text-base">
                    Loading orders...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="rounded-sm border border-neutral-800 bg-neutral-900 p-6 text-center text-sm text-neutral-400 lg:rounded-3xl lg:border-white/10 lg:bg-neutral-900/70 lg:px-10 lg:py-16 lg:text-base">
                    No orders yet. Start shopping to build your rotation.
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-6">
                    {orders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
        <BottomNav />
        <div className="h-10 bg-background-dark lg:hidden" />
      </MobileShell>
    </RequireAuth>
  );
}
