import { NextResponse } from "next/server";

const NODE_URL = "http://134.98.141.213:9334";

export async function GET() {
  try {
    const [statusRes, balanceRes] = await Promise.all([
      fetch(`${NODE_URL}/api/status`, { cache: "no-store" }),
      fetch(`${NODE_URL}/api/wallet/balance`, { cache: "no-store" }),
    ]);
    if (!statusRes.ok || !balanceRes.ok) {
      return NextResponse.json({ error: "Node unreachable" }, { status: 502 });
    }
    const status = await statusRes.json();
    const balance = await balanceRes.json();
    return NextResponse.json({
      chain_height: status.chain_height,
      balance: balance.balance,
      balance_sparks: balance.balance_sparks,
      genesis_hash: status.genesis_hash,
      connected_peers: status.connected_peers,
      version: status.version,
    });
  } catch {
    return NextResponse.json({ error: "Node unreachable" }, { status: 502 });
  }
}
