"use client";

import { useState } from "react";
import ThemeToggle from "../components/ThemeToggle";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  title: string;
  items: FaqItem[];
}

const faqData: FaqCategory[] = [
  {
    title: "Platform",
    items: [
      {
        question: "What is SPEAQ?",
        answer:
          "SPEAQ is the most secure communication and freedom platform in the world. It combines quantum-resistant encryption, censorship resistance, private payments, decentralized mining, and sovereign identity in one app. Chat, call, pay, browse, store, mine -- all protected by military-grade encryption that even quantum computers cannot break.",
      },
      {
        question: "Why was SPEAQ created?",
        answer:
          "SPEAQ was created because the world needs a communication platform that truly belongs to its users. Existing platforms collect your data, scan your messages, comply with government surveillance requests, and can freeze your accounts at will. SPEAQ was built from the ground up with zero-knowledge architecture -- we cannot read your messages, even if we wanted to. Your freedom is not a feature. It is the foundation.",
      },
      {
        question:
          "How is SPEAQ different from WhatsApp, Signal, or Telegram?",
        answer:
          "WhatsApp is owned by Meta and collects extensive metadata. Telegram does not encrypt group chats by default. Signal is good but still requires a phone number and has no built-in payments or mining. SPEAQ requires no phone number, no email, no real name. It adds a sovereign wallet with gold-backed Q-Credits, Proof of Contribution mining, a Quantum Vault with plausible deniability, Ghost Groups, Witness Mode, Dead Man's Switch, and mesh networking. SPEAQ is not just a messenger -- it is a freedom platform.",
      },
      {
        question: "Do I need to register with my phone number or email?",
        answer:
          "No. SPEAQ generates a cryptographically random SPEAQ ID on your device. It is not linked to your phone number, email, or real name. No one can trace your SPEAQ ID back to you unless you choose to share it. This is true anonymous communication.",
      },
      {
        question: "Is SPEAQ free?",
        answer:
          "Yes. SPEAQ is free to download and use. All core features -- messaging, voice and video calls, file sharing, Quantum Vault, Ghost Groups, Witness Mode, and Dead Man's Switch -- are free. You can also earn Q-Credits through Proof of Contribution mining at no cost.",
      },
    ],
  },
  {
    title: "Security & Privacy",
    items: [
      {
        question: "How secure is SPEAQ?",
        answer:
          "SPEAQ uses 9 layers of security, including AES-256 encryption, the Double Ratchet protocol for forward secrecy, Kyber-768 post-quantum key exchange, sealed sender relay, and quantum random number generation. Every message, call, file, and payment is encrypted before it leaves your device. The relay server sees only encrypted blobs -- it cannot read content, identify communicating parties, or determine what is being sent.",
      },
      {
        question: "What encryption does SPEAQ use?",
        answer:
          "SPEAQ uses AES-256 for message encryption (the same standard used by military and intelligence agencies), the Double Ratchet protocol for forward secrecy (every message has a unique key), Kyber-768 for post-quantum key exchange (NIST-approved lattice-based KEM), ML-DSA-65 (FIPS 204) for wallet transaction signing, SPHINCS+ (FIPS 205) for blockchain block signing, SHA-256 for hashing, and HMAC-SHA256 for message authentication.",
      },
      {
        question:
          "What is quantum-resistant encryption and why does it matter?",
        answer:
          "Quantum computers will eventually be able to break the encryption used by most apps today (RSA, ECC). This means messages encrypted today could be stored and decrypted in the future -- a strategy known as 'harvest now, decrypt later.' SPEAQ uses NIST-approved post-quantum algorithms (Kyber-768, ML-DSA-65, SPHINCS+) that are designed to resist attacks from both classical and quantum computers. Your messages are safe today and in the future.",
      },
      {
        question: "Can anyone read my messages -- even SPEAQ itself?",
        answer:
          "No. SPEAQ uses end-to-end encryption with zero-knowledge architecture. Messages are encrypted on your device before they are sent and can only be decrypted by the intended recipient. The relay server processes only encrypted blobs. We have no keys, no backdoors, and no ability to read your messages. This is a technical guarantee, not a policy promise.",
      },
      {
        question: "What is zero-knowledge architecture?",
        answer:
          "Zero-knowledge means the server operates without knowing anything about the data it processes. The SPEAQ relay server facilitates message delivery without knowing who is communicating with whom, what is being said, or what files are being shared. It sees only encrypted data that it cannot decrypt. Even if the server were compromised, an attacker would find nothing useful.",
      },
      {
        question: "What is a Sealed Sender?",
        answer:
          "Sealed Sender means that even the relay server does not know who sent a message. The sender's identity is encrypted inside the message envelope. The server can deliver the message to the recipient but cannot see who it came from. This prevents metadata analysis and traffic correlation attacks.",
      },
      {
        question: "What happens if I lose my phone?",
        answer:
          "All your data is stored locally on your device. If you lose your phone and have not created an encrypted backup, your data is gone permanently. We recommend using the encrypted backup feature to protect against device loss. Your backup is encrypted with your personal key -- we cannot access it.",
      },
      {
        question: "Can governments access my data?",
        answer:
          "No. Because of our zero-knowledge architecture, we have nothing to provide in response to legal requests. We cannot decrypt your messages. We do not know who you communicate with. We do not store your data on our servers. We will comply with valid legal processes, but the technical reality is that we have nothing useful to hand over.",
      },
      {
        question: "What are the security layers in SPEAQ?",
        answer:
          "SPEAQ has 9 layers of security:\n\n1. Obfuscation + Mesh -- Traffic analysis resistance through mesh networking and data obfuscation\n2. Sealed Sender -- Server cannot see who sent a message\n3. AES-256 + Double Ratchet -- Military-grade encryption with forward secrecy for every message\n4. HMAC-SHA256 -- Message authentication to prevent tampering\n5. Kyber-768 -- Post-quantum key exchange resistant to quantum computers\n6. QRNG -- Quantum random number generation for true randomness\n7. ML-DSA-65 (FIPS 204) -- Quantum-resistant digital signatures for wallet transactions\n8. SPHINCS+ (FIPS 205) -- Hash-based signatures for blockchain block signing\n9. Plausible Deniability -- Hidden vault layer with no technical proof of existence",
      },
    ],
  },
  {
    title: "Wallet & Q-Credits",
    items: [
      {
        question: "What are Q-Credits?",
        answer:
          "Q-Credits (QC) are SPEAQ's internal currency, pegged to gold: 1 QC = 0.01 gram of gold. This means the value of your Q-Credits is tied to real, physical gold -- not to any government currency that can be printed or inflated. Maximum supply: 21,000,000 QC, fixed forever. Total gold backing: 210 kg.",
      },
      {
        question: "Why are Q-Credits backed by gold?",
        answer:
          "Gold has been a store of value for thousands of years. By pegging Q-Credits to gold, we protect users from inflation and currency manipulation. The gold peg is a floor, not a ceiling -- if demand for QC exceeds supply, the price can rise above the gold peg. Early adopters benefit most from this scarcity-driven appreciation.",
      },
      {
        question: "How many Q-Credits will ever exist?",
        answer:
          "Maximum supply is 21,000,000 QC, enforced by code, not by policy. This is fixed forever, like Bitcoin. The smallest unit is 1 Spark = 0.00000001 QC (like Bitcoin's satoshi). If adoption grows, people simply use smaller units. The system scales infinitely.",
      },
      {
        question: "What is a Sovereign Wallet?",
        answer:
          "Your SPEAQ wallet is sovereign -- it operates entirely on your device. Your private keys are generated locally and never leave your device. Not even SPEAQ can access them. No intermediary, no central authority, no backdoor. You have full control over your Q-Credits. No one can freeze, confiscate, or block your funds.",
      },
      {
        question: "What is ML-DSA-65 (FIPS 204)?",
        answer:
          "ML-DSA-65 is a NIST-approved post-quantum digital signature algorithm (FIPS 204). SPEAQ generates an ML-DSA-65 signing keypair on your device when you first open the wallet. This keypair is your sovereign on-chain identity. When you send Q-Credits, the transaction is signed with your personal quantum-resistant key and verified by the blockchain network. Even quantum computers cannot forge your signature.",
      },
      {
        question: "Can I send Q-Credits to other people?",
        answer:
          "Yes. You can send Q-Credits to any SPEAQ user by entering their SPEAQ ID. Transactions are peer-to-peer, signed with your ML-DSA-65 private key, and verified by the blockchain network. No bank, no intermediary, no approval needed. Transactions are typically confirmed within 30 seconds.",
      },
      {
        question: "How do on-chain transactions work?",
        answer:
          "When you send Q-Credits, your wallet creates a transaction signed with your ML-DSA-65 private key. This transaction is broadcast to the SPEAQ Chain network where validators verify the signature and check your balance. Once included in a block (every 30 seconds), the transaction is final and immutable. The entire process is quantum-resistant.",
      },
    ],
  },
  {
    title: "Mining",
    items: [
      {
        question: "What is Proof of Contribution?",
        answer:
          "Proof of Contribution is SPEAQ's mining mechanism. Instead of wasting electricity solving mathematical puzzles (like Bitcoin), you earn Q-Credits by contributing useful work to the network: relaying messages, validating transactions, storing encrypted data, translating the app, onboarding new users, and more.",
      },
      {
        question: "How is this different from Bitcoin mining?",
        answer:
          "Bitcoin mining requires expensive hardware and enormous amounts of electricity to solve meaningless mathematical puzzles. SPEAQ mining runs on your phone and rewards you for doing useful work that strengthens the network. No special hardware needed. No electricity wasted. Your contribution has real value.",
      },
      {
        question: "How much can I earn?",
        answer:
          "Current mining rewards are approximately 0.02 to 0.05 QC per day (equivalent to 0.02 to 0.05 grams of gold). In many countries, this represents significant income. Early miners earn more before halving events reduce rewards. The earlier you start, the more you accumulate.",
      },
      {
        question: "What are the 7 ways to mine?",
        answer:
          "1. Relay Mining -- relay encrypted messages through the network\n2. Mesh Mining -- act as a Bluetooth/WiFi mesh node for offline connectivity\n3. Bridge Mining -- serve as a cash-to-QC exchange agent in your community\n4. Validation Mining -- validate transaction proofs on the blockchain\n5. Storage Mining -- store encrypted data fragments for the network\n6. Translation Mining -- translate the app into new languages\n7. Onboarding Mining -- bring new active users to the network",
      },
      {
        question: "What is halving?",
        answer:
          "Every 2,100,000 QC mined by the network, mining rewards are cut in half. This creates increasing scarcity and protects the value of existing Q-Credits. The system supports approximately 960 miners initially, decreasing with each halving. Total mining timeline: 40+ years before all 21 million QC are mined. Early miners earn the most.",
      },
      {
        question: "What is C+ signed mining?",
        answer:
          "Before the SPEAQ Chain blockchain launches, all mining happens locally on your device. Every mining reward is double-signed: (1) you sign with your private key, proving your identity, and (2) the relay server co-signs as a witness, proving the work actually happened. Both signatures are stored in your mining ledger. When the blockchain launches, only entries with both signatures are accepted. This makes fraud impossible -- you cannot fake the relay's signature, and the relay only signs when you actually contribute.",
      },
    ],
  },
  {
    title: "Blockchain",
    items: [
      {
        question: "Does SPEAQ have its own blockchain?",
        answer:
          "Yes. SPEAQ has its own quantum-resistant blockchain called SPEAQ Chain. It is purpose-built for secure communication and sovereign finance. Blocks are produced every 30 seconds by validators selected through Proof of Contribution. Each block is dual-signed with ML-DSA-65 (FIPS 204) and SPHINCS+ (FIPS 205) for maximum quantum resistance.",
      },
      {
        question:
          "Why build a new blockchain instead of using Ethereum or Bitcoin?",
        answer:
          "Existing blockchains are not quantum-resistant. Their signature schemes (ECDSA, EdDSA) will be broken by quantum computers. SPEAQ Chain uses NIST-approved post-quantum cryptography from the ground up. It is also optimized for SPEAQ's specific needs: fast block times (30 seconds), Proof of Contribution consensus, and integration with the SPEAQ messaging protocol. Building on someone else's chain would compromise both security and sovereignty.",
      },
      {
        question: "How are blocks produced?",
        answer:
          "Blocks are produced every 30 seconds by validators selected through Proof of Contribution. Each block is dual-signed with ML-DSA-65 (FIPS 204) for transaction-level signatures and SPHINCS+ (FIPS 205) for block-level signatures. This dual-signature approach provides defense in depth -- even if one algorithm is compromised, the other remains secure.",
      },
      {
        question: "How does validator selection work?",
        answer:
          "Validators are selected based on their Proof of Contribution score, which reflects their ongoing useful work for the network (relaying messages, storing data, validating transactions). This is not Proof of Stake where the richest get richer -- it rewards actual contribution. Validators rotate to prevent centralization.",
      },
      {
        question: "What is finality?",
        answer:
          "Finality means a transaction cannot be reversed once confirmed. On SPEAQ Chain, transactions achieve finality when included in a block (every 30 seconds). Once finalized, a transaction is permanently recorded on the blockchain and cannot be altered, reversed, or censored by anyone -- including SPEAQ itself.",
      },
    ],
  },
  {
    title: "Features",
    items: [
      {
        question: "What are Ghost Groups?",
        answer:
          "Ghost Groups are invisible group chats. Members cannot see who else is in the group. The server has no record of the group existing. Messages are sent individually to each member through separate encrypted channels. This protects activists, journalists, and anyone who needs to communicate without a visible group structure. There is no group metadata to subpoena.",
      },
      {
        question: "What is Witness Mode?",
        answer:
          "Witness Mode creates tamper-proof evidence. When you record something in Witness Mode, it is timestamped and hashed with SHA-256. The hash cryptographically proves that the content existed at that exact moment and has not been modified since. Use this for documenting human rights violations, corruption, police misconduct, or any situation where evidence must be preserved and verified.",
      },
      {
        question: "What is the Dead Man's Switch?",
        answer:
          "If you do not check in within your set interval, a pre-configured message is automatically sent to your chosen contacts. This protects journalists, activists, and whistleblowers. If something happens to you, your emergency contacts will be notified automatically. The switch is entirely configurable -- you set the interval, the message, and the recipients.",
      },
      {
        question: "What is the Quantum Vault?",
        answer:
          "The Quantum Vault stores your sensitive files (photos, documents, notes) with encryption on your device. It has two layers: a visible layer accessible with your normal PIN, and a hidden layer accessible only with a separate secret PIN. If someone forces you to open your phone, the hidden layer is completely invisible -- there is no technical proof it exists. This is called plausible deniability.",
      },
      {
        question: "Does SPEAQ work without internet?",
        answer:
          "Yes. SPEAQ includes mesh networking capability. When internet is unavailable, SPEAQ can relay messages through nearby devices using Bluetooth and WiFi Direct, creating a local mesh network. This is critical in areas with censored or disrupted internet, during natural disasters, or in remote locations. Messages hop from device to device until they reach the internet or the recipient directly.",
      },
    ],
  },
  {
    title: "Technical",
    items: [
      {
        question: "What NIST certifications does SPEAQ use?",
        answer:
          "SPEAQ implements multiple NIST-approved post-quantum cryptographic standards: Kyber-768 (FIPS 203) for key encapsulation, ML-DSA-65 (FIPS 204) for digital signatures on wallet transactions, and SPHINCS+ (FIPS 205) for hash-based signatures on blockchain blocks. These are the same standards recommended for protecting classified government communications.",
      },
      {
        question: "Has the protocol been formally verified?",
        answer:
          "The SPEAQ protocol is designed based on formally verified cryptographic primitives (AES-256, SHA-256, Double Ratchet) and NIST-standardized post-quantum algorithms. The complete protocol specification will be published for independent security audit and formal verification. We believe in security through transparency, not obscurity.",
      },
      {
        question: "Is SPEAQ open source?",
        answer:
          "The SPEAQ cryptographic protocol specification will be published openly for security review. The client applications are planned to be open-sourced after the initial launch period to allow independent verification of our security claims. We believe users should be able to verify, not just trust.",
      },
      {
        question: "What is the SPEAQ Chain?",
        answer:
          "SPEAQ Chain is SPEAQ's purpose-built quantum-resistant blockchain. It tracks Q-Credit balances, processes transactions, and ensures no one can create money from nothing. Maximum supply: 21,000,000 QC, enforced by code. Blocks every 30 seconds. Dual-signed with ML-DSA-65 and SPHINCS+. Validators selected by Proof of Contribution, not by wealth. It is the financial backbone of the SPEAQ freedom platform.",
      },
    ],
  },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function FaqPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  function toggle(key: string) {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  return (
    <main className="min-h-screen py-24 md:py-32">
      {/* Header with ThemeToggle */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-bg-deep/80 backdrop-blur-md border-b border-[rgba(100,116,139,0.1)]">
        <div className="max-w-[760px] mx-auto px-6 h-14 flex items-center justify-between">
          <a
            href="/"
            className="font-[family-name:var(--font-playfair)] text-lg font-medium text-text-primary hover:text-voice-gold transition-colors"
          >
            SPEA<span className="text-voice-gold">Q</span>
          </a>
          <ThemeToggle />
        </div>
      </div>

      <div className="max-w-[760px] mx-auto px-6 md:px-12">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-text-muted text-sm mb-12 hover:text-voice-gold transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to SPEAQ
        </a>

        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-medium tracking-tight leading-tight mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-text-muted text-sm font-[family-name:var(--font-jetbrains)] mb-16">
          Everything you need to know about SPEAQ
        </p>

        <div className="space-y-12">
          {faqData.map((category) => (
            <section key={category.title}>
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-6">
                {category.title}
              </h2>
              <div className="space-y-0 border-t border-[rgba(100,116,139,0.15)]">
                {category.items.map((item) => {
                  const key = `${category.title}-${item.question}`;
                  const isOpen = openItems.has(key);
                  return (
                    <div
                      key={key}
                      className="border-b border-[rgba(100,116,139,0.15)]"
                    >
                      <button
                        onClick={() => toggle(key)}
                        className="w-full flex items-center justify-between gap-4 py-5 text-left"
                      >
                        <span className="text-text-primary text-[16px] font-medium leading-snug">
                          {item.question}
                        </span>
                        <ChevronIcon open={isOpen} />
                      </button>
                      {isOpen && (
                        <div className="pb-5 pr-8">
                          <p className="text-text-secondary text-[15px] leading-relaxed whitespace-pre-line">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-20 pt-10 border-t border-[rgba(100,116,139,0.15)] text-center">
          <p className="font-[family-name:var(--font-playfair)] text-lg text-text-primary">
            SPEA<span className="text-voice-gold">Q</span> Freely.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-text-muted mt-4">
            <a href="/" className="hover:text-voice-gold transition-colors">
              Home
            </a>
            <a
              href="/privacy"
              className="hover:text-voice-gold transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="hover:text-voice-gold transition-colors"
            >
              Terms of Service
            </a>
          </div>
          <p className="text-text-muted text-xs mt-4">
            &copy; 2026 SPEAQ. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
