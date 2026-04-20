"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  Brain, Send, Plus, Paperclip, ChevronDown, Search, MessageSquare,
  Copy, ThumbsUp, ThumbsDown, Zap, X, Cpu, Layers, Timer, DollarSign,
  Code2, FileText, BarChart2, Database, Globe, Workflow, ChevronRight,
} from "lucide-react";

// Types
type Role = "user" | "assistant";

interface TraceStep { label: string; ms: number; }
interface Message {
  id: string;
  role: Role;
  content: string;
  block?:   { kind: "code" | "table"; content: string };
  sources?: string[];
  modelId?: string;
  trace?:   TraceStep[];
  toolsUsed?: string[];
}

interface RecentChat { id: string; title: string; time: string; active?: boolean; }
interface ContextPill { icon: string; label: string; }
interface ModelOption {
  id: string; label: string; provider: string;
  cost: number; speed: "fast" | "medium" | "slow"; badge: string;
}
interface Tool { id: string; label: string; icon: React.ReactNode; }

// Constants
const MAX_INPUT_ROWS = 6;
const STREAM_DELAY_MS = 1500;
const MEMORY_DELAY_MS = 800;
const TOKEN_BUDGET = 128_000;
const TOKENS_USED  = 4_821;
const SESSION_COST = 0.024;

const MODELS: ModelOption[] = [
  { id: "auto",         label: "Auto-select (OmniRouter)", provider: "OmniOS",    cost: 0,      speed: "fast",   badge: "Smart" },
  { id: "gpt-4o",       label: "GPT-4o",                   provider: "OpenAI",    cost: 0.005,  speed: "fast",   badge: "Cloud" },
  { id: "claude-sonnet",label: "Claude 3.5 Sonnet",        provider: "Anthropic", cost: 0.003,  speed: "fast",   badge: "Cloud" },
  { id: "gemini-pro",   label: "Gemini 1.5 Pro",           provider: "Google",    cost: 0.002,  speed: "medium", badge: "Cloud" },
  { id: "llama-70b",    label: "Llama 3.3 70B",            provider: "Local",     cost: 0,      speed: "medium", badge: "Local" },
];

const TOOLS: Tool[] = [
  { id: "web",      label: "Search web",     icon: <Globe size={11} /> },
  { id: "docs",     label: "Read documents", icon: <FileText size={11} /> },
  { id: "crm",      label: "Query CRM",      icon: <Database size={11} /> },
  { id: "code",     label: "Run code",       icon: <Code2 size={11} /> },
  { id: "workflow", label: "Create workflow",icon: <Workflow size={11} /> },
];

const SUGGESTED_PROMPTS = [
  "Summarize my pipeline from last week",
  "Draft a follow-up email for leads who went cold",
  "What's my projected revenue for Q2?",
  "Build a workflow to notify me when deals close",
];

const INITIAL_MESSAGES: Message[] = [
  { id: "m1", role: "user", content: "Summarize our Q2 roadmap and create tasks for engineering" },
  {
    id: "m2", role: "assistant", modelId: "claude-sonnet",
    content:
      "I analyzed **Q2 Product Roadmap** (14 pages) and cross-referenced the **Engineering Sprint** board. Here is the summary:\n\n" +
      "**Q2 Focus:** Ship OmniMind v1 streaming, land Kanban + Drag-and-Drop, launch CRM contacts, complete billing integration, and deploy Tauri desktop beta.\n\n" +
      "I have drafted 5 sprint tasks in **Engineering / In Progress** - ready for your review:",
    block: {
      kind: "code",
      content:
`// Tasks created in Projects -> Engineering Sprint
[
  { id: "ENG-142", title: "OmniMind streaming endpoint + SSE",   priority: "urgent", due: "Apr 24" },
  { id: "ENG-143", title: "Kanban drag-and-drop persistence",    priority: "high",   due: "Apr 25" },
  { id: "ENG-144", title: "CRM contacts list view + filters",    priority: "high",   due: "Apr 27" },
  { id: "ENG-145", title: "Stripe billing - subscription plans", priority: "medium", due: "May 02" },
  { id: "ENG-146", title: "Tauri desktop beta - macOS + Win",    priority: "medium", due: "May 06" },
]
// 5 tasks created - 0 conflicts - assigned to @engineering`,
    },
    sources: ["Q2 Roadmap", "Engineering Sprint", "OKRs - April 2026"],
    trace: [
      { label: "Memory search",       ms: 45 },
      { label: "Context assembly",    ms: 12 },
      { label: "Model inference",     ms: 1240 },
      { label: "Response formatting", ms: 8 },
    ],
    toolsUsed: ["docs", "workflow"],
  },
  { id: "m3", role: "user", content: "What deals are closing this week?" },
  {
    id: "m4", role: "assistant", modelId: "gpt-4o",
    content: "Pulled **3 deals** from CRM with `close_date <= Apr 25, 2026` and stage in *Proposal* or *Negotiation*. Total pipeline this week: **$312,000**.",
    block: {
      kind: "table",
      content:
`Deal              Stage         Amount     Close      Owner
----------------------------------------------------------------
Acme Corp         Negotiation   $140,000   Apr 22     K. Vikram
Northwind Ltd.    Proposal      $ 92,000   Apr 24     K. Vikram
Globex Systems    Negotiation   $ 80,000   Apr 25     K. Vikram
----------------------------------------------------------------
Total                          $312,000`,
    },
    sources: ["CRM - Deals", "Calendar - April 2026"],
    trace: [
      { label: "Memory search",       ms: 38 },
      { label: "Context assembly",    ms: 15 },
      { label: "Model inference",     ms: 980 },
      { label: "Response formatting", ms: 11 },
    ],
    toolsUsed: ["crm"],
  },
];

