"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faCertificate,
  faCodeFork,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { useLenis } from "@/components/providers/lenis-provider";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: typeof faHome;
}

const navItems: NavItem[] = [
  { id: "home", label: "Home", href: "#home", icon: faHome },
  { id: "about", label: "About", href: "#about", icon: faUser },
  { id: "certificates", label: "Certs", href: "#certificates", icon: faCertificate },
  { id: "portfolio", label: "Projects", href: "#portfolio", icon: faCodeFork },
  { id: "contact", label: "Contact", href: "#contact", icon: faEnvelope },
];

export function MobileBottomNav() {
  const lenis = useLenis();
  const [activeSection, setActiveSection] = useState<string>("home");

  useEffect(() => {
    const sectionIds = ["home", "about", "certificates", "portfolio", "contact"];

    const updateActiveSection = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // If near bottom of the page, highlight contact
      if (scrollY + windowHeight >= docHeight - 80) {
        setActiveSection("contact");
        return;
      }

      // Check section bounding rects
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
    const targetId = href.replace("#", "");
    let targetEl = document.getElementById(targetId);
    if (!targetEl && targetId === "portfolio") {
      targetEl = document.getElementById("projects");
    }

    if (targetEl) {
      if (lenis) {
        lenis.scrollTo(targetEl, { offset: -65, duration: 1.1 });
      } else {
        const top = targetEl.getBoundingClientRect().top + window.scrollY - 65;
        window.scrollTo({ top, behavior: "smooth" });
      }
      setActiveSection(targetId);
    }
  };

  return (
    <nav
      role="navigation"
      aria-label="Mobile Bottom App Bar"
      className="fixed bottom-3 inset-x-3 sm:inset-x-8 max-w-md mx-auto z-40 md:hidden pb-[env(safe-area-inset-bottom)] pointer-events-auto select-none"
    >
      <div className="w-full bg-card/90 dark:bg-[var(--bg-black-900)]/90 backdrop-blur-xl border border-border/70 shadow-[0_12px_40px_oklch(0_0_0_/_0.3)] rounded-2xl px-1.5 py-1.5 flex items-center justify-between">
        {navItems.map((item) => {
          const isActive =
            activeSection === item.id ||
            (item.id === "portfolio" && activeSection === "projects");

          return (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl text-xs transition-all duration-200 active:scale-90 ${
                isActive
                  ? "text-[var(--skin-color)] font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {/* Active Pill Glow Background */}
              {isActive && (
                <span className="absolute inset-0 bg-[var(--skin-color)]/12 rounded-xl border border-[var(--skin-color)]/25 -z-10 animate-in fade-in zoom-in-95 duration-200" />
              )}

              {/* Icon with subtle scale on active */}
              <FontAwesomeIcon
                icon={item.icon}
                className={`h-4 w-4 transition-transform duration-200 ${
                  isActive ? "scale-110 text-[var(--skin-color)]" : "text-muted-foreground"
                }`}
              />

              {/* Label */}
              <span className="text-[10px] mt-1 tracking-tight font-medium">
                {item.label}
              </span>

              {/* Active Bottom Dot */}
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[var(--skin-color)] mt-0.5 shadow-[0_0_6px_var(--skin-color)]" />
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomNav;
