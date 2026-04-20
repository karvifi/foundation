"use client";

import React, { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Clock,
  Users,
  Calendar as CalendarIcon,
  Trash2,
  Edit3,
  MapPin,
  Repeat,
  AlignLeft,
  Search,
  Settings,
  Bell,
  BrainCircuit,
  Shield,
  BarChart2,
  Zap,
  Target,
  AlertTriangle,
} from "lucide-react";

type Category = "meeting" | "deadline" | "reminder" | "personal" | "omnios";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startHour: number;
  endHour: number;
  category: Category;
  description?: string;
  attendees?: string[];
  location?: string;
  recurring?: "none" | "daily" | "weekly" | "monthly";
}

interface CategoryStyle {
  label: string;
  bg: string;
  pill: string;
  dot: string;
}

interface AiSlot {
  id: string;
  date: string;
  startHour: number;
  label: string;
}

interface AiParse {
  contact: string;
  org: string;
  duration: number;
  type: string;
  slots: AiSlot[];
}

const CATEGORIES: Record<Category, CategoryStyle> = {
  meeting: { label: "Meetings", bg: "bg-indigo-500/20", pill: "bg-indigo-500/25 text-indigo-200 border-l-2 border-indigo-400", dot: "bg-indigo-500" },
  deadline: { label: "Deadlines", bg: "bg-red-500/20", pill: "bg-red-500/25 text-red-200 border-l-2 border-red-400", dot: "bg-red-500" },
  reminder: { label: "Reminders", bg: "bg-amber-500/20", pill: "bg-amber-500/25 text-amber-200 border-l-2 border-amber-400", dot: "bg-amber-500" },
  personal: { label: "Personal", bg: "bg-emerald-500/20", pill: "bg-emerald-500/25 text-emerald-200 border-l-2 border-emerald-400", dot: "bg-emerald-500" },
  omnios: { label: "OmniOS", bg: "bg-purple-500/20", pill: "bg-purple-500/25 text-purple-200 border-l-2 border-purple-400", dot: "bg-purple-500" },
};

const MOCK_EVENTS: CalendarEvent[] = [
  { id: "e1", title: "Daily Standup", date: "2026-04-01", startHour: 9, endHour: 9.5, category: "meeting", description: "Engineering daily sync — blockers, progress, priorities.", attendees: ["Alex", "Priya", "Jordan", "Sam"], location: "Zoom", recurring: "daily" },
  { id: "e2", title: "Client Call — Northwind", date: "2026-04-02", startHour: 11, endHour: 12, category: "meeting", description: "Discovery call on integration scope.", attendees: ["Taylor", "Morgan (Northwind)"], location: "Google Meet" },
  { id: "e3", title: "Q2 OKR Review", date: "2026-04-03", startHour: 14, endHour: 15.5, category: "omnios", description: "Review quarterly OKRs across product, eng, and GTM.", attendees: ["Leadership"], location: "HQ — Atlas Room" },
  { id: "e4", title: "Design Review", date: "2026-04-06", startHour: 10, endHour: 11, category: "meeting", attendees: ["Design Guild"] },
  { id: "e5", title: "Sprint 24 Planning", date: "2026-04-06", startHour: 13, endHour: 14.5, category: "omnios", attendees: ["Engineering"] },
  { id: "e6", title: "Lunch with Sam", date: "2026-04-07", startHour: 12.5, endHour: 13.5, category: "personal", location: "Blue Bottle" },
  { id: "e7", title: "Submit Compliance Report", date: "2026-04-08", startHour: 17, endHour: 17.5, category: "deadline", description: "SOC 2 evidence package due to auditor." },
  { id: "e8", title: "Product Demo — v2.3", date: "2026-04-09", startHour: 15, endHour: 16, category: "omnios", attendees: ["All hands"] },
  { id: "e9", title: "1:1 with Priya", date: "2026-04-10", startHour: 9, endHour: 9.5, category: "meeting", recurring: "weekly" },
  { id: "e10", title: "Dentist", date: "2026-04-13", startHour: 8.5, endHour: 9.5, category: "personal", location: "Downtown Dental" },
  { id: "e11", title: "Architecture Deep Dive", date: "2026-04-14", startHour: 10, endHour: 12, category: "meeting", description: "Runtime scheduler redesign discussion." },
  { id: "e12", title: "Taxes Filing Deadline", date: "2026-04-15", startHour: 17, endHour: 17.5, category: "deadline" },
  { id: "e13", title: "Call Mom", date: "2026-04-15", startHour: 19, endHour: 19.5, category: "reminder" },
  { id: "e14", title: "Sprint Review", date: "2026-04-17", startHour: 14, endHour: 15, category: "omnios" },
  { id: "e15", title: "Retrospective", date: "2026-04-17", startHour: 14.5, endHour: 16.5, category: "meeting" },
  { id: "e16", title: "Yoga", date: "2026-04-18", startHour: 8, endHour: 9, category: "personal", recurring: "weekly" },
  { id: "e17", title: "Board Prep Session", date: "2026-04-20", startHour: 10, endHour: 12, category: "omnios", attendees: ["Exec team"] },
  { id: "e18", title: "Security Audit Kickoff", date: "2026-04-21", startHour: 13, endHour: 14, category: "meeting" },
  { id: "e19", title: "Renew Passport", date: "2026-04-22", startHour: 11, endHour: 11.5, category: "reminder" },
  { id: "e20", title: "Client Call — Helios", date: "2026-04-23", startHour: 15, endHour: 16, category: "meeting", attendees: ["Helios PM", "Alex"] },
  { id: "e21", title: "Release v2.4 Cutover", date: "2026-04-24", startHour: 16, endHour: 17, category: "deadline" },
  { id: "e22", title: "Team Dinner", date: "2026-04-24", startHour: 19, endHour: 21, category: "personal", location: "Osteria" },
  { id: "e23", title: "All Hands", date: "2026-04-27", startHour: 10, endHour: 11, category: "omnios", recurring: "monthly" },
  { id: "e24", title: "Performance Reviews Due", date: "2026-04-28", startHour: 17, endHour: 17.5, category: "deadline" },
  { id: "e25", title: "Roadmap Sync", date: "2026-04-29", startHour: 14, endHour: 15, category: "meeting" },
  { id: "e26", title: "Month-End Review", date: "2026-04-30", startHour: 16, endHour: 17, category: "omnios" },
];

