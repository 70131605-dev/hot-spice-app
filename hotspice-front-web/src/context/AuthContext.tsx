"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  loginRequest,
  logoutRequest,
  registerRequest,
  registerUnauthorizedHandler,
} from "@/lib/api";
import type { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    phone: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(() => {
    window.localStorage.removeItem("auth_token");
    window.localStorage.removeItem("user");
    setUser(null);
  }, []);

  useEffect(() => {
    const storedUser = window.localStorage.getItem("user");
    const token = window.localStorage.getItem("auth_token");
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        clearSession();
      }
    }
    setIsLoading(false);
  }, [clearSession]);

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      clearSession();
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- full reload clears in-memory app state on 401
        window.location.href = "/login";
      }
    });
  }, [clearSession]);

  const persistSession = (nextUser: User, token: string) => {
    window.localStorage.setItem("auth_token", token);
    window.localStorage.setItem("user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const login = useCallback(async (email: string, password: string) => {
    const data = await loginRequest(email, password);
    persistSession(data.user, data.token);
  }, []);

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      passwordConfirmation: string,
      phone: string
    ) => {
      const data = await registerRequest(
        name,
        email,
        password,
        passwordConfirmation,
        phone
      );
      persistSession(data.user, data.token);
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      // best-effort; clear local state regardless
    }
    clearSession();
  }, [clearSession]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
