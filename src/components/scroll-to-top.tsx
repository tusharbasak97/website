"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useLenis } from "@/components/providers/lenis-provider";

export function ScrollToTop() {
  const lenis = useLenis();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Realtime scroll detection without debouncing
    const handleScroll = () => {
      const shouldShow = window.scrollY > 300;
      setVisible(shouldShow);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    if (visible) {
      gsap.to(btn, {
        y: 0,
        opacity: 1,
        scale: 1,
        pointerEvents: "auto",
        duration: 0.45,
        ease: "back.out(1.7)",
        overwrite: "auto",
      });
    } else {
      gsap.to(btn, {
        y: 20,
        opacity: 0,
        scale: 0.8,
        pointerEvents: "none",
        duration: 0.3,
        ease: "power2.in",
        overwrite: "auto",
      });
    }
  }, [visible]);

  const handleScrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleScrollToTop}
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 w-12 h-12 rounded-full bg-[var(--gradient-primary)] text-white shadow-xl shadow-[var(--skin-color)]/30 hover:shadow-2xl hover:shadow-[var(--skin-color)]/50 hover:-translate-y-1 active:translate-y-0 flex items-center justify-center transition-all duration-200 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[var(--skin-color)]"
      style={{ opacity: 0, pointerEvents: "none", transform: "translateY(20px) scale(0.8)" }}
      aria-label="Scroll back to top"
      title="Back to top"
    >
      {/* Pulse ring animation */}
      <span className="absolute inset-0 rounded-full bg-[var(--skin-color)] opacity-40 animate-ping pointer-events-none group-hover:opacity-75" />

      {/* Primary Arrow Icon */}
      <FontAwesomeIcon
        icon={faArrowUp}
        className="h-5 w-5 relative z-10 transition-transform duration-300 group-hover:-translate-y-0.5"
      />
    </button>
  );
}

export default ScrollToTop;
