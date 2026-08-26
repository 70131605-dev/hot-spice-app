export const DELIVERY_FEE = 150;
export const FREE_DELIVERY_THRESHOLD = 1500;

// Shared content width so the navbar, footer, and page content never drift apart.
export const CONTENT_WIDTH_CLASS = "max-w-[85rem]";

export const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  preparing: "#8b5cf6",
  out_for_delivery: "#06b6d4",
  delivered: "#22c55e",
  cancelled: "#ef4444",
};

export const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
