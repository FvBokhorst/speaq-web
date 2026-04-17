import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "App Terms of Use - SPEAQ",
  description: "The terms that apply to using the SPEAQ messenger app and its community rewards programme.",
};

export default function AppTermsPage() {
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
          App Terms of Use
        </h1>
        <p className="text-text-muted text-sm font-[family-name:var(--font-jetbrains)] mb-16">
          Last updated: April 17, 2026
        </p>

        <div className="space-y-10 text-text-secondary text-[16px] leading-relaxed">
          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              About these terms
            </h2>
            <p>
              These terms govern your use of the SPEAQ messenger application on
              iOS, Android and the web (thespeaq.com). If you also interact with
              the wider SPEAQ ecosystem as a developer or network participant,
              additional terms apply. Those are described separately on our{" "}
              <a href="/terms" className="text-voice-gold hover:underline">Terms of Service</a> page.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Using SPEAQ
            </h2>
            <p className="mb-4">
              SPEAQ is a private messenger. You can send messages, make voice
              and video calls, share photos, voice notes, documents and
              locations with your contacts. All content is end-to-end encrypted
              on your device before it is sent.
            </p>
            <p>
              You do not need an account, an email address or a phone number to
              use SPEAQ. You add contacts by scanning their QR code. Everything
              you share happens directly between you and the people you choose
              to talk to.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Community rewards programme
            </h2>
            <p className="mb-4">
              SPEAQ includes a built-in community rewards programme. You can
              earn credits for participating in the SPEAQ community, for example
              by inviting new users or by staying active over time. Your credit
              balance is visible in your in-app rewards wallet.
            </p>
            <p className="mb-4">
              Credits are recognition of your contribution to the community.
              They are not purchased with real money, they are not convertible
              to real money through SPEAQ, and they are not an investment
              product. Credits cannot be used to pay for SPEAQ itself, as SPEAQ
              is free to use.
            </p>
            <p>
              The credits balance lives only on your device. If you uninstall
              SPEAQ without first using the encrypted backup feature, your
              credit history will be lost.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Your responsibilities
            </h2>
            <p className="mb-4">
              You agree not to use SPEAQ to:
            </p>
            <ul className="list-none space-y-3">
              {[
                "Send content that harasses, threatens or defames others",
                "Share illegal content or plan illegal activities",
                "Impersonate another person",
                "Circumvent SPEAQ security features",
                "Abuse the rewards programme through fraudulent activity",
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
              Your privacy
            </h2>
            <p>
              SPEAQ does not collect personal data. Messages, contacts, files
              and rewards credits all live on your device. For the full
              statement, see our{" "}
              <a href="/privacy" className="text-voice-gold hover:underline">Privacy Policy</a>.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Availability and changes
            </h2>
            <p>
              We work hard to keep SPEAQ available and updated. We may release
              updates, change features or retire features in future versions.
              We will communicate significant changes in release notes.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              No warranty
            </h2>
            <p>
              SPEAQ is provided as-is. We do our best to make the app reliable
              and secure, but we cannot guarantee uninterrupted operation. To
              the extent allowed by law, SPEAQ and its makers disclaim any
              warranty beyond what is required by consumer-protection law in
              your jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-4">
              Contact
            </h2>
            <p>
              Questions about these terms: legal@thespeaq.com. Support
              questions:{" "}
              <a href="/support" className="text-voice-gold hover:underline">thespeaq.com/support</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
