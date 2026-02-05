"use client";

import { useRouter } from "next/navigation";

import { MobileShell } from "@/components/layout/MobileShell";
import { BottomNav } from "@/components/ui/BottomNav";
import { CartItemCard } from "@/components/ui/CartItemCard";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { useCart } from "@/components/providers/CartProvider";

export function CartScreen() {
  const router = useRouter();
  const { items, count, subtotal, updateQuantity, removeItem } = useCart();

  const shipping = subtotal > 0 ? 12 : 0;
  const total = subtotal + shipping;

  return (
    <MobileShell>
      <TopAppBar cartCount={count} onCartClick={() => router.push("/cart")} />
      <main className="flex-1 px-4 pb-24 lg:px-10 lg:pb-20">
        <section className="py-6">
          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1.7fr)_minmax(0,0.9fr)] lg:items-start lg:gap-10">
            <div>
              <h1 className="mb-6 font-display text-3xl font-black uppercase italic tracking-tight text-white lg:text-4xl">
                Your Cart
              </h1>
              <div className="flex flex-col gap-4 lg:gap-6">
                {items.length === 0 ? (
                  <div className="rounded-sm border border-neutral-800 bg-neutral-900 p-6 text-center text-sm text-neutral-400 lg:rounded-3xl lg:border-white/10 lg:bg-neutral-900/70 lg:px-10 lg:py-16 lg:text-base">
                    Your cart is empty. Browse new arrivals and add some heat.
                  </div>
                ) : (
                  items.map((item) => (
                    <CartItemCard
                      key={`${item.product.id}-${item.size}`}
                      item={item}
                      onQuantityChange={(qty) => updateQuantity(item.product.id, item.size, qty)}
                      onRemove={() => removeItem(item.product.id, item.size)}
                    />
                  ))
                )}
              </div>
            </div>
            <section className="rounded-sm border border-neutral-800 bg-neutral-900 p-6 lg:sticky lg:top-24 lg:rounded-3xl lg:border-white/10 lg:bg-neutral-900/70 lg:p-10 lg:shadow-[0_30px_80px_rgba(0,0,0,0.45)] lg:backdrop-blur-xl">
              <h2 className="mb-6 font-display text-2xl font-black uppercase italic tracking-tight text-white">
                Order Summary
              </h2>
              <div className="mb-4 flex items-center justify-between text-sm text-neutral-300 lg:text-base">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="mb-4 flex items-center justify-between text-sm text-neutral-300 lg:text-base">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex items-center justify-between border-t border-neutral-800 pt-4 text-base font-bold text-white lg:text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button
                type="button"
                onClick={() => router.push("/checkout")}
                className="mt-6 w-full rounded-sm bg-street-red py-3 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-red-700 disabled:opacity-60 lg:rounded-full lg:py-3.5 lg:text-base"
                disabled={items.length === 0}
              >
                Checkout
              </button>
            </section>
          </div>
        </section>
      </main>
      <BottomNav />
      <div className="h-10 bg-background-dark lg:hidden" />
    </MobileShell>
  );
}
