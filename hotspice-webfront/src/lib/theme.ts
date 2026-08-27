/**
 * Brand palette for JS consumers - charts, canvas, anything that needs a real
 * colour string rather than a CSS class.
 *
 * The @theme block in src/index.css is the source of truth for everything
 * styled through Tailwind classes. Keep these two in sync when the brand
 * colours change.
 */
export const brand = {
  primary: '#0D5969',
  primaryDark: '#093E4A',
  accent: '#2596BE',
  secondary: '#FF3D00',
  muted: '#8B5E3C',
  cream: '#F5EFE6',
  dark: '#1A1A1A',
  darkCard: '#242424',
  success: '#2ECC71',
  danger: '#EF4444',
} as const

/** Ordered series colours for multi-category charts. */
export const chartSeries = [
  brand.primary,
  brand.secondary,
  brand.accent,
  brand.success,
  brand.muted,
] as const
