import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

interface FadeInViewProps {
  children: React.ReactNode;
  index?: number;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}

/** Mount-triggered stagger reveal — the mobile equivalent of the site's
 * scroll-triggered `FadeIn`/`useInView` pattern (RN has no lightweight
 * viewport-trigger, so this fires on mount, staggered by `index`). */
export function FadeInView({ children, index = 0, delay = 0, style }: FadeInViewProps) {
  return (
    <Animated.View
      entering={FadeInUp.delay(delay + index * 70)
        .duration(450)
        .springify()
        .damping(18)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}
