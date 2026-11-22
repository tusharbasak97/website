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

  // GSAP Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (textColRef.current && imageColRef.current) {
        const textElements = textColRef.current.children;

        gsap.fromTo(
          textElements,
          {
            x: -60,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.16,
            ease: "power3.out",
            delay: 0.2,
          }
        );

        gsap.fromTo(
          imageColRef.current,
          {
            x: 60,
            opacity: 0,
            scale: 0.92,
          },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 1.1,
            ease: "power3.out",
            delay: 0.35,
          }
        );
      }
    }, heroRef);

    return () => ctx.revert();
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
      className="relative min-h-screen w-full flex items-center justify-center pt-24 pb-16 px-4 sm:px-8 md:px-12 lg:px-20 xl:px-28 overflow-hidden"
    >
      {/* Background Ambient Glow Elements */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[var(--skin-color)]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[var(--skin-color-end)]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
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
            <span className="font-kaushan text-[var(--skin-color)] inline-block drop-shadow-sm">
              {personalInfo.name}
            </span>
          </h1>

          {/* Dynamic Typing Title */}
          <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-muted-foreground flex items-center flex-wrap min-h-[2.5rem]">
            <span className="mr-2 text-foreground">I&apos;m a</span>
            <span className="text-[var(--skin-color)] border-b-2 border-[var(--skin-color)] font-mono font-bold tracking-wide">
              {displayText}
            </span>
            <span className="inline-block w-0.5 h-6 sm:h-7 bg-[var(--skin-color)] ml-1 animate-pulse" />
          </div>

          {/* Bio Description */}
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            {personalInfo.description}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href={personalInfo.hireMeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Hire Tushar Basak on LinkedIn"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-white bg-[var(--gradient-primary)] hover:opacity-95 shadow-lg shadow-[var(--skin-color)]/25 hover:shadow-[var(--skin-color)]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <FontAwesomeIcon icon={faLinkedin} className="h-4 w-4" />
              <span>Hire Me</span>
            </a>

            <a
              href="#about"
              onClick={(e) => scrollToSection(e, "#about")}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium border border-border bg-card/60 hover:bg-accent hover:border-border text-foreground transition-all duration-200"
            >
              <span>Explore Profile</span>
              <FontAwesomeIcon icon={faArrowDown} className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Right Hero Image Column with Organic Blob (Col 5) */}
        <div
          ref={imageColRef}
          className="lg:col-span-5 flex items-center justify-center lg:justify-end"
        >
          <div className="relative w-72 h-84 sm:w-80 sm:h-96 md:w-96 md:h-[28rem] flex items-center justify-center">
            {/* Animated glowing decorative backdrop */}
            <div
              className="absolute inset-0 bg-gradient-to-tr from-[var(--skin-color)] to-[var(--skin-color-end)] opacity-30 blur-2xl transform scale-105 animate-pulse"
              style={{
                borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
              }}
            />

            {/* Blob Border Wrapper */}
            <div
              className="relative w-full h-full p-2 bg-gradient-to-br from-[var(--skin-color)]/80 via-transparent to-[var(--skin-color-end)]/80 shadow-2xl transition-all duration-700 hover:rotate-1"
              style={{
                borderRadius: "58% 42% 48% 52% / 48% 54% 46% 52%",
              }}
            >
              <div
                className="w-full h-full overflow-hidden bg-card/80 border-4 border-background/60 shadow-inner"
                style={{
                  borderRadius: "56% 44% 50% 50% / 50% 52% 48% 50%",
                }}
              >
                <img
                  src={personalInfo.avatarUrl}
                  alt={`${personalInfo.name} - ${personalInfo.jobTitle}`}
                  className="w-full h-full object-cover object-center transform scale-105 hover:scale-110 transition-transform duration-700 ease-out"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
