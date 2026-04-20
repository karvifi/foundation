import type { MiddlewareHandler } from "hono";

type Limiter = { limit: (id: string) => Promise<{ success: boolean; remaining: number }> };

function hasRedisEnv(): boolean {
  return Boolean(process.env["UPSTASH_REDIS_REST_URL"] && process.env["UPSTASH_REDIS_REST_TOKEN"]);
}

async function buildLimiter(max: number, prefix: string): Promise<Limiter | null> {
  if (!hasRedisEnv()) return null;
  try {
    const { Ratelimit } = await import("@upstash/ratelimit");
    const { Redis } = await import("@upstash/redis");
    const redis = new Redis({
      url: process.env["UPSTASH_REDIS_REST_URL"]!,
      token: process.env["UPSTASH_REDIS_REST_TOKEN"]!,
    });
    return new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(max, "1 m"), prefix }) as Limiter;
  } catch {
    return null;
  }
}

let _global: Promise<Limiter | null> | null = null;
let _auth: Promise<Limiter | null> | null = null;

const getGlobal = () => (_global ??= buildLimiter(100, "rl:global"));
const getAuth = () => (_auth ??= buildLimiter(5, "rl:auth"));

function clientIp(c: Parameters<MiddlewareHandler>[0]): string {
  return c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export const globalRateLimit: MiddlewareHandler = async (c, next) => {
  const limiter = await getGlobal();
  if (!limiter) { await next(); return; }
  const { success, remaining } = await limiter.limit(clientIp(c));
  c.header("X-RateLimit-Remaining", String(remaining));
  if (!success) return c.json({ error: "Too many requests" }, 429);
  await next();
};

export const authRateLimit: MiddlewareHandler = async (c, next) => {
  const limiter = await getAuth();
  if (!limiter) { await next(); return; }
  const { success } = await limiter.limit(clientIp(c));
  if (!success) return c.json({ error: "Too many requests" }, 429);
  await next();
};
