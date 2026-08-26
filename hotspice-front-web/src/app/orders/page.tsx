"use client";

import { useEffect, useState } from "react";
import { Receipt, RotateCw } from "lucide-react";
import { fetchOrders } from "@/lib/api";
import type { Order } from "@/types";
import { formatDate, formatPrice } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";
import { Spinner } from "@/components/Spinner";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="flex flex-col gap-5 pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-[#1a1a1a]">My Orders</h1>
        <button
          onClick={load}
          aria-label="Refresh orders"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-tint text-brand"
        >
          <RotateCw size={16} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-24 text-center">
          <Receipt size={48} className="text-[#ccc]" />
          <p className="text-[#888]">No orders yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
            >
              <div className="flex items-center justify-between">
                <p className="font-bold text-[#1a1a1a]">
                  #{order.order_number}
                </p>
                <StatusBadge status={order.status} />
              </div>
              <p className="mt-0.5 text-xs text-[#888]">
                {formatDate(order.created_at)}
              </p>
              <div className="my-3 border-t border-[#eee]" />
              <div className="flex flex-col gap-1.5">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm text-[#555]"
                  >
                    <span>
                      {item.quantity}x {item.item_name}
                    </span>
                    <span>{formatPrice(item.line_total)}</span>
                  </div>
                ))}
              </div>
              <div className="my-3 border-t border-[#eee]" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#666]">
                  {order.order_type === "delivery" ? "🛵 Delivery" : "🏬 Pickup"}
                </span>
                <span className="font-extrabold text-brand">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
