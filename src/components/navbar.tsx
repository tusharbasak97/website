"use client";

import React from "react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[var(--bg-black-900)]/80 border-b border-[var(--bg-black-50)]">
      <nav className="w-full px-6 py-4 flex items-center justify-between">
        <div className="text-xl font-bold font-kaushan text-[var(--skin-color)]">
          Tushar
        </div>
      </nav>
    </header>
  );
}
export default Navbar;

