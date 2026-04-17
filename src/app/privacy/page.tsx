import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - SPEAQ",
  description: "SPEAQ Privacy Policy. We collect nothing. Your data stays on your device.",
};

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-text-muted text-sm font-[family-name:var(--font-jetbrains)] mb-16">
          Last updated: April 5, 2026
        </p>

        <div className="space-y-10 text-text-secondary text-[16px] leading-relaxed">
          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Our Commitment
            </h2>
            <p>
              SPEAQ is built on a simple principle: your data is yours. We designed
              SPEAQ so that we cannot read your messages, listen to your calls, see
              your files, or access your wallet. This is not a policy choice - it is
              a technical guarantee.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              What We Do Not Collect
            </h2>
            <ul className="list-none space-y-3">
              {[
                "Your real name, email address, or phone number",
                "The content of your messages, calls, or files",
                "Your contacts or address book",
                "Your location or IP address (after initial connection)",
                "Your wallet balance or transaction history",
                "Your browsing activity within SPEAQ",
                "Metadata about who you communicate with",
                "Device identifiers that could be linked to your identity",
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
              What We Process
            </h2>
            <p className="mb-4">
              To operate the SPEAQ relay network, we process only the minimum
              amount of data needed to deliver your messages, and nothing that
              can be linked to your identity:
            </p>
            <ul className="list-none space-y-3">
              {[
                "Encrypted message blobs (we cannot decrypt them)",
                "Temporary routing information (deleted after delivery)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-voice-gold mt-2.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Encryption
            </h2>
            <p>
              All communications are protected by end-to-end encryption using
              AES-256 with the Double Ratchet protocol for forward secrecy. Key
              exchange uses Kyber-768, a post-quantum lattice-based KEM. Even if
              quantum computers become available, your past and future messages
              remain secure.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Privacy-First Architecture
            </h2>
            <p>
              SPEAQ uses a sealed-sender relay system. The server facilitates
              message delivery without knowing who is communicating with whom.
              Messages are encrypted before leaving your device and can only be
              decrypted by the intended recipient.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Data Storage
            </h2>
            <p>
              All your data - messages, files, contacts, wallet information - is
              stored locally on your device. We do not have access to this data.
              If you delete the app, your data is gone. We recommend using the
              encrypted backup feature to protect against device loss.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Q-Credits & Wallet
            </h2>
            <p>
              Your Q-Credit wallet operates entirely on your device. Private keys
              never leave your device. We cannot access, freeze, or confiscate
              your Q-Credits. Transactions are verified by the network, not by a
              central authority.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Third Parties
            </h2>
            <p>
              We do not sell, share, or provide your data to any third party. We
              do not use third-party analytics, advertising, or tracking services.
              There are no cookies, no pixels, no trackers.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Law Enforcement
            </h2>
            <p>
              Because of our zero-knowledge architecture, we have nothing to
              provide in response to legal requests. We cannot decrypt your
              messages. We do not know who you communicate with. We do not store
              your data. We will comply with valid legal processes, but the
              technical reality is that we have nothing useful to hand over.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Changes to This Policy
            </h2>
            <p>
              We will notify users of any material changes to this privacy policy
              through the app. The current version is always available at
              thespeaq.com/privacy.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Contact
            </h2>
            <p>
              For privacy-related questions, contact us at privacy@thespeaq.com.
            </p>
            <p className="mt-4 text-text-muted text-sm">
              SPEAQ is developed by Plexaris Technology Consulting, The Netherlands.
            </p>
          </section>
        </div>

        <div className="mt-20 pt-10 border-t border-[rgba(100,116,139,0.15)] text-center">
          <p className="font-[family-name:var(--font-playfair)] text-lg text-text-primary">
            SPEA<span className="text-voice-gold">Q</span> Freely.
          </p>
          <p className="text-text-muted text-xs mt-2">
            &copy; 2026 SPEAQ. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
