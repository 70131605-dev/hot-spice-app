export function formatPrice(value: string | number): string {
  const num = typeof value === "string" ? Number(value) : value;
  return `Rs. ${Math.round(num).toLocaleString("en-PK")}`;
}

export function toNumber(value: string | number): number {
  return typeof value === "string" ? Number(value) : value;
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  const day = date.toLocaleDateString("en-GB", { day: "2-digit" });
  const month = date.toLocaleDateString("en-GB", { month: "short" });
  const year = date.getFullYear();
  const time = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${day} ${month} ${year}, ${time}`;
}