const FOCUS_BLOCKS: { date: string; startHour: number; endHour: number }[] = [
  { date: "2026-04-20", startHour: 14, endHour: 16.5 },
  { date: "2026-04-21", startHour: 9, endHour: 11 },
  { date: "2026-04-22", startHour: 13, endHour: 15 },
  { date: "2026-04-23", startHour: 9, endHour: 11 },
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const TODAY = { year: 2026, month: 3, day: 19 };

function pad(n: number): string { return n < 10 ? `0${n}` : `${n}`; }
function dateKey(y: number, m: number, d: number): string { return `${y}-${pad(m + 1)}-${pad(d)}`; }
function formatHour(h: number): string {
  const hour = Math.floor(h);
  const mins = Math.round((h - hour) * 60);
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return mins === 0 ? `${display}:00 ${suffix}` : `${display}:${pad(mins)} ${suffix}`;
}
function daysInMonth(y: number, m: number): number { return new Date(y, m + 1, 0).getDate(); }
function firstWeekday(y: number, m: number): number { return new Date(y, m, 1).getDay(); }

function parseAiQuery(q: string): AiParse | null {
  if (!q.trim()) return null;
  const emailMatch = q.match(/([\w.+-]+)@([\w-]+)\.[\w.-]+/);
  const durMatch = q.match(/(\d+)\s*(min|hour|hr)/i);
  const typeMatch = q.match(/\b(demo|sync|review|intro|call|standup|1:1|interview)\b/i);
  const contact = emailMatch ? emailMatch[1].split(".")[0].replace(/^\w/, (c) => c.toUpperCase()) : "Guest";
  const org = emailMatch ? emailMatch[2].replace(/^\w/, (c) => c.toUpperCase()) : "—";
  const dur = durMatch ? (durMatch[2].toLowerCase().startsWith("h") ? Number(durMatch[1]) * 60 : Number(durMatch[1])) : 30;
  const type = typeMatch ? typeMatch[1].replace(/^\w/, (c) => c.toUpperCase()) : "Meeting";
  return {
    contact, org, duration: dur, type,
    slots: [
      { id: "s1", date: "2026-04-22", startHour: 10, label: "Mon Apr 22 · 10:00 AM" },
      { id: "s2", date: "2026-04-23", startHour: 14, label: "Tue Apr 23 · 2:00 PM" },
      { id: "s3", date: "2026-04-24", startHour: 9, label: "Wed Apr 24 · 9:00 AM" },
    ],
  };
}

type ViewMode = "month" | "week" | "day";

export default function CalendarPage() {
  const [year, setYear] = useState<number>(2026);
  const [month, setMonth] = useState<number>(3);
  const [view, setView] = useState<ViewMode>("month");
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<number>(TODAY.day);
  const [aiSchedulingQuery, setAiSchedulingQuery] = useState<string>("");
  const [showFocus, setShowFocus] = useState<boolean>(true);
  const [enabledCats, setEnabledCats] = useState<Record<Category, boolean>>({
    meeting: true, deadline: true, reminder: true, personal: true, omnios: true,
  });

  const visibleEvents = useMemo(() => events.filter((e) => enabledCats[e.category]), [events, enabledCats]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of visibleEvents) {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    }
    for (const [, list] of map) list.sort((a, b) => a.startHour - b.startHour);
    return map;
  }, [visibleEvents]);

  const conflictsById = useMemo(() => {
    const map = new Map<string, string>();
    for (const [, list] of eventsByDay) {
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list.length; j++) {
          if (i === j) continue;
          const a = list[i]; const b = list[j];
          if (a.startHour < b.endHour && b.startHour < a.endHour) {
            map.set(a.id, b.title);
            break;
          }
        }
      }
    }
    return map;
  }, [eventsByDay]);

  const aiParse = useMemo(() => parseAiQuery(aiSchedulingQuery), [aiSchedulingQuery]);

  const navigate = (delta: number): void => {
    let m = month + delta; let y = year;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setMonth(m); setYear(y);
  };

  const goToday = (): void => { setYear(TODAY.year); setMonth(TODAY.month); setSelectedDay(TODAY.day); };

  const monthCells = useMemo(() => {
    const leading = firstWeekday(year, month);
    const total = daysInMonth(year, month);
    const cells: { day: number; inMonth: boolean; date?: string }[] = [];
    const prevTotal = daysInMonth(year, month === 0 ? 11 : month - 1);
    for (let i = leading - 1; i >= 0; i--) cells.push({ day: prevTotal - i, inMonth: false });
    for (let d = 1; d <= total; d++) cells.push({ day: d, inMonth: true, date: dateKey(year, month, d) });
    let trailing = 1;
    while (cells.length < 42) cells.push({ day: trailing++, inMonth: false });
    return cells;
  }, [year, month]);

  const weekDays = useMemo(() => {
    const dow = new Date(year, month, selectedDay).getDay();
    const start = new Date(year, month, selectedDay - dow);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start); d.setDate(start.getDate() + i); return d;
    });
  }, [year, month, selectedDay]);

  const isToday = (y: number, m: number, d: number): boolean =>
    y === TODAY.year && m === TODAY.month && d === TODAY.day;

  const bookAiSlot = (slot: AiSlot): void => {
    if (!aiParse) return;
    const ev: CalendarEvent = {
      id: `ai-${Date.now()}`,
      title: `${aiParse.type} with ${aiParse.contact}`,
      date: slot.date,
      startHour: slot.startHour,
      endHour: slot.startHour + aiParse.duration / 60,
      category: "meeting",
      attendees: [`${aiParse.contact} (${aiParse.org})`],
      description: `Auto-scheduled by OmniOS AI from: "${aiSchedulingQuery}"`,
    };
    setEvents((prev) => [...prev, ev]);
    setAiSchedulingQuery("");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center ring-1 ring-indigo-500/40">
              <CalendarIcon className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Calendar</h1>
              <p className="text-xs text-white/50">OmniOS scheduling</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 ml-6">
            <button onClick={goToday} className="px-3 py-1.5 text-sm rounded-md border border-white/15 hover:bg-white/5 transition">Today</button>
            <div className="flex items-center">
              <button onClick={() => navigate(-1)} className="p-1.5 rounded-md hover:bg-white/10 transition" aria-label="Previous month"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => navigate(1)} className="p-1.5 rounded-md hover:bg-white/10 transition" aria-label="Next month"><ChevronRight className="w-4 h-4" /></button>
            </div>
            <h2 className="text-xl font-semibold ml-2">{MONTHS[month]} <span className="text-white/60 font-light">{year}</span></h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-sm text-white/60 w-64">
            <Search className="w-4 h-4" />
            <input placeholder="Search events" className="bg-transparent outline-none flex-1 placeholder:text-white/40 text-white" />
          </div>
          <div className="flex rounded-md border border-white/15 overflow-hidden text-sm">
            {(["month", "week", "day"] as ViewMode[]).map((v) => (
              <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 capitalize transition ${view === v ? "bg-indigo-500/30 text-white" : "text-white/60 hover:bg-white/5"}`}>{v}</button>
            ))}
          </div>
          <button onClick={() => setShowFocus((p) => !p)} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs border transition ${showFocus ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-200" : "border-white/15 text-white/60 hover:bg-white/5"}`} aria-label="Toggle focus time">
            <Shield className="w-3.5 h-3.5" /> Focus
          </button>
          <button className="p-2 rounded-md hover:bg-white/10 transition" aria-label="Notifications"><Bell className="w-4 h-4 text-white/70" /></button>
          <button className="p-2 rounded-md hover:bg-white/10 transition" aria-label="Settings"><Settings className="w-4 h-4 text-white/70" /></button>
          <button onClick={() => setShowNewModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium shadow-lg shadow-indigo-500/30 transition">
            <Plus className="w-4 h-4" /> New Event
          </button>
        </div>
      </header>

      <div className="px-6 pt-4">
        <AiSchedulingBar query={aiSchedulingQuery} onChange={setAiSchedulingQuery} parsed={aiParse} onBook={bookAiSlot} />
      </div>

      <div className="flex flex-1 min-h-0">
        <aside className="w-72 shrink-0 border-r border-white/10 p-5 space-y-6 hidden lg:flex lg:flex-col overflow-y-auto">
          <MiniCalendar year={year} month={month} selectedDay={selectedDay} onSelect={(y, m, d) => { setYear(y); setMonth(m); setSelectedDay(d); }} onNav={navigate} eventsByDay={eventsByDay} />
          <AnalyticsPanel events={visibleEvents} />
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">My Calendars</h3>
            <ul className="space-y-1.5">
              {(Object.keys(CATEGORIES) as Category[]).map((c) => {
                const cat = CATEGORIES[c]; const on = enabledCats[c];
                return (
                  <li key={c}>
                    <button onClick={() => setEnabledCats((prev) => ({ ...prev, [c]: !prev[c] }))} className="flex items-center gap-3 w-full px-2 py-1.5 rounded-md hover:bg-white/5 transition text-sm">
                      <span className={`w-4 h-4 rounded-sm flex items-center justify-center ${on ? cat.dot : "bg-white/10"}`}>
                        {on && (<svg viewBox="0 0 12 12" className="w-3 h-3 text-white"><path d="M2 6l3 3 5-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>)}
                      </span>
                      <span className={on ? "text-white" : "text-white/40"}>{cat.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">Upcoming</h3>
            <ul className="space-y-2">
              {visibleEvents.filter((e) => {
                const [ey, em, ed] = e.date.split("-").map(Number);
                return new Date(ey, em - 1, ed) >= new Date(TODAY.year, TODAY.month, TODAY.day);
              }).slice(0, 4).map((e) => {
                const parts = e.date.split("-");
                return (
                  <li key={e.id} onClick={() => setSelectedEvent(e)} className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${CATEGORIES[e.category].dot}`} />
                      <span className="text-sm truncate">{e.title}</span>
                    </div>
                    <div className="text-xs text-white/50 ml-4 mt-0.5">{parts[2]} {MONTHS[parseInt(parts[1]) - 1].slice(0, 3)} · {formatHour(e.startHour)}</div>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        <main className="flex-1 overflow-auto p-6">
          {view === "month" && (<MonthView cells={monthCells} year={year} month={month} eventsByDay={eventsByDay} onEventClick={setSelectedEvent} onDayClick={(d) => setSelectedDay(d)} isToday={isToday} conflictsById={conflictsById} />)}
          {view === "week" && (<WeekView days={weekDays} eventsByDay={eventsByDay} onEventClick={setSelectedEvent} isToday={isToday} conflictsById={conflictsById} showFocus={showFocus} />)}
          {view === "day" && (<DayView date={new Date(year, month, selectedDay)} eventsByDay={eventsByDay} onEventClick={setSelectedEvent} isToday={isToday} conflictsById={conflictsById} showFocus={showFocus} />)}
        </main>

        {selectedEvent && (
          <aside className="w-80 shrink-0 border-l border-white/10 p-5 hidden xl:flex xl:flex-col overflow-y-auto bg-white/[0.02]">
            <MeetingIntelligence event={selectedEvent} conflict={conflictsById.get(selectedEvent.id)} />
          </aside>
        )}
      </div>

      {selectedEvent && (
        <EventPopover event={selectedEvent} conflict={conflictsById.get(selectedEvent.id)} onClose={() => setSelectedEvent(null)} onDelete={(id) => { setEvents((prev) => prev.filter((e) => e.id !== id)); setSelectedEvent(null); }} />
      )}

      {showNewModal && (
        <NewEventModal defaultDate={dateKey(year, month, selectedDay)} onClose={() => setShowNewModal(false)} onCreate={(e) => { setEvents((prev) => [...prev, e]); setShowNewModal(false); }} />
      )}
    </div>
  );
}

interface AiSchedulingBarProps {
  query: string;
  onChange: (v: string) => void;
  parsed: AiParse | null;
  onBook: (slot: AiSlot) => void;
}

function AiSchedulingBar({ query, onChange, parsed, onBook }: AiSchedulingBarProps) {
  return (
    <div className="rounded-xl border border-indigo-400/20 bg-gradient-to-r from-indigo-500/[0.08] via-purple-500/[0.05] to-transparent p-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 ring-1 ring-indigo-400/40 flex items-center justify-center shrink-0">
          <BrainCircuit className="w-4 h-4 text-indigo-300" />
        </div>
        <input value={query} onChange={(e) => onChange(e.target.value)} placeholder='Try: "Schedule a 30min demo with sarah@acme.com next week"' className="flex-1 bg-transparent outline-none text-sm placeholder:text-white/40" />
        <span className="text-[10px] uppercase tracking-wider text-indigo-300/70 font-semibold hidden md:inline">AI Scheduler</span>
      </div>
      {parsed && (
        <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10"><span className="text-white/50">Contact:</span> <span className="text-white">{parsed.contact} ({parsed.org})</span></span>
            <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10"><span className="text-white/50">Duration:</span> <span className="text-white">{parsed.duration}min</span></span>
            <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10"><span className="text-white/50">Type:</span> <span className="text-white">{parsed.type}</span></span>
          </div>
          <div className="flex flex-wrap gap-2 justify-start md:justify-end">
            {parsed.slots.map((s) => (
              <button key={s.id} onClick={() => onBook(s)} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/40 text-xs text-indigo-100 transition">
                <Zap className="w-3 h-3" /> {s.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface AnalyticsPanelProps { events: CalendarEvent[]; }

function AnalyticsPanel({ events }: AnalyticsPanelProps) {
  const stats = useMemo(() => {
    const weekStart = new Date(2026, 3, 19);
    const weekEnd = new Date(2026, 3, 26);
    let meetingHrs = 0;
    const dayLoad = new Map<number, number>();
    for (const e of events) {
      const [y, m, d] = e.date.split("-").map(Number);
      const dt = new Date(y, m - 1, d);
      if (dt >= weekStart && dt < weekEnd && (e.category === "meeting" || e.category === "omnios")) {
        const h = e.endHour - e.startHour;
        meetingHrs += h;
        dayLoad.set(dt.getDay(), (dayLoad.get(dt.getDay()) ?? 0) + h);
      }
    }
    let busiest = 0; let max = 0;
    for (const [d, h] of dayLoad) if (h > max) { max = h; busiest = d; }
    const focusHrs = FOCUS_BLOCKS.reduce((s, b) => s + (b.endHour - b.startHour), 0);
    const pct = Math.min(100, Math.round((meetingHrs / 33.5) * 100));
    return { meetingHrs: Math.round(meetingHrs * 10) / 10, focusHrs, busiest: WEEKDAYS[busiest] || "—", pct, heavy: meetingHrs > 12 };
  }, [events]);

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 space-y-2.5">
      <div className="flex items-center gap-2">
        <BarChart2 className="w-3.5 h-3.5 text-indigo-300" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60">This Week</h3>
      </div>
      <div className="space-y-1.5 text-xs">
        <div className="flex items-baseline justify-between"><span className="text-white/60">In meetings</span><span className="text-white font-medium">{stats.meetingHrs}h <span className="text-white/40">({stats.pct}%)</span></span></div>
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden"><div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${stats.pct}%` }} /></div>
        <div className="flex items-baseline justify-between"><span className="text-white/60">Focus time</span><span className="text-emerald-300 font-medium">{stats.focusHrs}h</span></div>
        <div className="flex items-baseline justify-between"><span className="text-white/60">Busiest day</span><span className="text-white">{stats.busiest}</span></div>
      </div>
      {stats.heavy && (
        <div className="flex items-center gap-1.5 text-[11px] text-amber-300 pt-1 border-t border-white/10">
          <AlertTriangle className="w-3 h-3" /> Meeting load: above average
        </div>
      )}
      <div className="flex items-center gap-1.5 text-[11px] text-emerald-300/80">
        <Shield className="w-3 h-3" /> OmniOS protected {stats.focusHrs}h of focus time
      </div>
    </div>
  );
}

interface MeetingIntelligenceProps { event: CalendarEvent; conflict?: string; }

function MeetingIntelligence({ event, conflict }: MeetingIntelligenceProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BrainCircuit className="w-4 h-4 text-purple-300" />
        <h3 className="text-sm font-semibold">Meeting Intelligence</h3>
      </div>
      <div className="text-xs text-white/50 truncate">{event.title}</div>
      {conflict && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 p-2.5 text-xs text-red-200 flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <div>Conflicts with <strong>{conflict}</strong>. Reschedule?</div>
        </div>
      )}
      <IntelCard icon={<Target className="w-3.5 h-3.5 text-indigo-300" />} label="Prep">Review Q1 numbers and last call notes before this meeting.</IntelCard>
      <IntelCard icon={<Zap className="w-3.5 h-3.5 text-amber-300" />} label="Context">TechCorp deal is at <strong>$47K</strong>. Last contact 3d ago — they asked about SSO and SLA terms.</IntelCard>
      <IntelCard icon={<BarChart2 className="w-3.5 h-3.5 text-emerald-300" />} label="Similar meetings">78% of demos that include pricing end in trial signup within 7 days.</IntelCard>
      <div>
        <div className="text-[10px] uppercase tracking-wider text-white/50 mb-1.5 flex items-center gap-1.5"><AlignLeft className="w-3 h-3" /> Suggested agenda</div>
        <ul className="space-y-1 text-xs text-white/80">
          {["Recap last conversation (5m)", "Live product walkthrough (15m)", "Pricing & next steps (10m)"].map((a) => (
            <li key={a} className="flex items-start gap-2 px-2 py-1.5 rounded bg-white/[0.03] border border-white/5">
              <span className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5" />{a}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function IntelCard({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.03] p-2.5">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/50 mb-1">{icon}{label}</div>
      <div className="text-xs text-white/85 leading-relaxed">{children}</div>
    </div>
  );
}

interface MiniCalendarProps {
  year: number; month: number; selectedDay: number;
  onSelect: (y: number, m: number, d: number) => void;
  onNav: (delta: number) => void;
  eventsByDay: Map<string, CalendarEvent[]>;
}

function MiniCalendar({ year, month, selectedDay, onSelect, onNav, eventsByDay }: MiniCalendarProps) {
  const leading = firstWeekday(year, month);
  const total = daysInMonth(year, month);
  const cells: (number | null)[] = [];
  for (let i = 0; i < leading; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">{MONTHS[month]} {year}</h3>
        <div className="flex gap-1">
          <button onClick={() => onNav(-1)} className="p-1 rounded hover:bg-white/10"><ChevronLeft className="w-3.5 h-3.5" /></button>
          <button onClick={() => onNav(1)} className="p-1 rounded hover:bg-white/10"><ChevronRight className="w-3.5 h-3.5" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-[10px] text-white/40 mb-1">
        {WEEKDAYS.map((d) => (<div key={d} className="text-center">{d[0]}</div>))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const isSel = d === selectedDay;
          const isT = year === TODAY.year && month === TODAY.month && d === TODAY.day;
          const hasEv = (eventsByDay.get(dateKey(year, month, d))?.length ?? 0) > 0;
          return (
            <button key={i} onClick={() => onSelect(year, month, d)} className={`relative aspect-square text-xs rounded-md flex items-center justify-center transition ${isSel ? "bg-indigo-500 text-white" : isT ? "ring-1 ring-indigo-400 text-white" : "text-white/70 hover:bg-white/10"}`}>
              {d}
              {hasEv && !isSel && (<span className="absolute bottom-1 w-1 h-1 rounded-full bg-indigo-400" />)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface MonthViewProps {
  cells: { day: number; inMonth: boolean; date?: string }[];
  year: number; month: number;
  eventsByDay: Map<string, CalendarEvent[]>;
  onEventClick: (e: CalendarEvent) => void;
  onDayClick: (d: number) => void;
  isToday: (y: number, m: number, d: number) => boolean;
  conflictsById: Map<string, string>;
}

function MonthView({ cells, year, month, eventsByDay, onEventClick, onDayClick, isToday, conflictsById }: MonthViewProps) {
  return (
    <div className="h-full flex flex-col rounded-xl border border-white/10 overflow-hidden bg-white/[0.02]">
      <div className="grid grid-cols-7 border-b border-white/10">
        {WEEKDAYS.map((d) => (<div key={d} className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-white/50 text-center">{d}</div>))}
      </div>
      <div className="grid grid-cols-7 grid-rows-6 flex-1 min-h-[600px]">
        {cells.map((c, i) => {
          const t = c.inMonth && isToday(year, month, c.day);
          const dayEvents = c.date ? eventsByDay.get(c.date) ?? [] : [];
          return (
            <div key={i} onClick={() => c.inMonth && onDayClick(c.day)} className={`border-b border-r border-white/5 p-2 flex flex-col gap-1 min-h-[110px] cursor-pointer transition ${c.inMonth ? "bg-transparent hover:bg-white/[0.03]" : "bg-black/20 text-white/25"}`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${t ? "bg-indigo-500 text-white" : c.inMonth ? "text-white/80" : "text-white/30"}`}>{c.day}</span>
                {dayEvents.length > 0 && (<span className="text-[10px] text-white/40">{dayEvents.length}</span>)}
              </div>
              <div className="flex flex-col gap-1 overflow-hidden">
                {dayEvents.slice(0, 3).map((e) => {
                  const cat = CATEGORIES[e.category];
                  const hasConflict = conflictsById.has(e.id);
                  return (
                    <button key={e.id} onClick={(ev) => { ev.stopPropagation(); onEventClick(e); }} title={hasConflict ? `Conflicts with: ${conflictsById.get(e.id)}` : undefined} className={`group text-left text-[11px] px-1.5 py-0.5 rounded truncate ${cat.pill} hover:brightness-125 transition flex items-center gap-1`}>
                      {hasConflict && <AlertTriangle className="w-2.5 h-2.5 text-red-300 shrink-0" />}
                      <span className="opacity-70 mr-0.5">{formatHour(e.startHour).replace(":00", "")}</span>
                      <span className="truncate">{e.title}</span>
                    </button>
                  );
                })}
                {dayEvents.length > 3 && (<span className="text-[11px] text-white/50 px-1.5">+{dayEvents.length - 3} more</span>)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const HOURS: number[] = Array.from({ length: 13 }, (_, i) => 8 + i);
const HOUR_PX = 56;

interface WeekViewProps {
  days: Date[];
  eventsByDay: Map<string, CalendarEvent[]>;
  onEventClick: (e: CalendarEvent) => void;
  isToday: (y: number, m: number, d: number) => boolean;
  conflictsById: Map<string, string>;
  showFocus: boolean;
}

function WeekView({ days, eventsByDay, onEventClick, isToday, conflictsById, showFocus }: WeekViewProps) {
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-white/[0.02]">
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-white/10">
        <div />
        {days.map((d, i) => {
          const t = isToday(d.getFullYear(), d.getMonth(), d.getDate());
          return (
            <div key={i} className="px-3 py-3 text-center border-l border-white/5">
              <div className="text-xs uppercase tracking-wider text-white/50">{WEEKDAYS[d.getDay()]}</div>
              <div className={`mt-1 inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${t ? "bg-indigo-500 text-white" : "text-white/80"}`}>{d.getDate()}</div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-[60px_repeat(7,1fr)]">
        <div className="border-r border-white/5">
          {HOURS.map((h) => (<div key={h} style={{ height: HOUR_PX }} className="px-2 text-[10px] text-white/40 text-right pt-1">{formatHour(h)}</div>))}
        </div>
        {days.map((d, i) => {
          const key = dateKey(d.getFullYear(), d.getMonth(), d.getDate());
          const evs = eventsByDay.get(key) ?? [];
          const focus = showFocus ? FOCUS_BLOCKS.filter((b) => b.date === key) : [];
          return (
            <div key={i} className="relative border-l border-white/5">
              {HOURS.map((h) => (<div key={h} style={{ height: HOUR_PX }} className="border-b border-white/5" />))}
              {focus.map((b, idx) => {
                const top = (Math.max(8, b.startHour) - 8) * HOUR_PX;
                const height = (Math.min(21, b.endHour) - Math.max(8, b.startHour)) * HOUR_PX - 2;
                return (
                  <div key={idx} style={{ top, height }} className="absolute left-0 right-0 bg-emerald-500/10 border-l-2 border-emerald-400/60 pointer-events-none">
                    <div className="text-[9px] uppercase tracking-wider text-emerald-300/80 px-1.5 pt-0.5 flex items-center gap-1"><Shield className="w-2.5 h-2.5" />Focus</div>
                  </div>
                );
              })}
              {evs.filter((e) => e.endHour > 8 && e.startHour < 21).map((e) => {
                const top = (Math.max(8, e.startHour) - 8) * HOUR_PX;
                const height = Math.max(20, (Math.min(21, e.endHour) - Math.max(8, e.startHour)) * HOUR_PX - 2);
                const cat = CATEGORIES[e.category];
                const conflict = conflictsById.get(e.id);
                return (
                  <button key={e.id} onClick={() => onEventClick(e)} style={{ top, height }} title={conflict ? `Conflicts with: ${conflict}` : undefined} className={`absolute left-1 right-1 text-left text-[11px] px-2 py-1 rounded ${cat.pill} ${conflict ? "ring-1 ring-red-400/60" : ""} hover:brightness-125 transition overflow-hidden`}>
                    <div className="font-medium truncate flex items-center gap-1">{conflict && <AlertTriangle className="w-2.5 h-2.5 text-red-300" />}{e.title}</div>
                    <div className="opacity-70 truncate">{formatHour(e.startHour)} – {formatHour(e.endHour)}</div>
                    {conflict && <div className="text-[10px] text-red-300 truncate">⚠ {conflict}</div>}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface DayViewProps {
  date: Date;
  eventsByDay: Map<string, CalendarEvent[]>;
  onEventClick: (e: CalendarEvent) => void;
  isToday: (y: number, m: number, d: number) => boolean;
  conflictsById: Map<string, string>;
  showFocus: boolean;
}

function DayView({ date, eventsByDay, onEventClick, isToday, conflictsById, showFocus }: DayViewProps) {
  const key = dateKey(date.getFullYear(), date.getMonth(), date.getDate());
  const evs = eventsByDay.get(key) ?? [];
  const focus = showFocus ? FOCUS_BLOCKS.filter((b) => b.date === key) : [];
  const DAY_HOUR_PX = 64;
  const t = isToday(date.getFullYear(), date.getMonth(), date.getDate());
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-white/[0.02]">
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-white/50">{WEEKDAYS[date.getDay()]}</div>
          <div className="flex items-center gap-3 mt-1">
            <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-lg font-semibold ${t ? "bg-indigo-500 text-white" : "bg-white/10"}`}>{date.getDate()}</span>
            <span className="text-xl font-semibold">{MONTHS[date.getMonth()]} {date.getFullYear()}</span>
          </div>
        </div>
        <div className="text-sm text-white/60">{evs.length} events scheduled</div>
      </div>
      <div className="grid grid-cols-[80px_1fr]">
        <div className="border-r border-white/5">
          {HOURS.map((h) => (<div key={h} style={{ height: DAY_HOUR_PX }} className="px-3 text-xs text-white/40 text-right pt-1">{formatHour(h)}</div>))}
        </div>
        <div className="relative">
          {HOURS.map((h) => (<div key={h} style={{ height: DAY_HOUR_PX }} className="border-b border-white/5" />))}
          {focus.map((b, idx) => {
            const top = (Math.max(8, b.startHour) - 8) * DAY_HOUR_PX;
            const height = (Math.min(21, b.endHour) - Math.max(8, b.startHour)) * DAY_HOUR_PX - 2;
            return (
              <div key={idx} style={{ top, height }} className="absolute left-0 right-0 bg-emerald-500/10 border-l-2 border-emerald-400/60 pointer-events-none">
                <div className="text-[10px] uppercase tracking-wider text-emerald-300/80 px-2 pt-1 flex items-center gap-1"><Shield className="w-3 h-3" />Focus time</div>
              </div>
            );
          })}
          {evs.filter((e) => e.endHour > 8 && e.startHour < 21).map((e) => {
            const top = (Math.max(8, e.startHour) - 8) * DAY_HOUR_PX;
            const height = Math.max(24, (Math.min(21, e.endHour) - Math.max(8, e.startHour)) * DAY_HOUR_PX - 2);
            const cat = CATEGORIES[e.category];
            const conflict = conflictsById.get(e.id);
            return (
              <button key={e.id} onClick={() => onEventClick(e)} style={{ top, height }} className={`absolute left-3 right-3 text-left px-3 py-2 rounded-md ${cat.pill} ${conflict ? "ring-1 ring-red-400/60" : ""} hover:brightness-125 transition`}>
                <div className="font-semibold text-sm flex items-center gap-1.5">{conflict && <AlertTriangle className="w-3 h-3 text-red-300" />}{e.title}</div>
                <div className="text-xs opacity-80">{formatHour(e.startHour)} – {formatHour(e.endHour)}{e.location ? ` · ${e.location}` : ""}</div>
                {conflict && <div className="text-[11px] text-red-300 mt-0.5">⚠ Conflicts with: {conflict}</div>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface EventPopoverProps {
  event: CalendarEvent;
  conflict?: string;
  onClose: () => void;
  onDelete: (id: string) => void;
}

function EventPopover({ event, conflict, onClose, onDelete }: EventPopoverProps) {
  const cat = CATEGORIES[event.category];
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-xl bg-[#12121A] border border-white/10 shadow-2xl overflow-hidden">
        <div className={`px-6 py-5 ${cat.bg} border-b border-white/10`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full ${cat.dot}`} />
                <span className="text-xs uppercase tracking-wider text-white/70">{cat.label}</span>
              </div>
              <h3 className="text-xl font-semibold">{event.title}</h3>
            </div>
            <button onClick={onClose} className="p-1 rounded hover:bg-white/10"><X className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="p-6 space-y-4 text-sm">
          {conflict && (
            <div className="flex items-start gap-2 p-2.5 rounded-md bg-red-500/15 border border-red-500/40 text-red-200 text-xs">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>Conflicts with: <strong>{conflict}</strong></div>
            </div>
          )}
          <div className="flex items-start gap-3"><Clock className="w-4 h-4 text-white/50 mt-0.5" /><div><div>{event.date}</div><div className="text-white/60">{formatHour(event.startHour)} – {formatHour(event.endHour)}</div></div></div>
          {event.location && (<div className="flex items-start gap-3"><MapPin className="w-4 h-4 text-white/50 mt-0.5" /><div>{event.location}</div></div>)}
          {event.attendees && event.attendees.length > 0 && (
            <div className="flex items-start gap-3"><Users className="w-4 h-4 text-white/50 mt-0.5" />
              <div className="flex flex-wrap gap-1.5">{event.attendees.map((a) => (<span key={a} className="px-2 py-0.5 rounded-full bg-white/10 text-xs">{a}</span>))}</div>
            </div>
          )}
          {event.recurring && event.recurring !== "none" && (<div className="flex items-start gap-3"><Repeat className="w-4 h-4 text-white/50 mt-0.5" /><div className="capitalize">{event.recurring}</div></div>)}
          {event.description && (<div className="flex items-start gap-3"><AlignLeft className="w-4 h-4 text-white/50 mt-0.5" /><div className="text-white/80 leading-relaxed">{event.description}</div></div>)}
        </div>
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-end gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/15 hover:bg-white/5 text-sm"><Edit3 className="w-3.5 h-3.5" /> Edit</button>
          <button onClick={() => onDelete(event.id)} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-500/20 border border-red-500/40 text-red-200 hover:bg-red-500/30 text-sm"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
        </div>
      </div>
    </div>
  );
}

interface NewEventModalProps {
  defaultDate: string;
  onClose: () => void;
  onCreate: (e: CalendarEvent) => void;
}

const INPUT_CLS = "w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-400/60 transition";

function NewEventModal({ defaultDate, onClose, onCreate }: NewEventModalProps) {
  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState<string>(defaultDate);
  const [start, setStart] = useState<string>("10:00");
  const [duration, setDuration] = useState<number>(60);
  const [category, setCategory] = useState<Category>("meeting");
  const [description, setDescription] = useState<string>("");
  const [attendees, setAttendees] = useState<string>("");
  const [recurring, setRecurring] = useState<"none" | "daily" | "weekly" | "monthly">("none");

  const submit = (): void => {
    if (!title.trim()) return;
    const [h, m] = start.split(":").map(Number);
    const startHour = h + m / 60;
    const endHour = startHour + duration / 60;
    const attendeeList = attendees ? attendees.split(",").map((a) => a.trim()).filter(Boolean) : undefined;
    onCreate({ id: `new-${Date.now()}`, title: title.trim(), date, startHour, endHour, category, description: description.trim() || undefined, attendees: attendeeList, recurring });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-xl bg-[#12121A] border border-white/10 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-lg font-semibold">New Event</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <input autoFocus placeholder="Add title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-transparent text-xl font-medium border-b border-white/15 focus:border-indigo-400 outline-none pb-2 placeholder:text-white/30" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={INPUT_CLS} /></Field>
            <Field label="Start time"><input type="time" value={start} onChange={(e) => setStart(e.target.value)} className={INPUT_CLS} /></Field>
            <Field label="Duration">
              <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className={INPUT_CLS}>
                <option value={15}>15 minutes</option><option value={30}>30 minutes</option><option value={60}>1 hour</option><option value={90}>1.5 hours</option><option value={120}>2 hours</option>
              </select>
            </Field>
            <Field label="Category">
              <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className={INPUT_CLS}>
                {(Object.keys(CATEGORIES) as Category[]).map((c) => (<option key={c} value={c}>{CATEGORIES[c].label}</option>))}
              </select>
            </Field>
          </div>
          <Field label="Attendees (comma-separated)"><input placeholder="Alex, Priya, Jordan" value={attendees} onChange={(e) => setAttendees(e.target.value)} className={INPUT_CLS} /></Field>
          <Field label="Description"><textarea rows={3} placeholder="Agenda, notes, links…" value={description} onChange={(e) => setDescription(e.target.value)} className={`${INPUT_CLS} resize-none`} /></Field>
          <Field label="Repeats">
            <div className="flex flex-wrap gap-2">
              {(["none", "daily", "weekly", "monthly"] as const).map((r) => (
                <button key={r} type="button" onClick={() => setRecurring(r)} className={`px-3 py-1.5 rounded-md text-sm border capitalize transition ${recurring === r ? "bg-indigo-500/30 border-indigo-400/60 text-white" : "border-white/15 text-white/60 hover:bg-white/5"}`}>
                  {r === "none" ? "Does not repeat" : r}
                </button>
              ))}
            </div>
          </Field>
        </div>
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-md border border-white/15 hover:bg-white/5 text-sm">Cancel</button>
          <button onClick={submit} disabled={!title.trim()} className="px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-400 text-sm font-medium shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed">Create event</button>
        </div>
      </div>
    </div>
  );
}

interface FieldProps { label: string; children: React.ReactNode; }

function Field({ label, children }: FieldProps) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-white/50 mb-1.5">{label}</span>
      {children}
    </label>
  );
}
