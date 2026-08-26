import {
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
} from "@expo-google-fonts/poppins";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { HoltwoodOneSC_400Regular } from "@expo-google-fonts/holtwood-one-sc";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ToastProvider } from "@/components/ui/Toast";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider, useAuth } from "@/src/context/AuthContext";
import { CartProvider } from "@/src/context/CartContext";
import { FavoritesProvider } from "@/src/context/FavoritesContext";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootNavigator() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "login" || segments[0] === "register";

    if (!user && !inAuthGroup) {
      router.replace("/login");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, isLoading, segments, router]);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.dark },
        headerTintColor: Colors.white,
        headerTitleStyle: { fontFamily: "Poppins_700Bold" },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Colors.bg },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="checkout" options={{ title: "Checkout" }} />
      <Stack.Screen name="order-success" options={{ headerShown: false }} />
      <Stack.Screen name="addresses" options={{ title: "My Addresses" }} />
      <Stack.Screen name="edit-profile" options={{ title: "Edit Profile" }} />
      <Stack.Screen name="about" options={{ title: "About Us" }} />
      <Stack.Screen name="favorites" options={{ title: "My Favorites" }} />
      <Stack.Screen
        name="item/[id]"
        options={{
          headerTransparent: false,
          headerStyle: { backgroundColor: Colors.secondary },
          headerTintColor: Colors.white,
          title: "",
        }}
      />
      <Stack.Screen name="reservation" options={{ title: "Reserve a Table" }} />
      <Stack.Screen name="gallery" options={{ title: "Gallery" }} />
      <Stack.Screen name="chefs" options={{ title: "Our Chefs" }} />
      <Stack.Screen name="contact" options={{ title: "Contact Us" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
    HoltwoodOneSC_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <ToastProvider>
              <ThemeProvider
                value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
              >
                <RootNavigator />
                <StatusBar style="auto" />
              </ThemeProvider>
            </ToastProvider>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
