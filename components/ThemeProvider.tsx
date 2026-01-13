"use client";

import { createContext, useContext, useCallback, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

let currentTheme: Theme = "light";

function getThemeSnapshot(): Theme {
  return currentTheme;
}

function getServerThemeSnapshot(): Theme {
  return "light";
}

function subscribeToTheme(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const savedTheme = localStorage.getItem("theme") as Theme | null;
  if (savedTheme) {
    currentTheme = savedTheme;
    document.documentElement.setAttribute("data-theme", savedTheme);
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    currentTheme = prefersDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", currentTheme);
  }

  callback();

  // Listener para mudanças de tema manual (via toggleTheme)
  const handleThemeChange = () => {
    callback();
  };
  window.addEventListener("themechange", handleThemeChange);

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleChange = (e: MediaQueryListEvent) => {
    if (!localStorage.getItem("theme")) {
      currentTheme = e.matches ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", currentTheme);
      callback();
    }
  };

  mediaQuery.addEventListener("change", handleChange);
  return () => {
    mediaQuery.removeEventListener("change", handleChange);
    window.removeEventListener("themechange", handleThemeChange);
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot
  );

  const toggleTheme = useCallback(() => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    currentTheme = newTheme;
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    window.dispatchEvent(new Event("themechange"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
