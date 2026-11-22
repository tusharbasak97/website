"use client";

import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved, faTerminal } from "@fortawesome/free-solid-svg-icons";
import gsap from "gsap";

export function Preloader() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("INITIALIZING SECURITY KERNEL...");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Check if session has already seen preloader in this browser session
    const hasSeen = sessionStorage.getItem("tushar_preloader_seen");
    if (hasSeen) {
      setIsDone(true);
      return;
    }

    // Lock body scroll during preloader
    document.body.style.overflow = "hidden";

    // Progress counter animation
    const progressObj = { value: 0 };

    const statusSteps = [
      { at: 20, text: "ENCRYPTING COMMUNICATIONS..." },
      { at: 50, text: "LOADING SOC MONITORING MODULES..." },
      { at: 80, text: "VERIFYING ZERO TRUST POLICY..." },
      { at: 95, text: "SECURITY CLEARANCE: GRANTED" },
    ];

    const tl = gsap.timeline({
      onComplete: () => {
        // Slide up preloader curtain
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 0.75,
          ease: "power4.inOut",
          onComplete: () => {
            document.body.style.overflow = "";
            sessionStorage.setItem("tushar_preloader_seen", "true");
            setIsDone(true);
          },
        });
      },
    });

    // Animate logo pulse
    tl.fromTo(
      logoRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.8)" }
    );

    // Animate progress to 100%
    tl.to(
      progressObj,
      {
        value: 100,
        duration: 1.2,
        ease: "power1.inOut",
        onUpdate: () => {
          const current = Math.floor(progressObj.value);
          setProgress(current);
          const found = statusSteps.filter((s) => current >= s.at).pop();
          if (found) setStatusText(found.text);
        },
      },
      "-=0.2"
    );

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (isDone) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[999999] bg-[#07090e] text-[#f0f0f0] flex flex-col items-center justify-center p-4 font-mono select-none"
    >
      {/* Background Matrix/Grid Overlay */}
      <div className="scanlines-overlay fixed inset-0 pointer-events-none" />

      {/* Center Preloader Content */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center">
        {/* Animated Cyber Shield Logo */}
        <div
          ref={logoRef}
          className="pulse-glow relative flex items-center justify-center w-20 h-20 rounded-2xl bg-[#0e131d] border-2 border-[var(--skin-color,#ff7b00)] mb-6 shadow-[0_0_30px_rgba(255,123,0,0.4)]"
        >
          <FontAwesomeIcon
            icon={faShieldHalved}
            className="w-10 h-10 text-[var(--skin-color,#ff7b00)]"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#07090e] animate-ping" />
        </div>

        {/* Name / Brand Title */}
        <h2 className="text-xl sm:text-2xl font-black tracking-widest text-white uppercase mb-1">
          Tushar Basak
        </h2>
        <p className="text-xs text-[var(--skin-color,#ff7b00)] tracking-wider mb-6 font-semibold">
          CYBERSECURITY ANALYST &bull; PORTFOLIO
        </p>

        {/* Progress Bar Container */}
        <div className="w-full bg-[#111722] border border-gray-800 rounded-full h-2 p-0.5 mb-3 overflow-hidden">
          <div
            ref={progressRef}
            className="h-full bg-gradient-to-r from-[var(--skin-color,#ff7b00)] to-[#ff4500] rounded-full transition-all duration-75 ease-out shadow-[0_0_12px_rgba(255,123,0,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status Line & Percentage */}
        <div className="flex items-center justify-between w-full text-[11px] text-gray-400">
          <div
            ref={textRef}
            className="flex items-center gap-1.5 truncate max-w-[220px]"
          >
            <FontAwesomeIcon icon={faTerminal} className="w-2.5 h-2.5 text-emerald-400" />
            <span className="truncate">{statusText}</span>
          </div>
          <span className="font-bold text-[var(--skin-color,#ff7b00)] font-mono">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default Preloader;

