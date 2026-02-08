"use client";

import clsx from "clsx";

interface TopAppBarProps {
  cartCount: number;
  onMenuClick?: () => void;
  onCartClick?: () => void;
}

export function TopAppBar({ cartCount, onMenuClick, onCartClick }: TopAppBarProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-surface/90 p-4 pb-2 backdrop-blur-md lg:top-8 lg:mx-10 lg:rounded-full lg:border lg:border-border lg:px-8 lg:py-4 lg:shadow-[0_20px_60px_rgba(15,20,24,0.18)]">
      <button
        type="button"
        onClick={onMenuClick}
        className="text-text transition-opacity hover:opacity-70"
        aria-label="Open menu"
      >
        <span className="material-symbols-outlined text-[28px]">menu</span>
      </button>
      <h1 className="flex-1 text-center font-display text-xl font-semibold uppercase tracking-wider">
        FIT<span className="text-primary">IN</span>
      </h1>
      <button
        type="button"
        onClick={onCartClick}
        className="relative flex size-12 items-center justify-center text-text transition-colors hover:text-primary"
        aria-label="Open cart"
      >
        <span className="material-symbols-outlined text-[28px]">shopping_bag</span>
        <span
          className={clsx(
            "absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white",
            cartCount === 0 && "hidden"
          )}
        >
          {cartCount}
        </span>
      </button>
    </header>
  );
}
