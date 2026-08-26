import { Avatar } from "@/components/ui/Avatar";
import { PressableScale } from "@/components/ui/PressableScale";
import { Wordmark } from "@/components/ui/Wordmark";
import { Colors, FontFamily, FontSize, Radius, Spacing } from "@/constants/theme";
import { useAuth } from "@/src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import { Dimensions, Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInLeft,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DRAWER_WIDTH = Math.min(Dimensions.get("window").width * 0.8, 320);

interface SideDrawerProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuLink {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}

export default function SideDrawer({ visible, onClose }: SideDrawerProps) {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const translateX = useSharedValue(-DRAWER_WIDTH);

  useEffect(() => {
    translateX.value = withTiming(visible ? 0 : -DRAWER_WIDTH, { duration: 260 });
  }, [visible, translateX]);

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const goTo = (path: string) => {
    onClose();
    router.push(path as any);
  };

  const links: MenuLink[] = [
    { icon: "heart-outline", label: "My Favorites", onPress: () => goTo("/favorites") },
    { icon: "location-outline", label: "My Addresses", onPress: () => goTo("/addresses") },
    { icon: "receipt-outline", label: "My Orders", onPress: () => goTo("/(tabs)/orders") },
    { icon: "restaurant-outline", label: "Explore Menu", onPress: () => goTo("/(tabs)/menu") },
    { icon: "calendar-outline", label: "Reserve a Table", onPress: () => goTo("/reservation") },
    { icon: "images-outline", label: "Gallery", onPress: () => goTo("/gallery") },
    { icon: "people-outline", label: "Our Chefs", onPress: () => goTo("/chefs") },
    { icon: "call-outline", label: "Contact Us", onPress: () => goTo("/contact") },
    { icon: "information-circle-outline", label: "About Us", onPress: () => goTo("/about") },
  ];

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View entering={FadeIn.duration(220)} style={StyleSheet.absoluteFill}>
          <PressableScale style={styles.backdrop} onPress={onClose} scaleTo={1} />
        </Animated.View>

        <Animated.View style={[styles.drawer, { width: DRAWER_WIDTH, paddingTop: insets.top + 20 }, drawerStyle]}>
          <View style={styles.header}>
            <Wordmark size={19} light />
          </View>

          <View style={styles.userSection}>
            {user ? (
              <>
                <Avatar name={user.name} size={52} />
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </>
            ) : (
              <Text style={styles.loginPrompt}>Login to unlock exclusive offers</Text>
            )}
          </View>

          <ScrollView
            style={styles.linksSection}
            contentContainerStyle={styles.linksSectionContent}
            showsVerticalScrollIndicator={false}
          >
            {links.map((link, i) => (
              <Animated.View key={link.label} entering={FadeInLeft.delay(60 + i * 45).duration(300)}>
                <PressableScale style={styles.linkRow} onPress={link.onPress} scaleTo={0.98}>
                  <View style={styles.linkIconWrap}>
                    <Ionicons name={link.icon} size={18} color={Colors.secondaryLight} />
                  </View>
                  <Text style={styles.linkText}>{link.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.3)" />
                </PressableScale>
              </Animated.View>
            ))}
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
            {user && (
              <PressableScale
                style={styles.logoutRow}
                onPress={() => {
                  onClose();
                  logout();
                }}
                haptic
              >
                <Ionicons name="log-out-outline" size={19} color={Colors.secondary} />
                <Text style={styles.logoutText}>Log Out</Text>
              </PressableScale>
            )}
            <Text style={styles.copyright}>© {new Date().getFullYear()} Hot & Spice</Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, flexDirection: "row" },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)" },
  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.dark,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  userSection: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  userName: {
    fontSize: FontSize["3xl"],
    fontFamily: FontFamily.bold,
    color: Colors.bg,
    marginTop: Spacing.sm,
  },
  userEmail: {
    fontSize: FontSize.base,
    color: "rgba(255,255,255,0.5)",
    marginTop: 2,
    fontFamily: FontFamily.regular,
  },
  loginPrompt: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.semiBold,
    color: Colors.bg,
  },
  linksSection: { flex: 1 },
  linksSectionContent: { paddingTop: Spacing.md, paddingBottom: Spacing.md },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 13,
  },
  linkIconWrap: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    backgroundColor: "rgba(61,138,154,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  linkText: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
    color: "rgba(237,232,208,0.9)",
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  logoutText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: Colors.secondary,
  },
  copyright: {
    fontSize: FontSize.sm,
    color: "rgba(255,255,255,0.3)",
    marginTop: Spacing.sm,
    fontFamily: FontFamily.regular,
  },
});
