"use client";

import { useState } from "react";
import {
  Play,
  Save,
  Rocket,
  History,
  Share2,
  Settings,
  Plus,
  Search,
  Webhook,
  Clock,
  Sparkles,
  Mail,
  MessageSquare,
  Database,
  Hash,
  GitBranch,
  GitMerge,
  Filter,
  Zap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Copy,
  Trash2,
  MoreHorizontal,
  Activity,
  Users,
  FileSpreadsheet,
  Globe,
  LayoutGrid,
  ShoppingCart,
  Bot,
  Workflow,
  ArrowRight,
  CircleDot,
  BrainCircuit,
  TrendingUp,
  CalendarClock,
  RotateCw,
  Code2,
  RefreshCw,
  Timer,
  Cpu,
  Loader2,
} from "lucide-react";

type NodeType = "trigger" | "action" | "ai" | "condition" | "loop" | "parallel" | "transform";
type RunState = "idle" | "running" | "success" | "error" | "skipped";

type FlowNode = {
  id: string;
  label: string;
  sublabel: string;
  type: NodeType;
  icon: React.ReactNode;
  x: number;
  y: number;
  integration: string;
};

const NODES: FlowNode[] = [
  { id: "n1", label: "New HubSpot Contact", sublabel: "Trigger - HubSpot", type: "trigger", icon: <Users className="h-4 w-4" />, x: 60, y: 220, integration: "HubSpot" },
  { id: "n2", label: "Enrich with Clearbit", sublabel: "Action - Clearbit", type: "action", icon: <Database className="h-4 w-4" />, x: 300, y: 220, integration: "Clearbit" },
  { id: "n3", label: "Score Lead (AI)", sublabel: "OmniMind - GPT-4o", type: "ai", icon: <BrainCircuit className="h-4 w-4" />, x: 540, y: 220, integration: "OmniMind" },
  { id: "n4", label: "Score >= 80?", sublabel: "Condition - Router", type: "condition", icon: <GitBranch className="h-4 w-4" />, x: 780, y: 220, integration: "Logic" },
  { id: "n5", label: "Send to Slack", sublabel: "Action - #sales-hot", type: "action", icon: <Hash className="h-4 w-4" />, x: 1020, y: 120, integration: "Slack" },
  { id: "n6", label: "Add to Nurture", sublabel: "Action - Mailchimp", type: "action", icon: <Mail className="h-4 w-4" />, x: 1020, y: 320, integration: "Mailchimp" },
  { id: "n7", label: "Log to Warehouse", sublabel: "Action - Snowflake", type: "action", icon: <Database className="h-4 w-4" />, x: 1260, y: 220, integration: "Snowflake" },
  { id: "n8", label: "Loop Touchpoints", sublabel: "Loop - 3 iterations", type: "loop", icon: <RotateCw className="h-4 w-4" />, x: 1020, y: 460, integration: "Logic" },
];

const EDGES: { from: string; to: string; label?: string }[] = [
  { from: "n1", to: "n2" },
  { from: "n2", to: "n3" },
  { from: "n3", to: "n4" },
  { from: "n4", to: "n5", label: "Yes" },
  { from: "n4", to: "n6", label: "No" },
  { from: "n5", to: "n7" },
  { from: "n6", to: "n7" },
  { from: "n6", to: "n8", label: "Loop" },
];

const EXECUTION_ORDER: string[] = ["n1", "n2", "n3", "n4", "n5", "n6", "n7"];
const EDGE_DURATIONS = ["124ms", "412ms", "891ms", "67ms", "203ms", "318ms", "445ms", "156ms"];

const TYPE_STYLES: Record<NodeType, { ring: string; bg: string; icon: string; badge: string; label: string }> = {
  trigger: { ring: "ring-[#10B981]/40", bg: "bg-[#10B981]/10", icon: "bg-[#10B981] text-black", badge: "text-[#6EE7B7]", label: "Trigger" },
  action: { ring: "ring-[#6366F1]/40", bg: "bg-[#6366F1]/10", icon: "bg-[#6366F1] text-white", badge: "text-[#A5B4FC]", label: "Action" },
  ai: { ring: "ring-[#8B5CF6]/40", bg: "bg-[#8B5CF6]/10", icon: "bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] text-white", badge: "text-[#C4B5FD]", label: "AI" },
  condition: { ring: "ring-[#F59E0B]/40", bg: "bg-[#F59E0B]/10", icon: "bg-[#F59E0B] text-black", badge: "text-[#FCD34D]", label: "Condition" },
  loop: { ring: "ring-[#F97316]/40", bg: "bg-[#F97316]/10", icon: "bg-[#F97316] text-white", badge: "text-[#FDBA74]", label: "Loop" },
  parallel: { ring: "ring-[#14B8A6]/40", bg: "bg-[#14B8A6]/10", icon: "bg-[#14B8A6] text-white", badge: "text-[#5EEAD4]", label: "Parallel" },
  transform: { ring: "ring-[#3B82F6]/40", bg: "bg-[#3B82F6]/10", icon: "bg-[#3B82F6] text-white", badge: "text-[#93C5FD]", label: "Transform" },
};

