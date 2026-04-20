"use client";

import { useState, useMemo, useEffect } from "react";
import {
  KanbanSquare,
  Plus,
  MoreHorizontal,
  Clock,
  Flag,
  Zap,
  X,
  CheckCircle2,
  MessageSquare,
  Tag,
  User2,
  Calendar as CalendarIcon,
  BarChart2,
  GitBranch,
  Lock,
  AlertTriangle,
  FastForward,
  Layers,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────
type Priority = "low" | "medium" | "high";
type Column   = "todo" | "in_progress" | "review" | "done";
type Filter   = "all" | Priority;

interface Assignee {
  id: string; name: string; initials: string; color: string;
}

interface ActivityEvent {
  id: string; time: string; who: string; what: string;
}

interface Dependency {
  id: string; title: string; kind: "blocked_by" | "blocks";
}

interface Task {
  id: string; projectId: string; title: string; desc: string;
  priority: Priority; column: Column; assignee: Assignee;
  tags: string[]; due?: string; createdAt: string;
  activity: ActivityEvent[];
  points?: number;
  deps?: Dependency[];
}

interface Project { id: string; name: string; icon: string; color: string; }
interface NewTaskInput { column: Column; title: string; }

// ── Config ───────────────────────────────────────────────────────────────
const COLUMNS: Column[] = ["todo", "in_progress", "review", "done"];

const COLUMN_CONFIG: Record<Column, { label: string; color: string }> = {
  todo:        { label: "Todo",        color: "var(--blue)"   },
  in_progress: { label: "In Progress", color: "var(--yellow)" },
  review:      { label: "In Review",   color: "var(--purple)" },
  done:        { label: "Done",        color: "var(--green)"  },
};

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  high:   { label: "High",   color: "var(--red)"        },
  medium: { label: "Medium", color: "var(--yellow)"     },
  low:    { label: "Low",    color: "var(--text-muted)" },
};

const PROJECTS: Project[] = [
  { id: "omnios", name: "OmniOS Core",    icon: "🧠", color: "var(--accent)" },
  { id: "web",    name: "Marketing Site", icon: "🌐", color: "var(--blue)"   },
  { id: "mobile", name: "Mobile App",     icon: "📱", color: "var(--purple)" },
];

const ASSIGNEES: Record<string, Assignee> = {
  K: { id: "K", name: "Karti Vikram", initials: "K",  color: "var(--accent)" },
  A: { id: "A", name: "Aria Chen",    initials: "AC", color: "var(--green)"  },
  J: { id: "J", name: "Jordan Rivers", initials: "JR", color: "var(--orange)" },
  M: { id: "M", name: "Maya Patel",   initials: "MP", color: "var(--purple)" },
  S: { id: "S", name: "Sam Okonkwo",  initials: "SO", color: "var(--red)"    },
};

const TAG_COLORS: Record<string, string> = {
  design: "badge-blue", frontend: "badge-accent", backend: "badge-orange",
  ai: "badge-purple", infra: "badge-orange", auth: "badge-red",
  billing: "badge-green", marketing: "badge-yellow", docs: "badge-default",
  review: "badge-yellow", mobile: "badge-purple", ios: "badge-blue",
  android: "badge-green",
};

// Sprint velocity history (last 6 sprints)
const VELOCITY = [34, 41, 38, 52, 47, 61];
const SPRINT_DAY = 6;
const SPRINT_LENGTH = 14;
const SPRINT_TOTAL_PTS = 61;
const SPRINT_REMAINING = 23;
const TEAM_CAPACITY = 47;
const SPRINT_PLANNED = 52;

