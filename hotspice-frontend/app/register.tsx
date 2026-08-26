import { Button, FadeInView, PressableScale, Wordmark } from "@/components/ui";
import { Colors, FontFamily, FontSize, Radius, Spacing } from "@/constants/theme";
import { useAuth } from "@/src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// index 0 = empty/unfilled track, 1..4 = weak/fair/good/strong
const STRENGTH_PALETTE = ["#E5DED2", Colors.primary, Colors.secondary, "#EAB308", Colors.success];
const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];

function getPasswordScore(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

function StrengthSegment({ active, colorIndex }: { active: boolean; colorIndex: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(active ? colorIndex : 0, { duration: 250 });
  }, [active, colorIndex, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1, 2, 3, 4], STRENGTH_PALETTE),
  }));

  return <Animated.View style={[styles.strengthSegment, animatedStyle]} />;
}

function PasswordStrengthMeter({ password }: { password: string }) {
  if (!password) return null;
  const score = getPasswordScore(password);
  return (
    <View style={styles.strengthWrap}>
      <View style={styles.strengthRow}>
        {[1, 2, 3, 4].map((i) => (
          <StrengthSegment key={i} active={score >= i} colorIndex={score} />
        ))}
      </View>
      <Text style={[styles.strengthLabel, { color: STRENGTH_PALETTE[score] }]}>
        {STRENGTH_LABELS[score]}
      </Text>
    </View>
  );
}

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");
    if (!name || !email || !phone || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, confirmPassword, phone);
      router.replace("/(tabs)");
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.hero}>
        <Image
          source={require("@/assets/images/burger_combo_meal.jpg")}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.55)", "rgba(0,0,0,0.85)"]}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.heroContent}>
          <Wordmark size={32} light />
          <Text style={styles.heroTagline}>Join the family. Get the heat.</Text>
        </View>
      </View>

      <View style={styles.formSheet}>
        <ScrollView
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <FadeInView>
            <Text style={styles.title}>Create an account</Text>
            <Text style={styles.subtitle}>Sign up to start ordering</Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              placeholderTextColor={Colors.textTertiary}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={Colors.textTertiary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="+1 (555) 000-0000"
              placeholderTextColor={Colors.textTertiary}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor={Colors.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <PressableScale
                hitSlop={8}
                style={styles.eyeButton}
                onPress={() => setShowPassword((prev) => !prev)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={Colors.textTertiary}
                />
              </PressableScale>
            </View>
            <PasswordStrengthMeter password={password} />

            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor={Colors.textTertiary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <PressableScale
                hitSlop={8}
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword((prev) => !prev)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={Colors.textTertiary}
                />
              </PressableScale>
            </View>

            <Button
              title="Sign Up"
              onPress={handleRegister}
              loading={loading}
              style={styles.submitButton}
            />

            <PressableScale
              haptic
              style={styles.linkRow}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.linkText}>
                Already have an account? <Text style={styles.linkTextAccent}>Log in</Text>
              </Text>
            </PressableScale>
          </FadeInView>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark },
  hero: {
    flexBasis: "30%",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  heroContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing["3xl"],
  },
  heroTagline: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: "rgba(255,255,255,0.75)",
    marginTop: Spacing.xs,
  },

  formSheet: {
    flex: 1,
    backgroundColor: Colors.surface,
    marginTop: -Radius["3xl"],
    borderTopLeftRadius: Radius["3xl"],
    borderTopRightRadius: Radius["3xl"],
  },
  formContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing["2xl"],
    paddingBottom: Spacing["3xl"],
  },

  title: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize["7xl"],
    color: Colors.secondary,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.muted,
    marginTop: Spacing.xs,
    marginBottom: Spacing["2xl"],
  },
  error: {
    fontFamily: FontFamily.medium,
    color: Colors.secondary,
    fontSize: FontSize.base,
    marginBottom: Spacing.md,
  },

  label: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.muted,
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 13,
    marginBottom: Spacing.lg,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: Radius.lg,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 13,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  eyeButton: {
    paddingHorizontal: Spacing.md,
  },

  strengthWrap: { marginTop: Spacing.sm, marginBottom: Spacing.lg },
  strengthRow: { flexDirection: "row", gap: Spacing.xs },
  strengthSegment: {
    flex: 1,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: "#E5DED2",
  },
  strengthLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
  },

  submitButton: { marginTop: Spacing.sm },

  linkRow: { alignItems: "center", marginTop: Spacing.xl },
  linkText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.muted,
  },
  linkTextAccent: {
    fontFamily: FontFamily.bold,
    color: Colors.secondary,
  },
});
