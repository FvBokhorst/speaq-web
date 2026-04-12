import { NextResponse } from "next/server";

const NODE_URL = process.env.SPEAQ_NODE_URL || "http://localhost:9334";
const STATS_URL = process.env.SPEAQ_STATS_URL || "http://localhost:9335";
const INCIDENTS_URL = process.env.SPEAQ_INCIDENTS_URL || "http://localhost:9336";
const RELAY_URL = process.env.SPEAQ_RELAY_URL || "http://localhost:3001";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const issues: string[] = [];
  let chainHeight = 0;
  let nodeOk = false;
  let statsOk = false;
  let relayOk = false;
  let relayClients = 0;

  // Check blockchain node
  try {
    const res = await fetch(`${NODE_URL}/api/status`, { cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (res.ok) {
      const data = await res.json();
      chainHeight = data.chain_height;
      nodeOk = true;
    } else {
      issues.push("Node API error");
    }
  } catch {
    issues.push("Blockchain node UNREACHABLE");
  }

  // Check stats server
  try {
    const res = await fetch(`${STATS_URL}/stats`, { cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (res.ok) statsOk = true;
    else issues.push("Stats server error");
  } catch {
    issues.push("Stats server UNREACHABLE");
  }

  // Check relay
  try {
    const res = await fetch(`${RELAY_URL}/api/v1/health`, { cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (res.ok) {
      const data = await res.json();
      relayOk = true;
      relayClients = data.clients || 0;
    } else {
      issues.push("Relay server error");
    }
  } catch {
    issues.push("Relay server UNREACHABLE");
  }

  const status = issues.length > 0 ? "ALERT" : "OK";

  // Log to incidents server
  try {
    if (issues.length > 0) {
      await fetch(`${INCIDENTS_URL}/incidents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "alert",
          source: "cloud-run-external",
          services: { node: nodeOk, stats: statsOk, relay: relayOk },
          chainHeight,
          relayClients,
          issues: issues.join(", "),
        }),
        signal: AbortSignal.timeout(5000),
      });
    }
    await fetch(`${INCIDENTS_URL}/health-log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "cloud-run-external",
        node: nodeOk,
        stats: statsOk,
        relay: relayOk,
        chainHeight,
        relayClients,
        status,
        issues: issues.length > 0 ? issues.join(", ") : undefined,
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch { /* incidents server down, don't fail the check */ }

  return NextResponse.json({
    status,
    services: { node: nodeOk, stats: statsOk, relay: relayOk },
    chainHeight,
    relayClients,
    issues: issues.length > 0 ? issues : undefined,
    timestamp: new Date().toISOString(),
  });
}
