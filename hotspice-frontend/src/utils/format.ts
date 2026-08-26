/** Shared formatting helpers — PKR pricing (no decimals) and en-GB dates,
 * matching the mobile app's spec and the site's `formatPrice`/`formatDate`. */

export function formatPrice(price: number | string): string {
  const n = typeof price === "string" ? Number(price) : price;
  return `Rs. ${Math.round(Number.isFinite(n) ? n : 0).toLocaleString("en-US")}`;
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  const day = d.toLocaleDateString("en-GB", { day: "2-digit" });
  const month = d.toLocaleDateString("en-GB", { month: "short" });
  const year = d.getFullYear();
  const time = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${day} ${month} ${year}, ${time}`;
}
