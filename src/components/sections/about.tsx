"use client";

import React from "react";
import { personalInfo } from "@/lib/data";

export function AboutSection() {
  return (
    <section id="about" className="w-full py-16 px-6">
      <div className="w-full">
        <h2 className="text-3xl font-bold">About Me</h2>
        <p className="mt-4 text-[var(--text-black-700)]">{personalInfo.aboutP1}</p>
      </div>
    </section>
  );
}
export default AboutSection;

