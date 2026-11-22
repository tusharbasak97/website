"use client";

import React, { useSyncExternalStore, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserSecret, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faLinkedin,
  faMedium,
} from "@fortawesome/free-brands-svg-icons";
import { socialLinks } from "@/lib/data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const iconMap: Record<string, typeof faGithub | typeof faUserSecret> = {
  github: faGithub,
  linkedin: faLinkedin,
  "user-secret": faUserSecret,
  medium: faMedium,
};

function subscribe() {
  return () => {};
}

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  // Safe client-side dynamic year using useSyncExternalStore
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => 2027
  );

  useEffect(() => {
    if (footerRef.current) {
      gsap.fromTo(
        footerRef.current,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 95%",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, []);

  return (
    <footer
      ref={footerRef}
      className="w-full border-t border-border bg-card/50 backdrop-blur-sm py-12 px-4 sm:px-8 md:px-12 lg:px-20 xl:px-28"
    >
      <div className="w-full max-w-7xl 2xl:max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 pb-16 md:pb-0">
        {/* Brand & secured indicator */}
        <div className="flex items-center gap-3">
          <span className="font-kaushan text-2xl font-bold text-foreground">
            Tushar Basak
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <FontAwesomeIcon icon={faShieldHalved} className="h-2.5 w-2.5" />
            <span>Secured Portfolio</span>
          </span>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-3">
          {socialLinks.map((item) => {
            const icon = iconMap[item.icon] || faUserSecret;

            return (
              <a
                key={item.platform}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                title={item.platform}
                className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-[var(--skin-color)] hover:border-[var(--skin-color)]/50 hover:shadow-md transition-all duration-200 group"
              >
                <FontAwesomeIcon
                  icon={icon}
                  className="h-4 w-4 transition-transform group-hover:scale-110"
                />
              </a>
            );
          })}
        </div>

        {/* Copyright & Credits */}
        <div className="text-center md:text-right text-xs sm:text-sm text-muted-foreground">
          <p>
            &copy; {year} All rights reserved.
          </p>
          <p className="mt-1">
            Designed by{" "}
            <a
              href="https://bit.ly/m/DataBasak"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:text-[var(--skin-color)] transition-colors underline decoration-[var(--skin-color)] underline-offset-4"
            >
              Tushar Basak
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
