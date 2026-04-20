"use client";

import { useState, useMemo, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  Activity,
  Heart,
  Download,
  Filter,
  Calendar,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  UserPlus,
  Zap,
  Search,
  ChevronDown,
  MoreHorizontal,
  BarChart3,
  AlertTriangle,
  Share2,
  Bell,
  Brain,
  X,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

type DateRange = "7D" | "30D" | "90D" | "1Y" | "Custom";

interface KpiSegment {
  label: string;
  pct: number;
  color: string;
}

interface KpiCard {
  label: string;
  value: string;
  delta: string;
  up: boolean;
  icon: typeof Users;
  spark: number[];
  segments: KpiSegment[];
  prevValue: string;
  insight: string;
}

const kpiByRange: Record<DateRange, KpiCard[]> = {
  "7D": [
    {
      label: "Total Revenue",
      value: "$38K",
      delta: "+6.2%",
      up: true,
      icon: DollarSign,
      spark: [12, 18, 22, 16, 28, 34, 40],
      segments: [
        { label: "Email", pct: 34, color: "#6366F1" },
        { label: "Organic", pct: 28, color: "#8B5CF6" },
        { label: "Paid", pct: 21, color: "#EC4899" },
        { label: "Referral", pct: 17, color: "#F59E0B" },
      ],
      prevValue: "$35.8K",
      insight: "This 6.2% lift correlates with your new email campaign launched April 8.",
    },
    {
      label: "Active Users",
      value: "1,204",
      delta: "+4.1%",
      up: true,
      icon: Users,
      spark: [820, 880, 910, 940, 1010, 1090, 1204],
      segments: [
        { label: "Returning", pct: 58, color: "#6366F1" },
        { label: "New", pct: 32, color: "#8B5CF6" },
        { label: "Reactivated", pct: 10, color: "#EC4899" },
      ],
      prevValue: "1,156",
      insight: "Returning user share up 4pts, suggesting onboarding tweaks are paying off.",
    },
    {
      label: "Conversion Rate",
      value: "3.4%",
      delta: "-0.1%",
      up: false,
      icon: Target,
      spark: [3.6, 3.5, 3.5, 3.4, 3.4, 3.3, 3.4],
      segments: [
        { label: "Self-Serve", pct: 48, color: "#6366F1" },
        { label: "Sales-Assisted", pct: 32, color: "#8B5CF6" },
        { label: "Partner", pct: 20, color: "#EC4899" },
      ],
      prevValue: "3.5%",
      insight: "Slight dip likely tied to the pricing experiment running on /pricing variant B.",
    },
    {
      label: "Avg Deal Size",
      value: "$24K",
      delta: "+9.8%",
      up: true,
      icon: Activity,
      spark: [20, 21, 22, 23, 22, 23, 24],
      segments: [
        { label: "Enterprise", pct: 62, color: "#6366F1" },
        { label: "Mid-Market", pct: 28, color: "#8B5CF6" },
        { label: "SMB", pct: 10, color: "#EC4899" },
      ],
      prevValue: "$21.8K",
      insight: "Enterprise mix grew 6pts after the platform tier launched.",
    },
    {
      label: "NPS Score",
      value: "64",
      delta: "+1",
      up: true,
      icon: Heart,
      spark: [60, 61, 62, 62, 63, 63, 64],
      segments: [
        { label: "Promoters", pct: 71, color: "#10B981" },
        { label: "Passives", pct: 22, color: "#F59E0B" },
        { label: "Detractors", pct: 7, color: "#EF4444" },
      ],
      prevValue: "63",
      insight: "Detractor share fell 2pts after the latency fixes shipped April 12.",
    },
  ],
  "30D": [
    {
      label: "Total Revenue",
      value: "$142K MTD",
      delta: "+12%",
      up: true,
      icon: DollarSign,
      spark: [62, 74, 68, 82, 91, 88, 104, 112, 108, 124, 131, 142],
      segments: [
        { label: "Email", pct: 34, color: "#6366F1" },
        { label: "Organic", pct: 28, color: "#8B5CF6" },
        { label: "Paid", pct: 21, color: "#EC4899" },
        { label: "Referral", pct: 17, color: "#F59E0B" },
      ],
      prevValue: "$127K",
      insight: "This 12% lift correlates with your new email campaign launched April 8.",
    },
    {
      label: "Active Users",
      value: "2,847",
      delta: "+8%",
      up: true,
      icon: Users,
      spark: [2100, 2210, 2280, 2360, 2440, 2510, 2620, 2700, 2750, 2790, 2820, 2847],
      segments: [
        { label: "Returning", pct: 54, color: "#6366F1" },
        { label: "New", pct: 36, color: "#8B5CF6" },
        { label: "Reactivated", pct: 10, color: "#EC4899" },
      ],
      prevValue: "2,636",
      insight: "Activation funnel improvements drove 8% MoM growth.",
    },
    {
      label: "Conversion Rate",
      value: "3.2%",
      delta: "-0.4%",
      up: false,
      icon: Target,
      spark: [3.6, 3.5, 3.5, 3.4, 3.3, 3.3, 3.2, 3.2, 3.1, 3.2, 3.2, 3.2],
      segments: [
        { label: "Self-Serve", pct: 46, color: "#6366F1" },
        { label: "Sales-Assisted", pct: 34, color: "#8B5CF6" },
        { label: "Partner", pct: 20, color: "#EC4899" },
      ],
      prevValue: "3.6%",
      insight: "Self-serve conversion soft; consider revisiting onboarding step 3.",
    },
    {
      label: "Avg Deal Size",
      value: "$28K",
      delta: "+15%",
      up: true,
      icon: Activity,
      spark: [22, 23, 24, 24, 25, 26, 26, 27, 27, 28, 28, 28],
      segments: [
        { label: "Enterprise", pct: 58, color: "#6366F1" },
        { label: "Mid-Market", pct: 30, color: "#8B5CF6" },
        { label: "SMB", pct: 12, color: "#EC4899" },
      ],
      prevValue: "$24.3K",
      insight: "Enterprise expansion bookings drove the lift.",
    },
    {
      label: "NPS Score",
      value: "67",
      delta: "+3",
      up: true,
      icon: Heart,
      spark: [60, 61, 62, 63, 64, 64, 65, 66, 66, 67, 67, 67],
      segments: [
        { label: "Promoters", pct: 73, color: "#10B981" },
        { label: "Passives", pct: 21, color: "#F59E0B" },
        { label: "Detractors", pct: 6, color: "#EF4444" },
      ],
      prevValue: "64",
      insight: "Promoter share crossed 70% for the first time this quarter.",
    },
  ],
  "90D": [
    {
      label: "Total Revenue",
      value: "$418K",
      delta: "+22%",
      up: true,
      icon: DollarSign,
      spark: [180, 210, 245, 268, 302, 331, 348, 372, 389, 401, 412, 418],
      segments: [
        { label: "Email", pct: 31, color: "#6366F1" },
        { label: "Organic", pct: 30, color: "#8B5CF6" },
        { label: "Paid", pct: 22, color: "#EC4899" },
        { label: "Referral", pct: 17, color: "#F59E0B" },
      ],
      prevValue: "$343K",
      insight: "Compounding 14.2% weekly growth over the trailing 30 days.",
    },
    {
      label: "Active Users",
      value: "7,612",
      delta: "+18%",
      up: true,
      icon: Users,
      spark: [4800, 5100, 5400, 5700, 6000, 6300, 6600, 6900, 7100, 7300, 7500, 7612],
      segments: [
        { label: "Returning", pct: 56, color: "#6366F1" },
        { label: "New", pct: 34, color: "#8B5CF6" },
        { label: "Reactivated", pct: 10, color: "#EC4899" },
      ],
      prevValue: "6,452",
      insight: "Quarterly cohort retention is the strongest in 18 months.",
    },
    {
      label: "Conversion Rate",
      value: "3.0%",
      delta: "-0.7%",
      up: false,
      icon: Target,
      spark: [3.7, 3.6, 3.5, 3.4, 3.3, 3.2, 3.1, 3.1, 3.0, 3.0, 3.0, 3.0],
      segments: [
        { label: "Self-Serve", pct: 44, color: "#6366F1" },
        { label: "Sales-Assisted", pct: 36, color: "#8B5CF6" },
        { label: "Partner", pct: 20, color: "#EC4899" },
      ],
      prevValue: "3.7%",
      insight: "Volume up 18% so absolute conversions still grew despite rate dip.",
    },
    {
      label: "Avg Deal Size",
      value: "$31K",
      delta: "+24%",
      up: true,
      icon: Activity,
      spark: [25, 26, 27, 27, 28, 29, 29, 30, 30, 31, 31, 31],
      segments: [
        { label: "Enterprise", pct: 60, color: "#6366F1" },
        { label: "Mid-Market", pct: 28, color: "#8B5CF6" },
        { label: "SMB", pct: 12, color: "#EC4899" },
      ],
      prevValue: "$25K",
      insight: "Platform tier accounts for 38% of new bookings.",
    },
    {
      label: "NPS Score",
      value: "69",
      delta: "+5",
      up: true,
      icon: Heart,
      spark: [62, 63, 64, 65, 66, 66, 67, 67, 68, 68, 69, 69],
      segments: [
        { label: "Promoters", pct: 75, color: "#10B981" },
        { label: "Passives", pct: 20, color: "#F59E0B" },
        { label: "Detractors", pct: 5, color: "#EF4444" },
      ],
      prevValue: "64",
      insight: "Five-point quarterly gain — best in company history.",
    },
  ],
  "1Y": [
    {
      label: "Total Revenue",
      value: "$1.62M",
      delta: "+48%",
      up: true,
      icon: DollarSign,
      spark: [92, 108, 140, 172, 198, 220, 248, 276, 311, 348, 384, 418],
      segments: [
        { label: "Email", pct: 30, color: "#6366F1" },
        { label: "Organic", pct: 32, color: "#8B5CF6" },
        { label: "Paid", pct: 22, color: "#EC4899" },
        { label: "Referral", pct: 16, color: "#F59E0B" },
      ],
      prevValue: "$1.09M",
      insight: "Annual growth tracking 12pts ahead of board target.",
    },
    {
      label: "Active Users",
      value: "24,108",
      delta: "+62%",
      up: true,
      icon: Users,
      spark: [9000, 11000, 13000, 14500, 16000, 17500, 19000, 20500, 21500, 22500, 23500, 24108],
      segments: [
        { label: "Returning", pct: 58, color: "#6366F1" },
        { label: "New", pct: 32, color: "#8B5CF6" },
        { label: "Reactivated", pct: 10, color: "#EC4899" },
      ],
      prevValue: "14,880",
      insight: "User base nearly doubled YoY with healthy retention curves.",
    },
    {
      label: "Conversion Rate",
      value: "2.9%",
      delta: "-1.2%",
      up: false,
      icon: Target,
      spark: [4.1, 4.0, 3.8, 3.7, 3.5, 3.4, 3.3, 3.2, 3.1, 3.0, 2.9, 2.9],
      segments: [
        { label: "Self-Serve", pct: 42, color: "#6366F1" },
        { label: "Sales-Assisted", pct: 38, color: "#8B5CF6" },
        { label: "Partner", pct: 20, color: "#EC4899" },
      ],
      prevValue: "4.1%",
      insight: "Top-of-funnel grew faster than activation; investigate qualification.",
    },
    {
      label: "Avg Deal Size",
      value: "$34K",
      delta: "+41%",
      up: true,
      icon: Activity,
      spark: [22, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34],
      segments: [
        { label: "Enterprise", pct: 62, color: "#6366F1" },
        { label: "Mid-Market", pct: 28, color: "#8B5CF6" },
        { label: "SMB", pct: 10, color: "#EC4899" },
      ],
      prevValue: "$24K",
      insight: "Upmarket motion delivered $10K ACV expansion YoY.",
    },
    {
      label: "NPS Score",
      value: "71",
      delta: "+9",
      up: true,
      icon: Heart,
      spark: [58, 60, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71],
      segments: [
        { label: "Promoters", pct: 77, color: "#10B981" },
        { label: "Passives", pct: 19, color: "#F59E0B" },
        { label: "Detractors", pct: 4, color: "#EF4444" },
      ],
      prevValue: "62",
      insight: "Sustained product investment lifted NPS 9 points YoY.",
    },
  ],
  Custom: [
    {
      label: "Total Revenue",
      value: "$84K",
      delta: "+11%",
      up: true,
      icon: DollarSign,
      spark: [22, 38, 41, 52, 58, 69, 74, 81, 79, 84],
      segments: [
        { label: "Email", pct: 34, color: "#6366F1" },
        { label: "Organic", pct: 28, color: "#8B5CF6" },
        { label: "Paid", pct: 21, color: "#EC4899" },
        { label: "Referral", pct: 17, color: "#F59E0B" },
      ],
      prevValue: "$75.7K",
      insight: "Custom window aligns with the spring marketing push.",
    },
    {
      label: "Active Users",
      value: "1,902",
      delta: "+6%",
      up: true,
      icon: Users,
      spark: [1500, 1560, 1620, 1680, 1720, 1780, 1820, 1860, 1880, 1902],
      segments: [
        { label: "Returning", pct: 56, color: "#6366F1" },
        { label: "New", pct: 34, color: "#8B5CF6" },
        { label: "Reactivated", pct: 10, color: "#EC4899" },
      ],
      prevValue: "1,794",
      insight: "Steady weekly adds with no anomalies in this window.",
    },
    {
      label: "Conversion Rate",
      value: "3.1%",
      delta: "-0.3%",
      up: false,
      icon: Target,
      spark: [3.4, 3.4, 3.3, 3.3, 3.2, 3.2, 3.2, 3.1, 3.1, 3.1],
      segments: [
        { label: "Self-Serve", pct: 46, color: "#6366F1" },
        { label: "Sales-Assisted", pct: 34, color: "#8B5CF6" },
        { label: "Partner", pct: 20, color: "#EC4899" },
      ],
      prevValue: "3.4%",
      insight: "Mild dip from a pricing variant test running mid-window.",
    },
    {
      label: "Avg Deal Size",
      value: "$26K",
      delta: "+12%",
      up: true,
      icon: Activity,
      spark: [22, 22, 23, 24, 24, 25, 25, 26, 26, 26],
      segments: [
        { label: "Enterprise", pct: 58, color: "#6366F1" },
        { label: "Mid-Market", pct: 30, color: "#8B5CF6" },
        { label: "SMB", pct: 12, color: "#EC4899" },
      ],
      prevValue: "$23.2K",
      insight: "Two enterprise expansions skewed the mix upward.",
    },
    {
      label: "NPS Score",
      value: "66",
      delta: "+2",
      up: true,
      icon: Heart,
      spark: [63, 64, 64, 65, 65, 65, 66, 66, 66, 66],
      segments: [
        { label: "Promoters", pct: 72, color: "#10B981" },
        { label: "Passives", pct: 22, color: "#F59E0B" },
        { label: "Detractors", pct: 6, color: "#EF4444" },
      ],
      prevValue: "64",
      insight: "Steady promoter growth, no detractor cluster identified.",
    },
  ],
};

const revenueSeries: Record<DateRange, number[]> = {
  "7D": [12, 18, 22, 16, 28, 34, 40],
  "30D": [62, 74, 68, 82, 91, 88, 104, 112, 108, 124, 131, 142],
  "90D": [180, 210, 245, 268, 302, 331, 348, 372, 389, 401, 412, 418],
  "1Y": [92, 108, 140, 172, 198, 220, 248, 276, 311, 348, 384, 418],
  Custom: [22, 38, 41, 52, 58, 69, 74, 81, 79, 84],
};

const rangeLabels: Record<DateRange, string[]> = {
  "7D": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  "30D": ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"],
  "90D": ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"],
  "1Y": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  Custom: ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10"],
};

interface FunnelStage {
  label: string;
  value: number;
  pct: number;
}

const funnelStages: FunnelStage[] = [
  { label: "Visitors", value: 48200, pct: 100 },
  { label: "Signups", value: 12480, pct: 26 },
  { label: "Activated", value: 6820, pct: 14 },
  { label: "Paid", value: 1540, pct: 3.2 },
  { label: "Retained", value: 1210, pct: 2.5 },
];

interface Segment {
  label: string;
  value: number;
  color: string;
}

const segments: Segment[] = [
  { label: "Enterprise", value: 52, color: "#6366F1" },
  { label: "Mid-Market", value: 28, color: "#8B5CF6" },
  { label: "SMB", value: 14, color: "#EC4899" },
  { label: "Self-Serve", value: 6, color: "#F59E0B" },
];

interface TrafficSource {
  source: string;
  sessions: number;
  conv: string;
  revenue: string;
}

const trafficSources: TrafficSource[] = [
  { source: "Organic", sessions: 18420, conv: "4.2%", revenue: "$62,180" },
  { source: "Direct", sessions: 9840, conv: "5.8%", revenue: "$38,920" },
  { source: "Referral", sessions: 5210, conv: "3.1%", revenue: "$14,480" },
  { source: "Paid", sessions: 7680, conv: "2.4%", revenue: "$18,210" },
  { source: "Email", sessions: 3420, conv: "6.9%", revenue: "$9,840" },
];

interface LiveEvent {
  type: "signup" | "view" | "upgrade";
  text: string;
  time: string;
  icon: typeof Users;
}

const liveEvents: LiveEvent[] = [
  { type: "signup", text: "New signup: sarah@acme.co", time: "2s ago", icon: UserPlus },
  { type: "view", text: "Page view on /pricing", time: "8s ago", icon: Eye },
  { type: "upgrade", text: "Plan upgrade: Pro to Enterprise", time: "24s ago", icon: Zap },
  { type: "view", text: "Page view on /features/ai", time: "41s ago", icon: Eye },
  { type: "signup", text: "New signup: mike@lumen.io", time: "1m ago", icon: UserPlus },
  { type: "upgrade", text: "Plan upgrade: Free to Pro", time: "2m ago", icon: Zap },
  { type: "view", text: "Page view on /docs/api", time: "2m ago", icon: Eye },
  { type: "signup", text: "New signup: ops@halcyon.dev", time: "3m ago", icon: UserPlus },
];

interface Correlation {
  a: string;
  b: string;
  r: number;
  strength: "strong" | "moderate" | "weak";
  note: string;
}

const correlations: Correlation[] = [
  {
    a: "Deals won",
    b: "Demo booked within 48h",
    r: 0.87,
    strength: "strong",
    note: "Prioritize same-week demo scheduling for inbound leads.",
  },
  {
    a: "Support tickets",
    b: "New features shipped",
    r: 0.61,
    strength: "moderate",
    note: "Expected — pair launches with proactive enablement.",
  },
  {
    a: "Employee sentiment",
    b: "Customer NPS",
    r: 0.74,
    strength: "strong",
    note: "Investigate — happy teams clearly correlate with happy customers.",
  },
  {
    a: "Doc page depth",
    b: "Trial-to-paid conversion",
    r: 0.52,
    strength: "moderate",
    note: "Self-serve buyers read deeply before paying.",
  },
];

interface AnomalyAlert {
  id: string;
  type: "warning" | "positive";
  text: string;
}

const initialAlerts: AnomalyAlert[] = [
  {
    id: "anom-1",
    type: "warning",
    text: "AI detected anomaly: Revenue dipped 23% on Apr 17 (Wed). Likely cause: payment processor outage 14:00-16:30 UTC. Expected recovery by EOD.",
  },
  {
    id: "anom-2",
    type: "positive",
    text: "Automation throughput 18% above baseline — 3 new workflows triggered this week.",
  },
];

interface SparklineProps {
  data: number[];
  positive: boolean;
}

function Sparkline({ data, positive }: SparklineProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 240;
  const h = 60;
  const step = w / (data.length - 1);
  const points = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * (h - 8) - 4}`)
    .join(" ");
  const area = `0,${h} ${points} ${w},${h}`;
  const color = positive ? "#10B981" : "#F43F5E";
  const gradId = positive ? "spark-pos" : "spark-neg";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gradId})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<DateRange>("30D");
  const [workspace, setWorkspace] = useState<string>("All workspaces");
  const [plan, setPlan] = useState<string>("All plans");
  const [region, setRegion] = useState<string>("All regions");
  const [hoverBar, setHoverBar] = useState<number | null>(null);
  const [expandedKpi, setExpandedKpi] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<AnomalyAlert[]>(initialAlerts);
  const [secondsAgo, setSecondsAgo] = useState<number>(3);

  useEffect(() => {
    const id = setInterval(() => setSecondsAgo((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const kpis = kpiByRange[range];
  const series = revenueSeries[range];
  const labels = rangeLabels[range];
  const maxVal = useMemo<number>(() => Math.max(...series), [series]);

  const dismissAlert = (id: string) => setAlerts((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {alerts.length > 0 && (
        <div className="px-8 pt-6 space-y-2">
          {alerts.map((a) => {
            const isWarn = a.type === "warning";
            const Icon = isWarn ? AlertTriangle : CheckCircle2;
            return (
              <div
                key={a.id}
                className={`flex items-start gap-3 p-3.5 rounded-xl border ${
                  isWarn
                    ? "bg-amber-500/[0.06] border-amber-500/30"
                    : "bg-emerald-500/[0.06] border-emerald-500/30"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isWarn ? "bg-amber-500/15 text-amber-400" : "bg-emerald-500/15 text-emerald-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider mb-1">
                    <Brain className={`w-3 h-3 ${isWarn ? "text-amber-400" : "text-emerald-400"}`} />
                    <span className={isWarn ? "text-amber-400" : "text-emerald-400"}>
                      {isWarn ? "AI Anomaly Detected" : "AI Positive Signal"}
                    </span>
                  </div>
                  <div className="text-sm text-white/85 leading-relaxed">{a.text}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="text-xs text-white/50 hover:text-white px-2.5 py-1 rounded-md hover:bg-white/5 transition">
                    Investigate
                  </button>
                  <button
                    onClick={() => dismissAlert(a.id)}
                    className="w-7 h-7 rounded-md hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition"
                    aria-label="Dismiss alert"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="border-b border-white/5 bg-gradient-to-b from-[#12121A] to-[#0A0A0F]">
        <div className="px-8 pt-6 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-white/40 tracking-wider uppercase">
                <BarChart3 className="w-3.5 h-3.5" />
                Analytics
              </div>
              <div className="mt-2 flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-light tracking-tight">
                  Performance <span className="text-white/40">Overview</span>
                </h1>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                  <span className="relative flex w-1.5 h-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                  </span>
                  <span className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider">
                    Live
                  </span>
                </div>
                <div className="text-xs text-white/40">Updated {secondsAgo}s ago</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition">
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
              <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition">
                <Share2 className="w-3.5 h-3.5" /> Share Dashboard
              </button>
              <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#6366F1] hover:bg-[#5558E3] text-sm font-medium transition shadow-lg shadow-[#6366F1]/20">
                <Bell className="w-3.5 h-3.5" /> Set Alert
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
            <div className="inline-flex items-center p-1 rounded-xl bg-white/[0.03] border border-white/5">
              {(["7D", "30D", "90D", "1Y", "Custom"] as DateRange[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-4 py-1.5 text-sm rounded-lg transition ${
                    range === r
                      ? "bg-[#6366F1] text-white shadow-lg shadow-[#6366F1]/30"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-xs text-white/40 mr-1">
                <Filter className="w-3.5 h-3.5" /> Filters
              </div>
              {[
                { val: workspace, set: setWorkspace, opts: ["All workspaces", "Acme Corp", "Lumen", "Halcyon"] },
                { val: plan, set: setPlan, opts: ["All plans", "Free", "Pro", "Enterprise"] },
                { val: region, set: setRegion, opts: ["All regions", "North America", "Europe", "APAC"] },
              ].map((f, i) => (
                <div key={i} className="relative">
                  <select
                    value={f.val}
                    onChange={(e) => f.set(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-sm hover:bg-white/[0.06] cursor-pointer focus:outline-none focus:border-[#6366F1]/50"
                  >
                    {f.opts.map((o) => (
                      <option key={o} className="bg-[#0A0A0F]">
                        {o}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/40" />
                </div>
              ))}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-white/50">
                <Calendar className="w-3.5 h-3.5" /> Apr 1 - Apr 30
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-9 space-y-6">
          <div className="grid grid-cols-5 gap-4">
            {kpis.map((k) => {
              const Icon = k.icon;
              const isExpanded = expandedKpi === k.label;
              return (
                <div
                  key={k.label}
                  className={`group relative p-5 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border transition overflow-hidden cursor-pointer ${
                    isExpanded
                      ? "col-span-5 border-[#6366F1]/40 shadow-xl shadow-[#6366F1]/10"
                      : "border-white/5 hover:border-[#6366F1]/30"
                  }`}
                  onClick={() => setExpandedKpi(isExpanded ? null : k.label)}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-[#6366F1]/10 to-transparent transition pointer-events-none" />
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-lg bg-[#6366F1]/10 border border-[#6366F1]/20 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[#6366F1]" />
                      </div>
                      <div
                        className={`flex items-center gap-1 text-xs font-medium ${
                          k.up ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {k.up ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {k.delta}
                      </div>
                    </div>
                    <div className="mt-4 text-2xl font-light tracking-tight">{k.value}</div>
                    <div className="mt-1 text-xs text-white/40 uppercase tracking-wider">
                      {k.label}
                    </div>

                    {isExpanded && (
                      <div className="mt-5 pt-5 border-t border-white/5 grid grid-cols-3 gap-6">
                        <div>
                          <div className="flex items-center justify-between text-[10px] text-white/40 uppercase tracking-wider mb-2">
                            <span>Trend</span>
                            <span className="flex items-center gap-1 text-white/60 normal-case tracking-normal">
                              {k.up ? (
                                <TrendingUp className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <TrendingDown className="w-3 h-3 text-rose-400" />
                              )}
                              vs prev: {k.prevValue}
                            </span>
                          </div>
                          <Sparkline data={k.spark} positive={k.up} />
                        </div>
                        <div>
                          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-3">
                            Breakdown by segment
                          </div>
                          <div className="space-y-2">
                            {k.segments.map((s) => (
                              <div key={s.label} className="text-xs">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-white/70">{s.label}</span>
                                  <span className="text-white/50 font-medium">{s.pct}%</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                                  <div
                                    className="h-full rounded-full"
                                    style={{ width: `${s.pct}%`, background: s.color }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 text-[10px] text-[#6366F1] uppercase tracking-wider mb-2">
                            <Sparkles className="w-3 h-3" /> AI Interpretation
                          </div>
                          <div className="text-xs text-white/75 leading-relaxed">{k.insight}</div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedKpi(null);
                            }}
                            className="mt-3 text-[10px] text-white/40 hover:text-white uppercase tracking-wider"
                          >
                            Collapse
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-xs text-white/40 uppercase tracking-wider">Revenue</div>
                <div className="text-xl font-light mt-1">
                  Over time <span className="text-white/40 text-sm">{range}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-white/60">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#6366F1]" /> Revenue
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white/20" /> Previous
                </div>
              </div>
            </div>
            <div className="relative h-72 flex items-end gap-2 px-2">
              {series.map((v, i) => {
                const h = (v / maxVal) * 100;
                const prev = v * 0.82;
                const ph = (prev / maxVal) * 100;
                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                    onMouseEnter={() => setHoverBar(i)}
                    onMouseLeave={() => setHoverBar(null)}
                  >
                    <div className="relative w-full flex items-end justify-center gap-1 h-64">
                      {hoverBar === i && (
                        <div className="absolute -top-14 left-1/2 -translate-x-1/2 px-3 py-2 rounded-lg bg-[#1A1A24] border border-[#6366F1]/30 shadow-xl shadow-black/40 z-10 whitespace-nowrap">
                          <div className="text-[10px] text-white/50 uppercase">{labels[i]}</div>
                          <div className="text-sm font-medium text-[#6366F1]">${v}K</div>
                        </div>
                      )}
                      <div
                        className="w-[38%] rounded-t bg-white/10 group-hover:bg-white/20 transition"
                        style={{ height: `${ph}%` }}
                      />
                      <div
                        className="w-[38%] rounded-t bg-gradient-to-t from-[#6366F1] to-[#8B5CF6] group-hover:shadow-lg group-hover:shadow-[#6366F1]/40 transition"
                        style={{ height: `${h}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-white/40 uppercase">{labels[i]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/5">
              <div className="text-xs text-white/40 uppercase tracking-wider">Funnel</div>
              <div className="text-xl font-light mt-1 mb-6">Activation path</div>
              <div className="space-y-2.5">
                {funnelStages.map((s, i) => (
                  <div key={s.label}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-white/70">{s.label}</span>
                      <span className="text-white/40">
                        {s.value.toLocaleString()} · {s.pct}%
                      </span>
                    </div>
                    <div className="h-8 rounded-lg bg-white/[0.03] overflow-hidden border border-white/5">
                      <div
                        className="h-full rounded-lg bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] flex items-center justify-end pr-3 text-[10px] text-white/90 font-medium"
                        style={{ width: `${s.pct}%`, minWidth: "6%" }}
                      >
                        {i === 0 ? "100%" : ""}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/5">
              <div className="text-xs text-white/40 uppercase tracking-wider">Segments</div>
              <div className="text-xl font-light mt-1 mb-6">Revenue by tier</div>
              <div className="flex items-center gap-8">
                <div
                  className="relative w-40 h-40 rounded-full"
                  style={{
                    background: `conic-gradient(${segments
                      .reduce<string[]>((acc, s, i) => {
                        const prev = segments.slice(0, i).reduce((a, b) => a + b.value, 0);
                        acc.push(`${s.color} ${prev}% ${prev + s.value}%`);
                        return acc;
                      }, [])
                      .join(", ")})`,
                  }}
                >
                  <div className="absolute inset-6 rounded-full bg-[#0A0A0F] flex items-center justify-center flex-col border border-white/5">
                    <div className="text-xs text-white/40 uppercase">Total</div>
                    <div className="text-lg font-light">$418K</div>
                  </div>
                </div>
                <div className="flex-1 space-y-2.5">
                  {segments.map((s) => (
                    <div key={s.label} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
                        <span className="text-white/70">{s.label}</span>
                      </div>
                      <span className="text-white/50 font-medium">{s.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/5 overflow-hidden">
            <div className="px-6 py-5 flex items-center justify-between border-b border-white/5">
              <div>
                <div className="text-xs text-white/40 uppercase tracking-wider">Acquisition</div>
                <div className="text-xl font-light mt-1">Traffic sources</div>
              </div>
              <Globe className="w-4 h-4 text-white/30" />
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-white/40 uppercase tracking-wider">
                  <th className="px-6 py-3 text-left font-normal">Source</th>
                  <th className="px-6 py-3 text-right font-normal">Sessions</th>
                  <th className="px-6 py-3 text-right font-normal">Conversion</th>
                  <th className="px-6 py-3 text-right font-normal">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {trafficSources.map((t) => (
                  <tr key={t.source} className="border-t border-white/5 hover:bg-white/[0.02] transition">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1]" />
                        {t.source}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-right text-white/70">{t.sessions.toLocaleString()}</td>
                    <td className="px-6 py-3.5 text-right text-white/70">{t.conv}</td>
                    <td className="px-6 py-3.5 text-right font-medium">{t.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[#6366F1]/[0.06] to-white/[0.01] border border-[#6366F1]/20 overflow-hidden">
            <div className="px-6 py-5 flex items-center justify-between border-b border-white/5">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#6366F1] uppercase tracking-wider">
                  <Brain className="w-3.5 h-3.5" /> Correlation Insights
                </div>
                <div className="text-xl font-light mt-1">Cross-metric relationships</div>
              </div>
              <div className="text-xs text-white/40">Pearson r · trailing 90D</div>
            </div>
            <div className="divide-y divide-white/5">
              {correlations.map((c) => {
                const isStrong = c.strength === "strong";
                const isMod = c.strength === "moderate";
                const barColor = isStrong
                  ? "from-emerald-500 to-emerald-400"
                  : isMod
                  ? "from-amber-500 to-amber-400"
                  : "from-white/30 to-white/20";
                const badgeColor = isStrong
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                  : isMod
                  ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                  : "bg-white/5 text-white/50 border-white/10";
                return (
                  <div key={`${c.a}-${c.b}`} className="px-6 py-4 hover:bg-white/[0.02] transition">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm">
                          <span className="text-white/85">{c.a}</span>
                          <span className="mx-2 text-[#6366F1]">↔</span>
                          <span className="text-white/85">{c.b}</span>
                        </div>
                        <div className="mt-1 text-xs text-white/50">{c.note}</div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="w-32 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
                            style={{ width: `${Math.abs(c.r) * 100}%` }}
                          />
                        </div>
                        <div className="text-sm font-mono text-white/80 w-14 text-right">
                          r={c.r.toFixed(2)}
                        </div>
                        <span
                          className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md border ${badgeColor}`}
                        >
                          {c.strength}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="col-span-12 xl:col-span-3">
          <div className="sticky top-6 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/5 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <div>
                <div className="text-xs text-white/40 uppercase tracking-wider">Live</div>
                <div className="text-base font-light mt-0.5">Real-time events</div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                LIVE
              </div>
            </div>
            <div className="p-3 space-y-1 max-h-[480px] overflow-y-auto">
              {liveEvents.map((e, i) => {
                const Icon = e.icon;
                const colors =
                  e.type === "signup"
                    ? "text-[#6366F1] bg-[#6366F1]/10 border-[#6366F1]/20"
                    : e.type === "upgrade"
                    ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                    : "text-white/60 bg-white/5 border-white/10";
                return (
                  <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition">
                    <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${colors}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-white/80 truncate">{e.text}</div>
                      <div className="text-[10px] text-white/40 mt-0.5">{e.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
              <div className="text-xs text-white/40">12 events / min</div>
              <button className="text-xs text-[#6366F1] hover:text-[#8B5CF6] transition flex items-center gap-1">
                Stream <MoreHorizontal className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-[#6366F1]/10 to-transparent border border-[#6366F1]/20">
            <div className="flex items-center gap-2 text-xs text-[#6366F1] uppercase tracking-wider">
              <Search className="w-3 h-3" /> Insight
            </div>
            <div className="mt-2 text-sm text-white/80 leading-relaxed">
              Organic conversion is up 1.8x week-over-week. Consider doubling SEO spend on the
              <span className="text-[#6366F1] font-medium"> /features/ai </span>
              cluster.
            </div>
            <button className="mt-4 w-full py-2 rounded-lg bg-[#6366F1] hover:bg-[#5558E3] text-xs font-medium transition">
              View full report
            </button>
          </div>

          <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/5">
            <div className="flex items-center gap-2 text-xs text-white/40 uppercase tracking-wider">
              <TrendingUp className="w-3 h-3" /> Trend
            </div>
            <div className="mt-3 text-xs text-white/60 leading-relaxed">
              Revenue has compounded at 14.2% weekly over the trailing 30 days, tracking ahead of your
              quarterly plan by $38K.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
