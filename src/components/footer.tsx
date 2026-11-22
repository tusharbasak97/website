"use client";

import React, { useEffect, useState } from "react";

export function Footer() {
  const [year, setYear] = useState<number>(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full py-8 text-center text-sm border-t border-[var(--bg-black-50)] text-[var(--text-black-700)]">
      <p>&copy; {year} Tushar Basak. All rights reserved.</p>
    </footer>
  );
}
export default Footer;
