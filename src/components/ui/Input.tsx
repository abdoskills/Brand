import clsx from "clsx";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

const baseFieldClasses =
  "w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-text-default placeholder:text-text-muted shadow-subtle focus:border-primary focus:ring-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary disabled:bg-muted disabled:cursor-not-allowed";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, id, className, ...props }, ref) => {
    const controlId = id || props.name;
    return (
      <label className="block space-y-2" htmlFor={controlId}>
        {label && <span className="block text-xs font-semibold tracking-[0.14em] uppercase text-text-muted">{label}</span>}
        <input
          ref={ref}
          id={controlId}
          className={clsx(baseFieldClasses, error && "border-red-400", className)}
          aria-invalid={!!error}
          aria-describedby={hint || error ? `${controlId}-note` : undefined}
          {...props}
        />
        {(hint || error) && (
          <p
            id={`${controlId}-note`}
            className={clsx(
              "text-xs text-text-muted",
              error && "text-red-500"
            )}
          >
            {error || hint}
          </p>
        )}
      </label>
    );
  }
);

Input.displayName = "Input";
