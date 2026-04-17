import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support - SPEAQ",
  description: "Help and support for SPEAQ. Answers to common questions and how to contact us.",
};

const faqs = [
  {
    question: "What is SPEAQ?",
    answer:
      "SPEAQ is a private messenger with a community rewards programme. Your messages, voice and video calls, photos and files are end-to-end encrypted and never leave your device unencrypted. You can earn credits for active participation, visible in your in-app rewards wallet.",
  },
  {
    question: "How do I get started?",
    answer:
      "Download SPEAQ from the App Store or use the web version at thespeaq.com. You do not need an account, email or phone number to start. Simply open the app and choose a display name. To add a contact, scan their QR code or share yours.",
  },
  {
    question: "How do I add contacts?",
    answer:
      "Contacts are added via QR codes, not phone numbers. Your contact shows their QR code, you scan it, and the connection is made directly between your devices. SPEAQ never uploads your address book.",
  },
  {
    question: "How does the rewards programme work?",
    answer:
      "Credits are earned for participating in the SPEAQ community. Inviting friends, being active and helping the network run smoothly all earn credits. Your balance is visible in the Wallet tab. Credits are stored locally on your device and are not purchased with real money.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Yes. SPEAQ collects no personal data. Messages, files, contacts, rewards credits and voice notes all stay on your device. Everything sent between users is end-to-end encrypted using post-quantum cryptography. We have no analytics, no advertising, no third-party trackers.",
  },
  {
    question: "I lost access to my account. Can you help me recover it?",
    answer:
      "Because SPEAQ is local-first and we hold no user data, we cannot reset access for you. Your identity and keys live only on your device. We strongly recommend using the encrypted backup feature inside SPEAQ to protect against device loss. Without a backup, a lost device means lost messages and contacts.",
  },
  {
    question: "Does SPEAQ work on multiple devices?",
    answer:
      "Version 1.0 supports one primary device per identity. Multi-device linking is planned for a future release. The PWA at thespeaq.com and the native app each run as separate identities. You can use both, just with different display names and contacts.",
  },
  {
    question: "How do I report a problem or bug?",
    answer:
      "Email support@thespeaq.com with a short description of what happened. Include the version number (Settings > About) if you can. We respond within two business days.",
  },
  {
    question: "How do I report a security issue?",
    answer:
      "Security issues go to security@thespeaq.com. Please do not open public issues for suspected vulnerabilities. We respond within three business days and acknowledge responsible reporters.",
  },
  {
    question: "I have a suggestion to improve SPEAQ. How can I share it?",
    answer:
      "We love ideas. Either email feedback@thespeaq.com, or open an issue or pull request on our GitHub repositories. SPEAQ is source-available under the Polyform Noncommercial License, so contributions and suggestions are welcome.",
  },
];

export default function SupportPage() {
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
          Support
        </h1>
        <p className="text-text-muted text-sm font-[family-name:var(--font-jetbrains)] mb-16">
          Help with SPEAQ. Last updated: April 17, 2026
        </p>

        <div className="space-y-10 text-text-secondary text-[16px] leading-relaxed">
          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Get in touch
            </h2>
            <p className="mb-4">
              We respond to every message we receive. Use the address that fits
              your question.
            </p>
            <ul className="list-none space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-voice-gold mt-2.5 shrink-0" />
                <span>
                  <strong>General help and bug reports:</strong>{" "}
                  <a href="mailto:support@thespeaq.com" className="text-voice-gold hover:underline">support@thespeaq.com</a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-voice-gold mt-2.5 shrink-0" />
                <span>
                  <strong>Security issues:</strong>{" "}
                  <a href="mailto:security@thespeaq.com" className="text-voice-gold hover:underline">security@thespeaq.com</a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-voice-gold mt-2.5 shrink-0" />
                <span>
                  <strong>Feature suggestions:</strong>{" "}
                  <a href="mailto:feedback@thespeaq.com" className="text-voice-gold hover:underline">feedback@thespeaq.com</a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-voice-gold mt-2.5 shrink-0" />
                <span>
                  <strong>Privacy questions:</strong>{" "}
                  <a href="mailto:privacy@thespeaq.com" className="text-voice-gold hover:underline">privacy@thespeaq.com</a>
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Frequently asked questions
            </h2>
            <div className="space-y-8">
              {faqs.map((faq, i) => (
                <div key={i}>
                  <h3 className="font-[family-name:var(--font-playfair)] text-lg font-medium text-text-primary mb-2">
                    {faq.question}
                  </h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Response times
            </h2>
            <p>
              We aim to respond to support requests within two business days, and
              to security reports within three business days. If your issue is
              time-critical, please say so in the subject line.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
