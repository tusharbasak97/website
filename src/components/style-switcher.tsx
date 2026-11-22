"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faMoon,
  faSun,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

type ThemeColor = "color-1" | "color-2" | "color-3";

interface ColorOption {
  id: ThemeColor;
  name: string;
  hex: string;
}

const colorOptions: ColorOption[] = [
  { id: "color-1", name: "Cyber Orange", hex: "hsla(36, 100%, 50%, 1)" },
  { id: "color-2", name: "Neon Magenta", hex: "hsla(324, 100%, 50%, 1)" },
  { id: "color-3", name: "Electric Violet", hex: "hsla(276, 100%, 62%, 1)" },
];

function subscribe() {
  return () => {};
}

export function StyleSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [activeColor, setActiveColor] = useState<ThemeColor>("color-1");

  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    const savedColor = localStorage.getItem("portfolio-color-theme") as ThemeColor | null;
    if (savedColor && ["color-1", "color-2", "color-3"].includes(savedColor)) {
      const timer = setTimeout(() => {
        setActiveColor(savedColor);
        document.documentElement.setAttribute("data-theme-color", savedColor);
      }, 0);
      return () => clearTimeout(timer);
    } else {
      document.documentElement.setAttribute("data-theme-color", "color-1");
    }
  }, []);

  const handleColorChange = (color: ThemeColor) => {
    setActiveColor(color);
    localStorage.setItem("portfolio-color-theme", color);
    document.documentElement.setAttribute("data-theme-color", color);
  };

  const toggleDayNight = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <aside
      aria-label="Style Switcher"
      className="fixed top-24 sm:top-28 right-0 z-40 transition-transform duration-300 ease-in-out flex items-start"
      style={{
        transform: isOpen ? "translateX(0)" : "translateX(calc(100% - 46px))",
      }}
    >
      {/* Action Buttons Column on Left Edge */}
      <div className="flex flex-col space-y-2 select-none">
        {/* Gear Toggle Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-11 h-11 rounded-l-xl bg-card border-y border-l border-border shadow-lg flex items-center justify-center text-foreground hover:text-[var(--skin-color)] focus:outline-none cursor-pointer group transition-colors"
          aria-label={isOpen ? "Close style switcher" : "Open style switcher"}
          title="Toggle style switcher"
        >
          <FontAwesomeIcon
            icon={faGear}
            className={`h-5 w-5 transition-transform duration-500 group-hover:rotate-90 ${
              isOpen ? "rotate-180 text-[var(--skin-color)]" : ""
            }`}
          />
        </button>

        {/* Day/Night Toggle Button */}
        <button
          type="button"
          onClick={toggleDayNight}
          className="w-11 h-11 rounded-l-xl bg-card border-y border-l border-border shadow-lg flex items-center justify-center text-foreground hover:text-[var(--skin-color)] focus:outline-none cursor-pointer transition-colors"
          aria-label="Toggle dark/light theme"
          title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
        >
          {mounted ? (
            <FontAwesomeIcon
              icon={resolvedTheme === "dark" ? faSun : faMoon}
              className={`h-4 w-4 ${
                resolvedTheme === "dark" ? "text-amber-400" : "text-slate-700"
              }`}
            />
          ) : (
            <FontAwesomeIcon icon={faMoon} className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Main Panel Content */}
      <div className="w-56 p-5 bg-card/95 backdrop-blur-xl border-y border-l border-border rounded-l-2xl shadow-2xl">
        <h4 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border flex items-center justify-between">
          <span>Theme Colors</span>
          <span className="text-[10px] font-mono uppercase text-muted-foreground">Skin</span>
        </h4>

        {/* Color Swatches */}
        <div className="flex items-center justify-between py-1">
          {colorOptions.map((color) => {
            const isSelected = activeColor === color.id;

            return (
              <button
                key={color.id}
                type="button"
                onClick={() => handleColorChange(color.id)}
                className={`relative w-9 h-9 rounded-full shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center focus:outline-none ${
                  isSelected
                    ? "ring-2 ring-foreground ring-offset-2 ring-offset-card scale-110"
                    : "hover:scale-105 opacity-85 hover:opacity-100"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
                aria-label={color.name}
              >
                {isSelected && (
                  <FontAwesomeIcon icon={faCheck} className="h-3 w-3 text-white drop-shadow-sm" />
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Mode Indicator */}
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Mode</span>
          <span className="font-semibold text-foreground capitalize">
            {mounted ? resolvedTheme : "system"}
          </span>
        </div>
      </div>
    </aside>
  );
}

export default StyleSwitcher;
