interface CTASectionProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
  imageUrl: string;
  onClick?: () => void;
}

export function CTASection({ title, subtitle, ctaLabel, imageUrl, onClick }: CTASectionProps) {
  return (
    <section className="w-full px-4 pb-24 lg:px-0">
      <div className="group relative h-64 w-full overflow-hidden rounded-sm bg-background lg:h-80 lg:rounded-3xl lg:border lg:border-border lg:shadow-[0_30px_70px_rgba(15,20,24,0.2)]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60 transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-text/35 p-6 text-center">
          <h3 className="font-display text-3xl font-semibold tracking-tight text-white lg:text-4xl">
            {title}
          </h3>
          <p className="text-sm font-medium uppercase tracking-widest text-white/80 lg:text-base">
            {subtitle}
          </p>
          <button
            type="button"
            onClick={onClick}
            className="rounded-sm bg-accent px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-accent-hover lg:px-10 lg:py-3.5 lg:text-base"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
