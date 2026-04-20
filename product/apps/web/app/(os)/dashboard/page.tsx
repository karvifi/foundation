"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence, useMotionValue, useTransform, useSpring } from "motion/react";
import {
  Zap, FileText, Users, TrendingUp, Clock, Plus,
  MessageSquare, Calendar, ChevronRight, Activity,
  Bot, CheckCircle2, BarChart3, Sparkles, ArrowRight,
  Bell, Command, Search, BrainCircuit, type LucideProps,
} from "lucide-react";

type LucideIcon = React.ComponentType<LucideProps>;
type ActivityStatus = "success" | "running" | "info";

interface StatCard { label: string; value: string; change: string; icon: LucideIcon; accent: string; glow: string; glowRgb: string; }
interface ActivityItem { id: string; icon: LucideIcon; title: string; detail: string; time: string; status: ActivityStatus; tint: string; }
interface QuickAction { label: string; icon: LucideIcon; href: string; tint: string; }
interface RecentRow { name: string; type: string; modified: string; status: string; statusTint: string; }
interface PaletteItem { id: string; label: string; icon: LucideIcon; group: "Recent" | "Suggestions" | "AI Actions"; }
interface CreateItem { label: string; icon: LucideIcon; tint: string; }
interface BriefChip { label: string; icon: LucideIcon; }
interface StreamItem { id: string; icon: LucideIcon; text: string; time: string; tint: string; }
interface HealthRow { label: string; value: string; status: "ok" | "warn"; }

const STATS: StatCard[] = [
  { label: "Tasks Completed Today", value: "24", change: "+12% vs yesterday", icon: CheckCircle2, accent: "from-emerald-500/20 to-emerald-500/0", glow: "shadow-[0_0_40px_-12px_rgba(16,185,129,0.35)]", glowRgb: "16,185,129" },
  { label: "Active Workflows", value: "8", change: "3 running now", icon: Activity, accent: "from-indigo-500/25 to-indigo-500/0", glow: "shadow-[0_0_40px_-12px_rgba(99,102,241,0.45)]", glowRgb: "99,102,241" },
  { label: "AI Queries Used", value: "342", change: "+18% this week", icon: Sparkles, accent: "from-purple-500/25 to-purple-500/0", glow: "shadow-[0_0_40px_-12px_rgba(168,85,247,0.4)]", glowRgb: "168,85,247" },
  { label: "Cost Saved", value: "$2,847", change: "saved this month", icon: TrendingUp, accent: "from-yellow-500/20 to-yellow-500/0", glow: "shadow-[0_0_40px_-12px_rgba(212,175,55,0.4)]", glowRgb: "212,175,55" },
];

const ACTIVITY_FEED: ActivityItem[] = [
  { id: "1", icon: Bot, title: "OmniMind drafted reply to Marcus T.", detail: "Thread: Q3 partnership proposal", time: "just now", status: "success", tint: "text-indigo-400 bg-indigo-500/10 ring-indigo-500/20" },
  { id: "2", icon: Zap, title: "Workflow: Lead -> CRM ran successfully", detail: "Captured 4 new leads from Typeform", time: "2 min ago", status: "success", tint: "text-emerald-400 bg-emerald-500/10 ring-emerald-500/20" },
  { id: "3", icon: FileText, title: "Document 'Q3 Strategy' summarized", detail: "12 pages condensed into 8 key points", time: "14 min ago", status: "info", tint: "text-purple-400 bg-purple-500/10 ring-purple-500/20" },
  { id: "4", icon: MessageSquare, title: "Slack digest generated", detail: "Across 7 channels, 142 messages", time: "38 min ago", status: "info", tint: "text-blue-400 bg-blue-500/10 ring-blue-500/20" },
  { id: "5", icon: Activity, title: "Workflow: Invoice reminder executing", detail: "Step 3 of 5 - sending notifications", time: "1 hour ago", status: "running", tint: "text-yellow-400 bg-yellow-500/10 ring-yellow-500/20" },
  { id: "6", icon: Users, title: "Contact enriched: Lena Park", detail: "Added LinkedIn, company, role, timezone", time: "2 hours ago", status: "success", tint: "text-emerald-400 bg-emerald-500/10 ring-emerald-500/20" },
];

