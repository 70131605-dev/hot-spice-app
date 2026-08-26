"use client";

import Link from "next/link";
import { ArrowRight, Heart, UtensilsCrossed } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";
import { formatPrice } from "@/lib/format";

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <div className="-mx-4 -mt-4 min-h-[calc(100vh-57px)] bg-[#ececec] px-4 pb-24 pt-4">
      <h1 className="mb-5 text-2xl font-extrabold text-[#1a1a1a]">
        My Favorites
      </h1>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <span className="flex h-24 w-24 items-center justify-center rounded-full bg-white">
            <Heart size={40} className="text-brand" />
          </span>
          <h2 className="text-xl font-extrabold text-[#1a1a1a]">
            No Favorites
          </h2>
          <Link
            href="/menu"
            className="rounded-[10px] bg-brand px-6 py-3 text-sm font-extrabold uppercase tracking-wide text-white"
          >
            Explore Menu
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((item) => (
            <div
              key={item.id}
              className="flex justify-between gap-3 rounded-2xl bg-[#dcdcdc] p-4"
            >
              <div className="flex flex-col justify-between">
                <p className="text-lg font-extrabold text-[#1a1a1a]">
                  {item.name}
                </p>
                <Link
                  href={`/menu/${item.id}`}
                  className="mt-2 flex items-center gap-1.5 text-sm font-bold text-brand"
                >
                  VIEW DETAILS
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand">
                    <ArrowRight size={12} className="text-white" />
                  </span>
                </Link>
                <p className="mt-3 font-extrabold text-[#1a1a1a]">
                  {formatPrice(item.price)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => toggleFavorite(item)}
                  aria-label={`Remove ${item.name} from favorites`}
                >
                  <Heart size={22} className="fill-brand text-brand" />
                </button>
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-white/60">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UtensilsCrossed size={24} className="text-[#999]" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
