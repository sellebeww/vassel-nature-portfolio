"use client";

import { createContext, useCallback, useContext, useSyncExternalStore, ReactNode } from "react";
type Theme = "light" | "dark";
interface ThemeContextValue { theme: Theme; toggleTheme: () => void; setTheme: (theme: Theme) => void; }
const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "vg-theme";
const getTheme = (): Theme => document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
const serverTheme = (): Theme => "light";
function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const syncStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) document.documentElement.dataset.theme = event.newValue === "dark" ? "dark" : "light";
  };
  window.addEventListener("storage", syncStorage);
  return () => { observer.disconnect(); window.removeEventListener("storage", syncStorage); };
}
export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getTheme, serverTheme);
  const setTheme = useCallback((next: Theme) => {
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* private browsing */ }
  }, []);
  const toggleTheme = useCallback(() => setTheme(getTheme() === "light" ? "dark" : "light"), [setTheme]);
  return <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>{children}</ThemeContext.Provider>;
}
export const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light');}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
