"use client";

import { FormEvent, useMemo, useState } from "react";

import { addSubscriber } from "@/lib/localDrops";
import { Button } from "./Button";
import { Input } from "./Input";

export function NotifyMeBlock() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = useMemo(() => /.+@.+\..+/.test(email), [email]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    if (!isValidEmail) {
      setError("Please enter a valid email.");
      return;
    }
    setError(null);
    const result = addSubscriber(email.trim());
    if (result.alreadyExists) {
      setMessage("You’re already on the list.");
    } else {
      setMessage("You’re on the list.");
    }
    setEmail("");
  };

  return (
    <div className="w-full rounded-xl border border-border-light bg-white px-5 py-6 shadow-subtle lg:px-8 lg:py-7">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">Be notified</p>
        <h3 className="font-[playfair] text-2xl text-text-default">Be first to know when new drops arrive.</h3>
        <p className="text-sm text-text-muted">We announce quietly. Join the list to catch the next release.</p>
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
      {message ? <p className="mt-3 text-sm font-semibold text-primary">{message}</p> : null}
    </div>
  );
}
