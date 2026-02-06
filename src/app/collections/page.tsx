import Link from "next/link";

import Navbar from "@/components/Navbar";

export default function CollectionsPage() {
  return (
    <>
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <header className="mb-12 text-center fade-in">
          <h1 className="font-serif text-4xl md:text-5xl text-text-main-light dark:text-text-main-dark mb-4">
            The Collection
          </h1>
          <div className="w-16 h-0.5 bg-primary mx-auto mb-4" />
          <p className="text-text-muted-light dark:text-text-muted-dark max-w-2xl mx-auto font-light text-sm tracking-wide">
            Discover our curated selection of timeless pieces designed for the modern connoisseur.
          </p>
        </header>

        <div className="flex flex-col gap-12 fade-in" style={{ animationDelay: "0.2s" }}>
          <section className="flex-1 min-h-[500px] flex flex-col">
          </section>
        </div>
      </main>

      <footer className="bg-surface-light dark:bg-surface-dark border-t border-border-light dark:border-border-dark pt-16 pb-8 transition-colors duration-300 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <span className="font-serif text-2xl font-bold tracking-widest text-text-main-light dark:text-text-main-dark">
                FIT IN
              </span>
              <p className="mt-4 text-xs text-text-muted-light dark:text-text-muted-dark leading-relaxed uppercase tracking-wide">
                Redefining luxury through silhouette and form.
              </p>
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-text-main-light dark:text-text-main-dark uppercase tracking-widest mb-4">
                Shop
              </h4>
              <ul className="space-y-2 text-sm text-text-muted-light dark:text-text-muted-dark">
                <li>
                  <Link className="hover:text-primary transition-colors" href="/collections">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-primary transition-colors" href="/collections">
                    Best Sellers
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-primary transition-colors" href="/collections">
                    Accessories
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-text-main-light dark:text-text-main-dark uppercase tracking-widest mb-4">
                Support
              </h4>
              <ul className="space-y-2 text-sm text-text-muted-light dark:text-text-muted-dark">
                <li>
                  <Link className="hover:text-primary transition-colors" href="/contact">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-primary transition-colors" href="/returns">
                    Shipping &amp; Returns
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-primary transition-colors" href="/returns">
                    Size Guide
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-text-main-light dark:text-text-main-dark uppercase tracking-widest mb-4">
                Newsletter
              </h4>
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark mb-4">Subscribe for exclusive access.</p>
              <form className="flex flex-col space-y-2">
                <input
                  className="bg-transparent border-b border-text-muted-light dark:border-text-muted-dark py-2 px-0 text-sm focus:border-primary focus:ring-0 placeholder-text-muted-light dark:placeholder-text-muted-dark outline-none"
                  placeholder="Email Address"
                  type="email"
                />
                <button
                  className="text-left text-xs uppercase tracking-widest font-bold text-text-main-light dark:text-text-main-dark hover:text-primary transition-colors mt-2"
                  type="submit"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <div className="border-t border-border-light dark:border-border-dark pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-[10px] text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest">
              © 2023 FIT IN. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link className="text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors" href="#">
                Instagram
              </Link>
              <Link className="text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors" href="#">
                Pinterest
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
