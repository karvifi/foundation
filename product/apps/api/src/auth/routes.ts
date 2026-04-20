import { Hono } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { randomUUID, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`${key} not configured`);
  return val;
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomUUID().replace(/-/g, "");
  const hash = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${hash.toString("hex")}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hex] = stored.split(":");
  if (!salt || !hex) return false;
  const hash = (await scryptAsync(password, salt, 64)) as Buffer;
  const storedBuf = Buffer.from(hex, "hex");
  if (hash.length !== storedBuf.length) return false;
  return timingSafeEqual(hash, storedBuf);
}

let _privateKey: CryptoKey | null = null;
let _publicKeyJwk: JsonWebKey | null = null;
const _kid = "omni-1";

async function getPrivateKey(): Promise<CryptoKey> {
  if (_privateKey) return _privateKey;
  const pem = requireEnv("OMNIOS_JWT_PRIVATE_KEY");
  const b64 = pem
    .replace(/-----BEGIN (RSA )?PRIVATE KEY-----/, "")
    .replace(/-----END (RSA )?PRIVATE KEY-----/, "")
    .replace(/\s/g, "");
  const der = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  _privateKey = await crypto.subtle.importKey(
    "pkcs8",
    der.buffer as ArrayBuffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    true,
    ["sign"],
  );
  return _privateKey;
}

export async function getPublicKeyJwk(): Promise<{ jwk: JsonWebKey; kid: string }> {
  if (_publicKeyJwk) return { jwk: _publicKeyJwk, kid: _kid };
  const pem = requireEnv("OMNIOS_JWT_PUBLIC_KEY");
  const b64 = pem
    .replace(/-----BEGIN PUBLIC KEY-----/, "")
    .replace(/-----END PUBLIC KEY-----/, "")
    .replace(/\s/g, "");
  const der = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const pubKey = await crypto.subtle.importKey(
    "spki",
    der.buffer as ArrayBuffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    true,
    ["verify"],
  );
  _publicKeyJwk = await crypto.subtle.exportKey("jwk", pubKey);
  return { jwk: _publicKeyJwk, kid: _kid };
}

function b64url(buf: ArrayBuffer | Uint8Array): string {
  const arr = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  return btoa(String.fromCharCode(...arr))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

async function signJwt(payload: Record<string, unknown>, expiresInSec: number): Promise<string> {
  const key = await getPrivateKey();
  const header = { alg: "RS256", typ: "JWT", kid: _kid };
  const now = Math.floor(Date.now() / 1000);
  const claims = { ...payload, iat: now, exp: now + expiresInSec, jti: randomUUID() };
  const enc = (obj: unknown) => b64url(new TextEncoder().encode(JSON.stringify(obj)));
  const input = `${enc(header)}.${enc(claims)}`;
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(input));
  return `${input}.${b64url(sig)}`;
}

