"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { MobileShell } from "@/components/layout/MobileShell";
import { BottomNav } from "@/components/ui/BottomNav";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";

export function LoginScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("next") ?? "/account";
  const { login } = useAuth();
  const { count } = useCart();

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const success = await login({ emailOrPhone, password });
    if (!success) {
      setError("Invalid credentials");
      setIsSubmitting(false);
      return;
    }

    router.replace(redirect);
  };

  return (
    <MobileShell>
      <TopAppBar cartCount={count} onCartClick={() => router.push("/cart")} />
      <main className="flex-1 px-4 pb-24 lg:px-10 lg:pb-20">
        <div className="py-6 lg:flex lg:h-full lg:items-center lg:justify-center">
          <div className="w-full max-w-lg rounded-none lg:rounded-3xl lg:border lg:border-white/10 lg:bg-neutral-900/70 lg:p-10 lg:shadow-[0_30px_80px_rgba(0,0,0,0.45)] lg:backdrop-blur-xl">
            <h1 className="mb-6 font-display text-3xl font-black uppercase italic tracking-tight text-white lg:text-4xl">
            Login
          </h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 lg:gap-6">
              <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 lg:text-sm">
                Email or phone
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(event) => setEmailOrPhone(event.target.value)}
                  className="h-12 rounded-sm border border-neutral-700 bg-transparent px-3 text-sm text-white focus:border-street-red focus:outline-none lg:h-14 lg:rounded-full lg:border-white/20 lg:px-5 lg:text-base"
                  required
                />
              </label>
              <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 lg:text-sm">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-12 rounded-sm border border-neutral-700 bg-transparent px-3 text-sm text-white focus:border-street-red focus:outline-none lg:h-14 lg:rounded-full lg:border-white/20 lg:px-5 lg:text-base"
                  required
                />
              </label>
              {error ? (
                <p className="text-xs font-semibold uppercase tracking-widest text-red-500 lg:text-sm">{error}</p>
              ) : null}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full rounded-sm bg-street-red py-3 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-red-700 disabled:opacity-60 lg:rounded-full lg:py-3.5 lg:text-base"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>
            <p className="mt-6 text-xs uppercase tracking-widest text-neutral-400 lg:text-sm">
              No account?{" "}
              <Link href="/register" className="font-bold text-street-red hover:underline">
                Register now
              </Link>
            </p>
          </div>
        </div>
      </main>
      <BottomNav />
      <div className="h-10 bg-background-dark lg:hidden" />
    </MobileShell>
  );
}
