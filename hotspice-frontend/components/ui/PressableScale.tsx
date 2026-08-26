import * as Haptics from "expo-haptics";
import React from "react";
import { GestureResponderEvent, Pressable, PressableProps, StyleProp, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PressableScaleProps extends Omit<PressableProps, "style"> {
  scaleTo?: number;
  haptic?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/** Pressable + spring scale-down, the mobile equivalent of the site's
 * `hover:`/`whileHover` press states — every button/card/icon that had a
 * hover effect on the website should use this instead of a bare Pressable. */
export function PressableScale({
  scaleTo = 0.96,
  haptic = false,
  style,
  onPressIn,
  onPressOut,
  onPress,
  children,
  disabled,
  ...rest
}: PressableScaleProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePressIn = (e: GestureResponderEvent) => {
    scale.value = withSpring(scaleTo, { damping: 16, stiffness: 380 });
    onPressIn?.(e);
  };
  const handlePressOut = (e: GestureResponderEvent) => {
    scale.value = withSpring(1, { damping: 14, stiffness: 300 });
    onPressOut?.(e);
  };
  const handlePress = (e: GestureResponderEvent) => {
    if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.(e);
  };

  return (
    <AnimatedPressable
      disabled={disabled}
      style={[animatedStyle, style, disabled ? { opacity: 0.5 } : null]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
}