const INITIAL_TASKS: Task[] = [
  {
    id: "t1", projectId: "omnios",
    title: "OmniMind streaming endpoint (SSE)",
    desc: "Implement server-sent events for AI chat streaming with backpressure handling and reconnection on drop.",
    priority: "high", column: "todo", assignee: ASSIGNEES.K,
    tags: ["ai", "backend"], due: "Apr 24", createdAt: "Apr 12", points: 8,
    deps: [{ id: "234", title: "API integration", kind: "blocked_by" }],
    activity: [
      { id: "a1", time: "Apr 12, 10:14", who: "Karti", what: "created this task" },
      { id: "a2", time: "Apr 13, 09:02", who: "OmniMind", what: "linked Q2 Roadmap doc as context" },
    ],
  },
  {
    id: "t2", projectId: "omnios", title: "CRM contacts list view + filters",
    desc: "Build contacts index with server-driven filters, cursor pagination, and saved views.",
    priority: "high", column: "todo", assignee: ASSIGNEES.A,
    tags: ["frontend"], due: "Apr 27", createdAt: "Apr 13", points: 5,
    activity: [{ id: "a1", time: "Apr 13, 14:20", who: "Karti", what: "assigned to Aria" }],
  },
  {
    id: "t3", projectId: "omnios", title: "better-auth + HMAC QR flow",
    desc: "Passwordless auth with device QR handshake; signed via HMAC-SHA256 with 90s TTL.",
    priority: "high", column: "todo", assignee: ASSIGNEES.J,
    tags: ["auth", "backend"], due: "Apr 26", createdAt: "Apr 11", points: 8,
    activity: [{ id: "a1", time: "Apr 11, 08:30", who: "Jordan", what: "created this task" }],
  },
  {
    id: "t4", projectId: "omnios", title: "Kanban drag-and-drop persistence",
    desc: "Persist column moves via optimistic update + debounced PATCH to /tasks/:id.",
    priority: "medium", column: "in_progress", assignee: ASSIGNEES.K,
    tags: ["frontend"], due: "Apr 25", createdAt: "Apr 10", points: 3,
    deps: [{ id: "267", title: "Frontend deploy", kind: "blocks" }],
    activity: [
      { id: "a1", time: "Apr 10, 11:00", who: "Karti", what: "created this task" },
      { id: "a2", time: "Apr 14, 16:45", who: "Karti", what: "moved to In Progress" },
    ],
  },
  {
    id: "t5", projectId: "omnios", title: "Tiptap rich-text editor integration",
    desc: "Configure Tiptap with collaboration extension + Y.js provider.",
    priority: "medium", column: "in_progress", assignee: ASSIGNEES.M,
    tags: ["frontend"], due: "Apr 23", createdAt: "Apr 09", points: 5,
    activity: [{ id: "a1", time: "Apr 09, 13:22", who: "Maya", what: "created this task" }],
  },
  {
    id: "t6", projectId: "omnios", title: "Neon PostgreSQL + Drizzle schema",
    desc: "Set up Neon branch-per-PR and author Drizzle schema for docs, tasks, contacts.",
    priority: "high", column: "in_progress", assignee: ASSIGNEES.S,
    tags: ["backend", "infra"], due: "Apr 22", createdAt: "Apr 08", points: 8,
    activity: [{ id: "a1", time: "Apr 08, 09:45", who: "Sam", what: "created this task" }],
  },
  {
    id: "t7", projectId: "omnios", title: "Review PR #142 — Shell navigation",
    desc: "Code review on OmniShell left-rail keyboard shortcuts and focus trap.",
    priority: "medium", column: "review", assignee: ASSIGNEES.K,
    tags: ["review", "frontend"], due: "Apr 20", createdAt: "Apr 14", points: 2,
    activity: [{ id: "a1", time: "Apr 14, 18:10", who: "Aria", what: "requested review" }],
  },
  {
    id: "t8", projectId: "omnios", title: "Onboarding email sequence draft",
    desc: "Write 5-email welcome sequence with product tips.",
    priority: "low", column: "review", assignee: ASSIGNEES.J,
    tags: ["marketing"], due: "Apr 21", createdAt: "Apr 13", points: 3,
    activity: [{ id: "a1", time: "Apr 13, 10:00", who: "Jordan", what: "drafted v1" }],
  },
  {
    id: "t9", projectId: "omnios", title: "Design OmniShell navigation",
    desc: "Final Figma specs + tokenized exports.",
    priority: "high", column: "done", assignee: ASSIGNEES.M,
    tags: ["design"], due: "Apr 12", createdAt: "Apr 01", points: 5,
    activity: [
      { id: "a1", time: "Apr 01, 09:00", who: "Maya", what: "created this task" },
      { id: "a2", time: "Apr 12, 17:30", who: "Maya", what: "marked as Done" },
    ],
  },
  {
    id: "t10", projectId: "omnios", title: "Tiptap editor skeleton",
    desc: "Basic Tiptap mounted with placeholder + toolbar.",
    priority: "medium", column: "done", assignee: ASSIGNEES.M,
    tags: ["frontend"], due: "Apr 13", createdAt: "Apr 05", points: 3,
    activity: [{ id: "a1", time: "Apr 13, 15:00", who: "Maya", what: "marked as Done" }],
  },
  {
    id: "t11", projectId: "omnios", title: "Write API reference (v0)",
    desc: "Document core endpoints with request/response examples.",
    priority: "low", column: "done", assignee: ASSIGNEES.S,
    tags: ["docs"], due: "Apr 14", createdAt: "Apr 06", points: 2,
    activity: [{ id: "a1", time: "Apr 14, 12:30", who: "Sam", what: "marked as Done" }],
  },
  {
    id: "t12", projectId: "omnios", title: "Stripe billing integration",
    desc: "Subscription plans, webhooks, customer portal.",
    priority: "medium", column: "todo", assignee: ASSIGNEES.S,
    tags: ["billing", "backend"], due: "May 02", createdAt: "Apr 10", points: 8,
    activity: [{ id: "a1", time: "Apr 10, 10:00", who: "Sam", what: "created this task" }],
  },
  {
    id: "t13", projectId: "web", title: "Homepage hero redesign",
    desc: "New hero with product shot + 3D scroll.",
    priority: "high", column: "in_progress", assignee: ASSIGNEES.M,
    tags: ["design", "marketing"], due: "Apr 22", createdAt: "Apr 08", points: 5,
    activity: [{ id: "a1", time: "Apr 08, 10:00", who: "Maya", what: "created this task" }],
  },
  {
    id: "t14", projectId: "web", title: "Pricing page copy v2",
    desc: "Rewrite pricing page with plan comparison table.",
    priority: "medium", column: "todo", assignee: ASSIGNEES.J,
    tags: ["marketing"], due: "Apr 24", createdAt: "Apr 14", points: 3,
    activity: [{ id: "a1", time: "Apr 14, 09:00", who: "Jordan", what: "created this task" }],
  },
  {
    id: "t15", projectId: "mobile", title: "iOS build pipeline setup",
    desc: "Configure TestFlight + Fastlane for nightly builds.",
    priority: "high", column: "todo", assignee: ASSIGNEES.S,
    tags: ["mobile", "ios", "infra"], due: "Apr 28", createdAt: "Apr 12", points: 5,
    activity: [{ id: "a1", time: "Apr 12, 14:00", who: "Sam", what: "created this task" }],
  },
];