function parseJwt(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    return JSON.parse(atob(parts[1]!.replace(/-/g, "+").replace(/_/g, "/"))) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function getRedis() {
  if (!process.env["UPSTASH_REDIS_REST_URL"] || !process.env["UPSTASH_REDIS_REST_TOKEN"]) return null;
  try {
    const { Redis } = await import("@upstash/redis");
    return new Redis({
      url: process.env["UPSTASH_REDIS_REST_URL"]!,
      token: process.env["UPSTASH_REDIS_REST_TOKEN"]!,
    });
  } catch {
    return null;
  }
}

interface TokenFamily {
  userId: string;
  orgId: string;
  workspaceId: string;
  role: string;
  currentToken: string;
  revoked: boolean;
}

const REFRESH_TTL = 7 * 24 * 3600;
const ACCESS_TTL = 15 * 60;

async function createRefreshFamily(
  userId: string,
  orgId: string,
  workspaceId: string,
  role: string,
  token: string,
): Promise<string> {
  const familyId = randomUUID();
  const redis = await getRedis();
  const family: TokenFamily = { userId, orgId, workspaceId, role, currentToken: token, revoked: false };
  if (redis) await redis.setex(`rtf:${familyId}`, REFRESH_TTL, JSON.stringify(family));
  return familyId;
}

async function rotateRefreshToken(
  familyId: string,
  presented: string,
  next: string,
): Promise<{ ok: boolean; family: TokenFamily | null }> {
  const redis = await getRedis();
  if (!redis) return { ok: true, family: null };
  const raw = await redis.get<string>(`rtf:${familyId}`);
  if (!raw) return { ok: false, family: null };
  let family: TokenFamily;
  try {
    family = JSON.parse(raw) as TokenFamily;
  } catch {
    return { ok: false, family: null };
  }
  if (family.revoked) return { ok: false, family };
  if (family.currentToken !== presented) {
    const revoked = { ...family, revoked: true };
    await redis.setex(`rtf:${familyId}`, REFRESH_TTL, JSON.stringify(revoked));
    return { ok: false, family: revoked };
  }
  const updated = { ...family, currentToken: next };
  await redis.setex(`rtf:${familyId}`, REFRESH_TTL, JSON.stringify(updated));
  return { ok: true, family: updated };
}

async function revokeFamily(familyId: string): Promise<void> {
  const redis = await getRedis();
  if (!redis) return;
  const raw = await redis.get<string>(`rtf:${familyId}`);
  if (!raw) return;
  try {
    const f = JSON.parse(raw) as TokenFamily;
    await redis.setex(`rtf:${familyId}`, REFRESH_TTL, JSON.stringify({ ...f, revoked: true }));
  } catch { /* ignore */ }
}

async function blocklistJti(jti: string, ttlSec: number): Promise<void> {
  const redis = await getRedis();
  if (redis) await redis.setex(`blocklist:${jti}`, ttlSec, "1");
}

async function getDb() {
  if (!process.env["DATABASE_URL"]) return null;
  try {
    const { createDb } = await import("@sso/db");
    return await createDb();
  } catch {
    return null;
  }
}

export const authRouter = new Hono();

authRouter.get("/.well-known/jwks.json", async (c) => {
  c.header("Cache-Control", "public, max-age=3600");
  try {
    const { jwk, kid } = await getPublicKeyJwk();
    return c.json({ keys: [{ ...jwk, use: "sig", kid, alg: "RS256" }] });
  } catch {
    return c.json({ error: "JWKS unavailable" }, 503);
  }
});

authRouter.use("*", async (c, next) => {
  c.header("Cache-Control", "no-store");
  c.header("Pragma", "no-cache");
  await next();
});

authRouter.post("/register", async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }
  if (typeof body !== "object" || body === null) return c.json({ error: "Invalid body" }, 400);
  const { email, password, inviteCode, inviteToken } = body as Record<string, unknown>;
  const resolvedInvite = (typeof inviteCode === "string" ? inviteCode : typeof inviteToken === "string" ? inviteToken : "").trim();

  if (typeof email !== "string" || typeof password !== "string") {
    return c.json({ error: "email and password required" }, 400);
  }
  if (!resolvedInvite) {
    return c.json({ error: "Invite code required" }, 400);
  }

  const db = await getDb();
  if (!db) return c.json({ error: "Service unavailable" }, 503);
  const { users } = await import("@sso/db");
  const { eq } = await import("drizzle-orm");

  const inviteRows = await db.select().from(users)
    .where(eq(users.inviteToken, resolvedInvite))
    .limit(1)
    .catch(() => []);
  const invite = inviteRows[0];
  if (!invite) return c.json({ error: "Invalid invite code" }, 403);

  const orgId = invite.orgId;
  const workspaceId = `ws_${orgId}`;

  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1).catch(() => []);
  if (existing.length > 0) return c.json({ error: "Email already registered" }, 409);

  const passwordHash = await hashPassword(password);
  const [user] = await db.insert(users).values({ email, passwordHash, orgId, role: "member" }).returning();
  if (!user) return c.json({ error: "Registration failed" }, 500);

  const accessToken = await signJwt({ sub: user.id, orgId, workspaceId, role: user.role }, ACCESS_TTL);
  const refreshToken = randomUUID();
  const familyId = await createRefreshFamily(user.id, orgId, workspaceId, user.role, refreshToken);

  setCookie(c, "refresh_family", familyId, { httpOnly: true, secure: true, sameSite: "Strict", maxAge: REFRESH_TTL, path: "/auth" });
  setCookie(c, "refresh_token", refreshToken, { httpOnly: true, secure: true, sameSite: "Strict", maxAge: REFRESH_TTL, path: "/auth" });
  return c.json({ accessToken }, 201);
});

