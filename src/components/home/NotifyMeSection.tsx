"use client";

import { FormEvent, useMemo, useState } from "react";

const SUBSCRIBERS_KEY = "fitin_subscribers";
const NOTIFICATIONS_KEY = "fitin_notifications";

interface NotificationEntry {
  id: string;
  title: string;
  message: string;
  dateISO: string;
}

function readArray(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch (error) {
    console.warn("Failed to read", key, error);
    return [];
  }
}

function writeArray(key: string, value: unknown[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function NotifyMeSection() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [subscriberCount, setSubscriberCount] = useState(() => readArray(SUBSCRIBERS_KEY).length);

  const isValidEmail = useMemo(() => /.+@.+\..+/.test(email), [email]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    if (!isValidEmail) {
      setError("Please enter a valid email.");
      return;
    }
    setError(null);
    const normalized = email.trim().toLowerCase();
    const existing = readArray(SUBSCRIBERS_KEY);
    if (!existing.includes(normalized)) {
      writeArray(SUBSCRIBERS_KEY, [...existing, normalized]);
      setSubscriberCount(existing.length + 1);
    }
    setMessage("You’ll be notified.");
    setEmail("");
  };

  const handleSimulate = () => {
    const entry: NotificationEntry = {
      id: `notif-${Date.now()}`,
      title: "New Drop: Capsule Preview",
      message: "We just released a new drop. Explore the details now.",
      dateISO: new Date().toISOString(),
    };
    const existing = readArray(NOTIFICATIONS_KEY) as NotificationEntry[];
    writeArray(NOTIFICATIONS_KEY, [entry, ...existing].slice(0, 50));
    setMessage("Subscribers notified (simulated).");
  };

  return (
    <section className="w-full bg-[#f9f9f9] py-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/80">Notify me</p>
            <h3 className="font-[playfair] text-3xl text-text-default">Be first when the next drop lands.</h3>
            <p className="text-sm text-text-muted">Quiet launches, no spam. We only reach out for releases.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:items-end">
            <div className="w-full md:max-w-xl">
              <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-text-muted" htmlFor="notify-email">
                Email
              </label>
              <input
                id="notify-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 w-full border-b border-border-light bg-transparent pb-2 text-sm text-text-default outline-none transition focus:border-primary"
                aria-invalid={!!error}
              />
              {error ? <p className="mt-2 text-xs text-red-500">{error}</p> : null}
            </div>
            <div className="flex w-full flex-wrap items-center gap-3 md:justify-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white"
                style={{ backgroundColor: "#C7A76C" }}
              >
                Notify Me
              </button>
              <button
                type="button"
                onClick={handleSimulate}
                className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-text-default border border-border-light hover:border-primary"
              >
                Simulate Drop
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted">
              {message ? <span className="font-semibold text-primary">{message}</span> : null}
              {subscriberCount > 0 ? (
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
                  {subscriberCount} people subscribed
                </span>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