const CATEGORIES = [
  { key: "apps", label: "Apps", icon: <LayoutGrid className="h-3.5 w-3.5" />, count: 847 },
  { key: "schedules", label: "Schedules", icon: <Clock className="h-3.5 w-3.5" />, count: 4 },
  { key: "webhooks", label: "Webhooks", icon: <Webhook className="h-3.5 w-3.5" />, count: 12 },
  { key: "ai", label: "AI Events", icon: <Sparkles className="h-3.5 w-3.5" />, count: 28 },
];

const APP_NODES = [
  { name: "HubSpot", icon: <Users className="h-3.5 w-3.5" />, color: "#FF7A59" },
  { name: "Slack", icon: <Hash className="h-3.5 w-3.5" />, color: "#A855F7" },
  { name: "Gmail", icon: <Mail className="h-3.5 w-3.5" />, color: "#EA4335" },
  { name: "Sheets", icon: <FileSpreadsheet className="h-3.5 w-3.5" />, color: "#10B981" },
  { name: "Snowflake", icon: <Database className="h-3.5 w-3.5" />, color: "#29B5E8" },
  { name: "Stripe", icon: <ShoppingCart className="h-3.5 w-3.5" />, color: "#635BFF" },
  { name: "Webhook", icon: <Webhook className="h-3.5 w-3.5" />, color: "#6366F1" },
  { name: "HTTP", icon: <Globe className="h-3.5 w-3.5" />, color: "#A5B4FC" },
  { name: "OpenAI", icon: <BrainCircuit className="h-3.5 w-3.5" />, color: "#10A37F" },
  { name: "Anthropic", icon: <Bot className="h-3.5 w-3.5" />, color: "#D97706" },
  { name: "Filter", icon: <Filter className="h-3.5 w-3.5" />, color: "#F59E0B" },
  { name: "Router", icon: <GitBranch className="h-3.5 w-3.5" />, color: "#F59E0B" },
];

const LOGIC_NODES = [
  { name: "Loop", icon: <RotateCw className="h-3.5 w-3.5" />, color: "#F97316" },
  { name: "Parallel", icon: <GitMerge className="h-3.5 w-3.5" />, color: "#14B8A6" },
  { name: "Transform", icon: <Code2 className="h-3.5 w-3.5" />, color: "#3B82F6" },
];

const RUNS = [
  { id: "r1", status: "success", trigger: "New HubSpot Contact", at: "2m ago", duration: "1.4s", records: 1 },
  { id: "r2", status: "success", trigger: "New HubSpot Contact", at: "8m ago", duration: "2.1s", records: 1 },
  { id: "r3", status: "success", trigger: "Scheduled - 09:00", at: "14m ago", duration: "4.8s", records: 47 },
  { id: "r4", status: "warning", trigger: "Webhook - lead.new", at: "22m ago", duration: "3.2s", records: 3 },
  { id: "r5", status: "success", trigger: "New HubSpot Contact", at: "31m ago", duration: "1.6s", records: 1 },
  { id: "r6", status: "error", trigger: "Webhook - lead.new", at: "44m ago", duration: "0.9s", records: 0 },
  { id: "r7", status: "success", trigger: "New HubSpot Contact", at: "58m ago", duration: "1.8s", records: 1 },
  { id: "r8", status: "success", trigger: "Scheduled - 08:00", at: "1h ago", duration: "5.1s", records: 52 },
  { id: "r9", status: "success", trigger: "New HubSpot Contact", at: "1h ago", duration: "1.3s", records: 1 },
  { id: "r10", status: "success", trigger: "New HubSpot Contact", at: "2h ago", duration: "1.7s", records: 1 },
];

const TEMPLATES = [
  { name: "Lead scoring + routing", desc: "HubSpot > Clearbit > AI > Slack", icon: <TrendingUp className="h-4 w-4" />, uses: "2.4k", tag: "Sales" },
  { name: "Invoice approval", desc: "Stripe > Slack > Sheets log", icon: <ShoppingCart className="h-4 w-4" />, uses: "1.8k", tag: "Finance" },
  { name: "Content pipeline", desc: "RSS > AI summarize > Notion", icon: <Sparkles className="h-4 w-4" />, uses: "3.1k", tag: "Marketing" },
  { name: "Support triage", desc: "Zendesk > AI classify > route", icon: <MessageSquare className="h-4 w-4" />, uses: "4.6k", tag: "Support" },
  { name: "Daily digest", desc: "Scheduled > Aggregate > Email", icon: <CalendarClock className="h-4 w-4" />, uses: "1.2k", tag: "Ops" },
  { name: "Churn predictor", desc: "Warehouse > AI score > CRM", icon: <Activity className="h-4 w-4" />, uses: "890", tag: "CS" },
  { name: "Doc signed > onboard", desc: "DocuSign > Provision > Slack", icon: <CheckCircle2 className="h-4 w-4" />, uses: "1.5k", tag: "HR" },
  { name: "Anomaly alerts", desc: "Metrics > AI detect > Page", icon: <AlertTriangle className="h-4 w-4" />, uses: "670", tag: "SRE" },
];

