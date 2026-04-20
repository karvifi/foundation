"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import {
  Search,
  Filter,
  Plus,
  Mail,
  Calendar,
  StickyNote,
  Building2,
  DollarSign,
  ChevronDown,
  ChevronRight,
  X,
  MoreHorizontal,
  Users,
  Briefcase,
  MessageSquare,
  CheckSquare,
  Clock,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  Phone,
  Flame,
  Globe,
  Edit3,
  Bell,
} from "lucide-react";

type Stage = "Lead" | "Qualified" | "Proposal" | "Negotiation" | "Closed Won" | "Closed Lost";
type SortKey = "value" | "recent" | "name";

const STAGES: Stage[] = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];

const stageColors: Record<Stage, string> = {
  Lead: "bg-white/10 text-white/70 border-white/10",
  Qualified: "bg-sky-400/10 text-sky-300 border-sky-400/20",
  Proposal: "bg-[#6366F1]/15 text-[#8B8FFF] border-[#6366F1]/30",
  Negotiation: "bg-amber-400/10 text-amber-300 border-amber-400/20",
  "Closed Won": "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  "Closed Lost": "bg-rose-400/10 text-rose-300 border-rose-400/20",
};

interface Contact {
  id: string;
  name: string;
  company: string;
  title: string;
  email: string;
  phone: string;
  stage: Stage;
  value: number;
  lastActivity: string;
  owner: string;
  aiScore: number;
}

const initialContacts: Contact[] = [
  { id: "1", name: "Sarah Chen", company: "Acme Corp", title: "VP Engineering", email: "sarah@acme.co", phone: "+1 415 555 0142", stage: "Negotiation", value: 180000, lastActivity: "2h ago · Email", owner: "Alex", aiScore: 92 },
  { id: "2", name: "Marcus Webb", company: "Lumen Labs", title: "CTO", email: "marcus@lumen.io", phone: "+1 212 555 0119", stage: "Proposal", value: 240000, lastActivity: "5h ago · Call", owner: "Alex", aiScore: 84 },
  { id: "3", name: "Priya Shah", company: "Halcyon", title: "Head of Ops", email: "priya@halcyon.dev", phone: "+1 628 555 0203", stage: "Qualified", value: 92000, lastActivity: "1d ago · Meeting", owner: "Jamie", aiScore: 67 },
  { id: "4", name: "David Okafor", company: "Nimbus AI", title: "CEO", email: "david@nimbus.ai", phone: "+1 917 555 0488", stage: "Closed Won", value: 310000, lastActivity: "2d ago · Contract", owner: "Alex", aiScore: 98 },
  { id: "5", name: "Elena Voss", company: "Parallel", title: "Product Lead", email: "elena@parallel.so", phone: "+1 646 555 0271", stage: "Lead", value: 48000, lastActivity: "3d ago · Form", owner: "Jamie", aiScore: 41 },
  { id: "6", name: "Kenji Tanaka", company: "Orbit", title: "Director", email: "kenji@orbit.co", phone: "+81 3 5555 0178", stage: "Proposal", value: 164000, lastActivity: "1d ago · Email", owner: "Alex", aiScore: 76 },
  { id: "7", name: "Amina Diallo", company: "Beacon Health", title: "VP Product", email: "amina@beacon.health", phone: "+1 312 555 0392", stage: "Negotiation", value: 220000, lastActivity: "4h ago · Demo", owner: "Jamie", aiScore: 88 },
  { id: "8", name: "Thomas Reiner", company: "Vector", title: "COO", email: "tom@vector.cc", phone: "+49 30 5555 0122", stage: "Closed Lost", value: 80000, lastActivity: "1w ago · Note", owner: "Alex", aiScore: 22 },
  { id: "9", name: "Olivia Park", company: "Driftwood", title: "Founder", email: "olivia@driftwood.xyz", phone: "+1 503 555 0163", stage: "Qualified", value: 72000, lastActivity: "2d ago · Call", owner: "Jamie", aiScore: 58 },
  { id: "10", name: "Rafael Souza", company: "Cascade", title: "CRO", email: "rafael@cascade.io", phone: "+55 11 5555 0184", stage: "Lead", value: 56000, lastActivity: "5d ago · LinkedIn", owner: "Alex", aiScore: 35 },
  { id: "11", name: "Hannah Mitchell", company: "Foundry", title: "Dir. Engineering", email: "hannah@foundry.ai", phone: "+1 646 555 0441", stage: "Proposal", value: 198000, lastActivity: "6h ago · Email", owner: "Jamie", aiScore: 81 },
  { id: "12", name: "Yusuf Al-Rashid", company: "Meridian", title: "VP Sales", email: "yusuf@meridian.co", phone: "+971 4 555 0192", stage: "Closed Won", value: 412000, lastActivity: "3d ago · Contract", owner: "Alex", aiScore: 96 },
  { id: "13", name: "Clara Fischer", company: "Polar", title: "Head of Growth", email: "clara@polar.sh", phone: "+46 8 555 0128", stage: "Qualified", value: 88000, lastActivity: "1d ago · Meeting", owner: "Jamie", aiScore: 64 },
  { id: "14", name: "Noah Bennett", company: "Switchback", title: "CTO", email: "noah@switchback.io", phone: "+1 512 555 0244", stage: "Negotiation", value: 156000, lastActivity: "8h ago · Call", owner: "Alex", aiScore: 79 },
  { id: "15", name: "Ximena Lopez", company: "Plume", title: "Founder", email: "xi@plume.app", phone: "+52 55 5555 0132", stage: "Lead", value: 42000, lastActivity: "4d ago · Demo", owner: "Jamie", aiScore: 48 },
  { id: "16", name: "Jack Thornton", company: "Ironclad", title: "VP Eng", email: "jack@ironclad.cc", phone: "+1 415 555 0389", stage: "Proposal", value: 270000, lastActivity: "12h ago · Email", owner: "Alex", aiScore: 86 },
  { id: "17", name: "Meera Iyer", company: "Solstice", title: "COO", email: "meera@solstice.run", phone: "+91 80 5555 0173", stage: "Qualified", value: 104000, lastActivity: "2d ago · Call", owner: "Jamie", aiScore: 62 },
  { id: "18", name: "Leo Carvalho", company: "Aperture", title: "CEO", email: "leo@aperture.so", phone: "+1 718 555 0215", stage: "Closed Won", value: 355000, lastActivity: "5d ago · Contract", owner: "Alex", aiScore: 94 },
  { id: "19", name: "Sofia Andersen", company: "Tidepool", title: "Dir. Product", email: "sofia@tidepool.dev", phone: "+45 33 555 0148", stage: "Lead", value: 64000, lastActivity: "6d ago · Form", owner: "Jamie", aiScore: 39 },
  { id: "20", name: "Isaac Grant", company: "Lattice.build", title: "Engineering Lead", email: "isaac@lattice.build", phone: "+1 206 555 0276", stage: "Negotiation", value: 192000, lastActivity: "3h ago · Demo", owner: "Alex", aiScore: 83 },
];

