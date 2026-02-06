"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const getInitialTheme = () => {
    if (typeof window === "undefined") return true;
    const saved =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", saved);
    return saved;
  };

  const [isDark, setIsDark] = useState<boolean>(getInitialTheme);

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.theme = isDark ? "dark" : "light";
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <nav className="fixed w-full z-50 transition-all duration-300 glass-nav border-b border-white/10 dark:border-white/5 bg-white/80 dark:bg-[#0B0B0F]/80">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center md:hidden">
            <button
              className="text-text-light dark:text-text-dark hover:text-primary transition-colors"
              aria-label="Open menu"
            >
              <span className="material-icons-outlined">menu</span>
            </button>
          </div>

          <div className="flex-shrink-0 flex items-center justify-center md:justify-start flex-1 md:flex-none">
            <Link
              className="font-display font-bold text-2xl tracking-widest text-text-light dark:text-white"
              href="/"
            >
              FIT <span className="text-primary">IN</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-baseline space-x-12">
              <Link
                className="luxury-text-spacing text-xs font-medium text-text-light dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors uppercase border-b-2 border-transparent hover:border-primary pb-1"
                href="/"
              >
                Home
              </Link>
              <Link
                className="luxury-text-spacing text-xs font-medium text-text-light dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors uppercase border-b-2 border-transparent hover:border-primary pb-1"
                href="/collections"
              >
                Collections
              </Link>
              <Link
                className="luxury-text-spacing text-xs font-medium text-text-light dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors uppercase border-b-2 border-transparent hover:border-primary pb-1"
                href="/about"
              >
                About
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button
              className="text-text-light dark:text-text-dark hover:text-primary transition-colors focus:outline-none"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <span className={`material-icons-outlined ${isDark ? "hidden" : ""}`}>
                dark_mode
              </span>
              <span className={`material-icons-outlined ${isDark ? "" : "hidden"}`}>
                light_mode
              </span>
            </button>

            <Link
              className="text-text-light dark:text-text-dark hover:text-primary transition-colors"
              href="/search"
              aria-label="Search"
            >
              <span className="material-icons-outlined">search</span>
            </Link>

            <Link
              className="text-text-light dark:text-text-dark hover:text-primary transition-colors"
              href="/login"
              aria-label="Login"
            >
              <span className="material-icons-outlined">person_outline</span>
            </Link>

            <Link
              className="relative text-text-light dark:text-text-dark hover:text-primary transition-colors"
              href="/cart"
              aria-label="Cart"
            >
              <span className="material-icons-outlined">shopping_bag</span>
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
