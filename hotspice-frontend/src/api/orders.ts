import { CartItem } from "@/src/context/CartContext";
import apiClient from "./client";

export interface OrderItem {
  id: number;
  item_name: string;
  item_price: string;
  quantity: number;
  line_total: string;
}

export interface Order {
  id: number;
  order_number: string;
  order_type: "delivery" | "pickup";
  status: string;
  subtotal: string;
  delivery_fee: string;
  coupon_code: string | null;
  discount_amount: string;
  total: string;
  delivery_address: string | null;
  notes: string | null;
  created_at: string;
  items: OrderItem[];
}

interface PlaceOrderParams {
  orderType: "delivery" | "pickup";
  deliveryAddress?: string;
  notes?: string;
  cartItems: CartItem[];
  couponCode?: string;
}

export const placeOrder = async ({
  orderType,
  deliveryAddress,
  notes,
  cartItems,
  couponCode,
}: PlaceOrderParams): Promise<Order> => {
  const response = await apiClient.post("/orders", {
    order_type: orderType,
    delivery_address: deliveryAddress,
    notes,
    items: cartItems.map((item) => ({
      menu_item_id: item.menuItem.id,
      quantity: item.quantity,
    })),
    ...(couponCode ? { coupon_code: couponCode } : {}),
  });
  return response.data;
};

export const getMyOrders = async (): Promise<Order[]> => {
  const response = await apiClient.get("/orders");
  return response.data;
};
