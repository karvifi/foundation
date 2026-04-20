"use client";

import { useState, useRef, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  Zap,
  GitBranch,
  Users,
  Database,
  BrainCircuit,
  Hash,
  LayoutGrid,
  Mail,
  FileSpreadsheet,
  Code2,
  Webhook,
  Package,
  Rocket,
  Share2,
  Settings,
  ChevronRight,
  Check,
  X,
  Monitor,
  Eye,
  Layers,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type GenerationPhase = "idle" | "parsing" | "generating" | "compiling" | "ready";
type NodeKind = "trigger" | "engine" | "connector" | "agent" | "surface" | "policy";
type ViewMode = "builder" | "operator";

interface GraphNode {
  id: string;
  label: string;
  kind: NodeKind;
  description: string;
  packageKey: string;
  x: number;
  y: number;
  status: "pending" | "active" | "done";
  icon: string;
  color: string;
}

interface GraphEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
}

interface SurfaceSection {
  id: string;
  kind: "stat" | "table" | "chart" | "list" | "form" | "kanban";
  title: string;
  data: unknown;
}

interface CompiledSurface {
  type: "crm" | "dashboard" | "form" | "table" | "kanban" | "report" | "chat";
  title: string;
  sections: SurfaceSection[];
}

interface DeployState {
  open: boolean;
  appName: string;
  subdomain: string;
  publicAccess: boolean;
  requireAuth: boolean;
  customDomain: boolean;
  deploying: boolean;
  deployed: boolean;
}

// ─── Icon map ─────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Users,
  Database,
  BrainCircuit,
  Hash,
  LayoutGrid,
  Mail,
  FileSpreadsheet,
  Code2,
  Webhook,
  Package,
  GitBranch,
};

function NodeIcon({ name, size = 14 }: { name: string; size?: number }) {
  const Icon = ICON_MAP[name] ?? Package;
  return <Icon size={size} />;
}

// ─── Preset graph data ────────────────────────────────────────────────────────

function detectIntent(prompt: string): "crm" | "workflow" | "finance" | "generic" {
  const p = prompt.toLowerCase();
  if (/crm|lead|contact|sales|hubspot/.test(p)) return "crm";
  if (/invoice|payment|approv|finance|stripe|quickbooks/.test(p)) return "finance";
  if (/workflow|automate|trigger|pipeline|webhook/.test(p)) return "workflow";
  return "generic";
}

const PRESET_GRAPHS: Record<
  string,
  { nodes: GraphNode[]; edges: GraphEdge[]; surface: CompiledSurface; packages: string[] }
