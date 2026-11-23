"use client";

import React, { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  threshold?: number;
}

export function SectionReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.5,
  yOffset = 20,
  threshold = 0,
}: SectionRevealProps) {
  const domRef = useRef<HTMLDivElement | null>(null);
  const animatedRef = useRef<boolean>(false);

  useEffect(() => {
    const el = domRef.current;
    if (!el || animatedRef.current) return;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    // On mobile, show immediately so fast-scrolling users never see blank spaces
    if (isMobile) {
      gsap.set(el, { opacity: 1, y: 0 });
      animatedRef.current = true;
      return;
    }

    gsap.set(el, { y: yOffset, opacity: 0 });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedRef.current) {
            animatedRef.current = true;
            gsap.to(el, {
              y: 0,
              opacity: 1,
              duration,
              delay,
              ease: "power3.out",
            });
            observer.disconnect();
          }
        });
      },
      { rootMargin: "250px 0px 100px 0px", threshold }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [delay, duration, yOffset, threshold]);

  return (
    <div ref={domRef} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}

export default SectionReveal;

