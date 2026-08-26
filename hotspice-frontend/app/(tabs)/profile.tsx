import { Avatar, Card, FadeInView, IconBadge, PressableScale } from "@/components/ui";
import { Colors, FontFamily, FontSize, Radius, Spacing } from "@/constants/theme";
import { useAuth } from "@/src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => logout(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>My Profile</Text>

        <FadeInView index={0}>
          <Card style={styles.profileCard}>
            <View style={styles.profileRow}>
              <Avatar name={user?.name} size={64} />
              <View style={styles.profileInfo}>
                <Text style={styles.name}>{user?.name}</Text>
                <Text style={styles.email}>{user?.email}</Text>
              </View>
              <PressableScale
                haptic
                style={styles.editButton}
                onPress={() => router.push("/edit-profile")}
              >
                <Ionicons name="create-outline" size={16} color={Colors.bg} />
                <Text style={styles.editButtonText}>Edit</Text>
              </PressableScale>
            </View>
          </Card>
        </FadeInView>

        <FadeInView index={1}>
          <Card style={styles.menuCard} padding={0}>
            <PressableScale
              haptic
              style={[styles.menuItem, styles.menuItemBorder]}
              onPress={() => router.push("/addresses")}
            >
              <IconBadge name="location-outline" size={40} iconSize={19} />
              <Text style={styles.menuText}>My Addresses</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
            </PressableScale>

            <PressableScale
              haptic
              style={[styles.menuItem, styles.menuItemBorder]}
              onPress={() => router.push("/(tabs)/orders")}
            >
              <IconBadge name="receipt-outline" size={40} iconSize={19} />
              <Text style={styles.menuText}>My Orders</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
            </PressableScale>

            <PressableScale haptic style={styles.menuItem} onPress={handleLogout}>
              <IconBadge
                name="log-out-outline"
                size={40}
                iconSize={19}
                color={Colors.secondary}
                backgroundColor={Colors.secondaryTint}
              />
              <Text style={[styles.menuText, styles.logoutText]}>Log Out</Text>
            </PressableScale>
          </Card>
        </FadeInView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: Spacing["3xl"] },
  title: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize["6xl"],
    color: Colors.secondary,
    marginBottom: Spacing.lg,
  },

  profileCard: { marginBottom: Spacing.lg },
  profileRow: { flexDirection: "row", alignItems: "center", gap: Spacing.md },
  profileInfo: { flex: 1 },
  name: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize["2xl"],
    color: Colors.text,
  },
  email: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.muted,
    marginTop: 2,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    backgroundColor: Colors.secondary,
  },
  editButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.bg,
  },

  menuCard: { overflow: "hidden" },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuText: {
    flex: 1,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.text,
  },
  logoutText: { color: Colors.secondary },
});
