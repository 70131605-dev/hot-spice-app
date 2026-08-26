"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, UtensilsCrossed } from "lucide-react";
import type { MenuItem } from "@/types";
import { formatPrice } from "@/lib/format";

export function HeroCarousel({ items }: { items: MenuItem[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  const item = items[index % items.length];

  const goTo = (delta: number) => {
    setIndex((i) => (i + delta + items.length) % items.length);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#1a1a1a]">
      <div className="relative flex h-80 items-center sm:h-[33rem]">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={item.name}
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#2a2a2a]">
            <UtensilsCrossed size={48} className="text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="relative z-10 flex flex-col gap-2 px-6 sm:px-10">
          <span className="w-fit rounded-full bg-brand px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-white">
            🔥 Featured
          </span>
          <h2 className="max-w-xs text-2xl font-extrabold text-white sm:text-4xl">
            {item.name}
          </h2>
          <p className="text-lg font-bold text-white/90">
            {formatPrice(item.price)}
          </p>
          <Link
            href={`/menu/${item.id}`}
            className="mt-2 w-fit rounded-[10px] bg-white px-5 py-2.5 text-sm font-extrabold text-[#1a1a1a]"
          >
            Order Now
          </Link>
        </div>

        {items.length > 1 && (
          <>
            <button
              onClick={() => goTo(-1)}
              aria-label="Previous"
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => goTo(1)}
              aria-label="Next"
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-5 bg-brand" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
