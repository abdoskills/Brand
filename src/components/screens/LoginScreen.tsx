"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/components/providers/AuthProvider";

export function LoginScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("next") ?? "/account";
  const { login } = useAuth();

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
    <div className="min-h-screen bg-background text-text">
      <main className="w-full max-w-6xl mx-auto px-6 pt-32 pb-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          <section className="relative overflow-hidden rounded-2xl border border-border bg-surface p-8 lg:p-12 shadow-lg">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
            <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/92 to-white/70" />
            <div className="relative flex h-full flex-col justify-between gap-10">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted luxury-text-spacing">
                  Member Access
                </p>
                <h1 className="font-display text-4xl leading-tight text-text lg:text-5xl">
                  Sign in to continue your collection.
                </h1>
                <p className="text-sm text-muted lg:text-base">
                  Faster checkout, saved preferences, and tracked orders—all in one refined experience.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted">
                  Secure checkout
                </span>
                <span className="rounded-full border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted">
                  Saved favorites
                </span>
                <span className="rounded-full border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted">
                  Early access
                </span>
              </div>
            </div>
          </section>

          <div className="w-full max-w-xl justify-self-end rounded-2xl border border-border bg-surface p-8 lg:p-10 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-display text-3xl text-text">Login</h2>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-muted luxury-text-spacing">
                  Welcome back — keep building the rotation.
                </p>
              </div>
              <span className="rounded-full border border-border px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-muted">
                Returning
              </span>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.25em] text-muted">
                Email or phone
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(event) => setEmailOrPhone(event.target.value)}
                  className="w-full border-b border-border bg-transparent py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-0"
                  required
                />
              </label>
              <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.25em] text-muted">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full border-b border-border bg-transparent py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-0"
                  required
                />
              </label>
              {error ? (
                <p className="text-xs font-semibold uppercase tracking-widest text-red-600">{error}</p>
              ) : null}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full rounded-sm bg-accent py-3 text-sm font-bold uppercase tracking-[0.28em] text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>
            <p className="mt-6 text-xs uppercase tracking-[0.28em] text-muted">
              No account?{" "}
              <Link href="/register" className="font-bold text-primary hover:text-primary-hover">
                Register now
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
