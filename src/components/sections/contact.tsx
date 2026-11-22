"use client";

import React, { useState } from "react";
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

interface ContactSectionProps {
  standalone?: boolean;
}

export function ContactSection({ standalone = true }: ContactSectionProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("https://formspree.io/f/xvoeggne", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        const data = await response.json().catch(() => ({}));
        setErrorMessage(data.error || "Failed to send message. Please try again or reach out directly via email.");
        setStatus("error");
      }
    } catch {
      setErrorMessage("Network error. Please reach out directly to tushar.basak9936@gmail.com.");
      setStatus("error");
    }
  };

  const content = (
    <div className="w-full">
      {/* Section Title - NO DOT */}
      <div className="mb-10 text-left">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          <span>Get In Touch</span>
          <span className="h-1 flex-1 max-w-[80px] bg-[var(--skin-color)] rounded-full" />
        </h2>
        <p className="mt-2 text-muted-foreground text-sm sm:text-base">
          Have a question or interested in collaborating? Send me a message and I will get back to you promptly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Information Cards (Col 4) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {/* Email Card */}
          <a
            href={`mailto:${personalInfo.email}`}
            className="group flex items-start gap-4 p-5 rounded-2xl bg-card border border-border hover:border-[var(--skin-color)]/50 hover:shadow-lg transition-all duration-200"
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
            className="group flex items-start gap-4 p-5 rounded-2xl bg-card border border-border hover:border-emerald-500/50 hover:shadow-lg transition-all duration-200"
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
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faLocationDot} className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">Location</span>
              <p className="text-sm sm:text-base font-medium text-foreground">
                {personalInfo.location}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form (Col 8) */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-sm">
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
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-[var(--skin-color)] focus:ring-2 focus:ring-[var(--skin-color)]/20 outline-none text-foreground placeholder:text-muted-foreground/60 transition-all text-sm"
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
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-[var(--skin-color)] focus:ring-2 focus:ring-[var(--skin-color)]/20 outline-none text-foreground placeholder:text-muted-foreground/60 transition-all text-sm"
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
                  placeholder="Security Assessment / Web Consultation"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-[var(--skin-color)] focus:ring-2 focus:ring-[var(--skin-color)]/20 outline-none text-foreground placeholder:text-muted-foreground/60 transition-all text-sm"
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
                  rows={5}
                  placeholder="Tell me about your project, timeline, and requirements..."
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-[var(--skin-color)] focus:ring-2 focus:ring-[var(--skin-color)]/20 outline-none text-foreground placeholder:text-muted-foreground/60 transition-all text-sm resize-none"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-white bg-[var(--gradient-primary)] hover:opacity-95 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 transition-all duration-200"
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
    <section id="contact" className="w-full py-16 px-4 sm:px-8 md:px-12 lg:px-20 xl:px-28">
      {content}
    </section>
  );
}

export default ContactSection;
