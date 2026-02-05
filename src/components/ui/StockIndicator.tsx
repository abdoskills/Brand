interface StockIndicatorProps {
  stock: number;
}

export function StockIndicator({ stock }: StockIndicatorProps) {
  const label = stock > 10 ? "In stock" : stock > 0 ? "Low stock" : "Sold out";
  const color = stock > 10 ? "text-green-400" : stock > 0 ? "text-amber-400" : "text-red-500";

  return (
    <div className={`text-xs font-bold uppercase tracking-widest ${color}`}>
      {label}
    </div>
  );
}
