"use client";

import { useState, useMemo } from "react";
import {
  CreditCard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  Download,
  Send,
  Eye,
  CheckCircle2,
  Receipt,
  Wallet,
  Building2,
  FileText,
  Search,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Link2,
  Unlink,
  Calendar,
  Filter,
  AlertTriangle,
  RefreshCw,
  Target,
} from "lucide-react";

// ---------- Types ----------
type InvoiceStatus = "paid" | "pending" | "overdue" | "draft";

interface Invoice {
  id: string;
  client: string;
  amount: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
}

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  vendor: string;
  anomaly?: { kind: "warn" | "ok"; message: string };
}

interface ConnectedAccount {
  id: string;
  name: string;
  kind: string;
  connected: boolean;
  balance?: number;
  lastSync?: string;
  description: string;
}

interface Kpi {
  label: string;
  value: string;
  delta: number;
  icon: React.ReactNode;
  tone: "indigo" | "gold" | "green" | "red";
}

interface CashFlowPoint {
  month: string;
  actual: number | null;
  forecast: number | null;
}

interface AgingBucket {
  label: string;
  amount: number;
  count: number;
  tone: "green" | "amber" | "orange" | "red";
  overdue: boolean;
}

// ---------- Mock Data ----------
const INVOICES: Invoice[] = [
  { id: "INV-2026-0048", client: "Acme Corporation",       amount: 48500,  status: "paid",    issueDate: "Apr 01, 2026", dueDate: "Apr 15, 2026" },
  { id: "INV-2026-0047", client: "TechStart Inc",          amount: 12400,  status: "pending", issueDate: "Apr 05, 2026", dueDate: "Apr 20, 2026" },
  { id: "INV-2026-0046", client: "GlobalMedia Ltd",        amount: 28900,  status: "pending", issueDate: "Apr 08, 2026", dueDate: "Apr 22, 2026" },
  { id: "INV-2026-0045", client: "FinanceFlow Capital",    amount: 7600,   status: "overdue", issueDate: "Mar 12, 2026", dueDate: "Mar 30, 2026" },
  { id: "INV-2026-0044", client: "BioSync Laboratories",   amount: 34200,  status: "paid",    issueDate: "Mar 01, 2026", dueDate: "Mar 15, 2026" },
  { id: "INV-2026-0043", client: "Apex Logistics",         amount: 18750,  status: "paid",    issueDate: "Feb 15, 2026", dueDate: "Mar 01, 2026" },
  { id: "INV-2026-0042", client: "Nova Robotics",          amount: 62100,  status: "draft",   issueDate: "Apr 14, 2026", dueDate: "Apr 28, 2026" },
  { id: "INV-2026-0041", client: "Helios Energy",          amount: 95400,  status: "paid",    issueDate: "Feb 03, 2026", dueDate: "Feb 17, 2026" },
  { id: "INV-2026-0040", client: "Quantum Research Group", amount: 22800,  status: "overdue", issueDate: "Mar 05, 2026", dueDate: "Mar 19, 2026" },
  { id: "INV-2026-0039", client: "Stratus Cloud Systems",  amount: 41300,  status: "pending", issueDate: "Apr 10, 2026", dueDate: "Apr 24, 2026" },
];

const EXPENSES: Expense[] = [
  { id: "EXP-0119", category: "Software",    description: "Annual AWS infrastructure",        amount: 18400, date: "Apr 14, 2026", vendor: "Amazon Web Services", anomaly: { kind: "warn", message: "AWS billing +340% vs last month — investigate?" } },
  { id: "EXP-0118", category: "Payroll",     description: "April engineering team payroll",   amount: 92600, date: "Apr 12, 2026", vendor: "Gusto Payroll" },
  { id: "EXP-0117", category: "Marketing",   description: "Q2 performance ad spend",          amount: 14250, date: "Apr 10, 2026", vendor: "Google Ads" },
  { id: "EXP-0116", category: "Software",    description: "Linear, Figma, Notion team seats", amount: 2840,  date: "Apr 08, 2026", vendor: "Multi-vendor",         anomaly: { kind: "ok", message: "SaaS spend normalized after Q1 spike" } },
  { id: "EXP-0115", category: "Office",      description: "San Francisco HQ lease",           amount: 24500, date: "Apr 01, 2026", vendor: "Hines Properties" },
  { id: "EXP-0114", category: "Travel",      description: "Enterprise sales roadshow NYC",    amount: 6780,  date: "Mar 28, 2026", vendor: "American Express" },
  { id: "EXP-0113", category: "Contractors", description: "Brand design sprint",              amount: 12000, date: "Mar 25, 2026", vendor: "Pentagram Studios" },
  { id: "EXP-0112", category: "Legal",       description: "Series B closing fees",            amount: 38900, date: "Mar 20, 2026", vendor: "Cooley LLP" },
];

