export default function Home() {
  return (
    <main>
      {/* ===== HERO (100vh) ===== */}
      <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
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
          <div className="mb-10">
            <svg
              viewBox="0 0 480 120"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[420px] max-w-[90vw] mx-auto"
            >
              <text
                x="20"
                y="92"
                fontFamily="'Playfair Display',serif"
                fontSize="96"
                fontWeight="700"
                fill="#F1F5F9"
                letterSpacing="-2"
              >
                S
              </text>
              <text
                x="78"
                y="92"
                fontFamily="'Playfair Display',serif"
                fontSize="96"
                fontWeight="700"
                fill="#F1F5F9"
                letterSpacing="-2"
              >
                P
              </text>
              <text
                x="148"
                y="92"
                fontFamily="'Playfair Display',serif"
                fontSize="96"
                fontWeight="700"
                fill="#F1F5F9"
                letterSpacing="-2"
              >
                E
              </text>
              <text
                x="212"
                y="92"
                fontFamily="'Playfair Display',serif"
                fontSize="96"
                fontWeight="700"
                fill="#F1F5F9"
                letterSpacing="-2"
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
            SPEAQ Freely.
          </p>

          {/* Subtitle */}
          <p className="font-[family-name:var(--font-playfair)] text-lg md:text-[22px] text-text-secondary italic max-w-[600px] mx-auto mt-6 leading-relaxed">
            The right to be heard, protected by technology no one can break.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <a
              href="#download"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-voice-gold text-bg-deep font-medium text-sm tracking-wide transition-all hover:brightness-110"
            >
              Download App
            </a>
            <a
              href="#download"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-text-muted/30 text-text-primary font-medium text-sm tracking-wide transition-all hover:border-voice-gold/50 hover:text-voice-gold"
            >
              Open Web App
            </a>
          </div>

          {/* Bottom stats */}
          <div className="mt-16 flex items-center justify-center gap-6 text-text-muted text-xs font-[family-name:var(--font-jetbrains)] tracking-wider">
            <span>9 Languages</span>
            <span className="w-px h-3 bg-text-muted/30" />
            <span>Quantum Encrypted</span>
            <span className="w-px h-3 bg-text-muted/30" />
            <span>Zero Knowledge</span>
          </div>
        </div>
      </section>

      {/* ===== FEATURES (6 cards) ===== */}
      <section className="py-24 md:py-32 bg-bg-surface" id="features">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12">
          <span className="section-label block mb-3">01 - Features</span>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-medium tracking-tight leading-tight mb-4">
            Everything you need.<br />
            Nothing they can read.
          </h2>
          <p className="text-text-secondary text-[17px] max-w-[640px] leading-relaxed mb-16">
            The most secure communication and freedom platform in the world. No
            government, no corporation, no one can read your messages.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Quantum Chat */}
            <div className="relative bg-bg-card border border-[rgba(100,116,139,0.15)] rounded-2xl p-8 card-animate card-hover">
              <div className="absolute top-0 left-0 w-1 h-full bg-voice-gold rounded-l-2xl" />
              <div className="w-10 h-10 mb-5 text-voice-gold">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl font-medium mb-2">
                Quantum Chat
              </h3>
              <p className="text-text-secondary text-[15px] leading-relaxed">
                End-to-end encrypted messaging with quantum-resistant
                cryptography. Your words, your eyes only.
              </p>
            </div>

            {/* Card 2: Quantum Call */}
            <div className="relative bg-bg-card border border-[rgba(100,116,139,0.15)] rounded-2xl p-8 card-animate card-hover">
              <div className="absolute top-0 left-0 w-1 h-full bg-voice-gold rounded-l-2xl" />
              <div className="w-10 h-10 mb-5 text-voice-gold">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl font-medium mb-2">
                Quantum Call
              </h3>
              <p className="text-text-secondary text-[15px] leading-relaxed">
                Voice and video calls, fully peer-to-peer. No server ever hears
                your conversation.
              </p>
            </div>

            {/* Card 3: Quantum Pay */}
            <div className="relative bg-bg-card border border-[rgba(100,116,139,0.15)] rounded-2xl p-8 card-animate card-hover">
              <div className="absolute top-0 left-0 w-1 h-full bg-voice-gold rounded-l-2xl" />
              <div className="w-10 h-10 mb-5 text-voice-gold">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v12M15 9.5c0-1.38-1.34-2.5-3-2.5s-3 1.12-3 2.5 1.34 2.5 3 2.5 3 1.12 3 2.5-1.34 2.5-3 2.5" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl font-medium mb-2">
                Quantum Pay
              </h3>
              <p className="text-text-secondary text-[15px] leading-relaxed">
                Q-Credits backed by gold. Send value instantly, zero fees between
                users worldwide.
              </p>
            </div>

            {/* Card 4: Quantum Vault */}
            <div className="relative bg-bg-card border border-[rgba(100,116,139,0.15)] rounded-2xl p-8 card-animate card-hover">
              <div className="absolute top-0 left-0 w-1 h-full bg-quantum-teal rounded-l-2xl" />
              <div className="w-10 h-10 mb-5 text-quantum-teal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl font-medium mb-2">
                Quantum Vault
              </h3>
              <p className="text-text-secondary text-[15px] leading-relaxed">
                Plausible deniability. Hidden vaults within vaults. Even under
                pressure, your secrets stay hidden.
              </p>
            </div>

            {/* Card 5: Witness Mode */}
            <div className="relative bg-bg-card border border-[rgba(100,116,139,0.15)] rounded-2xl p-8 card-animate card-hover">
              <div className="absolute top-0 left-0 w-1 h-full bg-quantum-teal rounded-l-2xl" />
              <div className="w-10 h-10 mb-5 text-quantum-teal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl font-medium mb-2">
                Witness Mode
              </h3>
              <p className="text-text-secondary text-[15px] leading-relaxed">
                Tamper-proof evidence collection. Record, timestamp, and
                cryptographically seal what matters.
              </p>
            </div>

            {/* Card 6: Mine & Earn */}
            <div className="relative bg-bg-card border border-[rgba(100,116,139,0.15)] rounded-2xl p-8 card-animate card-hover">
              <div className="absolute top-0 left-0 w-1 h-full bg-quantum-teal rounded-l-2xl" />
              <div className="w-10 h-10 mb-5 text-quantum-teal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl font-medium mb-2">
                Mine & Earn
              </h3>
              <p className="text-text-secondary text-[15px] leading-relaxed">
                Proof of Contribution mining. Earn 2-5 QC per day by helping the
                network grow stronger.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECURITY ===== */}
      <section className="py-24 md:py-32" id="security">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12">
          <span className="section-label block mb-3">02 - Security</span>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-medium tracking-tight leading-tight mb-4">
            6 layers of protection
          </h2>
          <p className="text-text-secondary text-[17px] max-w-[640px] leading-relaxed mb-16">
            Quantum-resistant encryption protects everything you send, store, and
            earn.
          </p>

          <div className="space-y-0">
            {[
              {
                layer: "6",
                name: "Random",
                tech: "QRNG",
                desc: "Quantum random number generation. True randomness from quantum noise, not algorithms.",
                color: "text-voice-gold",
              },
              {
                layer: "5",
                name: "Key Exchange",
                tech: "Kyber-768",
                desc: "Lattice-based key encapsulation. Post-quantum secure against both classical and quantum computers.",
                color: "text-voice-warm",
              },
              {
                layer: "4",
                name: "Signing",
                tech: "HMAC-SHA256",
                desc: "Digital signatures verify message integrity and authenticity. Nothing tampered, nothing forged.",
                color: "text-voice-light",
              },
              {
                layer: "3",
                name: "Encryption",
                tech: "AES-256 + Double Ratchet",
                desc: "Military-grade encryption with forward secrecy. Each message has its own key.",
                color: "text-quantum-teal",
              },
              {
                layer: "2",
                name: "Privacy",
                tech: "Sealed Sender",
                desc: "Zero-knowledge relay. The server cannot see who is talking to whom.",
                color: "text-quantum-teal",
              },
              {
                layer: "1",
                name: "Transport",
                tech: "Obfuscation + Mesh",
                desc: "Traffic obfuscation, meek bridges, and mesh networking. Invisible to censors.",
                color: "text-quantum-dark",
              },
            ].map((item) => (
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
                      {item.name}
                    </p>
                    <p className="font-[family-name:var(--font-jetbrains)] text-xs text-text-muted">
                      {item.tech}
                    </p>
                  </div>
                </div>
                <p className="text-text-secondary text-[15px] leading-relaxed self-center">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ZERO KNOWLEDGE ===== */}
      <section className="py-24 md:py-32 bg-bg-surface relative overflow-hidden">
        {/* Teal glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(45,212,191,0.06) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-12">
          <span className="section-label block mb-3">03 - Zero Knowledge</span>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-medium tracking-tight leading-tight mb-4">
            What SPEAQ knows about you
          </h2>

          <p className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl font-medium text-voice-gold mt-12 mb-12">
            Nothing.
          </p>

          <div className="space-y-4 text-text-secondary text-lg leading-relaxed max-w-xl">
            <p>No email. No phone number. No real name.</p>
            <p>No message content. No call records.</p>
            <p>No wallet balances. No browsing history.</p>
            <p className="text-text-primary font-medium pt-4">
              Everything stays on your device.
            </p>
            <p className="text-text-muted">
              The server sees only encrypted noise.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Q-CREDITS ===== */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12">
          <span className="section-label block mb-3">04 - Q-Credits</span>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-medium tracking-tight leading-tight mb-4">
            A currency backed by gold,<br />
            not by governments.
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
                    Max Supply
                  </p>
                  <p className="font-[family-name:var(--font-playfair)] text-2xl font-medium">
                    21,000,000 QC
                  </p>
                  <p className="text-text-muted text-sm mt-1">
                    Fixed forever
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
                    Smallest unit
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-lg font-medium mb-2">
                    Mine by Contributing
                  </h3>
                  <p className="text-text-secondary text-[15px] leading-relaxed">
                    Earn 2-5 QC/day by helping the network. Relay messages, share
                    bandwidth, verify transactions.
                  </p>
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-lg font-medium mb-2">
                    Send Instantly
                  </h3>
                  <p className="text-text-secondary text-[15px] leading-relaxed">
                    Zero fees between users worldwide. No banks, no borders, no
                    delays.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DOWNLOAD ===== */}
      <section className="py-24 md:py-32 bg-bg-surface" id="download">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12">
          <span className="section-label block mb-3">05 - Get SPEAQ</span>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-medium tracking-tight leading-tight mb-16">
            Download or open in browser
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* iOS */}
            <div className="bg-bg-card border border-[rgba(100,116,139,0.15)] rounded-2xl p-8 text-center transition-all hover:border-voice-gold/30">
              <div className="w-12 h-12 mx-auto mb-5 text-text-primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
                  <path d="M16.5 7.5C15.5 6.5 14 6 12.5 6c-2.5 0-4.5 2-4.5 5s1.5 5 4 5c1.5 0 2.5-.5 3-1" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl font-medium mb-2">
                iOS
              </h3>
              <p className="text-text-muted text-sm mb-6">
                App Store
              </p>
              <span className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-voice-gold text-bg-deep font-medium text-sm">
                Coming Soon
              </span>
            </div>

            {/* Android */}
            <div className="bg-bg-card border border-[rgba(100,116,139,0.15)] rounded-2xl p-8 text-center transition-all hover:border-voice-gold/30">
              <div className="w-12 h-12 mx-auto mb-5 text-text-primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 16V8a7 7 0 0 1 14 0v8" />
                  <path d="M3 16h18v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2z" />
                  <path d="M8 2l2 3M16 2l-2 3" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl font-medium mb-2">
                Android
              </h3>
              <p className="text-text-muted text-sm mb-6">
                Play Store & direct APK
              </p>
              <span className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-voice-gold text-bg-deep font-medium text-sm">
                Coming Soon
              </span>
            </div>

            {/* Web App */}
            <div className="bg-bg-card border border-[rgba(100,116,139,0.15)] rounded-2xl p-8 text-center transition-all hover:border-voice-gold/30">
              <div className="w-12 h-12 mx-auto mb-5 text-text-primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl font-medium mb-2">
                Web App
              </h3>
              <p className="text-text-muted text-sm mb-6">
                PWA - works on any device
              </p>
              <span className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-voice-gold text-bg-deep font-medium text-sm">
                Coming Soon
              </span>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-text-muted text-sm">
              <span className="font-[family-name:var(--font-jetbrains)]">PWA:</span>{" "}
              Open thespeaq.com on your phone and tap &quot;Add to Home Screen&quot;
            </p>
          </div>
        </div>
      </section>

      {/* ===== LANGUAGES ===== */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 text-center">
          <span className="section-label block mb-3">06 - Languages</span>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-medium tracking-tight leading-tight mb-16">
            Available in 9 languages
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { code: "EN", name: "English" },
              { code: "NL", name: "Nederlands" },
              { code: "FR", name: "Francais" },
              { code: "ES", name: "Espanol" },
              { code: "RU", name: "Russkij" },
              { code: "DE", name: "Deutsch" },
              { code: "SL", name: "Slovenscina" },
              { code: "LG", name: "Oluganda" },
              { code: "SW", name: "Kiswahili" },
            ].map((lang) => (
              <button
                key={lang.code}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-bg-card border border-[rgba(100,116,139,0.15)] text-text-primary text-sm transition-all hover:border-voice-gold/30 hover:text-voice-gold"
              >
                <span className="font-[family-name:var(--font-jetbrains)] text-xs text-text-muted">
                  {lang.code}
                </span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-16 border-t border-[rgba(100,116,139,0.15)]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 text-center">
          <p className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-2">
            SPEA<span className="text-voice-gold">Q</span> Freely.
          </p>
          <p className="text-text-muted text-sm mb-8">thespeaq.com</p>

          <div className="flex items-center justify-center gap-6 text-sm text-text-muted mb-8">
            <a
              href="/privacy"
              className="hover:text-voice-gold transition-colors"
            >
              Privacy Policy
            </a>
          </div>

          <p className="text-text-muted text-xs mb-1">
            Built by Plexaris Technology Consulting
          </p>
          <p className="text-text-muted text-xs">The Netherlands</p>
          <p className="text-text-muted text-xs mt-4">
            &copy; 2026 SPEAQ. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
