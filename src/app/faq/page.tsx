"use client";

import { useState, useEffect } from "react";
import ThemeToggle from "../components/ThemeToggle";
import { getFaqData, faqLabels, type Lang } from "./faq-data";

const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "nl", label: "NL" },
  { code: "fr", label: "FR" },
  { code: "es", label: "ES" },
  { code: "ru", label: "RU" },
  { code: "de", label: "DE" },
  { code: "sl", label: "SL" },
  { code: "lg", label: "LG" },
  { code: "sw", label: "SW" },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function FaqPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("speaq_lang") as Lang | null;
    if (saved && LANGS.some((l) => l.code === saved)) {
      setLang(saved);
    }
  }, []);

  function changeLang(l: Lang) {
    setLang(l);
    localStorage.setItem("speaq_lang", l);
    setOpenItems(new Set());
  }

  function toggle(key: string) {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  const faqData = getFaqData(lang);
  const labels = faqLabels[lang];

  return (
    <main className="min-h-screen py-24 md:py-32">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-bg-deep/80 backdrop-blur-md border-b border-[rgba(100,116,139,0.1)]">
        <div className="max-w-[760px] mx-auto px-6 h-14 flex items-center justify-between">
          <a
            href="/"
            className="font-[family-name:var(--font-playfair)] text-lg font-medium text-text-primary hover:text-voice-gold transition-colors"
          >
            SPEA<span className="text-voice-gold">Q</span>
          </a>
          <div className="flex items-center gap-3">
            {/* Language selector */}
            <select
              value={lang}
              onChange={(e) => changeLang(e.target.value as Lang)}
              className="bg-bg-card text-text-secondary text-xs font-[family-name:var(--font-jetbrains)] px-2 py-1.5 rounded-md border border-[rgba(100,116,139,0.2)] cursor-pointer hover:border-voice-gold/50 transition-colors"
            >
              {LANGS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="max-w-[760px] mx-auto px-6 md:px-12">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-text-muted text-sm mb-12 hover:text-voice-gold transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {labels.backButton}
        </a>

        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-medium tracking-tight leading-tight mb-4">
          {labels.pageTitle}
        </h1>
        <p className="text-text-muted text-sm font-[family-name:var(--font-jetbrains)] mb-16">
          {labels.subtitle}
        </p>

        <div className="space-y-12">
          {faqData.map((category) => (
            <section key={category.title}>
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-6">
                {category.title}
              </h2>
              <div className="space-y-0 border-t border-[rgba(100,116,139,0.15)]">
                {category.items.map((item) => {
                  const key = `${category.title}-${item.question}`;
                  const isOpen = openItems.has(key);
                  return (
                    <div
                      key={key}
                      className="border-b border-[rgba(100,116,139,0.15)]"
                    >
                      <button
                        onClick={() => toggle(key)}
                        className="w-full flex items-center justify-between gap-4 py-5 text-left"
                      >
                        <span className="text-text-primary text-[16px] font-medium leading-snug">
                          {item.question}
                        </span>
                        <ChevronIcon open={isOpen} />
                      </button>
                      {isOpen && (
                        <div className="pb-5 pr-8">
                          <p className="text-text-secondary text-[15px] leading-relaxed whitespace-pre-line">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-20 pt-10 border-t border-[rgba(100,116,139,0.15)] text-center">
          <p className="font-[family-name:var(--font-playfair)] text-lg text-text-primary">
            SPEA<span className="text-voice-gold">Q</span> Freely.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-text-muted mt-4">
            <a href="/" className="hover:text-voice-gold transition-colors">
              Home
            </a>
            <a
              href="/privacy"
              className="hover:text-voice-gold transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="hover:text-voice-gold transition-colors"
            >
              Terms of Service
            </a>
          </div>
          <p className="text-text-muted text-xs mt-4">
            &copy; 2026 SPEAQ. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
