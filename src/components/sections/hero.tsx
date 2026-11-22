"use client";

import React from "react";
import { personalInfo } from "@/lib/data";

export function HeroSection() {
  return (
    <section id="home" className="min-h-screen w-full flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold">
          Hello, my name is <span className="text-[var(--skin-color)]">{personalInfo.name}</span>
        </h1>
        <p className="mt-4 text-xl text-[var(--text-black-700)]">
          {personalInfo.jobTitle}
        </p>
      </div>
    </section>
  );
}
export default HeroSection;

