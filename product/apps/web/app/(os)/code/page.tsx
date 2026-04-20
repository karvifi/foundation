"use client";

import { useState } from "react";
import {
  Play,
  Bug,
  GitBranch,
  Package,
  Search,
  Settings,
  Terminal as TerminalIcon,
  X,
  ChevronDown,
  ChevronRight,
  FileCode,
  Folder,
  FolderOpen,
  Sparkles,
  GitCommit,
  GitPullRequest,
  Circle,
  AlertCircle,
  AlertTriangle,
  Bell,
  Wifi,
  Plus,
  MoreHorizontal,
  Send,
  Zap,
} from "lucide-react";

interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  language?: string;
  children?: FileNode[];
  modified?: boolean;
  added?: boolean;
}

interface OpenTab {
  id: string;
  name: string;
  language: string;
  dirty?: boolean;
}

const PROJECT_TREE: FileNode[] = [
  {
    id: "src",
    name: "src",
    type: "folder",
    children: [
      {
        id: "src/components",
        name: "components",
        type: "folder",
        children: [
          { id: "src/components/App.tsx", name: "App.tsx", type: "file", language: "tsx", modified: true },
          { id: "src/components/Sidebar.tsx", name: "Sidebar.tsx", type: "file", language: "tsx" },
          { id: "src/components/Header.tsx", name: "Header.tsx", type: "file", language: "tsx", added: true },
        ],
      },
      {
        id: "src/hooks",
        name: "hooks",
        type: "folder",
        children: [
          { id: "src/hooks/useAuth.ts", name: "useAuth.ts", type: "file", language: "ts" },
          { id: "src/hooks/useDebounce.ts", name: "useDebounce.ts", type: "file", language: "ts", modified: true },
        ],
      },
      {
        id: "src/lib",
        name: "lib",
        type: "folder",
        children: [
          { id: "src/lib/utils.ts", name: "utils.ts", type: "file", language: "ts" },
          { id: "src/lib/api.ts", name: "api.ts", type: "file", language: "ts" },
        ],
      },
      { id: "src/index.ts", name: "index.ts", type: "file", language: "ts" },
    ],
  },
  {
    id: "public",
    name: "public",
    type: "folder",
    children: [{ id: "public/favicon.ico", name: "favicon.ico", type: "file", language: "ico" }],
  },
  { id: "package.json", name: "package.json", type: "file", language: "json" },
  { id: "tsconfig.json", name: "tsconfig.json", type: "file", language: "json" },
  { id: "README.md", name: "README.md", type: "file", language: "md" },
];

const FILE_CONTENTS: Record<string, string> = {
  "src/index.ts": `import { createApp } from "./lib/api";
import { config } from "./config";

// Bootstrap the OmniMind runtime
const app = createApp({
  name: "omnimind-os",
  version: "2.4.1",
  env: process.env.NODE_ENV ?? "development",
});

async function main(): Promise<void> {
  await app.initialize();
  await app.listen(config.port);
}

main().catch((error) => {
  process.exit(1);
});`,
  "src/components/App.tsx": `import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAuth } from "../hooks/useAuth";

interface AppProps {
  initialRoute?: string;
}

export function App({ initialRoute = "/" }: AppProps) {
  const { user, loading } = useAuth();
  const [route, setRoute] = useState(initialRoute);

  useEffect(() => {
    document.title = \`OmniMind - \${route}\`;
  }, [route]);

  if (loading) {
    return <div className="spinner">Loading...</div>;
  }

  return (
    <div className="app-shell">
      <Header user={user} />
      <Sidebar onNavigate={setRoute} current={route} />
      <main className="canvas" />
    </div>
  );
}`,
  "src/components/Sidebar.tsx": `import { FC } from "react";

interface SidebarProps {
  onNavigate: (route: string) => void;
  current: string;
}

export const Sidebar: FC<SidebarProps> = ({ onNavigate, current }) => {
  const items = ["dashboard", "code", "docs", "chat"];
  return (
    <nav className="sidebar">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onNavigate(\`/\${item}\`)}
          className={current === \`/\${item}\` ? "active" : ""}
        >
          {item}
        </button>
      ))}
    </nav>
  );
};`,
  "src/components/Header.tsx": `import type { User } from "../lib/api";

interface HeaderProps {
  user: User | null;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="header">
      <div className="brand">OmniMind</div>
      {user && <div className="user">{user.email}</div>}
    </header>
  );
}`,
  "src/hooks/useAuth.ts": `import { useState, useEffect } from "react";
import type { User } from "../lib/api";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => setUser(data.user))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}`,
  "src/hooks/useDebounce.ts": `import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handle);
  }, [value, delay]);

  return debounced;
}`,
  "src/lib/utils.ts": `export function cn(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}`,
  "src/lib/api.ts": `export interface User {
  id: string;
  email: string;
  name: string;
}

interface AppConfig {
  name: string;
  version: string;
  env: string;
}

export function createApp(config: AppConfig) {
  return {
    async initialize() {},
    async listen(port: number) {},
    config,
  };
}`,
  "package.json": `{
  "name": "omnimind-os",
  "version": "2.4.1",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.2.0",
    "react": "18.3.0",
    "lucide-react": "0.400.0"
  }
}`,
  "tsconfig.json": `{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "esnext"],
    "strict": true,
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler"
  },
  "include": ["src/**/*"]
}`,
  "README.md": `# OmniMind OS

A next-generation cognitive operating system.

## Getting Started

npm install
npm run dev`,
};

