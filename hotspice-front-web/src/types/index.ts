export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
}

export interface MenuItem {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  image: string | null;
  calories: number | null;
  is_featured: boolean;
  category: Category;
}

export interface Address {
  id: number;
  label: string;
  address_line: string;
  city: string | null;
  is_default: boolean;
}

export interface OrderItem {
  id: number;
  item_name: string;
  item_price: string;
  quantity: number;
  line_total: string;
}

export type OrderType = "delivery" | "pickup";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface Order {
  id: number;
  order_number: string;
  order_type: OrderType;
  status: OrderStatus;
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

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface CreateOrderPayload {
  order_type: OrderType;
  delivery_address?: string;
  notes?: string;
  items: { menu_item_id: number; quantity: number }[];
  coupon_code?: string;
}
