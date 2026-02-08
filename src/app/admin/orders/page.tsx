import { enforceAdminAccess } from "@/lib/admin";
import { getOrdersGroupedByStatus } from "@/lib/db/orders";
import { advanceOrderStatusAction } from "@/app/admin/orders/actions";

const statusTone: Record<string, string> = {
  preparing: "border-[#eadcb7] bg-[#fdf3d3] text-[#8a6a1d]",
  shipping: "border-blue-200 bg-blue-50 text-blue-700",
  shipped: "border-emerald-200 bg-emerald-50 text-emerald-700",
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
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b3862a]">Fulfillment</p>
          <h1 className="font-[playfair] text-3xl text-neutral-900">Orders workflow</h1>
          <p className="text-sm text-neutral-600">Advance orders from preparing to shipped.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-[#eadcb7] bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-600">
            Orders List
          </span>
          <span className="rounded-full border border-[#eadcb7] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
            Post Order
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#eadcb7] bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Preparing</p>
          <p className="mt-2 font-[playfair] text-2xl text-neutral-900">{grouped.preparing.length}</p>
        </div>
        <div className="rounded-2xl border border-[#eadcb7] bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Shipping</p>
          <p className="mt-2 font-[playfair] text-2xl text-neutral-900">{grouped.shipping.length}</p>
        </div>
        <div className="rounded-2xl border border-[#eadcb7] bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Shipped</p>
          <p className="mt-2 font-[playfair] text-2xl text-neutral-900">{grouped.shipped.length}</p>
        </div>
      </div>

      <form className="rounded-2xl border border-[#eadcb7] bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            name="q"
            defaultValue={query}
            placeholder="Search by order ID or customer email"
            className="w-full rounded-full border border-[#eadcb7] px-4 py-2 text-sm text-neutral-800"
          />
          <button
            type="submit"
            className="rounded-full border border-[#c9a646] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a6a1d] transition hover:-translate-y-0.5"
          >
            Search
          </button>
        </div>
      </form>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-[#eadcb7] bg-white px-8 py-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b3862a]">No orders</p>
          <h3 className="mt-3 font-[playfair] text-2xl text-neutral-900">Orders will appear here after checkout.</h3>
          <p className="mt-2 text-sm text-neutral-600">Place a test order from a product page to begin the workflow.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {groupedColumns.map((column) => (
            <div key={column.key} className="rounded-3xl border border-[#eadcb7] bg-[#fdfaf5] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between border-b border-[#eadcb7] pb-3">
                <h2 className="font-[playfair] text-xl text-neutral-900">{column.title}</h2>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">{column.orders.length}</span>
              </div>
              <div className="mt-4 space-y-4">
                {column.orders.map((order) => {
                  const statusClass = statusTone[order.status] ?? "border-[#eadcb7] bg-white text-neutral-600";
                  return (
                    <div key={order.id} className="rounded-2xl border border-[#eadcb7] bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">#{order.id.slice(-6).toUpperCase()}</p>
                          <p className="mt-1 font-[playfair] text-lg text-neutral-900">{order.shipping.name}</p>
                          <p className="text-xs text-neutral-500">{order.shipping.email}</p>
                          <p className="text-[11px] text-neutral-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${statusClass}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-sm text-neutral-700">
                        <span>Total</span>
                        <span className="font-semibold text-neutral-900">${order.total.toFixed(2)}</span>
                      </div>
                      <form action={advanceOrderStatusAction} className="mt-4">
                        <input type="hidden" name="orderId" value={order.id} />
                        <input type="hidden" name="status" value={order.status} />
                        <button
                          type="submit"
                          disabled={order.status === "shipped"}
                          className="w-full rounded-full border border-[#c9a646] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a6a1d] transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(201,166,70,0.15)] disabled:cursor-not-allowed disabled:opacity-50"
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
