"use client";

import { useOptimistic, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function CartBadgeClient({ initialCount }: { initialCount: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [count, inc] = useOptimistic(initialCount, (s, n: number) => s + n);

  useEffect(() => {
    // Expose globally for PurchasePanel to call
    (globalThis as any).__incCart = (n: number) => {
      startTransition(() => {
        inc(n);
      });
    };
  }, [inc]);

  return (
    <Link
      className="relative text-text hover:text-primary transition-colors"
      href="/cart"
      aria-label="Cart"
    >
      <span className="material-icons-outlined">shopping_bag</span>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
      {isPending ? <span className="sr-only">Updating</span> : null}
    </Link>
  );
}
