# SPEAQ Web and PWA

**Private messaging with community rewards. Source-available, privacy-first.**

This repository contains the SPEAQ website (thespeaq.com) and the SPEAQ Progressive Web App that lets users message from any browser without installing a native app.

## What is SPEAQ

SPEAQ is a next-generation messenger built on a simple principle: your conversations are yours. End-to-end encryption is the default. No logs. No servers holding your content. No data brokers. A built-in community rewards programme recognises active participation.

The PWA is a fully functional SPEAQ client: private messaging, encrypted calls, QR-based contact discovery and in-app rewards wallet, all running client-side.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Cloud Run for deployment (europe-west1)
- Cloud Build for continuous deployment
- PWA manifest + service worker
- Post-quantum cryptography primitives (ML-KEM, ML-DSA) for messaging

## Related repositories

- **SPEAQ native app (iOS / Android):** [FvBokhorst/speaq](https://github.com/FvBokhorst/speaq)

## License

SPEAQ is **source-available** under the **Polyform Noncommercial License 1.0.0**.

You can read, inspect, fork, and improve the code. You can propose changes via pull requests. You cannot sell SPEAQ, offer it as a paid service, or use it in a commercial product. See [LICENSE](./LICENSE) for full terms.

For commercial licensing inquiries, contact `legal@thespeaq.com`.

Note: this is a source-available license, not an OSI-approved open-source license. It is deliberately chosen to protect the community spirit of SPEAQ against commercial exploitation.

## Contributing

Suggestions and improvements are welcome. Please open an issue first to discuss what you would like to change. Pull requests against the `main` branch are reviewed on a best-effort basis. By contributing, you agree that your contributions are licensed under the same Polyform Noncommercial License 1.0.0.

## Privacy

SPEAQ does not collect any personal data. See the full privacy policy at [thespeaq.com/privacy](https://thespeaq.com/privacy).

## Security disclosure

If you believe you have found a security vulnerability, please report it responsibly via `security@thespeaq.com`. Do not open a public issue for suspected vulnerabilities.

---

By the people. For the people.
