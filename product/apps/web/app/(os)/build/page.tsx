"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  GitBranch,
  Play,
  Pause,
  RotateCw,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Terminal,
  Settings,
  Rocket,
  Globe,
  Shield,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  GitCommit,
  User,
  Calendar,
  Zap,
  Package,
  Cloud,
  Server,
  Smartphone,
  Brain,
  FileCode,
  BookOpen,
  TrendingUp,
  Activity,
  ChevronRight,
  Search,
  Filter,
  Download,
  Bell,
  Code2,
  Layers,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────────────────────── */

type StageStatus = "pending" | "running" | "success" | "failed" | "skipped";
type BuildStatus = "success" | "failed" | "running" | "cancelled";
type TriggerType = "push" | "pr" | "manual" | "schedule";

interface Pipeline {
  id: string;
  name: string;
  repo: string;
  icon: LucideIcon;
  color: string;
  lastBuild: string;
  lastStatus: BuildStatus;
  branch: string;
  environment: string;
}

interface Stage {
  name: string;
  status: StageStatus;
  duration: string;
  icon: LucideIcon;
}

interface Build {
  id: string;
  number: number;
  status: BuildStatus;
  commitSha: string;
  commitMessage: string;
  author: string;
  branch: string;
  duration: string;
  triggeredBy: TriggerType;
  timestamp: string;
}

interface EnvVar {
  id: string;
  key: string;
  value: string;
  masked: boolean;
  scope: "production" | "staging" | "all";
}

interface DeployTarget {
  name: string;
  env: "production" | "staging" | "preview";
  url: string;
  lastDeploy: string;
  version: string;
  status: "live" | "deploying" | "failed";
}

interface LogLine {
  time: string;
  level: "info" | "warn" | "error" | "success" | "cmd";
  text: string;
}

/* ─────────────────────────────────────────────────────────────────────────
 * Mock data
 * ──────────────────────────────────────────────────────────────────────── */

const PIPELINES: Pipeline[] = [
  { id: "web-prod", name: "web-prod", repo: "acme/web", icon: Globe, color: "#6366F1", lastBuild: "2m ago", lastStatus: "success", branch: "main", environment: "production" },
  { id: "api-prod", name: "api-prod", repo: "acme/api", icon: Server, color: "#10B981", lastBuild: "8m ago", lastStatus: "success", branch: "main", environment: "production" },
  { id: "web-staging", name: "web-staging", repo: "acme/web", icon: Cloud, color: "#F59E0B", lastBuild: "14m ago", lastStatus: "running", branch: "develop", environment: "staging" },
  { id: "mobile-ios", name: "mobile-ios", repo: "acme/mobile", icon: Smartphone, color: "#EC4899", lastBuild: "1h ago", lastStatus: "failed", branch: "main", environment: "testflight" },
  { id: "mobile-android", name: "mobile-android", repo: "acme/mobile", icon: Smartphone, color: "#22C55E", lastBuild: "3h ago", lastStatus: "success", branch: "main", environment: "play-store" },
  { id: "ml-worker", name: "ml-worker", repo: "acme/ml", icon: Brain, color: "#8B5CF6", lastBuild: "6h ago", lastStatus: "success", branch: "main", environment: "production" },
  { id: "infra-terraform", name: "infra-terraform", repo: "acme/infra", icon: Layers, color: "#06B6D4", lastBuild: "1d ago", lastStatus: "success", branch: "main", environment: "aws-prod" },
  { id: "docs", name: "docs", repo: "acme/docs", icon: BookOpen, color: "#F97316", lastBuild: "2d ago", lastStatus: "success", branch: "main", environment: "production" },
];

const STAGES: Stage[] = [
  { name: "Checkout", status: "success", duration: "3s", icon: GitBranch },
  { name: "Install", status: "success", duration: "42s", icon: Package },
  { name: "Test", status: "success", duration: "1m 18s", icon: Shield },
  { name: "Build", status: "running", duration: "—", icon: Code2 },
  { name: "Deploy", status: "pending", duration: "—", icon: Rocket },
];

