"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bike,
  Heart,
  MapPin,
  Plus,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import { fetchCategories, fetchMenuItems } from "@/lib/api";
import type { Category, MenuItem } from "@/types";
import { formatPrice } from "@/lib/format";
import { Spinner } from "@/components/Spinner";
import { HeroCarousel } from "@/components/HeroCarousel";
import { CategorySlider } from "@/components/CategorySlider";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<MenuItem[]>([]);
  const [categoryImages, setCategoryImages] = useState<
    Record<number, string | undefined>
  >({});
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [showAddressNotice, setShowAddressNotice] = useState(false);
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));

    fetchMenuItems()
      .then((items) => {
        setFeatured(items.filter((i) => i.is_featured));
        const images: Record<number, string | undefined> = {};
        for (const item of items) {
          if (item.image && !images[item.category_id]) {
            images[item.category_id] = item.image;
          }
        }
        setCategoryImages(images);
      })
      .catch(() => setFeatured([]))
      .finally(() => setLoadingFeatured(false));
  }, []);

  return (
    <div className="flex flex-col gap-6 pb-6">
      {!loadingFeatured && featured.length > 0 && (
        <HeroCarousel items={featured} />
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowAddressNotice((v) => !v)}
          className="flex items-center gap-1.5 rounded-full border border-[#ddd] px-3 py-1.5 text-sm font-semibold text-[#555]"
        >
          <MapPin size={16} className="text-brand" />
          No Address Selected
        </button>
      </div>

      {showAddressNotice && (
        <p className="rounded-lg bg-brand-tint px-4 py-3 text-sm font-semibold text-brand">
          Address selection is coming soon!
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/menu"
          className="flex items-center justify-center gap-2 rounded-full border border-[#ddd] bg-white py-3 font-bold text-[#1a1a1a]"
        >
          <Bike size={18} className="text-brand" />
          Delivery
        </Link>
        <Link
          href="/menu"
          className="flex items-center justify-center gap-2 rounded-full border border-[#ddd] bg-white py-3 font-bold text-[#1a1a1a]"
        >
          <Store size={18} className="text-brand" />
          Pickup
        </Link>
      </div>

      <div className="flex items-center gap-4 rounded-2xl bg-brand p-5 text-white">
        <Bike size={36} className="shrink-0" />
        <div>
          <p className="text-lg font-extrabold">Free Delivery</p>
          <p className="text-sm text-white/90">On orders above Rs. 1500</p>
        </div>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-[#1a1a1a]">
            Explore Menu
          </h2>
          <Link href="/menu" className="text-sm font-bold text-brand">
            View All
          </Link>
        </div>
        <CategorySlider categories={categories} images={categoryImages} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-extrabold text-[#1a1a1a]">
          🔥 Popular Right Now
        </h2>
        {loadingFeatured ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((item) => {
              const fav = isFavorite(item.id);
              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
                >
                  <Link
                    href={`/menu/${item.id}`}
                    className="relative flex h-32 w-full items-center justify-center bg-[#fafafa] sm:h-36"
                  >
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UtensilsCrossed size={28} className="text-[#ccc]" />
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(item);
                      }}
                      aria-label="Toggle favorite"
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow"
                    >
                      <Heart
                        size={15}
                        className={fav ? "fill-brand text-brand" : "text-[#999]"}
                      />
                    </button>
                  </Link>
                  <div className="p-3">
                    <Link href={`/menu/${item.id}`}>
                      <p className="truncate text-sm font-bold text-[#1a1a1a]">
                        {item.name}
                      </p>
                    </Link>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-extrabold text-brand">
                        {formatPrice(item.price)}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        aria-label={`Add ${item.name} to cart`}
                        className="flex items-center gap-1 rounded-full bg-brand px-3 py-1.5 text-xs font-extrabold text-white"
                      >
                        <Plus size={13} />
                        ADD
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
