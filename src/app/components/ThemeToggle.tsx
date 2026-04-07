"use client";

import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    // Check both key formats for backwards compat
    const stored = localStorage.getItem("speaq_theme") || localStorage.getItem("speaq-theme");
    if (stored === "light") {
      setLight(true);
      document.documentElement.classList.add("light");
    } else if (!stored || stored === "system") {
      // Respect system preference
      const preferLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      setLight(preferLight);
      document.documentElement.classList.toggle("light", preferLight);
    }
  }, []);

  function toggle() {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("light", next);
    const val = next ? "light" : "dark";
    localStorage.setItem("speaq_theme", val);
    localStorage.setItem("speaq-theme", val); // backwards compat
  }

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-bg-card border border-[rgba(100,116,139,0.15)] text-text-primary transition-all hover:border-voice-gold/30"
      aria-label="Toggle theme"
    >
      {light ? (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      )}
    </button>
  );
}
