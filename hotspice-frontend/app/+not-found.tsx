import { Button } from "@/components/ui/Button";
import { Colors, FontFamily, FontSize, Spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

function FloatingEmoji({ emoji, delay }: { emoji: string; delay: number }) {
  const y = useSharedValue(0);

  useEffect(() => {
    y.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-14, { duration: 900 }),
          withTiming(0, { duration: 900 })
        ),
        -1,
        false
      )
    );
  }, [y, delay]);

  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));

  return <Animated.Text style={[styles.emoji, style]}>{emoji}</Animated.Text>;
}

export default function NotFoundScreen() {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    opacity.value = withTiming(1, { duration: 400 });
  }, [scale, opacity]);

  const codeStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <Animated.Text style={[styles.code, codeStyle]}>404</Animated.Text>
      <Ionicons name="restaurant-outline" size={40} color={Colors.secondary} style={{ marginBottom: Spacing.md }} />
      <Text style={styles.title}>Page Not Found</Text>
      <Text style={styles.subtitle}>
        Looks like this dish isn&apos;t on the menu. Let&apos;s get you back to something delicious.
      </Text>

      <Button title="Back to Home" onPress={() => router.replace("/(tabs)")} style={{ marginTop: Spacing.xl, maxWidth: 240 }} fullWidth={false} />
      <Link href="/(tabs)/menu" style={styles.link}>
        Browse Menu
      </Link>

      <View style={styles.emojiRow}>
        <FloatingEmoji emoji="🍔" delay={0} />
        <FloatingEmoji emoji="🌶️" delay={300} />
        <FloatingEmoji emoji="🍰" delay={600} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing["2xl"],
  },
  code: {
    fontFamily: FontFamily.black,
    fontSize: 96,
    color: Colors.secondary,
  },
  title: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize["6xl"],
    color: Colors.secondary,
    marginTop: Spacing.sm,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.muted,
    textAlign: "center",
    marginTop: Spacing.sm,
    lineHeight: 20,
  },
  link: {
    marginTop: Spacing.lg,
    color: Colors.secondary,
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
  },
  emojiRow: {
    flexDirection: "row",
    gap: Spacing["2xl"],
    marginTop: Spacing["4xl"],
  },
  emoji: {
    fontSize: 32,
  },
});
