"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faCertificate,
  faCodeFork,
  faEnvelope,
  faSun,
  faMoon,
  faPalette,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useLenis } from "@/components/providers/lenis-provider";
import { navItems } from "@/lib/data";

import {
  type ThemeColor,
  colorOptions,
  useThemeColor,
  useIsClient,
  setThemeColor,
} from "@/lib/theme-store";

const iconMap: Record<string, typeof faHome> = {
  home: faHome,
  user: faUser,
  certificate: faCertificate,
  "code-fork": faCodeFork,
  envelope: faEnvelope,
};

export function TabletFloatingNav() {
  const lenis = useLenis();
  const { resolvedTheme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<string>("home");
  const activeColor = useThemeColor();
  const isClient = useIsClient();
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  // Close color picker on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        setColorPickerOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setColorPickerOpen(false);
      }
    };

    if (colorPickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [colorPickerOpen]);

  // Real-time scroll spy
  useEffect(() => {
    const sectionIds = ["home", "about", "certificates", "portfolio", "contact"];
    let rafId: number | null = null;

    const updateActiveSection = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      if (scrollY + windowHeight >= docHeight - 80) {
        setActiveSection("contact");
        return;
      }

      const offset = 180;
      let currentSection = sectionIds[0];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= offset) {
            currentSection = id;
          }
        }
      }

      setActiveSection(currentSection);
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        updateActiveSection();
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    if (lenis) {
      lenis.on("scroll", handleScroll);
    }

    updateActiveSection();

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", handleScroll);
      if (lenis) {
        lenis.off("scroll", handleScroll);
      }
    };
  }, [lenis]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setColorPickerOpen(false);
    const targetId = href.replace("#", "");
    let targetEl = document.getElementById(targetId);
    if (!targetEl && targetId === "portfolio") {
      targetEl = document.getElementById("projects");
    }

    if (targetEl) {
      if (lenis) {
        lenis.scrollTo(targetEl, { offset: -70, duration: 1.2 });
      } else {
        const top = targetEl.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: "smooth" });
      }
      setActiveSection(targetId);
    }
  };

  const toggleDayNight = () => {
    document.documentElement.classList.add("theme-transition");
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 400);
  };

  const handleColorChange = (color: ThemeColor) => {
    setThemeColor(color);
    setColorPickerOpen(false);
  };

  return (
    <nav
      role="navigation"
      aria-label="Tablet Floating Navigation"
      className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex lg:hidden flex-col items-center select-none pointer-events-auto"
    >
      {/* Apple VisionOS / iPadOS 18 Unified Floating Glass Capsule */}
      <div className="p-2 rounded-full bg-card/85 dark:bg-bg-900/85 backdrop-blur-2xl border border-white/25 dark:border-white/10 shadow-[0_20px_50px_oklch(0_0_0/0.35),0_0_1px_oklch(1_0_0/0.2)] flex flex-col items-center gap-2.5">
        {/* Navigation Section Icons */}
        {navItems.map((item) => {
          const sectionKey = item.href.replace("#", "");
          const isActive =
            activeSection === sectionKey ||
            (sectionKey === "portfolio" && activeSection === "projects");
          const faIcon = iconMap[item.icon] || faHome;

          return (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className={`group relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 active:scale-90 ${
                isActive
                  ? "bg-linear-to-tr from-skin to-skin-end text-white shadow-[0_0_20px_color-mix(in_oklch,var(--skin-color)_60%,transparent)] scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
              }`}
            >
              <FontAwesomeIcon
                icon={faIcon}
                className={`h-4 w-4 transition-transform duration-200 ${
                  isActive ? "scale-110 text-white" : "group-hover:scale-110"
                }`}
              />

              {/* Tooltip Pill on the Left */}
              <div
                className={`absolute right-full mr-3.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap bg-card/95 dark:bg-bg-900/95 backdrop-blur-xl border border-border/80 pointer-events-none transition-all duration-200 ${
                  isActive
                    ? "opacity-100 translate-x-0 text-foreground font-bold shadow-[0_4px_16px_oklch(0_0_0/0.2)]"
                    : "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-muted-foreground shadow-lg"
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-skin ml-1.5" />
                )}
              </div>
            </a>
          );
        })}

        {/* Frosted Hairline Glass Divider */}
        <div className="w-6 h-px bg-border/80 dark:bg-white/15 my-0.5" />

        {/* Unified Day/Night Mode Toggle */}
        <button
          type="button"
          onClick={toggleDayNight}
          suppressHydrationWarning
          aria-label="Toggle dark/light theme"
          className="group relative flex items-center justify-center w-11 h-11 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all duration-300 active:scale-90 cursor-pointer"
        >
          {isClient && resolvedTheme === "dark" ? (
            <FontAwesomeIcon
              icon={faSun}
              className="h-4 w-4 transition-colors group-hover:text-skin text-amber-400"
            />
          ) : (
            <FontAwesomeIcon
              icon={faMoon}
              className="h-4 w-4 transition-colors group-hover:text-skin text-sky-400"
            />
          )}

          {/* Tooltip Pill on the Left */}
          <div className="absolute right-full mr-3.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap bg-card/95 dark:bg-bg-900/95 backdrop-blur-xl border border-border/80 shadow-lg pointer-events-none opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-muted-foreground transition-all duration-200">
            <span>{isClient && resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </div>
        </button>

        {/* Unified Palette / Theme Color Picker */}
        <div ref={colorPickerRef} className="relative flex items-center justify-center">
          <button
            type="button"
            onClick={() => setColorPickerOpen((prev) => !prev)}
            aria-label="Change Accent Color"
            className={`group relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 active:scale-90 cursor-pointer ${
              colorPickerOpen
                ? "bg-skin/20 text-skin ring-2 ring-skin"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
            }`}
          >
            <FontAwesomeIcon
              icon={faPalette}
              className={`h-4 w-4 transition-transform duration-300 ${
                colorPickerOpen ? "rotate-45 text-skin" : "group-hover:scale-110"
              }`}
            />

            {/* Tooltip Pill on the Left (hidden when palette is open) */}
            {!colorPickerOpen && (
              <div className="absolute right-full mr-3.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap bg-card/95 dark:bg-bg-900/95 backdrop-blur-xl border border-border/80 shadow-lg pointer-events-none opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-muted-foreground transition-all duration-200">
                <span>Theme Colors</span>
              </div>
            )}
          </button>

          {/* Apple VisionOS-style Color Picker Sub-Pill extending to the left */}
          {colorPickerOpen && (
            <div className="absolute right-full mr-3 p-2 rounded-full bg-card/95 dark:bg-bg-900/95 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-[0_16px_40px_oklch(0_0_0/0.35)] flex items-center gap-2.5 z-50 animate-in fade-in slide-in-from-right-3 duration-200">
              {colorOptions.map((color) => {
                const isSelected = activeColor === color.id;

                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => handleColorChange(color.id)}
                    aria-label={color.name}
                    title={color.name}
                    className={`relative w-8 h-8 rounded-full shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center active:scale-90 ${
                      isSelected
                        ? "ring-2 ring-foreground ring-offset-2 ring-offset-card scale-110"
                        : "hover:scale-105 opacity-80 hover:opacity-100"
                    }`}
                    style={{ background: color.gradient }}
                  >
                    {isSelected && (
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="h-3 w-3 text-white drop-shadow-md"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default TabletFloatingNav;