const TS_KEYWORDS = new Set([
  "import", "export", "from", "const", "let", "var", "function", "return",
  "if", "else", "async", "await", "class", "interface", "type", "extends",
  "implements", "new", "this", "void", "null", "undefined", "true", "false",
  "for", "while", "try", "catch", "finally", "throw", "typeof", "as",
]);
const TS_TYPES = new Set([
  "string", "number", "boolean", "any", "unknown", "never", "Promise",
  "Array", "Record", "Partial", "Date", "Error", "User", "FC",
]);

function highlightLine(line: string, key: string): React.ReactNode {
  const tokens: React.ReactNode[] = [];
  const regex = /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|([^\w\s])/g;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = regex.exec(line)) !== null) {
    const [, comment, str, num, word, ws, punct] = match;
    if (comment) {
      tokens.push(<span key={i} style={{ color: "#6B7280", fontStyle: "italic" }}>{comment}</span>);
    } else if (str) {
      tokens.push(<span key={i} style={{ color: "#A5F3C4" }}>{str}</span>);
    } else if (num) {
      tokens.push(<span key={i} style={{ color: "#FBBF24" }}>{num}</span>);
    } else if (word) {
      if (TS_KEYWORDS.has(word)) {
        tokens.push(<span key={i} style={{ color: "#C084FC" }}>{word}</span>);
      } else if (TS_TYPES.has(word)) {
        tokens.push(<span key={i} style={{ color: "#60A5FA" }}>{word}</span>);
      } else if (/^[A-Z]/.test(word)) {
        tokens.push(<span key={i} style={{ color: "#FCD34D" }}>{word}</span>);
      } else {
        tokens.push(<span key={i} style={{ color: "#E5E7EB" }}>{word}</span>);
      }
    } else if (ws) {
      tokens.push(<span key={i}>{ws}</span>);
    } else if (punct) {
      tokens.push(<span key={i} style={{ color: "#94A3B8" }}>{punct}</span>);
    }
    i++;
  }
  return <div key={key} style={{ whiteSpace: "pre", minHeight: 21 }}>{tokens.length ? tokens : "\u00A0"}</div>;
}

const INITIAL_TERMINAL: { type: string; text: string }[] = [
  { type: "sys", text: "omnimind@os ~/workspace $ pnpm dev" },
  { type: "info", text: "> omnimind-os@2.4.1 dev" },
  { type: "info", text: "> next dev" },
  { type: "ok", text: "  Next.js 14.2.0" },
  { type: "ok", text: "  - Local:        http://localhost:3000" },
  { type: "ok", text: "  - Environments: .env.local" },
  { type: "dim", text: " Ready in 1.2s" },
  { type: "dim", text: " Compiling /code ..." },
  { type: "ok", text: " Compiled /code in 384ms (512 modules)" },
];

