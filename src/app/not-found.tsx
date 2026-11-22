"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldHalved,
  faHouse,
  faTerminal,
  faTriangleExclamation,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import gsap from "gsap";
import { CustomCursor } from "@/components/custom-cursor";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  color: string;
}

export default function NotFound() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const glitchRef = useRef<HTMLHeadingElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const logsRef = useRef<HTMLDivElement | null>(null);
  const countdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  const [timeLeft, setTimeLeft] = useState(30);
  const [isRedirectPaused, setIsRedirectPaused] = useState(false);

  // 1. Matrix Code Rain + Mouse Trail Particles Canvas Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Matrix characters: katakana, binary, hex, cyber tokens
    const characters =
      "01010101XYZ404ERRORROOTBREACHSECURENULLFIREWALLPWNPACKET0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ";
    const fontSize = 16;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -height);
    }

    // Interactive mouse particles in OKLCH
    const particles: Particle[] = [];
    const colors = [
      "oklch(0.70 0.19 55)",
      "oklch(0.62 0.22 38)",
      "oklch(0.86 0.28 142)",
      "oklch(0.85 0.16 205)",
      "oklch(1 0 0)",
    ];

    const handleMouseMove = (e: MouseEvent) => {
      const count = 3;
      for (let i = 0; i < count; i++) {
        const speed = Math.random() * 2 + 0.8;
        const angle = Math.random() * Math.PI * 2;
        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          size: Math.random() * 3 + 1.5,
          alpha: 1,
          maxAlpha: Math.random() * 0.5 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Main render loop
    const render = () => {
      // Semi-transparent fade for matrix rain trails
      ctx.fillStyle = "oklch(0.12 0.015 260 / 0.12)";
      ctx.fillRect(0, 0, width, height);

      // Render Matrix characters
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const char = characters.charAt(Math.floor(Math.random() * characters.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Leading char is bright/white, trail is matrix green
        if (Math.random() > 0.92) {
          ctx.fillStyle = "oklch(1 0 0)";
          ctx.shadowBlur = 8;
          ctx.shadowColor = "oklch(0.86 0.28 142)";
        } else {
          ctx.fillStyle = "oklch(0.86 0.28 142)";
          ctx.shadowBlur = 4;
          ctx.shadowColor = "oklch(0.80 0.26 142)";
        }

        ctx.fillText(char, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      // Reset shadow for particles
      ctx.shadowBlur = 0;

      // Render Mouse Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 2. Countdown Timer with Auto-redirect
  useEffect(() => {
    if (isRedirectPaused) return;

    if (timeLeft <= 0) {
      router.push("/");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isRedirectPaused, router]);

  // 3. GSAP Entry Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        containerRef.current,
        { scale: 0.93, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.8 }
      )
        .fromTo(
          badgeRef.current,
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.4"
        )
        .fromTo(
          glitchRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.8)" },
          "-=0.3"
        )
        .fromTo(
          headingRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.3"
        )
        .fromTo(
          descRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.3"
        )
        .fromTo(
          logsRef.current,
          { opacity: 0, height: 0 },
          { opacity: 1, height: "auto", duration: 0.5 },
          "-=0.2"
        )
        .fromTo(
          countdownRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.2"
        )
        .fromTo(
          buttonRef.current,
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2)" },
          "-=0.2"
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="dark relative min-h-screen w-full overflow-hidden bg-[oklch(0.12_0.015_260)] text-[oklch(0.96_0.005_260)] font-mono selection:bg-[var(--skin-color,oklch(0.70_0.19_55))] selection:text-[oklch(1_0_0)] flex items-center justify-center p-4 sm:p-6">
      {/* Custom Cursor active on this page */}
      <CustomCursor />

      {/* Matrix Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
      />

      {/* CRT Scanline & Vignette Effect */}
      <div className="scanlines-overlay fixed inset-0 pointer-events-none z-10" />
      <div className="fixed inset-0 pointer-events-none z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,oklch(0_0_0_/_0.8)_100%)]" />

      {/* Hacker Terminal Card */}
      <div
        ref={containerRef}
        className="relative z-20 w-full max-w-2xl bg-[oklch(0.14_0.015_260)]/90 backdrop-blur-md border border-[var(--skin-color,oklch(0.70_0.19_55))]/40 rounded-2xl shadow-[0_0_40px_oklch(0.70_0.19_55_/_0.25)] overflow-hidden"
      >
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[oklch(0.17_0.015_260)] border-b border-[oklch(0.27_0.015_260)]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
            <span className="ml-3 text-xs text-gray-400 flex items-center gap-1.5 font-mono">
              <FontAwesomeIcon icon={faTerminal} className="w-3 h-3 text-[var(--skin-color,oklch(0.70_0.19_55))]" />
              security_audit_404.sh
            </span>
          </div>
          <span className="text-[11px] font-semibold tracking-wider text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
            HTTP 404
          </span>
        </div>

        {/* Terminal Content Body */}
        <div className="p-6 sm:p-10 flex flex-col items-center text-center">
          {/* Secured Badge with Shield Icon */}
          <div
            ref={badgeRef}
            className="mb-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 text-xs sm:text-sm font-semibold tracking-wider shadow-[0_0_15px_oklch(0.72_0.19_155_/_0.2)]"
          >
            <FontAwesomeIcon icon={faShieldHalved} className="w-4 h-4 text-emerald-400" />
            <span>SECURED • ZERO-TRUST PERIMETER ACTIVE</span>
          </div>

          {/* Glitchy 404 Text */}
          <h1
            ref={glitchRef}
            data-text="404"
            className="glitch-text text-8xl sm:text-9xl font-black font-mono tracking-widest text-[var(--skin-color,oklch(0.70_0.19_55))] select-none my-2 drop-shadow-[0_0_35px_oklch(0.70_0.19_55_/_0.4)]"
          >
            404
          </h1>

          {/* Page Not Found Heading */}
          <h2
            ref={headingRef}
            className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faTriangleExclamation} className="w-6 h-6 text-[var(--skin-color,oklch(0.70_0.19_55))]" />
            Page Not Found
          </h2>

          {/* Description */}
          <p
            ref={descRef}
            className="mt-3 max-w-md text-sm sm:text-base text-gray-300 font-sans"
          >
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          {/* Terminal Diagnostics Log Box */}
          <div
            ref={logsRef}
            className="w-full mt-6 p-4 rounded-xl bg-[oklch(0.12_0.015_260)]/80 border border-gray-800 text-left font-mono text-xs text-gray-400 space-y-1.5 overflow-hidden"
          >
            <div className="flex items-center justify-between text-gray-500 pb-1 border-b border-gray-800 text-[10px] uppercase tracking-wider">
              <span>Security Event Log</span>
              <span className="text-emerald-400">IDS: ONLINE</span>
            </div>
            <p className="text-red-400">
              [!] ALERT: ROUTE_NOT_FOUND :: Access verification failed.
            </p>
            <p className="text-emerald-400">
              [&check;] FIREWALL: Intrusion detection perimeter intact.
            </p>
            <p className="text-[var(--skin-color,oklch(0.70_0.19_55))]">
              [&gt;] SYSTEM: Automated redirect protocol armed.
            </p>
          </div>

          {/* Auto-redirect Countdown */}
          <div
            ref={countdownRef}
            className="mt-6 flex flex-col items-center gap-2 w-full max-w-xs"
          >
            <div className="flex items-center justify-between w-full text-xs text-gray-400">
              <span className="font-mono">
                Redirecting in <span className="font-bold text-[var(--skin-color,oklch(0.70_0.19_55))] text-sm">{timeLeft}</span>s...
              </span>
              <button
                type="button"
                onClick={() => setIsRedirectPaused((prev) => !prev)}
                className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-0.5 rounded bg-gray-800/60 hover:bg-gray-800"
              >
                <FontAwesomeIcon icon={isRedirectPaused ? faPlay : faPause} className="w-2.5 h-2.5" />
                {isRedirectPaused ? "Resume" : "Pause"}
              </button>
            </div>

            {/* Countdown Progress Bar */}
            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[var(--skin-color,oklch(0.70_0.19_55))] to-[oklch(0.62_0.22_38)] transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              />
            </div>
          </div>

          {/* Return Home Button */}
          <div ref={buttonRef} className="mt-7">
            <Link
              href="/"
              className="pulse-glow relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[var(--skin-color,oklch(0.70_0.19_55))] to-[oklch(0.62_0.22_38)] text-white font-bold text-sm tracking-wide uppercase shadow-[0_0_20px_oklch(0.70_0.19_55_/_0.5)] hover:shadow-[0_0_35px_oklch(0.70_0.19_55_/_0.8)] hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <FontAwesomeIcon icon={faHouse} className="w-4 h-4" />
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