const BUILDS: Build[] = [
  { id: "b1", number: 1247, status: "running", commitSha: "a3f9b2c", commitMessage: "feat: add dark mode toggle to settings panel", author: "sarah.chen", branch: "main", duration: "2m 14s", triggeredBy: "push", timestamp: "just now" },
  { id: "b2", number: 1246, status: "success", commitSha: "8e1d4a7", commitMessage: "fix: resolve race condition in auth middleware", author: "marcus.w", branch: "main", duration: "3m 42s", triggeredBy: "push", timestamp: "18m ago" },
  { id: "b3", number: 1245, status: "success", commitSha: "2b7c9e3", commitMessage: "chore: bump dependencies to latest", author: "dependabot", branch: "main", duration: "3m 01s", triggeredBy: "pr", timestamp: "1h ago" },
  { id: "b4", number: 1244, status: "failed", commitSha: "f4a6d8b", commitMessage: "refactor: extract payment logic into service", author: "alex.kim", branch: "feature/payments", duration: "1m 08s", triggeredBy: "pr", timestamp: "2h ago" },
  { id: "b5", number: 1243, status: "success", commitSha: "9c3e5f1", commitMessage: "docs: update API reference for v2 endpoints", author: "priya.n", branch: "main", duration: "2m 55s", triggeredBy: "push", timestamp: "3h ago" },
  { id: "b6", number: 1242, status: "success", commitSha: "5d8b2a4", commitMessage: "feat: add webhook retry logic with exponential backoff", author: "sarah.chen", branch: "main", duration: "4m 12s", triggeredBy: "push", timestamp: "5h ago" },
  { id: "b7", number: 1241, status: "cancelled", commitSha: "7e2f4c9", commitMessage: "wip: experimental caching layer", author: "marcus.w", branch: "experiment/cache", duration: "0m 34s", triggeredBy: "manual", timestamp: "8h ago" },
  { id: "b8", number: 1240, status: "success", commitSha: "1a9d6b3", commitMessage: "fix: correct timezone handling in reports", author: "alex.kim", branch: "main", duration: "3m 18s", triggeredBy: "push", timestamp: "12h ago" },
  { id: "b9", number: 1239, status: "success", commitSha: "6f3c8e2", commitMessage: "test: add e2e coverage for checkout flow", author: "priya.n", branch: "main", duration: "5m 47s", triggeredBy: "push", timestamp: "18h ago" },
  { id: "b10", number: 1238, status: "success", commitSha: "4b7a1d9", commitMessage: "perf: optimize database query for user feed", author: "sarah.chen", branch: "main", duration: "3m 22s", triggeredBy: "schedule", timestamp: "1d ago" },
  { id: "b11", number: 1237, status: "failed", commitSha: "8c2e5b6", commitMessage: "feat: new admin dashboard", author: "marcus.w", branch: "feature/admin", duration: "2m 04s", triggeredBy: "pr", timestamp: "1d ago" },
  { id: "b12", number: 1236, status: "success", commitSha: "3d9f7a1", commitMessage: "chore: migrate to pnpm v9", author: "alex.kim", branch: "main", duration: "4m 33s", triggeredBy: "push", timestamp: "2d ago" },
  { id: "b13", number: 1235, status: "success", commitSha: "9e4b2c8", commitMessage: "fix: handle null response in search endpoint", author: "priya.n", branch: "main", duration: "2m 49s", triggeredBy: "push", timestamp: "2d ago" },
  { id: "b14", number: 1234, status: "success", commitSha: "5a1f8d3", commitMessage: "feat: add CSV export to reports", author: "sarah.chen", branch: "main", duration: "3m 55s", triggeredBy: "push", timestamp: "3d ago" },
  { id: "b15", number: 1233, status: "success", commitSha: "7b6c4e2", commitMessage: "docs: architecture decision record for event sourcing", author: "marcus.w", branch: "main", duration: "1m 22s", triggeredBy: "push", timestamp: "3d ago" },
];

