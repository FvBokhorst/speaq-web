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
          Last updated: May 10, 2026
        </p>

        <section className="mb-10 p-6 rounded-lg bg-[rgba(212,168,83,0.05)] border border-[rgba(212,168,83,0.2)]">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-medium text-text-primary mb-3">
            Legal entity
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            <strong className="text-text-primary">QSR2go Operations B.V.</strong>, trading as Plexaris<br />
            Amsterdam, the Netherlands<br />
            Chamber of Commerce (KvK): <span className="font-[family-name:var(--font-jetbrains)]">62031619</span><br />
            Privacy contact: <a href="mailto:privacy@thespeaq.com" className="text-voice-gold underline">privacy@thespeaq.com</a>
          </p>
          <p className="text-sm text-text-muted mt-3 leading-relaxed">
            QSR2go Operations B.V. (h.o.d.n. Plexaris) is the controller for personal data processed in connection with SPEAQ. There is no formally appointed Data Protection Officer because the company remains under the GDPR article 37 thresholds. The CEO performs DPO-light duties.
          </p>
        </section>

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
              Text messages are end-to-end encrypted with AES-256-GCM (NIST
              standard) and a Double Ratchet protocol providing forward secrecy.
              Key exchange uses FIPS 203 ML-KEM-768 (NIST post-quantum, via the
              @noble/post-quantum library) on both PWA and native, active since
              the 2026-04-25 audit upgrade. FIPS 204 ML-DSA-65 is active in PWA
              identity hardening, in the relay AUTH hybrid (with ECDSA P-256),
              and in SPEAQ Chain block dual-signing. FIPS 205 SPHINCS+ (SLH-DSA)
              is active in chain block dual-signing as a hash-based fallback.
              Voice and video media use WebRTC's DTLS-SRTP encryption; PWA
              signaling (SDP/ICE) is additionally encrypted with AES-256-GCM
              using a key derived from the Kyber-768 shared secret, making call
              signaling zero-knowledge against the relay.
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
              Voice and Video Infrastructure
            </h2>
            <p className="mb-4">
              To enable real-time voice and video calls between devices on
              different networks, SPEAQ operates two relay servers: a TURN
              server (turn.thespeaq.com) that helps establish peer-to-peer
              connections, and a Selective Forwarding Unit (sfu.thespeaq.com)
              that routes encrypted media streams. Both servers:
            </p>
            <ul className="list-none space-y-3">
              {[
                "Receive only encrypted media packets (DTLS-SRTP), which they cannot decrypt",
                "See temporary IP addresses of participants while a call is active",
                "Do not record, store, or analyze any call content",
                "Hold no logs of who calls whom",
                "Retain no data after a call ends",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-voice-gold mt-2.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4">
              Call signaling itself (the messages that set up a call) is
              additionally encrypted with AES-256-GCM using a key derived from
              the Kyber-768 post-quantum shared secret, making the relay
              zero-knowledge against signaling content.
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
              Display name
            </h2>
            <p>
              The display name you choose during account creation is stored unencrypted on our relay so that your contacts can see who is messaging them. If you want to remain pseudonymous, do not enter identifying information (real name, location, employer) as your display name. The first-time setup screen will warn you about this.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Push notifications
            </h2>
            <p>
              Push notifications are opt-in. Before the iOS or Android system prompt appears, the app shows a short in-app explanation of what push is used for: incoming messages and calls. The push payload itself contains no message content, only a routing token.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Q-Credits wallet activation
            </h2>
            <p>
              The Q-Credits wallet is opt-in. You can use SPEAQ messenger fully without ever activating a wallet. When you choose to activate, an in-app consent screen explains that (1) the SPEAQ-chain ledger is public, (2) blockchain transactions are immutable, and (3) due to immutability, GDPR article 17 right-to-erasure cannot be retroactively applied to chain records. The wallet is created only after you give informed consent.
          </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Contact
            </h2>
            <p>
              For privacy-related questions, contact us at <a href="mailto:privacy@thespeaq.com" className="text-voice-gold underline">privacy@thespeaq.com</a>.
            </p>
            <p className="mt-4 text-text-muted text-sm">
              SPEAQ is developed by QSR2go Operations B.V., trading as Plexaris (KvK 62031619), Amsterdam, the Netherlands.
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