> = {
  crm: {
    nodes: [
      {
        id: "n1", label: "New Contact", kind: "trigger", packageKey: "connector.hubspot",
        description: "Triggers when contact is created", x: 60, y: 170, status: "pending",
        icon: "Users", color: "#10B981",
      },
      {
        id: "n2", label: "Enrich Data", kind: "connector", packageKey: "connector.clearbit",
        description: "Fetch company & social data", x: 250, y: 170, status: "pending",
        icon: "Database", color: "#6366F1",
      },
      {
        id: "n3", label: "Score Lead", kind: "agent", packageKey: "agent.lead_scorer",
        description: "AI scoring 0–100", x: 440, y: 170, status: "pending",
        icon: "BrainCircuit", color: "#8B5CF6",
      },
      {
        id: "n4", label: "Route Lead", kind: "engine", packageKey: "engine.router",
        description: "High/low score branching", x: 630, y: 170, status: "pending",
        icon: "GitBranch", color: "#F59E0B",
      },
      {
        id: "n5", label: "Slack Alert", kind: "connector", packageKey: "connector.slack",
        description: "Notify #sales-hot", x: 820, y: 90, status: "pending",
        icon: "Hash", color: "#A855F7",
      },
      {
        id: "n6", label: "CRM Table", kind: "surface", packageKey: "surface.crm_table",
        description: "Compiled contact surface", x: 820, y: 260, status: "pending",
        icon: "LayoutGrid", color: "#EC4899",
      },
    ],
    edges: [
      { id: "e1", from: "n1", to: "n2" },
      { id: "e2", from: "n2", to: "n3" },
      { id: "e3", from: "n3", to: "n4" },
      { id: "e4", from: "n4", to: "n5", label: "Hot" },
      { id: "e5", from: "n4", to: "n6", label: "Warm" },
    ],
    surface: {
      type: "crm", title: "Sales CRM",
      sections: [
        { id: "s1", kind: "stat", title: "Stats", data: null },
        { id: "s2", kind: "table", title: "Pipeline", data: null },
        { id: "s3", kind: "list", title: "Activity Feed", data: null },
      ],
    },
    packages: [
      "connector.hubspot v2.1", "connector.clearbit v1.3",
      "agent.lead_scorer v1.0", "engine.router v1.5", "surface.crm_table v3.2",
    ],
  },
  workflow: {
    nodes: [
      {
        id: "n1", label: "Webhook Trigger", kind: "trigger", packageKey: "trigger.webhook",
        description: "HTTP POST entry point", x: 60, y: 170, status: "pending",
        icon: "Webhook", color: "#10B981",
      },
      {
        id: "n2", label: "Parse Payload", kind: "engine", packageKey: "engine.parser",
        description: "Extract structured fields", x: 250, y: 170, status: "pending",
        icon: "Code2", color: "#6366F1",
      },
      {
        id: "n3", label: "AI Classify", kind: "agent", packageKey: "agent.classifier",
        description: "Category & priority tagging", x: 440, y: 170, status: "pending",
        icon: "BrainCircuit", color: "#8B5CF6",
      },
      {
        id: "n4", label: "Route", kind: "engine", packageKey: "engine.router",
        description: "Branch by classification", x: 630, y: 170, status: "pending",
        icon: "GitBranch", color: "#F59E0B",
      },
      {
        id: "n5", label: "Send Email", kind: "connector", packageKey: "connector.sendgrid",
        description: "Transactional notification", x: 820, y: 90, status: "pending",
        icon: "Mail", color: "#EC4899",
      },
      {
        id: "n6", label: "Log to Sheet", kind: "connector", packageKey: "connector.sheets",
        description: "Append row to spreadsheet", x: 820, y: 260, status: "pending",
        icon: "FileSpreadsheet", color: "#10B981",
      },
    ],
    edges: [
      { id: "e1", from: "n1", to: "n2" },
      { id: "e2", from: "n2", to: "n3" },
      { id: "e3", from: "n3", to: "n4" },
      { id: "e4", from: "n4", to: "n5", label: "Urgent" },
      { id: "e5", from: "n4", to: "n6", label: "Log" },
    ],
    surface: {
      type: "dashboard", title: "Automation Monitor",
      sections: [
        { id: "s1", kind: "stat", title: "Run Stats", data: null },
        { id: "s2", kind: "table", title: "Recent Runs", data: null },
        { id: "s3", kind: "list", title: "Error Log", data: null },
      ],
    },
    packages: [
      "trigger.webhook v1.0", "engine.parser v2.0", "agent.classifier v1.2",
      "engine.router v1.5", "connector.sendgrid v3.1", "connector.sheets v2.0",
    ],
  },
  finance: {
    nodes: [
      {
        id: "n1", label: "Invoice Created", kind: "trigger", packageKey: "connector.stripe",
        description: "Stripe invoice event", x: 60, y: 170, status: "pending",
        icon: "Webhook", color: "#10B981",
      },
      {
        id: "n2", label: "Validate", kind: "engine", packageKey: "engine.validator",
        description: "Amount & policy checks", x: 250, y: 170, status: "pending",
        icon: "Code2", color: "#6366F1",
      },
      {
        id: "n3", label: "AI Review", kind: "agent", packageKey: "agent.finance_reviewer",
        description: "Anomaly & fraud detection", x: 440, y: 170, status: "pending",
        icon: "BrainCircuit", color: "#8B5CF6",
      },
      {
        id: "n4", label: "Route", kind: "engine", packageKey: "engine.router",
        description: "Auto-approve or escalate", x: 630, y: 170, status: "pending",
        icon: "GitBranch", color: "#F59E0B",
      },
      {
        id: "n5", label: "QuickBooks", kind: "connector", packageKey: "connector.quickbooks",
        description: "Sync approved invoice", x: 820, y: 90, status: "pending",
        icon: "FileSpreadsheet", color: "#EC4899",
      },
      {
        id: "n6", label: "Approval Form", kind: "surface", packageKey: "surface.form",
        description: "Human review interface", x: 820, y: 260, status: "pending",
        icon: "LayoutGrid", color: "#A855F7",
      },
    ],
    edges: [
      { id: "e1", from: "n1", to: "n2" },
      { id: "e2", from: "n2", to: "n3" },
      { id: "e3", from: "n3", to: "n4" },
      { id: "e4", from: "n4", to: "n5", label: "Auto" },
      { id: "e5", from: "n4", to: "n6", label: "Review" },
    ],
    surface: {
      type: "form", title: "Invoice Approval",
      sections: [
        { id: "s1", kind: "form", title: "Invoice Details", data: null },
        { id: "s2", kind: "form", title: "Approval Form", data: null },
        { id: "s3", kind: "list", title: "Audit Log", data: null },
      ],
    },
    packages: [
      "connector.stripe v4.0", "engine.validator v1.1", "agent.finance_reviewer v2.0",
      "engine.router v1.5", "connector.quickbooks v1.8", "surface.form v2.3",
    ],
  },
  generic: {
    nodes: [
      {
        id: "n1", label: "Input Trigger", kind: "trigger", packageKey: "trigger.generic",
        description: "Entry point for events", x: 80, y: 170, status: "pending",
        icon: "Webhook", color: "#10B981",
      },
      {
        id: "n2", label: "AI Classify", kind: "agent", packageKey: "agent.classifier",
        description: "Intent & category detection", x: 310, y: 170, status: "pending",
        icon: "BrainCircuit", color: "#8B5CF6",
      },
      {
        id: "n3", label: "Route Action", kind: "engine", packageKey: "engine.router",
        description: "Branch by classification", x: 540, y: 170, status: "pending",
        icon: "GitBranch", color: "#F59E0B",
      },
      {
        id: "n4", label: "App Surface", kind: "surface", packageKey: "surface.generic",
        description: "Compiled user interface", x: 770, y: 170, status: "pending",
        icon: "LayoutGrid", color: "#EC4899",
      },
    ],
    edges: [
      { id: "e1", from: "n1", to: "n2" },
      { id: "e2", from: "n2", to: "n3" },
      { id: "e3", from: "n3", to: "n4" },
    ],
    surface: {
      type: "dashboard", title: "Application",
      sections: [
        { id: "s1", kind: "stat", title: "Overview", data: null },
        { id: "s2", kind: "table", title: "Data", data: null },
      ],
    },
    packages: [
      "trigger.generic v1.0", "agent.classifier v1.2",
      "engine.router v1.5", "surface.generic v1.0",
    ],
  },
};

