"use client";

import Link from "next/link";
import { useState } from "react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getNotifications } from "@/lib/localDrops";
import type { NotificationEntry } from "@/lib/localDrops";
import { Button } from "@/components/ui/Button";

export default function NotificationsPage() {
  const [notifications] = useState<NotificationEntry[]>(() => getNotifications());

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-16 text-text-default">
        <div className="mb-10 flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/70">Alerts</p>
          <h1 className="font-[playfair] text-4xl tracking-tight">Notifications</h1>
          <p className="text-sm text-text-muted">Local simulation of drop notifications for subscribers.</p>
        </div>

        {notifications.length === 0 ? (
          <div className="rounded-2xl border border-border-light bg-white/80 px-6 py-8 text-center shadow-subtle">
            <p className="text-sm text-text-muted">No notifications yet. Simulate a drop to populate this list.</p>
            <div className="mt-4 flex justify-center">
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          </div>
        ) : (
          <ul className="space-y-3">
            {notifications.map((entry) => (
              <li
                key={entry.id}
                className="flex flex-col gap-2 rounded-xl border border-border-light bg-white/90 px-5 py-4 shadow-subtle sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-text-default">{entry.title}</p>
                  <p className="text-xs text-text-muted">{new Date(entry.dateISO).toLocaleString()}</p>
                </div>
                <Link
                  href={`/products/${entry.productId}`}
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-primary hover:text-primary/80"
                >
                  View Product
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </>
  );
}
