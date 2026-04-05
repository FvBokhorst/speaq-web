"use client";

import { useState, useRef, useEffect } from "react";
import { languages, Lang } from "@/lib/i18n";

interface LanguageSwitcherProps {
  currentLang: Lang;
  onChangeLang: (lang: Lang) => void;
}

export default function LanguageSwitcher({ currentLang, onChangeLang }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = languages.find((l) => l.code === currentLang) ?? languages[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-card border border-[rgba(100,116,139,0.15)] text-text-primary text-sm transition-all hover:border-voice-gold/30"
      >
        <span className="font-[family-name:var(--font-jetbrains)] text-xs text-text-muted">
          {current.label}
        </span>
        <span>{current.name}</span>
        <svg
          className={`w-3 h-3 text-text-muted transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 4.5l3 3 3-3" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-bg-card border border-[rgba(100,116,139,0.15)] shadow-lg z-50 py-1 max-h-[320px] overflow-y-auto">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onChangeLang(lang.code);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${
                lang.code === currentLang
                  ? "text-voice-gold bg-voice-gold/10"
                  : "text-text-primary hover:bg-bg-elevated"
              }`}
            >
              <span className="font-[family-name:var(--font-jetbrains)] text-xs text-text-muted w-6">
                {lang.label}
              </span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
