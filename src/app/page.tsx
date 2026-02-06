"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { NewArrivalsSection } from "@/components/home/NewArrivalsSection";

export default function HomePage() {
  const easing = [0.25, 0.1, 0.25, 1];

  return (
    <>
      <Navbar />

      <header className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-white px-6 py-20 text-text-default">
        {/* Background image layer */}
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

        {/* Veil / soft overlay layer */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white/92 via-white/85 to-white/72" />

        {/* Content layer */}
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

      <main className="flex-grow w-full" id="shop">
        <NewArrivalsSection />
      </main>

      <section className="w-full bg-surface-light dark:bg-surface-dark py-20 border-t border-border-light dark:border-border-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="font-display text-3xl text-text-light dark:text-white">The Golden Standard</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-7">
                At FIT IN, we believe in the transformative power of the perfect fit. Our upcoming collection blends timeless silhouette with modern audacity. Gold isn&apos;t just a color in our palette; it&apos;s the standard of our craftsmanship.
              </p>
              <Link
                className="inline-block text-xs font-bold uppercase tracking-[0.2em] border-b border-primary text-text-light dark:text-white pb-1 hover:text-primary transition-colors"
                href="/about"
              >
                Read Our Story
              </Link>
            </div>
            <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-sm">
              <img
                alt="Luxury Texture"
                className="absolute inset-0 w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-1000 grayscale dark:opacity-60"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuALrmU7ZO0zpfkzysIAGCdIB2fME0Qx65hyR1LCAhW4NC10wdKKIgBFkUc35F2U_cpsjj4kZqgThMNInNdg0K_lRImf9LkzNqjPwcGdfjNZoQtOtsQBT8loJ_BAWOkVMCl2ZDzE_F8LZSKr1b3oI0neffM1zhkyE6Ebr7yjp0Q8XplTzlVR3el2DbzXKeKoiYhkahU-1J_RkDxk35_RemzpU0nB668025ciNPSy8gk9SwkDMS5gECrRvR8ijdJbs2aViuNG-ioNLYBD"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
