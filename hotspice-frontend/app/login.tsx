import { Button, FadeInView, PressableScale, Wordmark } from "@/components/ui";
import { Colors, FontFamily, FontSize, Radius, Spacing } from "@/constants/theme";
import { useAuth } from "@/src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
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

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
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
          source={require("@/assets/images/family_feast_box.jpg")}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.55)", "rgba(0,0,0,0.85)"]}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.heroContent}>
          <Wordmark size={32} light />
          <Text style={styles.heroTagline}>It&apos;s finger lickin&apos; fast.</Text>
        </View>
      </View>

      <View style={styles.formSheet}>
        <ScrollView
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <FadeInView>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Log in to keep the heat coming</Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

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

            <Button
              title="Log In"
              onPress={handleLogin}
              loading={loading}
              style={styles.submitButton}
            />

            <PressableScale
              haptic
              style={styles.linkRow}
              onPress={() => router.push("/register")}
            >
              <Text style={styles.linkText}>
                Don&apos;t have an account?{" "}
                <Text style={styles.linkTextAccent}>Sign up</Text>
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
    marginBottom: Spacing.lg,
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
