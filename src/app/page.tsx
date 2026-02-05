import Image from "next/image";
import Link from "next/link";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <header className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-white px-6 py-20 text-text-default">
        {/* Background image layer */}
        <div className="pointer-events-none absolute inset-0 -z-20">
          <Image
            src="/jj.jpg"
            alt=""
            fill
            priority
            className="h-full w-full object-cover blur-xl opacity-45 scale-105"
            aria-hidden
          />
        </div>

        {/* Veil / soft overlay layer */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white/92 via-white/85 to-white/72" />

        {/* Content layer */}
        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/70">Fit In Atelier</span>
          <h1 className="font-[playfair] text-4xl sm:text-5xl md:text-6xl tracking-tight text-text-default">
            Quiet Luxury, Defined
          </h1>
          <p className="max-w-2xl text-base text-text-muted md:text-lg">
            Tailored silhouettes, sculpted textures, and seasonless essentials designed for the understated.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg">Explore Collection</Button>
            <Link href="#shop" className="inline-flex">
              <Button variant="outline" size="lg">View Lookbook</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-20" id="shop">
        <div className="flex flex-col items-center justify-center mb-16">
          <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-2">Latest Drops</span>
          <h2 className="font-display text-3xl md:text-4xl text-text-light dark:text-white mb-6">New Arrivals</h2>
          <div className="w-16 h-[1px] bg-primary" />
        </div>

        <div className="flex justify-between items-center mb-10 border-b border-border-light dark:border-border-dark pb-4">
          <div className="flex space-x-6 text-sm font-medium text-gray-500 dark:text-gray-400">
            <button className="text-text-light dark:text-white border-b border-primary pb-0.5">All</button>
            <button className="hover:text-primary transition-colors">Outerwear</button>
            <button className="hover:text-primary transition-colors">Tops</button>
            <button className="hover:text-primary transition-colors">Accessories</button>
          </div>
          <button className="flex items-center space-x-1 text-xs uppercase tracking-widest text-text-light dark:text-white hover:text-primary">
            <span>Filter</span>
            <span className="material-icons-outlined text-sm">filter_list</span>
          </button>
        </div>

        <div className="min-h-[400px] w-full flex flex-col items-center justify-center border border-dashed border-border-light dark:border-border-dark rounded-lg bg-surface-light dark:bg-surface-dark/50 transition-colors duration-500">
          <div className="w-20 h-20 rounded-full bg-background-light dark:bg-background-dark flex items-center justify-center mb-6 shadow-lg border border-border-light dark:border-border-dark">
            <span className="material-icons-outlined text-4xl text-primary">inventory_2</span>
          </div>
          <h3 className="font-display text-2xl text-text-light dark:text-white mb-2">Our Atelier is Busy</h3>
          <p className="font-body text-gray-500 dark:text-gray-400 text-sm mb-8 luxury-text-spacing text-center max-w-sm">
            NO PRODUCTS YET. <br />BE THE FIRST TO KNOW WHEN THE COLLECTION DROPS.
          </p>
          <form className="flex w-full max-w-md border-b border-text-light dark:border-white/30 focus-within:border-primary transition-colors pb-1">
            <input
              className="flex-1 bg-transparent border-none text-text-light dark:text-white placeholder-gray-400 text-xs tracking-widest focus:ring-0 px-0 py-2"
              placeholder="ENTER YOUR EMAIL"
              type="email"
            />
            <button
              className="text-xs font-bold uppercase tracking-widest text-text-light dark:text-white hover:text-primary transition-colors"
              type="submit"
            >
              Notify Me
            </button>
          </form>
        </div>
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
