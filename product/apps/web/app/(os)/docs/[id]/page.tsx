"use client";

import {
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Link2,
  Image as ImageIcon,
  Sparkles,
  Zap,
  Check,
  Loader2,
  PanelRightOpen,
  PanelRightClose,
  Smile,
  Star,
  MoreHorizontal,
  Share2,
  Clock,
  User as UserIcon,
  Tag as TagIcon,
  Hash,
  Undo2,
  Redo2,
} from "lucide-react";

/* ── Mock data (mirrors docs list, author-controlled only) ───────────────── */

interface MockDoc {
  id: string;
  title: string;
  icon: string;
  tags: string[];
  starred: boolean;
  owner: string;
  createdAt: string;
  updatedAt: string;
  body: string;
}

const MOCK_DOCS: Record<string, MockDoc> = {
  "1": {
    id: "1",
    title: "Q2 Product Roadmap",
    icon: "\u{1F5FA}\u{FE0F}",
    tags: ["roadmap", "product"],
    starred: true,
    owner: "Kartikeya",
    createdAt: "Apr 1, 2026",
    updatedAt: "2 min ago",
    body: `<h1>Q2 Product Roadmap</h1><p>Goals for April\u2013June 2026. This quarter we focus on three strategic bets: <strong>OmniMind v2</strong>, the <strong>mobile app beta</strong>, and the <strong>enterprise tier</strong>.</p><h2>Themes</h2><ul><li>Cross-surface intelligence \u2014 the OS learns from every doc, task, and message.</li><li>Speed as a feature \u2014 sub-50ms navigation, instant everything.</li><li>Trust &amp; control \u2014 SOC 2, fine-grained permissions, audit logs.</li></ul><h2>Key milestones</h2><p>OmniMind v2 GA in week 6. Mobile beta rolls out to 500 design partners in week 8. Enterprise tier announced at the Q2 customer summit.</p><blockquote>\u201CThe best OS is the one that disappears.\u201D</blockquote>`,
  },
  "2": {
    id: "2",
    title: "Engineering Spec: OmniMind Context Engine",
    icon: "\u{1F9E0}",
    tags: ["engineering", "ai"],
    starred: true,
    owner: "Priya",
    createdAt: "Mar 18, 2026",
    updatedAt: "1 hour ago",
    body: `<h1>Engineering Spec: OmniMind Context Engine</h1><p>Technical architecture for the cross-surface AI context layer. Covers the embedding pipeline, vector search, retrieval, and inference orchestration.</p><h2>Architecture overview</h2><p>The context engine runs as a sidecar to every OmniOS surface. Events stream into Kafka, are embedded by a worker pool, and indexed into a hybrid store (pgvector + Redis).</p><h3>Embedding pipeline</h3><p>We use <code>text-embedding-3-large</code> for documents, with fallbacks to Cohere for high-volume event streams. Dimension: 3072.</p>`,
  },
  "3": {
    id: "3",
    title: "Sales Playbook v3",
    icon: "\u{1F4BC}",
    tags: ["sales"],
    starred: false,
    owner: "Marcus",
    createdAt: "Feb 20, 2026",
    updatedAt: "Yesterday",
    body: `<h1>Sales Playbook v3</h1><p>Updated discovery questions, objection handling, and demo flow for enterprise prospects.</p><h2>Discovery framework</h2><ul><li>What tools does your team currently stitch together?</li><li>How much time per week is lost to context switching?</li><li>Who owns knowledge in your organization today?</li></ul>`,
  },
  "4": {
    id: "4",
    title: "OKRs \u2014 April 2026",
    icon: "\u{1F3AF}",
    tags: ["okrs", "strategy"],
    starred: false,
    owner: "Kartikeya",
    createdAt: "Apr 1, 2026",
    updatedAt: "2 days ago",
    body: `<h1>OKRs \u2014 April 2026</h1><p>Company objectives and key results for Q2. Focus areas: retention, ARR growth, team expansion.</p><h2>O1. Make OmniOS sticky</h2><ul><li>KR1: WAU/MAU \u2265 70%</li><li>KR2: 4+ surfaces used per active team</li><li>KR3: Net retention \u2265 115%</li></ul>`,
  },
  "5": {
    id: "5",
    title: "Onboarding Guide v2",
    icon: "\u{1F680}",
    tags: ["hr", "onboarding"],
    starred: false,
    owner: "Lena",
    createdAt: "Jan 10, 2026",
    updatedAt: "3 days ago",
    body: `<h1>Onboarding Guide v2</h1><p>Step-by-step guide for new team members. Covers tooling setup, coding standards, and deployment workflow.</p><h2>Day 1</h2><ul><li>Laptop + accounts provisioned</li><li>1:1 with your manager</li><li>Read the Bible (company handbook)</li></ul>`,
  },
  "6": {
    id: "6",
    title: "Privacy Policy \u2014 GDPR Update",
    icon: "\u{1F512}",
    tags: ["legal", "compliance"],
    starred: false,
    owner: "Daniel",
    createdAt: "Dec 4, 2025",
    updatedAt: "1 week ago",
    body: `<h1>Privacy Policy \u2014 GDPR Update</h1><p>Revised privacy policy reflecting new GDPR requirements, data retention rules, and DPA amendments.</p>`,
  },
};

