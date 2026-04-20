"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  LayoutGrid,
  List as ListIcon,
  Star,
  ChevronRight,
  ChevronDown,
  FileText,
  Home,
  Clock,
  GripVertical,
  MoreHorizontal,
  X,
  Sparkles,
  Target,
  Users,
  Rocket,
  BookOpen,
  ClipboardList,
  Briefcase,
  Calendar,
  Filter,
  SortAsc,
  Bot,
  BarChart2,
  Import,
  ExternalLink,
  Eye,
  ThumbsUp,
  Download,
  Link2,
  GitBranch,
  FileEdit,
} from "lucide-react";
import dynamic from "next/dynamic";

const KnowledgeGraph = dynamic(() => import("@/components/editor/KnowledgeGraph"), { ssr: false });
const BlockEditor = dynamic(() => import("@/components/editor/BlockEditor"), { ssr: false });

interface DocItem {
  id: string;
  title: string;
  icon: string;
  excerpt: string;
  author: string;
  lastEdited: string;
  starred: boolean;
  views: number;
  helpful: number;
  refWorkflows: number;
  refAutomations: number;
}

interface TreeNode {
  id: string;
  title: string;
  icon: string;
  docId?: string;
  children?: TreeNode[];
}

interface Template {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tint: string;
}

interface SearchResult {
  doc: DocItem;
  confidence: number;
  snippet: string;
}

const ACCENT = "#6366F1";
const BG = "#0A0A0F";
const SURFACE = "#12121A";
const SURFACE_2 = "#1A1A24";
const BORDER = "#22222E";
const TEXT = "#E5E5EC";
const TEXT_MUTED = "#8A8A99";
const TEXT_DIM = "#5E5E6E";
const AMBER = "#F59E0B";
const TOTAL_INDEXED = 2847;

const TREE: TreeNode[] = [
  {
    id: "ws-1",
    title: "OmniOS",
    icon: "\u{1F3E2}",
    children: [
      {
        id: "ws-1-1",
        title: "Product",
        icon: "\u{1F4E6}",
        children: [
          { id: "ws-1-1-1", title: "Q2 Roadmap", icon: "\u{1F5FA}", docId: "1" },
          { id: "ws-1-1-2", title: "OmniMind Spec", icon: "\u{1F9E0}", docId: "2" },
          { id: "ws-1-1-3", title: "OKRs", icon: "\u{1F3AF}", docId: "4" },
        ],
      },
      {
        id: "ws-1-2",
        title: "Engineering",
        icon: "\u{1F6E0}",
        children: [
          { id: "ws-1-2-1", title: "Architecture", icon: "\u{1F5C2}" },
          { id: "ws-1-2-2", title: "Runbooks", icon: "\u{1F4D8}" },
        ],
      },
      {
        id: "ws-1-3",
        title: "Sales",
        icon: "\u{1F4BC}",
        children: [{ id: "ws-1-3-1", title: "Playbook v3", icon: "\u{1F4D2}", docId: "3" }],
      },
      {
        id: "ws-1-4",
        title: "People",
        icon: "\u{1F465}",
        children: [
          { id: "ws-1-4-1", title: "Onboarding", icon: "\u{1F680}", docId: "5" },
          { id: "ws-1-4-2", title: "Policies", icon: "\u{1F512}", docId: "6" },
        ],
      },
    ],
  },
  {
    id: "ws-2",
    title: "Personal",
    icon: "\u{1F4DD}",
    children: [
      { id: "ws-2-1", title: "Notes", icon: "\u{1F4C4}" },
      { id: "ws-2-2", title: "Journal", icon: "\u{1F4D3}" },
    ],
  },
];

const RECENTS: Array<{ id: string; title: string; icon: string }> = [
  { id: "1", title: "Q2 Product Roadmap", icon: "\u{1F5FA}" },
  { id: "2", title: "OmniMind Context Engine", icon: "\u{1F9E0}" },
  { id: "4", title: "OKRs — April 2026", icon: "\u{1F3AF}" },
  { id: "3", title: "Sales Playbook v3", icon: "\u{1F4BC}" },
];

