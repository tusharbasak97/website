"use client";

import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import gsap from "gsap";
import { useLenis } from "@/components/providers/lenis-provider";

export function ScrollToTop() {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const isVisibleRef = useRef<boolean>(false);
  const [, setRerender] = useState<boolean>(false);
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
          setRerender((v) => !v);
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
          setRerender((v) => !v);
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
      aria-label="Scroll to top of page"
      className="pulse-glow fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-[var(--skin-color,#ff7b00)] to-[var(--skin-color-end,#ff4500)] text-white shadow-[0_0_20px_rgba(255,123,0,0.5)] hover:shadow-[0_0_35px_rgba(255,123,0,0.85)] hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer border border-white/20"
      style={{ pointerEvents: "none" }}
    >
      <FontAwesomeIcon icon={faArrowUp} className="w-5 h-5" />
    </button>
  );
}

export default ScrollToTop;
