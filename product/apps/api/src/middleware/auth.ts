import type { MiddlewareHandler } from "hono";
import type { JwtPayload } from "../auth/types.js";

const SKIP_PATHS = new Set([
  "/health",
  "/auth/login",
  "/auth/refresh",
  "/auth/register",
  "/auth/.well-known/jwks.json",
]);

let _publicKey: CryptoKey | null = null;

async function getPublicKey(): Promise<CryptoKey> {
  if (_publicKey) return _publicKey;
  const pem = process.env["OMNIOS_JWT_PUBLIC_KEY"];
  if (!pem) throw new Error("OMNIOS_JWT_PUBLIC_KEY not configured");
  const b64 = pem
    .replace(/-----BEGIN PUBLIC KEY-----/, "")
    .replace(/-----END PUBLIC KEY-----/, "")
    .replace(/\s/g, "");
  const der = Uint8Array.from(atob(b64), (ch) => ch.charCodeAt(0));
  _publicKey = await crypto.subtle.importKey(
    "spki",
    der.buffer as ArrayBuffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );
  return _publicKey;
}

async function isBlocklisted(jti: string): Promise<boolean> {
  if (!process.env["UPSTASH_REDIS_REST_URL"] || !process.env["UPSTASH_REDIS_REST_TOKEN"]) return false;
  try {
    const { Redis } = await import("@upstash/redis");
    const redis = new Redis({
      url: process.env["UPSTASH_REDIS_REST_URL"]!,
      token: process.env["UPSTASH_REDIS_REST_TOKEN"]!,
    });
    return (await redis.get(`blocklist:${jti}`)) !== null;
  } catch {
    return false;
  }
}

function decodePayload(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    return JSON.parse(atob(parts[1]!.replace(/-/g, "+").replace(/_/g, "/"))) as JwtPayload;
  } catch {
    return null;
  }
}

async function verifySignature(token: string, key: CryptoKey): Promise<boolean> {
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const data = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
  const sig = Uint8Array.from(atob(parts[2]!.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
  try {
    return await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, sig, data);
  } catch {
    return false;
  }
}

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  if (SKIP_PATHS.has(c.req.path)) { await next(); return; }

  const header = c.req.header("Authorization");
  if (!header?.startsWith("Bearer ")) return c.json({ error: "Unauthorized" }, 401);

  const token = header.slice(7);
  let key: CryptoKey;
  try {
    key = await getPublicKey();
  } catch {
    return c.json({ error: "Service misconfigured" }, 500);
  }

  if (!(await verifySignature(token, key))) return c.json({ error: "Unauthorized" }, 401);

  const payload = decodePayload(token);
  if (!payload?.sub || !payload.orgId || !payload.workspaceId || !payload.jti) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  if (Math.floor(Date.now() / 1000) > payload.exp) return c.json({ error: "Token expired" }, 401);
  if (await isBlocklisted(payload.jti)) return c.json({ error: "Unauthorized" }, 401);

  c.set("auth", {
    userId: payload.sub,
    orgId: payload.orgId,
    workspaceId: payload.workspaceId,
    role: payload.role,
    jti: payload.jti,
  });

  await next();
};
