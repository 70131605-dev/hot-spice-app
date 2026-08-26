import { Colors, FontFamily, FontSize } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { PressableScale } from "./PressableScale";

interface StepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  size?: "sm" | "md";
  light?: boolean; // use on colored/orange card backgrounds
  style?: StyleProp<ViewStyle>;
}

export function Stepper({ value, onIncrement, onDecrement, min = 0, size = "md", light = false, style }: StepperProps) {
  const dim = size === "sm" ? 26 : 32;
  return (
    <View style={[styles.row, style]}>
      <PressableScale
        haptic
        scaleTo={0.85}
        disabled={value <= min}
        onPress={onDecrement}
        style={[styles.btn, { width: dim, height: dim, borderRadius: dim / 2 }]}
      >
        <Ionicons name="remove" size={dim * 0.55} color={value <= min ? Colors.textQuaternary : Colors.secondary} />
      </PressableScale>
      <Text
        style={[
          styles.value,
          light && { color: Colors.bg },
          size === "sm" && { fontSize: FontSize.md, minWidth: 20 },
        ]}
      >
        {value}
      </Text>
      <PressableScale
        haptic
        scaleTo={0.85}
        onPress={onIncrement}
        style={[styles.btn, styles.btnFilled, { width: dim, height: dim, borderRadius: dim / 2 }]}
      >
        <Ionicons name="add" size={dim * 0.55} color={Colors.bg} />
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  btn: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.secondary,
    backgroundColor: Colors.white,
  },
  btnFilled: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  value: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.text,
    minWidth: 24,
    textAlign: "center",
  },
});
