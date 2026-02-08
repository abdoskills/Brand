import Footer from "@/components/Footer";

import { confirmOrderAction } from "@/app/checkout/actions";
import { getCartSummary } from "@/lib/db/cart";
import { getCheckoutDraft, getCheckoutDraftById } from "@/lib/db/checkout";

export const dynamic = "force-dynamic";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

interface CheckoutPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { orderId: rawOrderId } = await searchParams;
  const orderId = rawOrderId ?? "";
  const draft = orderId ? await getCheckoutDraftById(orderId) : await getCheckoutDraft();
  const cart = await getCartSummary();
  const items = draft.mode === "buyNow" && draft.items.length ? draft.items : cart.items;
  const subtotal = draft.mode === "buyNow" && draft.items.length ? draft.subtotal : cart.subtotal;
  const total = draft.mode === "buyNow" && draft.items.length ? draft.total : cart.total;

  return (
    <>
      <main className="bg-white px-6 py-14 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b3862a]">Checkout</p>
            <h1 className="font-[playfair] text-3xl text-neutral-900 sm:text-4xl">Finalize your order</h1>
            <p className="text-sm text-neutral-600">Secure your pieces with a minimal checkout.</p>
          </div>

          {items.length ? (
            <form action={confirmOrderAction} className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
              <input type="hidden" name="orderId" value={orderId} />
              <div className="space-y-6">
                <div className="rounded-3xl border border-[#eadcb7] bg-white p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
                  <h2 className="font-[playfair] text-2xl text-neutral-900">Shipping details</h2>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <label className="text-sm font-medium text-neutral-700">
                      Full name
                      <input name="name" required className="mt-2 w-full rounded-2xl border border-[#eadcb7] bg-[#fffdf7] px-4 py-3 text-sm text-neutral-900" />
                    </label>
                    <label className="text-sm font-medium text-neutral-700">
                      Email
                      <input name="email" type="email" required className="mt-2 w-full rounded-2xl border border-[#eadcb7] bg-[#fffdf7] px-4 py-3 text-sm text-neutral-900" />
                    </label>
                    <label className="text-sm font-medium text-neutral-700">
                      Phone
                      <input name="phone" required className="mt-2 w-full rounded-2xl border border-[#eadcb7] bg-[#fffdf7] px-4 py-3 text-sm text-neutral-900" />
                    </label>
                    <label className="text-sm font-medium text-neutral-700">
                      Address
                      <input name="address" required className="mt-2 w-full rounded-2xl border border-[#eadcb7] bg-[#fffdf7] px-4 py-3 text-sm text-neutral-900" />
                    </label>
                    <label className="text-sm font-medium text-neutral-700">
                      City
                      <input name="city" required className="mt-2 w-full rounded-2xl border border-[#eadcb7] bg-[#fffdf7] px-4 py-3 text-sm text-neutral-900" />
                    </label>
                    <label className="text-sm font-medium text-neutral-700">
                      Country
                      <input name="country" required className="mt-2 w-full rounded-2xl border border-[#eadcb7] bg-[#fffdf7] px-4 py-3 text-sm text-neutral-900" />
                    </label>
                    <label className="text-sm font-medium text-neutral-700">
                      Postal code
                      <input name="postalCode" required className="mt-2 w-full rounded-2xl border border-[#eadcb7] bg-[#fffdf7] px-4 py-3 text-sm text-neutral-900" />
                    </label>
                  </div>
                </div>

                <div className="rounded-3xl border border-[#eadcb7] bg-[#fdfaf5] p-6">
                  <h2 className="font-[playfair] text-2xl text-neutral-900">Payment</h2>
                  <p className="mt-2 text-sm text-neutral-600">Pay later / cash on delivery (placeholder).</p>
                </div>
              </div>

              <div className="h-fit rounded-3xl border border-[#eadcb7] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] lg:sticky lg:top-28">
                <h2 className="font-[playfair] text-2xl text-neutral-900">Order summary</h2>
                <div className="mt-4 space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm text-neutral-700">
                      <div>
                        <p className="font-semibold text-neutral-900">{item.name}</p>
                        <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">{item.size} · {item.qty}</p>
                      </div>
                      <span>{currency.format(item.lineTotal)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-2 text-sm text-neutral-600">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-neutral-900">{currency.format(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total</span>
                    <span className="font-semibold text-neutral-900">{currency.format(total)}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-6 w-full rounded-full bg-[#C7A76C] py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5 hover:bg-[#b68f57]"
                >
                  Confirm Order
                </button>
              </div>
            </form>
          ) : (
            <div className="rounded-3xl border border-[#eadcb7] bg-white px-8 py-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b3862a]">No items</p>
              <h3 className="mt-3 font-[playfair] text-2xl text-neutral-900">Your checkout is empty.</h3>
              <p className="mt-2 text-sm text-neutral-600">Add a product or start a Buy Now flow.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
