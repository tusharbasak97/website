"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
import {
  faShieldHalved,
  faUserShield,
  faGraduationCap,
  faBug,
  faTerminal,
  faCertificate,
  faCheckCircle,
  faClock,
  faTimesCircle,
  faList,
  faExternalLinkAlt,
  faHourglassHalf,
} from "@fortawesome/free-solid-svg-icons";
import { certificates, Certificate } from "@/lib/data";

const iconMap: Record<string, typeof faShieldHalved> = {
  "shield-halved": faShieldHalved,
  "user-shield": faUserShield,
  "graduation-cap": faGraduationCap,
  bug: faBug,
  terminal: faTerminal,
  certificate: faCertificate,
};

type FilterType = "all" | "active" | "expired" | "coming-soon";

interface EvaluatedCert extends Certificate {
  effectiveStatus: "active" | "expiring" | "expired" | "coming-soon";
  daysUntilExpiry?: number;
}

export function CertificatesSection() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [evaluatedCertificates, setEvaluatedCertificates] = useState<EvaluatedCert[]>(() =>
    certificates.map((cert) => ({
      ...cert,
      effectiveStatus: cert.status,
    }))
  );
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // GSAP ScrollTrigger for Certificates entrance
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const scrollStart = isMobile ? "top 96%" : "top 85%";
    const animDuration = isMobile ? 0.35 : 0.65;
    const cardStagger = isMobile ? 0.04 : 0.08;
    const yShift = isMobile ? 18 : 35;

    const ctx = gsap.context(() => {
      // 1. Title & Line Reveal
      const title = section.querySelector(".cert-title-text");
      const line = section.querySelector(".cert-title-line");
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

      // 2. Filter buttons entrance
      const filterBtns = section.querySelectorAll(".cert-filter-btn");
      const filtersGroup = section.querySelector(".cert-filters-group") || section;
      if (filterBtns && filterBtns.length > 0) {
        gsap.fromTo(
          filterBtns,
          { y: isMobile ? 12 : 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: animDuration,
            stagger: cardStagger,
            ease: "power2.out",
            scrollTrigger: {
              trigger: filtersGroup,
              start: scrollStart,
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 3. Certificates Cards Entrance
      const certCards = section.querySelectorAll(".cert-card");
      const grid = gridRef.current || section;
      if (certCards && certCards.length > 0) {
        gsap.fromTo(
          certCards,
          { y: yShift, opacity: 0, scale: isMobile ? 0.98 : 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: animDuration,
            stagger: cardStagger,
            ease: "power2.out",
            scrollTrigger: {
              trigger: grid,
              start: scrollStart,
              toggleActions: "play none none none",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  // Animate cards smoothly when switching filter tabs
  useEffect(() => {
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll(".cert-card");
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 15, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }
        );
      }
    }
  }, [activeFilter]);

  // Compute real-time status and expiry details after mount to prevent SSR hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => {
      const now = new Date();

      const evaluated = certificates.map((cert): EvaluatedCert => {
        if (cert.status === "coming-soon") {
          return { ...cert, effectiveStatus: "coming-soon" };
        }

        if (cert.expiryDate) {
          if (cert.expiryDate.toLowerCase() === "lifetime") {
            return { ...cert, effectiveStatus: "active" };
          }

          const expDate = new Date(cert.expiryDate);
          if (!isNaN(expDate.getTime())) {
            const diffMs = expDate.getTime() - now.getTime();
            const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

            if (days < 0) {
              return { ...cert, effectiveStatus: "expired", daysUntilExpiry: 0 };
            } else if (days <= 60) {
              return { ...cert, effectiveStatus: "expiring", daysUntilExpiry: days };
            } else {
              return { ...cert, effectiveStatus: "active", daysUntilExpiry: days };
            }
          }
        }

        return {
          ...cert,
          effectiveStatus: cert.status === "expired" ? "expired" : "active",
        };
      });

      setEvaluatedCertificates(evaluated);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Calculate dynamic filter counts
  const counts = useMemo(() => {
    return {
      all: evaluatedCertificates.length,
      active: evaluatedCertificates.filter(
        (c) => c.effectiveStatus === "active" || c.effectiveStatus === "expiring"
      ).length,
      expired: evaluatedCertificates.filter((c) => c.effectiveStatus === "expired").length,
      "coming-soon": evaluatedCertificates.filter((c) => c.effectiveStatus === "coming-soon").length,
    };
  }, [evaluatedCertificates]);

  // Filtered list
  const filteredCerts = useMemo(() => {
    if (activeFilter === "all") return evaluatedCertificates;
    if (activeFilter === "active") {
      return evaluatedCertificates.filter(
        (c) => c.effectiveStatus === "active" || c.effectiveStatus === "expiring"
      );
    }
    return evaluatedCertificates.filter((c) => c.effectiveStatus === activeFilter);
  }, [activeFilter, evaluatedCertificates]);

  // GSAP animation on filter change
  useEffect(() => {
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll(".cert-card");
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 20,
          scale: 0.96,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          stagger: 0.08,
          ease: "power2.out",
        }
      );
    }
  }, [activeFilter, filteredCerts]);

  const filterButtons: { key: FilterType; label: string; icon: typeof faList }[] = [
    { key: "all", label: "All Certificates", icon: faList },
    { key: "active", label: "Active", icon: faCheckCircle },
    { key: "expired", label: "Expired", icon: faTimesCircle },
    { key: "coming-soon", label: "Coming Soon", icon: faClock },
  ];

  return (
    <section
      ref={sectionRef}
      id="certificates"
      role="region"
      aria-label="Professional Certifications"
      className="w-full py-20 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 overflow-hidden"
    >
      <div className="w-full max-w-[1800px] 2xl:max-w-[1920px] mx-auto">
        {/* Section Title - NO DOT */}
        <div className="mb-12 text-left">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground flex items-center gap-4">
          <span className="cert-title-text">Professional Certifications</span>
          <span className="cert-title-line h-1 flex-1 max-w-[100px] bg-skin rounded-full" />
        </h2>
        <p className="mt-2 text-muted-foreground text-base sm:text-lg">
          Industry-accredited qualifications validating advanced competencies in information security
        </p>
      </div>

      {/* Filter Tabs with Dynamic Counts */}
      <div className="cert-filters-group flex flex-wrap items-center gap-3 mb-10" role="group" aria-label="Certificate filters">
        {filterButtons.map(({ key, label, icon }) => {
          const isActive = activeFilter === key;
          const count = counts[key];

          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveFilter(key)}
              className={`cert-filter-btn inline-flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-linear-to-r from-skin to-skin-end !text-white shadow-md shadow-skin/30 scale-[1.02]"
                  : "bg-card border-2 border-border/80 text-foreground/80 hover:text-foreground hover:bg-accent/70 hover:border-skin/50 shadow-xs"
              }`}
              aria-pressed={isActive}
            >
              <FontAwesomeIcon icon={icon} className="h-3.5 w-3.5" />
              <span>{label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                  isActive
                    ? "bg-white/25 !text-white"
                    : "bg-muted text-foreground/80"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Certificates Grid */}
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCerts.map((cert) => {
          const icon = iconMap[cert.icon] || faCertificate;

          // Status colors: green for active, yellow for expiring, red for expired, blue for coming soon
          let badgeBg = "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25";
          let badgeText = "Active";
          let badgeIcon = faCheckCircle;

          if (cert.effectiveStatus === "expiring") {
            badgeBg = "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25";
            badgeText = `Expiring (${cert.daysUntilExpiry}d)`;
            badgeIcon = faHourglassHalf;
          } else if (cert.effectiveStatus === "expired") {
            badgeBg = "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/25";
            badgeText = "Expired";
            badgeIcon = faTimesCircle;
          } else if (cert.effectiveStatus === "coming-soon") {
            badgeBg = "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/25";
            badgeText = "In Progress";
            badgeIcon = faClock;
          }

          return (
            <article
              key={cert.id}
              className="cert-card flex flex-col justify-between p-6 rounded-2xl bg-card border border-border hover:border-skin/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div>
                {/* Header: Icon & Status Badge */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-skin/10 text-skin flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <FontAwesomeIcon icon={icon} className="h-6 w-6" />
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeBg}`}
                  >
                    <FontAwesomeIcon icon={badgeIcon} className="h-3 w-3" />
                    <span>{badgeText}</span>
                  </span>
                </div>

                {/* Title & Issuer */}
                <h3 className="text-xl font-bold text-foreground group-hover:text-skin transition-colors">
                  {cert.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  {cert.issuer}
                </p>
              </div>

              {/* Meta Dates & Action */}
              <div className="mt-8 pt-4 border-t border-border flex items-center justify-between gap-4">
                <div className="text-xs space-y-1">
                  {cert.issueDate && (
                    <div className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Issued: </span>
                      {cert.issueDate}
                    </div>
                  )}
                  {cert.expiryDate && (
                    <div className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Expires: </span>
                      <span className={cert.expiryDate.toLowerCase() === "lifetime" ? "text-emerald-700 dark:text-emerald-300 font-semibold" : ""}>
                        {cert.expiryDate}
                      </span>
                    </div>
                  )}
                  {cert.expectedDate && (
                    <div className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Target Year: </span>
                      <span className="text-sky-700 dark:text-sky-300 font-semibold">{cert.expectedDate}</span>
                    </div>
                  )}
                </div>

                {cert.verifyUrl ? (
                  <a
                    href={cert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-linear-to-r from-skin to-skin-end !text-white shadow-sm hover:shadow-md hover:shadow-skin/30 transition-all cursor-pointer"
                  >
                    <span>Verify</span>
                    <FontAwesomeIcon icon={faExternalLinkAlt} className="h-2.5 w-2.5" />
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-muted-foreground bg-muted/60">
                    <FontAwesomeIcon icon={faClock} className="h-2.5 w-2.5" />
                    <span>Pending</span>
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>
      </div>
    </section>
  );
}

export default CertificatesSection;