const INITIAL_LOGS: LogLine[] = [
  { time: "14:32:01", level: "cmd", text: "$ git checkout main && git pull origin main" },
  { time: "14:32:02", level: "info", text: "From github.com:acme/web" },
  { time: "14:32:02", level: "info", text: " * branch            main       -> FETCH_HEAD" },
  { time: "14:32:03", level: "success", text: "✓ Checkout complete (3s)" },
  { time: "14:32:04", level: "cmd", text: "$ pnpm install --frozen-lockfile" },
  { time: "14:32:05", level: "info", text: "Lockfile is up to date, resolution step is skipped" },
  { time: "14:32:06", level: "info", text: "Progress: resolved 1247, reused 1247, downloaded 0, added 0" },
  { time: "14:32:46", level: "success", text: "✓ Dependencies installed (42s)" },
  { time: "14:32:47", level: "cmd", text: "$ pnpm test --coverage" },
  { time: "14:32:48", level: "info", text: "Test Suites: starting 247 suites" },
  { time: "14:33:12", level: "info", text: "PASS  src/auth/__tests__/session.test.ts" },
  { time: "14:33:24", level: "info", text: "PASS  src/api/__tests__/routes.test.ts" },
  { time: "14:33:41", level: "warn", text: "WARN  deprecation: React.FC is deprecated in v19" },
  { time: "14:34:05", level: "success", text: "✓ Tests: 2,847 passed, 0 failed (1m 18s)" },
  { time: "14:34:06", level: "success", text: "✓ Coverage: 87.3% (threshold: 80%)" },
  { time: "14:34:07", level: "cmd", text: "$ pnpm build" },
  { time: "14:34:08", level: "info", text: "Next.js 14.2.5 compiling..." },
  { time: "14:34:32", level: "info", text: "Creating optimized production build..." },
  { time: "14:34:58", level: "info", text: "Compiled successfully in 50s" },
  { time: "14:34:59", level: "info", text: "Collecting page data..." },
  { time: "14:35:12", level: "info", text: "Generating static pages (42/42)" },
  { time: "14:35:14", level: "info", text: "Finalizing page optimization..." },
];

const INITIAL_ENV_VARS: EnvVar[] = [
  { id: "e1", key: "DATABASE_URL", value: "postgres://prod-cluster.acme.internal:5432/app", masked: true, scope: "production" },
  { id: "e2", key: "REDIS_URL", value: "redis://cache.acme.internal:6379", masked: true, scope: "all" },
  { id: "e3", key: "STRIPE_SECRET_KEY", value: "sk_live_51H7X9pKb2mNqR4vWzY8aB", masked: true, scope: "production" },
  { id: "e4", key: "SENTRY_DSN", value: "https://a1b2c3@o12345.ingest.sentry.io/67890", masked: true, scope: "all" },
  { id: "e5", key: "NEXT_PUBLIC_API_URL", value: "https://api.acme.com", masked: false, scope: "production" },
  { id: "e6", key: "NODE_ENV", value: "production", masked: false, scope: "production" },
];

const DEPLOY_TARGETS: DeployTarget[] = [
  { name: "Production", env: "production", url: "app.acme.com", lastDeploy: "2m ago", version: "v2.14.3", status: "live" },
  { name: "Staging", env: "staging", url: "staging.acme.com", lastDeploy: "1h ago", version: "v2.15.0-rc.2", status: "live" },
  { name: "Preview", env: "preview", url: "pr-247.preview.acme.com", lastDeploy: "14m ago", version: "pr-247", status: "deploying" },
];

/* ─────────────────────────────────────────────────────────────────────────
 * Helpers
 * ──────────────────────────────────────────────────────────────────────── */

const COLORS = {
  bg: "#0A0A0F",
  surface: "#12121A",
  surfaceHi: "#181824",
  border: "#222233",
  borderHi: "#2E2E44",
  primary: "#6366F1",
  primaryGlow: "rgba(99, 102, 241, 0.15)",
  text: "#E8E8F0",
  textMuted: "#8888A0",
  textDim: "#555570",
  green: "#10B981",
  red: "#EF4444",
  amber: "#F59E0B",
  blue: "#3B82F6",
};

function statusColor(s: BuildStatus | StageStatus): string {
  if (s === "success") return COLORS.green;
  if (s === "failed") return COLORS.red;
  if (s === "running") return COLORS.primary;
  if (s === "cancelled") return COLORS.textMuted;
  if (s === "skipped") return COLORS.textDim;
  return COLORS.textMuted;
}

function statusIcon(s: BuildStatus | StageStatus): LucideIcon {
  if (s === "success") return CheckCircle2;
  if (s === "failed") return XCircle;
  if (s === "running") return Loader2;
  if (s === "cancelled") return XCircle;
  return Clock;
}

function logColor(level: LogLine["level"]): string {
  if (level === "error") return COLORS.red;
  if (level === "warn") return COLORS.amber;
  if (level === "success") return COLORS.green;
  if (level === "cmd") return COLORS.primary;
  return COLORS.text;
}

function triggerLabel(t: TriggerType): string {
  if (t === "push") return "git push";
  if (t === "pr") return "pull request";
  if (t === "manual") return "manual";
  return "scheduled";
}

/* ─────────────────────────────────────────────────────────────────────────
 * Page
 * ──────────────────────────────────────────────────────────────────────── */

