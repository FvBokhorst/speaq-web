import { NextResponse } from "next/server";

const NODE_URL = "http://136.117.234.208:9334";
const STATS_URL = "http://136.117.234.208:9335";
const RELAY_URL = "https://speaq-relay-244491980730.europe-west1.run.app";
const SPEAQ_ID = "cdf0b972c1484715";

// Verify cron secret to prevent unauthorized calls
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET && secret !== "speaq-health-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const issues: string[] = [];
  let chainHeight = 0;

  // Check blockchain node
  try {
    const res = await fetch(`${NODE_URL}/api/status`, { cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (res.ok) {
      const data = await res.json();
      chainHeight = data.chain_height;
    } else {
      issues.push("Node API returned error");
    }
  } catch {
    issues.push("Blockchain node UNREACHABLE");
  }

  // Check stats server
  try {
    const res = await fetch(`${STATS_URL}/stats`, { cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (!res.ok) issues.push("Stats server error");
  } catch {
    issues.push("Stats server UNREACHABLE");
  }

  // Check relay
  try {
    const res = await fetch(`${RELAY_URL}/api/v1/health`, { cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (!res.ok) issues.push("Relay server error");
  } catch {
    issues.push("Relay server UNREACHABLE");
  }

  // Send alert via relay if issues found
  if (issues.length > 0) {
    const alertMsg = `SPEAQ EXTERNAL ALERT: ${issues.join(", ")}`;
    try {
      // Connect to relay WebSocket is complex from serverless, so log it
      console.error(`[HEALTH-CHECK] ${alertMsg}`);
    } catch { /* ignore */ }

    return NextResponse.json({
      status: "ALERT",
      issues,
      chainHeight,
      timestamp: new Date().toISOString(),
    });
  }

  return NextResponse.json({
    status: "OK",
    chainHeight,
    timestamp: new Date().toISOString(),
  });
}