const CASH_FLOW: CashFlowPoint[] = [
  { month: "Nov", actual: 142000, forecast: null },
  { month: "Dec", actual: 186500, forecast: null },
  { month: "Jan", actual: 164200, forecast: null },
  { month: "Feb", actual: 212400, forecast: null },
  { month: "Mar", actual: 248900, forecast: null },
  { month: "Apr", actual: 298750, forecast: 298750 },
  { month: "May", actual: null,   forecast: 324000 },
  { month: "Jun", actual: null,   forecast: 351200 },
  { month: "Jul", actual: null,   forecast: 372500 },
  { month: "Aug", actual: null,   forecast: 398000 },
  { month: "Sep", actual: null,   forecast: 421400 },
  { month: "Oct", actual: null,   forecast: 446800 },
];

const AGING_BUCKETS: AgingBucket[] = [
  { label: "Current (not yet due)", amount: 47200, count: 12, tone: "green",  overdue: false },
  { label: "1–30 days overdue",     amount: 12800, count: 4,  tone: "amber",  overdue: true  },
  { label: "31–60 days overdue",    amount: 8400,  count: 2,  tone: "orange", overdue: true  },
  { label: "60+ days overdue",      amount: 3100,  count: 1,  tone: "red",    overdue: true  },
];

const CONNECTED_ACCOUNTS: ConnectedAccount[] = [
  { id: "stripe",     name: "Stripe",     kind: "Payments",      connected: true,  balance: 184320,  lastSync: "2 min ago",  description: "Card processing & subscriptions" },
  { id: "mercury",    name: "Mercury",    kind: "Business Bank", connected: true,  balance: 1240800, lastSync: "8 min ago",  description: "Operating & treasury accounts" },
  { id: "quickbooks", name: "QuickBooks", kind: "Accounting",    connected: false,                                           description: "Double-entry bookkeeping" },
  { id: "plaid",      name: "Plaid",      kind: "Banking API",   connected: true,                    lastSync: "1 hour ago", description: "Unified account aggregation" },
];

