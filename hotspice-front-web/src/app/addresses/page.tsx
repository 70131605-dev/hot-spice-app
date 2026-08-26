"use client";

import { useEffect, useState, type FormEvent } from "react";
import { MapPinOff, Plus, X } from "lucide-react";
import {
  createAddress,
  deleteAddress,
  fetchAddresses,
  setDefaultAddress,
} from "@/lib/api";
import type { Address } from "@/types";
import { Spinner } from "@/components/Spinner";
import { CONTENT_WIDTH_CLASS } from "@/lib/constants";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [label, setLabel] = useState("Home");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetchAddresses()
      .then(setAddresses)
      .catch(() => setAddresses([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openModal = () => {
    setLabel("Home");
    setAddressLine("");
    setCity("");
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!addressLine.trim()) {
      setError("Please enter an address");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await createAddress({
        label: label.trim() || "Home",
        address_line: addressLine.trim(),
        city: city.trim() || undefined,
        is_default: addresses.length === 0,
      });
      setModalOpen(false);
      load();
    } catch {
      setError("Failed to save address. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this address?")) return;
    await deleteAddress(id);
    load();
  };

  const handleSetDefault = async (id: number) => {
    await setDefaultAddress(id);
    load();
  };

  return (
    <div className="flex flex-col gap-5 pb-24">
      <h1 className="text-2xl font-extrabold text-[#1a1a1a]">My Addresses</h1>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : addresses.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <MapPinOff size={48} className="text-[#ccc]" />
          <p className="text-[#888]">No saved addresses yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="rounded-2xl bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
            >
              <div className="flex items-center gap-2">
                <p className="font-bold text-[#1a1a1a]">{addr.label}</p>
                {addr.is_default && (
                  <span className="rounded-full bg-brand-tint px-2 py-0.5 text-xs font-bold text-brand">
                    Default
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-[#666]">{addr.address_line}</p>
              {addr.city && (
                <p className="text-sm text-[#888]">{addr.city}</p>
              )}
              <div className="mt-2 flex gap-4">
                {!addr.is_default && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-sm font-bold text-brand"
                  >
                    Set as Default
                  </button>
                )}
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-sm font-bold text-[#999]"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={openModal}
        className={`fixed inset-x-4 bottom-20 z-30 mx-auto flex ${CONTENT_WIDTH_CLASS} items-center justify-center gap-2 rounded-[10px] bg-brand py-4 font-bold text-white md:bottom-6`}
      >
        <Plus size={18} />
        Add New Address
      </button>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
          <div className="w-full max-w-md rounded-t-2xl bg-white p-5 sm:rounded-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-[#1a1a1a]">
                Add New Address
              </h2>
              <button onClick={() => setModalOpen(false)} aria-label="Close">
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleSave} className="flex flex-col gap-3">
              {error && (
                <p className="text-sm font-semibold text-brand">{error}</p>
              )}
              <div>
                <label className="mb-1 block text-sm font-bold text-[#1a1a1a]">
                  Label
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full rounded-lg border border-[#ddd] p-3 outline-none focus:border-brand"
                  placeholder="Home"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-[#1a1a1a]">
                  Address
                </label>
                <textarea
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-[#ddd] p-3 outline-none focus:border-brand"
                  placeholder="House #, street, area..."
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-[#1a1a1a]">
                  City (optional)
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-lg border border-[#ddd] p-3 outline-none focus:border-brand"
                  placeholder="Lahore"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="mt-2 rounded-[10px] bg-brand py-3.5 font-bold text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Address"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