const VARIABLES = [
  { token: "{{contact.email}}", source: "n1", type: "string" },
  { token: "{{contact.company}}", source: "n1", type: "string" },
  { token: "{{lead.score}}", source: "n3", type: "number" },
  { token: "{{lead.tier}}", source: "n3", type: "enum" },
  { token: "{{ai.output}}", source: "n3", type: "object" },
  { token: "{{enriched.industry}}", source: "n2", type: "string" },
];

const OUTPUT_SCHEMAS: Record<NodeType, Array<{ k: string; t: string }>> = {
  trigger: [{ k: "contact.id", t: "string" }, { k: "contact.email", t: "string" }, { k: "contact.company", t: "string" }, { k: "createdAt", t: "datetime" }],
  action: [{ k: "status", t: "ok | error" }, { k: "response", t: "object" }, { k: "latencyMs", t: "number" }],
  ai: [{ k: "score", t: "number" }, { k: "rationale", t: "string" }, { k: "tier", t: "A | B | C" }, { k: "tokens", t: "number" }],
  condition: [{ k: "branch", t: "yes | no" }, { k: "evaluated", t: "boolean" }],
  loop: [{ k: "iteration", t: "number" }, { k: "items", t: "array" }, { k: "remaining", t: "number" }],
  parallel: [{ k: "results", t: "array" }, { k: "completed", t: "number" }, { k: "failed", t: "number" }],
  transform: [{ k: "output", t: "object" }, { k: "shape", t: "schema" }],
};

const LOGS_SAMPLE = [
  { ts: "12:04:11.231", level: "info", msg: "Step started, payload validated" },
  { ts: "12:04:11.418", level: "info", msg: "Upstream resolved in 187ms" },
  { ts: "12:04:11.602", level: "ok", msg: "Completed successfully (124ms)" },
];

