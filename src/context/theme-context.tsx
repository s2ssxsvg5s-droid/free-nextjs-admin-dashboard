"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

type ThemeMode = "light" | "dark" | "auto";
type ResolvedTheme = "light" | "dark";
type ThemeContextType = {
  theme: ResolvedTheme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const listeners = new Set<() => void>();
let memoryMode: ThemeMode | undefined;

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "light" || value === "dark" || value === "auto";
}

function getMode(): ThemeMode {
  if (memoryMode) return memoryMode;
  try {
    const stored = window.localStorage.getItem("theme-mode");
    if (isThemeMode(stored)) return stored;
    const legacy = window.localStorage.getItem("theme");
    if (stored === null && isThemeMode(legacy)) return legacy;
  } catch {
    // Safari may deny storage. The current tab still keeps its preference.
  }
  return "auto";
}

function getSnapshot() {
  const mode = getMode();
  const theme =
    mode === "auto"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : mode;
  return `${mode}:${theme}`;
}

function getServerSnapshot() {
  return "auto:light";
}
function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const handleStorage = () => {
    memoryMode = undefined;
    listener();
  };
  window.addEventListener("storage", handleStorage);
  media.addEventListener("change", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
    media.removeEventListener("change", listener);
  };
}

function setThemeMode(mode: ThemeMode) {
  memoryMode = mode;
  try {
    window.localStorage.setItem("theme-mode", mode);
  } catch {
    // Theme changes must remain usable without persistent browser storage.
  }
  notify();
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [themeMode, theme] = snapshot.split(":") as [ThemeMode, ResolvedTheme];

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.setAttribute("data-color-scheme", theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const toggleTheme = () => setThemeMode(theme === "light" ? "dark" : "light");
  return (
    <ThemeContext.Provider
      value={{ theme, themeMode, setThemeMode, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