const RECENT_CHATS: RecentChat[] = [
  { id: "c1", title: "Q2 roadmap summary",          time: "now",        active: true },
  { id: "c2", title: "Draft Acme follow-up email",  time: "2h ago" },
  { id: "c3", title: "Onboarding flow review",      time: "Yesterday" },
  { id: "c4", title: "Refactor auth middleware",    time: "2 days ago" },
  { id: "c5", title: "April OKR check-in",          time: "Last week" },
];

const CONTEXT_PILLS: ContextPill[] = [
  { icon: "DOC", label: "Q2 Roadmap" },
  { icon: "SPR", label: "Engineering Sprint" },
  { icon: "CRM", label: "CRM - 3 deals" },
];

// Inline markdown -> React nodes
type InlineNode = string | { kind: "strong" | "em" | "code"; text: string };

function parseInline(text: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  const pattern = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    if (match[2] !== undefined) nodes.push({ kind: "strong", text: match[2] });
    else if (match[3] !== undefined) nodes.push({ kind: "em", text: match[3] });
    else if (match[4] !== undefined) nodes.push({ kind: "code", text: match[4] });
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function RichText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          {parseInline(line).map((node, j) => {
            if (typeof node === "string") return <span key={j}>{node}</span>;
            if (node.kind === "strong") return <strong key={j}>{node.text}</strong>;
            if (node.kind === "em") return <em key={j}>{node.text}</em>;
            return (
              <code key={j} style={{ fontFamily: "var(--mono-font)", fontSize: 12, background: "var(--shell-active)", padding: "1px 5px", borderRadius: 4 }}>
                {node.text}
              </code>
            );
          })}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

export default function MindPage() {
  const [messages, setMessages]      = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput]            = useState("");
  const [isTyping, setIsTyping]      = useState(false);
  const [memSearching, setMemSearch] = useState(false);
  const [selectedModel, setSelModel] = useState<string>(MODELS[0].id);
  const [modelOpen, setModelOpen]    = useState(false);
  const [chatSearch, setChatSearch]  = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 20 * MAX_INPUT_ROWS + 20)}px`;
  }, [input]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, memSearching]);

  const filteredChats = useMemo(() => {
    const q = chatSearch.trim().toLowerCase();
    return q ? RECENT_CHATS.filter((c) => c.title.toLowerCase().includes(q)) : RECENT_CHATS;
  }, [chatSearch]);

  const currentModel = MODELS.find((m) => m.id === selectedModel) ?? MODELS[0];
  const tokensPct    = Math.round((TOKENS_USED / TOKEN_BUDGET) * 100);

  function sendMessage(textOverride?: string) {
    const text = (textOverride ?? input).trim();
    if (!text || isTyping || memSearching) return;

    const userMsg: Message = { id: `u${Date.now()}`, role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setMemSearch(true);

    window.setTimeout(() => {
      setMemSearch(false);
      setIsTyping(true);

      window.setTimeout(() => {
        const reply: Message = {
          id: `a${Date.now()}`,
          role: "assistant",
          modelId: selectedModel === "auto" ? "claude-sonnet" : selectedModel,
          content:
            `Got it. Analyzing **"${text.slice(0, 80)}"** across your workspace (docs, tasks, CRM, calendar).\n\n` +
            "Here is what I found - let me know if you want me to take an action, draft a doc, or create tasks:",
          sources: ["Workspace index", "Recent activity"],
          trace: [
            { label: "Memory search",       ms: 42 },
            { label: "Context assembly",    ms: 14 },
            { label: "Model inference",     ms: 1180 },
            { label: "Response formatting", ms: 9 },
          ],
          toolsUsed: ["docs", "web"],
        };
        setMessages((prev) => [...prev, reply]);
        setIsTyping(false);
      }, STREAM_DELAY_MS);
    }, MEMORY_DELAY_MS);
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); sendMessage(); }
    else if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  function newChat() { setMessages([]); setInput(""); inputRef.current?.focus(); }

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
  const activeTools   = lastAssistant?.toolsUsed ?? [];
  const showSuggested = messages.length <= 1 && !isTyping;

  return (
    <div className="omni-page" style={{ display: "flex", flexDirection: "row", overflow: "hidden" }}>
      {/* LEFT: chats */}
      <aside style={{ width: 220, flexShrink: 0, borderRight: "1px solid var(--shell-border)", background: "var(--sidebar-bg)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "12px 12px 10px" }}>
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={newChat}>
            <Plus size={14} /> New Chat
          </button>
        </div>
        <div style={{ padding: "0 12px 10px", position: "relative" }}>
          <Search size={12} style={{ position: "absolute", top: "50%", left: 22, transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
          <input className="input" style={{ paddingLeft: 28, height: 30, fontSize: 12 }} placeholder="Search chats..." value={chatSearch} onChange={(e) => setChatSearch(e.target.value)} />
        </div>
        <SectionLabel>Recent</SectionLabel>
        <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 12px" }}>
          {filteredChats.map((c) => (
            <button
              key={c.id} type="button"
              style={{
                display: "flex", alignItems: "center", gap: 8, width: "100%",
                padding: "8px 10px", borderRadius: 8, border: "none",
                background: c.active ? "var(--shell-active)" : "transparent",
                color: c.active ? "var(--text-primary)" : "var(--text-secondary)",
                cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                fontSize: 12.5, marginBottom: 2,
              }}
              onMouseEnter={(e) => { if (!c.active) (e.currentTarget as HTMLElement).style.background = "var(--shell-hover)"; }}
              onMouseLeave={(e) => { if (!c.active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <MessageSquare size={12} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</span>
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{c.time}</span>
            </button>
          ))}
          {filteredChats.length === 0 && (
            <div style={{ padding: "12px 10px", fontSize: 12, color: "var(--text-muted)" }}>No chats match your search.</div>
          )}
        </div>
      </aside>

      {/* CENTER */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <div className="omni-page__header">
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "var(--accent-subtle)", border: "1px solid var(--accent-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Brain size={16} style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <div className="omni-page__title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              OmniMind
              <span className="badge badge-accent" style={{ fontSize: 10, display: "flex", alignItems: "center", gap: 4 }}>
                <Zap size={10} /> {currentModel.label}
              </span>
            </div>
            <div className="omni-page__subtitle">AI with full workspace context</div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px 16px", display: "flex", flexDirection: "column", gap: 18 }}>
          {messages.length === 0 && !isTyping && !memSearching && (
            <div style={{ maxWidth: 520, margin: "60px auto 0", textAlign: "center", color: "var(--text-secondary)" }}>
              <div style={{ marginBottom: 16 }}><Brain size={42} style={{ color: "var(--accent)" }} /></div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>OmniMind is ready</div>
              <div style={{ fontSize: 13, lineHeight: 1.6 }}>I know every doc, task, deal, and email in your workspace. Ask anything.</div>
            </div>
          )}

          {messages.map((msg) => <MessageRow key={msg.id} message={msg} />)}
          {memSearching && <MemorySearching />}
          {isTyping && <TypingIndicator />}

          {showSuggested && (
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8, maxWidth: 760, alignSelf: "center", width: "100%" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Try asking</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                {SUGGESTED_PROMPTS.map((p) => (
                  <button
                    key={p} type="button" onClick={() => sendMessage(p)}
                    style={{
                      textAlign: "left", padding: "10px 12px", borderRadius: 10,
                      background: "var(--panel-bg)", border: "1px solid var(--panel-border)",
                      color: "var(--text-secondary)", fontFamily: "inherit", fontSize: 12.5,
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--shell-hover)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--panel-bg)"; }}
                  >
                    <ChevronRight size={12} style={{ color: "var(--accent)", flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{p}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {CONTEXT_PILLS.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: "6px 28px 0" }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", alignSelf: "center" }}>Context</span>
            {CONTEXT_PILLS.map((p) => (
              <span key={p.label} className="badge badge-default" style={{ display: "inline-flex", alignItems: "center", gap: 5, paddingRight: 4 }}>
                <span style={{ fontFamily: "var(--mono-font)", fontSize: 9 }}>{p.icon}</span>
                {p.label}
                <button type="button" aria-label={`Remove ${p.label}`} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0, display: "flex", alignItems: "center" }}>
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        )}

        <div style={{ padding: "12px 28px 8px" }}>
          <div style={{ background: "var(--panel-bg)", border: "1px solid var(--panel-border)", borderRadius: 14, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
            <textarea
              ref={inputRef} rows={1} value={input}
              onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey}
              placeholder="Ask OmniMind anything about your workspace... (Cmd+Enter to send)"
              style={{ width: "100%", background: "transparent", border: "none", outline: "none", resize: "none", color: "var(--text-primary)", fontFamily: "inherit", fontSize: 14, lineHeight: 1.5, minHeight: 24, maxHeight: 140, padding: 4 }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button type="button" className="btn btn-ghost btn-sm" title="Attach workspace context" style={{ gap: 6 }}>
                <Paperclip size={12} /> Attach context
              </button>

              <div style={{ position: "relative" }}>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setModelOpen((v) => !v)} style={{ gap: 6 }}>
                  <Cpu size={11} style={{ color: currentModel.badge === "Local" ? "var(--green)" : "var(--accent)" }} />
                  {currentModel.label}
                  <ChevronDown size={11} />
                </button>
                {modelOpen && (
                  <div style={{ position: "absolute", bottom: "calc(100% + 6px)", left: 0, background: "var(--shell-surface)", border: "1px solid var(--panel-border)", borderRadius: 10, padding: 4, minWidth: 320, boxShadow: "var(--shadow-md)", zIndex: 50 }}>
                    {MODELS.map((m) => (
                      <button
                        key={m.id} type="button"
                        onClick={() => { setSelModel(m.id); setModelOpen(false); }}
                        style={{
                          display: "flex", alignItems: "center", gap: 8, width: "100%",
                          padding: "8px 10px", borderRadius: 7,
                          background: m.id === selectedModel ? "var(--shell-hover)" : "transparent",
                          border: "none", color: "var(--text-primary)", fontFamily: "inherit",
                          fontSize: 12.5, cursor: "pointer", textAlign: "left",
                        }}
                      >
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: m.badge === "Local" ? "var(--green)" : "var(--accent)" }} />
                        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                          <span>{m.label}</span>
                          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                            {m.provider} - ${m.cost.toFixed(3)}/1k - {m.speed}
                          </span>
                        </div>
                        <span className="badge badge-default" style={{ fontSize: 9 }}>{m.badge}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--mono-font)" }}>Cmd + Enter</span>
                <button
                  type="button" className="btn btn-primary"
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isTyping || memSearching}
                  style={{ minWidth: 68, justifyContent: "center" }} aria-label="Send message"
                >
                  {isTyping ? <span className="spinner" /> : (<><Send size={13} /> Send</>)}
                </button>
              </div>
            </div>
          </div>

          {/* Footer: token + cost tracker */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 4px 0", fontSize: 11, color: "var(--text-muted)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Zap size={11} /> <span style={{ fontFamily: "var(--mono-font)" }}>{TOKENS_USED.toLocaleString()}</span> tokens
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <DollarSign size={11} /> <span style={{ fontFamily: "var(--mono-font)" }}>${SESSION_COST.toFixed(3)}</span>
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
              <span>Context {tokensPct}%</span>
              <div style={{ width: 80, height: 4, background: "var(--shell-border)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ width: `${tokensPct}%`, height: "100%", background: tokensPct > 85 ? "var(--red)" : "var(--accent)", transition: "width 0.5s var(--ease-out)" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: memory + tools */}
      <aside style={{ width: 240, flexShrink: 0, borderLeft: "1px solid var(--shell-border)", background: "var(--sidebar-bg)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <SectionLabel>Memory</SectionLabel>
        <div style={{ padding: "0 12px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
          <MemoryCard color="var(--green)" icon={<Layers size={12} />} title="Working memory" detail="Current conversation context" />
          <MemoryCard color="#f59e0b" icon={<Brain size={12} />} title="Episodic memory" detail="3 memories recalled" />
          <MemoryCard color="var(--accent)" icon={<Database size={12} />} title="Semantic memory" detail="247 facts indexed" />
        </div>

        <SectionLabel>Agent tools</SectionLabel>
        <div style={{ padding: "0 12px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {TOOLS.map((t) => {
            const active = activeTools.includes(t.id);
            return (
              <div
                key={t.id}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "7px 10px", borderRadius: 8,
                  background: active ? "var(--accent-subtle)" : "transparent",
                  border: `1px solid ${active ? "var(--accent-border)" : "transparent"}`,
                  fontSize: 12, color: active ? "var(--accent)" : "var(--text-secondary)",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", color: active ? "var(--accent)" : "var(--text-muted)" }}>{t.icon}</span>
                <span style={{ flex: 1 }}>{t.label}</span>
                {active && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent)" }} />}
              </div>
            );
          })}
        </div>

        <SectionLabel>Session</SectionLabel>
        <div style={{ padding: "0 12px 16px", display: "flex", flexDirection: "column", gap: 6, fontSize: 11, color: "var(--text-secondary)" }}>
          <Stat icon={<BarChart2 size={11} />} label="Messages" value={String(messages.length)} />
          <Stat icon={<Timer size={11} />} label="Avg latency" value="1.3s" />
          <Stat icon={<DollarSign size={11} />} label="Spent" value={`$${SESSION_COST.toFixed(3)}`} />
        </div>
      </aside>
    </div>
  );
}

// --- Subcomponents ---

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", padding: "10px 16px 6px" }}>
      {children}
    </div>
  );
}

function MemoryCard({ color, icon, title, detail }: { color: string; icon: React.ReactNode; title: string; detail: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 9, background: "var(--panel-bg)", border: "1px solid var(--panel-border)" }}>
      <div style={{ position: "relative", width: 20, height: 20, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--shell-active)", color }}>
        {icon}
        <span style={{ position: "absolute", top: -2, right: -2, width: 7, height: 7, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}` }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>{title}</div>
        <div style={{ fontSize: 10.5, color: "var(--text-muted)" }}>{detail}</div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ display: "flex", color: "var(--text-muted)" }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      <span style={{ fontFamily: "var(--mono-font)", color: "var(--text-primary)" }}>{value}</span>
    </div>
  );
}

