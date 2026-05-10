import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acceptable Use Policy - SPEAQ",
  description: "SPEAQ Acceptable Use Policy. What is forbidden, how to report abuse, and how authorities can reach us.",
};

export default function AupPage() {
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
          Acceptable Use Policy
        </h1>
        <p className="text-text-muted text-sm font-[family-name:var(--font-jetbrains)] mb-16">
          Last updated: May 10, 2026
        </p>

        <div className="space-y-10 text-text-secondary text-[16px] leading-relaxed">
          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Sovereignty is not a licence to harm
            </h2>
            <p>
              SPEAQ is a sovereign messaging tool. We cannot read your messages or stop you from doing harmful things on a technical level. That makes the moral burden yours. This page sets out what is forbidden, what to do if you see abuse, and how authorities can reach us.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              What is forbidden
            </h2>
            <ul className="list-none space-y-3">
              {[
                "Child sexual abuse material (CSAM) - we will report to NCMEC and Dutch Police if discovered",
                "Direct threats of violence against persons or groups",
                "Coordinated harassment, doxing, or stalking",
                "Distribution of illegal weapons, drugs, or trafficked persons",
                "Fraud, identity theft, or impersonation",
                "Distribution of malware or cyber-attack tooling against third parties",
                "Use that violates Dutch law or applicable EU regulation",
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
              How to report abuse
            </h2>
            <p className="mb-4">
              If you believe a SPEAQ identity is being used for any of the above, send a notice to <a href="mailto:abuse@thespeaq.com" className="text-voice-gold underline">abuse@thespeaq.com</a> with the subject line <strong className="text-text-primary">SPEAQ Abuse</strong>. Include:
            </p>
            <ul className="list-none space-y-3">
              {[
                "The DID (did:speaq:zX) of the offending account, if you have it",
                "Description of the activity (no need to include screenshots of message content - we cannot read it anyway)",
                "Your contact for follow-up (optional, can be pseudonymous)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-voice-gold mt-2.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4">
              We commit to acknowledge abuse-reports within 5 working days. Verified violators may have their identity revoked from the SPEAQ Chain governance log; revoked DIDs cannot send messages.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              For law enforcement
            </h2>
            <p className="mb-4">
              SPEAQ is end-to-end encrypted. We technically cannot:
            </p>
            <ul className="list-none space-y-3">
              {[
                "Decrypt message content",
                "Disclose who you are communicating with",
                "Provide message history (we do not store it)",
                "Identify a SPEAQ user by name, phone or email (we never collect those)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-quantum-teal mt-2.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4">
              We will respond to valid Dutch court orders or EU mutual-legal-assistance requests by stating exactly what we have, which is typically nothing useful. We do maintain a public hash-chained governance log of issued and revoked identities for accountability.
            </p>
            <p className="mt-4">
              Lawful contact: <a href="mailto:legal@thespeaq.com" className="text-voice-gold underline">legal@thespeaq.com</a>.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              EU Digital Services Act (DSA)
            </h2>
            <p>
              SPEAQ is a small mass-market communication service and falls below the DSA thresholds for designated very-large-online-platform obligations. Our notice-and-action mechanism (this page + abuse@thespeaq.com) implements the user-facing requirements of DSA article 16. We will publish a yearly transparency report once we exceed 5,000 active users in the EU.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Changes to this policy
            </h2>
            <p>
              Material changes are announced on this page with a new <em>Last updated</em> date. By continuing to use SPEAQ after such changes, you accept them.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Contact
            </h2>
            <p>
              Abuse: <a href="mailto:abuse@thespeaq.com" className="text-voice-gold underline">abuse@thespeaq.com</a><br />
              Privacy: <a href="mailto:privacy@thespeaq.com" className="text-voice-gold underline">privacy@thespeaq.com</a><br />
              Legal: <a href="mailto:legal@thespeaq.com" className="text-voice-gold underline">legal@thespeaq.com</a>
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
