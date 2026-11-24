import { useSyncExternalStore } from "react";

export type ThemeColor = "color-1" | "color-2" | "color-3";

export interface ColorOption {
  id: ThemeColor;
  name: string;
  hex: string;
  gradient: string;
}

export const colorOptions: ColorOption[] = [
  {
    id: "color-1",
    name: "Cyber Orange",
    hex: "oklch(0.7 0.19 55)",
    gradient: "linear-gradient(135deg, oklch(0.7 0.19 55), oklch(0.62 0.22 38))",
  },
  {
    id: "color-2",
    name: "Neon Magenta",
    hex: "oklch(0.66 0.27 350)",
    gradient: "linear-gradient(135deg, oklch(0.66 0.27 350), oklch(0.58 0.28 325))",
  },
  {
    id: "color-3",
    name: "Electric Violet",
    hex: "oklch(0.66 0.24 295)",
    gradient: "linear-gradient(135deg, oklch(0.66 0.24 295), oklch(0.56 0.26 278))",
  },
];

const emptySubscribe = () => () => {};

export function useIsClient(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

const themeListeners = new Set<() => void>();

function subscribeTheme(callback: () => void) {
  themeListeners.add(callback);
  return () => {
    themeListeners.delete(callback);
  };
}

function getThemeSnapshot(): ThemeColor {
  if (typeof window === "undefined") return "color-1";
  try {
    const saved = localStorage.getItem("portfolio-color-theme") as ThemeColor | null;
    if (saved && ["color-1", "color-2", "color-3"].includes(saved)) {
      return saved;
    }
  } catch {}
  return "color-1";
}

function getThemeServerSnapshot(): ThemeColor {
  return "color-1";
}

export function useThemeColor(): ThemeColor {
  return useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot
  );
}

export function setThemeColor(color: ThemeColor) {
  try {
    localStorage.setItem("portfolio-color-theme", color);
  } catch {}
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme-color", color);
  }
  for (const listener of themeListeners) {
    listener();
  }
}
