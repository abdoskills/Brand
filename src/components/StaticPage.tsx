import type { ReactNode } from "react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

interface StaticPageProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export default function StaticPage({ title, description, children }: StaticPageProps) {
  return (
    <>
      <Navbar />
      <main className="flex w-full justify-center px-6 lg:px-12 pt-24 pb-20 bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark">
        <div className="w-full max-w-4xl text-center space-y-6">
          <div className="space-y-3">
            <p className="text-primary text-xs font-bold tracking-[0.2em] uppercase">{title}</p>
            <h1 className="font-display text-4xl font-medium">{title}</h1>
          </div>
          {description ? (
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-7">{description}</p>
          ) : null}
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
