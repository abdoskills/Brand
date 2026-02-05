"use client";

import clsx from "clsx";
import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,4fr)_minmax(0,1.2fr)] lg:items-start lg:gap-6">
        <div
          className="h-[360px] w-full overflow-hidden rounded-sm border border-neutral-800 bg-cover bg-center lg:h-[620px] lg:rounded-3xl lg:border-white/10 lg:shadow-[0_35px_90px_rgba(0,0,0,0.45)]"
          style={{
            backgroundImage: `url(${activeImage ?? "https://lh3.googleusercontent.com/aida-public/AB6AXuCFdjqwkVoyEJpSVs8rfa2Egxr8TPkPO8iU7Ls4PcNpfeLys2oDKqKZvBoEVYDb01wQMq-Crf-H4Z-J8OL0ndV283JlrTL2eqLDifEJOqtCT9MlGLWY-v7U8N-lZRprRFuDFWZ0Dm4yr0wOLqE3obpILAX2A0HYZn-Tr9pgSZdEkWqvGYRCmQg4M6T3-d7mvlGAFZvwo-I6GNeXxZmHR-nQaJvTXhnWDywq729vsTbvTbW5JyO_Y7KfTKUvl00W41-_EaW9Kh5uKRaf"})`,
          }}
        />
        {images.length > 1 ? (
          <div className="flex gap-2 overflow-x-auto no-scrollbar lg:flex-col lg:overflow-visible">
            {images.map((image, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={clsx(
                    "h-20 w-20 flex-shrink-0 overflow-hidden rounded-sm border border-neutral-800 transition-all lg:h-24 lg:w-24 lg:rounded-xl",
                    isActive && "border-street-red"
                  )}
                >
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${image})` }}
                  />
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
