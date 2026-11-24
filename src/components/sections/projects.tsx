"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExternalLinkAlt,
  faRotate,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { projects } from "@/lib/data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const scrollStart = isMobile ? "top 96%" : "top 80%";
    const animDuration = isMobile ? 0.35 : 0.7;
    const cardStagger = isMobile ? 0.04 : 0.12;
    const yShift = isMobile ? 18 : 40;

    const ctx = gsap.context(() => {
      // 1. Title & Underline Bar Reveal
      const title = section.querySelector(".projects-title-text");
      const line = section.querySelector(".projects-title-line");
      if (title && line) {
        gsap.fromTo(
          title,
          { y: isMobile ? 15 : 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: animDuration,
            ease: "power3.out",
            scrollTrigger: {
              trigger: title,
              start: "top 96%",
              once: true,
            },
          }
        );
        gsap.fromTo(
          line,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: animDuration,
            delay: isMobile ? 0.05 : 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: line,
              start: "top 96%",
              once: true,
            },
          }
        );
      }

      // 2. Project Item Cards Staggered Entrance
      const grid = gridRef.current;
      if (grid) {
        const cards = grid.querySelectorAll(".project-item");
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: yShift,
            scale: isMobile ? 0.98 : 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: animDuration,
            stagger: cardStagger,
            ease: "power2.out",
            scrollTrigger: {
              trigger: grid,
              start: scrollStart,
              once: true,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      role="region"
      aria-label="My Projects Portfolio"
      className="w-full py-20 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 overflow-hidden"
    >
      <div className="w-full max-w-[1800px] 2xl:max-w-[1920px] mx-auto">
        {/* Anchor for #projects compatibility */}
        <span id="projects" className="sr-only" />

      {/* Section Title - NO DOT */}
      <div className="mb-14 text-left">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground flex items-center gap-4">
          <span className="projects-title-text">My Projects</span>
          <span className="projects-title-line h-1 flex-1 max-w-[100px] bg-[var(--skin-color)] rounded-full" />
        </h2>
        <p className="mt-2 text-muted-foreground text-base sm:text-lg">
          A showcase of cybersecurity utilities, web development platforms, and technical innovations
        </p>
      </div>

      {/* 3 cols desktop, 2 cols tablet, 1 col mobile */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {projects.map((project) => {
          const isFlipped = Boolean(flippedCards[project.id]);

          return (
            <article
              key={project.id}
              className="project-item h-[420px] rounded-3xl"
              style={{ perspective: "1200px" }}
            >
              <div
                className={`relative w-full h-full duration-700 transition-transform ${
                  isFlipped ? "rotate-y-180" : ""
                } group-hover:rotate-y-180`}
                style={{
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateY(180deg)" : undefined,
                }}
              >
                {/* ================= FRONT OF CARD ================= */}
                <div
                  className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden bg-card border border-border shadow-md hover:border-[var(--skin-color)]/50 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between p-6 transition-all duration-300 group"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  {/* Top Image/Video Container */}
                  <div className="relative w-full h-52 rounded-2xl overflow-hidden bg-muted/50 border border-border/40">
                    {project.videoUrl ? (
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="none"
                        poster={project.posterUrl || project.imageUrl}
                        className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                        aria-label={project.title}
                      >
                        <source src={project.videoUrl} type="video/webm" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={project.posterUrl || project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover object-top"
                          loading="lazy"
                          decoding="async"
                        />
                      </video>
                    ) : (
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        width={600}
                        height={380}
                        className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-background/90 dark:bg-card/90 backdrop-blur-md text-[var(--skin-color)] border border-border/60 shadow-sm">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Info */}
                  <div className="pt-4 flex items-end justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-[var(--skin-color)] transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faShieldHalved} className="h-3 w-3 text-[var(--skin-color)]" />
                        <span>Interactive Card</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleFlip(project.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-muted-foreground bg-muted hover:text-foreground transition-colors cursor-pointer"
                      title="Flip card for details"
                      aria-label="Flip card for details"
                    >
                      <FontAwesomeIcon icon={faRotate} className="h-3 w-3" />
                      <span className="hidden sm:inline">Flip</span>
                    </button>
                  </div>
                </div>

                {/* ================= BACK OF CARD ================= */}
                <div
                  className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-card via-card to-card/95 border-2 border-[var(--skin-color)]/40 shadow-2xl p-7 flex flex-col justify-between"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-border/60">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--skin-color)]">
                        {project.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleFlip(project.id)}
                        className="text-xs text-muted-foreground hover:text-foreground p-1 rounded cursor-pointer"
                        title="Flip back"
                        aria-label="Flip back"
                      >
                        <FontAwesomeIcon icon={faRotate} className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <h3 className="text-2xl font-extrabold text-foreground mt-4 mb-3">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 pt-4 border-t border-border/60">
                    <div className="flex flex-wrap items-center gap-3">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-[var(--skin-color)] to-[var(--skin-color-end)] !text-white shadow-md hover:shadow-lg hover:shadow-[var(--skin-color)]/35 transition-all cursor-pointer"
                        >
                          <span>Live Demo</span>
                          <FontAwesomeIcon icon={faExternalLinkAlt} className="h-3 w-3" />
                        </a>
                      )}

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-foreground bg-card hover:bg-accent/80 border-2 border-border shadow-xs hover:border-foreground/40 transition-all cursor-pointer"
                        >
                          <FontAwesomeIcon icon={faGithub} className="h-3.5 w-3.5" />
                          <span>View Code</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      </div>
    </section>
  );
}

export default ProjectsSection;
