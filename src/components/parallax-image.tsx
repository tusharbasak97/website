"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

interface ParallaxImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  speed?: number; // Parallax translation multiplier (default: -0.15)
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

export function ParallaxImage({
  src,
  alt,
  width,
  height,
  fill = false,
  speed = -0.12,
  className = "",
  imageClassName = "",
  priority = false,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const imgEl = imageRef.current;
    if (!container || !imgEl) return;

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!container || !imgEl) return;
          const rect = container.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          // Only calculate if visible
          if (rect.top < windowHeight && rect.bottom > 0) {
            const centerY = rect.top + rect.height / 2;
            const screenCenter = windowHeight / 2;
            const offset = (centerY - screenCenter) * speed;

            gsap.to(imgEl, {
              y: offset,
              duration: 0.4,
              ease: "power1.out",
              overwrite: "auto",
            });
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      <div ref={imageRef} className="w-full h-full transform will-change-transform">
        {fill ? (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            className={`object-cover ${imageClassName}`}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width || 500}
            height={height || 500}
            priority={priority}
            className={`w-full h-auto object-cover ${imageClassName}`}
          />
        )}
      </div>
    </div>
  );
}

export default ParallaxImage;
