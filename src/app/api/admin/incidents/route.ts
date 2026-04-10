import { NextResponse } from "next/server";

const INCIDENTS_URL = "http://136.117.234.208:9336";

export async function GET() {
  try {
    const [incidentsRes, healthRes] = await Promise.all([
      fetch(`${INCIDENTS_URL}/incidents`, { cache: "no-store" }),
      fetch(`${INCIDENTS_URL}/health-log`, { cache: "no-store" }),
    ]);
    const incidents = incidentsRes.ok ? await incidentsRes.json() : [];
    const healthLog = healthRes.ok ? await healthRes.json() : [];
    return NextResponse.json({ incidents, healthLog });
  } catch {
    return NextResponse.json({ incidents: [], healthLog: [], error: "Incidents server unreachable" });
  }
}
