"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faCalendarDay,
  faClock,
  faEnvelope,
  faGraduationCap,
  faLocationDot,
  faBriefcase,
  faCode,
  faTerminal,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
  personalInfo,
  skills,
  educationTimeline,
  experienceTimeline,
} from "@/lib/data";
import { ContactSection } from "./contact";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function calculateRealtimeAge(birthdayStr: string): string {
  const birthDate = new Date(birthdayStr);
  const now = new Date();

  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();

  if (now.getDate() < birthDate.getDate()) {
    months--;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return `${years} yrs & ${months} months`;
}

interface AboutSectionProps {
  includeContact?: boolean;
}

export function AboutSection({ includeContact = false }: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const skillsContainerRef = useRef<HTMLDivElement>(null);
  const [ageDisplay, setAgeDisplay] = useState<string>("");

  useEffect(() => {
    const updateAge = () => {
      setAgeDisplay(calculateRealtimeAge(personalInfo.birthday));
    };
    updateAge();
    const interval = setInterval(updateAge, 60000);
    return () => clearInterval(interval);
  }, []);

  // GSAP ScrollTrigger for all About section components
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const scrollStart = isMobile ? "top 96%" : "top 88%";
    const animDuration = isMobile ? 0.35 : 0.7;
    const cardStagger = isMobile ? 0.04 : 0.12;
    const yShift = isMobile ? 18 : 35;

    const ctx = gsap.context(() => {
      // 1. Section Title & Underline Bar Reveal
      const title = section.querySelector(".about-title-text");
      const line = section.querySelector(".about-title-line");
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
              toggleActions: "play none none none",
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
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 2. Bio & Personal Info Cards Staggered Entrance
      const bioElements = section.querySelectorAll(".about-bio-item");
      const introGrid = section.querySelector(".about-intro-grid") || section;
      if (bioElements && bioElements.length > 0) {
        gsap.fromTo(
          bioElements,
          { y: yShift, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: animDuration,
            stagger: cardStagger,
            ease: "power3.out",
            scrollTrigger: {
              trigger: introGrid,
              start: scrollStart,
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 3. Technical Proficiencies Cards Entrance & Progress Bars
      const skillCards = section.querySelectorAll<HTMLElement>(".skill-card-item");
      const skillsContainer = skillsContainerRef.current || section;
      if (skillCards && skillCards.length > 0) {
        gsap.fromTo(
          skillCards,
          { y: yShift, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: isMobile ? 0.35 : 0.6,
            stagger: isMobile ? 0.04 : 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: skillsContainer,
              start: scrollStart,
              toggleActions: "play none none none",
            },
          }
        );
      }

      skillCards.forEach((card) => {
        const bar = card.querySelector<HTMLElement>(".skill-progress-bar");
        const shimmer = card.querySelector<HTMLElement>(".skill-shimmer");
        const counter = card.querySelector<HTMLElement>(".skill-counter");
        if (!bar || !counter) return;

        const targetPercentage = parseInt(bar.getAttribute("data-percentage") || "0", 10);
        const counterObj = { val: 0 };
        const barDuration = isMobile ? 0.7 : 1.3;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: isMobile ? "top 96%" : "top 88%",
            toggleActions: "play none none none",
          },
        });

        // Expand bar width & count up percentage synchronously
        tl.to(
          bar,
          {
            width: `${targetPercentage}%`,
            duration: barDuration,
            ease: "power2.out",
          },
          0
        ).to(
          counterObj,
          {
            val: targetPercentage,
            duration: barDuration,
            ease: "power2.out",
            onUpdate: () => {
              counter.textContent = `${Math.round(counterObj.val)}%`;
            },
          },
          0
        );

        // Smooth completion animation on completion: glow flare, shimmer sweep, and counter pop
        tl.add(() => {
          if (shimmer) {
            gsap.fromTo(
              shimmer,
              { x: "-100%" },
              { x: "250%", duration: isMobile ? 0.5 : 0.9, ease: "power2.inOut" }
            );
          }
          gsap.fromTo(
            bar,
            { filter: "brightness(1.35) drop-shadow(0 0 8px var(--skin-color))" },
            { filter: "brightness(1) drop-shadow(0 0 0px transparent)", duration: 0.6, ease: "power2.out" }
          );
          gsap.fromTo(
            counter,
            { scale: 1.15, color: "var(--skin-color)" },
            { scale: 1, duration: 0.35, ease: "back.out(2.2)" }
          );
        });
      });

      // 4. Education & Experience Timeline Containers & Items
      const timelineContainers = section.querySelectorAll(".timeline-container-card");
      const timelinesContainer = section.querySelector(".timelines-container") || section;
      if (timelineContainers && timelineContainers.length > 0) {
        gsap.fromTo(
          timelineContainers,
          { y: yShift, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: animDuration,
            stagger: cardStagger,
            ease: "power2.out",
            scrollTrigger: {
              trigger: timelinesContainer,
              start: scrollStart,
              toggleActions: "play none none none",
            },
          }
        );
      }

      const timelineCards = section.querySelectorAll(".timeline-card-item");
      if (timelineCards && timelineCards.length > 0) {
        gsap.fromTo(
          timelineCards,
          { x: isMobile ? 0 : -30, y: isMobile ? 12 : 0, opacity: 0 },
          {
            x: 0,
            y: 0,
            opacity: 1,
            duration: animDuration,
            stagger: cardStagger,
            ease: "power2.out",
            scrollTrigger: {
              trigger: timelinesContainer,
              start: isMobile ? "top 95%" : "top 82%",
              toggleActions: "play none none none",
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
      id="about"
      role="region"
      aria-label="About Me and Professional Background"
      className="w-full py-20 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 overflow-hidden"
    >
      <div className="w-full max-w-[1800px] 2xl:max-w-[1920px] mx-auto">
        {/* Section Title - NO DOT */}
        <div className="mb-14 text-left">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground flex items-center gap-4">
          <span className="about-title-text">About Me</span>
          <span className="about-title-line h-1 flex-1 max-w-[100px] bg-skin rounded-full" />
        </h2>
        <p className="mt-2 text-muted-foreground text-base sm:text-lg">
          Get to know my journey, core expertise, educational background, and technical toolset
        </p>
      </div>

      {/* Intro Bio & Personal Info Grid */}
      <div className="about-intro-grid grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-20">
        {/* Bio Paragraphs (Col 7) */}
        <div className="lg:col-span-7 space-y-6 text-muted-foreground leading-relaxed text-base sm:text-lg">
          <p className="about-bio-item p-5 rounded-2xl bg-card border border-border shadow-sm hover:border-skin/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            {personalInfo.aboutP1}
          </p>
          <p className="about-bio-item p-5 rounded-2xl bg-card border border-border shadow-sm hover:border-skin/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            {personalInfo.aboutP2}
          </p>

          <div className="about-bio-item flex flex-wrap items-center gap-4 pt-2">
            <a
              href={personalInfo.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              download="Tushar_Basak_Resume.pdf"
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-xl font-semibold bg-linear-to-r from-skin to-skin-end !text-white shadow-md shadow-skin/30 hover:shadow-lg hover:shadow-skin/45 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <FontAwesomeIcon icon={faDownload} className="h-4 w-4" />
              <span>Download Resume</span>
            </a>

            <a
              href={personalInfo.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold border-2 border-border/80 bg-card hover:bg-accent/80 hover:border-skin/60 text-foreground shadow-xs hover:shadow hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} className="h-3.5 w-3.5 text-skin" />
              <span>View resume</span>
            </a>
          </div>
        </div>

        {/* Personal Details Grid (Col 5) */}
        <div className="about-bio-item lg:col-span-5 p-6 rounded-2xl bg-card border border-border shadow-sm hover:border-skin/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <h3 className="text-xl font-bold text-foreground mb-6 pb-3 border-b border-border flex items-center justify-between">
            <span>Personal Information</span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-skin/10 text-skin">
              Verified
            </span>
          </h3>

          <div className="space-y-4 text-sm sm:text-base">
            {/* Birthday */}
            <div className="flex items-center justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground flex items-center gap-2">
                <FontAwesomeIcon icon={faCalendarDay} className="h-3.5 w-3.5 text-skin" />
                Birthday:
              </span>
              <span className="font-semibold text-foreground">{personalInfo.birthdayDisplay}</span>
            </div>

            {/* Realtime Age */}
            <div className="flex items-center justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground flex items-center gap-2">
                <FontAwesomeIcon icon={faClock} className="h-3.5 w-3.5 text-skin" />
                Age:
              </span>
              <span className="font-semibold text-foreground font-mono">
                {ageDisplay || "Calculating..."}
              </span>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground flex items-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} className="h-3.5 w-3.5 text-skin" />
                Email:
              </span>
              <a
                href={`mailto:${personalInfo.email}`}
                className="font-semibold text-foreground hover:text-skin transition-colors truncate max-w-[200px]"
                title={personalInfo.email}
              >
                {personalInfo.email}
              </a>
            </div>

            {/* Degree */}
            <div className="flex items-center justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground flex items-center gap-2">
                <FontAwesomeIcon icon={faGraduationCap} className="h-3.5 w-3.5 text-skin" />
                Degree:
              </span>
              <span className="font-semibold text-foreground">{personalInfo.degree}</span>
            </div>

            {/* WhatsApp */}
            <div className="flex items-center justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground flex items-center gap-2">
                <FontAwesomeIcon icon={faWhatsapp} className="h-3.5 w-3.5 text-emerald-500" />
                WhatsApp:
              </span>
              <a
                href={personalInfo.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                Chat on WhatsApp
              </a>
            </div>

            {/* Location */}
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground flex items-center gap-2">
                <FontAwesomeIcon icon={faLocationDot} className="h-3.5 w-3.5 text-skin" />
                Location:
              </span>
              <span className="font-semibold text-foreground">{personalInfo.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section with Animated Progress Bars */}
      <div ref={skillsContainerRef} className="mb-24">
        <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
          <FontAwesomeIcon icon={faCode} className="h-6 w-6 text-skin" />
          <span>Technical Proficiencies</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="skill-card-item p-5 rounded-2xl bg-card border border-border shadow-sm hover:border-skin/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex justify-between items-center mb-2.5">
                <span className="font-bold text-base sm:text-lg text-foreground flex items-center gap-2 group-hover:text-skin transition-colors">
                  <FontAwesomeIcon icon={faTerminal} className="h-3.5 w-3.5 text-skin" />
                  {skill.name}
                </span>
                <span className="skill-counter text-sm font-mono font-bold text-skin origin-right">
                  0%
                </span>
              </div>
              <div className="w-full h-3.5 bg-slate-200/90 dark:bg-muted/80 rounded-full overflow-hidden p-0.5 border border-border/50 shadow-inner">
                <div
                  className="skill-progress-bar relative h-full rounded-full bg-linear-to-r from-skin to-skin-end transition-none shadow-sm overflow-hidden"
                  data-percentage={skill.percentage}
                  style={{ width: "0%" }}
                >
                  {/* Smooth shimmer sweep element */}
                  <span className="skill-shimmer absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education & Experience Timelines */}
      <div className="timelines-container grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Education Timeline */}
        <div className="timeline-container-card p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm hover:border-skin/40 hover:shadow-lg transition-all duration-300">
          <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-skin/10 text-skin flex items-center justify-center">
              <FontAwesomeIcon icon={faGraduationCap} className="h-5 w-5" />
            </div>
            <span>Education</span>
          </h3>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-border space-y-10">
            {educationTimeline.map((edu, idx) => (
              <div key={idx} className="timeline-card-item relative group">
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-4 border-background bg-skin group-hover:scale-125 transition-transform" />

                <div className="inline-block px-3 py-1 rounded-md text-xs font-mono font-semibold bg-accent text-skin mb-2">
                  {edu.period}
                </div>

                <h4 className="text-lg sm:text-xl font-bold text-foreground">
                  {edu.title}
                </h4>
                <p className="text-sm font-medium text-skin mb-2">
                  {edu.organization}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {edu.description}
                </p>

                {edu.cgpaOrDistinction && (
                  <span className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                    {edu.cgpaOrDistinction}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Experience Timeline */}
        <div className="timeline-container-card p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm hover:border-skin/40 hover:shadow-lg transition-all duration-300">
          <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-skin/10 text-skin flex items-center justify-center">
              <FontAwesomeIcon icon={faBriefcase} className="h-5 w-5" />
            </div>
            <span>Experience</span>
          </h3>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-border space-y-10">
            {experienceTimeline.map((exp, idx) => (
              <div key={idx} className="timeline-card-item relative group">
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-4 border-background bg-skin group-hover:scale-125 transition-transform" />

                <div className="inline-block px-3 py-1 rounded-md text-xs font-mono font-semibold bg-accent text-skin mb-2">
                  {exp.period}
                </div>

                <h4 className="text-lg sm:text-xl font-bold text-foreground">
                  {exp.title}
                </h4>
                <p className="text-sm font-medium text-skin mb-2">
                  {exp.organization}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

        {/* Conditionally rendered contact form inside about */}
        {includeContact && (
          <div className="pt-6 border-t border-border">
            <ContactSection standalone={false} />
          </div>
        )}
      </div>
    </section>
  );
}

export default AboutSection;
