// ─────────────────────────────────────────────────────────────────────────────
// Health check handler mounted at GET /health.
//
// Called by:
//   - Fly.io's HTTP checker every 30s (see apps/api/fly.toml).
//   - Docker HEALTHCHECK via curl (see apps/api/Dockerfile).
//   - Uptime monitors, load balancers, and humans debugging outages.
//
// Keep this endpoint side-effect-free and cheap. No DB calls, no Redis pings.
// A failing dependency belongs in a dedicated /readyz probe, not here.
// ─────────────────────────────────────────────────────────────────────────────

export interface HealthStatus {
  status: "ok";
  version: string;
  timestamp: string; // ISO-8601 UTC, millisecond precision, always suffixed "Z"
  uptime: number;    // seconds since process start (float)
}

export function healthCheck(): HealthStatus {
  return {
    status: "ok",
    version: process.env["npm_package_version"] ?? "0.1.0",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
}
