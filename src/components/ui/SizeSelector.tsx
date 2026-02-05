"use client";

interface SizeSelectorProps {
  value: "S" | "M" | "L" | "XL" | null;
  onChange: (size: "S" | "M" | "L" | "XL") => void;
}

const sizes: Array<"S" | "M" | "L" | "XL"> = ["S", "M", "L", "XL"];

export function SizeSelector({ value, onChange }: SizeSelectorProps) {
  return (
    <div className="flex gap-3">
      {sizes.map((size) => {
        const isActive = value === size;
        return (
          <button
            key={size}
            type="button"
            onClick={() => onChange(size)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold uppercase transition-colors ${
              isActive
                ? "border-street-red bg-street-red text-white"
                : "border-neutral-700 text-white hover:border-street-red"
            }`}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
