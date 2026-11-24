"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faEnvelope,
  faLocationDot,
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { personalInfo } from "@/lib/data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ContactSectionProps {
  standalone?: boolean;
}

export function ContactSection({ standalone = true }: ContactSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileSiteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!turnstileSiteKey || typeof window === "undefined") return;

    const scriptId = "cf-turnstile-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const interval = setInterval(() => {
      const win = window as unknown as {
        turnstile?: {
          render: (
            el: HTMLElement,
            options: {
              sitekey: string;
              callback: (token: string) => void;
              "expired-callback": () => void;
              theme?: string;
            }
          ) => string;
          reset: (widgetId?: string) => void;
        };
      };

      if (win.turnstile && turnstileRef.current && !turnstileRef.current.hasChildNodes()) {
        win.turnstile.render(turnstileRef.current, {
          sitekey: turnstileSiteKey,
          callback: (token: string) => setTurnstileToken(token),
          "expired-callback": () => setTurnstileToken(""),
          theme: "auto",
        });
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [turnstileSiteKey]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const scrollStart = isMobile ? "top 96%" : "top 85%";
    const animDuration = isMobile ? 0.35 : 0.7;
    const cardStagger = isMobile ? 0.04 : 0.12;
    const offset = isMobile ? 15 : 30;

    const ctx = gsap.context(() => {
      // 1. Title & Underline Bar Reveal
      const title = section.querySelector(".contact-title-text");
      const line = section.querySelector(".contact-title-line");
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

      // 2. Info Cards Staggered Reveal from Left
      const infoCards = section.querySelectorAll(".contact-info-card");
      const gridContainer = section.querySelector(".contact-grid-container") || section;
      if (infoCards && infoCards.length > 0) {
        gsap.fromTo(
          infoCards,
          { x: isMobile ? 0 : -offset, y: isMobile ? offset : 0, opacity: 0 },
          {
            x: 0,
            y: 0,
            opacity: 1,
            duration: animDuration,
            stagger: cardStagger,
            ease: "power2.out",
            scrollTrigger: {
              trigger: gridContainer,
              start: scrollStart,
              once: true,
            },
          }
        );
      }

      // 3. Form Container Reveal from Right
      const formCard = section.querySelector(".contact-form-container");
      if (formCard) {
        gsap.fromTo(
          formCard,
          { x: isMobile ? 0 : offset, y: isMobile ? offset : 0, opacity: 0 },
          {
            x: 0,
            y: 0,
            opacity: 1,
            duration: isMobile ? 0.35 : 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: formCard,
              start: scrollStart,
              once: true,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // 1. Anti-Bot Honeypot verification
    const honeypot = formData.get("_gotcha");
    if (honeypot) {
      // Silently discard bot submission
      setStatus("success");
      form.reset();
      return;
    }

    // 2. Client-side Rate Limiting (prevent rapid spam abuse)
    const lastSubmitTime = sessionStorage.getItem("contact_last_submit");
    const now = Date.now();
    if (lastSubmitTime && now - parseInt(lastSubmitTime, 10) < 20000) {
      setErrorMessage("Please wait 20 seconds before submitting another inquiry.");
      setStatus("error");
      return;
    }

    // 3. Input Sanitization & Validation
    const name = (formData.get("name") as string)?.trim() || "";
    const email = (formData.get("email") as string)?.trim() || "";
    const subject = (formData.get("subject") as string)?.trim() || "";
    const message = (formData.get("message") as string)?.trim() || "";

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
    if (!name || name.length > 100) {
      setErrorMessage("Please enter a valid name (maximum 100 characters).");
      setStatus("error");
      return;
    }
    if (!email || !emailRegex.test(email) || email.length > 120) {
      setErrorMessage("Please enter a valid email address.");
      setStatus("error");
      return;
    }
    if (!subject || subject.length > 150) {
      setErrorMessage("Please enter a valid subject line (maximum 150 characters).");
      setStatus("error");
      return;
    }
    if (!message || message.length > 3000) {
      setErrorMessage("Please enter a valid message (maximum 3000 characters).");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const payload = {
        name,
        email,
        subject,
        message,
        _gotcha: honeypot || "",
        turnstileToken: turnstileToken || "",
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        sessionStorage.setItem("contact_last_submit", now.toString());
        setStatus("success");
        setTurnstileToken("");
        form.reset();
      } else {
        setErrorMessage(data.error || "Failed to deliver message. Please try again or reach out directly.");
        setStatus("error");
      }
    } catch {
      setErrorMessage("Network error. Please check your connection or reach out directly.");
      setStatus("error");
    }
  };

  const content = (
    <div ref={sectionRef} className="w-full overflow-hidden">
      {/* Section Title - NO DOT */}
      <div className="mb-10 text-left">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          <span className="contact-title-text">Get In Touch</span>
          <span className="contact-title-line h-1 flex-1 max-w-[80px] bg-[var(--skin-color)] rounded-full" />
        </h2>
        <p className="mt-2 text-muted-foreground text-sm sm:text-base">
          Have a question or interested in collaborating? Send me a message and I will get back to you promptly.
        </p>
      </div>

      <div className="contact-grid-container grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Information Cards (Col 4) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {/* Email Card */}
          <a
            href={`mailto:${personalInfo.email}`}
            className="contact-info-card group flex items-start gap-4 p-5 rounded-2xl bg-card border border-border hover:border-[var(--skin-color)]/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-[var(--skin-color)]/10 text-[var(--skin-color)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">Email Me</span>
              <p className="text-sm sm:text-base font-medium text-foreground group-hover:text-[var(--skin-color)] transition-colors break-all">
                {personalInfo.email}
              </p>
            </div>
          </a>

          {/* WhatsApp Card */}
          <a
            href={personalInfo.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-info-card group flex items-start gap-4 p-5 rounded-2xl bg-card border border-border hover:border-emerald-500/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <FontAwesomeIcon icon={faWhatsapp} className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">WhatsApp</span>
              <p className="text-sm sm:text-base font-medium text-foreground group-hover:text-emerald-500 transition-colors">
                Instant Chat on WhatsApp
              </p>
            </div>
          </a>

          {/* Location Card */}
          <div className="contact-info-card group flex items-start gap-4 p-5 rounded-2xl bg-card border border-border hover:border-blue-500/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <FontAwesomeIcon icon={faLocationDot} className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">Location</span>
              <p className="text-sm sm:text-base font-medium text-foreground group-hover:text-blue-500 transition-colors">
                {personalInfo.location}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form (Col 8) */}
        <div className="contact-form-container lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-sm hover:border-[var(--skin-color)]/40 hover:shadow-lg transition-all duration-300">
          {status === "success" ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <FontAwesomeIcon icon={faCheckCircle} className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Message Sent Successfully!</h3>
              <p className="text-muted-foreground max-w-md">
                Thank you for reaching out. I will review your inquiry and reply as soon as possible.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-4 px-6 py-2.5 rounded-xl font-semibold text-white bg-[var(--skin-color)] hover:opacity-90 transition-opacity"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form
              action="https://formspree.io/f/xvoeggne"
              method="POST"
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Anti-Bot Honeypot field (hidden from legitimate users) */}
              <input
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              {status === "error" && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3">
                  <FontAwesomeIcon icon={faExclamationCircle} className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    required
                    maxLength={100}
                    autoComplete="name"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-background dark:bg-card/60 border-2 border-border hover:border-border/90 focus:border-[var(--skin-color)] focus:ring-2 focus:ring-[var(--skin-color)]/20 outline-none text-foreground placeholder:text-muted-foreground/60 transition-all text-sm shadow-xs"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Your Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    required
                    maxLength={120}
                    autoComplete="email"
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-background dark:bg-card/60 border-2 border-border hover:border-border/90 focus:border-[var(--skin-color)] focus:ring-2 focus:ring-[var(--skin-color)]/20 outline-none text-foreground placeholder:text-muted-foreground/60 transition-all text-sm shadow-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-subject" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  required
                  maxLength={150}
                  placeholder="Security Assessment / Web Consultation"
                  className="w-full px-4 py-3 rounded-xl bg-background dark:bg-card/60 border-2 border-border hover:border-border/90 focus:border-[var(--skin-color)] focus:ring-2 focus:ring-[var(--skin-color)]/20 outline-none text-foreground placeholder:text-muted-foreground/60 transition-all text-sm shadow-xs"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-message" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  maxLength={3000}
                  rows={5}
                  placeholder="Tell me about your project, timeline, and requirements..."
                  className="w-full px-4 py-3 rounded-xl bg-background dark:bg-card/60 border-2 border-border hover:border-border/90 focus:border-[var(--skin-color)] focus:ring-2 focus:ring-[var(--skin-color)]/20 outline-none text-foreground placeholder:text-muted-foreground/60 transition-all text-sm resize-none shadow-xs"
                />
              </div>

              {turnstileSiteKey && (
                <div ref={turnstileRef} className="my-3 min-h-[65px]" />
              )}

              <div>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-[var(--skin-color)] to-[var(--skin-color-end)] !text-white shadow-md shadow-[var(--skin-color)]/30 hover:shadow-lg hover:shadow-[var(--skin-color)]/45 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 transition-all duration-200 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faPaperPlane} className="h-4 w-4" />
                  <span>{status === "submitting" ? "Sending..." : "Send Message"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  if (!standalone) {
    return content;
  }

  return (
    <section id="contact" className="w-full py-16 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 overflow-hidden">
      <div className="w-full max-w-[1800px] 2xl:max-w-[1920px] mx-auto">
        {content}
      </div>
    </section>
  );
}

export default ContactSection;