const STATUS_STYLES: Record<InvoiceStatus, { label: string; bg: string; text: string; dot: string }> = {
  paid:    { label: "Paid",    bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
  pending: { label: "Pending", bg: "bg-amber-500/10",   text: "text-amber-400",   dot: "bg-amber-400" },
  overdue: { label: "Overdue", bg: "bg-rose-500/10",    text: "text-rose-400",    dot: "bg-rose-400" },
  draft:   { label: "Draft",   bg: "bg-zinc-500/10",    text: "text-zinc-400",    dot: "bg-zinc-400" },
};

const CATEGORY_COLORS: Record<string, string> = {
  Software:    "text-indigo-400 bg-indigo-500/10",
  Payroll:     "text-sky-400 bg-sky-500/10",
  Marketing:   "text-pink-400 bg-pink-500/10",
  Office:      "text-amber-400 bg-amber-500/10",
  Travel:      "text-emerald-400 bg-emerald-500/10",
  Contractors: "text-purple-400 bg-purple-500/10",
  Legal:       "text-rose-400 bg-rose-500/10",
};

const AGING_TONES: Record<AgingBucket["tone"], { ring: string; text: string; bar: string; chip: string }> = {
  green:  { ring: "border-emerald-500/30 hover:border-emerald-500/50", text: "text-emerald-400", bar: "bg-emerald-400",  chip: "bg-emerald-500/10 text-emerald-400" },
  amber:  { ring: "border-amber-500/30 hover:border-amber-500/50",     text: "text-amber-400",   bar: "bg-amber-400",    chip: "bg-amber-500/10 text-amber-400" },
  orange: { ring: "border-orange-500/30 hover:border-orange-500/50",   text: "text-orange-400",  bar: "bg-orange-400",   chip: "bg-orange-500/10 text-orange-400" },
  red:    { ring: "border-rose-500/30 hover:border-rose-500/50",       text: "text-rose-400",    bar: "bg-rose-400",     chip: "bg-rose-500/10 text-rose-400" },
};

type FilterTab = "all" | "paid" | "pending" | "overdue" | "draft";

// ---------- Helpers ----------
function formatCurrency(n: number): string {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function formatCurrencyCompact(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

// ---------- Cash Flow Chart ----------
interface CashFlowChartProps {
  data: CashFlowPoint[];
}

function CashFlowChart({ data }: CashFlowChartProps): React.ReactElement {
  const W = 760;
  const H = 240;
  const PAD_L = 48;
  const PAD_R = 16;
  const PAD_T = 16;
  const PAD_B = 28;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  const allValues = data.flatMap((d) => [d.actual ?? 0, d.forecast ?? 0]);
  const maxV = Math.max(...allValues) * 1.1;
  const minV = 0;

  const x = (i: number): number => PAD_L + (i / (data.length - 1)) * innerW;
  const y = (v: number): number => PAD_T + innerH - ((v - minV) / (maxV - minV)) * innerH;

  const actualPts = data.map((d, i) => ({ i, v: d.actual })).filter((p): p is { i: number; v: number } => p.v !== null);
  const forecastPts = data.map((d, i) => ({ i, v: d.forecast })).filter((p): p is { i: number; v: number } => p.v !== null);

  const actualLine = actualPts.map((p, idx) => `${idx === 0 ? "M" : "L"}${x(p.i)},${y(p.v)}`).join(" ");
  const forecastLine = forecastPts.map((p, idx) => `${idx === 0 ? "M" : "L"}${x(p.i)},${y(p.v)}`).join(" ");

  const actualArea =
    `${actualLine} L${x(actualPts[actualPts.length - 1].i)},${y(0)} L${x(actualPts[0].i)},${y(0)} Z`;
  const forecastArea =
    `${forecastLine} L${x(forecastPts[forecastPts.length - 1].i)},${y(0)} L${x(forecastPts[0].i)},${y(0)} Z`;

  const [hover, setHover] = useState<number | null>(null);

  const yTicks = 4;
  const tickValues = Array.from({ length: yTicks + 1 }, (_, i) => (maxV / yTicks) * i);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Cash flow forecast chart">
        <defs>
          <linearGradient id="actualGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="forecastGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </linearGradient>
        </defs>

        {tickValues.map((tv, i) => (
          <g key={i}>
            <line x1={PAD_L} x2={W - PAD_R} y1={y(tv)} y2={y(tv)} stroke="rgba(255,255,255,0.04)" />
            <text x={PAD_L - 8} y={y(tv) + 3} fontSize="9" fill="#52525b" textAnchor="end">
              {formatCurrencyCompact(tv)}
            </text>
          </g>
        ))}

        <rect x={x(5)} y={PAD_T} width={x(11) - x(5)} height={innerH} fill="rgba(245,158,11,0.04)" />
        <line x1={x(5)} x2={x(5)} y1={PAD_T} y2={PAD_T + innerH} stroke="rgba(245,158,11,0.3)" strokeDasharray="3 3" />
        <text x={x(5) + 6} y={PAD_T + 11} fontSize="9" fill="#f59e0b" fontWeight="600">FORECAST →</text>

        <path d={actualArea} fill="url(#actualGrad)" />
        <path d={forecastArea} fill="url(#forecastGrad)" />

        <path d={actualLine} fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d={forecastLine} fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 4" strokeLinecap="round" strokeLinejoin="round" />

        {data.map((d, i) => {
          const v = d.actual ?? d.forecast ?? 0;
          const isForecast = d.actual === null;
          return (
            <g key={d.month}>
              <circle cx={x(i)} cy={y(v)} r={hover === i ? 5 : 3} fill={isForecast ? "#f59e0b" : "#34d399"} stroke="#0F0F18" strokeWidth="2" />
              <rect x={x(i) - 18} y={PAD_T} width={36} height={innerH} fill="transparent" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
              <text x={x(i)} y={H - 8} fontSize="10" fill="#71717a" textAnchor="middle">{d.month}</text>
            </g>
          );
        })}

        {hover !== null && (() => {
          const d = data[hover];
          const v = d.actual ?? d.forecast ?? 0;
          const isForecast = d.actual === null;
          const tx = Math.min(Math.max(x(hover), PAD_L + 60), W - PAD_R - 60);
          return (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={PAD_T} y2={PAD_T + innerH} stroke="rgba(255,255,255,0.15)" strokeDasharray="2 2" />
              <rect x={tx - 56} y={y(v) - 42} width={112} height={32} rx={6} fill="#18181b" stroke="rgba(255,255,255,0.1)" />
              <text x={tx} y={y(v) - 27} fontSize="10" fill="#a1a1aa" textAnchor="middle">{d.month} 2026</text>
              <text x={tx} y={y(v) - 14} fontSize="11" fill={isForecast ? "#f59e0b" : "#34d399"} textAnchor="middle" fontWeight="600">
                {formatCurrency(v)} {isForecast ? "(fcst)" : ""}
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}

// ---------- Page ----------
export default function FinancePage(): React.ReactElement {
  const [filter, setFilter] = useState<FilterTab>("all");
  const [query, setQuery] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredInvoices = useMemo(() => {
    const q = query.trim().toLowerCase();
    return INVOICES.filter((inv) => {
      const matchesFilter = filter === "all" || inv.status === filter;
      const matchesQuery = q === "" || inv.client.toLowerCase().includes(q) || inv.id.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  const totals = useMemo(() => {
    const revenue = INVOICES.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
    const outstanding = INVOICES.filter((i) => i.status === "pending" || i.status === "overdue").reduce((s, i) => s + i.amount, 0);
    const expenses = EXPENSES.reduce((s, e) => s + e.amount, 0);
    const net = revenue - expenses;
    return { revenue, outstanding, expenses, net };
  }, []);

  const kpis: Kpi[] = [
    { label: "Total Revenue (MTD)",  value: formatCurrency(totals.revenue),     delta: 18.4, icon: <DollarSign size={16} />, tone: "indigo" },
    { label: "Outstanding Invoices", value: formatCurrency(totals.outstanding), delta: -6.2, icon: <Receipt size={16} />,    tone: "gold"   },
    { label: "Expenses (MTD)",       value: formatCurrency(totals.expenses),    delta: 4.1,  icon: <Wallet size={16} />,     tone: "red"    },
    { label: "Net Cash Flow",        value: formatCurrency(totals.net),         delta: 22.7, icon: <TrendingUp size={16} />, tone: "green"  },
  ];

  const totalAging = AGING_BUCKETS.reduce((s, b) => s + b.amount, 0);

  function toggleSelect(id: string): void {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <div className="border-b border-white/5 bg-gradient-to-b from-[#0F0F18] to-[#0A0A0F]">
        <div className="max-w-[1400px] mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/5 border border-indigo-500/20 flex items-center justify-center">
              <CreditCard size={20} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-[22px] font-semibold tracking-tight">Finance</h1>
              <p className="text-xs text-zinc-500 mt-0.5">Invoices, revenue, expenses & connected accounts</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-9 px-3 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 border border-white/5 flex items-center gap-2 transition">
              <Calendar size={13} /> April 2026
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-8 space-y-8">
        {/* Quick Action Bar */}
        <section className="rounded-xl bg-gradient-to-r from-indigo-500/10 via-[#0F0F18] to-[#D4AF37]/5 border border-white/5 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
              <Zap size={14} className="text-indigo-400" />
            </div>
            <div>
              <div className="text-xs font-semibold">Quick actions</div>
              <div className="text-[11px] text-zinc-500">Common finance workflows</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-9 px-4 rounded-lg text-xs font-semibold bg-indigo-500 hover:bg-indigo-400 text-white flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition">
              <Plus size={13} /> New Invoice
            </button>
            <button className="h-9 px-4 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/5 text-white flex items-center gap-2 transition">
              <Receipt size={13} /> Record Expense
            </button>
            <button className="h-9 px-4 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/5 text-white flex items-center gap-2 transition">
              <RefreshCw size={13} /> Reconcile
            </button>
            <button className="h-9 px-4 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/5 text-white flex items-center gap-2 transition">
              <Download size={13} /> Export
            </button>
          </div>
        </section>

        {/* KPIs */}
        <section className="grid grid-cols-4 gap-4">
          {kpis.map((kpi) => {
            const up = kpi.delta >= 0;
            const toneBorder =
              kpi.tone === "indigo" ? "hover:border-indigo-500/30" :
              kpi.tone === "gold"   ? "hover:border-[#D4AF37]/30" :
              kpi.tone === "green"  ? "hover:border-emerald-500/30" :
                                      "hover:border-rose-500/30";
            const toneIcon =
              kpi.tone === "indigo" ? "bg-indigo-500/10 text-indigo-400" :
              kpi.tone === "gold"   ? "bg-[#D4AF37]/10 text-[#D4AF37]" :
              kpi.tone === "green"  ? "bg-emerald-500/10 text-emerald-400" :
                                      "bg-rose-500/10 text-rose-400";
            return (
              <div key={kpi.label} className={`group relative rounded-xl bg-[#0F0F18] border border-white/5 p-5 transition ${toneBorder}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${toneIcon}`}>{kpi.icon}</div>
                  <div className={`flex items-center gap-1 text-[11px] font-medium ${up ? "text-emerald-400" : "text-rose-400"}`}>
                    {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {up ? "+" : ""}{kpi.delta.toFixed(1)}%
                  </div>
                </div>
                <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium mb-1.5">{kpi.label}</div>
                <div className="text-2xl font-semibold tracking-tight">{kpi.value}</div>
                <div className="text-[11px] text-zinc-600 mt-1">vs. last month</div>
              </div>
            );
          })}
        </section>

        {/* Cash Flow Forecast */}
        <section className="rounded-xl bg-[#0F0F18] border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold flex items-center gap-2">
                Cash flow forecast
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  <Zap size={9} /> AI confidence: 87%
                </span>
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">12-month view — 6 months actual + 6 months forecasted</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-0.5 bg-emerald-400" />
                <span className="text-zinc-400">Actual</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 border-t-2 border-dashed border-amber-400" />
                <span className="text-zinc-400">Forecast</span>
              </div>
            </div>
          </div>
          <CashFlowChart data={CASH_FLOW} />
        </section>

        {/* Aging Buckets */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold">Invoice aging</h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                {formatCurrency(totalAging)} across {AGING_BUCKETS.reduce((s, b) => s + b.count, 0)} invoices
              </p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {AGING_BUCKETS.map((b) => {
              const t = AGING_TONES[b.tone];
              const pct = (b.amount / totalAging) * 100;
              return (
                <div key={b.label} className={`rounded-xl bg-[#0F0F18] border ${t.ring} p-5 transition`}>
                  <div className="flex items-start justify-between mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider ${t.chip}`}>
                      {b.overdue ? <AlertTriangle size={10} /> : <CheckCircle2 size={10} />}
                      {b.count} inv
                    </span>
                    <span className={`text-[11px] font-medium ${t.text}`}>{pct.toFixed(0)}%</span>
                  </div>
                  <div className={`text-2xl font-semibold tabular-nums ${t.text}`}>{formatCurrency(b.amount)}</div>
                  <div className="text-[11px] text-zinc-500 mt-1">{b.label}</div>
                  <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
                    <div className={`h-full ${t.bar}`} style={{ width: `${pct}%` }} />
                  </div>
                  {b.overdue && (
                    <button className="mt-4 w-full h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[11px] font-semibold text-white flex items-center justify-center gap-1.5 transition">
                      <Send size={11} /> Send reminder
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Recurring Revenue */}
        <section className="rounded-xl bg-[#0F0F18] border border-white/5 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold">Recurring revenue</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Subscription health & retention metrics</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-gradient-to-r from-[#D4AF37]/20 to-amber-500/10 text-[#D4AF37] border border-[#D4AF37]/30">
              <Target size={11} /> $1M ARR milestone
            </span>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-lg bg-[#0A0A0F] border border-white/5 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium">MRR</div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium"><TrendingUp size={11} /> +4.2%</div>
              </div>
              <div className="text-2xl font-semibold tabular-nums">$89,400</div>
              <div className="text-[11px] text-zinc-600 mt-1">Month over month</div>
            </div>
            <div className="rounded-lg bg-[#0A0A0F] border border-[#D4AF37]/20 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium">ARR</div>
                <div className="flex items-center gap-1 text-[11px] text-[#D4AF37] font-medium"><Target size={11} /> Milestone</div>
              </div>
              <div className="text-2xl font-semibold tabular-nums text-[#D4AF37]">$1.07M</div>
              <div className="text-[11px] text-zinc-600 mt-1">Crossed $1M on Apr 03</div>
            </div>
            <div className="rounded-lg bg-[#0A0A0F] border border-white/5 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium">Churn</div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium"><TrendingDown size={11} /> Below avg</div>
              </div>
              <div className="text-2xl font-semibold tabular-nums text-emerald-400">1.8%</div>
              <div className="text-[11px] text-zinc-600 mt-1">Industry avg: 5.2%</div>
            </div>
            <div className="rounded-lg bg-[#0A0A0F] border border-white/5 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium">NRR</div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium"><TrendingUp size={11} /> Expansion</div>
              </div>
              <div className="text-2xl font-semibold tabular-nums">118%</div>
              <div className="text-[11px] text-zinc-600 mt-1">Net revenue retention</div>
            </div>
          </div>
        </section>

        {/* Invoices */}
        <section className="rounded-xl bg-[#0F0F18] border border-white/5 overflow-hidden">
          <div className="p-5 border-b border-white/5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold">Invoices</h2>
              <p className="text-xs text-zinc-500 mt-0.5">{filteredInvoices.length} of {INVOICES.length} invoices</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search invoices..." className="h-9 w-64 pl-9 pr-3 rounded-lg bg-[#0A0A0F] border border-white/5 text-xs placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/40 transition" />
              </div>
              <button className="h-9 px-3 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 border border-white/5 flex items-center gap-2 transition"><Filter size={13} /> Filter</button>
              <button className="h-9 px-4 rounded-lg text-xs font-semibold bg-indigo-500 hover:bg-indigo-400 text-white flex items-center gap-2 transition"><Plus size={13} /> New</button>
            </div>
          </div>

          <div className="px-5 pt-3 flex items-center gap-1 border-b border-white/5">
            {(["all", "paid", "pending", "overdue", "draft"] as FilterTab[]).map((tab) => {
              const count = tab === "all" ? INVOICES.length : INVOICES.filter((i) => i.status === tab).length;
              const active = filter === tab;
              return (
                <button key={tab} onClick={() => setFilter(tab)} className={`relative px-4 py-2.5 text-xs font-medium capitalize transition ${active ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
                  <span className="flex items-center gap-2">
                    {tab}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${active ? "bg-indigo-500/20 text-indigo-300" : "bg-white/5 text-zinc-500"}`}>{count}</span>
                  </span>
                  {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
                </button>
              );
            })}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-zinc-500 border-b border-white/5">
                  <th className="text-left font-medium px-5 py-3 w-10"><input type="checkbox" className="accent-indigo-500" /></th>
                  <th className="text-left font-medium px-3 py-3">Invoice</th>
                  <th className="text-left font-medium px-3 py-3">Client</th>
                  <th className="text-right font-medium px-3 py-3">Amount</th>
                  <th className="text-left font-medium px-3 py-3">Status</th>
                  <th className="text-left font-medium px-3 py-3">Issue Date</th>
                  <th className="text-left font-medium px-3 py-3">Due Date</th>
                  <th className="text-right font-medium px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => {
                  const s = STATUS_STYLES[inv.status];
                  const checked = selectedIds.has(inv.id);
                  return (
                    <tr key={inv.id} className="border-b border-white/5 hover:bg-white/[0.02] transition group">
                      <td className="px-5 py-4"><input type="checkbox" checked={checked} onChange={() => toggleSelect(inv.id)} className="accent-indigo-500" /></td>
                      <td className="px-3 py-4"><span className="font-mono text-xs text-zinc-300">{inv.id}</span></td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-indigo-500/20 to-[#D4AF37]/10 flex items-center justify-center text-[10px] font-semibold text-indigo-300">{inv.client.slice(0, 2).toUpperCase()}</div>
                          <span className="text-sm font-medium">{inv.client}</span>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-right"><span className="text-sm font-semibold tabular-nums">{formatCurrency(inv.amount)}</span></td>
                      <td className="px-3 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium ${s.bg} ${s.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} /> {s.label}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-xs text-zinc-400">{inv.issueDate}</td>
                      <td className="px-3 py-4 text-xs"><span className={inv.status === "overdue" ? "text-rose-400 font-medium" : "text-zinc-400"}>{inv.dueDate}</span></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition">
                          <button title="View" className="w-7 h-7 rounded-md hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition"><Eye size={13} /></button>
                          <button title="Send" className="w-7 h-7 rounded-md hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition"><Send size={13} /></button>
                          <button title="Mark paid" className="w-7 h-7 rounded-md hover:bg-emerald-500/10 flex items-center justify-center text-zinc-400 hover:text-emerald-400 transition"><CheckCircle2 size={13} /></button>
                          <button title="More" className="w-7 h-7 rounded-md hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition"><MoreHorizontal size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredInvoices.length === 0 && (
                  <tr><td colSpan={8} className="px-5 py-16 text-center">
                    <div className="text-sm text-zinc-400">No invoices match your filters</div>
                    <div className="text-xs text-zinc-600 mt-1">Try adjusting your search or filter</div>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Expenses with anomaly badges */}
        <section className="rounded-xl bg-[#0F0F18] border border-white/5 overflow-hidden">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold flex items-center gap-2">
                Expenses
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  <Zap size={9} /> AI anomaly detection
                </span>
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">{EXPENSES.length} transactions this period — {formatCurrency(totals.expenses)} total</p>
            </div>
            <button className="h-9 px-4 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/5 text-white flex items-center gap-2 transition"><Plus size={13} /> Record Expense</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-zinc-500 border-b border-white/5">
                  <th className="text-left font-medium px-5 py-3">Category</th>
                  <th className="text-left font-medium px-3 py-3">Description</th>
                  <th className="text-left font-medium px-3 py-3">Vendor</th>
                  <th className="text-left font-medium px-3 py-3">Date</th>
                  <th className="text-right font-medium px-5 py-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {EXPENSES.map((e) => {
                  const catClass = CATEGORY_COLORS[e.category] ?? "text-zinc-400 bg-white/5";
                  return (
                    <tr key={e.id} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                      <td className="px-5 py-4 align-top"><span className={`inline-flex px-2 py-1 rounded-md text-[11px] font-medium ${catClass}`}>{e.category}</span></td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">{e.description}</span>
                          {e.anomaly && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${e.anomaly.kind === "warn" ? "bg-amber-500/10 text-amber-300 border border-amber-500/30" : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"}`}>
                              {e.anomaly.kind === "warn" ? <AlertTriangle size={10} /> : <CheckCircle2 size={10} />}
                              {e.anomaly.message}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-0.5 font-mono">{e.id}</div>
                      </td>
                      <td className="px-3 py-4 text-xs text-zinc-400 align-top">{e.vendor}</td>
                      <td className="px-3 py-4 text-xs text-zinc-400 align-top">{e.date}</td>
                      <td className="px-5 py-4 text-right align-top"><span className="text-sm font-semibold tabular-nums text-rose-300">-{formatCurrency(e.amount)}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Connected Accounts */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold">Connected accounts</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Financial integrations synced in real time</p>
            </div>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition">Browse integrations <ArrowUpRight size={12} /></button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {CONNECTED_ACCOUNTS.map((a) => (
              <div key={a.id} className={`rounded-xl bg-[#0F0F18] border p-5 transition ${a.connected ? "border-white/5 hover:border-indigo-500/30" : "border-dashed border-white/10 hover:border-[#D4AF37]/40"}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/5 flex items-center justify-center"><Building2 size={17} className="text-zinc-300" /></div>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider ${a.connected ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-500/10 text-zinc-400"}`}>
                    {a.connected ? <Link2 size={10} /> : <Unlink size={10} />}
                    {a.connected ? "Live" : "Off"}
                  </span>
                </div>
                <div className="text-sm font-semibold">{a.name}</div>
                <div className="text-[11px] text-zinc-500 mt-0.5">{a.kind}</div>
                <p className="text-xs text-zinc-400 mt-3 leading-relaxed">{a.description}</p>
                {a.connected ? (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-1.5">
                    {typeof a.balance === "number" && (
                      <div className="flex items-center justify-between text-xs"><span className="text-zinc-500">Balance</span><span className="font-semibold tabular-nums">{formatCurrency(a.balance)}</span></div>
                    )}
                    {a.lastSync && (
                      <div className="flex items-center justify-between text-xs"><span className="text-zinc-500">Last sync</span><span className="text-zinc-300">{a.lastSync}</span></div>
                    )}
                  </div>
                ) : (
                  <button className="mt-4 w-full h-9 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-semibold transition flex items-center justify-center gap-1.5"><Link2 size={12} /> Connect</button>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="h-8" />
      </div>
    </div>
  );
}
