"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", icon: "home", label: "Home" },
  { href: "/search", icon: "search", label: "Search" },
  { href: "/favorites", icon: "favorite", label: "Favorites" },
  { href: "/account", icon: "person", label: "Account" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-[400px] -translate-x-1/2 rounded-full border border-white/10 bg-neutral-900/90 px-6 py-2 backdrop-blur-lg shadow-2xl lg:hidden">
      <div className="flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex h-10 w-12 flex-col items-center justify-center gap-1 text-xs"
            >
              <span
                className="material-symbols-outlined text-[24px]"
                style={{ color: isActive ? "#ffffff" : "#9ca3af" }}
              >
                {item.icon}
              </span>
              <span className="sr-only">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
