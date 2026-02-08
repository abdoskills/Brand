"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";

export default function Navbar({ cartBadge }: { cartBadge: ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", saved);
    setIsDark(saved);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.theme = isDark ? "dark" : "light";
  }, [isDark, isMounted]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-[#0B0B0F]/80 backdrop-blur-md border-b border-neutral-200/50 dark:border-white/10 shadow-sm"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? "h-16" : "h-20"}`}>
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
              className={`font-display font-bold tracking-widest text-text-light dark:text-white transition-all duration-300 ${
                isScrolled ? "text-xl" : "text-2xl"
              }`}
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
              disabled={!isMounted}
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

            {cartBadge}
          </div>
        </div>
      </div>
    </nav>
  );
}
