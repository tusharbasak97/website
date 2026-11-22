"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface CounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function Counter({
  value,
  suffix = "",
  prefix = "",
  duration = 1.5,
  className = "",
}: CounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const animatedRef = useRef<boolean>(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || animatedRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedRef.current) {
            animatedRef.current = true;
            const obj = { val: 0 };
            gsap.to(obj, {
              val: value,
              duration,
              ease: "power2.out",
              onUpdate: () => {
                setDisplayValue(Math.floor(obj.val));
              },
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={containerRef} className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

interface SkillBarProps {
  name: string;
  percent: number;
  className?: string;
  barColor?: string;
}

export function SkillBar({
  name,
  percent,
  className = "",
  barColor = "bg-[var(--skin-color,#ff7b00)]",
}: SkillBarProps) {
  const barRef = useRef<HTMLDivElement | null>(null);
  const [currentPercent, setCurrentPercent] = useState(0);
  const animatedRef = useRef<boolean>(false);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar || animatedRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedRef.current) {
            animatedRef.current = true;
            const obj = { val: 0 };
            gsap.to(obj, {
              val: percent,
              duration: 1.6,
              ease: "power2.out",
              onUpdate: () => {
                setCurrentPercent(Math.floor(obj.val));
              },
            });
            gsap.fromTo(
              bar,
              { width: "0%" },
              {
                width: `${percent}%`,
                duration: 1.6,
                ease: "power3.out",
              }
            );
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(bar);

    return () => observer.disconnect();
  }, [percent]);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1 text-sm font-medium">
        <span className="text-[var(--text-black-900)]">{name}</span>
        <span className="font-mono text-[var(--skin-color,#ff7b00)] font-semibold">
          {currentPercent}%
        </span>
      </div>
      <div className="w-full h-2.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
        <div
          ref={barRef}
          className={`h-full ${barColor} rounded-full transition-all`}
          style={{ width: "0%" }}
        />
      </div>
    </div>
  );
}

export default Counter;