const EMOJI_PICKS = [
  "\u{1F4C4}", "\u{1F5FA}\u{FE0F}", "\u{1F9E0}", "\u{1F4BC}",
  "\u{1F3AF}", "\u{1F680}", "\u{1F512}", "\u2728",
  "\u{1F6E0}\u{FE0F}", "\u{1F4CA}", "\u{1F9EA}", "\u{1F4DD}",
  "\u{1F525}", "\u26A1", "\u{1F331}", "\u{1F9ED}",
];

const TAG_COLORS: Record<string, string> = {
  roadmap: "badge-blue",
  product: "badge-purple",
  engineering: "badge-accent",
  ai: "badge-purple",
  sales: "badge-green",
  okrs: "badge-orange",
  strategy: "badge-orange",
  hr: "badge-yellow",
  onboarding: "badge-yellow",
  legal: "badge-red",
  compliance: "badge-red",
};

/* ── Constants ────────────────────────────────────────────────────────────── */

const AUTOSAVE_DELAY_MS = 2000;
const SAVED_INDICATOR_MS = 1800;
const SPRINT_GEN_DELAY_MS = 2000;
const TOAST_VISIBLE_MS = 4500;

type SaveState = "idle" | "saving" | "saved";

/* ── Toolbar helpers ──────────────────────────────────────────────────────── */

interface ToolbarButtonProps {
  onClick: () => void;
  title: string;
  active?: boolean;
  children: ReactNode;
}

