
import { getCartSummary } from "@/lib/db/cart";
import { removeCartItemAction, startCartCheckoutAction, updateCartItemAction } from "@/app/cart/actions";

export const dynamic = "force-dynamic";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default async function CartPage() {
  const { items, subtotal, total } = await getCartSummary();

  return (
    <>
      <main className="bg-background px-6 py-14 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Cart</p>
            <h1 className="font-display text-3xl text-text sm:text-4xl">Your selections</h1>
            <p className="text-sm text-muted">Review your pieces before checkout.</p>
          </div>

          {items.length ? (
            <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5 shadow-[0_18px_60px_rgba(15,20,24,0.08)] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-24 w-20 overflow-hidden rounded-2xl border border-border bg-background">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted">Size · {item.size}</p>
                        <h2 className="font-display text-xl text-text">{item.name}</h2>
                        <p className="text-sm text-muted">{currency.format(item.price)}</p>
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
                          className="h-10 w-20 rounded-full border border-border bg-surface px-3 text-sm font-semibold text-text"
                        />
                        <button
                          type="submit"
                          className="rounded-full border border-accent px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent transition hover:-translate-y-0.5 hover:border-accent-hover hover:text-accent-hover"
                        >
                          Update
                        </button>
                      </form>
                      <form action={removeCartItemAction}>
                        <input type="hidden" name="itemId" value={item.id} />
                        <button
                          type="submit"
                          className="rounded-full border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted transition hover:-translate-y-0.5"
                        >
                          Remove
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-fit rounded-3xl border border-border bg-background p-6 shadow-[0_20px_60px_rgba(15,20,24,0.08)]">
                <h2 className="font-display text-2xl text-text">Summary</h2>
                <div className="mt-4 space-y-2 text-sm text-muted">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-text">{currency.format(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total</span>
                    <span className="font-semibold text-text">{currency.format(total)}</span>
                  </div>
                </div>
                <form action={startCartCheckoutAction} className="mt-6">
                  <button
                    type="submit"
                    className="w-full rounded-full bg-accent py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5 hover:bg-accent-hover"
                  >
                    Checkout
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-surface px-8 py-10 text-center shadow-[0_20px_60px_rgba(15,20,24,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Cart empty</p>
              <h3 className="mt-3 font-display text-2xl text-text">Nothing here yet.</h3>
              <p className="mt-2 text-sm text-muted">Browse the catalog to add your first piece.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
