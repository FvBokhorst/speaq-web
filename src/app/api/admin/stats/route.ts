import { NextRequest, NextResponse } from "next/server";

const RELAY_URL = process.env.SPEAQ_RELAY_URL || "http://localhost:3001";

export async function GET(request: NextRequest) {
  const pin = request.nextUrl.searchParams.get("pin");
  if (!pin) {
    return NextResponse.json({ error: "PIN required" }, { status: 401 });
  }

  try {
    const res = await fetch(`${RELAY_URL}/api/v1/admin/stats?pin=${encodeURIComponent(pin)}`, {
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    return NextResponse.json({ error: "Relay server unreachable" }, { status: 502 });
  }
}
