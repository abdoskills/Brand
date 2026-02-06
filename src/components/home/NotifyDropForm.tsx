"use client";

import { FormEvent, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const STORAGE_KEY = "fitin_notify_emails";

function readEmails(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch (error) {
    console.warn("Failed to read notify emails", error);
    return [];
  }
}

function writeEmails(list: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function NotifyDropForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(() => readEmails().length);

  const isValidEmail = useMemo(() => /.+@.+\..+/.test(email), [email]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    if (!isValidEmail) {
      setError("Please enter a valid email.");
      return;
    }
    setError(null);
    const lower = email.trim().toLowerCase();
    const existing = readEmails();
    if (existing.includes(lower)) {
      setMessage("You’ll be notified.");
      setEmail("");
      return;
    }
    const next = [...existing, lower];
    writeEmails(next);
    setCount(next.length);
    setMessage("You’ll be notified.");
    setEmail("");
  };

  return (
    <div className="rounded-md border border-border-light bg-white/90 px-5 py-6 shadow-subtle backdrop-blur md:px-6 md:py-7">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">Notify me</p>
        <h3 className="font-[playfair] text-2xl text-text-default">When the next drop lands.</h3>
        <p className="text-sm text-text-muted">Quiet launches. We email only for releases.</p>
      </div>
      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-3">
        <Input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="sm:flex-1"
          error={error ?? undefined}
          aria-label="Email address"
        />
        <Button type="submit" size="lg" className="sm:self-stretch sm:px-8">
          Notify Me
        </Button>
      </form>
      <div className="mt-3 flex items-center gap-3">
        {message ? <span className="text-sm font-semibold text-primary">{message}</span> : null}
        {count > 0 ? (
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            {count} people subscribed
          </span>
        ) : null}
      </div>
    </div>
  );
}
