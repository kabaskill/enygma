"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useAppStore } from "~/store";

// The Provider component
export function Providers({ children }: { children: ReactNode }) {
  const theme = useAppStore((state) => state.theme);
  const setAppTheme = useAppStore((state) => state.setTheme);
  
  // Apply theme class to document when it changes
  useEffect(() => {
    // Default to light if no theme is set
    const currentTheme = theme || "light";
    
    // Remove all theme classes first
    document.documentElement.classList.remove("light", "dark", "dracula");
    
    // Add the current theme class
    document.documentElement.classList.add(currentTheme);
    
    // Also store in localStorage for persistence
    localStorage.setItem("theme", currentTheme);
    
    // Update zustand store
    setAppTheme(currentTheme);
  }, [theme, setAppTheme]);

  return <>{children}</>;
}