const GIT_CHANGES = [
  { path: "src/components/App.tsx", status: "M" as const },
  { path: "src/components/Header.tsx", status: "A" as const },
  { path: "src/hooks/useDebounce.ts", status: "M" as const },
  { path: ".env.local", status: "?" as const },
];

const AI_SUGGESTIONS = [
  { title: "Extract auth logic to custom hook", body: "The authentication flow in App.tsx could be cleaner if extracted into a dedicated useAuthGuard hook.", line: 14 },
  { title: "Add error boundary", body: "Wrap the main content in an ErrorBoundary to catch rendering errors gracefully.", line: 22 },
  { title: "Memoize route handler", body: "onNavigate is recreated on each render. Consider useCallback to prevent Sidebar re-renders.", line: 11 },
];

function FileTreeNode({
  node, depth, onOpen, activeId, expanded, toggle,
}: {
  node: FileNode; depth: number; onOpen: (n: FileNode) => void;
  activeId: string | null; expanded: Set<string>; toggle: (id: string) => void;
}) {
  const isOpen = expanded.has(node.id);
  const isActive = activeId === node.id;
  const indent = 8 + depth * 14;

  if (node.type === "folder") {
    return (
      <div>
        <button
          onClick={() => toggle(node.id)}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: `3px ${indent}px`, width: "100%",
            background: "transparent", border: "none", color: "#D1D5DB",
            fontSize: 12, cursor: "pointer", textAlign: "left",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          {isOpen ? <FolderOpen size={13} style={{ color: "#6366F1" }} /> : <Folder size={13} style={{ color: "#6366F1" }} />}
          <span>{node.name}</span>
        </button>
        {isOpen && node.children?.map((child) => (
          <FileTreeNode key={child.id} node={child} depth={depth + 1} onOpen={onOpen} activeId={activeId} expanded={expanded} toggle={toggle} />
        ))}
      </div>
    );
  }

  const statusColor = node.modified ? "#FBBF24" : node.added ? "#34D399" : null;
  return (
    <button
      onClick={() => onOpen(node)}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: `3px ${indent + 14}px`, width: "100%",
        background: isActive ? "rgba(99,102,241,0.14)" : "transparent",
        borderLeft: isActive ? "2px solid #6366F1" : "2px solid transparent",
        color: statusColor ?? "#D1D5DB",
        fontSize: 12, cursor: "pointer", textAlign: "left",
      }}
      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(99,102,241,0.06)"; }}
      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
    >
      <FileCode size={12} style={{ color: "#94A3B8" }} />
      <span style={{ flex: 1 }}>{node.name}</span>
      {statusColor && (
        <span style={{ fontSize: 10, color: statusColor, fontWeight: 600 }}>
          {node.modified ? "M" : "A"}
        </span>
      )}
    </button>
  );
}

