"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Category } from "@/types";
import { CategoryIcon } from "@/components/CategoryIcon";

const BLOB_DEFAULT = "43% 67% 0% 43% / 43% 67% 0% 50%";
// const BLOB_HOVER = "37% 63% 46% 54% / 57% 61% 39% 43%";

export function CategorySlider({
  categories,
  images,
}: {
  categories: Category[];
  images: Record<number, string | undefined>;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (delta: number) => {
    scrollerRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <button
        onClick={() => scrollBy(-280)}
        aria-label="Scroll left"
        className="absolute -left-4 top-[38%] z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand shadow-md sm:flex"
      >
        <ChevronLeft size={20} />
      </button>

      <div
        ref={scrollerRef}
        className="no-scrollbar flex snap-x gap-6 overflow-x-auto scroll-smooth pb-2"
      >
        {categories.map((cat) => {
          const image = images[cat.id];
          return (
            <Link
              key={cat.id}
              href={`/menu?categoryId=${cat.id}`}
              className="group flex w-40 shrink-0 snap-start flex-col items-center gap-3 text-center sm:w-48"
            >
              <div className="relative">
                <div
                  style={{ borderRadius: BLOB_DEFAULT }}
                  className="flex h-50 w-40 items-center justify-center overflow-hidden bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] transition-[border-radius] duration-700 ease-in-out group-hover:duration-700 sm:h-36 sm:w-48"
                  onMouseEnter={(e) => {
                    // e.currentTarget.style.borderRadius = BLOB_HOVER;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderRadius = BLOB_DEFAULT;
                  }}
                >
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image}
                      alt={cat.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-tint">
                      <CategoryIcon slug={cat.slug} size={26} className="text-brand" />
                    </span>
                  )}
                </div>
                <span className="absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-full bg-[#e8e8e8]" />
              </div>
              <div>
                <p className="font-extrabold text-[#1a1a1a]">{cat.name}</p>
                <span className="mt-1 block h-[3px] w-6 rounded-full bg-brand" />
              </div>
            </Link>
          );
        })}
      </div>

      <button
        onClick={() => scrollBy(280)}
        aria-label="Scroll right"
        className="absolute -right-4 top-[38%] z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand shadow-md sm:flex"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
