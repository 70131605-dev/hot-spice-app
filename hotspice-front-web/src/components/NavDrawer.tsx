"use client";

import Link from "next/link";
import {
  Heart,
  Info,
  ListOrdered,
  LogOut,
  MapPin,
  UtensilsCrossed,
  User as UserIcon,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const LINKS = [
  { href: "/menu", label: "Explore Menu", icon: UtensilsCrossed },
  { href: "/favorites", label: "My Favorites", icon: Heart },
  { href: "/addresses", label: "My Addresses", icon: MapPin },
  { href: "/orders", label: "My Orders", icon: ListOrdered },
  { href: "/about", label: "About Us", icon: Info },
];

export function NavDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user, logout } = useAuth();

  if (!open) return null;

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      await logout();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative flex h-full w-72 max-w-[80vw] flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#eee] bg-brand p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20">
              <UserIcon size={22} className="text-white" />
            </div>
            <div>
              <p className="font-extrabold text-white">
                {user?.name ?? "Guest"}
              </p>
              <p className="text-xs text-white/80">{user?.email ?? ""}</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close menu">
            <X size={22} className="text-white" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-3 py-3 font-semibold text-[#1a1a1a] hover:bg-brand-tint"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-tint">
                <Icon size={18} className="text-brand" />
              </span>
              {label}
            </Link>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 border-t border-[#eee] px-6 py-4 font-bold text-brand"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </div>
  );
}