function ToolbarButton({ onClick, title, active, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      className={`editor-toolbar__btn${active ? " active" : ""}`}
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
      title={title}
      aria-label={title}
    >
      {children}
    </button>
  );
}

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DocEditorPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const docId = resolvedParams.id;
  const isNew = docId === "new";

  const seed = useMemo<MockDoc>(() => {
    if (!isNew && MOCK_DOCS[docId]) return MOCK_DOCS[docId];
    return {
      id: isNew ? "new" : docId,
      title: "",
      icon: "\u{1F4C4}",
      tags: [],
      starred: false,
      owner: "You",
      createdAt: "Just now",
      updatedAt: "Just now",
      body: "",
    };
  }, [docId, isNew]);

  const [title, setTitle] = useState<string>(seed.title);
  const [icon, setIcon] = useState<string>(seed.icon);
  const [tags, setTags] = useState<string[]>(seed.tags);
  const [starred, setStarred] = useState<boolean>(seed.starred);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [wordCount, setWordCount] = useState<number>(0);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [newTag, setNewTag] = useState("");

  const editorRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const emojiRef = useRef<HTMLDivElement | null>(null);

  // Seed editor content once on mount from static MOCK_DOCS (no user input).
  useEffect(() => {
    const el = editorRef.current;
    if (el && el.innerHTML === "") {
      // seed.body originates from the static MOCK_DOCS constant in this file.
      el.innerHTML = seed.body;
      setWordCount(countWords(el.innerText));
    }
    if (isNew && titleRef.current) {
      titleRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
      if (savedTimer.current) clearTimeout(savedTimer.current);
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!emojiOpen) return;
    function handleClick(e: MouseEvent) {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setEmojiOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [emojiOpen]);

  function scheduleAutosave() {
    setSaveState("saving");
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    if (savedTimer.current) clearTimeout(savedTimer.current);

    autosaveTimer.current = setTimeout(() => {
      setSaveState("saved");
      savedTimer.current = setTimeout(() => setSaveState("idle"), SAVED_INDICATOR_MS);
    }, AUTOSAVE_DELAY_MS);
  }

  function handleEditorInput() {
    if (!editorRef.current) return;
    setWordCount(countWords(editorRef.current.innerText));
    scheduleAutosave();
  }

  function handleEditorKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (e.key === "Tab") {
      e.preventDefault();
      // Static, author-controlled whitespace only.
      document.execCommand("insertHTML", false, "&nbsp;&nbsp;&nbsp;&nbsp;");
      return;
    }
    if ((e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey) {
      const key = e.key.toLowerCase();
      if (key === "b") {
        e.preventDefault();
        document.execCommand("bold");
        scheduleAutosave();
      } else if (key === "i") {
        e.preventDefault();
        document.execCommand("italic");
        scheduleAutosave();
      } else if (key === "u") {
        e.preventDefault();
        document.execCommand("underline");
        scheduleAutosave();
      } else if (key === "k") {
        e.preventDefault();
        triggerSprintGenerator();
      }
    }
  }

  function runFormat(command: string, value?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    scheduleAutosave();
  }

  function runBlock(tag: "h1" | "h2" | "h3" | "blockquote" | "pre" | "p") {
    editorRef.current?.focus();
    document.execCommand("formatBlock", false, tag);
    scheduleAutosave();
  }

  function insertLink() {
    const url = window.prompt("Enter URL");
    if (!url) return;
    // execCommand('createLink') escapes the URL when building the anchor.
    runFormat("createLink", url);
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    scheduleAutosave();
  }

  function triggerSprintGenerator() {
    if (generating) return;
    setGenerating(true);
    setToast(null);
    if (toastTimer.current) clearTimeout(toastTimer.current);

    setTimeout(() => {
      setGenerating(false);
      setToast("Sprint generated \u2014 8 tasks created in Projects");
      toastTimer.current = setTimeout(() => setToast(null), TOAST_VISIBLE_MS);
    }, SPRINT_GEN_DELAY_MS);
  }

  function addTag() {
    const cleaned = newTag.trim().toLowerCase();
    if (!cleaned) return;
    if (tags.includes(cleaned)) {
      setNewTag("");
      return;
    }
    setTags([...tags, cleaned]);
    setNewTag("");
    scheduleAutosave();
  }

  function removeTag(t: string) {
    setTags(tags.filter((x) => x !== t));
    scheduleAutosave();
  }

  /* ── Render ───────────────────────────────────────────────────────────── */

  return (
    <div className="editor-container" style={{ position: "relative" }}>
      {/* Toolbar row 1: navigation + title + AI + save */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 20px",
          borderBottom: "1px solid var(--panel-border)",
          background: "var(--shell-surface)",
          flexShrink: 0,
          minHeight: 52,
        }}
      >
        <Link
          href="/docs"
          className="btn btn-ghost btn-sm"
          style={{ gap: 6, paddingLeft: 6, paddingRight: 10 }}
        >
          <ArrowLeft size={14} />
          <span>Docs</span>
        </Link>

        <div style={{ width: 1, height: 20, background: "var(--panel-border)" }} />

        <div ref={emojiRef} style={{ position: "relative" }}>
          <button
            type="button"
            className="btn btn-ghost btn-icon btn-sm"
            style={{ fontSize: 18, width: 32, height: 32 }}
            onClick={() => setEmojiOpen((o) => !o)}
            title="Change icon"
            aria-label="Change icon"
          >
            {icon}
          </button>
          {emojiOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                left: 0,
                background: "var(--shell-surface)",
                border: "1px solid var(--panel-border)",
                borderRadius: 10,
                padding: 8,
                display: "grid",
                gridTemplateColumns: "repeat(8, 1fr)",
                gap: 2,
                boxShadow: "var(--shadow-md)",
                zIndex: 30,
                width: 272,
              }}
            >
              {EMOJI_PICKS.map((e) => (
                <button
                  key={e}
                  type="button"
                  className="btn btn-ghost btn-icon btn-sm"
                  style={{ fontSize: 16 }}
                  onClick={() => {
                    setIcon(e);
                    setEmojiOpen(false);
                    scheduleAutosave();
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>

        <input
          ref={titleRef}
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Untitled document"
          aria-label="Document title"
          style={{
            flex: 1,
            minWidth: 0,
            background: "transparent",
            border: "none",
            outline: "none",
            fontFamily: "inherit",
            fontSize: 15,
            fontWeight: 600,
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
            padding: "4px 6px",
          }}
        />

        <div
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            background: "var(--shell-border)",
            borderRadius: 999,
            padding: "3px 9px",
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
          }}
          title="Word count"
        >
          {wordCount.toLocaleString()} {wordCount === 1 ? "word" : "words"}
        </div>

        <SaveIndicator state={saveState} />

        <div style={{ width: 1, height: 20, background: "var(--panel-border)" }} />

        <button
          type="button"
          className="btn btn-ghost btn-icon btn-sm"
          onClick={() => {
            setStarred((s) => !s);
            scheduleAutosave();
          }}
          title={starred ? "Unstar" : "Star"}
          aria-label={starred ? "Unstar" : "Star"}
        >
          <Star
            size={14}
            style={{
              color: starred ? "var(--yellow)" : "var(--text-muted)",
              fill: starred ? "var(--yellow)" : "transparent",
            }}
          />
        </button>

        <button
          type="button"
          className="btn btn-ghost btn-icon btn-sm"
          title="Share"
          aria-label="Share"
        >
          <Share2 size={14} />
        </button>

        <button
          type="button"
          className="btn btn-ghost btn-icon btn-sm"
          onClick={() => setSidebarOpen((o) => !o)}
          title={sidebarOpen ? "Hide details" : "Show details"}
          aria-label="Toggle details"
        >
          {sidebarOpen ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
        </button>

        <button
          type="button"
          className="btn btn-ghost btn-icon btn-sm"
          title="More"
          aria-label="More actions"
        >
          <MoreHorizontal size={14} />
        </button>

        <button
          type="button"
          onClick={triggerSprintGenerator}
          disabled={generating}
          className="btn"
          style={{
            background: generating
              ? "var(--accent-subtle)"
              : "linear-gradient(135deg, var(--accent), var(--purple))",
            color: generating ? "var(--accent)" : "white",
            gap: 6,
            paddingLeft: 12,
            paddingRight: 12,
            minWidth: 148,
            boxShadow: generating ? "none" : "0 2px 10px oklch(63% 0.22 265 / 0.35)",
          }}
          title="Turn this doc into a sprint (\u2318K)"
        >
          {generating ? (
            <>
              <Loader2 size={14} style={{ animation: "spin 0.9s linear infinite" }} />
              <span>Generating\u2026</span>
            </>
          ) : (
            <>
              <Zap size={14} style={{ fill: "white" }} />
              <span>Generate Sprint</span>
            </>
          )}
        </button>
      </div>

      {/* Toolbar row 2: formatting */}
      <div className="editor-toolbar" style={{ padding: "4px 20px" }}>
        <ToolbarButton onClick={() => runFormat("undo")} title="Undo">
          <Undo2 size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => runFormat("redo")} title="Redo">
          <Redo2 size={14} />
        </ToolbarButton>

        <div className="editor-toolbar__sep" />

        <ToolbarButton onClick={() => runBlock("h1")} title="Heading 1">
          <Heading1 size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => runBlock("h2")} title="Heading 2">
          <Heading2 size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => runBlock("h3")} title="Heading 3">
          <Heading3 size={14} />
        </ToolbarButton>

        <div className="editor-toolbar__sep" />

        <ToolbarButton onClick={() => runFormat("bold")} title="Bold (\u2318B)">
          <Bold size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => runFormat("italic")} title="Italic (\u2318I)">
          <Italic size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => runFormat("underline")} title="Underline (\u2318U)">
          <Underline size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => runFormat("strikeThrough")} title="Strikethrough">
          <Strikethrough size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => runBlock("pre")} title="Code block">
          <Code size={14} />
        </ToolbarButton>

        <div className="editor-toolbar__sep" />

        <ToolbarButton onClick={() => runFormat("insertUnorderedList")} title="Bulleted list">
          <List size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => runFormat("insertOrderedList")} title="Numbered list">
          <ListOrdered size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            // Static author-controlled HTML only.
            runFormat(
              "insertHTML",
              '<div style="display:flex;align-items:flex-start;gap:8px;margin:4px 0;"><input type="checkbox" style="margin-top:3px;accent-color:var(--accent);" /><span>Task</span></div>'
            )
          }
          title="Task"
        >
          <CheckSquare size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => runBlock("blockquote")} title="Quote">
          <Quote size={14} />
        </ToolbarButton>

        <div className="editor-toolbar__sep" />

        <ToolbarButton onClick={insertLink} title="Link">
          <Link2 size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            // Static author-controlled HTML only.
            runFormat(
              "insertHTML",
              '<div style="margin:12px 0;padding:24px;background:var(--shell-surface);border:1px dashed var(--panel-border);border-radius:10px;text-align:center;color:var(--text-muted);font-size:13px;">Image placeholder</div>'
            )
          }
          title="Image"
        >
          <ImageIcon size={14} />
        </ToolbarButton>

        <div className="editor-toolbar__sep" />

        <ToolbarButton
          onClick={() =>
            // Static author-controlled HTML only.
            runFormat(
              "insertHTML",
              '<p style="color:var(--accent);font-style:italic;">\u2728 AI: Summarize the selection above into 3 bullets\u2026</p>'
            )
          }
          title="Ask AI"
        >
          <Sparkles size={14} style={{ color: "var(--accent)" }} />
        </ToolbarButton>
      </div>

      {/* Body: editor + sidebar */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: sidebarOpen ? "1fr 300px" : "1fr 0px",
          transition: "grid-template-columns var(--dur-normal) var(--ease-out)",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        <div className="editor-scroll" style={{ padding: "48px 24px 120px" }}>
          <div className="editor-content" style={{ position: "relative" }}>
            <div
              ref={editorRef}
              className="ProseMirror"
              contentEditable
              suppressContentEditableWarning
              onInput={handleEditorInput}
              onKeyDown={handleEditorKeyDown}
              data-placeholder="Start writing, or press \u2318K to use AI\u2026"
              spellCheck
              style={
                {
                  minHeight: 400,
                  fontSize: 16,
                  lineHeight: 1.7,
                  outline: "none",
                } as CSSProperties
              }
            />
            <EmptyPlaceholder editorRef={editorRef} wordCount={wordCount} />
          </div>
        </div>

        {sidebarOpen && (
          <aside
            style={{
              borderLeft: "1px solid var(--panel-border)",
              background: "var(--shell-surface)",
              overflowY: "auto",
              padding: "20px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <SidebarSection label="Overview">
              <MetaRow icon={<Hash size={12} />} label="Words" value={wordCount.toLocaleString()} />
              <MetaRow icon={<UserIcon size={12} />} label="Owner" value={seed.owner} />
              <MetaRow icon={<Clock size={12} />} label="Created" value={seed.createdAt} />
              <MetaRow icon={<Clock size={12} />} label="Updated" value={seed.updatedAt} />
            </SidebarSection>

            <SidebarSection label="Tags">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                {tags.length === 0 && (
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>No tags yet</span>
                )}
                {tags.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`badge ${TAG_COLORS[t] ?? "badge-default"}`}
                    onClick={() => removeTag(t)}
                    title="Click to remove"
                    style={{ border: "none", cursor: "pointer", fontFamily: "inherit" }}
                  >
                    <TagIcon size={9} />
                    {t}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  className="input"
                  style={{ height: 28, fontSize: 12 }}
                  placeholder="Add tag\u2026"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={addTag}
                  disabled={!newTag.trim()}
                >
                  Add
                </button>
              </div>
            </SidebarSection>

            <SidebarSection label="AI actions">
              <AiActionButton
                icon={<Zap size={13} />}
                label="Generate Sprint"
                hint="Turn doc into tasks"
                onClick={triggerSprintGenerator}
              />
              <AiActionButton
                icon={<Sparkles size={13} />}
                label="Summarize"
                hint="3-bullet TL;DR"
                onClick={() =>
                  // Static author-controlled HTML only.
                  runFormat(
                    "insertHTML",
                    '<p style="color:var(--accent);"><em>\u2728 Summary will appear here\u2026</em></p>'
                  )
                }
              />
              <AiActionButton
                icon={<Smile size={13} />}
                label="Improve tone"
                hint="Friendlier voice"
                onClick={() => {
                  setSaveState("saving");
                  setTimeout(() => {
                    setSaveState("saved");
                    setTimeout(() => setSaveState("idle"), 1500);
                  }, 900);
                }}
              />
            </SidebarSection>

            <div
              style={{
                marginTop: "auto",
                padding: "10px 12px",
                background: "var(--accent-subtle)",
                border: "1px solid var(--accent-border)",
                borderRadius: 10,
                fontSize: 12,
                color: "var(--text-secondary)",
                lineHeight: 1.5,
              }}
            >
              <div style={{ fontWeight: 600, color: "var(--accent)", marginBottom: 4 }}>
                {"\u2318K \u2014 Ask AI"}
              </div>
              {"Select text, then press \u2318K to rewrite, expand, or extract tasks."}
            </div>
          </aside>
        )}
      </div>

      {toast && (
        <div
          role="status"
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--shell-surface)",
            border: "1px solid var(--accent-border)",
            borderRadius: 10,
            padding: "10px 16px",
            boxShadow: "var(--shadow-lg)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            zIndex: 100,
            fontSize: 13,
            color: "var(--text-primary)",
            animation: "menuReveal 0.24s var(--ease-out)",
          }}
        >
          <span
            style={{
              width: 22,
              height: 22,
              borderRadius: 999,
              background: "var(--green-subtle)",
              color: "var(--green)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Check size={12} />
          </span>
          <span>{toast}</span>
          <Link
            href="/projects"
            className="btn btn-ghost btn-sm"
            style={{ marginLeft: 6, color: "var(--accent)" }}
          >
            View
          </Link>
        </div>
      )}
    </div>
  );
}