const QUICK_ACTIONS: QuickAction[] = [
  { label: "New Doc", icon: FileText, href: "/docs", tint: "hover:border-indigo-500/40 hover:bg-indigo-500/5" },
  { label: "Add Contact", icon: Users, href: "/crm", tint: "hover:border-emerald-500/40 hover:bg-emerald-500/5" },
  { label: "Start Workflow", icon: Zap, href: "/projects", tint: "hover:border-yellow-500/40 hover:bg-yellow-500/5" },
  { label: "Ask OmniMind", icon: Sparkles, href: "/mind", tint: "hover:border-purple-500/40 hover:bg-purple-500/5" },
  { label: "View Pipeline", icon: BarChart3, href: "/analytics", tint: "hover:border-blue-500/40 hover:bg-blue-500/5" },
  { label: "Open Calendar", icon: Calendar, href: "/calendar", tint: "hover:border-orange-500/40 hover:bg-orange-500/5" },
];

const RECENT_ROWS: RecentRow[] = [
  { name: "Q3 Go-To-Market Strategy", type: "Document", modified: "2 min ago", status: "In Review", statusTint: "text-yellow-400 bg-yellow-500/10 ring-yellow-500/20" },
  { name: "Acme Corp - Enterprise Deal", type: "Deal", modified: "18 min ago", status: "Negotiation", statusTint: "text-indigo-400 bg-indigo-500/10 ring-indigo-500/20" },
  { name: "Review design system v2", type: "Task", modified: "1 hour ago", status: "In Progress", statusTint: "text-blue-400 bg-blue-500/10 ring-blue-500/20" },
  { name: "Customer Onboarding Playbook", type: "Document", modified: "3 hours ago", status: "Published", statusTint: "text-emerald-400 bg-emerald-500/10 ring-emerald-500/20" },
  { name: "Harbor Labs - Pilot", type: "Deal", modified: "Yesterday", status: "Proposal", statusTint: "text-purple-400 bg-purple-500/10 ring-purple-500/20" },
];

const PALETTE_ITEMS: PaletteItem[] = [
  { id: "r1", label: "Open CRM", icon: Users, group: "Recent" },
  { id: "r2", label: "Create workflow", icon: Zap, group: "Recent" },
  { id: "r3", label: "Analyze Q1 revenue", icon: BarChart3, group: "Recent" },
  { id: "s1", label: "New contact", icon: Plus, group: "Suggestions" },
  { id: "s2", label: "Schedule meeting", icon: Calendar, group: "Suggestions" },
  { id: "s3", label: "Run automation", icon: Activity, group: "Suggestions" },
  { id: "a1", label: "Summarize my week", icon: BrainCircuit, group: "AI Actions" },
  { id: "a2", label: "What needs my attention today?", icon: Sparkles, group: "AI Actions" },
  { id: "a3", label: "Draft follow-up emails", icon: MessageSquare, group: "AI Actions" },
];

const CREATE_ITEMS: CreateItem[] = [
  { label: "New Contact", icon: Users, tint: "text-emerald-400" },
  { label: "New Deal", icon: TrendingUp, tint: "text-yellow-400" },
  { label: "New Task", icon: CheckCircle2, tint: "text-blue-400" },
  { label: "New Workflow", icon: Zap, tint: "text-indigo-400" },
  { label: "Ask AI", icon: Sparkles, tint: "text-purple-400" },
];

const BRIEF_CHIPS: BriefChip[] = [
  { label: "View meetings", icon: Calendar },
  { label: "Read messages", icon: MessageSquare },
  { label: "Check deals", icon: TrendingUp },
];

const STREAM: StreamItem[] = [
  { id: "st1", icon: Zap, text: "Automation 'Lead scoring' ran — 3 contacts enriched", time: "2s ago", tint: "text-emerald-400 bg-emerald-500/10 ring-emerald-500/20" },
  { id: "st2", icon: TrendingUp, text: "CRM: TechCorp deal moved to Negotiation", time: "14m ago", tint: "text-indigo-400 bg-indigo-500/10 ring-indigo-500/20" },
  { id: "st3", icon: BrainCircuit, text: "OmniMind answered 4 questions", time: "1h ago", tint: "text-purple-400 bg-purple-500/10 ring-purple-500/20" },
  { id: "st4", icon: CheckCircle2, text: "Invoice INV-0089 paid — $8,400", time: "2h ago", tint: "text-yellow-400 bg-yellow-500/10 ring-yellow-500/20" },
];

