import {
  Beef,
  CupSoda,
  Flame,
  IceCreamCone,
  Sandwich,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  burgers: Sandwich,
  combos: UtensilsCrossed,
  chicken: Flame,
  beverages: CupSoda,
  desserts: IceCreamCone,
};

export function getCategoryIcon(slug: string): LucideIcon {
  return ICONS[slug] ?? Beef;
}

export function CategoryIcon({
  slug,
  size = 20,
  className,
}: {
  slug: string;
  size?: number;
  className?: string;
}) {
  const Icon = getCategoryIcon(slug);
  return <Icon size={size} className={className} />;
}