interface TimelineEvent {
  type: string;
  title: string;
  detail: string;
  time: string;
  icon: typeof Users;
  tone: string;
}

const dealTimeline: TimelineEvent[] = [
  { type: "email", title: "Email opened", detail: "sarah@techcorp.com · proposal v3.pdf", time: "2h ago", icon: Mail, tone: "text-sky-300" },
  { type: "call", title: "Call logged", detail: "14 min · Demo call with engineering", time: "1d ago", icon: Phone, tone: "text-emerald-300" },
  { type: "stage", title: "Stage moved", detail: "Proposal → Negotiation", time: "3d ago", icon: ArrowRight, tone: "text-[#8B8FFF]" },
  { type: "linkedin", title: "LinkedIn viewed", detail: "Profile visited from team page", time: "5d ago", icon: Globe, tone: "text-sky-300" },
  { type: "email", title: "Reply received", detail: "Re: pricing & SOC2 questions", time: "6d ago", icon: Mail, tone: "text-sky-300" },
  { type: "meeting", title: "Meeting booked", detail: "Stakeholder alignment · 30 min", time: "1w ago", icon: Calendar, tone: "text-amber-300" },
  { type: "note", title: "Note added", detail: "Budget approved for Q1", time: "1w ago", icon: StickyNote, tone: "text-white/60" },
  { type: "deal", title: "Deal value updated", detail: "$120K → $180K", time: "2w ago", icon: DollarSign, tone: "text-emerald-300" },
];

