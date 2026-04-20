import { NextResponse } from "next/server";

function makeJwt(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
  const body   = Buffer.from(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 * 7,
  })).toString("base64url");
  return `${header}.${body}.local`;
}

export async function POST() {
  const token = makeJwt({
    sub:         "admin@omnios.app",
    name:        "Admin User",
    role:        "admin",
    orgId:       "org_omnios_demo",
    workspaceId: "ws_omnios_demo",
  });
  return NextResponse.json({ accessToken: token });
}
