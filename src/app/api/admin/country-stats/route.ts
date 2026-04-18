import { NextRequest, NextResponse } from "next/server";

const RELAY_URL = process.env.SPEAQ_RELAY_URL || "http://localhost:3001";

export async function GET(request: NextRequest) {
  const pin = request.nextUrl.searchParams.get("pin");
  if (!pin) {
    return NextResponse.json({ error: "PIN required" }, { status: 401 });
  }

  try {
    const res = await fetch(
      RELAY_URL + "/api/v1/admin/country-stats?pin=" + encodeURIComponent(pin),
      { cache: "no-store" }
    );

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data, { status: 200 });
    }

    if (res.status === 404) {
      return NextResponse.json({ countries: [], source: "relay-pending" }, { status: 200 });
    }

    return NextResponse.json({ error: "Relay error" }, { status: res.status });
  } catch {
    return NextResponse.json({ countries: [], source: "relay-unreachable" }, { status: 200 });
  }
}
