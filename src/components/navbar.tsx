"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldHalved,
  faHome,
  faUser,
  faCertificate,
  faCodeFork,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { useLenis } from "@/components/providers/lenis-provider";
import { navItems } from "@/lib/data";

const iconMap: Record<string, typeof faHome> = {
  home: faHome,
  user: faUser,
  certificate: faCertificate,
  "code-fork": faCodeFork,
  envelope: faEnvelope,
};

export function Navbar() {
  const lenis = useLenis();
  const headerRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState<string>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  // Smooth entrance animation synchronized with preloader dismiss
  useEffect(() => {
    const playNavbarEntrance = () => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { y: -60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
        );
      }
    };

    const isDismissed = typeof window !== "undefined" && (window as unknown as { __preloaderDismissed?: boolean }).__preloaderDismissed;
    const hasPreloader = typeof document !== "undefined" && !!document.getElementById("preloader");

    if (isDismissed || !hasPreloader) {
      const timer = setTimeout(playNavbarEntrance, 100);
      return () => clearTimeout(timer);
    } else {
      window.addEventListener("preloaderDismiss", playNavbarEntrance, { once: true });
      return () => window.removeEventListener("preloaderDismiss", playNavbarEntrance);
    }
  }, []);

  // Monitor scroll for shadow/backdrop intensity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Automatically close mobile menu when scrolled or clicked/touched outside
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const initialScrollY = window.scrollY || document.documentElement.scrollTop;

    const handleScroll = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop;
      if (Math.abs(currentScrollY - initialScrollY) > 8) {
        setMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchmove", handleClickOutside, { passive: true });
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    if (lenis) {
      lenis.on("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchmove", handleClickOutside);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
      if (lenis) {
        lenis.off("scroll", handleScroll);
      }
    };
  }, [mobileMenuOpen, lenis]);

  // Realtime scroll spy for active section highlighting
  useEffect(() => {
    const sectionIds = ["home", "about", "certificates", "portfolio", "contact"];

    const updateActiveSection = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // 1. If at or near bottom of page, activate contact
      if (scrollY + windowHeight >= docHeight - 80) {
        setActiveSection("contact");
        return;
      }

      // 2. Measure section positions relative to viewport
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

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    if (lenis) {
      lenis.on("scroll", updateActiveSection);
    }

    // Initial check on mount
    updateActiveSection();

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      if (lenis) {
        lenis.off("scroll", updateActiveSection);
      }
    };
  }, [lenis]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    const targetId = href.replace("#", "");
    // Support either #portfolio or #projects
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

  return (
    <>
      {/* Mobile Backdrop when menu is open */}
      <div
        onClick={() => setMobileMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      <header
        ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out ${
        mobileMenuOpen
          ? "bg-card/85 dark:bg-[var(--bg-black-900)]/85 backdrop-blur-2xl shadow-[0_20px_50px_oklch(0_0_0_/_0.3)] border-b border-border/60 py-3.5"
          : scrolled
          ? "bg-card/80 dark:bg-[var(--bg-black-900)]/80 backdrop-blur-xl shadow-md border-b border-border/50 py-3"
          : "bg-background/50 dark:bg-[var(--bg-black-900)]/50 backdrop-blur-md border-b border-transparent py-4 sm:py-5"
      }`}
    >
      <div className="w-full max-w-[1800px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 flex items-center justify-between">
        {/* Left: Logo & Secured Badge */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="#home"
            onClick={(e) => handleNavClick(e, "#home")}
            className="group flex items-center gap-1.5 focus:outline-none"
            aria-label="Tushar Basak Portfolio Home"
          >
            <span className="font-kaushan text-2xl sm:text-3xl font-bold tracking-wide text-foreground group-hover:text-[var(--skin-color)] transition-colors">
              Tushar
            </span>
          </Link>

          {/* Secured Badge */}
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_oklch(0.72_0.19_155_/_0.15)] select-none"
            title="SSL/TLS Secured Application"
          >
            <FontAwesomeIcon icon={faShieldHalved} className="h-3 w-3" />
            <span>secured</span>
          </div>
        </div>

        {/* Center / Right: Desktop Navigation */}
        <nav
          className="hidden lg:flex items-center space-x-1 lg:space-x-2"
          role="navigation"
          aria-label="Main navigation"
        >
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
                className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 group ${
                  isActive
                    ? "text-[var(--skin-color)] font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <FontAwesomeIcon
                  icon={faIcon}
                  className={`h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? "text-[var(--skin-color)]" : "text-muted-foreground"
                  }`}
                />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[var(--skin-color)] rounded-full transition-all duration-300" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-foreground hover:text-[var(--skin-color)] hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-[var(--skin-color)] transition-all"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              <span
                className={`absolute h-0.5 w-5 bg-current rounded-full transition-all duration-300 ease-in-out ${
                  mobileMenuOpen
                    ? "rotate-45 translate-y-0"
                    : "-translate-y-1.5"
                }`}
              />
              <span
                className={`absolute h-0.5 w-5 bg-current rounded-full transition-all duration-200 ease-in-out ${
                  mobileMenuOpen
                    ? "opacity-0 scale-x-0"
                    : "opacity-100"
                }`}
              />
              <span
                className={`absolute h-0.5 w-5 bg-current rounded-full transition-all duration-300 ease-in-out ${
                  mobileMenuOpen
                    ? "-rotate-45 translate-y-0"
                    : "translate-y-1.5"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Seamless Glassmorphic Extending Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileMenuOpen ? "max-h-[26rem] opacity-100 pt-2 pb-6" : "max-h-0 opacity-0 py-0 pointer-events-none"
        }`}
      >
        <div className="w-full max-w-[1800px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-8 flex flex-col space-y-1.5">
          {/* Subtle glass separator line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-border/70 to-transparent my-1.5" />

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
                className={`group flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[var(--skin-color)]/15 text-[var(--skin-color)] font-semibold border border-[var(--skin-color)]/30 shadow-[0_4px_20px_color-mix(in_oklch,var(--skin-color)_20%,transparent)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/70 backdrop-blur-sm active:scale-[0.98]"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                      isActive
                        ? "bg-[var(--skin-color)]/20 text-[var(--skin-color)]"
                        : "bg-muted/70 text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    <FontAwesomeIcon icon={faIcon} className="h-4 w-4" />
                  </div>
                  <span className="tracking-wide text-sm font-medium">{item.label}</span>
                </div>

                {/* Right indicator */}
                {isActive ? (
                  <span className="w-2 h-2 rounded-full bg-[var(--skin-color)] shadow-[0_0_8px_var(--skin-color)]" />
                ) : (
                  <span className="text-muted-foreground/30 text-xs group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all">
                    →
                  </span>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </header>
  </>
  );
}

export default Navbar;