// ─── Constants ────────────────────────────────────────────────────────────────

const PHASE_MESSAGES: Record<GenerationPhase, string> = {
  idle: "",
  parsing: "Parsing your intent",
  generating: "Generating capability graph",
  compiling: "Compiling application surface",
  ready: "",
};

const KIND_LABELS: Record<NodeKind, string> = {
  trigger: "Trigger", engine: "Engine", connector: "Connector",
  agent: "Agent", surface: "Surface", policy: "Policy",
};

const EXAMPLE_PROMPTS = [
  "Build a lead scoring CRM with Slack alerts",
  "Create an invoice approval workflow",
  "Make a support ticket triage system",
  "Build a daily digest email pipeline",
  "Create a project kanban with AI sprint planning",
];

const NODE_W = 176;
const NODE_H = 88;
const CANVAS_W = 1060;
const CANVAS_H = 400;

// ─── Edge path helper ─────────────────────────────────────────────────────────

function buildEdgePath(from: GraphNode, to: GraphNode): string {
  const x1 = from.x + NODE_W;
  const y1 = from.y + NODE_H / 2;
  const x2 = to.x;
  const y2 = to.y + NODE_H / 2;
  const cx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
}

// ─── NodeCard ─────────────────────────────────────────────────────────────────

function NodeCard({
  node, visible, selected, onClick,
}: {
  node: GraphNode; visible: boolean; selected: boolean; onClick: () => void;
}) {
  return (
    <foreignObject
      x={node.x}
      y={node.y}
      width={NODE_W}
      height={NODE_H}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.75)",
        transformOrigin: `${node.x + NODE_W / 2}px ${node.y + NODE_H / 2}px`,
        transition: "opacity 280ms ease, transform 280ms ease",
      }}
    >
      <div
        onClick={onClick}
        className={`h-full w-full cursor-pointer rounded-xl border bg-[#13131C] p-3 transition-all duration-150 ${
          selected ? "border-white/30 shadow-lg shadow-black/50" : "border-white/10 hover:border-white/20"
        }`}
        style={{ borderLeftColor: node.color, borderLeftWidth: 3 }}
      >
        <div className="mb-1 flex items-start justify-between gap-1">
          <div className="flex items-center gap-1.5" style={{ color: node.color }}>
            <NodeIcon name={node.icon} size={12} />
            <span className="text-[11px] font-semibold leading-tight text-white">{node.label}</span>
          </div>
          <span
            className="shrink-0 rounded px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide"
            style={{ backgroundColor: node.color + "22", color: node.color }}
          >
            {KIND_LABELS[node.kind]}
          </span>
        </div>
        <p className="mb-0.5 text-[10px] leading-tight text-white/35">{node.packageKey}</p>
        <p className="line-clamp-2 text-[10px] leading-tight text-white/45">{node.description}</p>
      </div>
    </foreignObject>
  );
}

// ─── EdgePath ─────────────────────────────────────────────────────────────────