/* ── Subcomponents ────────────────────────────────────────────────────────── */

function SaveIndicator({ state }: { state: SaveState }) {
  if (state === "saving") {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          color: "var(--text-muted)",
          whiteSpace: "nowrap",
        }}
      >
        <Loader2 size={11} style={{ animation: "spin 0.9s linear infinite" }} />
        {"Saving\u2026"}
      </span>
    );
  }
  if (state === "saved") {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          color: "var(--green)",
          whiteSpace: "nowrap",
        }}
      >
        <Check size={12} />
        Saved
      </span>
    );
  }
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        color: "var(--text-tertiary)",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: 999,
          background: "var(--text-tertiary)",
          display: "inline-block",
        }}
      />
      Up to date
    </span>
  );
}

interface EmptyPlaceholderProps {
  editorRef: RefObject<HTMLDivElement | null>;
  wordCount: number;
}

function EmptyPlaceholder({ editorRef, wordCount }: EmptyPlaceholderProps) {
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const text = el.innerText.trim();
    setEmpty(text.length === 0 && wordCount === 0);
  }, [editorRef, wordCount]);

  if (!empty) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        color: "var(--text-disabled)",
        fontSize: 16,
        lineHeight: 1.7,
        userSelect: "none",
      }}
      aria-hidden="true"
    >
      {"Start writing, or press \u2318K to use AI\u2026"}
    </div>
  );
}

function SidebarSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{children}</div>
    </div>
  );
}

interface MetaRowProps {
  icon: ReactNode;
  label: string;
  value: string;
}

function MetaRow({ icon, label, value }: MetaRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 12,
        color: "var(--text-secondary)",
      }}
    >
      <span style={{ color: "var(--text-muted)", display: "inline-flex" }}>{icon}</span>
      <span style={{ color: "var(--text-muted)", width: 64 }}>{label}</span>
      <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{value}</span>
    </div>
  );
}

interface AiActionButtonProps {
  icon: ReactNode;
  label: string;
  hint: string;
  onClick: () => void;
}

function AiActionButton({ icon, label, hint, onClick }: AiActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 10px",
        borderRadius: 8,
        border: "1px solid var(--panel-border)",
        background: "var(--panel-bg)",
        color: "var(--text-primary)",
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "inherit",
        transition: "border-color var(--dur-fast), background var(--dur-fast)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--accent-border)";
        e.currentTarget.style.background = "var(--shell-hover)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--panel-border)";
        e.currentTarget.style.background = "var(--panel-bg)";
      }}
    >
      <span
        style={{
          width: 26,
          height: 26,
          borderRadius: 7,
          background: "var(--accent-subtle)",
          color: "var(--accent)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </span>
      <span style={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{hint}</span>
      </span>
    </button>
  );
}