function MessageRow({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const [traceOpen, setTraceOpen] = useState(false);
  const model = MODELS.find((m) => m.id === message.modelId);

  return (
    <div style={{ display: "flex", flexDirection: isUser ? "row-reverse" : "row", gap: 12, alignItems: "flex-start", alignSelf: isUser ? "flex-end" : "flex-start", maxWidth: 760, width: "100%" }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600,
        background: isUser ? "linear-gradient(135deg, var(--accent), oklch(55% 0.22 275))" : "var(--accent-subtle)",
        border: isUser ? "none" : "1px solid var(--accent-border)",
        color: isUser ? "white" : "var(--accent)",
      }}>
        {isUser ? "K" : <Brain size={14} />}
      </div>

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{
          alignSelf: isUser ? "flex-end" : "flex-start", padding: "10px 14px", borderRadius: 12,
          fontSize: 13.5, lineHeight: 1.6, maxWidth: "100%",
          background: isUser ? "linear-gradient(135deg, var(--accent), oklch(56% 0.22 270))" : "var(--panel-bg)",
          color: isUser ? "white" : "var(--text-primary)",
          border: isUser ? "none" : "1px solid var(--panel-border)",
          boxShadow: isUser ? "0 2px 12px oklch(63% 0.22 265 / 0.25)" : "none",
          wordWrap: "break-word",
        }}>
          {!isUser && model && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, color: "var(--text-muted)", padding: "2px 6px", borderRadius: 5, background: "var(--shell-active)", marginBottom: 6 }}>
              <Cpu size={9} /> {model.label}
            </div>
          )}
          <RichText text={message.content} />
        </div>

        {message.block && (
          <pre style={{
            alignSelf: isUser ? "flex-end" : "flex-start", maxWidth: "100%",
            fontFamily: "var(--mono-font)", fontSize: 11.5, lineHeight: 1.55,
            background: "var(--shell-bg)", border: "1px solid var(--panel-border)",
            borderRadius: 10, padding: "12px 14px", color: "var(--text-primary)",
            overflowX: "auto", whiteSpace: "pre", margin: 0,
          }}>
            <code>{message.block.content}</code>
          </pre>
        )}

        {!isUser && message.trace && message.trace.length > 0 && (
          <div style={{ alignSelf: "flex-start", maxWidth: "100%", width: "100%" }}>
            <button
              type="button" onClick={() => setTraceOpen((v) => !v)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 8px",
                background: "transparent", border: "1px solid var(--panel-border)",
                borderRadius: 6, color: "var(--text-muted)", fontSize: 10.5,
                fontFamily: "inherit", cursor: "pointer",
              }}
            >
              <Timer size={10} />
              Execution trace - {message.trace.reduce((s, t) => s + t.ms, 0)}ms
              <ChevronDown size={10} style={{ transform: traceOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </button>
            {traceOpen && <TraceView steps={message.trace} />}
          </div>
        )}

        {!isUser && message.sources && message.sources.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, color: "var(--text-muted)" }}>Sources:</span>
            {message.sources.map((s) => (
              <span key={s} className="badge badge-default" style={{ fontSize: 10 }}>{s}</span>
            ))}
            <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
              <button className="btn btn-ghost btn-icon btn-sm" title="Copy" style={{ width: 24, height: 24 }}><Copy size={11} /></button>
              <button className="btn btn-ghost btn-icon btn-sm" title="Good" style={{ width: 24, height: 24 }}><ThumbsUp size={11} /></button>
              <button className="btn btn-ghost btn-icon btn-sm" title="Bad" style={{ width: 24, height: 24 }}><ThumbsDown size={11} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TraceView({ steps }: { steps: TraceStep[] }) {
  const total = steps.reduce((s, t) => s + t.ms, 0);
  return (
    <div style={{ marginTop: 6, padding: "10px 12px", borderRadius: 8, background: "var(--shell-bg)", border: "1px solid var(--panel-border)", display: "flex", flexDirection: "column", gap: 6 }}>
      {steps.map((step, i) => {
        const pct = (step.ms / total) * 100;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11 }}>
            <span style={{ width: 18, fontFamily: "var(--mono-font)", color: "var(--text-muted)" }}>{i + 1}.</span>
            <span style={{ width: 130, color: "var(--text-secondary)" }}>{step.label}</span>
            <div style={{ flex: 1, height: 5, background: "var(--shell-active)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: "var(--accent)", borderRadius: 99 }} />
            </div>
            <span style={{ width: 60, textAlign: "right", fontFamily: "var(--mono-font)", color: "var(--text-primary)" }}>{step.ms}ms</span>
          </div>
        );
      })}
      <div style={{ borderTop: "1px solid var(--panel-border)", paddingTop: 5, marginTop: 2, display: "flex", justifyContent: "space-between", fontSize: 11 }}>
        <span style={{ color: "var(--text-muted)" }}>Total</span>
        <span style={{ fontFamily: "var(--mono-font)", color: "var(--accent)", fontWeight: 600 }}>{total}ms</span>
      </div>
    </div>
  );
}

