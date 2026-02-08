"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/Button";

export function HomeHero() {
  const easing: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

  return (
    <header className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-white px-6 py-20 text-text-default">
      <motion.div
        className="pointer-events-none absolute inset-0 -z-20"
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.1, ease: easing }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/jj.jpg"
            alt=""
            fill
            priority
            className="h-full w-full object-cover blur-lg opacity-45 scale-105"
            aria-hidden
          />
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white/92 via-white/85 to-white/72" />

      <motion.div
        className="relative mx-auto mt-6 flex w-full max-w-5xl flex-col items-center gap-6 text-center sm:mt-10 lg:mt-12"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.12 } },
        }}
      >
        <motion.div
          className="flex flex-col items-center gap-3"
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easing } },
          }}
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/80">Fit In · New Drop</span>
          <span className="h-px w-16 bg-[#C7A76C]/60" />
        </motion.div>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easing, delay: 0.1 } },
          }}
        >
          <Link href="/products" className="inline-flex">
            <Button size="lg">Shop Now</Button>
          </Link>
          <Link href="/collections" className="text-xs font-semibold uppercase tracking-[0.2em] text-text-default hover:text-primary">
            View Collection
          </Link>
        </motion.div>
      </motion.div>
    </header>
  );
}
