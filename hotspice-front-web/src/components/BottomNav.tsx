"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, User, UtensilsCrossed, ListOrdered } from "lucide-react";
import { useCart } from "@/context/CartContext";

const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  { href: "/orders", label: "Orders", icon: ListOrdered },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-[#eee] bg-white md:hidden">
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className="relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-semibold"
          >
            <Icon size={20} className={active ? "text-brand" : "text-[#999]"} />
            <span className={active ? "text-brand" : "text-[#999]"}>
              {label}
            </span>
            {href === "/cart" && totalItems > 0 && (
              <span className="absolute right-1/4 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
