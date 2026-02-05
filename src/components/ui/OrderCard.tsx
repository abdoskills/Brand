import type { Order } from "@/types";

interface OrderCardProps {
  order: Order;
}

const statusColors: Record<Order["status"], string> = {
  pending: "text-amber-400",
  processing: "text-blue-400",
  shipped: "text-green-400",
  cancelled: "text-red-500",
};

export function OrderCard({ order }: OrderCardProps) {
  const placed = new Date(order.createdAt).toLocaleDateString();
  return (
    <div className="flex flex-col gap-4 rounded-sm border border-neutral-800 bg-neutral-900 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-neutral-500">Order</p>
          <p className="text-sm font-bold text-white">#{order.id.slice(-6).toUpperCase()}</p>
        </div>
        <div className={`text-xs font-bold uppercase tracking-widest ${statusColors[order.status]}`}>
          {order.status}
        </div>
      </div>
      <div className="space-y-2 text-sm text-neutral-300">
        {order.items.map((item) => (
          <div key={`${order.id}-${item.productId}-${item.size}`} className="flex justify-between">
            <span>
              {item.name} · {item.size} × {item.qty}
            </span>
            <span>${(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-neutral-800 pt-3 text-sm text-neutral-300">
        <span>Placed {placed}</span>
        <span className="font-bold text-white">${order.total.toFixed(2)}</span>
      </div>
    </div>
  );
}
