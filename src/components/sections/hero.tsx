"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { personalInfo, typingStrings } from "@/lib/data";
import { useLenis } from "@/components/providers/lenis-provider";

export function HeroSection() {
  const lenis = useLenis();
  const heroRef = useRef<HTMLElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const imageColRef = useRef<HTMLDivElement>(null);
  const tiltCardRef = useRef<HTMLDivElement>(null);

  // Interactive 3D mouse parallax tilt for hero image
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = tiltCardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = -(y / (rect.height / 2)) * 8;
    const rotateY = (x / (rect.width / 2)) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025)`;
  };

  const handleMouseLeave = () => {
    const card = tiltCardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  // Pure JS Typing Animation State
  const [displayText, setDisplayText] = useState("");
  const [stringIndex, setStringIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = typingStrings[stringIndex % typingStrings.length];
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayText.length < currentWord.length) {
        // Typing forward
        timer = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        }, 90);
      } else {
        // Finished word, pause before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1600);
      }
    } else {
      if (displayText.length > 0) {
        // Backspacing
        timer = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length - 1));
        }, 45);
      } else {
        // Finished deleting, proceed to next word after short pause
        timer = setTimeout(() => {
          setIsDeleting(false);
          setStringIndex((prev) => (prev + 1) % typingStrings.length);
        }, 350);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, stringIndex]);

  // GSAP Entrance Animations triggered seamlessly on preloader dismiss (or immediately if already cleared)
  useEffect(() => {
    const playEntrance = () => {
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      const ctx = gsap.context(() => {
        if (textColRef.current && imageColRef.current) {
          const textElements = textColRef.current.children;

          gsap.fromTo(
            textElements,
            {
              x: isMobile ? 0 : -50,
              y: isMobile ? 18 : 0,
              opacity: 0,
            },
            {
              x: 0,
              y: 0,
              opacity: 1,
              duration: isMobile ? 0.45 : 0.85,
              stagger: isMobile ? 0.05 : 0.12,
              ease: "power3.out",
            }
          );

          gsap.fromTo(
            imageColRef.current,
            {
              x: isMobile ? 0 : 50,
              y: isMobile ? 18 : 0,
              opacity: 0,
              scale: isMobile ? 0.98 : 0.94,
            },
            {
              x: 0,
              y: 0,
              opacity: 1,
              scale: 1,
              duration: isMobile ? 0.5 : 1.0,
              ease: "power3.out",
              delay: isMobile ? 0.05 : 0.1,
            }
          );
        }
      }, heroRef);

      return ctx;
    };

    let ctx: gsap.Context | null = null;
    const isDismissed = typeof window !== "undefined" && (window as unknown as { __preloaderDismissed?: boolean }).__preloaderDismissed;
    const hasPreloader = typeof document !== "undefined" && !!document.getElementById("preloader");

    if (isDismissed || !hasPreloader) {
      const timer = setTimeout(() => {
        ctx = playEntrance();
      }, 150);
      return () => {
        clearTimeout(timer);
        ctx?.revert();
      };
    } else {
      const handleDismiss = () => {
        ctx = playEntrance();
      };
      window.addEventListener("preloaderDismiss", handleDismiss, { once: true });
      return () => {
        window.removeEventListener("preloaderDismiss", handleDismiss);
        ctx?.revert();
      };
    }
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      if (lenis) {
        lenis.scrollTo(target as HTMLElement, { offset: -70, duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      ref={heroRef}
      id="home"
      role="region"
      aria-label="Introduction and Overview"
      className="relative min-h-screen w-full flex items-center justify-center pt-24 pb-16 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 overflow-hidden"
    >
      {/* Background Ambient Glow Elements */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[var(--skin-color)]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[var(--skin-color-end)]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-[1800px] 2xl:max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Text Column (Col 7) */}
        <div
          ref={textColRef}
          className="lg:col-span-7 flex flex-col justify-center space-y-6 text-left"
        >
          {/* Status Chip */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-[var(--skin-color)]/10 text-[var(--skin-color)] border border-[var(--skin-color)]/25 w-fit">
            <FontAwesomeIcon icon={faShieldHalved} className="h-3.5 w-3.5 animate-pulse" />
            <span>Cybersecurity Specialist & Full-Stack Builder</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Hello, my name is{" "}
            <span className="text-[var(--skin-color)] font-extrabold tracking-tight inline-block drop-shadow-sm">
              {personalInfo.name}
            </span>
          </h1>

          {/* Dynamic Typing Title */}
          <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-muted-foreground flex items-center flex-wrap min-h-[2.5rem]">
            <span className="mr-2 text-foreground font-medium">I&apos;m a</span>
            <span className="font-mono text-[var(--skin-color)] border-b-2 border-[var(--skin-color)] text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
              {displayText}
            </span>
            <span className="inline-block w-0.5 h-6 sm:h-7 bg-[var(--skin-color)] ml-1 animate-pulse" />
          </div>

          {/* Bio Description */}
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-4xl">
            {personalInfo.description}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href={personalInfo.hireMeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Hire Tushar Basak on LinkedIn"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm sm:text-base bg-gradient-to-r from-[var(--skin-color)] to-[var(--skin-color-end)] !text-white shadow-lg shadow-[var(--skin-color)]/30 hover:shadow-xl hover:shadow-[var(--skin-color)]/45 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <FontAwesomeIcon icon={faLinkedin} className="h-4 w-4" />
              <span>Hire Me</span>
            </a>

            <a
              href="#about"
              onClick={(e) => scrollToSection(e, "#about")}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base border-2 border-border/80 bg-card hover:bg-accent/80 hover:border-[var(--skin-color)]/60 text-foreground shadow-xs hover:shadow hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <span>Explore Profile</span>
              <FontAwesomeIcon icon={faArrowDown} className="h-3.5 w-3.5 text-[var(--skin-color)]" />
            </a>
          </div>
        </div>

        {/* Right Hero Image Column with Water-like Animation & Avatar Brought Forward (Col 5) */}
        <div
          ref={imageColRef}
          className="lg:col-span-5 flex items-center justify-center lg:justify-end"
        >
          {/* 3D Tilt & Floating Container */}
          <div
            ref={tiltCardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="animate-hero-float relative w-64 h-76 sm:w-80 sm:h-96 md:w-96 md:h-[28rem] flex items-center justify-center transition-transform duration-300 ease-out select-none cursor-pointer max-w-[calc(100vw-3rem)]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Ambient Multi-layered Glowing Water Aura */}
            <div className="animate-morph-blob absolute w-[98%] h-[98%] bg-gradient-to-tr from-[var(--skin-color)] to-[var(--skin-color-end)] opacity-35 blur-3xl pointer-events-none" />

            {/* Orbiting Cyber Dashed Ring */}
            <div className="absolute -inset-3 sm:-inset-4 rounded-full border border-dashed border-[var(--skin-color)]/25 animate-spin [animation-duration:35s] pointer-events-none" />

            {/* Circular Water-like Morphing Fluid Animation */}
            <div
              className="animate-morph-blob absolute w-[86%] h-[86%] bg-gradient-to-tr from-[var(--skin-color)] via-[var(--skin-color)]/70 to-[var(--skin-color-end)] shadow-[0_15px_45px_color-mix(in_oklch,var(--skin-color)_45%,transparent)] transition-all duration-700 pointer-events-none"
              style={{ zIndex: 1 }}
            />

            {/* Hero Image Brought Forward Directly Over the Water-like Animation */}
            <div className="relative z-10 w-full h-full flex items-end justify-center pointer-events-auto">
              <img
                src={personalInfo.avatarUrl}
                alt={`${personalInfo.name} - ${personalInfo.jobTitle}`}
                className="w-full h-full object-contain object-bottom drop-shadow-[0_20px_30px_oklch(0_0_0_/_0.5)] hover:scale-105 transition-transform duration-500 ease-out select-none"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
