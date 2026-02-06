"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";

export function CheckoutScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal + shipping;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            qty: item.qty,
            size: item.size,
          })),
          shipping: {
            name,
            phone,
            address,
            city,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      clearCart();
      router.push("/orders/my");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 px-4 pb-24 lg:px-10 lg:pb-20">
      <section className="py-6">
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)] lg:items-start lg:gap-12">
          <div>
            <h1 className="mb-6 font-display text-3xl font-black uppercase italic tracking-tight text-white lg:text-4xl">
              Checkout
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 lg:gap-6">
              <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 lg:text-sm">
                Name
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="h-12 rounded-sm border border-neutral-700 bg-transparent px-3 text-sm text-white focus:border-street-red focus:outline-none lg:h-14 lg:rounded-full lg:border-white/20 lg:px-5 lg:text-base"
                  required
                />
              </label>
              <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 lg:text-sm">
                Phone
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="h-12 rounded-sm border border-neutral-700 bg-transparent px-3 text-sm text-white focus:border-street-red focus:outline-none lg:h-14 lg:rounded-full lg:border-white/20 lg:px-5 lg:text-base"
                  required
                />
              </label>
              <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 lg:text-sm">
                Address
                <input
                  type="text"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  className="h-12 rounded-sm border border-neutral-700 bg-transparent px-3 text-sm text-white focus:border-street-red focus:outline-none lg:h-14 lg:rounded-full lg:border-white/20 lg:px-5 lg:text-base"
                  required
                />
              </label>
              <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 lg:text-sm">
                City
                <input
                  type="text"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  className="h-12 rounded-sm border border-neutral-700 bg-transparent px-3 text-sm text-white focus:border-street-red focus:outline-none lg:h-14 lg:rounded-full lg:border-white/20 lg:px-5 lg:text-base"
                  required
                />
              </label>
              {error ? (
                <p className="text-xs font-semibold uppercase tracking-widest text-red-500 lg:text-sm">
                  {error}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className="mt-2 w-full rounded-sm bg-street-red py-3 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-red-700 disabled:opacity-60 lg:rounded-full lg:py-3.5 lg:text-base"
              >
                {isSubmitting ? "Placing order..." : "Place Order"}
              </button>
            </form>
          </div>
          <section className="rounded-sm border border-neutral-800 bg-neutral-900 p-6 lg:sticky lg:top-24 lg:rounded-3xl lg:border-white/10 lg:bg-neutral-900/70 lg:p-10 lg:shadow-[0_30px_80px_rgba(0,0,0,0.45)] lg:backdrop-blur-xl">
            <h2 className="mb-4 font-display text-xl font-black uppercase italic tracking-tight text-white lg:text-2xl">
              Order Summary
            </h2>
            <div className="space-y-2 text-sm text-neutral-300 lg:text-base">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}`}
                  className="flex items-center justify-between gap-4"
                >
                  <span>
                    {item.product.name} · {item.size} × {item.qty}
                  </span>
                  <span>${(item.product.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between text-sm text-neutral-300 lg:text-base">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-neutral-300 lg:text-base">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex items-center justify-between border-t border-neutral-800 pt-4 text-base font-bold text-white lg:text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
