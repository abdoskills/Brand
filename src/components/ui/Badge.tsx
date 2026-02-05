import clsx from "clsx";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "default" | "success" | "warning" | "neutral";
}

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  default: "bg-primary/10 text-primary",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  neutral: "bg-muted text-text-muted",
};

export function Badge({ tone = "default", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]",
        toneClasses[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
