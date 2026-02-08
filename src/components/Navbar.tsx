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
          ? "glass-nav bg-background/90 border-b border-border/70 shadow-[0_8px_30px_rgba(26,78,97,0.12)]"
          : "glass-nav bg-background/50 border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-20 items-center justify-between">
          <div className="flex min-w-[120px] items-center gap-3 md:min-w-[160px]">
            <button
              className="text-text hover:text-primary transition-colors md:hidden"
              aria-label="Open menu"
            >
              <span className="material-icons-outlined">menu</span>
            </button>
            <Link
              className={`group relative font-display font-semibold text-primary transition-all duration-300 ${
                isScrolled ? "text-xl" : "text-2xl"
              } tracking-[0.18em] hover:tracking-[0.24em]`}
              href="/"
            >
              FIT IN
              <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />
              <span className="absolute -bottom-2 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>

          <div className="hidden flex-1 items-center justify-center gap-12 md:flex">
            <Link
              className="luxury-text-spacing text-xs font-medium text-text hover:text-primary transition-colors uppercase border-b-2 border-transparent hover:border-primary pb-1"
              href="/"
            >
              Home
            </Link>
            <Link
              className="luxury-text-spacing text-xs font-medium text-text hover:text-primary transition-colors uppercase border-b-2 border-transparent hover:border-primary pb-1"
              href="/collections"
            >
              Collections
            </Link>
            <Link
              className="luxury-text-spacing text-xs font-medium text-text hover:text-primary transition-colors uppercase border-b-2 border-transparent hover:border-primary pb-1"
              href="/about"
            >
              About
            </Link>
          </div>

          <div className="flex min-w-[140px] items-center justify-end gap-4 md:min-w-[180px]">
            <button
              className="text-text hover:text-primary transition-colors focus:outline-none"
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
              className="text-text hover:text-primary transition-colors"
              href="/search"
              aria-label="Search"
            >
              <span className="material-icons-outlined">search</span>
            </Link>

            <Link
              className="text-text hover:text-primary transition-colors"
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
