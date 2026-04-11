"use client";

import { useState, useEffect } from "react";
import { t, Lang, languages } from "@/lib/i18n";
import LanguageSwitcher from "./components/LanguageSwitcher";
import ThemeToggle from "./components/ThemeToggle";
import ScrollReveal from "./components/ScrollReveal";
import CookieBanner from "./components/CookieBanner";

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("speaq-lang") as Lang | null;
    if (stored && languages.some((l) => l.code === stored)) {
      setLang(stored);
    }
  }, []);

  function changeLang(l: Lang) {
    setLang(l);
    localStorage.setItem("speaq-lang", l);
  }

  const securityLayers = [
    {
      layer: "6",
      nameKey: "security.l6.name",
      tech: "QRNG",
      descKey: "security.l6.desc",
      color: "text-voice-gold",
    },
    {
      layer: "5",
      nameKey: "security.l5.name",
      tech: "Kyber-768",
      descKey: "security.l5.desc",
      color: "text-voice-warm",
    },
    {
      layer: "4",
      nameKey: "security.l4.name",
      tech: "HMAC-SHA256",
      descKey: "security.l4.desc",
      color: "text-voice-light",
    },
    {
      layer: "3",
      nameKey: "security.l3.name",
      tech: "AES-256 + Double Ratchet",
      descKey: "security.l3.desc",
      color: "text-quantum-teal",
    },
    {
      layer: "2",
      nameKey: "security.l2.name",
      tech: "Sealed Sender",
      descKey: "security.l2.desc",
      color: "text-quantum-teal",
    },
    {
      layer: "1",
      nameKey: "security.l1.name",
      tech: "Obfuscation + Mesh",
      descKey: "security.l1.desc",
      color: "text-quantum-dark",
    },
  ];

  return (
    <main>
      {/* ===== NAV BAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-deep/80 backdrop-blur-md border-b border-[rgba(100,116,139,0.1)]">
        <div className="max-w-[1100px] mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-[family-name:var(--font-playfair)] text-lg font-medium text-text-primary">
            SPEA<span className="text-voice-gold">Q</span>
          </span>

          <div className="flex items-center gap-3">
            <LanguageSwitcher currentLang={lang} onChangeLang={changeLang} />
            <ThemeToggle />
            {/* Hamburger button - always visible */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 flex items-center justify-center text-text-primary"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ===== MOBILE MENU (slide-in from right) ===== */}
      {menuOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-14 right-0 w-64 h-[calc(100vh-56px)] bg-bg-deep border-l border-[rgba(100,116,139,0.15)] p-6 flex flex-col gap-1 overflow-y-auto animate-[slideIn_0.2s_ease-out]">
            {[
              { label: "Features", href: "#features" },
              { label: "Security", href: "#security" },
              { label: "Zero Knowledge", href: "#zero-knowledge" },
              { label: "Q-Credits", href: "#qcredits" },
              { label: "Get SPEAQ", href: "#download" },
              { label: "FAQ", href: "/faq" },
              { label: "Languages", href: "#languages" },
              { label: "Whitepaper", href: "/whitepaper" },
              { label: "Explorer", href: "/explorer" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 px-4 rounded-lg text-text-primary text-[15px] font-medium hover:bg-bg-card hover:text-voice-gold transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ===== HERO (100vh) ===== */}
      <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-14">
        {/* Radial gradient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]"
            style={{
              background:
                "radial-gradient(circle, rgba(212,168,83,0.06) 0%, rgba(45,212,191,0.03) 40%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10 px-6 max-w-3xl mx-auto">
          {/* SPEAQ Logo SVG */}
          <div className="mb-10 flex justify-center">
            <svg
              viewBox="-15 0 420 120"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[360px] max-w-[85vw]"
            >
              <text
                x="20"
                y="92"
                fontFamily="'Playfair Display',serif"
                fontSize="96"
                fontWeight="700"
                fill="currentColor"
                letterSpacing="-2"
                className="text-text-primary"
              >
                S
              </text>
              <text
                x="78"
                y="92"
                fontFamily="'Playfair Display',serif"
                fontSize="96"
                fontWeight="700"
                fill="currentColor"
                letterSpacing="-2"
                className="text-text-primary"
              >
                P
              </text>
              <text
                x="148"
                y="92"
                fontFamily="'Playfair Display',serif"
                fontSize="96"
                fontWeight="700"
                fill="currentColor"
                letterSpacing="-2"
                className="text-text-primary"
              >
                E
              </text>
              <text
                x="212"
                y="92"
                fontFamily="'Playfair Display',serif"
                fontSize="96"
                fontWeight="700"
                fill="currentColor"
                letterSpacing="-2"
                className="text-text-primary"
              >
                A
              </text>
              <text
                x="290"
                y="92"
                fontFamily="'Playfair Display',serif"
                fontSize="96"
                fontWeight="700"
                fill="#D4A853"
                letterSpacing="-2"
                className="q-letter-glow"
              >
                Q
              </text>
              {/* Gold circle around Q */}
              <circle
                cx="328"
                cy="62"
                r="52"
                fill="none"
                stroke="#D4A853"
                strokeWidth="0.5"
                className="q-glow-circle"
              />
              {/* Teal circle outside gold */}
              <circle
                cx="328"
                cy="62"
                r="58"
                fill="none"
                stroke="#2DD4BF"
                strokeWidth="0.3"
                opacity="0.12"
              />
              {/* Teal dot bottom-right */}
              <circle cx="348" cy="95" r="3" fill="#2DD4BF" opacity="0.7" />
              {/* Smaller teal dot */}
              <circle cx="356" cy="102" r="1.5" fill="#2DD4BF" opacity="0.35" />
            </svg>
          </div>

          {/* Tagline */}
          <p className="font-[family-name:var(--font-jetbrains)] text-sm tracking-[0.35em] uppercase text-text-muted mt-8">
            {t("hero.tagline", lang)}
          </p>

          {/* Subtitle */}
          <p className="font-[family-name:var(--font-playfair)] text-lg md:text-[22px] text-text-secondary italic max-w-[600px] mx-auto mt-6 leading-relaxed">
            {t("hero.subtitle", lang)}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <a
              href="#download"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-voice-gold text-bg-deep font-medium text-sm tracking-wide transition-all hover:brightness-110"
            >
              {t("hero.cta1", lang)}
            </a>
            <a
              href="#download"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-text-muted/30 text-text-primary font-medium text-sm tracking-wide transition-all hover:border-voice-gold/50 hover:text-voice-gold"
            >
              {t("hero.cta2", lang)}
            </a>
          </div>

          {/* Bottom stats */}
          <div className="mt-16 flex items-center justify-center gap-6 text-text-muted text-xs font-[family-name:var(--font-jetbrains)] tracking-wider">
            <span>{t("stats.languages", lang)}</span>
            <span className="w-px h-3 bg-text-muted/30" />
            <span>{t("stats.encrypted", lang)}</span>
            <span className="w-px h-3 bg-text-muted/30" />
            <span>{t("stats.zeroknowledge", lang)}</span>
          </div>
        </div>
      </section>

      {/* ===== FEATURES (6 cards) ===== */}
      <section className="py-24 md:py-32 bg-bg-surface" id="features">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12">
          <span className="section-label block mb-3">{t("features.label", lang)}</span>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-medium tracking-tight leading-tight mb-4">
            {t("features.title1", lang)}<br />
            {t("features.title2", lang)}
          </h2>
          <p className="text-text-secondary text-[17px] max-w-[640px] leading-relaxed mb-16">
            {t("features.desc", lang)}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Quantum Chat */}
            <ScrollReveal delay={100}>
            <div className="relative bg-bg-card border border-[rgba(100,116,139,0.15)] rounded-2xl p-8 card-hover">
              <div className="absolute top-0 left-0 w-1 h-full bg-voice-gold rounded-l-2xl" />
              <div className="w-10 h-10 mb-5 text-voice-gold">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl font-medium mb-2">
                {t("feature.chat.title", lang)}
              </h3>
              <p className="text-text-secondary text-[15px] leading-relaxed">
                {t("feature.chat.desc", lang)}
              </p>
            </div>

            </ScrollReveal>
            {/* Card 2: Quantum Call */}
            <ScrollReveal delay={200}>
            <div className="relative bg-bg-card border border-[rgba(100,116,139,0.15)] rounded-2xl p-8 card-hover">
              <div className="absolute top-0 left-0 w-1 h-full bg-voice-gold rounded-l-2xl" />
              <div className="w-10 h-10 mb-5 text-voice-gold">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl font-medium mb-2">
                {t("feature.call.title", lang)}
              </h3>
              <p className="text-text-secondary text-[15px] leading-relaxed">
                {t("feature.call.desc", lang)}
              </p>
            </div>

            </ScrollReveal>
            {/* Card 3: Quantum Pay */}
            <ScrollReveal delay={300}>
            <div className="relative bg-bg-card border border-[rgba(100,116,139,0.15)] rounded-2xl p-8 card-hover">
              <div className="absolute top-0 left-0 w-1 h-full bg-voice-gold rounded-l-2xl" />
              <div className="w-10 h-10 mb-5 text-voice-gold">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v12M15 9.5c0-1.38-1.34-2.5-3-2.5s-3 1.12-3 2.5 1.34 2.5 3 2.5 3 1.12 3 2.5-1.34 2.5-3 2.5" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl font-medium mb-2">
                {t("feature.pay.title", lang)}
              </h3>
              <p className="text-text-secondary text-[15px] leading-relaxed">
                {t("feature.pay.desc", lang)}
              </p>
            </div>

            </ScrollReveal>
            {/* Card 4: Private Storage */}
            <ScrollReveal delay={400}>
            <div className="relative bg-bg-card border border-[rgba(100,116,139,0.15)] rounded-2xl p-8 card-hover">
              <div className="absolute top-0 left-0 w-1 h-full bg-quantum-teal rounded-l-2xl" />
              <div className="w-10 h-10 mb-5 text-quantum-teal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl font-medium mb-2">
                {t("feature.vault.title", lang)}
              </h3>
              <p className="text-text-secondary text-[15px] leading-relaxed">
                {t("feature.vault.desc", lang)}
              </p>
            </div>

            </ScrollReveal>
            {/* Card 5: Witness Mode */}
            <ScrollReveal delay={500}>
            <div className="relative bg-bg-card border border-[rgba(100,116,139,0.15)] rounded-2xl p-8 card-hover">
              <div className="absolute top-0 left-0 w-1 h-full bg-quantum-teal rounded-l-2xl" />
              <div className="w-10 h-10 mb-5 text-quantum-teal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl font-medium mb-2">
                {t("feature.witness.title", lang)}
              </h3>
              <p className="text-text-secondary text-[15px] leading-relaxed">
                {t("feature.witness.desc", lang)}
              </p>
            </div>

            </ScrollReveal>
            {/* Card 6: Mine & Earn */}
            <ScrollReveal delay={600}>
            <div className="relative bg-bg-card border border-[rgba(100,116,139,0.15)] rounded-2xl p-8 card-hover">
              <div className="absolute top-0 left-0 w-1 h-full bg-quantum-teal rounded-l-2xl" />
              <div className="w-10 h-10 mb-5 text-quantum-teal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl font-medium mb-2">
                {t("feature.mine.title", lang)}
              </h3>
              <p className="text-text-secondary text-[15px] leading-relaxed">
                {t("feature.mine.desc", lang)}
              </p>
            </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== SECURITY ===== */}
      <section className="py-24 md:py-32" id="security">
        <ScrollReveal><div className="max-w-[1100px] mx-auto px-6 md:px-12">
          <span className="section-label block mb-3">{t("security.label", lang)}</span>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-medium tracking-tight leading-tight mb-4">
            {t("security.title", lang)}
          </h2>
          <p className="text-text-secondary text-[17px] max-w-[640px] leading-relaxed mb-16">
            {t("security.desc", lang)}
          </p>

          <div className="space-y-0">
            {securityLayers.map((item) => (
              <div
                key={item.layer}
                className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 md:gap-12 py-10 border-t border-[rgba(100,116,139,0.15)] layer-animate"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-bg-card border border-[rgba(100,116,139,0.15)] flex items-center justify-center">
                    <span className={`font-[family-name:var(--font-jetbrains)] text-lg font-medium ${item.color}`}>
                      L{item.layer}
                    </span>
                  </div>
                  <div>
                    <p className="font-[family-name:var(--font-playfair)] text-lg font-medium">
                      {t(item.nameKey, lang)}
                    </p>
                    <p className="font-[family-name:var(--font-jetbrains)] text-xs text-text-muted">
                      {item.tech}
                    </p>
                  </div>
                </div>
                <p className="text-text-secondary text-[15px] leading-relaxed self-center">
                  {t(item.descKey, lang)}
                </p>
              </div>
            ))}
          </div>
        </div></ScrollReveal>
      </section>


      {/* ===== ZERO KNOWLEDGE ===== */}
      <section className="py-24 md:py-32 bg-bg-surface relative overflow-hidden" id="zero-knowledge">
        {/* Teal glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(45,212,191,0.06) 0%, transparent 70%)",
          }}
        />
        <ScrollReveal delay={100}><div className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-12">
          <span className="section-label block mb-3">{t("zk.label", lang)}</span>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-medium tracking-tight leading-tight mb-4">
            {t("zk.title", lang)}
          </h2>

          <p className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl font-medium text-voice-gold mt-12 mb-12">
            {t("zk.nothing", lang)}
          </p>

          <div className="space-y-4 text-text-secondary text-lg leading-relaxed max-w-xl">
            <p>{t("zk.line1", lang)}</p>
            <p>{t("zk.line2", lang)}</p>
            <p>{t("zk.line3", lang)}</p>
            <p className="text-text-primary font-medium pt-4">
              {t("zk.device", lang)}
            </p>
            <p className="text-text-muted">
              {t("zk.noise", lang)}
            </p>
          </div>
        </div></ScrollReveal>
      </section>

      {/* ===== Q-CREDITS ===== */}
      <section className="py-24 md:py-32" id="qcredits">
        <ScrollReveal delay={100}><div className="max-w-[1100px] mx-auto px-6 md:px-12">
          <span className="section-label block mb-3">{t("qc.label", lang)}</span>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-medium tracking-tight leading-tight mb-4">
            {t("qc.title1", lang)}<br />
            {t("qc.title2", lang)}
          </h2>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Gold ring visual */}
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#D4A853"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="70"
                    fill="none"
                    stroke="#D4A853"
                    strokeWidth="0.5"
                    opacity="0.15"
                  />
                  <text
                    x="100"
                    y="95"
                    textAnchor="middle"
                    fontFamily="'Playfair Display',serif"
                    fontSize="24"
                    fontWeight="600"
                    fill="#D4A853"
                  >
                    0.01g
                  </text>
                  <text
                    x="100"
                    y="118"
                    textAnchor="middle"
                    fontFamily="'JetBrains Mono',monospace"
                    fontSize="10"
                    fill="#94A3B8"
                  >
                    GOLD
                  </text>
                </svg>
              </div>
            </div>

            {/* Stats */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <p className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-medium text-voice-gold">
                  1 QC = 0.01 gram gold
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-bg-card border border-[rgba(100,116,139,0.15)] rounded-2xl p-6">
                  <p className="font-[family-name:var(--font-jetbrains)] text-xs text-text-muted uppercase tracking-wider mb-2">
                    {t("qc.maxsupply", lang)}
                  </p>
                  <p className="font-[family-name:var(--font-playfair)] text-2xl font-medium">
                    21,000,000 QC
                  </p>
                  <p className="text-text-muted text-sm mt-1">
                    {t("qc.fixed", lang)}
                  </p>
                </div>
                <div className="bg-bg-card border border-[rgba(100,116,139,0.15)] rounded-2xl p-6">
                  <p className="font-[family-name:var(--font-jetbrains)] text-xs text-text-muted uppercase tracking-wider mb-2">
                    Sparks
                  </p>
                  <p className="font-[family-name:var(--font-playfair)] text-2xl font-medium">
                    1 QC = 100M Sparks
                  </p>
                  <p className="text-text-muted text-sm mt-1">
                    {t("qc.smallest", lang)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-lg font-medium mb-2">
                    {t("qc.mine.title", lang)}
                  </h3>
                  <p className="text-text-secondary text-[15px] leading-relaxed">
                    {t("qc.mine.desc", lang)}
                  </p>
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-lg font-medium mb-2">
                    {t("qc.send.title", lang)}
                  </h3>
                  <p className="text-text-secondary text-[15px] leading-relaxed">
                    {t("qc.send.desc", lang)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div></ScrollReveal>
      </section>

      {/* ===== DOWNLOAD ===== */}
      <section className="py-24 md:py-32 bg-bg-surface" id="download">
        <ScrollReveal delay={100}><div className="max-w-[1100px] mx-auto px-6 md:px-12">
          <span className="section-label block mb-3">{t("download.label", lang)}</span>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-medium tracking-tight leading-tight mb-16">
            {t("download.title", lang)}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* iOS */}
            <div className="bg-bg-card border border-[rgba(100,116,139,0.15)] rounded-2xl p-8 text-center transition-all hover:border-voice-gold/30">
              <div className="w-12 h-12 mx-auto mb-5 text-text-primary flex items-center justify-center">
                {/* Apple SVG icon */}
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl font-medium mb-2">
                {t("download.ios", lang)}
              </h3>
              <p className="text-text-muted text-sm mb-6">
                {t("download.appstore", lang)}
              </p>
              <span className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-voice-gold text-bg-deep font-medium text-sm">
                {t("download.comingsoon", lang)}
              </span>
            </div>

            {/* Android */}
            <div className="bg-bg-card border border-[rgba(100,116,139,0.15)] rounded-2xl p-8 text-center transition-all hover:border-voice-gold/30">
              <div className="w-12 h-12 mx-auto mb-5 flex items-center justify-center">
                {/* Android SVG icon */}
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="#3DDC84" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl font-medium mb-2">
                {t("download.android", lang)}
              </h3>
              <p className="text-text-muted text-sm mb-6">
                {t("download.playstore", lang)}
              </p>
              <span className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-voice-gold text-bg-deep font-medium text-sm">
                {t("download.comingsoon", lang)}
              </span>
            </div>

            {/* Web App */}
            <div className="bg-bg-card border border-[rgba(100,116,139,0.15)] rounded-2xl p-8 text-center transition-all hover:border-voice-gold/30">
              <div className="w-12 h-12 mx-auto mb-5 text-text-primary flex items-center justify-center">
                {/* Globe SVG icon */}
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl font-medium mb-2">
                {t("download.webapp", lang)}
              </h3>
              <p className="text-text-muted text-sm mb-6">
                {t("download.pwa", lang)}
              </p>
              <a href="/app" className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-voice-gold text-bg-deep font-medium text-sm hover:bg-voice-warm transition-colors">
                {t("download.launch", lang)}
              </a>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-text-muted text-sm">
              <span className="font-[family-name:var(--font-jetbrains)]">PWA:</span>{" "}
              {t("download.pwa.hint", lang)}
            </p>
          </div>
        </div></ScrollReveal>
      </section>

      {/* ===== FAQ LINK ===== */}
      <section className="py-12 bg-bg-surface border-t border-[rgba(100,116,139,0.08)]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 text-center">
          <a
            href="/faq"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-bg-card border border-[rgba(100,116,139,0.15)] hover:border-voice-gold/40 transition-all group"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-voice-gold">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span className="text-text-primary font-medium group-hover:text-voice-gold transition-colors">
              Frequently Asked Questions
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted group-hover:text-voice-gold transition-colors">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>

      {/* ===== LANGUAGES ===== */}
      <section className="py-24 md:py-32" id="languages">
        <ScrollReveal delay={100}><div className="max-w-[1100px] mx-auto px-6 md:px-12 text-center">
          <span className="section-label block mb-3">{t("languages.label", lang)}</span>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-medium tracking-tight leading-tight mb-16">
            {t("languages.title", lang)}
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => changeLang(l.code)}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-bg-card border text-sm transition-all ${
                  l.code === lang
                    ? "border-voice-gold text-voice-gold"
                    : "border-[rgba(100,116,139,0.15)] text-text-primary hover:border-voice-gold/30 hover:text-voice-gold"
                }`}
              >
                <span className="font-[family-name:var(--font-jetbrains)] text-xs text-text-muted">
                  {l.label}
                </span>
                <span>{l.name}</span>
              </button>
            ))}
          </div>
        </div></ScrollReveal>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-16 border-t border-[rgba(100,116,139,0.15)]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 text-center">
          <p className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-2">
            SPEA<span className="text-voice-gold">Q</span> {t("footer.tagline", lang)}
          </p>
          <p className="text-text-muted text-sm mb-8">thespeaq.com</p>

          <div className="flex items-center justify-center gap-6 text-sm text-text-muted mb-8">
            <a
              href="/privacy"
              className="hover:text-voice-gold transition-colors"
            >
              {t("footer.privacy", lang)}
            </a>
            <a
              href="/terms"
              className="hover:text-voice-gold transition-colors"
            >
              {t("footer.terms", lang)}
            </a>
            <a
              href="/faq"
              className="hover:text-voice-gold transition-colors"
            >
              {t("footer.faq", lang)}
            </a>
          </div>

          <p className="text-text-muted text-xs mb-1">
            {t("footer.built", lang)}
          </p>
          <p className="text-text-muted text-xs">{t("footer.country", lang)}</p>
          <p className="text-text-muted text-xs mt-4">
            &copy; 2026 SPEAQ. All rights reserved.
          </p>
        </div>
      </footer>

      <CookieBanner />
    </main>
  );
}
