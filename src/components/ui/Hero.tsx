"use client";

import clsx from "clsx";

interface HeroProps {
  imageUrl: string;
  tag: string;
  headline: string;
  ctaLabel: string;
  onCtaClick?: () => void;
}

export function Hero({ imageUrl, tag, headline, ctaLabel, onCtaClick }: HeroProps) {
  return (
    <section className="w-full px-4 lg:px-0">
      <div className="relative h-[480px] w-full overflow-hidden rounded-lg lg:h-[580px] lg:rounded-3xl lg:border lg:border-border lg:shadow-[0_35px_80px_rgba(15,20,24,0.2)]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 flex w-full flex-col items-start gap-4 p-6 lg:p-10">
          <span className="rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
            {tag}
          </span>
          <h2 className="font-display text-5xl font-semibold leading-none tracking-tight text-white lg:text-6xl">
            {headline.split("\n").map((line, index) => (
              <span key={line} className={index > 0 ? "block" : undefined}>
                {line}
              </span>
            ))}
          </h2>
          <button
            type="button"
            onClick={onCtaClick}
            className={clsx(
              "mt-2 bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors",
              "hover:bg-accent-hover lg:px-8 lg:py-3.5 lg:text-base"
            )}
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
