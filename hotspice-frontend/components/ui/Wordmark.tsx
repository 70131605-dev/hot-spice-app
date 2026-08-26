import { Image } from "expo-image";
import React from "react";

interface WordmarkProps {
  size?: number;
  light?: boolean; // kept for call-site compatibility; the logo art is fixed-color
}

// assets/images/logo.jpeg is 1374x1145px
const LOGO_ASPECT_RATIO = 1374 / 1145;

/** The restaurant's badge logo (mascot + "Hot N Spicy Pizza & Grill" lockup). */
export function Wordmark({ size = 20 }: WordmarkProps) {
  const height = size * 1.4;
  return (
    <Image
      source={require("@/assets/images/logo.jpeg")}
      style={{ width: height * LOGO_ASPECT_RATIO, height }}
      contentFit="contain"
    />
  );
}
