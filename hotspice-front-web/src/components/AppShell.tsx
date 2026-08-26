"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { FullPageSpinner } from "@/components/Spinner";
import { CONTENT_WIDTH_CLASS } from "@/lib/constants";

const PUBLIC_ROUTES = ["/login", "/register"];

const ShellContext = createContext<{
  setTopContent: (content: ReactNode | null) => void;
} | null>(null);

export function useShell() {
  const context = useContext(ShellContext);
  if (!context) {
    throw new Error("useShell must be used within AppShell");
  }
  return context;
}

function AuthGate({
  children,
  topContent,
}: {
  children: ReactNode;
  topContent: ReactNode | null;
}) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (isLoading) return;
    if (!user && !isPublicRoute) {
      router.replace("/login");
    } else if (user && isPublicRoute) {
      router.replace("/");
    }
  }, [user, isLoading, isPublicRoute, router]);

  if (isLoading) return <FullPageSpinner />;
  if (!user && !isPublicRoute) return <FullPageSpinner />;
  if (user && isPublicRoute) return <FullPageSpinner />;

  if (isPublicRoute) {
    return <div className="min-h-screen bg-white">{children}</div>;
  }

  return (
    <>
      <Navbar />
      {/* {topContent} */}
      <main
        className={`mx-auto min-h-[calc(100vh-85px)] w-full ${CONTENT_WIDTH_CLASS} px-4 pb-24 pt-4 md:pb-10`}
      >
        {children}
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [topContent, setTopContent] = useState<ReactNode | null>(null);

  return (
    <ShellContext.Provider value={{ setTopContent }}>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <AuthGate topContent={topContent}>{children}</AuthGate>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </ShellContext.Provider>
  );
}
