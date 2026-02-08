import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

import Footer from "@/components/Footer";
import { getOrderById } from "@/lib/db/orders";
import { getAuthUser } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

interface SuccessPageProps {
  searchParams: Promise<{ order?: string }>;
}

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { order: orderId } = await searchParams;

  if (!orderId) {
    return notFound();
  }

  const order = await getOrderById(orderId);

  if (!order) {
    return notFound();
  }

  // Access Lock
  if (order.userId) {
    const user = await getAuthUser();
    if (!user || user.id !== order.userId) {
      return notFound();
    }
  } else {
    // Guest order
    const guestCookie = (await cookies()).get("fitin_guest")?.value;
    if (!guestCookie || guestCookie !== order.guestId) {
      return notFound();
    }
  }

  return (
    <>
      <main className="bg-white px-6 py-14 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="rounded-3xl border border-[#eadcb7] bg-[#fdfaf5] p-8 text-center shadow-[0_20px_60px_rgba(201,166,70,0.12)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b3862a]">Order confirmed</p>
            <h1 className="mt-3 font-[playfair] text-3xl text-neutral-900 sm:text-4xl">Thank you for your purchase.</h1>
            <p className="mt-2 text-sm text-neutral-600">We are preparing your order with atelier-level care.</p>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-neutral-500">Order · {order.id}</p>
          </div>

          <div className="rounded-3xl border border-[#eadcb7] bg-white p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
              <h2 className="font-[playfair] text-2xl text-neutral-900">Order summary</h2>
              <div className="mt-4 space-y-3 text-sm text-neutral-700">
                {order.items.map((item) => (
                  <div key={`${order.id}-${item.productId}-${item.size}`} className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-neutral-900">{item.name}</p>
                      <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">{item.size} · {item.qty}</p>
                    </div>
                    <span>{currency.format(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-[#eadcb7] pt-4 text-base font-semibold text-neutral-900">
                <span>Total</span>
                <span>{currency.format(order.total)}</span>
              </div>
              <div className="mt-6 rounded-2xl border border-[#eadcb7] bg-[#fdfaf5] p-4 text-xs uppercase tracking-[0.16em] text-neutral-500">
                <p className="font-semibold text-neutral-900">Shipping</p>
                <p>{order.shipping.name}</p>
                <p>{order.shipping.email}</p>
                <p>{order.shipping.phone}</p>
                <p>
                  {order.shipping.address}, {order.shipping.city}, {order.shipping.country} {order.shipping.postalCode}
                </p>
              </div>
            </div>

          <div className="text-center">
            <Link
              href="/products"
              className="inline-flex rounded-full border border-[#c9a646] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a6a1d] transition hover:-translate-y-0.5"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
