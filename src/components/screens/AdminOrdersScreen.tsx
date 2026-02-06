"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { RequireAuth } from "@/components/features/auth/RequireAuth";
import { MobileShell } from "@/components/layout/MobileShell";
import { BottomNav } from "@/components/ui/BottomNav";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { useCart } from "@/components/providers/CartProvider";
import type { Order } from "@/types";

const statusOptions: Order["status"][] = ["preparing", "shipping", "shipped", "cancelled"];

export function AdminOrdersScreen() {
  const { count } = useCart();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  async function loadOrders(withSpinner = false) {
    if (withSpinner) {
      setLoading(true);
    }
    try {
      const res = await fetch("/api/orders", { credentials: "include" });
      if (!res.ok) {
        setOrders([]);
        return;
      }
      const data = await res.json();
      setOrders(data.orders as Order[]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadOrders();
  }, []);

  const updateStatus = async (id: string, status: Order["status"]) => {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMessage(data.message ?? "Failed to update status");
      return;
    }
    setMessage("Status updated");
    await loadOrders(true);
  };

  return (
    <RequireAuth requireAdmin>
      <MobileShell>
        <TopAppBar cartCount={count} onCartClick={() => router.push("/cart")} />
        <main className="flex-1 px-4 pb-24">
          <section className="py-6">
            <h1 className="font-display text-3xl font-black uppercase italic tracking-tight text-white">
              Admin · Orders
            </h1>
            <p className="mt-2 text-xs uppercase tracking-widest text-neutral-500">
              Monitor fulfillment and manage order flow.
            </p>
          </section>
          {message ? (
            <div className="mb-4 rounded-sm border border-street-red bg-street-red/20 p-3 text-xs font-bold uppercase tracking-widest text-street-red">
              {message}
            </div>
          ) : null}
          {loading ? (
            <div className="rounded-sm border border-neutral-800 bg-neutral-900 p-6 text-center text-sm text-neutral-400">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-sm border border-neutral-800 bg-neutral-900 p-6 text-center text-sm text-neutral-400">
              No orders yet.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-sm border border-neutral-800 bg-neutral-900 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-neutral-500">Order</p>
                      <p className="font-display text-lg font-bold uppercase tracking-tight text-white">
                        #{order.id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-xs text-neutral-500">
                        Placed {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <select
                      value={order.status}
                      onChange={(event) => updateStatus(order.id, event.target.value as Order["status"])}
                      className="h-10 rounded-sm border border-neutral-700 bg-transparent px-3 text-xs font-bold uppercase tracking-widest text-white"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status} className="bg-neutral-900">
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-neutral-300">
                    {order.items.map((item) => (
                      <div key={`${order.id}-${item.productId}-${item.size}`} className="flex justify-between">
                        <span>
                          {item.name} · {item.size} × {item.qty}
                        </span>
                        <span>${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-sm border border-neutral-700 p-3 text-xs uppercase tracking-widest text-neutral-400">
                    <p className="font-bold text-white">Shipping</p>
                    <p>{order.shipping.name}</p>
                    <p>{order.shipping.phone}</p>
                    <p>
                      {order.shipping.address}, {order.shipping.city}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-neutral-800 pt-3 text-base font-bold text-white">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
        <BottomNav />
        <div className="h-10 bg-background-dark" />
      </MobileShell>
    </RequireAuth>
  );
}