export default function AutomationPage() {
  const [selectedId, setSelectedId] = useState<string | null>("n3");
  const [activeCategory, setActiveCategory] = useState("apps");
  const [historyOpen, setHistoryOpen] = useState(true);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [running, setRunning] = useState(false);
  const [runState, setRunState] = useState<Record<string, RunState>>({});
  const [activeTab, setActiveTab] = useState<"Configure" | "Inputs" | "Output" | "Logs">("Configure");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [hasRun, setHasRun] = useState(false);

  const selected = NODES.find((n) => n.id === selectedId) || null;

  function startTestRun(): void {
    setRunning(true);
    setHasRun(true);
    const initial: Record<string, RunState> = {};
    NODES.forEach((n) => { initial[n.id] = "idle"; });
    setRunState(initial);
    EXECUTION_ORDER.forEach((id, idx) => {
      setTimeout(() => {
        setRunState((prev) => ({ ...prev, [id]: "running" }));
      }, idx * 400);
      setTimeout(() => {
        setRunState((prev) => ({ ...prev, [id]: "success" }));
      }, idx * 400 + 380);
    });
    setTimeout(() => {
      setRunState((prev) => ({ ...prev, n8: "skipped" }));
      setRunning(false);
    }, EXECUTION_ORDER.length * 400 + 200);
  }

  function copyToken(token: string): void {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(token).catch(() => undefined);
    }
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 1200);
  }

  return (
    <div className="flex h-screen w-full flex-col bg-[#0A0A0F] text-neutral-200">
      <div className="flex items-center justify-between border-b border-white/5 bg-[#0D0D14] px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-[#6366F1] to-[#4F46E5] shadow-lg shadow-[#6366F1]/20">
            <Workflow className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              OmniOS Automation
              <span className="text-neutral-600">/</span>
              <span className="text-neutral-400">Lead scoring &amp; routing</span>
              <span className="ml-1 rounded bg-[#10B981]/15 px-1.5 py-0.5 text-[10px] font-medium text-[#6EE7B7]">Live</span>
            </div>
            <div className="flex items-center gap-3 text-[10.5px] text-neutral-500">
              <span>14 active workflows</span>
              <span className="text-neutral-700">&middot;</span>
              <span>2,847 executions today</span>
              <span className="text-neutral-700">&middot;</span>
              <span className="text-[#6EE7B7]">99.2% success</span>
              <span className="text-neutral-700">&middot;</span>
              <span>p95 1.8s</span>
              <span className="text-neutral-700">&middot;</span>
              <span>Last deploy 3h ago</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setTemplatesOpen(true)} className="flex items-center gap-1.5 rounded-md border border-white/5 bg-white/5 px-3 py-1.5 text-xs text-neutral-300 hover:bg-white/10">
            <LayoutGrid className="h-3.5 w-3.5" /> Templates
          </button>
          <button className="flex items-center gap-1.5 rounded-md border border-white/5 bg-white/5 px-3 py-1.5 text-xs text-neutral-300 hover:bg-white/10">
            <History className="h-3.5 w-3.5" /> History
          </button>
          <button className="flex items-center gap-1.5 rounded-md border border-white/5 bg-white/5 px-3 py-1.5 text-xs text-neutral-300 hover:bg-white/10">
            <Share2 className="h-3.5 w-3.5" /> Share
          </button>
          <button className="flex items-center gap-1.5 rounded-md border border-white/5 bg-white/5 px-3 py-1.5 text-xs text-neutral-300 hover:bg-white/10">
            <Settings className="h-3.5 w-3.5" />
          </button>
          <div className="mx-1 h-5 w-px bg-white/10" />
          <button className="flex items-center gap-1.5 rounded-md border border-white/5 bg-white/5 px-3 py-1.5 text-xs text-neutral-300 hover:bg-white/10">
            <Save className="h-3.5 w-3.5" /> Save
          </button>
          <button
            onClick={startTestRun}
            disabled={running}
            className="flex items-center gap-1.5 rounded-md bg-white/90 px-3 py-1.5 text-xs font-medium text-black hover:bg-white disabled:opacity-70"
          >
            {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
            {running ? "Running..." : "Test Run"}
          </button>
          <button className="flex items-center gap-1.5 rounded-md bg-gradient-to-b from-[#6366F1] to-[#4F46E5] px-3 py-1.5 text-xs font-medium text-white shadow-lg shadow-[#6366F1]/25 hover:from-[#7375F3]">
            <Rocket className="h-3.5 w-3.5" /> Deploy
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-64 flex-col border-r border-white/5 bg-[#0B0B12]">
          <div className="border-b border-white/5 p-3">
            <div className="flex items-center gap-2 rounded-md border border-white/5 bg-[#13131C] px-2.5 py-1.5">
              <Search className="h-3.5 w-3.5 text-neutral-500" />
              <input placeholder="Search 847 apps..." className="w-full bg-transparent text-[12px] text-white placeholder-neutral-600 outline-none" />
            </div>
          </div>
          <div className="border-b border-white/5 p-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setActiveCategory(c.key)}
                className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-[12px] transition ${
                  activeCategory === c.key ? "bg-[#6366F1]/10 text-[#A5B4FC]" : "text-neutral-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">{c.icon}{c.label}</span>
                <span className="text-[10px] text-neutral-500">{c.count}</span>
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <div className="px-1.5 py-1 text-[10px] font-medium uppercase tracking-wider text-neutral-600">Logic &amp; control</div>
            {LOGIC_NODES.map((n) => (
              <div
                key={n.name}
                draggable
                className="group flex cursor-grab items-center gap-2.5 rounded-md border border-transparent px-2 py-1.5 text-[12px] text-neutral-300 hover:border-white/5 hover:bg-white/[0.03] active:cursor-grabbing"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded" style={{ backgroundColor: `${n.color}22`, color: n.color }}>
                  {n.icon}
                </div>
                <span className="flex-1">{n.name}</span>
                <Plus className="h-3 w-3 text-neutral-600 opacity-0 group-hover:opacity-100" />
              </div>
            ))}
            <div className="mt-2 px-1.5 py-1 text-[10px] font-medium uppercase tracking-wider text-neutral-600">Node palette</div>
            {APP_NODES.map((n) => (
              <div
                key={n.name}
                draggable
                className="group flex cursor-grab items-center gap-2.5 rounded-md border border-transparent px-2 py-1.5 text-[12px] text-neutral-300 hover:border-white/5 hover:bg-white/[0.03] active:cursor-grabbing"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded" style={{ backgroundColor: `${n.color}22`, color: n.color }}>
                  {n.icon}
                </div>
                <span className="flex-1">{n.name}</span>
                <Plus className="h-3 w-3 text-neutral-600 opacity-0 group-hover:opacity-100" />
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 p-3">
            <div className="rounded-lg border border-[#6366F1]/20 bg-gradient-to-br from-[#6366F1]/10 to-transparent p-2.5">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#A5B4FC]">
                <Sparkles className="h-3 w-3" /> Build with AI
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-neutral-400">Describe a workflow — OmniMind drafts it.</p>
            </div>
          </div>
        </aside>

        <div className="relative flex min-w-0 flex-1 flex-col">
          <div className="absolute right-4 top-4 z-20 flex items-center gap-1 rounded-md border border-white/5 bg-[#0D0D14]/90 p-1 backdrop-blur">
            <button onClick={() => setZoom((z) => Math.max(50, z - 10))} className="rounded p-1 text-neutral-400 hover:bg-white/5 hover:text-white">
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="px-1.5 text-[11px] text-neutral-400">{zoom}%</span>
            <button onClick={() => setZoom((z) => Math.min(200, z + 10))} className="rounded p-1 text-neutral-400 hover:bg-white/5 hover:text-white">
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <div className="mx-0.5 h-4 w-px bg-white/10" />
            <button className="rounded p-1 text-neutral-400 hover:bg-white/5 hover:text-white">
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <div
            className="flex-1 overflow-auto"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)",
              backgroundSize: "24px 24px",
              backgroundColor: "#08080C",
            }}
          >
            <div className="relative" style={{ width: 1480, height: 700, transform: `scale(${zoom / 100})`, transformOrigin: "top left" }}>
              <svg className="absolute inset-0 h-full w-full" style={{ pointerEvents: "none" }}>
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M0,0 L10,5 L0,10 z" fill="#3F3F55" />
                  </marker>
                  <marker id="arrow-active" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M0,0 L10,5 L0,10 z" fill="#6366F1" />
                  </marker>
                  <marker id="arrow-success" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M0,0 L10,5 L0,10 z" fill="#10B981" />
                  </marker>
                </defs>
                {EDGES.map((e, i) => {
                  const from = NODES.find((n) => n.id === e.from)!;
                  const to = NODES.find((n) => n.id === e.to)!;
                  const x1 = from.x + 200;
                  const y1 = from.y + 36;
                  const x2 = to.x;
                  const y2 = to.y + 36;
                  const midX = (x1 + x2) / 2;
                  const path = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
                  const fromState = runState[e.from];
                  const toState = runState[e.to];
                  const active = running && fromState === "success" && toState === "running";
                  const completed = hasRun && fromState === "success" && toState === "success";
                  const strokeColor = active ? "#6366F1" : completed ? "#10B981" : "#2A2A3A";
                  const marker = active ? "url(#arrow-active)" : completed ? "url(#arrow-success)" : "url(#arrow)";
                  const showDuration = completed && !running;
                  return (
                    <g key={i}>
                      <path
                        d={path}
                        stroke={strokeColor}
                        strokeWidth={active || completed ? 2 : 1.5}
                        fill="none"
                        markerEnd={marker}
                        strokeDasharray={active ? "6 4" : undefined}
                        opacity={completed && !active ? 0.55 : 1}
                      >
                        {active && <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="0.6s" repeatCount="indefinite" />}
                      </path>
                      {e.label && (
                        <g>
                          <rect x={midX - 16} y={(y1 + y2) / 2 - 9} width="32" height="18" rx="4" fill="#13131C" stroke="#2A2A3A" />
                          <text x={midX} y={(y1 + y2) / 2 + 4} textAnchor="middle" fontSize="10" fill="#A5B4FC" fontWeight={500}>
                            {e.label}
                          </text>
                        </g>
                      )}
                      {showDuration && (
                        <g>
                          <rect x={midX - 22} y={(y1 + y2) / 2 + (e.label ? 14 : -9)} width="44" height="16" rx="8" fill="#0D1F17" stroke="#10B981" strokeOpacity="0.4" />
                          <text x={midX} y={(y1 + y2) / 2 + (e.label ? 25 : 2)} textAnchor="middle" fontSize="9" fill="#6EE7B7" fontFamily="ui-monospace, monospace" fontWeight={500}>
                            {EDGE_DURATIONS[i] || "—"}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>

              {NODES.map((n) => {
                const s = TYPE_STYLES[n.type];
                const active = selectedId === n.id;
                const state = runState[n.id] || "idle";
                const isRunning = state === "running";
                const isSuccess = state === "success";
                const isError = state === "error";
                const isSkipped = state === "skipped";
                return (
                  <button
                    key={n.id}
                    onClick={() => setSelectedId(n.id)}
                    style={{ left: n.x, top: n.y }}
                    className={`group absolute w-[200px] rounded-xl border bg-[#101019] p-3 text-left transition ${
                      active
                        ? `border-[#6366F1] shadow-2xl shadow-[#6366F1]/20 ring-2 ring-offset-2 ring-offset-[#08080C] ${s.ring}`
                        : "border-white/[0.08] hover:border-white/20"
                    } ${isRunning ? "ring-2 ring-[#6366F1] animate-pulse" : ""} ${isSuccess ? "shadow-lg shadow-[#10B981]/10" : ""} ${isError ? "animate-[shake_0.3s_ease-in-out]" : ""} ${isSkipped ? "opacity-60" : ""}`}
                  >
                    {isRunning && (
                      <span className="pointer-events-none absolute -inset-0.5 rounded-xl ring-2 ring-[#6366F1]/60 animate-ping" />
                    )}
                    {isSuccess && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#10B981] ring-2 ring-[#08080C]">
                        <CheckCircle2 className="h-2.5 w-2.5 text-black" strokeWidth={3} />
                      </span>
                    )}
                    {isError && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#EF4444] ring-2 ring-[#08080C]">
                        <X className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.icon}`}>
                        {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : n.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[12px] font-medium text-white">{n.label}</div>
                        <div className="truncate text-[10.5px] text-neutral-500">{n.sublabel}</div>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-2">
                      <span className={`text-[10px] font-medium uppercase tracking-wider ${s.badge}`}>{s.label}</span>
                      <div className="flex items-center gap-1 text-[10px] text-neutral-500">
                        {isRunning ? (
                          <><Loader2 className="h-2.5 w-2.5 animate-spin text-[#A5B4FC]" /><span className="text-[#A5B4FC]">Running</span></>
                        ) : isSuccess ? (
                          <><CheckCircle2 className="h-2.5 w-2.5 text-[#6EE7B7]" /><span className="text-[#6EE7B7]">{EDGE_DURATIONS[NODES.indexOf(n)] || "ok"}</span></>
                        ) : isError ? (
                          <><XCircle className="h-2.5 w-2.5 text-[#FCA5A5]" /><span className="text-[#FCA5A5]">Failed</span></>
                        ) : isSkipped ? (
                          <><CircleDot className="h-2.5 w-2.5 text-neutral-600" />Skipped</>
                        ) : (
                          <><CircleDot className="h-2.5 w-2.5 text-[#6EE7B7]" />Ready</>
                        )}
                      </div>
                    </div>
                    <div className="absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-[#08080C] bg-[#3F3F55]" />
                    <div className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-[#08080C] bg-[#3F3F55]" />
                  </button>
                );
              })}

              <div className="absolute flex items-center gap-1 text-[11px] text-neutral-600" style={{ left: 1480 + 20, top: 240 }}>
                <Plus className="h-3.5 w-3.5" /> Add step
              </div>
            </div>
          </div>

          <div className={`border-t border-white/5 bg-[#0B0B12] transition-all ${historyOpen ? "h-64" : "h-9"}`}>
            <button
              onClick={() => setHistoryOpen((v) => !v)}
              className="flex w-full items-center justify-between border-b border-white/5 px-3 py-2 text-[11.5px] text-neutral-400 hover:text-white"
            >
              <span className="flex items-center gap-2">
                {historyOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                <Activity className="h-3.5 w-3.5" />
                Execution history
                <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-neutral-500">Last 10 runs</span>
              </span>
              <span className="flex items-center gap-3 text-[10.5px] text-neutral-500">
                <span className="text-[#6EE7B7]">8 success</span>
                <span className="text-[#FCD34D]">1 warning</span>
                <span className="text-[#FCA5A5]">1 error</span>
              </span>
            </button>
            {historyOpen && (
              <div className="h-[calc(100%-37px)] overflow-y-auto">
                <table className="w-full text-[11.5px]">
                  <thead className="sticky top-0 bg-[#0B0B12] text-[10px] uppercase tracking-wider text-neutral-500">
                    <tr>
                      <th className="px-3 py-1.5 text-left font-medium">Status</th>
                      <th className="px-3 py-1.5 text-left font-medium">Trigger</th>
                      <th className="px-3 py-1.5 text-left font-medium">Started</th>
                      <th className="px-3 py-1.5 text-left font-medium">Duration</th>
                      <th className="px-3 py-1.5 text-left font-medium">Records</th>
                      <th className="px-3 py-1.5 text-left font-medium">Run ID</th>
                      <th className="px-3 py-1.5"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {RUNS.map((r) => {
                      const icon =
                        r.status === "success" ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#6EE7B7]" />
                        ) : r.status === "warning" ? (
                          <AlertTriangle className="h-3.5 w-3.5 text-[#FCD34D]" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-[#FCA5A5]" />
                        );
                      return (
                        <tr key={r.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                          <td className="px-3 py-1.5">
                            <span className="flex items-center gap-1.5 capitalize">{icon}{r.status}</span>
                          </td>
                          <td className="px-3 py-1.5 text-neutral-300">{r.trigger}</td>
                          <td className="px-3 py-1.5 text-neutral-500">{r.at}</td>
                          <td className="px-3 py-1.5 font-mono text-neutral-400">{r.duration}</td>
                          <td className="px-3 py-1.5 text-neutral-400">{r.records}</td>
                          <td className="px-3 py-1.5 font-mono text-[10.5px] text-neutral-600">run_8f2{r.id}k3m</td>
                          <td className="px-3 py-1.5 text-right">
                            <button className="rounded p-1 text-neutral-500 hover:bg-white/5 hover:text-white">
                              <MoreHorizontal className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <aside className="flex w-80 flex-col border-l border-white/5 bg-[#0B0B12]">
          {selected ? (
            <>
              <div className="flex items-start justify-between border-b border-white/5 p-3">
                <div className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${TYPE_STYLES[selected.type].icon}`}>{selected.icon}</div>
                  <div>
                    <div className="text-[12px] font-medium text-white">{selected.label}</div>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className={`rounded px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider ${TYPE_STYLES[selected.type].bg} ${TYPE_STYLES[selected.type].badge}`}>
                        {TYPE_STYLES[selected.type].label}
                      </span>
                      <span className="text-[10px] text-neutral-500">{selected.integration}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedId(null)} className="rounded p-1 text-neutral-500 hover:bg-white/5 hover:text-white">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex border-b border-white/5 text-[11.5px]">
                {(["Configure", "Inputs", "Output", "Logs"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`flex-1 px-3 py-2 transition ${activeTab === t ? "border-b-2 border-[#6366F1] text-white" : "text-neutral-500 hover:text-white"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-3">
                {activeTab === "Configure" && (
                  <>
                    {renderConfig(selected.type)}

                    <div>
                      <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                        <Sparkles className="h-3 w-3" /> Available variables
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {VARIABLES.map((v) => (
                          <button
                            key={v.token}
                            onClick={() => copyToken(v.token)}
                            className="group flex items-center gap-1 rounded-md border border-white/5 bg-[#13131C] px-1.5 py-1 font-mono text-[10px] text-[#A5B4FC] transition hover:border-[#6366F1]/40 hover:bg-[#6366F1]/10"
                          >
                            <span>{v.token}</span>
                            <span className="text-neutral-600">:{v.type}</span>
                            {copiedToken === v.token ? (
                              <CheckCircle2 className="h-2.5 w-2.5 text-[#6EE7B7]" />
                            ) : (
                              <Copy className="h-2.5 w-2.5 text-neutral-600 opacity-0 group-hover:opacity-100" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                        <RefreshCw className="h-3 w-3" /> Retry &amp; durability
                      </div>
                      <div className="space-y-1.5 rounded-lg border border-white/5 bg-white/[0.02] p-2.5">
                        <RetryRow icon={<RotateCw className="h-3 w-3 text-[#FDBA74]" />} label="Max attempts" value="3" />
                        <RetryRow icon={<TrendingUp className="h-3 w-3 text-[#A5B4FC]" />} label="Backoff" value="Exponential (2s base)" />
                        <RetryRow icon={<Timer className="h-3 w-3 text-[#5EEAD4]" />} label="Timeout" value="30s" />
                        <RetryRow icon={<Cpu className="h-3 w-3 text-[#C4B5FD]" />} label="Idempotency" value="On (key: contact.id)" />
                      </div>
                    </div>

                    <div>
                      <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Error handling</div>
                      <div className="space-y-1.5">
                        {["Retry on transient errors", "Continue on error", "Alert on failure"].map((o, i) => (
                          <label key={o} className="flex items-center gap-2 rounded border border-white/5 bg-white/[0.02] px-2.5 py-1.5 text-[11.5px] text-neutral-300">
                            <input type="checkbox" defaultChecked={i !== 1} className="accent-[#6366F1]" />
                            {o}
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "Inputs" && (
                  <div className="space-y-2">
                    <div className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">Resolved at runtime</div>
                    <pre className="rounded-md border border-white/5 bg-[#0A0A12] p-2.5 font-mono text-[10.5px] leading-relaxed text-neutral-300">
{`{
  "contact": {
    "email": "alex@acme.io",
    "company": "Acme Corp"
  },
  "enriched": {
    "industry": "SaaS",
    "employees": 240
  }
}`}
                    </pre>
                  </div>
                )}

                {activeTab === "Output" && (
                  <div>
                    <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Output schema</div>
                    <div className="rounded-lg border border-white/5 bg-[#0A0A12] p-2.5 font-mono text-[10.5px]">
                      <div className="text-neutral-500">{"{"}</div>
                      {OUTPUT_SCHEMAS[selected.type].map((row, idx, arr) => (
                        <div key={row.k} className="ml-3 flex items-center justify-between">
                          <span className="text-[#A5B4FC]">&quot;{row.k}&quot;<span className="text-neutral-600">:</span></span>
                          <span className="text-[#FDBA74]">{row.t}{idx < arr.length - 1 ? "," : ""}</span>
                        </div>
                      ))}
                      <div className="text-neutral-500">{"}"}</div>
                    </div>
                  </div>
                )}

                {activeTab === "Logs" && (
                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                      <span>Recent execution</span>
                      <span className="text-neutral-600">run_8f2k3m</span>
                    </div>
                    <div className="space-y-1 rounded-lg border border-white/5 bg-[#0A0A12] p-2">
                      {LOGS_SAMPLE.map((log) => (
                        <div key={log.ts} className="flex gap-2 px-1.5 py-1 font-mono text-[10.5px]">
                          <span className="text-neutral-600">{log.ts}</span>
                          <span className={log.level === "ok" ? "text-[#6EE7B7]" : "text-[#A5B4FC]"}>{log.level.padEnd(4)}</span>
                          <span className="text-neutral-300">{log.msg}</span>
                        </div>
                      ))}
                    </div>
                    <button className="mt-2 flex w-full items-center justify-center gap-1 rounded-md border border-white/5 bg-white/5 py-1.5 text-[11px] text-neutral-300 hover:bg-white/10">
                      <ChevronUp className="h-3 w-3" /> View full log stream
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t border-white/5 p-3">
                <div className="flex items-center gap-2">
                  <button className="flex-1 rounded-md border border-white/5 bg-white/5 py-1.5 text-[11.5px] text-neutral-300 hover:bg-white/10">
                    <span className="inline-flex items-center gap-1.5"><Copy className="h-3 w-3" /> Duplicate</span>
                  </button>
                  <button className="rounded-md border border-white/5 bg-white/5 px-2.5 py-1.5 text-neutral-400 hover:text-[#FCA5A5]">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-white/[0.02]">
                <ArrowRight className="h-4 w-4 text-neutral-600" />
              </div>
              <div className="mt-3 text-[12px] font-medium text-neutral-300">Select a node</div>
              <div className="mt-1 text-[11px] text-neutral-500">Click any step on the canvas to configure it.</div>
            </div>
          )}
        </aside>
      </div>

      {templatesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setTemplatesOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-[860px] max-w-[92vw] overflow-hidden rounded-2xl border border-white/10 bg-[#0D0D14] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 px-5 py-3.5">
              <div>
                <div className="text-sm font-semibold text-white">Template gallery</div>
                <div className="text-[11px] text-neutral-500">Start from 240+ proven workflows</div>
              </div>
              <button onClick={() => setTemplatesOpen(false)} className="rounded p-1 text-neutral-400 hover:bg-white/5 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 p-4">
              {TEMPLATES.map((t) => (
                <button key={t.name} className="group flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-left transition hover:border-[#6366F1]/40 hover:bg-[#6366F1]/5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#6366F1]/20 to-[#8B5CF6]/10 text-[#A5B4FC]">
                    {t.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="truncate text-[12.5px] font-medium text-white">{t.name}</div>
                      <span className="rounded bg-white/5 px-1.5 py-0.5 text-[9.5px] text-neutral-400">{t.tag}</span>
                    </div>
                    <div className="mt-0.5 truncate text-[11px] text-neutral-500">{t.desc}</div>
                    <div className="mt-1.5 text-[10px] text-neutral-600">{t.uses} deploys</div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-neutral-600 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
      `}</style>
    </div>
  );
}

function renderConfig(type: NodeType): React.ReactNode {
  if (type === "ai") {
    return (
      <>
        <ConfigField label="Model" value="gpt-4o" hasOptions />
        <ConfigField label="Temperature" value="0.2" />
        <ConfigTextarea label="System prompt" value={`You are a B2B lead scoring agent. Given an enriched contact profile, return a score 0-100 reflecting fit and intent.`} />
      </>
    );
  }
  if (type === "condition") {
    return (
      <>
        <div className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">Branches</div>
        <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5">
          <div className="text-[11px] font-medium text-white">Yes</div>
          <div className="mt-1 rounded bg-[#13131C] px-2 py-1 font-mono text-[10.5px] text-[#6EE7B7]">{`{{lead.score}} >= 80`}</div>
        </div>
        <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5">
          <div className="text-[11px] font-medium text-white">No (fallback)</div>
          <div className="mt-1 rounded bg-[#13131C] px-2 py-1 font-mono text-[10.5px] text-[#FCA5A5]">{`{{lead.score}} < 80`}</div>
        </div>
      </>
    );
  }
  if (type === "trigger") {
    return (
      <>
        <ConfigField label="Event" value="contact.created" hasOptions />
        <ConfigField label="Portal" value="omni-prod-2847" />
        <ConfigField label="Polling" value="Realtime webhook" />
        <div className="rounded-lg border border-[#10B981]/20 bg-[#10B981]/5 p-2.5 text-[11px] text-[#6EE7B7]">
          <div className="flex items-center gap-1.5 font-medium"><Zap className="h-3 w-3" /> Webhook verified</div>
          <div className="mt-1 break-all font-mono text-[10px] text-[#6EE7B7]/70">hooks.omnios.app/v1/wh_8f2k3m...</div>
        </div>
      </>
    );
  }
  if (type === "loop") {
    return (
      <>
        <ConfigField label="Iterate over" value="{{contact.touchpoints}}" mono hasOptions />
        <ConfigField label="Max iterations" value="10" />
        <ConfigField label="Concurrency" value="Sequential" hasOptions />
      </>
    );
  }
  if (type === "parallel") {
    return (
      <>
        <ConfigField label="Branches" value="3 parallel paths" hasOptions />
        <ConfigField label="Wait strategy" value="All complete" hasOptions />
        <ConfigField label="Failure mode" value="Fail-fast" hasOptions />
      </>
    );
  }
  if (type === "transform") {
    return (
      <>
        <ConfigField label="Language" value="JavaScript (V8)" hasOptions />
        <ConfigTextarea label="Transform fn" value={`return {\n  email: input.contact.email.toLowerCase(),\n  domain: input.contact.email.split('@')[1],\n  scoreBucket: input.lead.score > 80 ? 'A' : 'B'\n};`} />
      </>
    );
  }
  return (
    <>
      <ConfigField label="Channel" value="#sales-hot" />
      <ConfigField label="Mention" value="@sales-ops" />
      <ConfigTextarea label="Message template" value={`New hot lead - {{contact.name}} @ {{contact.company}}\nScore: {{lead.score}}/100 ({{lead.tier}})`} />
    </>
  );
}

function ConfigField({ label, value, hasOptions, mono }: { label: string; value: string; hasOptions?: boolean; mono?: boolean }) {
  return (
    <div>
      <div className="mb-1 text-[10px] font-medium uppercase tracking-wider text-neutral-500">{label}</div>
      <div className={`flex items-center justify-between rounded-md border border-white/5 bg-[#13131C] px-2.5 py-1.5 text-[11.5px] text-white ${mono ? "font-mono text-[10.5px]" : ""}`}>
        <span className="truncate">{value}</span>
        {hasOptions && <ChevronDown className="ml-2 h-3 w-3 flex-shrink-0 text-neutral-500" />}
      </div>
    </div>
  );
}

function ConfigTextarea({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-1 text-[10px] font-medium uppercase tracking-wider text-neutral-500">{label}</div>
      <textarea
        defaultValue={value}
        rows={5}
        className="w-full resize-none rounded-md border border-white/5 bg-[#13131C] px-2.5 py-1.5 font-mono text-[10.5px] leading-relaxed text-neutral-200 outline-none focus:border-[#6366F1]/40"
      />
    </div>
  );
}

function RetryRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[11px]">
      <span className="flex items-center gap-1.5 text-neutral-400">{icon}{label}</span>
      <span className="font-mono text-[10.5px] text-white">{value}</span>
    </div>
  );
}
