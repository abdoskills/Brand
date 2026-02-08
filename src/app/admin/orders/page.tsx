import { enforceAdminAccess } from "@/lib/admin";
import { getOrdersGroupedByStatus } from "@/lib/db/orders";
import { advanceOrderStatusAction } from "@/app/admin/orders/actions";

const statusTone: Record<string, string> = {
  preparing: "border-accent/30 bg-accent/10 text-accent",
  shipping: "border-primary/30 bg-primary/10 text-primary",
  shipped: "border-primary/20 bg-primary/5 text-primary",
};

export const dynamic = "force-dynamic";

interface AdminOrdersPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  await enforceAdminAccess();
  const { q } = await searchParams;
  const query = q ?? "";
  const grouped = await getOrdersGroupedByStatus({ query, limit: 100 });
  const orders = [...grouped.preparing, ...grouped.shipping, ...grouped.shipped];

  const columns = [
    { key: "preparing", title: "Preparing" },
    { key: "shipping", title: "Shipping" },
    { key: "shipped", title: "Shipped" },
  ];

  const groupedColumns = columns.map((column) => ({
    ...column,
    orders: grouped[column.key as keyof typeof grouped],
  }));

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Fulfillment</p>
          <h1 className="font-display text-3xl text-text">Orders workflow</h1>
          <p className="text-sm text-muted">Advance orders from preparing to shipped.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-border bg-surface px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            Orders List
          </span>
          <span className="rounded-full border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted/60">
            Post Order
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-[0_12px_40px_rgba(30,107,133,0.08)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Preparing</p>
          <p className="mt-2 font-display text-2xl text-text">{grouped.preparing.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-[0_12px_40px_rgba(30,107,133,0.08)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Shipping</p>
          <p className="mt-2 font-display text-2xl text-text">{grouped.shipping.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-[0_12px_40px_rgba(30,107,133,0.08)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Shipped</p>
          <p className="mt-2 font-display text-2xl text-text">{grouped.shipped.length}</p>
        </div>
      </div>

      <form className="rounded-2xl border border-border bg-surface p-4 shadow-[0_10px_30px_rgba(30,107,133,0.06)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            name="q"
            defaultValue={query}
            placeholder="Search by order ID or customer email"
            className="w-full rounded-full border border-border bg-background px-4 py-2 text-sm text-text"
          />
          <button
            type="submit"
            className="rounded-full border border-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary transition hover:-translate-y-0.5"
          >
            Search
          </button>
        </div>
      </form>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-border bg-surface px-8 py-10 text-center shadow-[0_20px_60px_rgba(30,107,133,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">No orders</p>
          <h3 className="mt-3 font-display text-2xl text-text">Orders will appear here after checkout.</h3>
          <p className="mt-2 text-sm text-muted">Place a test order from a product page to begin the workflow.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {groupedColumns.map((column) => (
            <div key={column.key} className="rounded-3xl border border-border bg-background p-4 shadow-[0_18px_60px_rgba(30,107,133,0.06)]">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="font-display text-xl text-text">{column.title}</h2>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{column.orders.length}</span>
              </div>
              <div className="mt-4 space-y-4">
                {column.orders.map((order) => {
                  const statusClass = statusTone[order.status] ?? "border-border bg-surface text-muted";
                  return (
                    <div key={order.id} className="rounded-2xl border border-border bg-surface p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-muted">#{order.id.slice(-6).toUpperCase()}</p>
                          <p className="mt-1 font-display text-lg text-text">{order.shipping.name}</p>
                          <p className="text-xs text-muted">{order.shipping.email}</p>
                          <p className="text-[11px] text-muted/70">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${statusClass}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-sm text-muted">
                        <span>Total</span>
                        <span className="font-semibold text-text">${order.total.toFixed(2)}</span>
                      </div>
                      <form action={advanceOrderStatusAction} className="mt-4">
                        <input type="hidden" name="orderId" value={order.id} />
                        <input type="hidden" name="status" value={order.status} />
                        <button
                          type="submit"
                          disabled={order.status === "shipped"}
                          className="w-full rounded-full border border-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(30,107,133,0.15)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Next
                        </button>
                      </form>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
