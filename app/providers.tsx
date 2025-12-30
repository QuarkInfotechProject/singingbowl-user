"use client";

import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-inter), sans-serif",
    h1: { fontFamily: "var(--font-inter), sans-serif" },
    h2: { fontFamily: "var(--font-inter), sans-serif" },
    h3: { fontFamily: "var(--font-inter), sans-serif" },
    h4: { fontFamily: "var(--font-inter), sans-serif" },
    h5: { fontFamily: "var(--font-inter), sans-serif" },
    h6: { fontFamily: "var(--font-inter), sans-serif" },
    body1: { fontFamily: "var(--font-inter), sans-serif" },
    body2: { fontFamily: "var(--font-inter), sans-serif" },
    button: { fontFamily: "var(--font-inter), sans-serif" },
  },
  palette: {
    primary: { main: "#A12717" },
    secondary: { main: "#FFC107" },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}

