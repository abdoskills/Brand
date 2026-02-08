import clsx from "clsx";
import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-border bg-surface shadow-luxury/40 backdrop-blur",
        className
      )}
      {...props}
    />
  );
}
