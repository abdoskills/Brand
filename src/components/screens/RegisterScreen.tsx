"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/components/providers/AuthProvider";

export function RegisterScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("next") ?? "/account";
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const success = await register({ name, emailOrPhone, password });
    if (!success) {
      setError("Could not create account");
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
            <div className="absolute inset-0 opacity-12" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
            <div className="absolute inset-0 bg-gradient-to-br from-white/92 via-white/94 to-white/70" />
            <div className="relative flex h-full flex-col justify-between gap-10">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted luxury-text-spacing">
                  Join The Circle
                </p>
                <h1 className="font-display text-4xl leading-tight text-text lg:text-5xl">
                  Create your account and unlock the private releases.
                </h1>
                <p className="text-sm text-muted lg:text-base">
                  Save addresses, sizes, and payment preferences for a seamless, luxury checkout experience.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted">
                  Fast checkout
                </span>
                <span className="rounded-full border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted">
                  Drop alerts
                </span>
                <span className="rounded-full border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted">
                  Saved sizes
                </span>
              </div>
            </div>
          </section>

          <div className="w-full max-w-xl justify-self-end rounded-2xl border border-border bg-surface p-8 lg:p-10 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-display text-3xl text-text">Register</h2>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-muted luxury-text-spacing">
                  Set up your profile and move faster.
                </p>
              </div>
              <span className="rounded-full border border-border px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-muted">
                New member
              </span>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.25em] text-muted">
                Name
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full border-b border-border bg-transparent py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-0"
                  required
                />
              </label>
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
                {isSubmitting ? "Creating..." : "Create Account"}
              </button>
            </form>
            <p className="mt-6 text-xs uppercase tracking-[0.28em] text-muted">
              Already registered?{" "}
              <Link href="/login" className="font-bold text-primary hover:text-primary-hover">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
