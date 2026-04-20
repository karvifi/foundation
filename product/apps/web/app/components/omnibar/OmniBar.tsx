"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  FileText,
  KanbanSquare,
  Brain,
  Users,
  LayoutDashboard,
  Inbox,
  Settings,
  BarChart3,
  CreditCard,
  ArrowRight,
  Command,
} from "lucide-react";

interface OmniBarProps {
  onClose: () => void;
}

const COMMANDS = [
  { id: "home", label: "Go to Home", icon: LayoutDashboard, href: "/", type: "Navigate" },
  { id: "docs", label: "Go to Docs", icon: FileText, href: "/docs", type: "Navigate" },
  { id: "projects", label: "Go to Projects", icon: KanbanSquare, href: "/projects", type: "Navigate" },
  { id: "mind", label: "Open OmniMind AI", icon: Brain, href: "/mind", type: "Navigate" },
  { id: "crm", label: "Go to CRM", icon: Users, href: "/crm", type: "Navigate" },
  { id: "inbox", label: "Open Inbox", icon: Inbox, href: "/inbox", type: "Navigate" },
  { id: "analytics", label: "Go to Analytics", icon: BarChart3, href: "/analytics", type: "Navigate" },
  { id: "finance", label: "Go to Finance", icon: CreditCard, href: "/finance", type: "Navigate" },
  { id: "settings", label: "Open Settings", icon: Settings, href: "/settings", type: "Navigate" },
  { id: "new-doc", label: "New Document", icon: FileText, href: "/docs/new", type: "Create" },
  { id: "new-task", label: "New Task", icon: KanbanSquare, href: "/projects/new", type: "Create" },
];

export default function OmniBar({ onClose }: OmniBarProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = query.trim()
    ? COMMANDS.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.type.toLowerCase().includes(query.toLowerCase())
      )
    : COMMANDS;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") { onClose(); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setSelected((s) => Math.min(s + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
    if (e.key === "Enter" && filtered[selected]) {
      router.push(filtered[selected].href);
      onClose();
    }
  }

  function handleSelect(href: string) {
    router.push(href);
    onClose();
  }

  const grouped = filtered.reduce<Record<string, typeof COMMANDS>>((acc, cmd) => {
    if (!acc[cmd.type]) acc[cmd.type] = [];
    acc[cmd.type].push(cmd);
    return acc;
  }, {});

  return (
    <div className="omnibar-overlay" onClick={onClose}>
      <div className="omnibar" onClick={(e) => e.stopPropagation()}>
        <div className="omnibar__input-row">
          <Search size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            className="omnibar__input"
            placeholder="Search or run a command…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
          />
        </div>

        <div className="omnibar__results">
          {filtered.length === 0 && (
            <div style={{ padding: "24px 10px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
              No results for "{query}"
            </div>
          )}
          {Object.entries(grouped).map(([type, cmds]) => (
            <div key={type}>
              <div className="omnibar__section-label">{type}</div>
              {cmds.map((cmd, i) => {
                const Icon = cmd.icon;
                const globalIndex = filtered.indexOf(cmd);
                return (
                  <div
                    key={cmd.id}
                    className={`omnibar__result${globalIndex === selected ? " selected" : ""}`}
                    onClick={() => handleSelect(cmd.href)}
                    onMouseEnter={() => setSelected(globalIndex)}
                  >
                    <div className="omnibar__result-icon">
                      <Icon size={15} style={{ color: "var(--text-secondary)" }} />
                    </div>
                    <span className="omnibar__result-label">{cmd.label}</span>
                    {globalIndex === selected && (
                      <ArrowRight size={13} style={{ color: "var(--text-muted)" }} />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="omnibar__footer">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> select</span>
          <span><kbd>Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
