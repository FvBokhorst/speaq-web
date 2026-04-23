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
              All messages, calls, and files sent through SPEAQ are end-to-end
              encrypted using quantum-resistant cryptography (Kyber-768, AES-256,
              Double Ratchet). SPEAQ cannot read, listen to, or access your
              communications. This is a technical guarantee, not a policy
              promise.
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
                "1 Q-Credit is backed by 0.01 gram of gold",
                "Maximum supply is 21,000,000 QC",
                "Q-Credits can be earned through mining (Proof of Contribution)",
                "Your wallet and private keys are stored locally on your device",
                "SPEAQ cannot access, freeze, or confiscate your Q-Credits",
                "Transactions are verified by the network, not a central authority",
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
              SPEAQ employs post-quantum cryptography certified by NIST:
            </p>
            <ul className="list-none space-y-3">
              {[
                "Kyber-768 (FIPS 203) - quantum-resistant key encapsulation",
                "Dilithium-3 (FIPS 204) - quantum-resistant digital signatures",
                "SPHINCS+ (FIPS 205) - hash-based backup signatures",
                "AES-256-GCM - symmetric encryption for messages",
                "CLSAG ring signatures - sender anonymity (ring size 11)",
                "Pedersen commitments + Bulletproofs - confidential transactions",
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
