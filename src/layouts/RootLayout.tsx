import { useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";

import { useTheme } from "@/stores";

const themeClasses = ["light", "dark", "system"] as const;

const isSystemTheme = (value: string) => value === "system";

export function RootLayout() {
  const theme = useTheme();

  const resolvedTheme = useMemo(() => {
    if (!isSystemTheme(theme)) {
      return theme;
    }

    if (typeof window === "undefined") {
      return "light";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }, [theme]);

  useEffect(() => {
    if (!themeClasses.includes(theme)) {
      return;
    }

    const root = document.documentElement;
    const isDark = resolvedTheme === "dark";
    root.classList.toggle("dark", isDark);

    const onSystemThemeChange = (event: MediaQueryListEvent) => {
      if (theme === "system") {
        root.classList.toggle("dark", event.matches);
      }
    };

    if (theme === "system" && typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", onSystemThemeChange);

      return () => {
        mediaQuery.removeEventListener("change", onSystemThemeChange);
      };
    }

    return undefined;
  }, [theme, resolvedTheme]);

  return <Outlet />;
}
