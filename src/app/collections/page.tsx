import Link from "next/link";

import Footer from "@/components/Footer";
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

        <div className="flex flex-col lg:flex-row gap-12 fade-in" style={{ animationDelay: "0.2s" }}>
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              <div className="block lg:hidden mb-6">
                <div className="relative">
                  <input
                    className="w-full bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark py-3 px-4 text-sm focus:border-primary focus:ring-0 transition-colors placeholder-text-muted-light dark:placeholder-text-muted-dark"
                    placeholder="Search collection..."
                    type="text"
                  />
                  <span className="material-icons-outlined absolute right-3 top-3 text-text-muted-light dark:text-text-muted-dark">
                    search
                  </span>
                </div>
              </div>

              <div className="border-b border-border-light dark:border-border-dark pb-6">
                <h3 className="font-serif text-lg text-text-main-light dark:text-text-main-dark mb-4 flex justify-between items-center cursor-pointer group">
                  <span>Category</span>
                  <span className="material-icons-outlined text-sm text-text-muted-light dark:text-text-muted-dark group-hover:text-primary transition-colors">
                    remove
                  </span>
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center justify-between group cursor-pointer">
                    <span className="text-sm text-text-muted-light dark:text-text-muted-dark group-hover:text-primary transition-colors">
                      New Arrivals
                    </span>
                  </li>
                  <li className="flex items-center justify-between group cursor-pointer">
                    <span className="text-sm text-text-muted-light dark:text-text-muted-dark group-hover:text-primary transition-colors">
                      Dresses
                    </span>
                  </li>
                  <li className="flex items-center justify-between group cursor-pointer">
                    <span className="text-sm text-text-muted-light dark:text-text-muted-dark group-hover:text-primary transition-colors">
                      Outerwear
                    </span>
                  </li>
                  <li className="flex items-center justify-between group cursor-pointer">
                    <span className="text-sm text-text-muted-light dark:text-text-muted-dark group-hover:text-primary transition-colors">
                      Accessories
                    </span>
                  </li>
                </ul>
              </div>

              <div className="border-b border-border-light dark:border-border-dark pb-6">
                <h3 className="font-serif text-lg text-text-main-light dark:text-text-main-dark mb-4 flex justify-between items-center cursor-pointer group">
                  <span>Sort By</span>
                  <span className="material-icons-outlined text-sm text-text-muted-light dark:text-text-muted-dark group-hover:text-primary transition-colors">
                    add
                  </span>
                </h3>
              </div>

              <div className="pb-6">
                <h3 className="font-serif text-lg text-text-main-light dark:text-text-main-dark mb-4 flex justify-between items-center cursor-pointer group">
                  <span>Size</span>
                  <span className="material-icons-outlined text-sm text-text-muted-light dark:text-text-muted-dark group-hover:text-primary transition-colors">
                    add
                  </span>
                </h3>
              </div>
            </div>
          </aside>

          <section className="flex-1 min-h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-8 border-b border-border-light dark:border-border-dark pb-4">
              <span className="text-xs uppercase tracking-widest text-text-muted-light dark:text-text-muted-dark">0 Products</span>
              <div className="flex items-center space-x-4">
                <button className="text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors">
                  <span className="material-icons-outlined">grid_view</span>
                </button>
                <button className="text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors">
                  <span className="material-icons-outlined">view_list</span>
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center py-20 px-4 border border-dashed border-border-light dark:border-border-dark bg-surface-light/50 dark:bg-surface-dark/50">
              <div className="mb-6 p-6 rounded-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark">
                <span className="material-icons-outlined text-4xl text-primary">diamond</span>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl text-text-main-light dark:text-text-main-dark mb-3">
                Exquisite Things Take Time
              </h2>
              <p className="text-text-muted-light dark:text-text-muted-dark max-w-md text-sm leading-relaxed mb-8">
                Our collection is currently being curated to ensure only the finest pieces make it to you. <br />Check back soon for our new arrivals.
              </p>
              <button className="group relative px-8 py-3 bg-transparent border border-text-main-light dark:border-text-main-dark text-text-main-light dark:text-text-main-dark overflow-hidden transition-all hover:border-primary dark:hover:border-primary">
                <span className="absolute top-0 left-0 w-0 h-full bg-primary transition-all duration-300 group-hover:w-full opacity-10" />
                <span className="relative text-xs font-bold uppercase tracking-widest group-hover:text-primary transition-colors">
                  Join Waitlist
                </span>
              </button>
            </div>
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
