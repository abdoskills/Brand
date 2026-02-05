import clsx from "clsx";
import { ButtonHTMLAttributes, forwardRef } from "react";

export type ButtonVariant = "primary" | "outline" | "ghost";
export type ButtonSize = "md" | "sm" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
}

const baseClasses =
  "inline-flex items-center justify-center gap-2 font-semibold tracking-[0.18em] uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover focus-visible:outline-primary",
  outline:
    "border border-border-light text-text-light hover:border-primary hover:text-primary bg-white focus-visible:outline-primary",
  ghost: "text-text-light hover:text-primary focus-visible:outline-primary",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-[11px] rounded-lg",
  md: "px-5 py-3 text-xs rounded-xl",
  lg: "px-6 py-3.5 text-sm rounded-2xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", block, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(baseClasses, variantClasses[variant], sizeClasses[size], block && "w-full", className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
