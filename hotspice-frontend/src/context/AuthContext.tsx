import {
  User,
  loginUser,
  logoutUser,
  registerUser,
  updateProfile,
} from "@/src/api/auth";
import { setUnauthorizedHandler } from "@/src/api/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    phone: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (name: string, email: string, phone: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
    setUnauthorizedHandler(() => {
      AsyncStorage.multiRemove(["auth_token", "user"]);
      setUser(null);
    });
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load stored user", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const data = await loginUser(email, password);
    await AsyncStorage.setItem("auth_token", data.token);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    phone: string,
  ) => {
    const data = await registerUser(
      name,
      email,
      password,
      passwordConfirmation,
      phone,
    );
    await AsyncStorage.setItem("auth_token", data.token);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const updateUser = async (name: string, email: string, phone: string) => {
    const updatedUser = await updateProfile(name, email, phone);
    await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout API call failed", error);
    } finally {
      await AsyncStorage.removeItem("auth_token");
      await AsyncStorage.removeItem("user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