function MemorySearching() {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", alignSelf: "flex-start", maxWidth: 760, padding: "8px 14px", borderRadius: 10, background: "var(--panel-bg)", border: "1px dashed var(--panel-border)", color: "var(--text-secondary)", fontSize: 12 }}>
      <Search size={13} style={{ color: "var(--accent)" }} />
      <span>Searching memory...</span>
      <span style={pulseDot()} />
      <span style={pulseDot(0.2)} />
      <span style={pulseDot(0.4)} />
      <style jsx>{`
        @keyframes mem-pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}

function pulseDot(delay = 0): React.CSSProperties {
  return { width: 5, height: 5, borderRadius: "50%", background: "var(--accent)", display: "inline-block", animation: `mem-pulse 1.2s ${delay}s infinite` };
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", alignSelf: "flex-start", maxWidth: 760 }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--accent-subtle)", border: "1px solid var(--accent-border)", color: "var(--accent)" }}>
        <Brain size={14} />
      </div>
      <div style={{ padding: "12px 16px", borderRadius: 12, background: "var(--panel-bg)", border: "1px solid var(--panel-border)", display: "flex", alignItems: "center", gap: 5 }}>
        <span style={dotStyle(0)} /><span style={dotStyle(1)} /><span style={dotStyle(2)} />
      </div>
      <style jsx>{`
        @keyframes omni-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
          40%           { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function dotStyle(index: number): React.CSSProperties {
  return { width: 6, height: 6, borderRadius: "50%", background: "var(--text-secondary)", display: "inline-block", animation: `omni-bounce 1.2s ${index * 0.15}s infinite var(--ease-in-out)` };
}