const DOCS: DocItem[] = [
  { id: "1", title: "Q2 Product Roadmap", icon: "\u{1F5FA}", excerpt: "Goals for April through June 2026. Three strategic bets: OmniMind v2, mobile beta, enterprise tier…", author: "Kartikeya", lastEdited: "2m ago", starred: true, views: 1240, helpful: 94, refWorkflows: 3, refAutomations: 2 },
  { id: "2", title: "Engineering Spec: OmniMind Context Engine", icon: "\u{1F9E0}", excerpt: "Technical architecture for the cross-surface AI context layer. Embedding pipeline, vector search, retrieval…", author: "Priya", lastEdited: "1h ago", starred: true, views: 892, helpful: 91, refWorkflows: 5, refAutomations: 4 },
  { id: "4", title: "OKRs — April 2026", icon: "\u{1F3AF}", excerpt: "Company objectives and key results for Q2. Focus areas: retention, ARR growth, team expansion.", author: "Kartikeya", lastEdited: "2d ago", starred: false, views: 2103, helpful: 97, refWorkflows: 2, refAutomations: 1 },
  { id: "3", title: "Sales Playbook v3", icon: "\u{1F4BC}", excerpt: "Updated discovery questions, objection handling, and demo flow for enterprise prospects.", author: "Marcus", lastEdited: "1d ago", starred: false, views: 567, helpful: 88, refWorkflows: 4, refAutomations: 6 },
  { id: "5", title: "Onboarding Guide v2", icon: "\u{1F680}", excerpt: "Step-by-step guide for new team members. Covers tooling setup, coding standards, deployment.", author: "Lena", lastEdited: "3d ago", starred: false, views: 1876, helpful: 96, refWorkflows: 7, refAutomations: 3 },
  { id: "6", title: "Privacy Policy — GDPR Update", icon: "\u{1F512}", excerpt: "Revised privacy policy reflecting new GDPR requirements, data retention rules, and DPA amendments.", author: "Daniel", lastEdited: "1w ago", starred: false, views: 412, helpful: 82, refWorkflows: 1, refAutomations: 2 },
];

const TEMPLATES: Template[] = [
  { id: "t1", title: "Meeting Notes", description: "Agenda, attendees, decisions, action items.", icon: <ClipboardList size={18} />, tint: "#6366F1" },
  { id: "t2", title: "Project Brief", description: "Problem, solution, scope, timeline, stakeholders.", icon: <Briefcase size={18} />, tint: "#8B5CF6" },
  { id: "t3", title: "OKRs", description: "Objectives and measurable key results.", icon: <Target size={18} />, tint: "#EC4899" },
  { id: "t4", title: "Sprint Plan", description: "Two-week sprint with goals, capacity, tasks.", icon: <Calendar size={18} />, tint: "#F59E0B" },
  { id: "t5", title: "Product Spec", description: "User stories, acceptance criteria, tech design.", icon: <BookOpen size={18} />, tint: "#10B981" },
  { id: "t6", title: "1:1 Agenda", description: "Recurring agenda with topics, blockers, growth.", icon: <Users size={18} />, tint: "#06B6D4" },
  { id: "t7", title: "Launch Plan", description: "Positioning, timeline, channels, risk log.", icon: <Rocket size={18} />, tint: "#EF4444" },
  { id: "t8", title: "Blank Page", description: "Start from scratch with a fresh canvas.", icon: <Sparkles size={18} />, tint: "#A78BFA" },
];

interface TreeRowProps {
  node: TreeNode;
  depth: number;
  expanded: Record<string, boolean>;
  onToggle: (id: string) => void;
}