export default function CodePage() {
  const [openTabs, setOpenTabs] = useState<OpenTab[]>([
    { id: "src/index.ts", name: "index.ts", language: "typescript" },
    { id: "src/components/App.tsx", name: "App.tsx", language: "tsx", dirty: true },
  ]);
  const [activeTab, setActiveTab] = useState<string>("src/components/App.tsx");
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(["src", "src/components", "src/hooks", "src/lib"])
  );
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [aiOpen, setAiOpen] = useState(true);
  const [gitOpen, setGitOpen] = useState(false);
  const [terminalLines, setTerminalLines] = useState(INITIAL_TERMINAL);
  const [cmd, setCmd] = useState("");

  function openFile(node: FileNode) {
    if (node.type !== "file") return;
    setActiveTab(node.id);
    setOpenTabs((prev) => {
      if (prev.find((t) => t.id === node.id)) return prev;
      return [...prev, { id: node.id, name: node.name, language: node.language ?? "text" }];
    });
  }

  function closeTab(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setOpenTabs((prev) => {
      const next = prev.filter((t) => t.id !== id);
      if (activeTab === id && next.length) setActiveTab(next[next.length - 1].id);
      return next;
    });
  }

  function toggleFolder(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function runCommand() {
    const trimmed = cmd.trim();
    if (!trimmed) return;
    if (trimmed === "clear") {
      setTerminalLines([]);
    } else {
      const newLines = [...terminalLines, { type: "sys", text: `omnimind@os ~/workspace $ ${trimmed}` }];
      if (trimmed.startsWith("ls")) {
        newLines.push({ type: "dim", text: "src/  public/  package.json  tsconfig.json  README.md" });
      } else if (trimmed.startsWith("npm") || trimmed.startsWith("pnpm")) {
        newLines.push({ type: "ok", text: " done in 412ms" });
      } else {
        newLines.push({ type: "dim", text: `command executed: ${trimmed}` });
      }
      setTerminalLines(newLines);
    }
    setCmd("");
  }

  function runProject() {
    setTerminalOpen(true);
    setTerminalLines((prev) => [
      ...prev,
      { type: "sys", text: "omnimind@os ~/workspace $ pnpm run build && pnpm start" },
      { type: "info", text: "> Building production bundle..." },
      { type: "ok", text: " Compiled successfully" },
      { type: "ok", text: " Type check passed" },
      { type: "ok", text: " Server started on :3000" },
    ]);
  }

  const activeContent = FILE_CONTENTS[activeTab] ?? "// File not found";
  const lines = activeContent.split("\n");
  const currentTab = openTabs.find((t) => t.id === activeTab);

  const gridCols = `260px 1fr ${aiOpen ? "320px" : gitOpen ? "280px" : "0px"}`;
  const gridRows = `36px 32px 1fr ${terminalOpen ? "220px" : "0px"} 24px`;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: gridCols,
        gridTemplateRows: gridRows,
        height: "100vh",
        background: "#0A0A0F",
        color: "#E5E7EB",
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: 13,
        overflow: "hidden",
      }}
    >
      {/* Top toolbar */}
      <div
        style={{
          gridColumn: "1 / 4",
          display: "flex", alignItems: "center", padding: "0 12px", gap: 4,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "linear-gradient(180deg, #0E0E16 0%, #0A0A0F 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 16 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
            display: "grid", placeItems: "center",
            boxShadow: "0 0 12px rgba(99,102,241,0.45)",
          }}>
            <Sparkles size={12} color="white" />
          </div>
          <span style={{ fontWeight: 600, letterSpacing: 0.2, fontSize: 13 }}>OmniMind Code</span>
        </div>

        <ToolbarButton icon={<Play size={13} />} label="Run" primary onClick={runProject} />
        <ToolbarButton icon={<Bug size={13} />} label="Debug" />
        <ToolbarButton
          icon={<GitBranch size={13} />} label="Git" active={gitOpen}
          onClick={() => { setGitOpen((v) => !v); if (!gitOpen) setAiOpen(false); }}
        />
        <ToolbarButton icon={<Package size={13} />} label="Extensions" />
        <ToolbarButton icon={<Search size={13} />} label="Search" />

        <div style={{ flex: 1 }} />

        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "4px 12px", borderRadius: 6,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          fontSize: 11, color: "#94A3B8",
        }}>
          <Search size={11} />
          <span>omnimind-os</span>
        </div>

        <ToolbarButton
          icon={<Sparkles size={13} />} label="AI" active={aiOpen}
          onClick={() => { setAiOpen((v) => !v); if (!aiOpen) setGitOpen(false); }}
        />
        <ToolbarButton icon={<Settings size={13} />} label="" />
      </div>

      {/* Tab bar */}
      <div style={{
        gridColumn: "2 / 3", gridRow: "2 / 3",
        display: "flex", alignItems: "stretch",
        background: "#0C0C14",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        overflowX: "auto",
      }}>
        {openTabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "0 12px",
                borderRight: "1px solid rgba(255,255,255,0.06)",
                background: isActive ? "#0A0A0F" : "transparent",
                borderTop: isActive ? "2px solid #6366F1" : "2px solid transparent",
                color: isActive ? "#FFFFFF" : "#94A3B8",
                cursor: "pointer", fontSize: 12, minWidth: 140,
              }}
            >
              <FileCode size={12} style={{ color: isActive ? "#6366F1" : "#64748B" }} />
              <span style={{ flex: 1 }}>{tab.name}</span>
              {tab.dirty && <Circle size={6} fill="#6366F1" color="#6366F1" />}
              <button
                onClick={(e) => closeTab(tab.id, e)}
                style={{
                  background: "transparent", border: "none",
                  color: "#64748B", cursor: "pointer", padding: 2,
                  borderRadius: 3, display: "grid", placeItems: "center",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
        <div style={{ flex: 1 }} />
      </div>

      {/* File tree */}
      <div style={{
        gridColumn: "1 / 2", gridRow: "2 / 5",
        background: "#07070B",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        overflowY: "auto",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{
          padding: "10px 12px", display: "flex",
          alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, color: "#64748B", textTransform: "uppercase" }}>
            Explorer
          </span>
          <div style={{ display: "flex", gap: 2 }}>
            <IconMini icon={<Plus size={12} />} />
            <IconMini icon={<MoreHorizontal size={12} />} />
          </div>
        </div>
        <div style={{
          padding: "6px 8px 4px",
          fontSize: 10, fontWeight: 600, color: "#94A3B8",
          textTransform: "uppercase", letterSpacing: 0.8,
        }}>
          OmniMind OS
        </div>
        <div style={{ flex: 1, paddingBottom: 12 }}>
          {PROJECT_TREE.map((node) => (
            <FileTreeNode
              key={node.id} node={node} depth={0}
              onOpen={openFile} activeId={activeTab}
              expanded={expanded} toggle={toggleFolder}
            />
          ))}
        </div>
      </div>

      {/* Editor */}
      <div style={{
        gridColumn: "2 / 3", gridRow: "3 / 4",
        background: "#0A0A0F", overflow: "auto",
        display: "flex",
      }}>
        <div style={{
          padding: "12px 8px 12px 12px", textAlign: "right",
          color: "#3F3F52",
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: 12, lineHeight: "21px", userSelect: "none",
          borderRight: "1px solid rgba(255,255,255,0.04)",
          minWidth: 48,
        }}>
          {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
        </div>
        <div style={{
          flex: 1, padding: "12px 20px",
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: 12.5, lineHeight: "21px", overflowX: "auto",
        }}>
          {lines.map((line, i) => highlightLine(line, `${activeTab}-${i}`))}
        </div>
      </div>

      {/* Right panel */}
      {(aiOpen || gitOpen) && (
        <div style={{
          gridColumn: "3 / 4", gridRow: "2 / 5",
          background: "#07070B",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          overflowY: "auto",
          display: "flex", flexDirection: "column",
        }}>
          {aiOpen && <AIPanel />}
          {gitOpen && <GitPanel />}
        </div>
      )}

      {/* Terminal */}
      {terminalOpen && (
        <div style={{
          gridColumn: "2 / 3", gridRow: "4 / 5",
          background: "#050508",
          borderTop: "1px solid rgba(99,102,241,0.18)",
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}>
          <div style={{
            display: "flex", alignItems: "center",
            padding: "6px 12px",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            gap: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#6366F1", fontSize: 11, fontWeight: 600 }}>
              <TerminalIcon size={12} />
              <span style={{ textTransform: "uppercase", letterSpacing: 1 }}>Terminal</span>
            </div>
            <span style={{ color: "#64748B", fontSize: 11 }}>bash - omnimind@os</span>
            <div style={{ flex: 1 }} />
            <button
              onClick={() => setTerminalOpen(false)}
              style={{ background: "transparent", border: "none", color: "#64748B", cursor: "pointer", padding: 2 }}
            >
              <X size={13} />
            </button>
          </div>
          <div style={{
            flex: 1, padding: "10px 14px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12, lineHeight: 1.6, overflowY: "auto",
          }}>
            {terminalLines.map((l, i) => (
              <div
                key={i}
                style={{
                  color:
                    l.type === "sys" ? "#6366F1"
                    : l.type === "ok" ? "#34D399"
                    : l.type === "info" ? "#E5E7EB"
                    : "#64748B",
                  whiteSpace: "pre-wrap",
                }}
              >
                {l.text}
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <span style={{ color: "#6366F1" }}>omnimind@os ~/workspace $</span>
              <input
                value={cmd}
                onChange={(e) => setCmd(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") runCommand(); }}
                placeholder="type a command..."
                style={{
                  flex: 1, background: "transparent", border: "none",
                  outline: "none", color: "#E5E7EB",
                  fontFamily: "inherit", fontSize: 12,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Status bar */}
      <div style={{
        gridColumn: "1 / 4", gridRow: "5 / 6",
        display: "flex", alignItems: "center",
        padding: "0 10px",
        background: "linear-gradient(90deg, #6366F1 0%, #4F46E5 100%)",
        color: "white", fontSize: 11, gap: 12,
      }}>
        <StatusItem icon={<GitBranch size={11} />} label="main" />
        <StatusItem icon={<GitCommit size={11} />} label="2 ahead" />
        <StatusItem icon={<AlertCircle size={11} />} label="0" />
        <StatusItem icon={<AlertTriangle size={11} />} label="3" />
        <div style={{ flex: 1 }} />
        <StatusItem label={currentTab?.language === "tsx" ? "TypeScript React" : currentTab?.language === "ts" ? "TypeScript" : currentTab?.language ?? "text"} />
        <StatusItem label="UTF-8" />
        <StatusItem label="LF" />
        <StatusItem label="Spaces: 2" />
        <StatusItem icon={<Zap size={11} />} label="OmniMind AI" />
        <StatusItem icon={<Bell size={11} />} label="" />
        <StatusItem icon={<Wifi size={11} />} label="" />
      </div>

      {!terminalOpen && (
        <button
          onClick={() => setTerminalOpen(true)}
          style={{
            position: "fixed", bottom: 32, right: 16,
            padding: "6px 12px", borderRadius: 20,
            background: "#6366F1", color: "white", border: "none",
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 11, cursor: "pointer",
            boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
          }}
        >
          <TerminalIcon size={12} /> Open Terminal
        </button>
      )}
    </div>
  );
}

function ToolbarButton({
  icon, label, primary, active, onClick,
}: {
  icon: React.ReactNode; label: string;
  primary?: boolean; active?: boolean; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: label ? "5px 10px" : "5px 7px",
        borderRadius: 6,
        background: primary
          ? "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)"
          : active ? "rgba(99,102,241,0.16)" : "transparent",
        border: active ? "1px solid rgba(99,102,241,0.4)" : "1px solid transparent",
        color: primary ? "white" : active ? "#A5B4FC" : "#CBD5E1",
        cursor: "pointer", fontSize: 12, fontWeight: 500,
        boxShadow: primary ? "0 2px 10px rgba(99,102,241,0.35)" : "none",
        transition: "all 120ms",
      }}
      onMouseEnter={(e) => { if (!primary && !active) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
      onMouseLeave={(e) => { if (!primary && !active) e.currentTarget.style.background = "transparent"; }}
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
}

function IconMini({ icon }: { icon: React.ReactNode }) {
  return (
    <button
      style={{
        background: "transparent", border: "none",
        color: "#64748B", cursor: "pointer",
        padding: 4, borderRadius: 4,
        display: "grid", placeItems: "center",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {icon}
    </button>
  );
}

function StatusItem({ icon, label }: { icon?: React.ReactNode; label: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 4,
      padding: "0 6px", height: "100%", cursor: "pointer",
    }}>
      {icon}
      {label && <span>{label}</span>}
    </div>
  );
}

function AIPanel() {
  const [input, setInput] = useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      <div style={{
        padding: "12px 14px",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <div style={{
          width: 24, height: 24, borderRadius: 6,
          background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
          display: "grid", placeItems: "center",
          boxShadow: "0 0 10px rgba(99,102,241,0.5)",
        }}>
          <Sparkles size={13} color="white" />
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#FFFFFF" }}>OmniMind AI</div>
          <div style={{ fontSize: 10, color: "#64748B" }}>Code assistant - online</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: 1.2,
          color: "#64748B", textTransform: "uppercase", marginBottom: 10,
        }}>
          Suggestions
        </div>
        {AI_SUGGESTIONS.map((s, i) => (
          <div key={i} style={{
            padding: 12, marginBottom: 10, borderRadius: 10,
            background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))",
            border: "1px solid rgba(99,102,241,0.15)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <Zap size={11} color="#A5B4FC" />
              <span style={{ fontSize: 10, color: "#A5B4FC", fontWeight: 600 }}>Line {s.line}</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#E5E7EB", marginBottom: 4 }}>{s.title}</div>
            <div style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.5 }}>{s.body}</div>
            <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
              <button style={{
                padding: "4px 10px", borderRadius: 6,
                background: "#6366F1", border: "none", color: "white",
                fontSize: 11, cursor: "pointer", fontWeight: 500,
              }}>Apply</button>
              <button style={{
                padding: "4px 10px", borderRadius: 6,
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#94A3B8", fontSize: 11, cursor: "pointer",
              }}>Dismiss</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        padding: 12,
        borderTop: "1px solid rgba(255,255,255,0.04)",
        display: "flex", gap: 6, alignItems: "center",
      }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask OmniMind anything..."
          style={{
            flex: 1, background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8, padding: "8px 10px",
            color: "#E5E7EB", fontSize: 12, outline: "none",
          }}
        />
        <button style={{
          padding: 8, borderRadius: 8, background: "#6366F1",
          border: "none", color: "white", cursor: "pointer",
          display: "grid", placeItems: "center",
        }}>
          <Send size={13} />
        </button>
      </div>
    </div>
  );
}

function GitPanel() {
  const statusColor = (s: "M" | "A" | "?") =>
    s === "M" ? "#FBBF24" : s === "A" ? "#34D399" : "#94A3B8";

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      <div style={{
        padding: "12px 14px",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <GitBranch size={14} color="#6366F1" />
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#FFFFFF" }}>Source Control</div>
          <div style={{ fontSize: 10, color: "#64748B" }}>main - 2 ahead</div>
        </div>
      </div>

      <div style={{ padding: 12 }}>
        <input
          placeholder="Commit message..."
          style={{
            width: "100%", background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 6, padding: "8px 10px",
            color: "#E5E7EB", fontSize: 12, outline: "none",
            marginBottom: 8,
          }}
        />
        <button style={{
          width: "100%", padding: "6px 10px", borderRadius: 6,
          background: "linear-gradient(135deg, #6366F1, #4F46E5)",
          border: "none", color: "white",
          fontSize: 12, fontWeight: 500, cursor: "pointer",
          display: "flex", alignItems: "center",
          justifyContent: "center", gap: 6,
        }}>
          <GitCommit size={12} /> Commit
        </button>
      </div>

      <div style={{ padding: "0 12px" }}>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: 1.2,
          color: "#64748B", textTransform: "uppercase", marginBottom: 8,
        }}>
          Changes ({GIT_CHANGES.length})
        </div>
        {GIT_CHANGES.map((c) => (
          <div
            key={c.path}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "6px 8px", borderRadius: 6,
              fontSize: 12, cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <FileCode size={12} color="#64748B" />
            <span style={{ flex: 1, color: "#CBD5E1" }}>{c.path}</span>
            <span style={{ color: statusColor(c.status), fontWeight: 700, fontSize: 11 }}>{c.status}</span>
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      <div style={{
        padding: 12,
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: 1.2,
          color: "#64748B", textTransform: "uppercase", marginBottom: 8,
        }}>
          Pull Requests
        </div>
        <div style={{
          padding: 10, borderRadius: 8,
          background: "rgba(99,102,241,0.06)",
          border: "1px solid rgba(99,102,241,0.14)",
          display: "flex", gap: 8, alignItems: "flex-start",
        }}>
          <GitPullRequest size={13} color="#A5B4FC" style={{ marginTop: 2 }} />
          <div>
            <div style={{ fontSize: 12, color: "#E5E7EB", fontWeight: 500 }}>#142 Add AI code suggestions</div>
            <div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>opened 2 hours ago by you</div>
          </div>
        </div>
      </div>
    </div>
  );
}
