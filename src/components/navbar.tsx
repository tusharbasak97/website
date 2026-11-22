"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldHalved,
  faHome,
  faUser,
  faCertificate,
  faCodeFork,
} from "@fortawesome/free-solid-svg-icons";
import { useLenis } from "@/components/providers/lenis-provider";
import { navItems } from "@/lib/data";

const iconMap: Record<string, typeof faHome> = {
  home: faHome,
  user: faUser,
  certificate: faCertificate,
  "code-fork": faCodeFork,
};

export function Navbar() {
  const lenis = useLenis();
  const [activeSection, setActiveSection] = useState<string>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  // Monitor scroll for shadow/backdrop intensity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver for active section highlighting
  useEffect(() => {
    const sectionIds = ["home", "about", "certificates", "portfolio"];
    const sectionElements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find visible section with highest intersection ratio
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort by intersection ratio or proximity to center
          visibleEntries.sort(
            (a, b) => b.intersectionRatio - a.intersectionRatio
          );
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.2, 0.5, 0.8],
      }
    );

    sectionElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

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
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/85 dark:bg-[var(--bg-black-900)]/85 backdrop-blur-md shadow-md border-b border-border/50 py-3"
          : "bg-background/60 dark:bg-[var(--bg-black-900)]/60 backdrop-blur-sm border-b border-transparent py-4 sm:py-5"
      }`}
    >
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 flex items-center justify-between">
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
            <span className="h-2 w-2 rounded-full bg-[var(--skin-color)] animate-pulse" />
          </Link>

          {/* Secured Badge */}
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)] select-none"
            title="SSL/TLS Secured Application"
          >
            <FontAwesomeIcon icon={faShieldHalved} className="h-3 w-3" />
            <span>secured</span>
          </div>
        </div>

        {/* Center / Right: Desktop Navigation */}
        <nav
          className="hidden md:flex items-center space-x-1 lg:space-x-2"
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
            <div className="w-6 h-5 flex flex-col justify-between relative">
              <span
                className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 transform origin-left ${
                  mobileMenuOpen ? "rotate-45 translate-x-1 -translate-y-0.5" : ""
                }`}
              />
              <span
                className={`w-full h-0.5 bg-current rounded-full transition-all duration-200 ${
                  mobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 transform origin-left ${
                  mobileMenuOpen ? "-rotate-45 translate-x-1 translate-y-0.5" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-border/50 bg-background/95 dark:bg-[var(--bg-black-900)]/95 backdrop-blur-xl ${
          mobileMenuOpen ? "max-h-72 opacity-100 py-3" : "max-h-0 opacity-0 py-0"
        }`}
      >
        <div className="w-full px-6 flex flex-col space-y-1">
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
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-[var(--skin-color)]/10 text-[var(--skin-color)] font-semibold border-l-4 border-[var(--skin-color)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <FontAwesomeIcon icon={faIcon} className="h-4 w-4" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
