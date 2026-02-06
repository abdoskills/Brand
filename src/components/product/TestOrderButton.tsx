"use client";

import { useState, useTransition } from "react";

interface TestOrderButtonProps {
  slug: string;
}

type OrderState = {
  status: "idle" | "success" | "error";
  message: string;
};

export function TestOrderButton({ slug }: TestOrderButtonProps) {
  const [state, setState] = useState<OrderState>({ status: "idle", message: "" });
  const [pending, startTransition] = useTransition();

  const placeOrder = () => {
    startTransition(async () => {
      setState({ status: "idle", message: "" });
      try {
        const res = await fetch("/api/orders/test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message ?? "Unable to place order");
        }
        setState({ status: "success", message: "Order placed" });
      } catch (error) {
        setState({ status: "error", message: error instanceof Error ? error.message : "Something went wrong" });
      }
    });
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={placeOrder}
        disabled={pending}
        className="rounded-full bg-[#c9a646] px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#b3862a] hover:shadow-[0_14px_40px_rgba(201,166,70,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Placing..." : "Place Test Order"}
      </button>
      {state.message ? (
        <p
          className={`text-xs font-semibold uppercase tracking-[0.18em] ${
            state.status === "success" ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
