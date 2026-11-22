"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface TextSplitProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
}

export function TextSplit({
  text,
  as: Component = "span",
  className = "",
  delay = 0,
  stagger = 0.025,
  duration = 0.6,
}: TextSplitProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const hasAnimatedRef = useRef<boolean>(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || hasAnimatedRef.current) return;

    const chars = el.querySelectorAll<HTMLSpanElement>(".split-char");
    if (!chars.length) return;

    gsap.set(chars, { yPercent: 120, opacity: 0, rotateZ: 3 });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            gsap.to(chars, {
              yPercent: 0,
              opacity: 1,
              rotateZ: 0,
              duration,
              stagger,
              delay,
              ease: "back.out(1.5)",
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [delay, stagger, duration]);

  // Split string into characters while handling spaces
  const charList = Array.from(text);

  return (
    // @ts-expect-error dynamic component type
    <Component ref={containerRef} className={`inline-block ${className}`}>
      {charList.map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="inline-block overflow-hidden align-top"
        >
          <span className="split-char inline-block">
            {char === " " ? "\u00A0" : char}
          </span>
        </span>
      ))}
    </Component>
  );
}

export default TextSplit;

