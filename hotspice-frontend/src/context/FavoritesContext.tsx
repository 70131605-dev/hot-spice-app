import { MenuItem } from "@/src/api/menu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface FavoritesContextType {
  favorites: MenuItem[];
  isFavorite: (menuItemId: number) => boolean;
  toggleFavorite: (menuItem: MenuItem) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

const FAVORITES_STORAGE_KEY = "favorite_items";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<MenuItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load favorites", error);
    } finally {
      setIsLoaded(true);
    }
  };

  const isFavorite = (menuItemId: number) =>
    favorites.some((i) => i.id === menuItemId);

  const toggleFavorite = (menuItem: MenuItem) => {
    setFavorites((prev) =>
      prev.some((i) => i.id === menuItem.id)
        ? prev.filter((i) => i.id !== menuItem.id)
        : [...prev, menuItem],
    );
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
}
