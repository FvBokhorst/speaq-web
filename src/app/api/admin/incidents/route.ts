import { NextResponse } from "next/server";

const INCIDENTS_URL = process.env.SPEAQ_INCIDENTS_URL || "http://localhost:9336";

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
