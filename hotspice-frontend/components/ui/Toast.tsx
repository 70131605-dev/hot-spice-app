import { Colors, FontFamily, FontSize, Radius, Spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ToastOptions {
  icon?: keyof typeof Ionicons.glyphMap;
  position?: "top" | "bottom";
}

interface ToastContextValue {
  showToast: (message: string, opts?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

/** Shared toast pill (top-center by default, or bottom via `position`) —
 * the mobile equivalent of the site's rounded toast (add-to-cart, favorites,
 * subscribe, etc.), styled in the brand teal. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState<keyof typeof Ionicons.glyphMap | undefined>();
  const [position, setPosition] = useState<"top" | "bottom">("top");
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-16);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string, opts?: ToastOptions) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const pos = opts?.position ?? "top";
    const offset = pos === "bottom" ? 16 : -16;
    setMessage(msg);
    setIcon(opts?.icon ?? "checkmark-circle");
    setPosition(pos);
    translateY.value = offset;
    opacity.value = withTiming(1, { duration: 220 });
    translateY.value = withSpring(0, { damping: 16, stiffness: 220 });
    timeoutRef.current = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 220 });
      translateY.value = withTiming(offset, { duration: 220 });
    }, 2600);
  }, [opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.toast,
          position === "bottom" ? { bottom: insets.bottom + 70 } : { top: insets.top + 8 },
          animatedStyle,
        ]}
      >
        {icon ? <Ionicons name={icon} size={15} color={Colors.bg} style={{ marginRight: 7 }} /> : null}
        <Text style={styles.text} numberOfLines={2}>
          {message}
        </Text>
      </Animated.View>
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 3,
    borderRadius: Radius.full,
    zIndex: 999,
    maxWidth: "88%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  text: {
    color: Colors.bg,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    flexShrink: 1,
  },
});
