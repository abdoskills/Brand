
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
      <main className="bg-background px-6 py-14 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Checkout</p>
            <h1 className="font-display text-3xl text-text sm:text-4xl">Finalize your order</h1>
            <p className="text-sm text-muted">Secure your pieces with a minimal checkout.</p>
          </div>

          {items.length ? (
            <form action={confirmOrderAction} className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
              <input type="hidden" name="orderId" value={orderId} />
              <div className="space-y-6">
                <div className="rounded-3xl border border-border bg-surface p-6 shadow-[0_18px_60px_rgba(15,20,24,0.08)]">
                  <h2 className="font-display text-2xl text-text">Shipping details</h2>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <label className="text-sm font-medium text-text">
                      Full name
                      <input name="name" required className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-text" />
                    </label>
                    <label className="text-sm font-medium text-text">
                      Email
                      <input name="email" type="email" required className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-text" />
                    </label>
                    <label className="text-sm font-medium text-text">
                      Phone
                      <input name="phone" required className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-text" />
                    </label>
                    <label className="text-sm font-medium text-text">
                      Address
                      <input name="address" required className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-text" />
                    </label>
                    <label className="text-sm font-medium text-text">
                      City
                      <input name="city" required className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-text" />
                    </label>
                    <label className="text-sm font-medium text-text">
                      Country
                      <input name="country" required className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-text" />
                    </label>
                    <label className="text-sm font-medium text-text">
                      Postal code
                      <input name="postalCode" required className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-text" />
                    </label>
                  </div>
                </div>

                <div className="rounded-3xl border border-border bg-background p-6">
                  <h2 className="font-display text-2xl text-text">Payment</h2>
                  <p className="mt-2 text-sm text-muted">Pay later / cash on delivery (placeholder).</p>
                </div>
              </div>

              <div className="h-fit rounded-3xl border border-border bg-surface p-6 shadow-[0_20px_60px_rgba(15,20,24,0.08)] lg:sticky lg:top-28">
                <h2 className="font-display text-2xl text-text">Order summary</h2>
                <div className="mt-4 space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm text-text">
                      <div>
                        <p className="font-semibold text-text">{item.name}</p>
                        <p className="text-xs uppercase tracking-[0.16em] text-muted">{item.size} · {item.qty}</p>
                      </div>
                      <span>{currency.format(item.lineTotal)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-2 text-sm text-muted">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-text">{currency.format(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total</span>
                    <span className="font-semibold text-text">{currency.format(total)}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-6 w-full rounded-full bg-accent py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5 hover:bg-accent-hover"
                >
                  Confirm Order
                </button>
              </div>
            </form>
          ) : (
            <div className="rounded-3xl border border-border bg-surface px-8 py-10 text-center shadow-[0_20px_60px_rgba(15,20,24,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">No items</p>
              <h3 className="mt-3 font-display text-2xl text-text">Your checkout is empty.</h3>
              <p className="mt-2 text-sm text-muted">Add a product or start a Buy Now flow.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