authRouter.post("/login", async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }
  if (typeof body !== "object" || body === null) return c.json({ error: "Invalid body" }, 400);
  const { email, password, workspaceId } = body as Record<string, unknown>;
  if (typeof email !== "string" || typeof password !== "string") {
    return c.json({ error: "email and password required" }, 400);
  }

  const db = await getDb();
  if (!db) return c.json({ error: "Service unavailable" }, 503);
  const { users } = await import("@sso/db");
  const { eq } = await import("drizzle-orm");

  const rows = await db.select().from(users).where(eq(users.email, email)).limit(1).catch(() => []);
  const user = rows[0];
  const ok = user
    ? await verifyPassword(password, user.passwordHash)
    : await verifyPassword("x", "dummy:dummy");
  if (!user || !ok) return c.json({ error: "Invalid credentials" }, 401);

  const ws = typeof workspaceId === "string" ? workspaceId : `ws_${user.orgId}`;
  const accessToken = await signJwt({ sub: user.id, orgId: user.orgId, workspaceId: ws, role: user.role }, ACCESS_TTL);
  const refreshToken = randomUUID();
  const familyId = await createRefreshFamily(user.id, user.orgId, ws, user.role, refreshToken);

  setCookie(c, "refresh_family", familyId, { httpOnly: true, secure: true, sameSite: "Strict", maxAge: REFRESH_TTL, path: "/auth" });
  setCookie(c, "refresh_token", refreshToken, { httpOnly: true, secure: true, sameSite: "Strict", maxAge: REFRESH_TTL, path: "/auth" });
  return c.json({ accessToken });
});

authRouter.post("/refresh", async (c) => {
  const familyId = getCookie(c, "refresh_family");
  const presented = getCookie(c, "refresh_token");
  if (!familyId || !presented) return c.json({ error: "No refresh token" }, 401);

  const next = randomUUID();
  const { ok, family } = await rotateRefreshToken(familyId, presented, next);
  if (!ok || !family) return c.json({ error: "Refresh token invalid or revoked" }, 401);

  const accessToken = await signJwt(
    { sub: family.userId, orgId: family.orgId, workspaceId: family.workspaceId, role: family.role },
    ACCESS_TTL,
  );
  setCookie(c, "refresh_token", next, { httpOnly: true, secure: true, sameSite: "Strict", maxAge: REFRESH_TTL, path: "/auth" });
  return c.json({ accessToken });
});

authRouter.post("/logout", async (c) => {
  const familyId = getCookie(c, "refresh_family");
  const authHeader = c.req.header("Authorization");

  if (familyId) await revokeFamily(familyId);

  if (authHeader?.startsWith("Bearer ")) {
    const payload = parseJwt(authHeader.slice(7));
    const jti = typeof payload?.["jti"] === "string" ? payload["jti"] : null;
    const exp = typeof payload?.["exp"] === "number" ? payload["exp"] : null;
    if (jti && exp) {
      const rem = Math.max(0, exp - Math.floor(Date.now() / 1000));
      if (rem > 0) await blocklistJti(jti, rem);
    }
  }

  deleteCookie(c, "refresh_family", { path: "/auth" });
  deleteCookie(c, "refresh_token", { path: "/auth" });
  return c.json({ ok: true });
});
