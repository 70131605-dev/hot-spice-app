"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Trash2, UtensilsCrossed } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice } =
    useCart();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <ShoppingCart size={56} className="text-[#ccc]" />
        <p className="text-[#888]">Your cart is empty</p>
        <Link
          href="/menu"
          className="rounded-[10px] bg-brand px-6 py-3 font-bold text-white"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 pb-28 lg:grid-cols-3 lg:items-start lg:pb-8">
      <div className="flex flex-col gap-5 lg:col-span-2">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1a1a1a]">
            Items From Your Cart
          </h1>
          <p className="text-sm text-[#888]">
            {totalItems} item{totalItems !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {items.map(({ menuItem, quantity }) => (
            <div
              key={menuItem.id}
              className="flex gap-3 rounded-2xl bg-white p-3 shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
            >
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#fafafa]">
                {menuItem.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={menuItem.image}
                    alt={menuItem.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UtensilsCrossed size={24} className="text-[#ccc]" />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-[#1a1a1a]">{menuItem.name}</p>
                    <p className="text-sm text-[#888]">
                      {formatPrice(menuItem.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(menuItem.id)}
                    aria-label={`Remove ${menuItem.name}`}
                    className="text-[#999] hover:text-brand"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="flex items-center gap-3 self-start rounded-full border border-[#ddd] px-2.5 py-1">
                  <button
                    onClick={() => updateQuantity(menuItem.id, quantity - 1)}
                    aria-label="Decrease quantity"
                    className="text-brand"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-5 text-center text-sm font-bold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(menuItem.id, quantity + 1)}
                    aria-label="Increase quantity"
                    className="text-brand"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:sticky lg:top-20">
        <div className="hidden rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] lg:block">
          <h2 className="mb-4 text-lg font-extrabold text-[#1a1a1a]">
            Order Summary
          </h2>
          <div className="flex flex-col gap-2 text-sm text-[#555]">
            {items.map(({ menuItem, quantity }) => (
              <div key={menuItem.id} className="flex justify-between">
                <span>
                  {quantity} × {menuItem.name}
                </span>
                <span>{formatPrice(quantity * Number(menuItem.price))}</span>
              </div>
            ))}
          </div>
          <div className="my-4 border-t border-[#eee]" />
          <div className="flex justify-between font-extrabold text-[#1a1a1a]">
            <span>Subtotal</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <p className="mt-1 text-xs text-[#999]">
            Delivery fee calculated at checkout
          </p>
          <button
            onClick={() => router.push("/checkout")}
            className="mt-4 w-full rounded-[10px] bg-brand py-3.5 font-bold text-white"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-[#eee] bg-white p-4 md:bottom-0 lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <p className="text-xs text-[#888]">Subtotal</p>
            <p className="text-lg font-extrabold text-[#1a1a1a]">
              {formatPrice(totalPrice)}
            </p>
          </div>
          <button
            onClick={() => router.push("/checkout")}
            className="flex-1 rounded-[10px] bg-brand py-4 font-bold text-white sm:flex-none sm:px-10"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
