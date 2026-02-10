"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Props = {
  images: string[];
  alt: string;
};

export default function ProductGallery({ images, alt }: Props) {
  const safeImages = useMemo(
    () => (Array.isArray(images) ? images.filter(Boolean) : []),
    [images],
  );

  const [activeIndex, setActiveIndex] = useState(0);

  if (safeImages.length === 0) {
    return <div className="aspect-[4/5] rounded-2xl border border-black/10 bg-white/60" />;
  }

  const active = safeImages[Math.min(activeIndex, safeImages.length - 1)];

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-black/10 bg-white/60">
        <Image
          key={active}
          src={active}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 700px, 100vw"
          className="object-cover"
        />
      </div>

      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {safeImages.slice(0, 4).map((src, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={`${src}-${idx}`}
              type="button"
              onPointerEnter={() => setActiveIndex(idx)}
              onPointerDown={() => setActiveIndex(idx)}
              onFocus={() => setActiveIndex(idx)}
              className={[
                "relative aspect-square overflow-hidden rounded-xl border transition",
                "bg-white/60",
                isActive
                  ? "border-black/40 ring-2 ring-black/20"
                  : "border-black/10 hover:border-black/25",
              ].join(" ")}
              aria-label={`View image ${idx + 1}`}
            >
              <Image
                src={src}
                alt={`${alt} thumbnail ${idx + 1}`}
                fill
                sizes="160px"
                className="object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
