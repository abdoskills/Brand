import clsx from "clsx";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-border-light bg-white shadow-luxury/40 backdrop-blur",
        className
      )}
      {...props}
    />
  );
}