const HEALTH_ROWS: HealthRow[] = [
  { label: "Automations", value: "14 running — all healthy", status: "ok" },
  { label: "AI gateway", value: "p95 820ms — nominal", status: "ok" },
  { label: "Integrations", value: "6/6 connected", status: "ok" },
  { label: "Last data sync", value: "2 min ago", status: "ok" },
];

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const container = { hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 20, filter: "blur(4px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: EASE } } };
const fadeIn = { hidden: { opacity: 0, scale: 0.97 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: EASE } } };
const slideRight = { hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } } };

function StatusDot({ status }: { status: ActivityStatus }) {
  if (status === "running") {
    return (
      <span className="relative flex h-2 w-2">
        <motion.span className="absolute inline-flex h-full w-full rounded-full bg-yellow-400" animate={{ scale: [1, 1.8, 1], opacity: [0.75, 0, 0.75] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }} />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-400" />
      </span>
    );
  }
  if (status === "success") return <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />;
  return <span className="inline-block h-2 w-2 rounded-full bg-indigo-400" />;
}

function StatCardView({ stat }: { stat: StatCard }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useTransform(my, [-60, 60], [5, -5]);
  const ry = useTransform(mx, [-60, 60], [-5, 5]);
  const srx = useSpring(rx, { stiffness: 200, damping: 18 });
  const sry = useSpring(ry, { stiffness: 200, damping: 18 });
  const Icon = stat.icon;

  function onMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(e.clientX - r.left - r.width / 2);
    my.set(e.clientY - r.top - r.height / 2);
  }

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
      onMouseMove={onMove}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      whileHover={{ scale: 1.03 }}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#13131A]/80 p-5 backdrop-blur-xl ${stat.glow} cursor-default`}
    >
      <motion.div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${stat.accent}`} initial={{ opacity: 0.5 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.3 }} />
      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/50">{stat.label}</span>
          <motion.div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5" whileHover={{ rotate: 15, scale: 1.2 }} transition={{ type: "spring", stiffness: 400, damping: 12 }}>
            <Icon className="h-3.5 w-3.5 text-white/80" />
          </motion.div>
        </div>
        <div className="mb-1 text-3xl font-semibold tracking-tight text-white">{stat.value}</div>
        <div className="text-xs text-white/50">{stat.change}</div>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const activityRef = useRef<HTMLDivElement>(null);
  const activityInView = useInView(activityRef, { once: true, margin: "-60px" });
  const tableRef = useRef<HTMLDivElement>(null);
  const tableInView = useInView(tableRef, { once: true, margin: "-60px" });

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setCmdOpen(false);
        setCreateOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  function runAction(label: string) {
    setCmdOpen(false);
    setCreateOpen(false);
    setCmdQuery("");
    setToast(`Running: ${label}`);
  }

  const filteredPalette = PALETTE_ITEMS.filter((i) => i.label.toLowerCase().includes(cmdQuery.toLowerCase()));
  const groups: Array<PaletteItem["group"]> = ["Recent", "Suggestions", "AI Actions"];

  return (
    <div className="relative min-h-full w-full bg-[#0A0A0F] text-white overflow-hidden">

      <motion.div className="pointer-events-none absolute inset-0 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
        <motion.div className="absolute -top-40 left-1/4 h-[480px] w-[480px] rounded-full bg-indigo-600/10 blur-[120px]" animate={{ scale: [1, 1.08, 1], x: [0, 20, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute top-40 right-0 h-[360px] w-[360px] rounded-full bg-purple-600/10 blur-[120px]" animate={{ scale: [1, 1.12, 1], y: [0, -30, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }} />
      </motion.div>

      <div className="relative px-8 py-8 pb-32">

        {/* Header */}
        <motion.header className="mb-8 flex items-center justify-between" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-white/40">
              <span className="relative flex h-1.5 w-1.5">
                <motion.span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400" animate={{ scale: [1, 2.2, 1], opacity: [0.75, 0, 0.75] }} transition={{ duration: 1.5, repeat: Infinity }} />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Command Center Live
            </div>
            <h1 className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-[28px] font-semibold tracking-tight text-transparent">{greeting}, Kartik</h1>
            <p className="mt-1 text-sm text-white/50">{today}</p>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              onClick={() => setCmdOpen(true)}
              className="hidden md:inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-xs text-white/60 transition hover:border-white/20 hover:text-white"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              aria-label="Open command palette"
            >
              <Search size={13} />
              <span>Search or run command</span>
              <kbd className="ml-2 inline-flex items-center gap-0.5 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-white/50"><Command size={9} />K</kbd>
            </motion.button>
            <motion.button type="button" className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition hover:border-white/20 hover:text-white" aria-label="Notifications" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}>
              <Bell size={16} />
              <motion.span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }} />
            </motion.button>
            <div className="relative">
              <motion.button
                type="button"
                onClick={() => setCreateOpen((v) => !v)}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-sm font-medium text-white/80 transition hover:border-white/20 hover:text-white"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                aria-label="Quick create"
              >
                <Plus size={14} />Create
              </motion.button>
              <AnimatePresence>
                {createOpen && (
                  <motion.div
                    className="absolute right-0 top-12 z-40 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#13131A]/95 p-1.5 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)] backdrop-blur-xl"
                    initial={{ opacity: 0, y: -6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.96 }} transition={{ duration: 0.18, ease: EASE }}
                  >
                    {CREATE_ITEMS.map((c) => {
                      const Icon = c.icon;
                      return (
                        <button key={c.label} type="button" onClick={() => runAction(c.label)} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-white/85 transition hover:bg-white/[0.06]">
                          <Icon size={14} className={c.tint} />{c.label}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link href="/mind" className="group inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-4 text-sm font-medium text-white shadow-[0_0_20px_-4px_rgba(99,102,241,0.6)] transition hover:shadow-[0_0_28px_-4px_rgba(99,102,241,0.9)]">
                <Sparkles size={14} />Ask OmniMind
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </div>
        </motion.header>

        {/* Today's Briefing */}
        <motion.section className="mb-8" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}>
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-[#13131A]/80 to-purple-500/10 p-6 backdrop-blur-xl shadow-[0_0_60px_-20px_rgba(99,102,241,0.5)]">
            <div className="pointer-events-none absolute -right-20 -top-20 h-[260px] w-[260px] rounded-full bg-indigo-500/15 blur-[80px]" />
            <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <motion.div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-[0_0_24px_-4px_rgba(168,85,247,0.7)]" animate={{ rotate: [0, 6, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                  <BrainCircuit size={20} className="text-white" />
                </motion.div>
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <h2 className="text-base font-semibold text-white">Today&apos;s Briefing</h2>
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/15 px-2 py-0.5 text-[10px] font-medium text-indigo-300 ring-1 ring-indigo-500/30"><Sparkles size={9} />AI generated</span>
                  </div>
                  <p className="max-w-2xl text-[15px] leading-relaxed text-white/85">
                    {greeting}, Kartik. You have <span className="font-semibold text-white">3 meetings</span> today, <span className="font-semibold text-white">7 unread messages</span>, <span className="font-semibold text-yellow-300">2 deals need attention</span>, and <span className="font-semibold text-orange-300">1 automation is warning</span>.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {BRIEF_CHIPS.map((chip) => {
                      const Icon = chip.icon;
                      return (
                        <motion.button key={chip.label} type="button" onClick={() => runAction(chip.label)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/85 transition hover:border-white/30 hover:bg-white/10">
                          <Icon size={11} />{chip.label}
                        </motion.button>
                      );
                    })}
                    <span className="ml-1 text-[11px] text-white/40">Briefing updated 5 min ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Stat cards */}
        <motion.section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" variants={container} initial="hidden" animate="visible">
          {STATS.map((stat) => <StatCardView key={stat.label} stat={stat} />)}
        </motion.section>

        {/* Activity + Quick Actions */}
        <motion.section ref={activityRef} className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-5" variants={container} initial="hidden" animate={activityInView ? "visible" : "hidden"}>
          <motion.div className="lg:col-span-3" variants={fadeIn}>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#13131A]/80 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-3">
                  <motion.div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 ring-1 ring-indigo-500/30" animate={{ boxShadow: ["0 0 0px rgba(99,102,241,0.2)", "0 0 14px rgba(99,102,241,0.5)", "0 0 0px rgba(99,102,241,0.2)"] }} transition={{ duration: 2.5, repeat: Infinity }}>
                    <Activity size={14} className="text-indigo-400" />
                  </motion.div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">AI Activity Feed</h2>
                    <p className="flex items-center gap-1.5 text-[11px] text-white/40">
                      <span className="relative flex h-1.5 w-1.5">
                        <motion.span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400" animate={{ scale: [1, 2.2, 1], opacity: [0.75, 0, 0.75] }} transition={{ duration: 1.5, repeat: Infinity }} />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      </span>
                      Live · streaming events
                    </p>
                  </div>
                </div>
                <button type="button" className="text-xs text-white/50 transition hover:text-white">View all</button>
              </div>
              <motion.div className="divide-y divide-white/5" variants={container} initial="hidden" animate={activityInView ? "visible" : "hidden"}>
                {ACTIVITY_FEED.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.div key={item.id} variants={slideRight} className="group flex items-start gap-3 px-5 py-3.5 transition hover:bg-white/[0.03] cursor-pointer" whileHover={{ x: 4 }}>
                      <motion.div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ring-1 ${item.tint}`} whileHover={{ scale: 1.1, rotate: 6 }} transition={{ type: "spring", stiffness: 400, damping: 14 }}>
                        <Icon size={14} />
                      </motion.div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium text-white">{item.title}</p>
                          <StatusDot status={item.status} />
                        </div>
                        <p className="mt-0.5 truncate text-xs text-white/45">{item.detail}</p>
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-1 text-[11px] text-white/35"><Clock size={10} />{item.time}</div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>

          <motion.div className="lg:col-span-2 flex flex-col gap-4" variants={fadeIn}>
            {/* Quick Actions */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#13131A]/80 backdrop-blur-xl">
              <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 ring-1 ring-purple-500/30">
                  <Zap size={14} className="text-purple-400" />
                </div>
                <h2 className="text-sm font-semibold text-white">Quick Actions</h2>
              </div>
              <motion.div className="grid grid-cols-2 gap-2 p-4" variants={container} initial="hidden" animate={activityInView ? "visible" : "hidden"}>
                {QUICK_ACTIONS.map((action) => {
                  const Icon = action.icon;
                  return (
                    <motion.div key={action.label} variants={fadeUp}>
                      <Link href={action.href} className={`group flex flex-col items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 transition ${action.tint}`}>
                        <motion.div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5" whileHover={{ scale: 1.18, rotate: -8 }} transition={{ type: "spring", stiffness: 400, damping: 12 }}>
                          <Icon size={15} className="text-white/80" />
                        </motion.div>
                        <div className="flex w-full items-center justify-between">
                          <span className="text-sm font-medium text-white/90">{action.label}</span>
                          <ChevronRight size={14} className="text-white/30 transition group-hover:translate-x-0.5 group-hover:text-white/70" />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Activity Stream */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#13131A]/80 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-3">
                  <motion.div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/30" animate={{ boxShadow: ["0 0 0 rgba(16,185,129,0.2)", "0 0 14px rgba(16,185,129,0.5)", "0 0 0 rgba(16,185,129,0.2)"] }} transition={{ duration: 2.5, repeat: Infinity }}>
                    <Activity size={14} className="text-emerald-400" />
                  </motion.div>
                  <h2 className="text-sm font-semibold text-white">Activity Stream</h2>
                </div>
                <span className="text-[11px] text-white/40">live</span>
              </div>
              <ul className="divide-y divide-white/5">
                {STREAM.map((s) => {
                  const Icon = s.icon;
                  return (
                    <li key={s.id} className="flex items-start gap-3 px-5 py-3">
                      <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md ring-1 ${s.tint}`}><Icon size={12} /></div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs text-white/85">{s.text}</p>
                        <p className="mt-0.5 text-[10px] text-white/40">{s.time}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        </motion.section>

        {/* Recent Activity table */}
        <motion.section ref={tableRef} className="mb-10" variants={fadeIn} initial="hidden" animate={tableInView ? "visible" : "hidden"}>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#13131A]/80 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500/10 ring-1 ring-yellow-500/30">
                  <Clock size={14} className="text-yellow-400" />
                </div>
                <h2 className="text-sm font-semibold text-white">Recent Activity</h2>
              </div>
              <button type="button" className="inline-flex items-center gap-1 text-xs text-white/50 transition hover:text-white">See all <ArrowRight size={12} /></button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5 text-left text-[11px] uppercase tracking-[0.1em] text-white/40">
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Type</th>
                    <th className="px-5 py-3 font-medium">Last Modified</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {RECENT_ROWS.map((row, i) => (
                    <motion.tr key={row.name} className="group border-b border-white/5 text-sm transition last:border-0 hover:bg-white/[0.03] cursor-pointer" initial={{ opacity: 0, x: -14 }} animate={tableInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -14 }} transition={{ delay: i * 0.06 + 0.1, duration: 0.4, ease: EASE }} whileHover={{ x: 4 }}>
                      <td className="px-5 py-3.5 font-medium text-white">{row.name}</td>
                      <td className="px-5 py-3.5 text-white/60">{row.type}</td>
                      <td className="px-5 py-3.5 text-white/50">{row.modified}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ${row.statusTint}`}>{row.status}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <ChevronRight size={14} className="inline text-white/20 transition group-hover:translate-x-0.5 group-hover:text-white/60" />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>
      </div>

      {/* System Health Panel (bottom-right) */}
      <div className="pointer-events-none fixed bottom-6 left-6 z-40 hidden md:block">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5, ease: EASE }}
          className="pointer-events-auto w-[280px] overflow-hidden rounded-xl border border-white/10 bg-[#13131A]/90 backdrop-blur-xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)]"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <motion.span className="relative flex h-2 w-2">
                <motion.span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400" animate={{ scale: [1, 2.2, 1], opacity: [0.75, 0, 0.75] }} transition={{ duration: 1.6, repeat: Infinity }} />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </motion.span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">System Health</span>
            </div>
            <span className="text-[10px] text-emerald-400">All systems normal</span>
          </div>
          <ul className="divide-y divide-white/5">
            {HEALTH_ROWS.map((h) => (
              <li key={h.label} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-[11px] text-white/55">{h.label}</span>
                <span className="flex items-center gap-1.5 text-[11px] text-white/85">
                  {h.value}
                  <CheckCircle2 size={11} className={h.status === "ok" ? "text-emerald-400" : "text-yellow-400"} />
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="fixed bottom-8 left-1/2 z-[60] -translate-x-1/2 rounded-xl border border-indigo-500/30 bg-[#13131A]/95 px-4 py-2.5 text-sm text-white shadow-[0_20px_50px_-10px_rgba(99,102,241,0.5)] backdrop-blur-xl"
          >
            <span className="flex items-center gap-2"><Sparkles size={13} className="text-indigo-400" />{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command Palette */}
      <AnimatePresence>
        {cmdOpen && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-start justify-center pt-[14vh] px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setCmdOpen(false)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            />
            <motion.div
              role="dialog" aria-label="Command palette"
              className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#13131A]/95 shadow-[0_30px_80px_-10px_rgba(0,0,0,0.8)] backdrop-blur-xl"
              initial={{ opacity: 0, y: -16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -16, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
            >
              <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
                <Search size={15} className="text-white/40" />
                <input
                  autoFocus
                  type="text"
                  value={cmdQuery}
                  onChange={(e) => setCmdQuery(e.target.value)}
                  placeholder="Search actions, jump to anything..."
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none"
                />
                <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-white/50">ESC</kbd>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {filteredPalette.length === 0 && (
                  <div className="px-4 py-8 text-center text-xs text-white/40">No matches for &quot;{cmdQuery}&quot;</div>
                )}
                {groups.map((g) => {
                  const items = filteredPalette.filter((i) => i.group === g);
                  if (items.length === 0) return null;
                  return (
                    <div key={g} className="mb-1">
                      <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">{g}</div>
                      {items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => runAction(item.label)}
                            className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-white/[0.06]"
                          >
                            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/5">
                              <Icon size={13} className="text-white/75" />
                            </div>
                            <span className="flex-1 text-sm text-white/90">{item.label}</span>
                            <ChevronRight size={13} className="text-white/25 transition group-hover:translate-x-0.5 group-hover:text-white/60" />
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between border-t border-white/10 px-4 py-2 text-[10px] text-white/40">
                <span className="flex items-center gap-1.5"><Command size={10} />K to toggle</span>
                <span>Enter to run</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
