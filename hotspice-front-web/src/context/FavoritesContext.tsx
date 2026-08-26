"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { MenuItem } from "@/types";

const STORAGE_KEY = "favorite_items";

interface FavoritesContextValue {
  favorites: MenuItem[];
  isFavorite: (menuItemId: number) => boolean;
  toggleFavorite: (menuItem: MenuItem) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<MenuItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch {
        // ignore corrupt storage
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites, hydrated]);

  const isFavorite = useCallback(
    (menuItemId: number) => favorites.some((f) => f.id === menuItemId),
    [favorites]
  );

  const toggleFavorite = useCallback((menuItem: MenuItem) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === menuItem.id);
      if (exists) return prev.filter((f) => f.id !== menuItem.id);
      return [...prev, menuItem];
    });
  }, []);

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
