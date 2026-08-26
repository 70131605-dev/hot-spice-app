"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu as MenuIcon, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { NavDrawer } from "@/components/NavDrawer";
import { CONTENT_WIDTH_CLASS } from "@/lib/constants";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/orders", label: "Orders" },
  { href: "/favorites", label: "Favorites" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { totalItems } = useCart();
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#eee] bg-white">
        <div
          className={`mx-auto flex ${CONTENT_WIDTH_CLASS} items-center gap-5 px-4 py-5`}
        >
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-[#fafafa]"
          >
            <MenuIcon size={24} className="text-[#1a1a1a]" />
          </button>
          <Link href="/" className="flex items-center whitespace-nowrap" aria-label="Hot N Spicy Pizza & Grill">
            <Image
              src="/logo.jpeg"
              alt="Hot N Spicy Pizza & Grill"
              width={1374}
              height={1145}
              priority
              className="h-12 w-auto"
            />
          </Link>
          <nav className="ml-6 hidden flex-1 items-center gap-7 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-base font-bold ${
                  pathname === link.href
                    ? "text-brand"
                    : "text-[#555] hover:text-brand"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/cart"
              className="relative flex h-11 w-11 items-center justify-center rounded-full bg-brand-tint"
              aria-label="Cart"
            >
              <ShoppingCart size={22} className="text-brand" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-xs font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link
              href="/profile"
              className="hidden h-11 w-11 items-center justify-center rounded-full bg-[#fafafa] text-base font-bold text-[#1a1a1a] md:flex"
              aria-label="Profile"
            >
              👤
            </Link>
          </div>
        </div>
      </header>
      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
