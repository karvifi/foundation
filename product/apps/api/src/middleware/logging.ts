import type { MiddlewareHandler } from "hono";
import { randomUUID } from "node:crypto";

export const loggingMiddleware: MiddlewareHandler = async (c, next) => {
  const start = Date.now();
  const requestId = randomUUID();
  c.header("X-Request-Id", requestId);

  await next();

  const entry = {
    requestId,
    method: c.req.method,
    path: c.req.path,
    status: c.res.status,
    durationMs: Date.now() - start,
    orgId: c.get("auth")?.orgId,
  };

  try {
    const { default: pino } = await import("pino");
    pino().info(entry);
  } catch {
    console.info(JSON.stringify(entry));
  }
};
