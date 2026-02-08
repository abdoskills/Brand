import type { Order } from "@/types";

interface OrderCardProps {
  order: Order;
}

const statusColors: Record<Order["status"], string> = {
  preparing: "text-accent",
  shipping: "text-primary",
  shipped: "text-primary",
  cancelled: "text-accent",
};

const statusLabels: Record<Order["status"], string> = {
  preparing: "Preparing",
  shipping: "Shipping",
  shipped: "Shipped",
  cancelled: "Cancelled",
};

export function OrderCard({ order }: OrderCardProps) {
  const placed = new Date(order.createdAt).toLocaleDateString();
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted">Order</p>
          <p className="text-sm font-bold text-text">#{order.id.slice(-6).toUpperCase()}</p>
        </div>
        <div className={`text-xs font-bold uppercase tracking-widest ${statusColors[order.status]}`}>
          {statusLabels[order.status]}
        </div>
      </div>
      <div className="space-y-2 text-sm text-muted">
        {order.items.map((item) => (
          <div key={`${order.id}-${item.productId}-${item.size}`} className="flex justify-between">
            <span>
              {item.name} · {item.size} × {item.qty}
            </span>
            <span>${(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-border pt-3 text-sm text-muted">
        <span>Placed {placed}</span>
        <span className="font-bold text-text">${order.total.toFixed(2)}</span>
      </div>
    </div>
  );
}
