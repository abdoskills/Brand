import Footer from "@/components/Footer";

import { getCartSummary } from "@/lib/db/cart";
import { removeCartItemAction, startCartCheckoutAction, updateCartItemAction } from "@/app/cart/actions";

export const dynamic = "force-dynamic";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default async function CartPage() {
  const { items, subtotal, total } = await getCartSummary();

  return (
    <>
      <main className="bg-white px-6 py-14 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b3862a]">Cart</p>
            <h1 className="font-[playfair] text-3xl text-neutral-900 sm:text-4xl">Your selections</h1>
            <p className="text-sm text-neutral-600">Review your pieces before checkout.</p>
          </div>

          {items.length ? (
            <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-3xl border border-[#eadcb7] bg-white p-5 shadow-[0_18px_60px_rgba(0,0,0,0.06)] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-24 w-20 overflow-hidden rounded-2xl border border-[#eadcb7] bg-[#fdfaf5]">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Size · {item.size}</p>
                        <h2 className="font-[playfair] text-xl text-neutral-900">{item.name}</h2>
                        <p className="text-sm text-neutral-600">{currency.format(item.price)}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <form action={updateCartItemAction} className="flex items-center gap-2">
                        <input type="hidden" name="itemId" value={item.id} />
                        <input
                          name="qty"
                          type="number"
                          min={1}
                          defaultValue={item.qty}
                          className="h-10 w-20 rounded-full border border-[#eadcb7] px-3 text-sm font-semibold text-neutral-800"
                        />
                        <button
                          type="submit"
                          className="rounded-full border border-[#c9a646] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a6a1d] transition hover:-translate-y-0.5"
                        >
                          Update
                        </button>
                      </form>
                      <form action={removeCartItemAction}>
                        <input type="hidden" name="itemId" value={item.id} />
                        <button
                          type="submit"
                          className="rounded-full border border-[#eadcb7] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 transition hover:-translate-y-0.5"
                        >
                          Remove
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-fit rounded-3xl border border-[#eadcb7] bg-[#fdfaf5] p-6 shadow-[0_20px_60px_rgba(201,166,70,0.12)]">
                <h2 className="font-[playfair] text-2xl text-neutral-900">Summary</h2>
                <div className="mt-4 space-y-2 text-sm text-neutral-600">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-neutral-900">{currency.format(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total</span>
                    <span className="font-semibold text-neutral-900">{currency.format(total)}</span>
                  </div>
                </div>
                <form action={startCartCheckoutAction} className="mt-6">
                  <button
                    type="submit"
                    className="w-full rounded-full bg-[#C7A76C] py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5 hover:bg-[#b68f57]"
                  >
                    Checkout
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-[#eadcb7] bg-white px-8 py-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b3862a]">Cart empty</p>
              <h3 className="mt-3 font-[playfair] text-2xl text-neutral-900">Nothing here yet.</h3>
              <p className="mt-2 text-sm text-neutral-600">Browse the catalog to add your first piece.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
