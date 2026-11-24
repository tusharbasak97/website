"use client";

import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved, faTerminal } from "@fortawesome/free-solid-svg-icons";
import gsap from "gsap";

export function Preloader() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const barFillRef = useRef<HTMLDivElement | null>(null);
  const counterRef = useRef<HTMLSpanElement | null>(null);

  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Respect reduced-motion preferences
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      if (typeof window !== "undefined") {
        (window as unknown as { __preloaderDismissed?: boolean }).__preloaderDismissed = true;
        window.dispatchEvent(new CustomEvent("preloaderDismiss"));
        window.dispatchEvent(new CustomEvent("preloaderDone"));
      }
      requestAnimationFrame(() => {
        setIsDone(true);
      });
      return;
    }

    // Stop Lenis during preloader so scroll position stays clean at top
    if (typeof window !== "undefined") {
      const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void; resize: () => void } }).lenis;
      if (lenis) lenis.stop();
    }

    const progressObj = { value: 0 };

    const statusSteps = [
      { at: 0, text: "INITIALIZING SECURITY KERNEL..." },
      { at: 20, text: "ENCRYPTING COMMUNICATIONS..." },
      { at: 45, text: "LOADING SOC MODULES..." },
      { at: 75, text: "VERIFYING ZERO TRUST..." },
      { at: 100, text: "ACCESS GRANTED" },
    ];

    const tl = gsap.timeline();

    // 1. Logo entrance
    tl.fromTo(
      logoRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(1.5)" }
    );

    // 2. Deliberate, smooth progress counter from 0 to 100
    tl.to(
      progressObj,
      {
        value: 100,
        duration: 1.1,
        ease: "power2.inOut",
        onUpdate: () => {
          const current = Math.min(100, Math.floor(progressObj.value));
          if (barFillRef.current) {
            barFillRef.current.style.width = `${current}%`;
          }
          if (counterRef.current) {
            counterRef.current.textContent = `${current}%`;
          }
          const found = statusSteps.filter((s) => current >= s.at).pop();
          if (found && textRef.current && textRef.current.textContent !== found.text) {
            textRef.current.textContent = found.text;
          }
        },
      },
      "-=0.1"
    );

    // Ensure 100% and ACCESS GRANTED are explicitly set on completion
    tl.add(() => {
      if (barFillRef.current) barFillRef.current.style.width = "100%";
      if (counterRef.current) counterRef.current.textContent = "100%";
      if (textRef.current) textRef.current.textContent = "ACCESS GRANTED";
    });

    // 3. Hold at 100% for 0.35s so the user clearly sees completion
    tl.to({}, { duration: 0.35 });

    // 4. Smooth curtain slide away
    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 0.5,
      ease: "power3.inOut",
      onStart: () => {
        if (typeof window !== "undefined") {
          (window as unknown as { __preloaderDismissed?: boolean }).__preloaderDismissed = true;
          window.dispatchEvent(new CustomEvent("preloaderDismiss"));
        }
      },
      onComplete: () => {
        if (typeof window !== "undefined") {
          const win = window as unknown as { lenis?: { start: () => void; resize: () => void } };
          if (win.lenis) {
            win.lenis.start();
            win.lenis.resize();
          }
          window.dispatchEvent(new CustomEvent("preloaderDone"));
        }
        setIsDone(true);
      },
    });

    return () => {
      tl.kill();
      if (typeof window !== "undefined") {
        const win = window as unknown as { lenis?: { start: () => void; resize: () => void } };
        if (win.lenis) {
          win.lenis.start();
          win.lenis.resize();
        }
      }
    };
  }, []);

  if (isDone) return null;

  return (
    <div
      ref={containerRef}
      id="preloader"
      className="fixed inset-0 z-[999999] overflow-hidden bg-background text-foreground flex flex-col items-center justify-center p-4 font-sans select-none transition-colors duration-300"
    >
      {/* Background Ambient Glow matching website */}
      <div className="absolute top-1/3 -left-24 w-80 h-80 bg-skin/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-24 w-80 h-80 bg-skin-end/10 rounded-full blur-3xl pointer-events-none" />

      {/* Center Preloader Content */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center">
        {/* Animated Cyber Shield with Dual Orbital Rings */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Outer dashed spinning ring */}
          <div className="absolute -inset-3.5 rounded-full border border-dashed border-skin/35 animate-spin [animation-duration:5s] pointer-events-none" />

          {/* Inner counter-rotating ring */}
          <div className="absolute -inset-1.5 rounded-full border border-skin/25 animate-spin [animation-duration:3.5s] [animation-direction:reverse] pointer-events-none" />

          {/* Center Cyber Shield Logo */}
          <div
            ref={logoRef}
            className="pulse-glow relative flex items-center justify-center w-20 h-20 rounded-2xl bg-card border-2 border-skin shadow-xl shadow-skin/20 dark:shadow-[0_0_30px_color-mix(in_oklch,var(--skin-color)_40%,transparent)]"
          >
            <FontAwesomeIcon
              icon={faShieldHalved}
              className="w-10 h-10 text-skin"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-background animate-ping" />
          </div>
        </div>

        {/* Name / Brand Title adhering to website typography */}
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground uppercase mb-1">
          Tushar <span className="text-skin">Basak</span>
        </h2>
        <p className="text-xs text-skin tracking-wider mb-6 font-semibold uppercase">
          CYBERSECURITY ANALYST &bull; PORTFOLIO
        </p>

        {/* Progress Bar Container adapting to theme */}
        <div className="w-full bg-black/10 dark:bg-white/10 border border-border/80 rounded-full h-2.5 p-0.5 mb-3 overflow-hidden shadow-inner">
          <div
            ref={barFillRef}
            className="h-full bg-linear-to-r from-skin to-skin-end rounded-full shadow-[0_0_12px_color-mix(in_oklch,var(--skin-color)_70%,transparent)] relative overflow-hidden"
            style={{ width: "0%" }}
          >
            {/* Shimmer sweep animation across the progress bar */}
            <div className="animate-shimmer-sweep absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Status Line & Percentage (font-mono strictly for cyber telemetry) */}
        <div className="flex items-center justify-between w-full text-xs font-mono text-foreground/85 dark:text-muted-foreground">
          <div className="flex items-center gap-2 truncate max-w-[250px]">
            <FontAwesomeIcon icon={faTerminal} className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span ref={textRef} className="truncate font-medium">INITIALIZING SECURITY KERNEL...</span>
          </div>
          <span ref={counterRef} className="font-bold text-skin ml-2">
            0%
          </span>
        </div>
      </div>
    </div>
  );
}

export default Preloader;

