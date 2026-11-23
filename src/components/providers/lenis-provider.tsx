"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
    });

    const timer = setTimeout(() => {
      setLenisInstance(lenis);
    }, 0);

    if (typeof window !== "undefined") {
      (window as unknown as { lenis?: Lenis }).lenis = lenis;
    }

    // Synchronize Lenis scroll positions directly with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    const handlePreloaderDone = () => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    };
    window.addEventListener("preloaderDone", handlePreloaderDone);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("preloaderDone", handlePreloaderDone);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      if (typeof window !== "undefined") {
        delete (window as unknown as { lenis?: Lenis }).lenis;
      }
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisInstance}>
      {children}
    </LenisContext.Provider>
  );
}
