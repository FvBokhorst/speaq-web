import { NextRequest, NextResponse } from "next/server";

/**
 * Apple Guideline 1.2 - admin abuse-reports proxy.
 *
 * Authenticated via the same admin PIN flow used by other /api/admin/*
 * routes. The PIN is exchanged for the relay's ADMIN_SECRET (configured
 * via Vercel env var ADMIN_RELAY_SECRET) which gates the relay
 * endpoints under /api/v1/admin/abuse/*.
 *
 * Operations:
 *   GET  ?action=list&status=open|actioned|dismissed&pin=XXX
 *   POST { action: "ban"|"dismiss"|"defer", reportId, banReason?, pin }
 *   POST { action: "unban", speaqId, pin }
 *   POST { action: "refresh-deny-list", pin }
 */

const RELAY_URL = process.env.SPEAQ_RELAY_URL || "https://speaq-relay-244491980730.europe-west1.run.app";
const ADMIN_PIN = process.env.ADMIN_PIN || "";
const RELAY_ADMIN_SECRET = process.env.ADMIN_RELAY_SECRET || process.env.RELAY_ADMIN_SECRET || "";

function authorized(pin: string | null): boolean {
  if (!ADMIN_PIN) return false;
  if (!pin) return false;
  return pin === ADMIN_PIN;
}

export async function GET(request: NextRequest) {
  const pin = request.nextUrl.searchParams.get("pin");
  if (!authorized(pin)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!RELAY_ADMIN_SECRET) {
    return NextResponse.json({ error: "ADMIN_RELAY_SECRET not configured on server" }, { status: 500 });
  }
  const status = request.nextUrl.searchParams.get("status") || "open";
  const limit = request.nextUrl.searchParams.get("limit") || "100";
  try {
    const res = await fetch(
      `${RELAY_URL}/api/v1/admin/abuse/reports?status=${encodeURIComponent(status)}&limit=${encodeURIComponent(limit)}`,
      {
        cache: "no-store",
        headers: { "x-admin-secret": RELAY_ADMIN_SECRET },
      }
    );
    const body = await res.json();
    return NextResponse.json(body, { status: res.status });
  } catch (e) {
    return NextResponse.json({ error: "relay unreachable", message: (e as Error).message }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }
  const pin = (body.pin as string) || request.nextUrl.searchParams.get("pin");
  if (!authorized(pin)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!RELAY_ADMIN_SECRET) {
    return NextResponse.json({ error: "ADMIN_RELAY_SECRET not configured on server" }, { status: 500 });
  }
  const action = String(body.action || "");
  let path: string;
  let payload: Record<string, unknown>;
  if (action === "ban" || action === "dismiss" || action === "defer") {
    path = "/api/v1/admin/abuse/action";
    payload = {
      reportId: body.reportId,
      action,
      actionedBy: body.actionedBy || "frank",
      banReason: body.banReason,
    };
  } else if (action === "unban") {
    path = "/api/v1/admin/abuse/unban";
    payload = { speaqId: body.speaqId };
  } else if (action === "refresh-deny-list") {
    path = "/api/v1/admin/abuse/refresh-deny-list";
    payload = {};
  } else {
    return NextResponse.json({ error: "unknown action" }, { status: 400 });
  }
  try {
    const res = await fetch(`${RELAY_URL}${path}`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": RELAY_ADMIN_SECRET,
      },
      body: JSON.stringify(payload),
    });
    const out = await res.json();
    return NextResponse.json(out, { status: res.status });
  } catch (e) {
    return NextResponse.json({ error: "relay unreachable", message: (e as Error).message }, { status: 502 });
  }
}
