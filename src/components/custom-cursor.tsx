"use client";

import React, { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip on touch/mobile devices or coarse pointer devices
    if (
      typeof window === "undefined" ||
      window.matchMedia("(pointer: coarse)").matches ||
      !window.matchMedia("(hover: hover)").matches
    ) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId: number;
    let isVisible = false;
    let isActive = false;

    // Movement updates coordinates and ensures cursor visibility
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        ringX = mouseX;
        ringY = mouseY;
        dot.classList.add("visible");
        ring.classList.add("visible");
      }

      // If active on a link/button, lock ring coordinates directly to mouse
      // so it never lags behind or jumps in from an offset position upon unhover
      if (isActive) {
        ringX = mouseX;
        ringY = mouseY;
      }

      // Instant hardware-accelerated placement for central dot
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    };

    // When mouse truly leaves the browser window bounds
    const onMouseLeave = (e: MouseEvent) => {
      if (
        !e.relatedTarget &&
        (e.clientY <= 0 || e.clientX <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight)
      ) {
        isVisible = false;
        dot.classList.remove("visible");
        ring.classList.remove("visible");
      }
    };

    const onMouseEnter = () => {
      isVisible = true;
      dot.classList.add("visible");
      ring.classList.add("visible");
    };

    // Smooth RAF lerp loop for trailing ring
    const render = () => {
      if (isActive) {
        // Keep ring centered on mouse while active
        ringX = mouseX;
        ringY = mouseY;
      } else {
        // Smooth lerp when moving freely
        ringX += (mouseX - ringX) * 0.22;
        ringY += (mouseY - ringY) * 0.22;
      }
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    // Interactive target detection
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        "a, button, input, textarea, select, label, [role='button'], .cursor-pointer, .clickable"
      );

      if (interactive) {
        isActive = true;
        ringX = mouseX;
        ringY = mouseY;
        dot.classList.add("active");
        ring.classList.add("active");
      } else {
        isActive = false;
        dot.classList.remove("active");
        ring.classList.remove("active");
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-1"
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className="cursor-2"
        aria-hidden="true"
      />
    </>
  );
}

export default CustomCursor;
