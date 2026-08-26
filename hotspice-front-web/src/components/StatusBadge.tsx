import { STATUS_COLORS, STATUS_LABELS } from "@/lib/constants";
import type { OrderStatus } from "@/types";

export function StatusBadge({ status }: { status: OrderStatus }) {
  const color = STATUS_COLORS[status] ?? "#999";
  const label = STATUS_LABELS[status] ?? status;
  return (
    <span
      className="rounded-full px-3 py-1 text-xs font-bold text-white"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}
