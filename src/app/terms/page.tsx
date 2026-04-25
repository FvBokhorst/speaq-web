import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - SPEAQ",
  description: "SPEAQ Terms of Service. Know your rights on the quantum-resistant communication platform.",
};

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="text-text-muted text-sm font-[family-name:var(--font-jetbrains)] mb-16">
          Last updated: April 7, 2026
        </p>

        <div className="space-y-10 text-text-secondary text-[16px] leading-relaxed">
          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Agreement
            </h2>
            <p>
              By using SPEAQ, you agree to these Terms of Service. SPEAQ is a
              quantum-resistant communication platform operated by Plexaris
              Technology Consulting (Franciscus van Bokhorst), registered in The
              Netherlands. If you do not agree with these terms, do not use
              SPEAQ.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              No Registration Required
            </h2>
            <p>
              SPEAQ does not require an email address, phone number, real name, or
              any other personal identifier to use the platform. Your SPEAQ ID is
              generated locally on your device and is not linked to your real
              identity. You are solely responsible for safeguarding access to your
              device and your SPEAQ identity.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              End-to-End Encryption
            </h2>
            <p>
              Text messages are end-to-end encrypted on your device with
              AES-256-GCM (NIST standard) and forwarded by SPEAQ as opaque
              ciphertext. Voice and video media use WebRTC DTLS-SRTP standard
              encryption. Voice and video signaling (SDP/ICE) is also
              encrypted between peers since the 2026-04-25 update. Key exchange
              uses FIPS 203 ML-KEM-768 (NIST post-quantum, via the
              @noble/post-quantum library). FIPS 204 ML-DSA-65 implementation
              is present for wallet/transaction signing. SPEAQ does not retain
              plaintext copies of message content.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Q-Credits
            </h2>
            <p className="mb-4">
              Q-Credits (QC) are a digital currency used within the SPEAQ
              ecosystem. Key terms:
            </p>
            <ul className="list-none space-y-3">
              {[
                "1 Q-Credit is backed by 0.01 gram of gold (once mainnet launches)",
                "Maximum supply is 21,000,000 QC",
                "Q-Credits are earned through Proof of Contribution (see section below)",
                "Your wallet and private keys are stored locally on your device",
                "SPEAQ cannot access, freeze, or confiscate your Q-Credits",
                "Transactions will be verified by the network once mainnet launches (currently tracked locally, see Pre-Chain Status)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-voice-gold mt-2.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section id="pre-chain-status">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Pre-Chain Status and Migration Policy
            </h2>
            <p className="mb-4">
              <strong>The SPEAQ public blockchain is not yet launched.</strong> Your current
              Q-Credits are tracked locally on your device as a pre-chain loyalty
              record, not as on-chain tokens. Until mainnet launches, QC has no
              market value, is not listed on any exchange, cannot be converted to
              or from fiat currency, and exists only as a loyalty tracker between
              SPEAQ participants.
            </p>
            <p className="mb-4">
              Contribution rewards are double-signed (by your private key and the
              relay server as witness) and stored in your local ledger. At mainnet
              launch, only entries with both valid signatures are eligible for
              migration.
            </p>
            <p className="mb-4">
              <strong>Migration policy (Option C - Hybrid Snapshot):</strong>
            </p>
            <ul className="list-none space-y-3 mb-4">
              {[
                "At mainnet launch (estimated Q3-Q4 2026) a snapshot is taken of all pre-chain balances",
                "Each SPEAQ ID can submit a signed claim to convert its pre-chain balance into on-chain tokens",
                "The per-account cap is 500 QC per SPEAQ ID (balance above this does not migrate)",
                "Migrated tokens are funded from the Early Adopters allocation (2% of the 21,000,000 QC total supply)",
                "Claims are cryptographically verified against the contribution ledger before being honored",
                "Pre-chain balances above the cap, or without valid signed contributions, do not carry over",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-voice-gold mt-2.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p>
              Mainnet launch timing is subject to change based on development
              progress, testnet validation, and governance readiness. Final
              migration rules will be published at least 30 days before mainnet
              launch in a Migration Policy document referenced from this page.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Not a Financial Institution
            </h2>
            <p>
              SPEAQ is not a bank, payment processor, or regulated financial
              institution. Q-Credits are a utility token within the SPEAQ
              ecosystem. SPEAQ does not provide financial advice, investment
              services, or guarantees regarding the value of Q-Credits. You use
              Q-Credits at your own risk and are responsible for understanding the
              regulatory requirements in your jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Proof of Contribution
            </h2>
            <p className="mb-4">
              SPEAQ Chain uses Proof of Contribution (DPoC) consensus, not Proof of Work.
              Contribution rewards are earned by contributing to the network, not by consuming energy.
            </p>
            <ul className="list-none space-y-3 mb-4">
              {[
                "Initial block reward: 0.5 QC per block (30-second intervals)",
                "Halving occurs every 2,100,000 QC distributed (halving schedule modeled after Bitcoin)",
                "Maximum supply: 21,000,000 QC - hard cap, no inflation",
                "Contribution types: message relay, proof validation, data storage, mesh networking, translation, user onboarding",
                "Top 21 validators selected by contribution score with geographic diversity",
                "Finality: 2/3 majority (14/21 validators must confirm each block)",
                "Malicious validators are slashed (lose their position and score)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-voice-gold mt-2.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p>
              Contribution reward rates are determined by the protocol and decrease over time through
              halving events. SPEAQ does not guarantee any specific reward rate, token value,
              or return on contribution. Past contribution performance is not indicative of future results.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Blockchain & Network
            </h2>
            <p className="mb-4">
              SPEAQ Chain is a decentralized, permissionless blockchain. By participating as a
              node operator or validator, you acknowledge:
            </p>
            <ul className="list-none space-y-3">
              {[
                "Transactions are irreversible once confirmed by the network",
                "Blockchain data is public and permanent - transaction hashes, block heights, and encrypted amounts are visible to all participants",
                "SPEAQ cannot reverse, cancel, or modify transactions",
                "Network consensus rules are enforced by software, not by any person or entity",
                "Hard forks or protocol upgrades may occur with community consensus",
                "Node operators are responsible for maintaining their own infrastructure",
                "The network may experience downtime, delays, or disruptions",
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
              Cryptographic Security
            </h2>
            <p className="mb-4">
              Cryptographic primitives currently active (as of 2026-04-25 audit):
            </p>
            <ul className="list-none space-y-3">
              {[
                "AES-256-GCM (NIST) - symmetric encryption for text messages, file content, and Q-Credits payment payloads",
                "Double Ratchet - forward secrecy, fresh derived key per message",
                "FIPS 203 ML-KEM-768 (NIST-standardized post-quantum, via @noble/post-quantum)",
                "ECDSA P-256 (NIST, pre-quantum) - signed key exchange between contacts",
                "SHA-256 (NIST) - hashing of identity records and witness records",
                "HMAC-SHA256 (NIST) - server-side mining receipt tags (relay-internal authentication, not double-signed)",
                "WebRTC DTLS-SRTP - voice and video media encryption. PWA call signaling additionally encrypted with AES-256-GCM keys derived from the Kyber-768 shared secret (zero-knowledge against the relay). Native iOS/Android signaling parity on roadmap.",
                "FIPS 203 Kyber-768 ACTIVE (PWA + native, 2026-04-25). FIPS 204 ML-DSA-65 ACTIVE in PWA (E1 hardening), in relay AUTH hybrid (with ECDSA P-256), and in chain block dual-signing. FIPS 205 SPHINCS+ ACTIVE in chain block dual-signing. CLSAG ring signatures, Pedersen commitments + Bulletproofs in chain.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-quantum-teal mt-2.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4">
              While these algorithms are currently considered secure against both classical and
              quantum computers, no cryptographic system can guarantee absolute security
              indefinitely. SPEAQ will upgrade its cryptographic stack as standards evolve.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Risk Acknowledgment
            </h2>
            <p className="mb-4">
              By using SPEAQ and Q-Credits, you acknowledge and accept:
            </p>
            <ul className="list-none space-y-3">
              {[
                "Digital currencies are volatile and may lose value",
                "Regulatory frameworks for digital currencies vary by jurisdiction and may change",
                "Loss of private keys means permanent loss of Q-Credits with no recovery possible",
                "Software bugs, despite extensive testing (118+ automated tests, 24 formal proofs), may exist",
                "Network attacks, while mitigated by quantum-resistant cryptography, cannot be entirely ruled out",
                "SPEAQ is open-source software provided without warranty",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E24B4A] mt-2.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Your Responsibility
            </h2>
            <p className="mb-4">
              Because SPEAQ operates on a zero-knowledge architecture, you are
              responsible for:
            </p>
            <ul className="list-none space-y-3">
              {[
                "Backing up your wallet and private keys - lost keys cannot be recovered",
                "Keeping your device secure - your data lives on your device",
                "Remembering your PIN - SPEAQ cannot reset it for you",
                "Complying with the laws of your jurisdiction",
                "The content you send through the platform",
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
              Prohibited Use
            </h2>
            <p>
              You may not use SPEAQ for any activity that is illegal in your
              jurisdiction, including but not limited to: distributing malware,
              facilitating fraud, or engaging in activities that harm the SPEAQ
              network or its users. While SPEAQ cannot monitor your
              communications due to end-to-end encryption, violation of these
              terms may result in exclusion from the network.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Limitation of Liability
            </h2>
            <p>
              SPEAQ is provided &quot;as is&quot; without warranties of any kind. Plexaris
              Technology Consulting shall not be liable for any damages arising
              from the use of SPEAQ, including but not limited to: loss of data,
              loss of Q-Credits, loss of access to your wallet, or interruption
              of service. Your use of SPEAQ is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Governing Law
            </h2>
            <p>
              These Terms of Service are governed by and construed in accordance
              with the laws of The Netherlands. Any disputes arising from these
              terms shall be subject to the exclusive jurisdiction of the courts
              of The Netherlands.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Changes to These Terms
            </h2>
            <p>
              We may update these Terms of Service from time to time. Changes
              will be communicated through the app and published at
              thespeaq.com/terms. Continued use of SPEAQ after changes
              constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Privacy
            </h2>
            <p>
              Your privacy is fundamental to SPEAQ. Please review our{" "}
              <a
                href="/privacy"
                className="text-quantum-teal hover:text-voice-gold transition-colors underline underline-offset-2"
              >
                Privacy Policy
              </a>{" "}
              for details on how we protect your data.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Contact
            </h2>
            <p>
              For questions about these Terms of Service, contact us at
              legal@thespeaq.com.
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
