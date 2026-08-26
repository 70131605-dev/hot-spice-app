"use client";

import Link from "next/link";
import { ChevronRight, ListOrdered, LogOut, MapPin, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      await logout();
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-6">
      <h1 className="text-2xl font-extrabold text-[#1a1a1a]">My Profile</h1>

      <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand">
          <UserIcon size={28} className="text-white" />
        </span>
        <div>
          <p className="font-extrabold text-[#1a1a1a]">{user?.name}</p>
          <p className="text-sm text-[#888]">{user?.email}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <Link
          href="/addresses"
          className="flex items-center gap-3 border-b border-[#eee] p-4"
        >
          <MapPin size={20} className="text-brand" />
          <span className="flex-1 font-semibold text-[#1a1a1a]">
            My Addresses
          </span>
          <ChevronRight size={18} className="text-[#999]" />
        </Link>
        <Link href="/orders" className="flex items-center gap-3 border-b border-[#eee] p-4">
          <ListOrdered size={20} className="text-brand" />
          <span className="flex-1 font-semibold text-[#1a1a1a]">
            My Orders
          </span>
          <ChevronRight size={18} className="text-[#999]" />
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 p-4 text-left"
        >
          <LogOut size={20} className="text-brand" />
          <span className="flex-1 font-semibold text-brand">Log Out</span>
        </button>
      </div>
    </div>
  );
}