function EdgePath({
  edge, nodes, visible,
}: {
  edge: GraphEdge; nodes: GraphNode[]; visible: boolean;
}) {
  const fromNode = nodes.find((n) => n.id === edge.from);
  const toNode = nodes.find((n) => n.id === edge.to);
  if (!fromNode || !toNode) return null;

  const d = buildEdgePath(fromNode, toNode);
  const midX = (fromNode.x + NODE_W + toNode.x) / 2;
  const midY = (fromNode.y + NODE_H / 2 + toNode.y + NODE_H / 2) / 2;

  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke="rgba(99,102,241,0.45)"
        strokeWidth={1.5}
        strokeDasharray="1000"
        style={{
          strokeDashoffset: visible ? 0 : 1000,
          transition: "stroke-dashoffset 900ms ease",
        }}
        markerEnd="url(#arrow)"
      />
      {edge.label && (
        <text
          x={midX}
          y={midY - 6}
          textAnchor="middle"
          fill="rgba(255,255,255,0.35)"
          fontSize={9}
          fontFamily="monospace"
        >
          {edge.label}
        </text>
      )}
    </g>
  );
}

// ─── NodeConfigPanel ──────────────────────────────────────────────────────────

function NodeConfigPanel({ node, onClose }: { node: GraphNode; onClose: () => void }) {
  return (
    <div className="absolute right-0 top-0 z-10 flex h-full w-60 flex-col overflow-y-auto border-l border-white/10 bg-[#0D0D14] p-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-semibold text-white">Node Config</span>
        <button onClick={onClose} className="text-white/40 transition-colors hover:text-white">
          <X size={14} />
        </button>
      </div>

      <div
        className="mb-4 rounded-xl border p-3"
        style={{ borderColor: node.color + "44", backgroundColor: node.color + "11" }}
      >
        <div className="mb-1.5 flex items-center gap-2" style={{ color: node.color }}>
          <NodeIcon name={node.icon} size={14} />
          <span className="text-sm font-semibold text-white">{node.label}</span>
        </div>
        <p className="text-xs text-white/45">{node.description}</p>
      </div>

      <div className="mb-4 space-y-3">
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-widest text-white/35">Package</p>
          <div className="flex items-center gap-1.5">
            <Package size={10} className="text-white/25" />
            <span className="font-mono text-xs text-white/60">{node.packageKey}</span>
          </div>
        </div>
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-widest text-white/35">Kind</p>
          <span
            className="rounded px-2 py-0.5 text-[10px] font-bold uppercase"
            style={{ backgroundColor: node.color + "22", color: node.color }}
          >
            {KIND_LABELS[node.kind]}
          </span>
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <p className="text-[10px] uppercase tracking-widest text-white/35">Config</p>
        {["Retry attempts", "Timeout (ms)", "Auth token"].map((field) => (
          <div key={field}>
            <label className="mb-0.5 block text-[10px] text-white/25">{field}</label>
            <input
              className="w-full rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/60 focus:border-white/20 focus:outline-none"
              placeholder="—"
            />
          </div>
        ))}
      </div>

      <button className="flex items-center gap-1 text-xs text-indigo-400 transition-colors hover:text-indigo-300">
        View package docs <ChevronRight size={12} />
      </button>
    </div>
  );
}

// ─── Surface previews ─────────────────────────────────────────────────────────

const MOCK_CONTACTS = [
  { name: "Sarah Chen", company: "Acme Corp", score: 94, stage: "Proposal" },
  { name: "James Park", company: "TechFlow", score: 72, stage: "Discovery" },
  { name: "Mia Torres", company: "Novex", score: 88, stage: "Negotiation" },
  { name: "Luca Romano", company: "Drift Labs", score: 45, stage: "Outreach" },
];

