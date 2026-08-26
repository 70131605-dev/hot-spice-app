"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { formatPrice, toNumber } from "@/lib/format";
import { Spinner } from "@/components/Spinner";

function OrderSuccessInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderNumber = searchParams.get("order_number");
  const subtotal = searchParams.get("subtotal");
  const deliveryFee = searchParams.get("delivery_fee");
  const discountAmount = searchParams.get("discount_amount");
  const total = searchParams.get("total");
  const couponCode = searchParams.get("coupon_code");

  const hasSummary = subtotal && deliveryFee && total;
  const discount = discountAmount ? toNumber(discountAmount) : 0;

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-12 text-center">
      <CheckCircle2 size={72} className="text-[#22c55e]" />
      <h1 className="text-2xl font-extrabold text-[#1a1a1a]">Order Placed!</h1>
      {orderNumber && (
        <p className="font-bold text-brand">Order #{orderNumber}</p>
      )}
      <p className="text-[#666]">
        Your order has been received and is being prepared.
      </p>

      {hasSummary && (
        <div className="w-full rounded-2xl bg-white p-4 text-left shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          <div className="flex justify-between text-sm text-[#555]">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal!)}</span>
          </div>
          <div className="mt-1 flex justify-between text-sm text-[#555]">
            <span>Delivery Fee</span>
            <span>{formatPrice(deliveryFee!)}</span>
          </div>
          {discount > 0 && (
            <div className="mt-1 flex justify-between text-sm font-semibold text-[#22c55e]">
              <span>Discount {couponCode ? `(${couponCode})` : ""}</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="my-3 border-t border-[#eee]" />
          <div className="flex justify-between font-extrabold text-[#1a1a1a]">
            <span>Total</span>
            <span>{formatPrice(total!)}</span>
          </div>
        </div>
      )}

      <button
        onClick={() => router.push("/orders")}
        className="mt-2 w-full rounded-[10px] bg-brand py-4 font-bold text-white"
      >
        Track My Order
      </button>
      <Link href="/" className="text-sm font-semibold text-[#666]">
        Back to Home
      </Link>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      }
    >
      <OrderSuccessInner />
    </Suspense>
  );
}
