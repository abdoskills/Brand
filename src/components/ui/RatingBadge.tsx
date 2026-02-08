interface RatingBadgeProps {
  rating: number;
  reviews: number;
}

export function RatingBadge({ rating, reviews }: RatingBadgeProps) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-muted">
      <div className="flex items-center gap-1">
        <span className="material-symbols-outlined text-[18px] text-accent">grade</span>
        <span>{rating.toFixed(1)}</span>
      </div>
      <span className="text-xs uppercase tracking-widest text-muted">
        {reviews} reviews
      </span>
    </div>
  );
}
