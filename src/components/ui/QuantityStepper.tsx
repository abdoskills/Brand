"use client";

interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export function QuantityStepper({ value, min = 1, max = 99, onChange }: QuantityStepperProps) {
  const handleDecrement = () => {
    const next = value - 1;
    if (next >= min) {
      onChange(next);
    }
  };

  const handleIncrement = () => {
    const next = value + 1;
    if (next <= max) {
      onChange(next);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleDecrement}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-700 text-white"
      >
        -
      </button>
      <span className="w-6 text-center text-sm font-semibold text-white">{value}</span>
      <button
        type="button"
        onClick={handleIncrement}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-700 text-white"
      >
        +
      </button>
    </div>
  );
}
