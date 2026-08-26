"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bike, Store, Tag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { createOrder, fetchAddresses, getErrorMessage, getFieldErrors } from "@/lib/api";
import type { Address, OrderType } from "@/types";
import { formatPrice, toNumber } from "@/lib/format";
import { DELIVERY_FEE } from "@/lib/constants";
import { Spinner } from "@/components/Spinner";

const OTHER_ADDRESS = "other";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const [orderType, setOrderType] = useState<OrderType>("delivery");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<number | typeof OTHER_ADDRESS | null>(null);
  const [customAddress, setCustomAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAddresses()
      .then((data) => {
        setAddresses(data);
        const def = data.find((a) => a.is_default) ?? data[0];
        if (def) setSelectedAddressId(def.id);
      })
      .catch(() => setAddresses([]))
      .finally(() => setAddressesLoading(false));
  }, []);

  const deliveryFee = orderType === "delivery" ? DELIVERY_FEE : 0;
  const total = totalPrice + deliveryFee;

  const handleSubmit = async () => {
    setFormError(null);
    setCouponError(null);

    let deliveryAddress: string | undefined;
    if (orderType === "delivery") {
      if (selectedAddressId === OTHER_ADDRESS) {
        if (!customAddress.trim()) {
          setFormError("Please enter a delivery address");
          return;
        }
        deliveryAddress = customAddress.trim();
      } else if (selectedAddressId != null) {
        const addr = addresses.find((a) => a.id === selectedAddressId);
        deliveryAddress = addr
          ? `${addr.label} - ${addr.address_line}`
          : undefined;
      } else {
        setFormError("Please select or enter a delivery address");
        return;
      }
    }

    setSubmitting(true);
    try {
      const order = await createOrder({
        order_type: orderType,
        delivery_address: deliveryAddress,
        notes: notes.trim() || undefined,
        items: items.map((i) => ({
          menu_item_id: i.menuItem.id,
          quantity: i.quantity,
        })),
        coupon_code: couponCode.trim() || undefined,
      });

      clearCart();

      const params = new URLSearchParams({
        order_number: order.order_number,
        subtotal: order.subtotal,
        delivery_fee: order.delivery_fee,
        discount_amount: order.discount_amount,
        total: order.total,
        ...(order.coupon_code ? { coupon_code: order.coupon_code } : {}),
      });
      router.push(`/order-success?${params.toString()}`);
    } catch (err) {
      const fieldErrors = getFieldErrors(err);
      if (fieldErrors?.coupon_code?.[0]) {
        setShowCoupon(true);
        setCouponError(fieldErrors.coupon_code[0]);
      } else {
        setFormError(getErrorMessage(err, "Failed to place order. Please try again."));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const orderSummary = (
    <div className="rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      <h2 className="mb-4 text-lg font-extrabold text-[#1a1a1a]">
        Order Summary
      </h2>
      <div className="flex flex-col gap-2 text-sm">
        {items.map((i) => (
          <div key={i.menuItem.id} className="flex justify-between text-[#555]">
            <span>
              {i.quantity} × {i.menuItem.name}
            </span>
            <span>{formatPrice(toNumber(i.menuItem.price) * i.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="my-3 border-t border-[#eee]" />
      <div className="flex justify-between text-sm text-[#555]">
        <span>Subtotal</span>
        <span>{formatPrice(totalPrice)}</span>
      </div>
      <div className="mt-1 flex justify-between text-sm text-[#555]">
        <span>Delivery Fee</span>
        <span>{formatPrice(deliveryFee)}</span>
      </div>
      <div className="my-3 border-t border-[#eee]" />
      <div className="flex justify-between font-extrabold text-[#1a1a1a]">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>

      {formError && (
        <p className="mt-3 text-sm font-semibold text-brand" role="alert">
          {formError}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting || items.length === 0}
        className="mt-4 flex w-full items-center justify-center rounded-[10px] bg-brand py-3.5 font-bold text-white disabled:opacity-60"
      >
        {submitting ? (
          <span className="h-5 w-5 animate-spin-slow rounded-full border-2 border-white/40 border-t-white" />
        ) : (
          `Place Order — ${formatPrice(total)}`
        )}
      </button>
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-6 pb-8 lg:grid-cols-3 lg:items-start">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <h1 className="text-2xl font-extrabold text-[#1a1a1a]">Checkout</h1>

        <section>
          <h2 className="mb-2 font-bold text-[#1a1a1a]">Order Type</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setOrderType("delivery")}
              className={`flex items-center justify-center gap-2 rounded-[10px] py-3 font-bold ${
                orderType === "delivery"
                  ? "bg-brand text-white"
                  : "border border-brand text-brand"
              }`}
            >
              <Bike size={18} />
              Delivery
            </button>
            <button
              onClick={() => setOrderType("pickup")}
              className={`flex items-center justify-center gap-2 rounded-[10px] py-3 font-bold ${
                orderType === "pickup"
                  ? "bg-brand text-white"
                  : "border border-brand text-brand"
              }`}
            >
              <Store size={18} />
              Pickup
            </button>
          </div>
        </section>

        {orderType === "delivery" && (
          <section>
            <h2 className="mb-2 font-bold text-[#1a1a1a]">Delivery Address</h2>
            {addressesLoading ? (
              <div className="flex justify-center py-6">
                <Spinner size={24} />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {addresses.length === 0 && selectedAddressId !== OTHER_ADDRESS && (
                  <Link
                    href="/addresses"
                    className="rounded-xl border-2 border-dashed border-[#ddd] p-4 text-center text-sm font-semibold text-[#888]"
                  >
                    Save an address for next time
                  </Link>
                )}
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#eee] bg-white p-3"
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-1 accent-brand"
                    />
                    <div>
                      <p className="font-bold text-[#1a1a1a]">{addr.label}</p>
                      <p className="text-sm text-[#888]">{addr.address_line}</p>
                    </div>
                  </label>
                ))}
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#eee] bg-white p-3">
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddressId === OTHER_ADDRESS}
                    onChange={() => setSelectedAddressId(OTHER_ADDRESS)}
                    className="mt-1 accent-brand"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-[#1a1a1a]">
                      Use a different address
                    </p>
                    {selectedAddressId === OTHER_ADDRESS && (
                      <textarea
                        value={customAddress}
                        onChange={(e) => setCustomAddress(e.target.value)}
                        placeholder="Enter your delivery address"
                        rows={2}
                        className="mt-2 w-full rounded-lg border border-[#ddd] p-2 text-sm outline-none focus:border-brand"
                      />
                    )}
                  </div>
                </label>
              </div>
            )}
          </section>
        )}

        <section>
          <h2 className="mb-2 font-bold text-[#1a1a1a]">
            Order Notes (optional)
          </h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="E.g. Extra spicy, no onions..."
            rows={2}
            className="w-full rounded-lg border border-[#ddd] p-3 text-sm outline-none focus:border-brand"
          />
        </section>

        <section>
          {!showCoupon ? (
            <button
              onClick={() => setShowCoupon(true)}
              className="flex items-center gap-2 text-sm font-bold text-brand"
            >
              <Tag size={16} />
              Have a coupon?
            </button>
          ) : (
            <div>
              <h2 className="mb-2 flex items-center gap-2 font-bold text-[#1a1a1a]">
                <Tag size={16} className="text-brand" />
                Coupon Code
              </h2>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value.toUpperCase());
                  setCouponError(null);
                }}
                placeholder="ENTER CODE"
                className="w-full rounded-lg border border-[#ddd] p-3 text-sm uppercase outline-none focus:border-brand"
              />
              {couponError && (
                <p className="mt-1 text-sm font-semibold text-brand">
                  {couponError}
                </p>
              )}
            </div>
          )}
        </section>

        <div className="lg:hidden">{orderSummary}</div>
      </div>

      <div className="hidden lg:sticky lg:top-20 lg:block">{orderSummary}</div>
    </div>
  );
}
