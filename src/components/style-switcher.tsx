"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faMoon,
  faSun,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

import {
  type ThemeColor,
  colorOptions,
  useThemeColor,
  useIsClient,
  setThemeColor,
} from "@/lib/theme-store";

export function StyleSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const activeColor = useThemeColor();
  const isClient = useIsClient();
  const switcherRef = useRef<HTMLElement>(null);

  // Close on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleColorChange = (color: ThemeColor) => {
    setThemeColor(color);
  };

  const toggleDayNight = () => {
    document.documentElement.classList.add("theme-transition");
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 400);
  };

  return (
    <aside
      ref={switcherRef}
      aria-label="Style Switcher"
      className={`fixed top-24 sm:top-28 right-0 z-50 transition-transform duration-300 ease-out hidden lg:flex items-start ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Action Buttons Column anchored to left edge of panel, spaced apart from each other */}
      <div className="absolute right-full top-3 flex flex-col space-y-3 select-none">
        {/* Gear Toggle Button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-11 h-11 rounded-l-xl bg-card border-y border-l border-border shadow-lg flex items-center justify-center text-foreground hover:text-skin hover:bg-accent/60 focus:outline-none focus:ring-2 focus:ring-skin/30 cursor-pointer group transition-colors"
          aria-label={isOpen ? "Close style switcher" : "Open style switcher"}
          title="Toggle style switcher"
        >
          <FontAwesomeIcon
            icon={faGear}
            className={`h-5 w-5 transition-transform duration-500 group-hover:rotate-90 ${
              isOpen ? "rotate-180 text-skin" : ""
            }`}
          />
        </button>

        {/* Day/Night Toggle Button */}
        <button
          type="button"
          onClick={toggleDayNight}
          suppressHydrationWarning
          className="w-11 h-11 rounded-l-xl bg-card border-y border-l border-border shadow-lg flex items-center justify-center text-foreground hover:text-skin hover:bg-accent/60 focus:outline-none focus:ring-2 focus:ring-skin/30 cursor-pointer group transition-colors"
          aria-label="Toggle dark/light theme"
          title={isClient ? `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode` : "Toggle dark/light theme"}
        >
          {isClient && resolvedTheme === "dark" ? (
            <FontAwesomeIcon
              icon={faSun}
              className="h-4 w-4 transition-colors group-hover:text-skin"
            />
          ) : (
            <FontAwesomeIcon
              icon={faMoon}
              className="h-4 w-4 transition-colors group-hover:text-skin"
            />
          )}
        </button>
      </div>

      {/* Main Panel Content */}
      <div className="w-60 p-5 bg-card/95 backdrop-blur-xl border-y border-l border-border rounded-l-2xl shadow-2xl">
        <div role="heading" aria-level={3} className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border flex items-center justify-between">
          <span>Theme Colors</span>
          <span className="text-[10px] font-mono uppercase text-muted-foreground font-semibold">SKIN</span>
        </div>

        {/* Color Swatches */}
        <div className="flex items-center justify-between py-2 px-1" suppressHydrationWarning>
          {colorOptions.map((color) => {
            const isSelected = isClient ? activeColor === color.id : color.id === "color-1";

            return (
              <button
                key={color.id}
                type="button"
                onClick={() => handleColorChange(color.id)}
                className={`relative w-10 h-10 rounded-full shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center focus:outline-none ${
                  isSelected
                    ? "ring-3 ring-foreground ring-offset-2 ring-offset-card scale-110 shadow-lg"
                    : "hover:scale-105 opacity-85 hover:opacity-100 border border-white/20"
                }`}
                style={{ background: color.gradient }}
                title={color.name}
                aria-label={color.name}
              >
                {isSelected && (
                  <FontAwesomeIcon icon={faCheck} className="h-3.5 w-3.5 text-white drop-shadow-md" />
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Mode Indicator */}
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Current Mode</span>
          <span className="font-semibold text-foreground capitalize px-2 py-0.5 rounded bg-muted">
            {isClient ? resolvedTheme : "dark"}
          </span>
        </div>
      </div>
    </aside>
  );
}

export default StyleSwitcher;
