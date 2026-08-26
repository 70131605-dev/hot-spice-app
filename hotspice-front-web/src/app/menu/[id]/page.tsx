"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Flame, Heart, Minus, Plus, UtensilsCrossed } from "lucide-react";
import { fetchMenuItems } from "@/lib/api";
import type { MenuItem } from "@/types";
import { formatPrice, toNumber } from "@/lib/format";
import { Spinner } from "@/components/Spinner";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";

export default function ItemDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    fetchMenuItems()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  const item = items.find((i) => String(i.id) === params.id);

  if (!item) {
    return <p className="py-16 text-center text-[#999]">Item not found.</p>;
  }

  const fav = isFavorite(item.id);
  const total = toNumber(item.price) * quantity;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(item);
    }
    router.back();
  };

  return (
    <div className="grid grid-cols-1 gap-8 pb-28 lg:grid-cols-2 lg:items-start lg:pb-8">
      <div className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded-2xl bg-[#fafafa] sm:h-96 lg:sticky lg:top-20 lg:h-[28rem]">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <UtensilsCrossed size={48} className="text-[#ccc]" />
        )}
        <button
          onClick={() => toggleFavorite(item)}
          aria-label="Toggle favorite"
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow"
        >
          <Heart
            size={20}
            className={fav ? "fill-brand text-brand" : "text-[#999]"}
          />
        </button>
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1a1a1a] sm:text-3xl">
            {item.name}
          </h1>
          <p className="mt-1 text-xl font-extrabold text-brand">
            {formatPrice(item.price)}
          </p>
        </div>

        {item.description && (
          <p className="leading-relaxed text-[#555]">{item.description}</p>
        )}

        {item.calories != null && (
          <div className="flex items-center gap-2 text-sm font-semibold text-[#888]">
            <Flame size={16} className="text-brand" />
            {item.calories} cal
          </div>
        )}

        <div className="flex items-center gap-4">
          <span className="font-bold text-[#1a1a1a]">Quantity</span>
          <div className="flex items-center gap-4 rounded-full border border-[#ddd] px-3 py-1.5">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="text-brand"
            >
              <Minus size={18} />
            </button>
            <span className="w-6 text-center font-bold">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
              className="text-brand"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="hidden w-full rounded-[10px] bg-brand py-4 font-bold text-white lg:block"
        >
          Add to Cart — {formatPrice(total)}
        </button>
      </div>

      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-[#eee] bg-white p-4 md:bottom-0 lg:hidden">
        <div className="mx-auto max-w-6xl">
          <button
            onClick={handleAddToCart}
            className="w-full rounded-[10px] bg-brand py-4 font-bold text-white"
          >
            Add to Cart — {formatPrice(total)}
          </button>
        </div>
      </div>
    </div>
  );
}
