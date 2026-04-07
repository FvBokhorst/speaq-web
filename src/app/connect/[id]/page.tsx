import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Connect on SPEAQ",
  description: "Join SPEAQ - the quantum-resistant communication platform.",
};

export default async function ConnectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shortId = id.substring(0, 12);

  return (
    <main className="min-h-screen bg-bg-deep flex items-center justify-center p-6">
      <div className="max-w-sm w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-1 mb-8">
          <span className="text-3xl font-serif font-bold text-text-primary tracking-tight">SPEA</span>
          <div className="w-9 h-9 rounded-full border-2 border-voice-gold flex items-center justify-center">
            <span className="text-xl font-serif font-bold text-voice-gold">Q</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-bg-card rounded-2xl border border-[rgba(100,116,139,0.15)] p-8 mb-6">
          <div className="w-16 h-16 rounded-full bg-bg-elevated border-2 border-voice-gold flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-voice-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>

          <h1 className="text-xl font-serif font-bold text-text-primary mb-2">
            Someone wants to connect
          </h1>
          <p className="text-sm text-text-muted mb-1">SPEAQ ID</p>
          <p className="text-xs font-mono text-voice-gold mb-6">{shortId}...</p>

          <p className="text-sm text-text-secondary mb-6">
            Open SPEAQ to start a quantum-encrypted conversation. No phone number or email required.
          </p>

          {/* Open in PWA */}
          <Link
            href={`/app?connect=${id}`}
            className="block w-full py-3.5 rounded-xl bg-voice-gold text-bg-deep font-semibold text-base mb-3 hover:bg-[#E8C47A] transition-colors"
          >
            Open in SPEAQ
          </Link>

          {/* Download */}
          <Link
            href="/"
            className="block w-full py-3.5 rounded-xl border-2 border-voice-gold/30 text-voice-gold font-semibold text-sm hover:border-voice-gold/60 transition-colors"
          >
            Get SPEAQ
          </Link>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 text-quantum-teal">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span className="text-[10px] font-mono uppercase tracking-wider">Quantum Encrypted</span>
        </div>

        {/* Footer links */}
        <div className="mt-8 flex items-center justify-center gap-4 text-xs text-text-muted">
          <Link href="/privacy" className="hover:text-text-secondary transition-colors">Privacy</Link>
          <span>--</span>
          <Link href="/terms" className="hover:text-text-secondary transition-colors">Terms</Link>
        </div>
      </div>
    </main>
  );
}