function priorityRank(p: Priority): number {
  return p === "high" ? 0 : p === "medium" ? 1 : 2;
}

// ── Page ─────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const [tasks, setTasks]           = useState<Task[]>(INITIAL_TASKS);
  const [activeProject, setProject] = useState<string>(PROJECTS[0].id);
  const [filter, setFilter]         = useState<Filter>("all");
  const [dragging, setDragging]     = useState<string | null>(null);
  const [dragOver, setDragOver]     = useState<Column | null>(null);
  const [newTask, setNewTask]       = useState<NewTaskInput | null>(null);
  const [addingToColumn, setAddingToColumn] = useState<Column | null>(null);
  const [quickTitle, setQuickTitle] = useState("");
  const [selectedTask, setSelected] = useState<string | null>(null);
  const [showVelocity, setShowVelocity] = useState(false);
  const [showPlanner, setShowPlanner] = useState(false);

  const [sprintLoading, setSprint]  = useState(false);
  const [toast, setToast]           = useState<string | null>(null);

  const scopedTasks = useMemo(
    () => tasks.filter(
      (t) => t.projectId === activeProject && (filter === "all" || t.priority === filter),
    ),
    [tasks, activeProject, filter],
  );

  function tasksInColumn(col: Column): Task[] {
    return scopedTasks
      .filter((t) => t.column === col)
      .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority));
  }

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    if (!selectedTask) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelected(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedTask]);

  function handleDragStart(taskId: string) { setDragging(taskId); }
  function handleDragOver(e: React.DragEvent, col: Column) {
    e.preventDefault();
    setDragOver(col);
  }
  function handleDrop(col: Column) {
    if (!dragging) return;
    setTasks((prev) => prev.map((t) => (t.id === dragging ? { ...t, column: col } : t)));
    setDragging(null);
    setDragOver(null);
  }
  function handleDragEnd() { setDragging(null); setDragOver(null); }

  function addTask(col: Column, title: string) {
    const trimmed = title.trim();
    if (!trimmed) return;
    const next: Task = {
      id: `t${Date.now()}`, projectId: activeProject, title: trimmed,
      desc: "", priority: "medium", column: col, assignee: ASSIGNEES.K,
      tags: [], points: 3,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      activity: [{
        id: `ac${Date.now()}`,
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        who: "You", what: "created this task",
      }],
    };
    setTasks((prev) => [...prev, next]);
    setNewTask(null);
    setAddingToColumn(null);
    setQuickTitle("");
  }

  function runGenerateSprint() {
    setSprint(true);
    window.setTimeout(() => {
      const base = Date.now();
      const titles = [
        "Wire up document versioning",
        "Write E2E tests for auth flow",
        "Refactor Shell keyboard shortcuts",
        "Ship OmniMind source citations",
        "Add CRM deal pipeline view",
        "Implement calendar heatmap",
        "Set up error tracking (Sentry)",
        "Draft enterprise billing spec",
      ];
      const generated: Task[] = titles.map((title, i) => ({
        id: `gen${base}-${i}`, projectId: activeProject, title,
        desc: "Auto-generated by OmniMind from your Q2 Roadmap and current sprint context.",
        priority: (i < 3 ? "high" : i < 6 ? "medium" : "low") as Priority,
        column: "todo" as Column,
        assignee: [ASSIGNEES.K, ASSIGNEES.A, ASSIGNEES.J, ASSIGNEES.M][i % 4],
        tags: ["ai"], due: undefined, createdAt: "just now", points: 5,
        activity: [{
          id: `ac${base}-${i}`, time: "just now", who: "OmniMind",
          what: "generated this task from your spec",
        }],
      }));
      setTasks((prev) => [...prev, ...generated]);
      setSprint(false);
      setToast("✓ 8 tasks added to Todo");
    }, 2000);
  }

  const totalInScope = scopedTasks.length;
  const doneInScope  = scopedTasks.filter((t) => t.column === "done").length;
  const pct          = totalInScope > 0 ? Math.round((doneInScope / totalInScope) * 100) : 0;
  const activeTask = selectedTask ? tasks.find((t) => t.id === selectedTask) : null;

  const sprintProgress = (SPRINT_DAY / SPRINT_LENGTH) * 100;
  const sprintBurnPct = ((SPRINT_TOTAL_PTS - SPRINT_REMAINING) / SPRINT_TOTAL_PTS) * 100;
  const sprintStatus: "on_track" | "at_risk" | "behind" =
    sprintBurnPct >= sprintProgress - 5 ? "on_track" : sprintBurnPct >= sprintProgress - 15 ? "at_risk" : "behind";
  const statusColor = sprintStatus === "on_track" ? "var(--green)" : sprintStatus === "at_risk" ? "var(--yellow)" : "var(--red)";
  const statusLabel = sprintStatus === "on_track" ? "On track" : sprintStatus === "at_risk" ? "At risk" : "Behind";

  return (
    <div className="omni-page">
      <div className="omni-page__header">
        <KanbanSquare size={18} style={{ color: "var(--text-muted)" }} />
        <div>
          <div className="omni-page__title">Projects</div>
          <div className="omni-page__subtitle">
            {doneInScope}/{totalInScope} tasks done · {pct}% complete
          </div>
        </div>

        <div className="omni-page__actions">
          <div style={{ display: "flex", background: "var(--panel-bg)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 2, gap: 2 }}>
            {(["all", "high", "medium", "low"] as Filter[]).map((f) => (
              <button
                key={f} type="button" onClick={() => setFilter(f)}
                style={{
                  padding: "4px 10px", border: "none", borderRadius: 6,
                  fontSize: 11, fontFamily: "inherit", cursor: "pointer", textTransform: "capitalize",
                  background: filter === f ? "var(--shell-active)" : "transparent",
                  color: filter === f ? (f === "all" ? "var(--text-primary)" : PRIORITY_CONFIG[f as Priority].color) : "var(--text-secondary)",
                  fontWeight: filter === f ? 600 : 500,
                  transition: "background var(--dur-fast), color var(--dur-fast)",
                }}
              >{f}</button>
            ))}
          </div>

          <button className="btn btn-ghost btn-sm" onClick={() => setShowVelocity((v) => !v)} title="Sprint velocity">
            <BarChart2 size={13} /> Velocity
          </button>

          <button className="btn btn-secondary" onClick={() => setShowPlanner(true)}>
            <Layers size={13} /> Plan Sprint
          </button>

          <button className="btn btn-secondary" onClick={() => setNewTask({ column: "todo", title: "" })}>
            <Plus size={13} /> New Task
          </button>

          <button className="btn btn-primary" onClick={runGenerateSprint} disabled={sprintLoading} style={{ gap: 6 }}>
            <Zap size={13} /> Generate Sprint
          </button>
        </div>
      </div>

      <SprintBurndownBar
        day={SPRINT_DAY} length={SPRINT_LENGTH} remaining={SPRINT_REMAINING}
        progressPct={sprintProgress} burnPct={sprintBurnPct}
        statusColor={statusColor} statusLabel={statusLabel}
      />

      {showVelocity && <VelocityPanel onClose={() => setShowVelocity(false)} />}

      <div style={{ display: "flex", gap: 2, padding: "0 20px", borderBottom: "1px solid var(--shell-border)", flexShrink: 0 }}>
        {PROJECTS.map((p) => {
          const isActive = activeProject === p.id;
          const count = tasks.filter((t) => t.projectId === p.id).length;
          return (
            <button
              key={p.id} type="button" onClick={() => setProject(p.id)}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
                border: "none", background: "transparent",
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                fontFamily: "inherit", fontSize: 12.5, fontWeight: isActive ? 600 : 500,
                cursor: "pointer", position: "relative",
                borderBottom: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                marginBottom: -1, transition: "color var(--dur-fast)",
              }}
            >
              <span style={{ fontSize: 14 }}>{p.icon}</span>
              {p.name}
              <span className="badge badge-default" style={{ fontSize: 10, minWidth: 18, textAlign: "center" }}>{count}</span>
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, overflow: "hidden", padding: "16px 20px 0" }}>
        <div className="kanban-board">
          {COLUMNS.map((col) => {
            const cfg = COLUMN_CONFIG[col];
            const items = tasksInColumn(col);
            const isOver = dragOver === col;

            return (
              <div
                key={col} className="kanban-column"
                style={{
                  outline: isOver ? `2px solid var(--accent)` : "none",
                  outlineOffset: -1,
                  background: isOver ? "var(--accent-subtle)" : undefined,
                  transition: "background var(--dur-fast)",
                }}
                onDragOver={(e) => handleDragOver(e, col)}
                onDrop={() => handleDrop(col)}
                onDragLeave={() => setDragOver(null)}
              >
                <div className="kanban-column__header">
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />
                  <span className="kanban-column__title">{cfg.label}</span>
                  <span className="kanban-column__count">{items.length}</span>
                  <button
                    className="btn btn-ghost btn-icon btn-sm"
                    style={{ marginLeft: "auto", width: 22, height: 22 }}
                    onClick={() => setNewTask({ column: col, title: "" })}
                    title={`Add task to ${cfg.label}`}
                  ><Plus size={12} /></button>
                </div>

                <div className="kanban-column__body">
                  {items.map((task) => (
                    <KanbanCard
                      key={task.id} task={task}
                      dragging={dragging === task.id}
                      onDragStart={() => handleDragStart(task.id)}
                      onDragEnd={handleDragEnd}
                      onOpen={() => setSelected(task.id)}
                    />
                  ))}

                  {newTask?.column === col && (
                    <InlineNewTask
                      value={newTask.title}
                      onChange={(v) => setNewTask({ column: col, title: v })}
                      onSubmit={() => addTask(col, newTask.title)}
                      onCancel={() => setNewTask(null)}
                    />
                  )}

                  {items.length === 0 && newTask?.column !== col && addingToColumn !== col && (
                    <div style={{
                      padding: "18px 12px", textAlign: "center", fontSize: 11.5,
                      color: "var(--text-muted)", border: "1px dashed var(--shell-border)", borderRadius: 9,
                    }}>No tasks</div>
                  )}
                </div>

                <div className="kanban-column__add">
                  {addingToColumn === col ? (
                    <div style={{ display: "flex", gap: 4 }}>
                      <input
                        className="input"
                        style={{ flex: 1, fontSize: 12, padding: "6px 8px" }}
                        placeholder="Quick task title…"
                        value={quickTitle}
                        onChange={(e) => setQuickTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") addTask(col, quickTitle);
                          if (e.key === "Escape") { setAddingToColumn(null); setQuickTitle(""); }
                        }}
                        autoFocus
                      />
                      <button
                        className="btn btn-ghost btn-icon btn-sm"
                        onClick={() => { setAddingToColumn(null); setQuickTitle(""); }}
                        aria-label="Cancel quick add"
                      ><X size={11} /></button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ width: "100%", justifyContent: "flex-start", color: "var(--text-muted)" }}
                      onClick={() => { setAddingToColumn(col); setQuickTitle(""); }}
                    >
                      <Plus size={12} /> Add task
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {sprintLoading && <SprintModal />}
      {showPlanner && <PlannerPanel onClose={() => setShowPlanner(false)} />}

      {toast && (
        <div role="status" style={{
          position: "fixed", bottom: 24, right: 24, padding: "12px 16px",
          background: "var(--shell-surface)", border: "1px solid var(--green)", borderRadius: 10,
          boxShadow: "var(--shadow-lg)", display: "flex", alignItems: "center", gap: 10,
          fontSize: 13, color: "var(--text-primary)", zIndex: 100,
          animation: "omni-slide-in 0.25s var(--ease-out)",
        }}>
          <CheckCircle2 size={14} style={{ color: "var(--green)" }} />
          {toast}
          <button onClick={() => setToast(null)} className="btn btn-ghost btn-icon btn-sm" style={{ width: 22, height: 22 }} aria-label="Dismiss">
            <X size={11} />
          </button>
        </div>
      )}

      {activeTask && <TaskDetail task={activeTask} onClose={() => setSelected(null)} />}

      <style jsx>{`
        @keyframes omni-slide-in {
          from { transform: translateY(10px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ── Sprint burndown bar ──────────────────────────────────────────────────
function SprintBurndownBar({
  day, length, remaining, progressPct, burnPct, statusColor, statusLabel,
}: {
  day: number; length: number; remaining: number;
  progressPct: number; burnPct: number; statusColor: string; statusLabel: string;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 16, padding: "10px 20px",
      borderBottom: "1px solid var(--shell-border)", background: "var(--panel-bg)",
      fontSize: 11.5, color: "var(--text-secondary)", flexShrink: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <FastForward size={12} style={{ color: "var(--accent)" }} />
        <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>Current Sprint</strong>
      </div>
      <div>Day <strong style={{ color: "var(--text-primary)" }}>{day}</strong> of {length}</div>
      <div style={{ flex: 1, maxWidth: 280, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, height: 5, background: "var(--shell-border)", borderRadius: 99, overflow: "hidden", position: "relative" }}>
          <div style={{ width: `${burnPct}%`, height: "100%", background: statusColor, transition: "width 0.5s var(--ease-out)" }} />
          <div style={{
            position: "absolute", top: -2, left: `${progressPct}%`, width: 2, height: 9,
            background: "var(--text-primary)", opacity: 0.4,
          }} />
        </div>
      </div>
      <div>Remaining: <strong style={{ color: "var(--text-primary)" }}>{remaining} pts</strong></div>
      <div className="badge" style={{
        background: `oklch(from ${statusColor} l c h / 0.15)`,
        color: statusColor, fontSize: 10, fontWeight: 600,
        display: "flex", alignItems: "center", gap: 4,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusColor }} />
        {statusLabel}
      </div>
    </div>
  );
}

// ── Velocity panel ───────────────────────────────────────────────────────
function VelocityPanel({ onClose }: { onClose: () => void }) {
  const max = Math.max(...VELOCITY);
  const first = VELOCITY[0];
  const last = VELOCITY[VELOCITY.length - 1];
  const improvement = Math.round(((last - first) / first) * 100);

  return (
    <div style={{
      padding: "14px 20px", borderBottom: "1px solid var(--shell-border)",
      background: "var(--shell-surface)", flexShrink: 0,
      animation: "omni-slide-in 0.2s var(--ease-out)",
    }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
        <BarChart2 size={13} style={{ color: "var(--accent)", marginRight: 6 }} />
        <strong style={{ fontSize: 12, color: "var(--text-primary)" }}>Sprint Velocity</strong>
        <span style={{ marginLeft: 10, fontSize: 11, color: "var(--green)", fontWeight: 600 }}>
          +{improvement}% improvement over 6 sprints
        </span>
        <button onClick={onClose} className="btn btn-ghost btn-icon btn-sm" style={{ marginLeft: "auto", width: 22, height: 22 }} aria-label="Close velocity">
          <X size={11} />
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 84, paddingLeft: 4 }}>
        {VELOCITY.map((pts, i) => {
          const h = (pts / max) * 100;
          const isCurrent = i === VELOCITY.length - 1;
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: isCurrent ? "var(--accent)" : "var(--text-muted)" }}>{pts}</div>
              <div style={{
                width: "100%", maxWidth: 42, height: `${h}%`, minHeight: 4,
                background: isCurrent
                  ? "linear-gradient(180deg, var(--accent), oklch(from var(--accent) calc(l - 0.1) c h))"
                  : "linear-gradient(180deg, var(--shell-border), var(--panel-border))",
                borderRadius: "4px 4px 0 0",
                boxShadow: isCurrent ? "0 0 0 1px var(--accent-border)" : "none",
                transition: "all 0.3s var(--ease-out)",
              }} />
              <div style={{ fontSize: 9.5, color: "var(--text-muted)" }}>S{i + 1}{isCurrent ? " ●" : ""}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── AI Sprint Planner panel ──────────────────────────────────────────────
function PlannerPanel({ onClose }: { onClose: () => void }) {
  const overCapacity = SPRINT_PLANNED > TEAM_CAPACITY;
  const suggestedStories = [
    { id: "s1", title: "OmniMind streaming endpoint (SSE)", pts: 8, prio: "high" as Priority },
    { id: "s2", title: "better-auth + HMAC QR flow", pts: 8, prio: "high" as Priority },
    { id: "s3", title: "CRM contacts list view + filters", pts: 5, prio: "high" as Priority },
    { id: "s4", title: "Tiptap rich-text editor integration", pts: 5, prio: "medium" as Priority },
    { id: "s5", title: "Stripe billing integration", pts: 8, prio: "medium" as Priority },
    { id: "s6", title: "Kanban drag-and-drop persistence", pts: 3, prio: "medium" as Priority },
    { id: "s7", title: "Onboarding email sequence", pts: 3, prio: "low" as Priority },
    { id: "s8", title: "iOS build pipeline setup", pts: 5, prio: "high" as Priority },
    { id: "s9", title: "Homepage hero redesign", pts: 5, prio: "high" as Priority },
    { id: "s10", title: "Pricing page copy v2", pts: 2, prio: "medium" as Priority },
  ];
  const risks = [
    "2 stories have unclear acceptance criteria",
    "Sprint is over capacity by 5 pts",
    "1 story blocked by external dependency (#234)",
  ];

  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, background: "oklch(0% 0 0 / 0.4)",
        zIndex: 150, animation: "omni-fade-in 0.2s var(--ease-out)",
      }} />
      <aside role="dialog" aria-modal="true" aria-label="AI Sprint Planner" style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 480, maxWidth: "95vw",
        background: "var(--shell-surface)", borderLeft: "1px solid var(--panel-border)",
        boxShadow: "var(--shadow-lg)", zIndex: 160, display: "flex", flexDirection: "column",
        animation: "omni-slide-left 0.25s var(--ease-out)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: "1px solid var(--panel-border)" }}>
          <Layers size={14} style={{ color: "var(--accent)" }} />
          <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>AI Sprint Planner</strong>
          <span className="badge badge-purple" style={{ fontSize: 10 }}>OmniMind</span>
          <button className="btn btn-ghost btn-icon btn-sm" style={{ marginLeft: "auto" }} onClick={onClose} aria-label="Close planner">
            <X size={13} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
          <div style={{ marginBottom: 18 }}>
            <SectionLabel>Suggested Sprint Goal</SectionLabel>
            <div style={{
              padding: 12, background: "var(--accent-subtle)",
              border: "1px solid var(--accent-border)", borderRadius: 9,
              fontSize: 13, color: "var(--text-primary)", lineHeight: 1.55,
            }}>
              Ship the OmniMind streaming pipeline end-to-end — auth, SSE backend, and CRM surface — to unblock private beta launch by end of sprint.
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <SectionLabel>Team Capacity</SectionLabel>
            <div style={{
              padding: 12, background: "var(--panel-bg)",
              border: `1px solid ${overCapacity ? "var(--yellow)" : "var(--panel-border)"}`,
              borderRadius: 9, display: "flex", alignItems: "center", gap: 10, fontSize: 12.5,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                  {TEAM_CAPACITY} pts available, {SPRINT_PLANNED} pts planned {overCapacity && "⚠"}
                </div>
                <div style={{ height: 4, background: "var(--shell-border)", borderRadius: 99, marginTop: 6, overflow: "hidden" }}>
                  <div style={{
                    width: `${Math.min(100, (SPRINT_PLANNED / TEAM_CAPACITY) * 100)}%`,
                    height: "100%", background: overCapacity ? "var(--yellow)" : "var(--green)",
                  }} />
                </div>
              </div>
              {overCapacity && <AlertTriangle size={16} style={{ color: "var(--yellow)" }} />}
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <SectionLabel>Risk Flags</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {risks.map((r, i) => (
                <div key={i} style={{
                  padding: "8px 10px", background: "oklch(from var(--yellow) l c h / 0.08)",
                  border: "1px solid oklch(from var(--yellow) l c h / 0.3)",
                  borderRadius: 7, fontSize: 12, color: "var(--text-secondary)",
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <AlertTriangle size={12} style={{ color: "var(--yellow)", flexShrink: 0 }} />
                  {r}
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>Auto-Assigned Stories</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {suggestedStories.map((s) => (
                <div key={s.id} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
                  background: "var(--panel-bg)", border: "1px solid var(--panel-border)",
                  borderRadius: 7, fontSize: 12.5,
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: PRIORITY_CONFIG[s.prio].color, flexShrink: 0 }} />
                  <span style={{ flex: 1, color: "var(--text-primary)" }}>{s.title}</span>
                  <span style={{ fontFamily: "var(--mono-font)", fontSize: 11, color: "var(--text-muted)" }}>{s.pts}pt</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--panel-border)", padding: "12px 18px", display: "flex", gap: 8 }}>
          <button className="btn btn-primary btn-sm" onClick={onClose}>
            <CheckCircle2 size={12} /> Accept Plan
          </button>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Refine</button>
        </div>
      </aside>
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10.5, fontWeight: 600, color: "var(--text-muted)",
      letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6,
    }}>{children}</div>
  );
}

// ── Kanban card ──────────────────────────────────────────────────────────
function KanbanCard({
  task, dragging, onDragStart, onDragEnd, onOpen,
}: {
  task: Task; dragging: boolean;
  onDragStart: () => void; onDragEnd: () => void; onOpen: () => void;
}) {
  const prio = PRIORITY_CONFIG[task.priority];
  const blockedBy = task.deps?.find((d) => d.kind === "blocked_by");
  const blocks = task.deps?.find((d) => d.kind === "blocks");
  const isBlocked = !!blockedBy;

  return (
    <div
      className="kanban-card" draggable
      onDragStart={onDragStart} onDragEnd={onDragEnd} onClick={onOpen}
      role="button" tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(); }
      }}
      style={{ opacity: dragging ? 0.4 : 1, cursor: "grab" }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
        <span title={prio.label + " priority"} style={{
          width: 8, height: 8, borderRadius: "50%", background: prio.color,
          flexShrink: 0, marginTop: 5,
          boxShadow: `0 0 0 2px oklch(from ${prio.color} l c h / 0.15)`,
        }} />
        <span className="kanban-card__title" style={{ flex: 1, fontWeight: 600 }}>
          {task.column === "done" ? (
            <span style={{ color: "var(--text-muted)", textDecoration: "line-through" }}>{task.title}</span>
          ) : task.title}
        </span>
        {isBlocked && (
          <Lock size={11} style={{ color: "var(--red)", flexShrink: 0, marginTop: 4 }} aria-label="Blocked" />
        )}
        {task.points && (
          <span style={{
            fontFamily: "var(--mono-font)", fontSize: 10, fontWeight: 600,
            color: "var(--text-muted)", background: "var(--panel-bg)",
            padding: "1px 6px", borderRadius: 4, flexShrink: 0,
          }}>{task.points}</span>
        )}
      </div>

      {task.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
          {task.tags.slice(0, 3).map((tag) => (
            <span key={tag} className={`badge ${TAG_COLORS[tag] ?? "badge-default"}`}>{tag}</span>
          ))}
        </div>
      )}

      {(blockedBy || blocks) && (
        <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 8, fontSize: 10.5 }}>
          {blockedBy && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--red)" }}>
              <Lock size={9} />
              <span>Blocked by: {blockedBy.title} #{blockedBy.id}</span>
            </div>
          )}
          {blocks && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--text-muted)" }}>
              <GitBranch size={9} />
              <span>Blocks: {blocks.title} #{blocks.id}</span>
            </div>
          )}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "var(--text-muted)" }}>
        {task.due && (
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Clock size={10} />{task.due}
          </span>
        )}
        <div className="avatar avatar-sm" style={{
          marginLeft: "auto", width: 22, height: 22, fontSize: 10,
          background: task.assignee.color, color: "white", fontWeight: 600,
        }} title={task.assignee.name}>
          {task.assignee.initials}
        </div>
      </div>
    </div>
  );
}

// ── Inline new-task form ─────────────────────────────────────────────────
function InlineNewTask({
  value, onChange, onSubmit, onCancel,
}: {
  value: string; onChange: (v: string) => void;
  onSubmit: () => void; onCancel: () => void;
}) {
  return (
    <div style={{
      background: "var(--shell-surface)", border: "1px solid var(--accent-border)",
      borderRadius: 9, padding: 10,
    }}>
      <input
        className="input" style={{ marginBottom: 8 }} placeholder="Task title…"
        value={value} onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit();
          if (e.key === "Escape") onCancel();
        }}
        autoFocus
      />
      <div style={{ display: "flex", gap: 6 }}>
        <button className="btn btn-primary btn-sm" onClick={onSubmit}>Add</button>
        <button className="btn btn-ghost btn-sm" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

// ── Sprint loading modal ─────────────────────────────────────────────────
function SprintModal() {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "oklch(0% 0 0 / 0.55)",
      backdropFilter: "blur(6px)", display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 200,
    }} role="dialog" aria-modal="true" aria-label="OmniMind generating sprint">
      <div style={{
        background: "var(--shell-surface)", border: "1px solid var(--panel-border)",
        borderRadius: 14, padding: "28px 32px", minWidth: 340,
        textAlign: "center", boxShadow: "var(--shadow-lg)",
      }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🧠</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>
          OmniMind is analyzing your spec…
        </div>
        <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 20 }}>
          Reading Q2 Roadmap, mapping dependencies, drafting tasks.
        </div>
        <div style={{
          width: "100%", height: 4, background: "var(--shell-border)",
          borderRadius: 99, overflow: "hidden", position: "relative",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, height: "100%", width: "40%",
            background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
            animation: "omni-progress-slide 1.4s var(--ease-in-out) infinite",
          }} />
        </div>
      </div>
      <style jsx>{`
        @keyframes omni-progress-slide {
          0%   { left: -40%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
}

// ── Task detail slide-over ───────────────────────────────────────────────
function TaskDetail({ task, onClose }: { task: Task; onClose: () => void }) {
  const prio = PRIORITY_CONFIG[task.priority];
  const col = COLUMN_CONFIG[task.column];

  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, background: "oklch(0% 0 0 / 0.4)",
        zIndex: 150, animation: "omni-fade-in 0.2s var(--ease-out)",
      }} />
      <aside role="dialog" aria-modal="true" aria-label={`Task: ${task.title}`} style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 460, maxWidth: "92vw",
        background: "var(--shell-surface)", borderLeft: "1px solid var(--panel-border)",
        boxShadow: "var(--shadow-lg)", zIndex: 160, display: "flex", flexDirection: "column",
        animation: "omni-slide-left 0.25s var(--ease-out)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: "1px solid var(--panel-border)" }}>
          <span className="badge" style={{
            background: `oklch(from ${col.color} l c h / 0.15)`,
            color: col.color, fontSize: 10,
          }}>{col.label}</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--mono-font)" }}>#{task.id}</span>
          {task.points && (
            <span className="badge badge-default" style={{ fontSize: 10 }}>{task.points} pts</span>
          )}
          <button className="btn btn-ghost btn-icon btn-sm" style={{ marginLeft: "auto" }} onClick={onClose} aria-label="Close">
            <X size={13} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>
          <h2 style={{
            fontSize: 18, fontWeight: 700, color: "var(--text-primary)",
            marginBottom: 10, lineHeight: 1.35, letterSpacing: "-0.01em",
          }}>{task.title}</h2>

          {task.desc && (
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: 20 }}>
              {task.desc}
            </p>
          )}

          {task.deps && task.deps.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
                <GitBranch size={11} /> Dependencies
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {task.deps.map((d) => (
                  <div key={d.id + d.kind} style={{
                    padding: "7px 10px", borderRadius: 7,
                    background: d.kind === "blocked_by" ? "oklch(from var(--red) l c h / 0.08)" : "var(--panel-bg)",
                    border: `1px solid ${d.kind === "blocked_by" ? "oklch(from var(--red) l c h / 0.3)" : "var(--panel-border)"}`,
                    display: "flex", alignItems: "center", gap: 7, fontSize: 12,
                    color: d.kind === "blocked_by" ? "var(--red)" : "var(--text-secondary)",
                  }}>
                    {d.kind === "blocked_by" ? <Lock size={11} /> : <GitBranch size={11} />}
                    <span style={{ fontWeight: 600 }}>{d.kind === "blocked_by" ? "Blocked by:" : "Blocks:"}</span>
                    <span>{d.title} #{d.id}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "90px 1fr", gap: "10px 14px", fontSize: 12.5, marginBottom: 22 }}>
            <div style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5 }}>
              <User2 size={11} /> Assignee
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div className="avatar avatar-sm" style={{
                width: 22, height: 22, fontSize: 10,
                background: task.assignee.color, color: "white", fontWeight: 600,
              }}>{task.assignee.initials}</div>
              <span>{task.assignee.name}</span>
            </div>

            <div style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5 }}>
              <CalendarIcon size={11} /> Due
            </div>
            <div>{task.due ?? <span style={{ color: "var(--text-muted)" }}>No due date</span>}</div>

            <div style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5 }}>
              <Flag size={11} /> Priority
            </div>
            <div style={{ color: prio.color, fontWeight: 600 }}>{prio.label}</div>

            <div style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5 }}>
              <Tag size={11} /> Labels
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {task.tags.length === 0
                ? <span style={{ color: "var(--text-muted)", fontSize: 12 }}>none</span>
                : task.tags.map((t) => (
                  <span key={t} className={`badge ${TAG_COLORS[t] ?? "badge-default"}`}>{t}</span>
                ))}
            </div>

            <div style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5 }}>
              <Clock size={11} /> Created
            </div>
            <div>{task.createdAt}</div>
          </div>

          <div style={{ marginTop: 4 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600,
              color: "var(--text-muted)", letterSpacing: "0.06em",
              textTransform: "uppercase", marginBottom: 10,
            }}>
              <MessageSquare size={11} /> Activity
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {task.activity.map((ev) => (
                <div key={ev.id} style={{ display: "flex", gap: 10, fontSize: 12.5, color: "var(--text-secondary)" }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: "50%", background: "var(--accent)",
                    marginTop: 6, flexShrink: 0,
                  }} />
                  <div style={{ flex: 1 }}>
                    <div>
                      <strong style={{ color: "var(--text-primary)" }}>{ev.who}</strong> {ev.what}
                    </div>
                    <div style={{ fontSize: 10.5, color: "var(--text-muted)", marginTop: 2 }}>{ev.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--panel-border)", padding: "12px 18px", display: "flex", gap: 8 }}>
          <button className="btn btn-primary btn-sm">
            <CheckCircle2 size={12} /> Mark Done
          </button>
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: "auto" }}>
            <MoreHorizontal size={13} />
          </button>
        </div>
      </aside>

      <style jsx>{`
        @keyframes omni-fade-in    { from { opacity: 0; } to { opacity: 1; } }
        @keyframes omni-slide-left {
          from { transform: translateX(100%); }
          to   { transform: translateX(0);    }
        }
      `}</style>
    </>
  );
}
