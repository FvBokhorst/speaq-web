import { NextResponse } from "next/server";

/**
 * Server-side proxy to the public speaq-gold-feed Cloud Run service.
 * Routing the browser's request through Next avoids CORS complexity and
 * lets us keep the oracle URL centralized here. Upstream is already cached
 * for 60s, so we ask the Next fetch to revalidate once a minute too.
 */
const UPSTREAM = "https://speaq-gold-feed-244491980730.europe-west1.run.app/v1/price";

export async function GET() {
  try {
    const res = await fetch(UPSTREAM, { next: { revalidate: 60 } });
    if (!res.ok) {
      console.error(`[gold-oracle] upstream ${res.status} from ${UPSTREAM}`);
      return NextResponse.json({ error: `upstream ${res.status}` }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[gold-oracle] fetch failed: ${message}`);
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
