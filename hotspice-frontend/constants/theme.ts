/**
 * Hot & Spice design tokens — ported from Restaurant-Management-Website's
 * `src/index.css` `@theme` block so the mobile app shares the same brand
 * system (colors, type scale, spacing, radius, shadows).
 */

import { Platform } from "react-native";

export const Colors = {
  primary: "#FF3D00",
  primaryDark: "#DD2C00",
  primaryLight: "#FF6E40",
  primaryTint: "#FBE9E7", // light red-tinted background for icon badges/chips
  secondary: "#0D5969",
  secondaryDark: "#0A4754",
  secondaryLight: "#3D8A9A",
  secondaryTint: "#E7EEF0", // light teal-tinted background for icon badges/chips

  bg: "#EDE8D0", // app background (beige)
  cream: "#EDE8D0",
  creamDark: "#F5EDE0",
  surface: "#FFFFFF", // card background
  fg: "#333333", // primary body text
  dark: "#1A1A1A", // near-black headings / dark section bg
  darkCard: "#242424",
  darkSurface: "#2E2E2E",

  muted: "#8B7355", // warm secondary text (used a lot on the site)
  mutedLight: "#C4A882",

  text: "#0D5969", // headings/body copy use the brand teal instead of black
  textSecondary: "#555555",
  textTertiary: "#888888",
  textQuaternary: "#999999",
  border: "#EEEEEE",
  borderStrong: "#DDDDDD",
  bgAlt: "#FAFAFA",
  bgMuted: "#F5F5F5",

  success: "#2ECC71",
  white: "#FFFFFF",
  black: "#000000",

  // Order status pill colors
  status: {
    pending: "#F59E0B",
    confirmed: "#3B82F6",
    preparing: "#8B5CF6",
    out_for_delivery: "#06B6D4",
    delivered: "#22C55E",
    cancelled: "#EF4444",
  },
} as const;

export const FontFamily = {
  regular: "Poppins_400Regular",
  medium: "Poppins_500Medium",
  semiBold: "Poppins_600SemiBold",
  bold: "Poppins_700Bold",
  extraBold: "Poppins_800ExtraBold",
  black: "Poppins_900Black",
  italic: "Poppins_400Regular_Italic",
  wordmark: "HoltwoodOneSC_400Regular",
} as const;

export const FontSize = {
  xs: 11,
  sm: 12,
  base: 13,
  md: 14,
  lg: 15,
  xl: 16,
  "2xl": 17,
  "3xl": 18,
  "4xl": 20,
  "5xl": 22,
  "6xl": 24,
  "7xl": 28,
  "8xl": 32,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
} as const;

export const Radius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
  "2xl": 16,
  "3xl": 20,
  full: 999,
} as const;

// RN shadow + Android elevation, translated from the site's
// `.shadow-warm` / `.shadow-warm-lg` utility classes.
export const Shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  warm: {
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  warmLg: {
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
  floating: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

// --- Legacy Expo-template tokens kept only because `hooks/use-color-scheme`
// consumers expect a `Colors.light`/`Colors.dark` shape for native-stack
// chrome theming. Screen content should use the brand tokens above instead.
const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const NavColors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
