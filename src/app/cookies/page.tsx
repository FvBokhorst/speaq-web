import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookies - SPEAQ",
  description: "SPEAQ uses no third-party cookies, no trackers, no analytics. Only browser localStorage for theme and language preference.",
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen py-24 md:py-32">
      <div className="max-w-[760px] mx-auto px-6 md:px-12">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-text-muted text-sm mb-12 hover:text-voice-gold transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to SPEAQ
        </a>

        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-medium tracking-tight leading-tight mb-4">
          Cookies and Local Storage
        </h1>
        <p className="text-text-muted text-sm font-[family-name:var(--font-jetbrains)] mb-16">
          Last updated: May 10, 2026
        </p>

        <div className="space-y-10 text-text-secondary text-[16px] leading-relaxed">
          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Short version
            </h2>
            <p>
              We use no third-party cookies, no advertising trackers, no analytics scripts, no fingerprinting. The only persistent storage on your device is browser <code className="font-[family-name:var(--font-jetbrains)] text-sm bg-[rgba(100,116,139,0.1)] px-2 py-0.5 rounded">localStorage</code> for your theme and language preference. That data never leaves your browser.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              What we use
            </h2>
            <ul className="list-none space-y-3">
              {[
                { key: "theme", value: "dark or light - your visual preference" },
                { key: "lang", value: "en, nl, fr, etc - your selected language" },
                { key: "speaq-identity", value: "your encrypted identity (only after creating a SPEAQ account in the PWA)" },
              ].map((item) => (
                <li key={item.key} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-voice-gold mt-2.5 shrink-0" />
                  <span><code className="font-[family-name:var(--font-jetbrains)] text-sm bg-[rgba(100,116,139,0.1)] px-2 py-0.5 rounded">{item.key}</code> - {item.value}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              What we do not use
            </h2>
            <ul className="list-none space-y-3">
              {[
                "Google Analytics, Mixpanel, Plausible, or any analytics service",
                "Facebook Pixel, Twitter Pixel, LinkedIn Insight, or any ad-tech tracker",
                "Hotjar, FullStory, or any session-recording tool",
                "Third-party cookies of any kind",
                "Browser-fingerprinting libraries",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-quantum-teal mt-2.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Server-side logs
            </h2>
            <p>
              Our hosting (Cloud Run europe-west1) automatically logs request metadata for operational monitoring: IP address, request path, status code, timestamp, user-agent. These logs are kept for 7 days and then deleted. They are not used for analytics, advertising, or profiling. They cannot be linked to your SPEAQ identity because we never know who you are.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              If we ever add analytics
            </h2>
            <p>
              We have committed to a privacy-friendly self-hosted approach (Plausible or Matomo on our own infrastructure) if we ever decide we need product analytics. We will publish a cookie disclosure on this page before activating it. No third-party trackers will be added without explicit user consent.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Contact
            </h2>
            <p>
              Questions about this policy: <a href="mailto:privacy@thespeaq.com" className="text-voice-gold underline">privacy@thespeaq.com</a>.
            </p>
            <p className="mt-4 text-text-muted text-sm">
              QSR2go Operations B.V., trading as Plexaris - KvK 62031619 - Amsterdam, the Netherlands.
            </p>
          </section>
        </div>

        <div className="mt-20 pt-10 border-t border-[rgba(100,116,139,0.15)] text-center">
          <p className="font-[family-name:var(--font-playfair)] text-lg text-text-primary">
            SPEA<span className="text-voice-gold">Q</span> Freely.
          </p>
          <p className="text-text-muted text-xs mt-2">
            &copy; 2026 QSR2go Operations B.V. h.o.d.n. Plexaris. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