function CRMSurface({ title }: { title: string }) {
  const stats = [
    { label: "Total Contacts", value: "2,847", color: "#10B981" },
    { label: "Hot Leads", value: "23", color: "#8B5CF6" },
    { label: "Pipeline", value: "$892K", color: "#6366F1" },
    { label: "Close Rate", value: "34%", color: "#F59E0B" },
  ];

  return (
    <div className="h-full space-y-4 overflow-y-auto p-4">
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      <div className="grid grid-cols-2 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-white/10 bg-[#13131C] p-3">
            <p className="mb-1 text-[10px] text-white/40">{s.label}</p>
            <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#13131C]">
        <div className="border-b border-white/5 px-3 py-2">
          <span className="text-[11px] font-medium text-white/55">Contact Pipeline</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-[10px] uppercase tracking-wide text-white/25">
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Company</th>
              <th className="px-3 py-2 text-left">Score</th>
              <th className="px-3 py-2 text-left">Stage</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_CONTACTS.map((c) => (
              <tr key={c.name} className="border-t border-white/5 transition-colors hover:bg-white/[0.02]">
                <td className="px-3 py-2 text-xs text-white">{c.name}</td>
                <td className="px-3 py-2 text-xs text-white/45">{c.company}</td>
                <td className="px-3 py-2">
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                    style={{
                      backgroundColor: c.score >= 80 ? "#10B98122" : c.score >= 60 ? "#F59E0B22" : "#EF444422",
                      color: c.score >= 80 ? "#10B981" : c.score >= 60 ? "#F59E0B" : "#EF4444",
                    }}
                  >
                    {c.score}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] text-indigo-400">{c.stage}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#13131C] p-3">
        <p className="mb-2 text-[10px] text-white/30">Activity Feed</p>
        {[
          "Sarah Chen scored 94 — hot lead",
          "James Park entered Discovery stage",
          "Pipeline updated: +$45K",
        ].map((item) => (
          <div key={item} className="flex items-start gap-2 border-t border-white/5 py-1.5 first:border-0">
            <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
            <p className="text-[11px] text-white/45">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardSurface({ title }: { title: string }) {
  const runs = [
    { id: "#1042", status: "success", duration: "1.2s", ts: "2m ago" },
    { id: "#1041", status: "success", duration: "0.8s", ts: "9m ago" },
    { id: "#1040", status: "error", duration: "3.4s", ts: "15m ago" },
    { id: "#1039", status: "success", duration: "1.0s", ts: "22m ago" },
  ];

  return (
    <div className="h-full space-y-4 overflow-y-auto p-4">
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      <div className="grid grid-cols-3 gap-2">
        {[
          { l: "Total Runs", v: "1,042", c: "#10B981" },
          { l: "Success Rate", v: "97.2%", c: "#6366F1" },
          { l: "Avg Duration", v: "1.1s", c: "#F59E0B" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl border border-white/10 bg-[#13131C] p-3">
            <p className="mb-1 text-[10px] text-white/40">{s.l}</p>
            <p className="text-lg font-bold" style={{ color: s.c }}>{s.v}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#13131C]">
        <div className="border-b border-white/5 px-3 py-2">
          <span className="text-[11px] font-medium text-white/55">Recent Runs</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-[10px] uppercase tracking-wide text-white/25">
              <th className="px-3 py-2 text-left">Run</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Duration</th>
              <th className="px-3 py-2 text-left">When</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((r) => (
              <tr key={r.id} className="border-t border-white/5">
                <td className="px-3 py-2 font-mono text-xs text-white/65">{r.id}</td>
                <td className="px-3 py-2">
                  <span className={`text-[10px] font-bold ${r.status === "success" ? "text-emerald-400" : "text-red-400"}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-xs text-white/35">{r.duration}</td>
                <td className="px-3 py-2 text-xs text-white/25">{r.ts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FormSurface({ title }: { title: string }) {
  return (
    <div className="h-full space-y-4 overflow-y-auto p-4">
      <h2 className="text-sm font-semibold text-white">{title}</h2>

      <div className="space-y-3 rounded-xl border border-white/10 bg-[#13131C] p-4">
        <p className="mb-2 text-[10px] uppercase tracking-widest text-white/35">Invoice Details</p>
        {["Invoice #", "Amount", "Vendor", "Due Date"].map((f) => (
          <div key={f}>
            <label className="mb-1 block text-[10px] text-white/35">{f}</label>
            <div className="rounded border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/35">—</div>
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-xl border border-white/10 bg-[#13131C] p-4">
        <p className="mb-2 text-[10px] uppercase tracking-widest text-white/35">Approval Decision</p>
        <div className="flex gap-2">
          <button className="flex-1 rounded-lg border border-emerald-500/30 bg-emerald-500/15 py-2 text-xs text-emerald-400 transition-colors hover:bg-emerald-500/25">
            Approve
          </button>
          <button className="flex-1 rounded-lg border border-red-500/30 bg-red-500/15 py-2 text-xs text-red-400 transition-colors hover:bg-red-500/25">
            Reject
          </button>
        </div>
        <textarea
          className="w-full resize-none rounded border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/35 focus:outline-none"
          placeholder="Add a note..."
          rows={3}
        />
      </div>

      <div className="rounded-xl border border-white/10 bg-[#13131C] p-3">
        <p className="mb-2 text-[10px] text-white/30">Audit Log</p>
        {["Submitted by system", "AI review: no anomalies", "Routed for human approval"].map((item) => (
          <div key={item} className="flex items-start gap-2 border-t border-white/5 py-1.5 first:border-0">
            <Check size={10} className="mt-0.5 shrink-0 text-emerald-400" />
            <p className="text-[11px] text-white/40">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function GenericSurface({ title }: { title: string }) {
  return (
    <div className="h-full space-y-4 overflow-y-auto p-4">
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      <div className="grid grid-cols-2 gap-2">
        {[
          { l: "Events", v: "4,201", c: "#10B981" },
          { l: "Actions", v: "3,887", c: "#6366F1" },
          { l: "Success", v: "99.1%", c: "#8B5CF6" },
          { l: "Latency", v: "42ms", c: "#F59E0B" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl border border-white/10 bg-[#13131C] p-3">
            <p className="mb-1 text-[10px] text-white/40">{s.l}</p>
            <p className="text-lg font-bold" style={{ color: s.c }}>{s.v}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-white/10 bg-[#13131C] p-3">
        <p className="mb-2 text-[10px] text-white/30">Data</p>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between border-t border-white/5 py-1.5 first:border-0">
            <span className="text-xs text-white/45">Event #{1000 + i}</span>
            <span className="text-[10px] font-bold text-emerald-400">success</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompiledSurfaceView({ surface }: { surface: CompiledSurface }) {
  if (surface.type === "crm") return <CRMSurface title={surface.title} />;
  if (surface.type === "form") return <FormSurface title={surface.title} />;
  if (surface.type === "dashboard") return <DashboardSurface title={surface.title} />;
  return <GenericSurface title={surface.title} />;
}

// ─── DeployModal ──────────────────────────────────────────────────────────────

function DeployModal({
  state, onChange, onClose, onDeploy,
}: {
  state: DeployState;
  onChange: (patch: Partial<DeployState>) => void;
  onClose: () => void;
  onDeploy: () => void;
}) {
  if (!state.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0D0D14] p-6 shadow-2xl">
        {state.deployed ? (
          <div className="py-4 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/15">
              <Check size={20} className="text-emerald-400" />
            </div>
            <p className="mb-1 font-semibold text-white">Deployed!</p>
            <p className="font-mono text-sm text-emerald-400">{state.subdomain}.omnios.app</p>
            <button
              onClick={onClose}
              className="mt-4 text-xs text-white/35 transition-colors hover:text-white"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Rocket size={16} className="text-indigo-400" />
                <span className="text-sm font-semibold text-white">Deploy Application</span>
              </div>
              <button onClick={onClose} className="text-white/35 transition-colors hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-widest text-white/35">App Name</label>
                <input
                  value={state.appName}
                  onChange={(e) => onChange({ appName: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-indigo-500/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-widest text-white/35">Subdomain</label>
                <div className="flex items-center">
                  <input
                    value={state.subdomain}
                    onChange={(e) => onChange({ subdomain: e.target.value })}
                    className="flex-1 rounded-l-lg border border-r-0 border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-indigo-500/50 focus:outline-none"
                  />
                  <span className="shrink-0 rounded-r-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/30">
                    .omnios.app
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { key: "publicAccess" as const, label: "Enable public access" },
                  { key: "requireAuth" as const, label: "Require authentication" },
                  { key: "customDomain" as const, label: "Custom domain" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex cursor-pointer items-center gap-2">
                    <div
                      onClick={() => onChange({ [key]: !state[key] })}
                      className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                        state[key] ? "border-indigo-500 bg-indigo-600" : "border-white/10 bg-white/5"
                      }`}
                    >
                      {state[key] && <Check size={10} className="text-white" />}
                    </div>
                    <span className="text-xs text-white/55">{label}</span>
                  </label>
                ))}
              </div>

              <button
                onClick={onDeploy}
                disabled={state.deploying}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {state.deploying ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Rocket size={14} /> Deploy now
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function ComposerInner() {
  const searchParams = useSearchParams();
  const [intent, setIntent] = useState(() => searchParams.get("q") ?? "");
  const [phase, setPhase] = useState<GenerationPhase>("idle");
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [visibleNodes, setVisibleNodes] = useState<Set<string>>(new Set());
  const [edgesVisible, setEdgesVisible] = useState(false);
  const [surface, setSurface] = useState<CompiledSurface | null>(null);
  const [surfaceVisible, setSurfaceVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("builder");
  const [packages, setPackages] = useState<string[]>([]);
  const [readyLabel, setReadyLabel] = useState("");
  const [dots, setDots] = useState("");
  const [deployState, setDeployState] = useState<DeployState>({
    open: false, appName: "", subdomain: "",
    publicAccess: true, requireAuth: false, customDomain: false,
    deploying: false, deployed: false,
  });

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const dotsInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoTriggered = useRef(false);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  // Auto-trigger generation when navigated from Intent Bar
  useEffect(() => {
    const q = searchParams.get("q");
    if (q && !autoTriggered.current) {
      autoTriggered.current = true;
      generateFromIntent(q);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animate dots during loading phases
  useEffect(() => {
    if (dotsInterval.current) clearInterval(dotsInterval.current);
    if (phase === "idle" || phase === "ready") {
      setDots("");
      return;
    }
    dotsInterval.current = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 400);
    return () => {
      if (dotsInterval.current) clearInterval(dotsInterval.current);
    };
  }, [phase]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const generateFromIntent = useCallback(
    (prompt: string) => {
      if (!prompt.trim()) return;
      clearTimers();

      // Reset state
      setSelectedNode(null);
      setNodes([]);
      setEdges([]);
      setVisibleNodes(new Set());
      setEdgesVisible(false);
      setSurface(null);
      setSurfaceVisible(false);
      setPackages([]);

      const intentKey = detectIntent(prompt);
      const preset = PRESET_GRAPHS[intentKey];

      // Phase 1 — parsing (600ms)
      setPhase("parsing");

      const t1 = setTimeout(() => {
        // Phase 2 — generating graph (1200ms)
        setPhase("generating");
        const freshNodes = preset.nodes.map((n) => ({ ...n, status: "pending" as const }));
        setNodes(freshNodes);
        setEdges(preset.edges);

        freshNodes.forEach((n, i) => {
          const t = setTimeout(() => {
            setVisibleNodes((prev) => new Set([...prev, n.id]));
          }, i * 150);
          timers.current.push(t);
        });

        const staggerEnd = freshNodes.length * 150 + 200;

        const t2 = setTimeout(() => {
          setEdgesVisible(true);

          // Phase 3 — compiling surface (800ms)
          const t3 = setTimeout(() => {
            setPhase("compiling");
            setSurface(preset.surface);
            setPackages(preset.packages);

            const t4 = setTimeout(() => {
              setSurfaceVisible(true);

              // Phase 4 — ready
              const t5 = setTimeout(() => {
                setPhase("ready");
                const label =
                  intentKey === "crm" ? "CRM" :
                  intentKey === "finance" ? "invoice workflow" :
                  intentKey === "workflow" ? "automation dashboard" : "application";
                setReadyLabel(label);
                setDeployState((s) => ({
                  ...s,
                  appName: preset.surface.title,
                  subdomain: preset.surface.title.toLowerCase().replace(/\s+/g, "-"),
                  deployed: false,
                }));
              }, 400);
              timers.current.push(t5);
            }, 800);
            timers.current.push(t4);
          }, 1200);
          timers.current.push(t3);
        }, staggerEnd);
        timers.current.push(t2);
      }, 600);
      timers.current.push(t1);
    },
    [clearTimers],
  );

  function handleRun(prompt: string) {
    setPhase("idle");
    generateFromIntent(prompt);
  }

  function handleDeploy() {
    setDeployState((s) => ({ ...s, deploying: true }));
    setTimeout(() => {
      setDeployState((s) => ({ ...s, deploying: false, deployed: true }));
    }, 2000);
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#080810] text-white">
      {/* ── Intent bar ── */}
      <div className="shrink-0 px-4 pb-3 pt-4">
        <div className="rounded-2xl border border-white/10 bg-[#0D0D14] px-6 py-4">
          <div className="flex items-center gap-4">
            <Sparkles
              size={18}
              className="shrink-0 text-violet-400"
              aria-hidden="true"
              style={{ animation: "pulse 2s ease-in-out infinite" }}
            />
            <input
              aria-label="Describe what you want to build"
              className="flex-1 bg-transparent text-sm text-white placeholder-white/20 focus:outline-none"
              placeholder="Describe what you want to build... e.g. 'Build me a CRM for my sales team'"
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRun(intent);
              }}
            />
            <button
              onClick={() => handleRun(intent)}
              disabled={!intent.trim() || (phase !== "idle" && phase !== "ready")}
              className="flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-40"
              aria-label="Generate graph"
            >
              Generate <Zap size={12} aria-hidden="true" />
            </button>
          </div>

          {/* Example prompt chips */}
          <div className="mt-3 flex flex-wrap gap-2" role="list" aria-label="Example prompts">
            {EXAMPLE_PROMPTS.map((p) => (
              <button
                key={p}
                role="listitem"
                onClick={() => {
                  setIntent(p);
                  handleRun(p);
                }}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/45 transition-all hover:border-white/20 hover:text-white"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Phase status bar */}
        {phase !== "idle" && (
          <div className="mt-2 flex items-center gap-4 px-1" aria-live="polite" aria-atomic="true">
            {phase !== "ready" ? (
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-indigo-500/40 border-t-indigo-400" aria-hidden="true" />
                <span className="text-xs text-white/45">
                  {PHASE_MESSAGES[phase]}{dots}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Check size={12} className="text-emerald-400" aria-hidden="true" />
                  <span className="text-xs font-medium text-emerald-400">
                    Ready — your {readyLabel} is live
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDeployState((s) => ({ ...s, open: true, deployed: false }))}
                    className="flex items-center gap-1 rounded-lg border border-indigo-500/40 bg-indigo-600/70 px-3 py-1 text-xs font-medium transition-colors hover:bg-indigo-600"
                    aria-label="Deploy application"
                  >
                    <Rocket size={11} aria-hidden="true" /> Deploy
                  </button>
                  <button
                    className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55 transition-colors hover:bg-white/10"
                    aria-label="Customize"
                  >
                    <Settings size={11} aria-hidden="true" /> Customize
                  </button>
                  <button
                    className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55 transition-colors hover:bg-white/10"
                    aria-label="Share"
                  >
                    <Share2 size={11} aria-hidden="true" /> Share
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Main workspace ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Graph canvas */}
        {viewMode === "builder" && (
          <div className="relative flex-1 overflow-hidden border-r border-white/10">
            {/* Dot grid background */}
            <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
              <defs>
                <pattern id="dotgrid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="0.8" fill="rgba(255,255,255,0.055)" />
                </pattern>
                <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="rgba(99,102,241,0.55)" />
                </marker>
              </defs>
              <rect width="100%" height="100%" fill="url(#dotgrid)" />
            </svg>

            {/* Graph SVG */}
            {nodes.length > 0 && (
              <svg
                width={CANVAS_W}
                height={CANVAS_H}
                className="absolute left-6 top-1/2 -translate-y-1/2"
                overflow="visible"
                role="img"
                aria-label="Capability graph"
              >
                {edges.map((edge) => (
                  <EdgePath key={edge.id} edge={edge} nodes={nodes} visible={edgesVisible} />
                ))}
                {nodes.map((node) => (
                  <NodeCard
                    key={node.id}
                    node={node}
                    visible={visibleNodes.has(node.id)}
                    selected={selectedNode?.id === node.id}
                    onClick={() => setSelectedNode(selectedNode?.id === node.id ? null : node)}
                  />
                ))}
              </svg>
            )}

            {/* Empty state */}
            {nodes.length === 0 && phase === "idle" && (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <Layers size={20} className="text-white/18" aria-hidden="true" />
                </div>
                <p className="text-sm text-white/18">Your graph will appear here</p>
              </div>
            )}

            {/* Node config panel */}
            {selectedNode && (
              <NodeConfigPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
            )}

            {/* Package pills */}
            {packages.length > 0 && (
              <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5" aria-label="Installed packages">
                {packages.map((pkg) => (
                  <span
                    key={pkg}
                    className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/28"
                  >
                    {pkg}
                  </span>
                ))}
              </div>
            )}

            {/* Minimap */}
            {nodes.length > 0 && (
              <div
                className="absolute bottom-3 right-3 h-14 w-24 overflow-hidden rounded-lg border border-white/10 bg-[#0D0D14] opacity-55"
                aria-hidden="true"
              >
                <svg width="100%" height="100%" viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}>
                  {nodes.map((n) => (
                    <rect
                      key={n.id}
                      x={n.x} y={n.y}
                      width={NODE_W} height={NODE_H}
                      rx={8}
                      fill={n.color}
                      opacity={0.35}
                    />
                  ))}
                </svg>
              </div>
            )}
          </div>
        )}

        {/* Surface preview */}
        <div className={`flex flex-col overflow-hidden ${viewMode === "builder" ? "w-1/2" : "flex-1"}`}>
          {/* Surface header */}
          <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Monitor size={13} className="text-white/28" aria-hidden="true" />
              <span className="text-xs text-white/35">This is what your users will see</span>
            </div>
            <div
              className="flex items-center gap-0.5 rounded-lg border border-white/10 bg-white/5 p-0.5"
              role="group"
              aria-label="View mode"
            >
              {(["builder", "operator"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium capitalize transition-all ${
                    viewMode === mode ? "bg-indigo-600 text-white" : "text-white/38 hover:text-white/65"
                  }`}
                  aria-pressed={viewMode === mode}
                >
                  {mode === "builder" ? <LayoutGrid size={10} aria-hidden="true" /> : <Eye size={10} aria-hidden="true" />}
                  {mode === "builder" ? "Builder" : "Operator"}
                </button>
              ))}
            </div>
          </div>

          {/* Surface body */}
          <div
            className="flex-1 overflow-hidden transition-opacity duration-500"
            style={{ opacity: surfaceVisible ? 1 : 0 }}
          >
            {surface ? (
              <CompiledSurfaceView surface={surface} />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <Eye size={20} className="text-white/18" aria-hidden="true" />
                </div>
                <p className="text-sm text-white/18">Surface preview will appear here</p>
              </div>
            )}
          </div>

          {/* Surface footer */}
          {surface && surfaceVisible && (
            <div className="shrink-0 flex items-center gap-2 border-t border-white/5 px-4 py-2" aria-live="polite">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" aria-hidden="true" />
              <span className="font-mono text-[10px] text-white/20">
                Powered by OmniOS · Graph: v1 · {phase === "ready" ? "Deployed" : "Preview"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Deploy modal */}
      <DeployModal
        state={deployState}
        onChange={(patch) => setDeployState((s) => ({ ...s, ...patch }))}
        onClose={() => setDeployState((s) => ({ ...s, open: false }))}
        onDeploy={handleDeploy}
      />
    </div>
  );
}

export default function ComposerPage() {
  return (
    <Suspense>
      <ComposerInner />
    </Suspense>
  );
}
