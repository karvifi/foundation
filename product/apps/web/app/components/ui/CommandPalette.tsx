"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  FileText,
  KanbanSquare,
  Users,
  Brain,
  Layers,
  Settings,
  Plus,
  UserPlus,
  Zap,
  MessageSquare,
  Sparkles,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Clock,
  FileEdit,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────
type Section = "Navigate" | "Actions" | "Recent Docs" | "AI Commands";

interface CommandItem {
  id: string;
  section: Section;
  label: string;
  icon: React.ReactNode;
  shortcut?: string[];
  kind: "navigate" | "action" | "doc" | "ai";
  target?: string;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

// ── Command registry ────────────────────────────────────────────────────
const ICON_SIZE = 14;

const COMMANDS: CommandItem[] = [
  // Navigate
  { id: "nav-dash",      section: "Navigate", label: "Dashboard",   icon: <LayoutDashboard size={ICON_SIZE} />, shortcut: ["G", "D"], kind: "navigate", target: "/dashboard" },
  { id: "nav-docs",      section: "Navigate", label: "Docs",        icon: <FileText        size={ICON_SIZE} />, shortcut: ["G", "O"], kind: "navigate", target: "/docs" },
  { id: "nav-projects",  section: "Navigate", label: "Projects",    icon: <KanbanSquare    size={ICON_SIZE} />, shortcut: ["G", "P"], kind: "navigate", target: "/projects" },
  { id: "nav-crm",       section: "Navigate", label: "CRM",         icon: <Users           size={ICON_SIZE} />, shortcut: ["G", "C"], kind: "navigate", target: "/crm" },
  { id: "nav-mind",      section: "Navigate", label: "Mind",        icon: <Brain           size={ICON_SIZE} />, shortcut: ["G", "M"], kind: "navigate", target: "/mind" },
  { id: "nav-build",     section: "Navigate", label: "Build",       icon: <Layers          size={ICON_SIZE} />, shortcut: ["G", "B"], kind: "navigate", target: "/build" },
  { id: "nav-analytics", section: "Navigate", label: "Analytics",   icon: <BarChart3       size={ICON_SIZE} />, shortcut: ["G", "A"], kind: "navigate", target: "/analytics" },
  { id: "nav-settings",  section: "Navigate", label: "Settings",    icon: <Settings        size={ICON_SIZE} />, shortcut: ["G", "S"], kind: "navigate", target: "/settings" },

  // Actions
  { id: "act-doc",     section: "Actions", label: "New Doc",          icon: <FileEdit  size={ICON_SIZE} />, shortcut: ["⌘", "N"], kind: "action", target: "/docs/new" },
  { id: "act-task",    section: "Actions", label: "New Task",         icon: <Plus      size={ICON_SIZE} />, shortcut: ["T"],       kind: "action", target: "/projects?new=task" },
  { id: "act-contact", section: "Actions", label: "New Contact",      icon: <UserPlus  size={ICON_SIZE} />, shortcut: ["C"],       kind: "action", target: "/crm?new=contact" },
  { id: "act-sprint",  section: "Actions", label: "Generate Sprint",  icon: <Zap       size={ICON_SIZE} />,                       kind: "action", target: "/projects?generate=sprint" },
  { id: "act-mind",    section: "Actions", label: "Open OmniMind",    icon: <Brain     size={ICON_SIZE} />, shortcut: ["⌘", "/"],  kind: "action", target: "/mind" },

  // Recent Docs
  { id: "doc-1", section: "Recent Docs", label: "Q2 Product Roadmap",            icon: <Clock size={ICON_SIZE} />, kind: "doc", target: "/docs/1" },
  { id: "doc-2", section: "Recent Docs", label: "Engineering Spec: OmniMind",    icon: <Clock size={ICON_SIZE} />, kind: "doc", target: "/docs/2" },
  { id: "doc-3", section: "Recent Docs", label: "Sales Playbook v3",             icon: <Clock size={ICON_SIZE} />, kind: "doc", target: "/docs/3" },
  { id: "doc-4", section: "Recent Docs", label: "OKRs — April 2026",             icon: <Clock size={ICON_SIZE} />, kind: "doc", target: "/docs/4" },

  // AI Commands
  { id: "ai-1", section: "AI Commands", label: "Summarize workspace",      icon: <Sparkles      size={ICON_SIZE} />, kind: "ai", target: "/mind?q=summarize-workspace" },
  { id: "ai-2", section: "AI Commands", label: "What's overdue?",          icon: <AlertCircle   size={ICON_SIZE} />, kind: "ai", target: "/mind?q=whats-overdue" },
  { id: "ai-3", section: "AI Commands", label: "Show pipeline deals",      icon: <TrendingUp    size={ICON_SIZE} />, kind: "ai", target: "/mind?q=pipeline-deals" },
  { id: "ai-4", section: "AI Commands", label: "Generate weekly report",   icon: <MessageSquare size={ICON_SIZE} />, kind: "ai", target: "/mind?q=weekly-report" },
];

const SECTION_ORDER: Section[] = ["Navigate", "Actions", "Recent Docs", "AI Commands"];

// ── Component ────────────────────────────────────────────────────────────
export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState<string>("");
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Filter + group
  const filtered = useMemo<CommandItem[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMANDS;
    return COMMANDS.filter((c) => c.label.toLowerCase().includes(q));
  }, [query]);

  const groups = useMemo<{ section: Section; items: CommandItem[] }[]>(() => {
    const map = new Map<Section, CommandItem[]>();
    for (const item of filtered) {
      const arr = map.get(item.section) ?? [];
      arr.push(item);
      map.set(item.section, arr);
    }
    return SECTION_ORDER.filter((s) => map.has(s)).map((s) => ({
      section: s,
      items: map.get(s) ?? [],
    }));
  }, [filtered]);

  // Flat list of items in the order they appear (for arrow navigation)
  const flatItems = useMemo<CommandItem[]>(
    () => groups.flatMap((g) => g.items),
    [groups]
  );

  // Reset state when opening
  useEffect(() => {
    if (open) {
      setQuery("");
      setHighlightedIndex(0);
      window.setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  // Clamp highlight to available items
  useEffect(() => {
    if (highlightedIndex >= flatItems.length) {
      setHighlightedIndex(Math.max(0, flatItems.length - 1));
    }
  }, [flatItems.length, highlightedIndex]);

  // Keyboard handling
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((i) => (flatItems.length === 0 ? 0 : (i + 1) % flatItems.length));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((i) =>
          flatItems.length === 0 ? 0 : (i - 1 + flatItems.length) % flatItems.length
        );
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const item = flatItems[highlightedIndex];
        if (item) {
          runCommand(item);
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, highlightedIndex, flatItems]);

  function runCommand(item: CommandItem): void {
    if (item.target) {
      router.push(item.target);
    }
    onClose();
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "oklch(0% 0 0 / 0.55)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "15vh",
        animation: "cp-fade 150ms var(--ease-out)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 580,
          margin: "0 16px",
          background: "var(--shell-surface)",
          border: "1px solid var(--panel-border)",
          borderRadius: 14,
          boxShadow: "var(--shadow-lg)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          animation: "cp-rise 180ms var(--ease-out)",
        }}
      >
        {/* Search input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 16px",
            borderBottom: "1px solid var(--panel-border)",
          }}
        >
          <Search size={15} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlightedIndex(0);
            }}
            placeholder="Type a command or search…"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: 15,
              fontFamily: "inherit",
              color: "var(--text-primary)",
            }}
          />
          <span
            style={{
              fontSize: 10,
              fontWeight: 500,
              color: "var(--text-muted)",
              background: "var(--shell-border)",
              border: "1px solid var(--panel-border)",
              borderRadius: 4,
              padding: "1px 6px",
            }}
          >
            ESC
          </span>
        </div>

        {/* Results */}
        <div
          style={{
            flex: 1,
            maxHeight: "55vh",
            overflowY: "auto",
            padding: 6,
          }}
        >
          {flatItems.length === 0 ? (
            <div
              style={{
                padding: "40px 20px",
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: 13,
              }}
            >
              No commands match “{query}”
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.section} style={{ marginBottom: 4 }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    padding: "10px 12px 6px",
                  }}
                >
                  {group.section}
                </div>
                {group.items.map((item) => {
                  const flatIdx = flatItems.findIndex((c) => c.id === item.id);
                  const isHighlighted = flatIdx === highlightedIndex;
                  return (
                    <CommandRow
                      key={item.id}
                      item={item}
                      highlighted={isHighlighted}
                      onHover={() => setHighlightedIndex(flatIdx)}
                      onSelect={() => runCommand(item)}
                    />
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "8px 16px",
            borderTop: "1px solid var(--panel-border)",
            fontSize: 11,
            color: "var(--text-muted)",
          }}
        >
          <FooterHint label="Navigate" keys={["↑", "↓"]} />
          <FooterHint label="Select"   keys={["↵"]}      />
          <FooterHint label="Close"    keys={["esc"]}    />
          <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
            <Sparkles size={10} style={{ color: "var(--accent)" }} />
            <span>OmniOS commands</span>
          </span>
        </div>
      </div>

      <style>{`
        @keyframes cp-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cp-rise {
          from { opacity: 0; transform: translateY(-10px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

// ── Row ──────────────────────────────────────────────────────────────────
interface CommandRowProps {
  item: CommandItem;
  highlighted: boolean;
  onHover: () => void;
  onSelect: () => void;
}

function CommandRow({ item, highlighted, onHover, onSelect }: CommandRowProps) {
  const iconWrapColor = (() => {
    switch (item.kind) {
      case "ai":       return "var(--accent)";
      case "action":   return "var(--yellow)";
      case "doc":      return "var(--blue)";
      default:         return "var(--text-secondary)";
    }
  })();

  return (
    <button
      type="button"
      onMouseEnter={onHover}
      onClick={onSelect}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        padding: "8px 10px",
        background: highlighted ? "var(--accent-subtle)" : "transparent",
        border: highlighted ? "1px solid var(--accent-border)" : "1px solid transparent",
        borderRadius: 8,
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "inherit",
        color: "var(--text-primary)",
        transition: "background var(--dur-fast)",
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--shell-border)",
          color: iconWrapColor,
          flexShrink: 0,
        }}
      >
        {item.icon}
      </span>
      <span
        style={{
          flex: 1,
          fontSize: 13,
          fontWeight: 450,
          color: "var(--text-primary)",
        }}
      >
        {item.label}
      </span>
      {item.shortcut && (
        <span style={{ display: "inline-flex", gap: 3 }}>
          {item.shortcut.map((k, i) => (
            <kbd
              key={i}
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: "var(--text-muted)",
                background: "var(--shell-border)",
                border: "1px solid var(--panel-border)",
                borderRadius: 4,
                padding: "1px 5px",
                fontFamily: "inherit",
                minWidth: 16,
                textAlign: "center",
              }}
            >
              {k}
            </kbd>
          ))}
        </span>
      )}
    </button>
  );
}

// ── Footer hint ──────────────────────────────────────────────────────────
function FooterHint({ label, keys }: { label: string; keys: string[] }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {keys.map((k, i) => (
        <kbd
          key={i}
          style={{
            fontSize: 10,
            fontWeight: 500,
            color: "var(--text-muted)",
            background: "var(--shell-border)",
            border: "1px solid var(--panel-border)",
            borderRadius: 4,
            padding: "0 5px",
            minWidth: 14,
            textAlign: "center",
            fontFamily: "inherit",
          }}
        >
          {k}
        </kbd>
      ))}
      <span>{label}</span>
    </span>
  );
}