interface AssociatedDeal { name: string; value: number; stage: Stage; close: string; }
const associatedDeals: AssociatedDeal[] = [
  { name: "Platform License 2026", value: 180000, stage: "Negotiation", close: "Dec 28" },
  { name: "Professional Services", value: 45000, stage: "Proposal", close: "Jan 15" },
  { name: "Training Package", value: 18000, stage: "Qualified", close: "Feb 10" },
];

interface Task { title: string; due: string; done: boolean; }
const tasks: Task[] = [
  { title: "Send redlined MSA", due: "Today", done: false },
  { title: "Book kickoff call with Marcus", due: "Tomorrow", done: false },
  { title: "Review procurement questionnaire", due: "Dec 22", done: true },
];

interface Note { author: string; time: string; body: string; }
const notes: Note[] = [
  { author: "Alex", time: "2h ago", body: "Legal approved our SOC2 addendum. Main blocker is now indemnification cap, pushing back at 1x ACV." },
  { author: "Jamie", time: "1d ago", body: "Sarah confirmed Q1 budget. Head of Finance (Will) now involved in final sign-off." },
];

const QUICK_ACTIONS = [
  { icon: Edit3, label: "Edit deal" },
  { icon: ArrowRight, label: "Move stage" },
  { icon: Phone, label: "Log call" },
  { icon: Mail, label: "Send email" },
  { icon: Bell, label: "Set reminder" },
];

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

function initials(name: string): string {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("");
}

