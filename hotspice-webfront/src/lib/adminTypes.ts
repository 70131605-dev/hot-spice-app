export type AdminOrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled'

export type AdminOrderItem = {
  id: number
  menu_item_id: number
  item_name: string
  item_price: string
  quantity: number
  line_total: string
}

export type AdminOrderCustomer = {
  id: number
  name: string
  email: string
  phone: string
}

export type AdminRider = {
  id: number
  name: string
  phone: string
  is_active: boolean
  active_orders_count?: number
  orders?: AdminOrder[]
}

export type AdminOrder = {
  id: number
  order_number: string
  order_type: 'delivery' | 'pickup'
  status: AdminOrderStatus
  subtotal: string
  delivery_fee: string
  coupon_code: string | null
  discount_amount: string
  total: string
  delivery_address: string | null
  notes: string | null
  created_at: string
  rider_id: number | null
  rider: AdminRider | null
  user: AdminOrderCustomer
  items: AdminOrderItem[]
}

export const ORDER_STATUSES: AdminOrderStatus[] = [
  'pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled',
]

export const ORDER_STATUS_LABEL: Record<AdminOrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export const ORDER_STATUS_COLOR: Record<AdminOrderStatus, { color: string; bg: string }> = {
  pending: { color: 'text-secondary', bg: 'bg-secondary/10' },
  confirmed: { color: 'text-accent', bg: 'bg-accent/10' },
  preparing: { color: 'text-accent', bg: 'bg-accent/10' },
  out_for_delivery: { color: 'text-primary', bg: 'bg-primary/10' },
  delivered: { color: 'text-success', bg: 'bg-success/10' },
  cancelled: { color: 'text-red-400', bg: 'bg-red-500/10' },
}

export type AdminCategory = {
  id: number
  name: string
  slug: string
  description: string | null
  icon: string | null
  image: string | null
  sort_order: number
  is_active: boolean
  menu_items_count?: number
}

export type AdminMenuItem = {
  id: number
  category_id: number
  name: string
  slug: string
  description: string | null
  price: string
  image: string | null
  calories: number | null
  prep_time: number | null
  tags: string[] | null
  rating: string
  rating_count: number
  is_available: boolean
  is_featured: boolean
  is_special: boolean
  category: AdminCategory
}
