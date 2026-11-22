"use client";

import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import gsap from "gsap";
import { useLenis } from "@/components/providers/lenis-provider";

export function ScrollToTop() {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const isVisibleRef = useRef<boolean>(false);
  const lenis = useLenis();

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    // Set initial hidden state with GSAP
    gsap.set(button, {
      y: 20,
      opacity: 0,
      scale: 0.8,
      pointerEvents: "none",
    });

    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;

      if (scrollY > 300) {
        if (!isVisibleRef.current) {
          isVisibleRef.current = true;
          gsap.to(button, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.7)",
            overwrite: "auto",
            onComplete: () => {
              if (button) button.style.pointerEvents = "auto";
            },
          });
        }
      } else {
        if (isVisibleRef.current) {
          isVisibleRef.current = false;
          button.style.pointerEvents = "none";
          gsap.to(button, {
            y: 20,
            opacity: 0,
            scale: 0.8,
            duration: 0.3,
            ease: "power2.in",
            overwrite: "auto",
          });
        }
      }
    };

    // Realtime scroll detection via native passive scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once initially in case user reloads scrolled
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = () => {
    // Scroll smoothly to top via Lenis or fallback to window.scrollTo
    const winLenis = (window as unknown as { lenis?: { scrollTo: (target: number, opts?: object) => void } }).lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else if (winLenis) {
      winLenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <button
      ref={buttonRef}
      id="scroll-to-top"
      type="button"
      onClick={handleClick}
      aria-label="Scroll back to top"
      title="Back to top"
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-[var(--skin-color,#ff7b00)] to-[var(--skin-color-end,#ff4500)] text-white shadow-[0_0_20px_rgba(255,123,0,0.5)] hover:shadow-[0_0_35px_rgba(255,123,0,0.85)] hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer border border-white/20 group focus:outline-none focus:ring-2 focus:ring-[var(--skin-color)]"
      style={{ opacity: 0, pointerEvents: "none", transform: "translateY(20px) scale(0.8)" }}
    >
      {/* Pulse ring animation */}
      <span className="absolute inset-0 rounded-full bg-[var(--skin-color,#ff7b00)] opacity-40 animate-ping pointer-events-none group-hover:opacity-75" />

      {/* Primary Arrow Icon */}
      <FontAwesomeIcon
        icon={faArrowUp}
        className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:-translate-y-0.5"
      />
    </button>
  );
}

export default ScrollToTop;
