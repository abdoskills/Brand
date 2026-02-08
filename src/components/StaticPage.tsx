import type { ReactNode } from "react";


interface StaticPageProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export default function StaticPage({ title, description, children }: StaticPageProps) {
  return (
    <>
      <main className="flex w-full justify-center px-6 lg:px-12 pt-24 pb-20 bg-background text-text">
        <div className="w-full max-w-4xl text-center space-y-6">
          <div className="space-y-3">
            <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">{title}</p>
            <h1 className="font-display text-4xl font-medium">{title}</h1>
          </div>
          {description ? (
            <p className="text-sm text-muted leading-7">{description}</p>
          ) : null}
          {children}
        </div>
      </main>
    </>
  );
}
