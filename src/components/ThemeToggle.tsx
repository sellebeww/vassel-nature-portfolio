"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";
  return <button type="button" className={`forest-theme-toggle ${className}`} onClick={toggleTheme} aria-label={dark ? "Switch to daylight forest" : "Switch to night forest"} aria-pressed={dark}>
    <Sun size={15} className="theme-sun" /><span className="theme-track"><span /></span><Moon size={14} className="theme-moon" />
  </button>;
}
