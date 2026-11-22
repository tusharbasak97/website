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
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
  personalInfo,
  skills,
  educationTimeline,
  experienceTimeline,
} from "@/lib/data";
import { useLenis } from "@/components/providers/lenis-provider";
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
  const lenis = useLenis();
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

  // GSAP ScrollTrigger for animated skill progress bars
  useEffect(() => {
    const ctx = gsap.context(() => {
      const bars = gsap.utils.toArray<HTMLElement>(".skill-progress-bar");
      bars.forEach((bar) => {
        const targetWidth = bar.getAttribute("data-percentage") || "0";
        gsap.fromTo(
          bar,
          { width: "0%" },
          {
            width: `${targetWidth}%`,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: bar,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("contact");
    if (target) {
      if (lenis) {
        lenis.scrollTo(target, { offset: -70, duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      role="region"
      aria-label="About Me and Professional Background"
      className="w-full py-20 px-4 sm:px-8 md:px-12 lg:px-20 xl:px-28"
    >
      {/* Section Title - NO DOT */}
      <div className="mb-14 text-left">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground flex items-center gap-4">
          <span>About Me</span>
          <span className="h-1 flex-1 max-w-[100px] bg-[var(--skin-color)] rounded-full" />
        </h2>
        <p className="mt-2 text-muted-foreground text-base sm:text-lg">
          Get to know my journey, core expertise, educational background, and technical toolset
        </p>
      </div>

      {/* Intro Bio & Personal Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-20">
        {/* Bio Paragraphs (Col 7) */}
        <div className="lg:col-span-7 space-y-6 text-muted-foreground leading-relaxed text-base sm:text-lg">
          <p className="p-5 rounded-2xl bg-card border border-border shadow-sm">
            {personalInfo.aboutP1}
          </p>
          <p className="p-5 rounded-2xl bg-card border border-border shadow-sm">
            {personalInfo.aboutP2}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href={personalInfo.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              download="Tushar_Basak_Resume.pdf"
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-xl font-semibold text-white bg-[var(--gradient-primary)] hover:opacity-95 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <FontAwesomeIcon icon={faDownload} className="h-4 w-4" />
              <span>Download Resume</span>
            </a>

            <a
              href="#contact"
              onClick={scrollToContact}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-medium border border-border bg-card/60 hover:bg-accent text-foreground transition-all duration-200"
            >
              <FontAwesomeIcon icon={faPaperPlane} className="h-3.5 w-3.5 text-[var(--skin-color)]" />
              <span>Get In Touch</span>
            </a>
          </div>
        </div>

        {/* Personal Details Grid (Col 5) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-card border border-border shadow-sm">
          <h3 className="text-xl font-bold text-foreground mb-6 pb-3 border-b border-border flex items-center justify-between">
            <span>Personal Information</span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-[var(--skin-color)]/10 text-[var(--skin-color)]">
              Verified
            </span>
          </h3>

          <div className="space-y-4 text-sm sm:text-base">
            {/* Birthday */}
            <div className="flex items-center justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground flex items-center gap-2">
                <FontAwesomeIcon icon={faCalendarDay} className="h-3.5 w-3.5 text-[var(--skin-color)]" />
                Birthday:
              </span>
              <span className="font-semibold text-foreground">{personalInfo.birthdayDisplay}</span>
            </div>

            {/* Realtime Age */}
            <div className="flex items-center justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground flex items-center gap-2">
                <FontAwesomeIcon icon={faClock} className="h-3.5 w-3.5 text-[var(--skin-color)]" />
                Age:
              </span>
              <span className="font-semibold text-foreground font-mono">
                {ageDisplay || "Calculating..."}
              </span>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground flex items-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} className="h-3.5 w-3.5 text-[var(--skin-color)]" />
                Email:
              </span>
              <a
                href={`mailto:${personalInfo.email}`}
                className="font-semibold text-foreground hover:text-[var(--skin-color)] transition-colors truncate max-w-[200px]"
                title={personalInfo.email}
              >
                {personalInfo.email}
              </a>
            </div>

            {/* Degree */}
            <div className="flex items-center justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground flex items-center gap-2">
                <FontAwesomeIcon icon={faGraduationCap} className="h-3.5 w-3.5 text-[var(--skin-color)]" />
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
                className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Chat on WhatsApp
              </a>
            </div>

            {/* Location */}
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground flex items-center gap-2">
                <FontAwesomeIcon icon={faLocationDot} className="h-3.5 w-3.5 text-[var(--skin-color)]" />
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
          <FontAwesomeIcon icon={faCode} className="h-6 w-6 text-[var(--skin-color)]" />
          <span>Technical Proficiencies</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map((skill) => (
            <div key={skill.name} className="p-5 rounded-2xl bg-card border border-border shadow-sm">
              <div className="flex justify-between items-center mb-2.5">
                <span className="font-bold text-base sm:text-lg text-foreground flex items-center gap-2">
                  <FontAwesomeIcon icon={faTerminal} className="h-3.5 w-3.5 text-[var(--skin-color)]" />
                  {skill.name}
                </span>
                <span className="text-sm font-mono font-bold text-[var(--skin-color)]">
                  {skill.percentage}%
                </span>
              </div>
              <div className="w-full h-3.5 bg-muted rounded-full overflow-hidden p-0.5">
                <div
                  className="skill-progress-bar h-full rounded-full bg-[var(--gradient-primary)] transition-all duration-300 shadow-sm"
                  data-percentage={skill.percentage}
                  style={{ width: "0%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education & Experience Timelines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Education Timeline */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm">
          <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--skin-color)]/10 text-[var(--skin-color)] flex items-center justify-center">
              <FontAwesomeIcon icon={faGraduationCap} className="h-5 w-5" />
            </div>
            <span>Education</span>
          </h3>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-border space-y-10">
            {educationTimeline.map((edu, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-4 border-background bg-[var(--skin-color)] group-hover:scale-125 transition-transform" />

                <div className="inline-block px-3 py-1 rounded-md text-xs font-mono font-semibold bg-accent text-[var(--skin-color)] mb-2">
                  {edu.period}
                </div>

                <h4 className="text-lg sm:text-xl font-bold text-foreground">
                  {edu.title}
                </h4>
                <p className="text-sm font-medium text-[var(--skin-color)] mb-2">
                  {edu.organization}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {edu.description}
                </p>

                {edu.cgpaOrDistinction && (
                  <span className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {edu.cgpaOrDistinction}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Experience Timeline */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm">
          <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--skin-color)]/10 text-[var(--skin-color)] flex items-center justify-center">
              <FontAwesomeIcon icon={faBriefcase} className="h-5 w-5" />
            </div>
            <span>Experience</span>
          </h3>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-border space-y-10">
            {experienceTimeline.map((exp, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-4 border-background bg-[var(--skin-color)] group-hover:scale-125 transition-transform" />

                <div className="inline-block px-3 py-1 rounded-md text-xs font-mono font-semibold bg-accent text-[var(--skin-color)] mb-2">
                  {exp.period}
                </div>

                <h4 className="text-lg sm:text-xl font-bold text-foreground">
                  {exp.title}
                </h4>
                <p className="text-sm font-medium text-[var(--skin-color)] mb-2">
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
    </section>
  );
}

export default AboutSection;