function TreeRow({ node, depth, expanded, onToggle }: TreeRowProps) {
  const hasChildren = !!node.children && node.children.length > 0;
  const isOpen = expanded[node.id] ?? depth < 2;

  return (
    <div>
      <div
        style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 8px", paddingLeft: 8 + depth * 14, borderRadius: 6, cursor: "pointer", fontSize: 13, color: TEXT, transition: "background 120ms" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = SURFACE_2)}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        onClick={() => hasChildren && onToggle(node.id)}
        title="Drag to reorder"
      >
        <GripVertical size={10} style={{ color: TEXT_DIM }} />
        {hasChildren ? (
          isOpen ? <ChevronDown size={12} style={{ color: TEXT_MUTED }} /> : <ChevronRight size={12} style={{ color: TEXT_MUTED }} />
        ) : (
          <span style={{ width: 12 }} />
        )}
        <span style={{ fontSize: 13 }}>{node.icon}</span>
        {node.docId ? (
          <Link href={`/docs/${node.docId}`} style={{ color: TEXT, textDecoration: "none", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {node.title}
          </Link>
        ) : (
          <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{node.title}</span>
        )}
      </div>
      {hasChildren && isOpen && (
        <div>
          {node.children!.map((c) => (
            <TreeRow key={c.id} node={c} depth={depth + 1} expanded={expanded} onToggle={onToggle} />
          ))}
        </div>
      )}
    </div>
  );
}

function TemplatesModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Templates gallery"
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24 }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "min(920px, 100%)", maxHeight: "85vh", overflow: "auto", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: `1px solid ${BORDER}` }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: TEXT }}>Choose a template</h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: TEXT_MUTED }}>Start faster with a proven structure.</p>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background: "transparent", border: "none", color: TEXT_MUTED, cursor: "pointer", padding: 6, borderRadius: 6 }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: 24, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={onClose}
              style={{ textAlign: "left", padding: 16, borderRadius: 10, background: SURFACE_2, border: `1px solid ${BORDER}`, color: TEXT, cursor: "pointer", transition: "all 160ms", display: "flex", flexDirection: "column", gap: 10, fontFamily: "inherit" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = t.tint;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = BORDER;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${t.tint}22`, color: t.tint, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {t.icon}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{t.title}</div>
              <div style={{ fontSize: 12, color: TEXT_MUTED, lineHeight: 1.5 }}>{t.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function buildSearchResults(query: string, docs: DocItem[]): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return docs
    .map((doc) => {
      const inTitle = doc.title.toLowerCase().includes(q);
      const inExcerpt = doc.excerpt.toLowerCase().includes(q);
      const base = inTitle ? 0.78 : inExcerpt ? 0.55 : 0.18;
      const lengthBonus = Math.min(0.18, q.length * 0.015);
      const confidence = Math.min(0.99, base + lengthBonus + doc.helpful / 1000);
      const snippet = doc.excerpt.length > 120 ? doc.excerpt.slice(0, 117) + "…" : doc.excerpt;
      return { doc, confidence, snippet };
    })
    .filter((r) => r.confidence > 0.4)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 4);
}

function SearchPanel({ query, searching, results }: { query: string; searching: boolean; results: SearchResult[] }) {
  if (!query.trim()) return null;
  return (
    <div
      role="listbox"
      aria-label="AI search results"
      style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, boxShadow: "0 12px 40px rgba(0,0,0,0.55)", overflow: "hidden", zIndex: 50, maxHeight: 460, overflowY: "auto" }}
    >
      {searching ? (
        <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: TEXT_MUTED }}>
          <Sparkles size={14} style={{ color: ACCENT }} />
          <span>Searching {TOTAL_INDEXED.toLocaleString()} documents…</span>
        </div>
      ) : (
        <>
          {results.length > 0 && (
            <div style={{ padding: 12, borderBottom: `1px solid ${BORDER}`, background: `linear-gradient(135deg, ${AMBER}14, ${AMBER}06)` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: AMBER, marginBottom: 6 }}>
                <Sparkles size={11} /> AI Answer
              </div>
              <div style={{ fontSize: 13, color: TEXT, lineHeight: 1.55 }}>
                Based on {results.length} matching {results.length === 1 ? "document" : "documents"}, the most relevant guidance for <strong style={{ color: AMBER }}>“{query}”</strong> is in <strong>{results[0].doc.title}</strong>. {results[0].snippet}
              </div>
              <div style={{ marginTop: 8, fontSize: 11, color: TEXT_DIM }}>Synthesized from {results.length} sources · confidence {Math.round(results[0].confidence * 100)}%</div>
            </div>
          )}
          {results.length === 0 ? (
            <div style={{ padding: "16px", fontSize: 13, color: TEXT_MUTED }}>No matches in {TOTAL_INDEXED.toLocaleString()} indexed documents.</div>
          ) : (
            results.map((r) => (
              <Link
                key={r.doc.id}
                href={`/docs/${r.doc.id}`}
                style={{ display: "flex", gap: 10, padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, color: TEXT, textDecoration: "none", alignItems: "flex-start" }}
              >
                <span style={{ fontSize: 18, lineHeight: 1.2 }}>{r.doc.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.doc.title}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 999, background: `${ACCENT}1F`, color: ACCENT, whiteSpace: "nowrap" }}>{Math.round(r.confidence * 100)}%</span>
                  </div>
                  <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 3, lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{r.snippet}</div>
                </div>
              </Link>
            ))
          )}
        </>
      )}
    </div>
  );
}

function AnalyticsRow({ doc, compact = false }: { doc: DocItem; compact?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: compact ? 10 : 14, fontSize: 11, color: TEXT_DIM, flexWrap: "wrap" }}>
      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <Eye size={11} /> {doc.views.toLocaleString()} views
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 4, color: doc.helpful >= 90 ? "#10B981" : TEXT_DIM }}>
        <ThumbsUp size={11} /> {doc.helpful}% helpful
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <Clock size={11} /> Updated {doc.lastEdited}
      </span>
    </div>
  );
}

function MentionsRow({ doc }: { doc: DocItem }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: TEXT_MUTED, marginTop: 6 }}>
      <Link2 size={11} style={{ color: ACCENT }} />
      <span>
        Referenced in: <strong style={{ color: TEXT }}>{doc.refWorkflows} workflows</strong>, <strong style={{ color: TEXT }}>{doc.refAutomations} automations</strong>
      </span>
    </div>
  );
}

function AskAboutDoc() {
  const [open, setOpen] = useState(false);
  const prompts = [
    "What are the key steps in this article?",
    "Summarize this for a new user",
    "What related articles should I read?",
  ];
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 60 }}>
      {open && (
        <div style={{ marginBottom: 10, width: 300, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, boxShadow: "0 16px 50px rgba(0,0,0,0.55)", overflow: "hidden" }}>
          <div style={{ padding: "12px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8, background: `linear-gradient(135deg, ${ACCENT}22, #8B5CF622)` }}>
            <Bot size={14} style={{ color: ACCENT }} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>Doc Assistant</span>
          </div>
          <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            {prompts.map((p) => (
              <button key={p} style={{ textAlign: "left", padding: "8px 10px", borderRadius: 8, border: `1px solid ${BORDER}`, background: SURFACE_2, color: TEXT, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Ask about this doc"
        style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 999, border: "none", background: `linear-gradient(135deg, ${ACCENT}, #8B5CF6)`, color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: `0 8px 28px ${ACCENT}88`, fontFamily: "inherit" }}
      >
        <Bot size={14} />
        Ask about this doc
      </button>
    </div>
  );
}

function QuickActions({ onTemplate }: { onTemplate: () => void }) {
  const actions: Array<{ label: string; icon: React.ReactNode; primary?: boolean; onClick?: () => void }> = [
    { label: "New doc", icon: <Plus size={13} />, onClick: onTemplate },
    { label: "Import", icon: <Import size={13} /> },
    { label: "Export", icon: <Download size={13} /> },
    { label: "AI Draft", icon: <Sparkles size={13} />, primary: true },
  ];
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {actions.map((a) => (
        <button
          key={a.label}
          onClick={a.onClick}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 11px",
            borderRadius: 8,
            border: a.primary ? "none" : `1px solid ${BORDER}`,
            background: a.primary ? `linear-gradient(135deg, ${AMBER}, #EC4899)` : SURFACE_2,
            color: a.primary ? "white" : TEXT,
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: a.primary ? `0 2px 12px ${AMBER}55` : "none",
          }}
        >
          {a.icon}
          {a.label}
        </button>
      ))}
    </div>
  );
}

export default function DocsListPage() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    "ws-1": true,
    "ws-1-1": true,
  });
  const [view, setView] = useState<"list" | "grid" | "graph" | "editor">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [docs, setDocs] = useState<DocItem[]>(DOCS);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"recent" | "name">("recent");

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearching(false);
      return;
    }
    setSearching(true);
    const t = setTimeout(() => setSearching(false), 420);
    return () => clearTimeout(t);
  }, [searchQuery]);

  function toggleNode(id: string) {
    setExpanded((prev) => {
      const current = prev[id] ?? id.split("-").length < 3;
      return { ...prev, [id]: !current };
    });
  }

  function toggleStar(id: string) {
    setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, starred: !d.starred } : d)));
  }

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = docs;
    if (q) list = list.filter((d) => d.title.toLowerCase().includes(q) || d.excerpt.toLowerCase().includes(q));
    if (sortBy === "name") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [docs, searchQuery, sortBy]);

  const searchResults = useMemo(() => buildSearchResults(searchQuery, docs), [searchQuery, docs]);
  const starred = filtered.filter((d) => d.starred);
  const rest = filtered.filter((d) => !d.starred);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", height: "100%", minHeight: "100vh", background: BG, color: TEXT, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <aside style={{ borderRight: `1px solid ${BORDER}`, background: SURFACE, overflowY: "auto", padding: "14px 10px", display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px" }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: `linear-gradient(135deg, ${ACCENT}, #8B5CF6)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FileText size={13} color="white" />
          </div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Docs</div>
          <span style={{ marginLeft: "auto", fontSize: 10, color: TEXT_DIM, display: "flex", alignItems: "center", gap: 3 }}>
            <BarChart2 size={10} /> {TOTAL_INDEXED.toLocaleString()}
          </span>
        </div>

        <button
          onClick={() => setTemplatesOpen(true)}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${ACCENT}, #8B5CF6)`, color: "white", fontSize: 13, fontWeight: 500, cursor: "pointer", boxShadow: `0 2px 12px ${ACCENT}55`, fontFamily: "inherit" }}
        >
          <Plus size={14} />
          <span>New page</span>
        </button>

        <section>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: TEXT_DIM, padding: "0 8px 6px", display: "flex", alignItems: "center", gap: 6 }}>
            <Clock size={10} /> Recents
          </div>
          <div>
            {RECENTS.map((r) => (
              <Link
                key={r.id}
                href={`/docs/${r.id}`}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 8px", borderRadius: 6, fontSize: 13, color: TEXT, textDecoration: "none", transition: "background 120ms" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = SURFACE_2)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span>{r.icon}</span>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</span>
              </Link>
            ))}
          </div>
        </section>

        <section style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: TEXT_DIM, padding: "0 8px 6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>Workspaces</span>
            <button style={{ background: "transparent", border: "none", color: TEXT_DIM, cursor: "pointer", padding: 2 }} aria-label="Add workspace">
              <Plus size={11} />
            </button>
          </div>
          <div>
            {TREE.map((n) => (
              <TreeRow key={n.id} node={n} depth={0} expanded={expanded} onToggle={toggleNode} />
            ))}
          </div>
        </section>
      </aside>

      <main style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 24px", borderBottom: `1px solid ${BORDER}`, background: SURFACE, minHeight: 56, flexWrap: "wrap" }}>
          <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: TEXT_MUTED }}>
            <Home size={13} />
            <span>OmniOS</span>
            <ChevronRight size={12} />
            <span style={{ color: TEXT, fontWeight: 500 }}>All docs</span>
          </nav>

          <div style={{ flex: 1 }} />

          <QuickActions onTemplate={() => setTemplatesOpen(true)} />

          <div style={{ position: "relative", width: 320 }}>
            <Search size={13} style={{ position: "absolute", top: "50%", left: 10, transform: "translateY(-50%)", color: searching ? ACCENT : TEXT_DIM }} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask AI or search 2,847 docs…"
              aria-label="Search documents"
              style={{ width: "100%", padding: "7px 26px 7px 30px", borderRadius: 8, background: SURFACE_2, border: `1px solid ${searching ? ACCENT : BORDER}`, color: TEXT, fontSize: 13, outline: "none", fontFamily: "inherit", transition: "border-color 160ms" }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                style={{ position: "absolute", top: "50%", right: 6, transform: "translateY(-50%)", background: "transparent", border: "none", color: TEXT_DIM, cursor: "pointer", padding: 4, borderRadius: 4 }}
              >
                <X size={12} />
              </button>
            )}
            <SearchPanel query={searchQuery} searching={searching} results={searchResults} />
          </div>

          <button onClick={() => setSortBy((s) => (s === "recent" ? "name" : "recent"))} title={`Sort: ${sortBy === "recent" ? "Recent" : "Name"}`} style={iconBtnStyle}>
            <SortAsc size={14} />
          </button>
          <button style={iconBtnStyle} aria-label="Filter">
            <Filter size={14} />
          </button>

          <div style={{ display: "flex", background: SURFACE_2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 2 }}>
            <button
              onClick={() => setView("list")}
              aria-pressed={view === "list"}
              aria-label="List view"
              style={{ padding: "5px 8px", borderRadius: 6, border: "none", background: view === "list" ? ACCENT : "transparent", color: view === "list" ? "white" : TEXT_MUTED, cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              <ListIcon size={13} />
            </button>
            <button
              onClick={() => setView("grid")}
              aria-pressed={view === "grid"}
              aria-label="Grid view"
              style={{ padding: "5px 8px", borderRadius: 6, border: "none", background: view === "grid" ? ACCENT : "transparent", color: view === "grid" ? "white" : TEXT_MUTED, cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              <LayoutGrid size={13} />
            </button>
            <button
              onClick={() => setView("graph")}
              aria-pressed={view === "graph"}
              aria-label="Graph view"
              style={{ padding: "5px 8px", borderRadius: 6, border: "none", background: view === "graph" ? ACCENT : "transparent", color: view === "graph" ? "white" : TEXT_MUTED, cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              <GitBranch size={13} />
            </button>
            <button
              onClick={() => setView("editor")}
              aria-pressed={view === "editor"}
              aria-label="Editor view"
              style={{ padding: "5px 8px", borderRadius: 6, border: "none", background: view === "editor" ? ACCENT : "transparent", color: view === "editor" ? "white" : TEXT_MUTED, cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              <FileEdit size={13} />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: view === "editor" ? "0" : "24px 32px" }}>
          {view === "graph" ? (
            <div style={{ padding: "24px 32px" }}>
              <div style={{ marginBottom: 12, fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: TEXT_DIM }}>Knowledge Graph — document relationships</div>
              <KnowledgeGraph height={520} />
            </div>
          ) : view === "editor" ? (
            <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 32px" }}>
              <BlockEditor placeholder="Start writing, or press / for commands..." />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState onTemplate={() => setTemplatesOpen(true)} />
          ) : (
            <>
              {starred.length > 0 && (
                <section style={{ marginBottom: 32 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: TEXT_DIM, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                    <Star size={11} style={{ fill: AMBER, color: AMBER }} /> Starred
                  </div>
                  {view === "list" ? <DocList docs={starred} onStar={toggleStar} /> : <DocGrid docs={starred} onStar={toggleStar} />}
                </section>
              )}
              <section>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: TEXT_DIM, marginBottom: 12 }}>All documents</div>
                {view === "list" ? <DocList docs={rest} onStar={toggleStar} /> : <DocGrid docs={rest} onStar={toggleStar} />}
              </section>
            </>
          )}
        </div>
      </main>

      <TemplatesModal open={templatesOpen} onClose={() => setTemplatesOpen(false)} />
      <AskAboutDoc />
    </div>
  );
}

const iconBtnStyle: React.CSSProperties = {
  padding: 7,
  borderRadius: 8,
  border: `1px solid ${BORDER}`,
  background: SURFACE_2,
  color: TEXT_MUTED,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
};

function DocList({ docs, onStar }: { docs: DocItem[]; onStar: (id: string) => void }) {
  return (
    <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, overflow: "hidden", background: SURFACE }}>
      <div style={{ display: "grid", gridTemplateColumns: "32px 1fr 130px 220px 40px 40px", gap: 12, padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, fontSize: 11, color: TEXT_DIM, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
        <span />
        <span>Title</span>
        <span>Author</span>
        <span>Analytics</span>
        <span />
        <span />
      </div>
      {docs.map((d) => (
        <Link
          key={d.id}
          href={`/docs/${d.id}`}
          style={{ display: "grid", gridTemplateColumns: "32px 1fr 130px 220px 40px 40px", gap: 12, alignItems: "center", padding: "12px 14px", borderBottom: `1px solid ${BORDER}`, color: TEXT, textDecoration: "none", transition: "background 120ms" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = SURFACE_2)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <span style={{ fontSize: 18 }}>{d.icon}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.title}</div>
            <div style={{ fontSize: 12, color: TEXT_MUTED, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>{d.excerpt}</div>
            <MentionsRow doc={d} />
          </div>
          <span style={{ fontSize: 13, color: TEXT_MUTED }}>{d.author}</span>
          <AnalyticsRow doc={d} compact />
          <button
            onClick={(e) => {
              e.preventDefault();
              onStar(d.id);
            }}
            aria-label={d.starred ? "Unstar" : "Star"}
            style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 6, borderRadius: 6 }}
          >
            <Star size={14} style={{ color: d.starred ? AMBER : TEXT_DIM, fill: d.starred ? AMBER : "transparent" }} />
          </button>
          <button
            onClick={(e) => e.preventDefault()}
            aria-label="More"
            style={{ background: "transparent", border: "none", color: TEXT_DIM, cursor: "pointer", padding: 6, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <MoreHorizontal size={14} />
          </button>
        </Link>
      ))}
    </div>
  );
}

function DocGrid({ docs, onStar }: { docs: DocItem[]; onStar: (id: string) => void }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
      {docs.map((d) => (
        <Link
          key={d.id}
          href={`/docs/${d.id}`}
          style={{ display: "flex", flexDirection: "column", gap: 10, padding: 16, borderRadius: 10, border: `1px solid ${BORDER}`, background: SURFACE, color: TEXT, textDecoration: "none", transition: "all 160ms", minHeight: 200 }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = ACCENT;
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = BORDER;
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <span style={{ fontSize: 24 }}>{d.icon}</span>
            <div style={{ display: "flex", gap: 4 }}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onStar(d.id);
                }}
                aria-label={d.starred ? "Unstar" : "Star"}
                style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4, borderRadius: 6 }}
              >
                <Star size={14} style={{ color: d.starred ? AMBER : TEXT_DIM, fill: d.starred ? AMBER : "transparent" }} />
              </button>
              <span style={{ padding: 4, color: TEXT_DIM, display: "flex", alignItems: "center" }}>
                <ExternalLink size={12} />
              </span>
            </div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{d.title}</div>
          <div style={{ fontSize: 12, color: TEXT_MUTED, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{d.excerpt}</div>
          <AnalyticsRow doc={d} />
          <MentionsRow doc={d} />
          <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: TEXT_DIM, paddingTop: 6, borderTop: `1px solid ${BORDER}` }}>
            <span>{d.author}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <BookOpen size={11} /> Open
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

function EmptyState({ onTemplate }: { onTemplate: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", textAlign: "center" }}>
      <div style={{ width: 80, height: 80, borderRadius: 20, background: `linear-gradient(135deg, ${ACCENT}22, #8B5CF622)`, border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, position: "relative" }}>
        <FileText size={32} style={{ color: ACCENT }} />
        <span style={{ position: "absolute", top: -6, right: -6, fontSize: 18 }}>✨</span>
      </div>
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: TEXT }}>A blank canvas awaits</h3>
      <p style={{ margin: "8px 0 20px", fontSize: 13, color: TEXT_MUTED, maxWidth: 360, lineHeight: 1.6 }}>
        No documents match. Start a new page from scratch, or pick a template to hit the ground running.
      </p>
      <div style={{ display: "flex", gap: 10 }}>
        <Link
          href="/docs/new"
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 8, background: `linear-gradient(135deg, ${ACCENT}, #8B5CF6)`, color: "white", fontSize: 13, fontWeight: 500, textDecoration: "none" }}
        >
          <Plus size={13} />
          New page
        </Link>
        <button
          onClick={onTemplate}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 8, border: `1px solid ${BORDER}`, background: SURFACE_2, color: TEXT, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}
        >
          <Sparkles size={13} style={{ color: ACCENT }} />
          Browse templates
        </button>
      </div>
    </div>
  );
}
