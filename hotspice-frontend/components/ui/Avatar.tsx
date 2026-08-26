import { Colors, FontFamily } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AvatarProps {
  name?: string;
  imageUrl?: string | null;
  size?: number;
}

export function Avatar({ name, imageUrl, size = 56 }: AvatarProps) {
  const initial = name?.trim()?.charAt(0)?.toUpperCase();
  return (
    <View
      style={[
        styles.base,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={{ width: size, height: size, borderRadius: size / 2 }} />
      ) : initial ? (
        <Text style={[styles.initial, { fontSize: size * 0.4 }]}>{initial}</Text>
      ) : (
        <Ionicons name="person" size={size * 0.5} color={Colors.bg} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  initial: {
    color: Colors.bg,
    fontFamily: FontFamily.extraBold,
  },
});