export default function BuildPage() {
  const [selectedId, setSelectedId] = useState<string>("web-prod");
  const [search, setSearch] = useState<string>("");
  const [logs, setLogs] = useState<LogLine[]>(INITIAL_LOGS);
  const [envVars, setEnvVars] = useState<EnvVar[]>(INITIAL_ENV_VARS);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [triggerPush, setTriggerPush] = useState<boolean>(true);
  const [triggerPR, setTriggerPR] = useState<boolean>(true);
  const [triggerManual, setTriggerManual] = useState<boolean>(true);
  const [triggerSchedule, setTriggerSchedule] = useState<boolean>(false);
  const [cronExpr, setCronExpr] = useState<string>("0 */6 * * *");
  const [newKey, setNewKey] = useState<string>("");
  const [newValue, setNewValue] = useState<string>("");
  const [isBuilding, setIsBuilding] = useState<boolean>(true);
  const logEndRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(
    () => PIPELINES.find((p) => p.id === selectedId) ?? PIPELINES[0],
    [selectedId],
  );

  const filteredPipelines = useMemo(() => {
    if (!search.trim()) return PIPELINES;
    const q = search.toLowerCase();
    return PIPELINES.filter(
      (p) => p.name.toLowerCase().includes(q) || p.repo.toLowerCase().includes(q),
    );
  }, [search]);

  /* Live log streaming simulation */
  useEffect(() => {
    if (!isBuilding) return;
    const extras: LogLine[] = [
      { time: "14:35:18", level: "info", text: "Route (app)                              Size     First Load JS" },
      { time: "14:35:18", level: "info", text: "┌ ○ /                                    142 B          87.3 kB" },
      { time: "14:35:18", level: "info", text: "├ ○ /dashboard                           3.42 kB         112 kB" },
      { time: "14:35:19", level: "info", text: "├ ○ /settings                            1.18 kB         94.1 kB" },
      { time: "14:35:19", level: "info", text: "└ ○ /build                               8.74 kB         128 kB" },
      { time: "14:35:20", level: "success", text: "✓ Build completed successfully" },
      { time: "14:35:21", level: "cmd", text: "$ vercel deploy --prod" },
      { time: "14:35:22", level: "info", text: "Deploying acme/web to production..." },
      { time: "14:35:24", level: "info", text: "Uploading [====================] 100%" },
      { time: "14:35:28", level: "info", text: "Building on Vercel infrastructure..." },
      { time: "14:35:44", level: "success", text: "✓ Deployed to https://app.acme.com" },
    ];
    let i = 0;
    const interval = window.setInterval(() => {
      if (i >= extras.length) {
        window.clearInterval(interval);
        setIsBuilding(false);
        return;
      }
      setLogs((prev) => [...prev, extras[i]]);
      i += 1;
    }, 1400);
    return () => window.clearInterval(interval);
  }, [isBuilding]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const toggleReveal = (id: string) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addEnvVar = () => {
    if (!newKey.trim() || !newValue.trim()) return;
    setEnvVars((prev) => [
      ...prev,
      {
        id: `e_${Date.now()}`,
        key: newKey.trim().toUpperCase(),
        value: newValue.trim(),
        masked: true,
        scope: "all",
      },
    ]);
    setNewKey("");
    setNewValue("");
  };

  const deleteEnvVar = (id: string) => {
    setEnvVars((prev) => prev.filter((e) => e.id !== id));
  };

  const rerun = () => {
    setLogs([{ time: new Date().toLocaleTimeString("en-US", { hour12: false }), level: "cmd", text: "$ Triggering new build..." }]);
    setIsBuilding(true);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "280px 1fr",
        gridTemplateRows: "auto 1fr",
        height: "100%",
        minHeight: 0,
        background: COLORS.bg,
        color: COLORS.text,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header / stats bar */}
      <header
        style={{
          gridColumn: "1 / -1",
          padding: "18px 24px",
          borderBottom: `1px solid ${COLORS.border}`,
          background: COLORS.surface,
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${COLORS.primary}, #8B5CF6)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 6px 20px ${COLORS.primaryGlow}`,
            }}
          >
            <Rocket size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em" }}>Build & Deploy</div>
            <div style={{ fontSize: 11, color: COLORS.textMuted }}>CI/CD pipeline orchestration</div>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <StatBadge icon={Clock} label="Avg build time" value="3m 24s" tone={COLORS.primary} />
        <StatBadge icon={TrendingUp} label="Success rate" value="94.7%" tone={COLORS.green} />
        <StatBadge icon={Rocket} label="Deploys this week" value="42" tone={COLORS.amber} />

        <button style={btnStyle("ghost")}>
          <Bell size={13} />
        </button>
        <button style={btnStyle("primary")} onClick={rerun}>
          <Play size={13} />
          Run pipeline
        </button>
      </header>

      {/* Sidebar: pipeline list */}
      <aside
        style={{
          borderRight: `1px solid ${COLORS.border}`,
          background: COLORS.surface,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <div style={{ padding: 14, borderBottom: `1px solid ${COLORS.border}` }}>
          <div style={{ position: "relative" }}>
            <Search
              size={13}
              style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: COLORS.textMuted }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pipelines..."
              style={{
                width: "100%",
                padding: "8px 10px 8px 30px",
                borderRadius: 8,
                background: COLORS.bg,
                border: `1px solid ${COLORS.border}`,
                color: COLORS.text,
                fontSize: 12,
                outline: "none",
              }}
            />
          </div>
        </div>

        <div style={{ padding: "8px 8px 16px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={sectionLabelStyle}>Pipelines ({filteredPipelines.length})</div>
          {filteredPipelines.map((p) => {
            const Icon = p.icon;
            const StatusIc = statusIcon(p.lastStatus);
            const isSelected = p.id === selectedId;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 10px",
                  borderRadius: 8,
                  border: `1px solid ${isSelected ? COLORS.primary : "transparent"}`,
                  background: isSelected ? COLORS.primaryGlow : "transparent",
                  color: COLORS.text,
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 150ms",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = COLORS.surfaceHi;
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "transparent";
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    background: `${p.color}20`,
                    color: p.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={14} />
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: "-0.005em" }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: 10.5, color: COLORS.textMuted, marginTop: 1 }}>
                    {p.repo} · {p.lastBuild}
                  </div>
                </span>
                <StatusIc
                  size={13}
                  color={statusColor(p.lastStatus)}
                  style={p.lastStatus === "running" ? { animation: "bd-spin 1s linear infinite" } : undefined}
                />
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main content */}
      <main
        style={{
          overflow: "auto",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 20,
          minHeight: 0,
        }}
      >
        {/* Pipeline header */}
        <section
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "18px 20px",
            borderRadius: 12,
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 11,
              background: `${selected.color}20`,
              color: selected.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <selected.icon size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.015em" }}>{selected.name}</div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, display: "flex", gap: 10, marginTop: 3 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <GitBranch size={11} /> {selected.branch}
              </span>
              <span>·</span>
              <span>{selected.repo}</span>
              <span>·</span>
              <span style={{ color: selected.color }}>{selected.environment}</span>
            </div>
          </div>
          <button style={btnStyle("ghost")}>
            <Settings size={13} />
            Configure
          </button>
          <button style={btnStyle("ghost")} onClick={rerun}>
            <RotateCw size={13} />
            Re-run
          </button>
          <button style={btnStyle("primary")}>
            <Rocket size={13} />
            Deploy now
          </button>
        </section>

        {/* Stages visualization */}
        <section style={cardStyle()}>
          <div style={cardHeaderStyle()}>
            <Activity size={14} color={COLORS.primary} />
            <span>Pipeline stages</span>
            <span style={{ marginLeft: "auto", fontSize: 11, color: COLORS.textMuted }}>
              Build #1247 · started 2m 14s ago
            </span>
          </div>
          <div style={{ padding: 24, display: "flex", alignItems: "center", gap: 8, overflow: "auto" }}>
            {STAGES.map((stage, i) => {
              const Icon = stage.icon;
              const StatusIc = statusIcon(stage.status);
              const color = statusColor(stage.status);
              return (
                <div key={stage.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      minWidth: 140,
                      padding: "12px 14px",
                      borderRadius: 10,
                      background: stage.status === "running" ? COLORS.primaryGlow : COLORS.surfaceHi,
                      border: `1px solid ${stage.status === "running" ? COLORS.primary : COLORS.border}`,
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <Icon size={13} color={color} />
                      <span style={{ fontSize: 12.5, fontWeight: 600 }}>{stage.name}</span>
                      <StatusIc
                        size={12}
                        color={color}
                        style={{ marginLeft: "auto", animation: stage.status === "running" ? "bd-spin 1s linear infinite" : undefined }}
                      />
                    </div>
                    <div style={{ fontSize: 10.5, color: COLORS.textMuted, fontFamily: "ui-monospace, monospace" }}>
                      {stage.duration}
                    </div>
                  </div>
                  {i < STAGES.length - 1 && (
                    <ChevronRight size={14} color={COLORS.textDim} />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Grid: logs + right column */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>
          {/* Live logs */}
          <section style={cardStyle()}>
            <div style={cardHeaderStyle()}>
              <Terminal size={14} color={COLORS.green} />
              <span>Build output</span>
              <span
                style={{
                  marginLeft: 10,
                  padding: "2px 8px",
                  borderRadius: 999,
                  fontSize: 10.5,
                  background: isBuilding ? COLORS.primaryGlow : `${COLORS.green}20`,
                  color: isBuilding ? COLORS.primary : COLORS.green,
                  fontWeight: 600,
                }}
              >
                {isBuilding ? "● LIVE" : "● DONE"}
              </span>
              <span style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                <button style={iconBtnStyle()}>
                  <Download size={12} />
                </button>
                <button style={iconBtnStyle()}>
                  <Copy size={12} />
                </button>
              </span>
            </div>
            <div
              style={{
                padding: "14px 16px",
                background: "#05050A",
                fontFamily: "ui-monospace, SFMono-Regular, monospace",
                fontSize: 12,
                lineHeight: 1.7,
                maxHeight: 400,
                overflow: "auto",
              }}
            >
              {logs.map((line, i) => (
                <div key={i} style={{ display: "flex", gap: 12, color: logColor(line.level) }}>
                  <span style={{ color: COLORS.textDim, flexShrink: 0 }}>{line.time}</span>
                  <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{line.text}</span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </section>

          {/* Deployment targets */}
          <section style={cardStyle()}>
            <div style={cardHeaderStyle()}>
              <Cloud size={14} color={COLORS.amber} />
              <span>Deployment targets</span>
            </div>
            <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              {DEPLOY_TARGETS.map((t) => (
                <div
                  key={t.name}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 9,
                    background: COLORS.surfaceHi,
                    border: `1px solid ${COLORS.border}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: t.status === "live" ? COLORS.green : t.status === "deploying" ? COLORS.primary : COLORS.red,
                        boxShadow: `0 0 8px ${t.status === "live" ? COLORS.green : COLORS.primary}`,
                        animation: t.status === "deploying" ? "bd-pulse 1.2s ease-in-out infinite" : undefined,
                      }}
                    />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</span>
                    <span style={{ marginLeft: "auto", fontSize: 10.5, fontFamily: "ui-monospace, monospace", color: COLORS.textMuted }}>
                      {t.version}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.primary, marginTop: 6, fontFamily: "ui-monospace, monospace" }}>
                    {t.url}
                  </div>
                  <div style={{ fontSize: 10.5, color: COLORS.textMuted, marginTop: 3 }}>
                    Last deploy {t.lastDeploy}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Build history */}
        <section style={cardStyle()}>
          <div style={cardHeaderStyle()}>
            <FileCode size={14} color={COLORS.blue} />
            <span>Build history</span>
            <span style={{ marginLeft: "auto", fontSize: 11, color: COLORS.textMuted }}>
              Last 15 builds
            </span>
            <button style={iconBtnStyle()}>
              <Filter size={12} />
            </button>
          </div>
          <div style={{ overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: COLORS.surfaceHi }}>
                  <th style={thStyle()}>#</th>
                  <th style={thStyle()}>Status</th>
                  <th style={thStyle()}>Commit</th>
                  <th style={thStyle()}>Branch</th>
                  <th style={thStyle()}>Author</th>
                  <th style={thStyle()}>Trigger</th>
                  <th style={thStyle()}>Duration</th>
                  <th style={thStyle()}>Time</th>
                </tr>
              </thead>
              <tbody>
                {BUILDS.map((b) => {
                  const StatusIc = statusIcon(b.status);
                  return (
                    <tr
                      key={b.id}
                      style={{ borderTop: `1px solid ${COLORS.border}`, transition: "background 120ms" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.surfaceHi)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={tdStyle()}>
                        <span style={{ fontFamily: "ui-monospace, monospace", color: COLORS.textMuted }}>
                          #{b.number}
                        </span>
                      </td>
                      <td style={tdStyle()}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "3px 8px",
                            borderRadius: 999,
                            background: `${statusColor(b.status)}18`,
                            color: statusColor(b.status),
                            fontSize: 10.5,
                            fontWeight: 600,
                            textTransform: "capitalize",
                          }}
                        >
                          <StatusIc
                            size={10}
                            style={b.status === "running" ? { animation: "bd-spin 1s linear infinite" } : undefined}
                          />
                          {b.status}
                        </span>
                      </td>
                      <td style={tdStyle()}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <GitCommit size={11} color={COLORS.textMuted} />
                          <span style={{ fontFamily: "ui-monospace, monospace", color: COLORS.primary, fontSize: 11 }}>
                            {b.commitSha}
                          </span>
                          <span style={{ color: COLORS.text, maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {b.commitMessage}
                          </span>
                        </div>
                      </td>
                      <td style={tdStyle()}>
                        <span style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: "ui-monospace, monospace" }}>
                          {b.branch}
                        </span>
                      </td>
                      <td style={tdStyle()}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                          <User size={10} color={COLORS.textMuted} />
                          {b.author}
                        </span>
                      </td>
                      <td style={tdStyle()}>
                        <span style={{ fontSize: 10.5, color: COLORS.textMuted }}>{triggerLabel(b.triggeredBy)}</span>
                      </td>
                      <td style={tdStyle()}>
                        <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 11 }}>{b.duration}</span>
                      </td>
                      <td style={tdStyle()}>
                        <span style={{ color: COLORS.textMuted, fontSize: 11 }}>{b.timestamp}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Trigger + env vars */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Triggers */}
          <section style={cardStyle()}>
            <div style={cardHeaderStyle()}>
              <Zap size={14} color={COLORS.amber} />
              <span>Trigger configuration</span>
            </div>
            <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
              <TriggerToggle
                label="Push to main"
                description="Run on every commit to the main branch"
                enabled={triggerPush}
                onChange={setTriggerPush}
                icon={GitCommit}
              />
              <TriggerToggle
                label="Pull request"
                description="Validate every PR before merge"
                enabled={triggerPR}
                onChange={setTriggerPR}
                icon={GitBranch}
              />
              <TriggerToggle
                label="Manual"
                description="Trigger runs from the UI or API"
                enabled={triggerManual}
                onChange={setTriggerManual}
                icon={Play}
              />
              <TriggerToggle
                label="Schedule"
                description="Run on a cron-based schedule"
                enabled={triggerSchedule}
                onChange={setTriggerSchedule}
                icon={Calendar}
              />
              {triggerSchedule && (
                <div style={{ paddingLeft: 34 }}>
                  <label style={{ fontSize: 11, color: COLORS.textMuted, display: "block", marginBottom: 4 }}>
                    Cron expression
                  </label>
                  <input
                    value={cronExpr}
                    onChange={(e) => setCronExpr(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 7,
                      background: COLORS.bg,
                      border: `1px solid ${COLORS.border}`,
                      color: COLORS.text,
                      fontFamily: "ui-monospace, monospace",
                      fontSize: 12,
                      outline: "none",
                    }}
                  />
                  <div style={{ fontSize: 10.5, color: COLORS.textDim, marginTop: 4 }}>
                    Every 6 hours, at minute 0
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Env vars */}
          <section style={cardStyle()}>
            <div style={cardHeaderStyle()}>
              <Shield size={14} color={COLORS.green} />
              <span>Environment variables</span>
              <span style={{ marginLeft: "auto", fontSize: 11, color: COLORS.textMuted }}>
                {envVars.length} secrets
              </span>
            </div>
            <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              {envVars.map((ev) => {
                const isRevealed = revealed.has(ev.id);
                const display = ev.masked && !isRevealed ? "•".repeat(Math.min(ev.value.length, 24)) : ev.value;
                return (
                  <div
                    key={ev.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 10px",
                      borderRadius: 8,
                      background: COLORS.surfaceHi,
                      border: `1px solid ${COLORS.border}`,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 600, fontFamily: "ui-monospace, monospace", color: COLORS.primary }}>
                        {ev.key}
                      </div>
                      <div style={{ fontSize: 10.5, color: COLORS.textMuted, fontFamily: "ui-monospace, monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {display}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 9.5,
                        padding: "2px 6px",
                        borderRadius: 4,
                        background: ev.scope === "production" ? `${COLORS.red}18` : `${COLORS.textMuted}18`,
                        color: ev.scope === "production" ? COLORS.red : COLORS.textMuted,
                        textTransform: "uppercase",
                        fontWeight: 600,
                      }}
                    >
                      {ev.scope}
                    </span>
                    {ev.masked && (
                      <button style={iconBtnStyle()} onClick={() => toggleReveal(ev.id)}>
                        {isRevealed ? <EyeOff size={11} /> : <Eye size={11} />}
                      </button>
                    )}
                    <button style={iconBtnStyle()} onClick={() => deleteEnvVar(ev.id)}>
                      <Trash2 size={11} />
                    </button>
                  </div>
                );
              })}

              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                <input
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="KEY"
                  style={{
                    flex: 1,
                    padding: "7px 10px",
                    borderRadius: 7,
                    background: COLORS.bg,
                    border: `1px solid ${COLORS.border}`,
                    color: COLORS.text,
                    fontFamily: "ui-monospace, monospace",
                    fontSize: 11.5,
                    outline: "none",
                  }}
                />
                <input
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="value"
                  style={{
                    flex: 2,
                    padding: "7px 10px",
                    borderRadius: 7,
                    background: COLORS.bg,
                    border: `1px solid ${COLORS.border}`,
                    color: COLORS.text,
                    fontFamily: "ui-monospace, monospace",
                    fontSize: 11.5,
                    outline: "none",
                  }}
                />
                <button style={btnStyle("primary")} onClick={addEnvVar}>
                  <Plus size={12} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <style jsx global>{`
        @keyframes bd-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes bd-pulse {
          0%, 100% { opacity: 0.4; }
          50%      { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Sub-components / style helpers
 * ──────────────────────────────────────────────────────────────────────── */

interface StatBadgeProps {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: string;
}

function StatBadge({ icon: Icon, label, value, tone }: StatBadgeProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 14px",
        borderRadius: 9,
        background: COLORS.surfaceHi,
        border: `1px solid ${COLORS.border}`,
      }}
    >
      <Icon size={14} color={tone} />
      <div>
        <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: "0.02em" }}>{label}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, letterSpacing: "-0.01em" }}>{value}</div>
      </div>
    </div>
  );
}

interface TriggerToggleProps {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (v: boolean) => void;
  icon: LucideIcon;
}

function TriggerToggle({ label, description, enabled, onChange, icon: Icon }: TriggerToggleProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span
        style={{
          width: 26,
          height: 26,
          borderRadius: 6,
          background: enabled ? COLORS.primaryGlow : COLORS.surfaceHi,
          color: enabled ? COLORS.primary : COLORS.textMuted,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={13} />
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 11, color: COLORS.textMuted }}>{description}</div>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        style={{
          width: 36,
          height: 20,
          borderRadius: 999,
          background: enabled ? COLORS.primary : COLORS.border,
          border: "none",
          position: "relative",
          cursor: "pointer",
          transition: "background 150ms",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: enabled ? 18 : 2,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#fff",
            transition: "left 150ms",
          }}
        />
      </button>
    </div>
  );
}

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 10.5,
  fontWeight: 600,
  color: COLORS.textMuted,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  padding: "8px 10px 6px 10px",
};

function cardStyle(): React.CSSProperties {
  return {
    borderRadius: 12,
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    overflow: "hidden",
  };
}

function cardHeaderStyle(): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 16px",
    borderBottom: `1px solid ${COLORS.border}`,
    fontSize: 12.5,
    fontWeight: 600,
    color: COLORS.text,
    letterSpacing: "-0.005em",
  };
}

function btnStyle(variant: "primary" | "ghost"): React.CSSProperties {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 14px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    border: `1px solid ${COLORS.border}`,
    transition: "all 150ms",
  };
  if (variant === "primary") {
    return {
      ...base,
      background: `linear-gradient(135deg, ${COLORS.primary}, #8B5CF6)`,
      color: "#fff",
      borderColor: COLORS.primary,
      boxShadow: `0 4px 14px ${COLORS.primaryGlow}`,
    };
  }
  return {
    ...base,
    background: COLORS.surfaceHi,
    color: COLORS.text,
  };
}

function iconBtnStyle(): React.CSSProperties {
  return {
    width: 24,
    height: 24,
    borderRadius: 6,
    border: "none",
    background: "transparent",
    color: COLORS.textMuted,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 120ms",
  };
}

function thStyle(): React.CSSProperties {
  return {
    textAlign: "left",
    padding: "10px 14px",
    fontSize: 10.5,
    fontWeight: 600,
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  };
}

function tdStyle(): React.CSSProperties {
  return {
    padding: "11px 14px",
    fontSize: 12,
    color: COLORS.text,
  };
}
