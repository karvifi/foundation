import { NextRequest, NextResponse } from "next/server";

const DEMO_USERS = [
  { email: "admin@omnios.app", password: "omnios123", role: "admin",  name: "Admin User" },
  { email: "demo@omnios.app",  password: "demo1234",  role: "member", name: "Demo User"  },
];

function makeJwt(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
  const body   = Buffer.from(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 * 7,
  })).toString("base64url");
  return `${header}.${body}.local`;
}

export async function POST(req: NextRequest) {
  const body = await req.json() as { email?: string; password?: string };
  const email    = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  const user = DEMO_USERS.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = makeJwt({
    sub:         user.email,
    name:        user.name,
    role:        user.role,
    orgId:       "org_omnios_demo",
    workspaceId: "ws_omnios_demo",
  });

  return NextResponse.json({ accessToken: token });
}
