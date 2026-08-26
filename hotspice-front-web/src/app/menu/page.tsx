"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, Plus, UtensilsCrossed } from "lucide-react";
import { fetchCategories, fetchMenuItems } from "@/lib/api";
import type { Category, MenuItem } from "@/types";
import { formatPrice } from "@/lib/format";
import { Spinner } from "@/components/Spinner";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";

function MenuPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryIdParam = searchParams.get("categoryId");
  const selectedCategoryId = categoryIdParam ? Number(categoryIdParam) : null;

  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchMenuItems(selectedCategoryId ?? undefined)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [selectedCategoryId]);

  const selectCategory = (id: number | null) => {
    if (id === null || id === selectedCategoryId) {
      router.push("/menu");
    } else {
      router.push(`/menu?categoryId=${id}`);
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-6">
      <h1 className="text-2xl font-extrabold text-[#1a1a1a]">Our Menu</h1>

      <div className="no-scrollbar flex gap-6 overflow-x-auto border-b border-[#eee] pb-0">
        <button
          onClick={() => selectCategory(null)}
          className="shrink-0 pb-3"
        >
          <span
            className={`text-sm font-extrabold uppercase tracking-wide ${
              selectedCategoryId === null ? "text-brand" : "text-[#888]"
            }`}
          >
            All
          </span>
          <span
            className={`mt-2 block h-[3px] rounded-full ${
              selectedCategoryId === null ? "bg-brand" : "bg-transparent"
            }`}
          />
        </button>
        {categories.map((cat) => {
          const active = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => selectCategory(cat.id)}
              className="shrink-0 pb-3"
            >
              <span
                className={`whitespace-nowrap text-sm font-extrabold uppercase tracking-wide ${
                  active ? "text-brand" : "text-[#888]"
                }`}
              >
                {cat.name}
              </span>
              <span
                className={`mt-2 block h-[3px] rounded-full ${
                  active ? "bg-brand" : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : items.length === 0 ? (
        <p className="py-16 text-center text-[#999]">No items found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const fav = isFavorite(item.id);
            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
              >
                <Link
                  href={`/menu/${item.id}`}
                  className="relative flex h-40 w-full items-center justify-center bg-[#fafafa]"
                >
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UtensilsCrossed size={30} className="text-[#ccc]" />
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
                <div className="p-4">
                  <Link href={`/menu/${item.id}`}>
                    <p className="font-bold text-[#1a1a1a]">{item.name}</p>
                    {item.description && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-[#888]">
                        {item.description}
                      </p>
                    )}
                  </Link>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-extrabold text-brand">
                      {formatPrice(item.price)}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      aria-label={`Add ${item.name} to cart`}
                      className="flex items-center gap-1 rounded-full bg-brand px-3.5 py-2 text-xs font-extrabold text-white"
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
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      }
    >
      <MenuPageInner />
    </Suspense>
  );
}