interface ScoreMeta { label: string; cls: string; dot: string; hot: boolean; }
function scoreMeta(score: number): ScoreMeta {
  if (score >= 80) return { label: "Hot", cls: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30", dot: "bg-emerald-400", hot: true };
  if (score >= 60) return { label: "Warm", cls: "bg-amber-400/10 text-amber-300 border-amber-400/30", dot: "bg-amber-400", hot: false };
  return { label: "Cold", cls: "bg-white/5 text-white/50 border-white/10", dot: "bg-white/40", hot: false };
}

export default function CrmPage() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [selectedId, setSelectedId] = useState<string>("1");
  const [search, setSearch] = useState<string>("");
  const [filterStage, setFilterStage] = useState<Stage | "All">("All");
  const [filterOwner, setFilterOwner] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortKey>("value");
  const [showNew, setShowNew] = useState<boolean>(false);
  const [showInsights, setShowInsights] = useState<boolean>(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [newContact, setNewContact] = useState<{ name: string; company: string; email: string; value: string }>({
    name: "", company: "", email: "", value: "",
  });

  const menuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenuId(null);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const selected = contacts.find((c) => c.id === selectedId) ?? contacts[0];

  const filtered = useMemo<Contact[]>(() => {
    return contacts
      .filter((c) => (search ? (c.name + c.company + c.email).toLowerCase().includes(search.toLowerCase()) : true))
      .filter((c) => (filterStage === "All" ? true : c.stage === filterStage))
      .filter((c) => (filterOwner === "All" ? true : c.owner === filterOwner))
      .sort((a, b) => {
        if (sortBy === "value") return b.value - a.value;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return b.aiScore - a.aiScore;
      });
  }, [contacts, search, filterStage, filterOwner, sortBy]);

  const pipelineTotal = useMemo<number>(
    () => contacts.filter((c) => c.stage !== "Closed Lost").reduce((sum, c) => sum + c.value, 0),
    [contacts]
  );
  const wonThisMonth = useMemo<number>(
    () => contacts.filter((c) => c.stage === "Closed Won").reduce((s, c) => s + c.value, 0),
    [contacts]
  );
  const monthGoal = 180000;
  const monthPct = Math.min(100, Math.round((wonThisMonth / monthGoal) * 100));
  const qForecast = Math.round(pipelineTotal * 0.32);
  const pipelineHealth = useMemo<number>(() => {
    const active = contacts.filter((c) => c.stage !== "Closed Lost" && c.stage !== "Closed Won");
    if (active.length === 0) return 0;
    return Math.round(active.reduce((s, c) => s + c.aiScore, 0) / active.length);
  }, [contacts]);
  const healthTone =
    pipelineHealth >= 75 ? "text-emerald-300" : pipelineHealth >= 55 ? "text-amber-300" : "text-rose-300";

  const stageCounts = useMemo(() => {
    return STAGES.map((s) => ({
      stage: s,
      count: contacts.filter((c) => c.stage === s).length,
      value: contacts.filter((c) => c.stage === s).reduce((a, b) => a + b.value, 0),
    }));
  }, [contacts]);

  const atRisk = useMemo<Contact[]>(() => {
    return contacts
      .filter((c) => c.stage !== "Closed Won" && c.stage !== "Closed Lost" && c.aiScore < 55)
      .slice(0, 3);
  }, [contacts]);

  function addContact(): void {
    if (!newContact.name || !newContact.company) return;
    const c: Contact = {
      id: String(Date.now()),
      name: newContact.name,
      company: newContact.company,
      title: "—",
      email: newContact.email || "—",
      phone: "—",
      stage: "Lead",
      value: Number(newContact.value) || 0,
      lastActivity: "Just now · Created",
      owner: "Alex",
      aiScore: 50,
    };
    setContacts((prev) => [c, ...prev]);
    setShowNew(false);
    setNewContact({ name: "", company: "", email: "", value: "" });
    setSelectedId(c.id);
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col">
      <div className="border-b border-white/5 bg-gradient-to-b from-[#12121A] to-[#0A0A0F] px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#6366F1]/15 border border-[#6366F1]/30 flex items-center justify-center">
              <Users className="w-4 h-4 text-[#6366F1]" />
            </div>
            <div>
              <div className="text-xs text-white/40 uppercase tracking-wider">CRM</div>
              <div className="text-lg font-light tracking-tight">Revenue Pipeline</div>
            </div>
          </div>

          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contacts, companies, emails..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm placeholder:text-white/30 focus:outline-none focus:border-[#6366F1]/40 focus:bg-white/[0.05]"
            />
          </div>

          <div className="flex items-center gap-2">
            <FilterSelect icon={<Filter className="w-3.5 h-3.5" />} value={filterStage} onChange={(v) => setFilterStage(v as Stage | "All")} options={["All", ...STAGES]} />
            <FilterSelect icon={<Users className="w-3.5 h-3.5" />} value={filterOwner} onChange={setFilterOwner} options={["All", "Alex", "Jamie"]} />
            <FilterSelect icon={<ArrowUpRight className="w-3.5 h-3.5" />} value={sortBy} onChange={(v) => setSortBy(v as SortKey)} options={["value", "recent", "name"]} />
            <button
              onClick={() => setShowInsights((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm transition ${
                showInsights ? "bg-[#6366F1]/15 border-[#6366F1]/40 text-[#8B8FFF]" : "bg-white/[0.03] border-white/10 text-white/60 hover:text-white"
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5" /> AI
            </button>
            <button
              onClick={() => setShowNew(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#5558E3] text-sm font-medium transition shadow-lg shadow-[#6366F1]/20"
            >
              <Plus className="w-4 h-4" /> New Contact
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-3 border-b border-white/5 bg-[#0C0C13]">
        <div className="flex items-center gap-4 overflow-x-auto">
          <ForecastCard label="This month" primary={`${formatMoney(wonThisMonth)} / ${formatMoney(monthGoal)}`} accent="text-emerald-300">
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-[#6366F1]" style={{ width: `${monthPct}%` }} />
            </div>
          </ForecastCard>
          <ForecastCard label="Q2 Forecast" primary={formatMoney(qForecast)} accent="text-[#8B8FFF]">
            <div className="mt-1.5 flex items-center gap-1 text-[10px] text-emerald-300">
              <TrendingUp className="w-3 h-3" /> +12.4% vs Q1
            </div>
          </ForecastCard>
          <ForecastCard label="Pipeline health" primary={`${pipelineHealth}%`} accent={healthTone}>
            <div className="mt-1.5 flex items-center gap-1 text-[10px] text-white/50">
              {pipelineHealth >= 60 ? <TrendingUp className="w-3 h-3 text-emerald-300" /> : <TrendingDown className="w-3 h-3 text-rose-300" />}
              {atRisk.length} deals need attention
            </div>
          </ForecastCard>
          <div className="h-10 w-px bg-white/10" />
          <div className="shrink-0">
            <div className="text-[10px] text-white/40 uppercase tracking-wider">Total pipeline</div>
            <div className="text-xl font-light tracking-tight bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">
              {formatMoney(pipelineTotal)}
            </div>
          </div>
          {stageCounts.map((s) => (
            <div key={s.stage} className="shrink-0">
              <div className="text-[10px] text-white/40 uppercase tracking-wider">{s.stage}</div>
              <div className="text-xs mt-0.5">
                <span className="font-medium">{s.count}</span>
                <span className="text-white/40"> · {formatMoney(s.value)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
        <div className="col-span-3 border-r border-white/5 overflow-y-auto p-4 bg-[#09090E]">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs text-white/40 uppercase tracking-wider">Pipeline board</div>
            <button className="text-xs text-white/40 hover:text-white flex items-center gap-1">
              Expand <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {STAGES.map((stage) => {
              const deals = contacts.filter((c) => c.stage === stage);
              const stageTotal = deals.reduce((a, b) => a + b.value, 0);
              return (
                <div key={stage} className="rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden">
                  <div className="px-3 py-2.5 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider border ${stageColors[stage]}`}>
                        {stage}
                      </span>
                      <span className="text-xs text-white/40">{deals.length}</span>
                    </div>
                    <span className="text-xs text-white/50 font-medium">{formatMoney(stageTotal)}</span>
                  </div>
                  <div className="p-2 space-y-1.5 max-h-56 overflow-y-auto">
                    {deals.length === 0 && <div className="text-[11px] text-white/30 py-2 text-center">No deals</div>}
                    {deals.slice(0, 4).map((d) => {
                      const meta = scoreMeta(d.aiScore);
                      const isOpen = openMenuId === d.id;
                      return (
                        <div key={d.id} className="relative group">
                          <button
                            onClick={() => setSelectedId(d.id)}
                            className={`w-full text-left p-2.5 rounded-lg border transition ${
                              selectedId === d.id ? "bg-[#6366F1]/10 border-[#6366F1]/40" : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-xs font-medium truncate">{d.company}</div>
                              <div className="text-xs text-[#8B8FFF] shrink-0 font-medium">{formatMoney(d.value)}</div>
                            </div>
                            <div className="flex items-center justify-between gap-2 mt-1">
                              <div className="text-[10px] text-white/40 truncate">{d.name}</div>
                              <span className={`shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] font-medium ${meta.cls}`}>
                                {meta.hot && <Flame className="w-2.5 h-2.5" />}
                                {d.aiScore} · {meta.label}
                              </span>
                            </div>
                          </button>
                          <button
                            aria-label="Quick actions"
                            onClick={(e) => { e.stopPropagation(); setOpenMenuId(isOpen ? null : d.id); }}
                            className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md bg-black/40 border border-white/10 hover:bg-white/10 flex items-center justify-center transition"
                          >
                            <MoreHorizontal className="w-3 h-3 text-white/70" />
                          </button>
                          {isOpen && (
                            <div ref={menuRef} className="absolute right-1.5 top-8 z-20 w-44 rounded-lg bg-[#14141D] border border-white/10 shadow-xl shadow-black/60 py-1">
                              {QUICK_ACTIONS.map((a) => {
                                const Icon = a.icon;
                                return (
                                  <button
                                    key={a.label}
                                    onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }}
                                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-white/80 hover:bg-white/5 transition"
                                  >
                                    <Icon className="w-3 h-3 text-[#8B8FFF]" /> {a.label}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {deals.length > 4 && (
                      <button className="w-full text-[10px] text-white/40 hover:text-white py-1">+ {deals.length - 4} more</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="col-span-3 border-r border-white/5 overflow-y-auto bg-[#0A0A0F]">
          <div className="px-4 py-3 sticky top-0 bg-[#0A0A0F]/95 backdrop-blur border-b border-white/5 flex items-center justify-between z-10">
            <div className="text-xs text-white/40 uppercase tracking-wider">Contacts · {filtered.length}</div>
            <button className="text-xs text-white/40 hover:text-white flex items-center gap-1">
              <MoreHorizontal className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-white/5">
            {filtered.map((c) => {
              const meta = scoreMeta(c.aiScore);
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`w-full text-left px-4 py-3.5 flex items-center gap-3 transition ${
                    selectedId === c.id ? "bg-[#6366F1]/10 border-l-2 border-l-[#6366F1]" : "hover:bg-white/[0.02] border-l-2 border-l-transparent"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-xs font-medium">
                      {initials(c.name)}
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0A0A0F] ${meta.dot}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-medium truncate">{c.name}</div>
                      <div className="text-xs text-white/60 font-medium shrink-0">{formatMoney(c.value)}</div>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <div className="text-xs text-white/50 truncate">{c.company}</div>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider border shrink-0 ${stageColors[c.stage]}`}>
                        {c.stage}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <div className="text-[10px] text-white/30 truncate">{c.lastActivity}</div>
                      <span className={`shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] font-medium ${meta.cls}`}>
                        {meta.hot && <Flame className="w-2.5 h-2.5" />} {c.aiScore}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && <div className="p-8 text-center text-sm text-white/40">No contacts match your filters</div>}
          </div>
        </div>

        <div className="col-span-3 border-r border-white/5 overflow-y-auto bg-[#09090E]">
          {selected && (
            <div>
              <div className="p-6 border-b border-white/5 bg-gradient-to-b from-[#12121A] to-transparent">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-lg font-light shadow-lg shadow-[#6366F1]/30">
                    {initials(selected.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-lg font-light tracking-tight">{selected.name}</div>
                    <div className="text-xs text-white/50 mt-0.5">{selected.title}</div>
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-white/70">
                      <Building2 className="w-3 h-3 text-white/40" /> {selected.company}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`px-2 py-1 rounded-md text-[10px] uppercase tracking-wider border ${stageColors[selected.stage]}`}>
                      {selected.stage}
                    </span>
                    {(() => {
                      const meta = scoreMeta(selected.aiScore);
                      return (
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[10px] font-medium ${meta.cls}`}>
                          {meta.hot && <Flame className="w-3 h-3" />}
                          {selected.aiScore} · {meta.label}
                        </span>
                      );
                    })()}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mt-5">
                  {[
                    { icon: Mail, label: "Email" },
                    { icon: Phone, label: "Call" },
                    { icon: Calendar, label: "Meeting" },
                    { icon: StickyNote, label: "Note" },
                  ].map((a) => {
                    const Icon = a.icon;
                    return (
                      <button key={a.label} className="flex flex-col items-center gap-1.5 py-2.5 rounded-lg bg-white/[0.03] hover:bg-[#6366F1]/10 hover:border-[#6366F1]/30 border border-white/5 transition">
                        <Icon className="w-3.5 h-3.5 text-[#8B8FFF]" />
                        <span className="text-[10px] text-white/60">{a.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="text-[10px] text-white/40 uppercase tracking-wider">Email</div>
                    <div className="mt-1 text-white/80 truncate">{selected.email}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="text-[10px] text-white/40 uppercase tracking-wider">Phone</div>
                    <div className="mt-1 text-white/80">{selected.phone}</div>
                  </div>
                </div>
              </div>

              <Section title="Associated deals" icon={Briefcase}>
                <div className="space-y-2">
                  {associatedDeals.map((d) => (
                    <div key={d.name} className="p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#6366F1]/30 transition">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{d.name}</div>
                        <div className="text-sm text-[#8B8FFF] font-medium">{formatMoney(d.value)}</div>
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider border ${stageColors[d.stage]}`}>
                          {d.stage}
                        </span>
                        <span className="text-[10px] text-white/40 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> Close {d.close}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Tasks" icon={CheckSquare}>
                <div className="space-y-1.5">
                  {tasks.map((t) => (
                    <div key={t.title} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${t.done ? "bg-[#6366F1] border-[#6366F1]" : "border-white/20 bg-transparent"}`}>
                        {t.done && <CheckSquare className="w-2.5 h-2.5" />}
                      </div>
                      <div className={`flex-1 text-xs ${t.done ? "line-through text-white/40" : "text-white/85"}`}>{t.title}</div>
                      <div className="text-[10px] text-white/40">{t.due}</div>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Notes" icon={StickyNote}>
                <div className="space-y-2.5">
                  {notes.map((n, i) => (
                    <div key={i} className="p-3 rounded-lg bg-gradient-to-br from-[#6366F1]/5 to-transparent border border-[#6366F1]/15">
                      <div className="flex items-center justify-between text-[10px] mb-1.5">
                        <span className="text-[#8B8FFF] font-medium">{n.author}</span>
                        <span className="text-white/40">{n.time}</span>
                      </div>
                      <div className="text-xs text-white/80 leading-relaxed">{n.body}</div>
                    </div>
                  ))}
                  <button className="w-full py-2 rounded-lg border border-dashed border-white/10 hover:border-[#6366F1]/40 hover:bg-[#6366F1]/5 text-xs text-white/50 hover:text-white transition flex items-center justify-center gap-1.5">
                    <Plus className="w-3 h-3" /> Add note
                  </button>
                </div>
              </Section>
            </div>
          )}
        </div>

        <div className="col-span-3 overflow-y-auto bg-[#08080D]">
          {selected && (
            <>
              <div className="px-5 py-4 border-b border-white/5 sticky top-0 bg-[#08080D]/95 backdrop-blur z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-white/40 uppercase tracking-wider">
                    <MessageSquare className="w-3 h-3" /> Activity feed
                  </div>
                  <span className="text-[10px] text-white/40">{selected.name}</span>
                </div>
              </div>

              <div className="px-5 py-4 border-b border-white/5">
                <div className="relative pl-5">
                  <div className="absolute left-1.5 top-2 bottom-2 w-px bg-white/10" />
                  <div className="space-y-3.5">
                    {dealTimeline.map((e, i) => {
                      const Icon = e.icon;
                      return (
                        <div key={i} className="relative">
                          <div className="absolute -left-[14px] top-1 w-3 h-3 rounded-full bg-[#08080D] border-2 border-[#6366F1]/50 flex items-center justify-center">
                            <div className="w-1 h-1 rounded-full bg-[#6366F1]" />
                          </div>
                          <div className="flex items-start gap-2.5">
                            <div className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                              <Icon className={`w-3.5 h-3.5 ${e.tone}`} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs text-white/90 font-medium">{e.title}</div>
                              <div className="text-[11px] text-white/50 mt-0.5 truncate">{e.detail}</div>
                              <div className="text-[10px] text-white/30 mt-0.5">{e.time}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {showInsights && (
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-[#8B8FFF] uppercase tracking-wider">
                    <BrainCircuit className="w-3.5 h-3.5" /> AI insights
                  </div>

                  <InsightCard icon={<TrendingDown className="w-3.5 h-3.5 text-rose-300" />} title={`${atRisk.length} deals at risk of going cold`} accent="from-rose-500/10">
                    <div className="space-y-1 mt-2">
                      {atRisk.map((d) => {
                        const meta = scoreMeta(d.aiScore);
                        return (
                          <button
                            key={d.id}
                            onClick={() => setSelectedId(d.id)}
                            className="w-full flex items-center justify-between gap-2 p-2 rounded-md bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition"
                          >
                            <div className="min-w-0 text-left">
                              <div className="text-xs font-medium truncate">{d.company}</div>
                              <div className="text-[10px] text-white/40 truncate">{d.name} · {d.lastActivity}</div>
                            </div>
                            <span className={`shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] font-medium ${meta.cls}`}>
                              {d.aiScore}
                            </span>
                          </button>
                        );
                      })}
                      {atRisk.length === 0 && <div className="text-[11px] text-white/40">All active deals are warm or hot.</div>}
                    </div>
                  </InsightCard>

                  <InsightCard icon={<Clock className="w-3.5 h-3.5 text-sky-300" />} title={`Best time to reach ${selected.company}`} accent="from-sky-500/10">
                    <div className="text-xs text-white/80 mt-1.5">
                      Tuesday <span className="text-sky-300 font-medium">10–11am PT</span>
                    </div>
                    <div className="text-[10px] text-white/40 mt-1">Based on 3 prior opens and 2 reply timestamps.</div>
                  </InsightCard>

                  <InsightCard icon={<Sparkles className="w-3.5 h-3.5 text-emerald-300" />} title="Similar deal pattern" accent="from-emerald-500/10">
                    <div className="text-xs text-white/80 leading-relaxed mt-1.5">
                      <span className="text-emerald-300 font-medium">78% close rate</span> when a demo is booked within
                      <span className="text-white"> 7 days</span> of first qualified call.
                    </div>
                    <button className="mt-2 inline-flex items-center gap-1 text-[11px] text-[#8B8FFF] hover:text-white">
                      Book demo now <ChevronRight className="w-3 h-3" />
                    </button>
                  </InsightCard>

                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#6366F1]/15 to-transparent border border-[#6366F1]/25">
                    <div className="flex items-center gap-2 text-[10px] text-[#8B8FFF] uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" /> Next best action
                    </div>
                    <div className="mt-2 text-xs text-white/85 leading-relaxed">
                      {selected.name} is{" "}
                      <span className="text-[#8B8FFF] font-medium">{Math.min(95, selected.aiScore + 5)}% likely</span>{" "}
                      to close within 14 days. Send the redlined MSA today.
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showNew && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-md rounded-2xl bg-gradient-to-b from-[#14141D] to-[#0C0C13] border border-white/10 shadow-2xl shadow-black/60 overflow-hidden">
            <div className="px-6 py-5 flex items-center justify-between border-b border-white/5">
              <div>
                <div className="text-xs text-white/40 uppercase tracking-wider">New</div>
                <div className="text-lg font-light mt-0.5">Create contact</div>
              </div>
              <button onClick={() => setShowNew(false)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Field label="Name">
                <input autoFocus value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} placeholder="Jane Doe" className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:border-[#6366F1]/50" />
              </Field>
              <Field label="Company">
                <input value={newContact.company} onChange={(e) => setNewContact({ ...newContact, company: e.target.value })} placeholder="Acme Corp" className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:border-[#6366F1]/50" />
              </Field>
              <Field label="Email">
                <input type="email" value={newContact.email} onChange={(e) => setNewContact({ ...newContact, email: e.target.value })} placeholder="jane@acme.co" className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:border-[#6366F1]/50" />
              </Field>
              <Field label="Estimated deal value">
                <input type="number" value={newContact.value} onChange={(e) => setNewContact({ ...newContact, value: e.target.value })} placeholder="50000" className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:border-[#6366F1]/50" />
              </Field>
            </div>
            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-end gap-2 bg-black/20">
              <button onClick={() => setShowNew(false)} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition">Cancel</button>
              <button onClick={addContact} className="px-4 py-2 rounded-lg bg-[#6366F1] hover:bg-[#5558E3] text-sm font-medium transition shadow-lg shadow-[#6366F1]/20">Create contact</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ForecastCardProps { label: string; primary: string; accent: string; children?: ReactNode; }
function ForecastCard({ label, primary, accent, children }: ForecastCardProps) {
  return (
    <div className="shrink-0 min-w-[180px] p-3 rounded-xl bg-white/[0.02] border border-white/5">
      <div className="text-[10px] text-white/40 uppercase tracking-wider">{label}</div>
      <div className={`text-sm font-medium mt-0.5 ${accent}`}>{primary}</div>
      {children}
    </div>
  );
}

interface InsightCardProps { icon: ReactNode; title: string; accent: string; children: ReactNode; }
function InsightCard({ icon, title, accent, children }: InsightCardProps) {
  return (
    <div className={`p-3 rounded-xl bg-gradient-to-br ${accent} to-transparent border border-white/10`}>
      <div className="flex items-center gap-2">
        {icon}
        <div className="text-xs font-medium text-white/90">{title}</div>
      </div>
      {children}
    </div>
  );
}

interface SectionProps { title: string; icon: typeof Users; children: ReactNode; }
function Section({ title, icon: Icon, children }: SectionProps) {
  return (
    <div className="px-5 py-5 border-b border-white/5">
      <div className="flex items-center gap-2 text-xs text-white/40 uppercase tracking-wider mb-3">
        <Icon className="w-3 h-3" /> {title}
      </div>
      {children}
    </div>
  );
}

interface FieldProps { label: string; children: ReactNode; }
function Field({ label, children }: FieldProps) {
  return (
    <div>
      <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5">{label}</div>
      {children}
    </div>
  );
}

interface FilterSelectProps { icon: ReactNode; value: string; onChange: (v: string) => void; options: string[]; }
function FilterSelect({ icon, value, onChange, options }: FilterSelectProps) {
  return (
    <div className="relative">
      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">{icon}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-8 pr-8 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm hover:bg-white/[0.05] cursor-pointer focus:outline-none focus:border-[#6366F1]/40 capitalize"
      >
        {options.map((o) => (
          <option key={o} className="bg-[#0A0A0F]">{o}</option>
        ))}
      </select>
      <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/40" />
    </div>
  );
}
