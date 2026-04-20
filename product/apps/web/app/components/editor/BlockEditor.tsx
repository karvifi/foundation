"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Plus,
  GripVertical,
  ChevronRight,
  ChevronDown,
  Bold,
  Italic,
  Strikethrough,
  Link2,
  Code2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type BlockType =
  | "paragraph"
  | "heading1"
  | "heading2"
  | "heading3"
  | "bulletList"
  | "numberedList"
  | "quote"
  | "code"
  | "divider"
  | "callout"
  | "toggle"
  | "image";

interface Block {
  id: string;
  type: BlockType;
  content: string;
  children?: Block[];
  meta?: {
    language?: string;
    calloutType?: "info" | "warning" | "success" | "error";
    imageUrl?: string;
  };
  collapsed?: boolean;
}

interface BlockEditorProps {
  initialBlocks?: Block[];
  onChange?: (blocks: Block[]) => void;
  readonly?: boolean;
  placeholder?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 9);

const DEFAULT_BLOCKS: Block[] = [
  { id: "1", type: "heading1", content: "Untitled Document" },
  { id: "2", type: "paragraph", content: "Start writing, or press / for commands..." },
];

const CALLOUT_STYLES: Record<string, { border: string; bg: string; icon: string }> = {
  info:    { border: "border-blue-500",  bg: "bg-blue-500/10",  icon: "ℹ" },
  warning: { border: "border-amber-500", bg: "bg-amber-500/10", icon: "⚠" },
  success: { border: "border-green-500", bg: "bg-green-500/10", icon: "✓" },
  error:   { border: "border-red-500",   bg: "bg-red-500/10",   icon: "✗" },
};

const SLASH_COMMANDS: { label: string; desc: string; type: BlockType; aliases: string[] }[] = [
  { label: "Text",          desc: "Plain paragraph",   type: "paragraph",     aliases: ["text", "p"] },
  { label: "Heading 1",     desc: "Large heading",     type: "heading1",      aliases: ["h1"] },
  { label: "Heading 2",     desc: "Medium heading",    type: "heading2",      aliases: ["h2"] },
  { label: "Heading 3",     desc: "Small heading",     type: "heading3",      aliases: ["h3"] },
  { label: "Bullet List",   desc: "Unordered list",    type: "bulletList",    aliases: ["bullet", "ul"] },
  { label: "Numbered List", desc: "Ordered list",      type: "numberedList",  aliases: ["number", "ol"] },
  { label: "Quote",         desc: "Block quotation",   type: "quote",         aliases: ["quote"] },
  { label: "Code",          desc: "Code block",        type: "code",          aliases: ["code"] },
  { label: "Divider",       desc: "Horizontal rule",   type: "divider",       aliases: ["divider", "hr"] },
  { label: "Callout",       desc: "Highlighted note",  type: "callout",       aliases: ["callout"] },
  { label: "Toggle",        desc: "Collapsible block", type: "toggle",        aliases: ["toggle"] },
];

const TYPE_OPTIONS: { label: string; type: BlockType }[] = [
  { label: "Text",      type: "paragraph" },
  { label: "Heading 1", type: "heading1" },
  { label: "Heading 2", type: "heading2" },
  { label: "Heading 3", type: "heading3" },
  { label: "Quote",     type: "quote" },
  { label: "Code",      type: "code" },
];

// ─── Slash Menu ───────────────────────────────────────────────────────────────

function SlashMenu({
  query,
  position,
  onSelect,
  onClose,
}: {
  query: string;
  position: { x: number; y: number };
  onSelect: (type: BlockType) => void;
  onClose: () => void;
}) {
  const [active, setActive] = useState(0);
  const q = query.toLowerCase();
  const filtered = SLASH_COMMANDS.filter(
    (c) =>
      q === "" ||
      c.aliases.some((a) => a.startsWith(q)) ||
      c.label.toLowerCase().startsWith(q)
  );

  const prevQuery = useRef(query);
  if (prevQuery.current !== query) {
    prevQuery.current = query;
  }

  React.useEffect(() => { setActive(0); }, [query]);

  React.useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
      if (e.key === "Enter")     { e.preventDefault(); filtered[active] && onSelect(filtered[active].type); }
      if (e.key === "Escape")    { onClose(); }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [filtered, active, onSelect, onClose]);

  if (filtered.length === 0) return null;

  return (
    <div
      style={{ left: position.x, top: position.y }}
      className="fixed z-50 w-64 bg-[#13131C] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden"
    >
      <div className="px-3 py-2 border-b border-white/10 text-xs text-neutral-500 font-medium uppercase tracking-wider">
        Blocks
      </div>
      <div className="max-h-60 overflow-y-auto py-1">
        {filtered.map((cmd, i) => (
          <button
            key={cmd.type}
            onClick={() => onSelect(cmd.type)}
            onMouseEnter={() => setActive(i)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
              i === active ? "bg-white/10 text-neutral-100" : "text-neutral-300 hover:bg-white/5"
            }`}
          >
            <span className="font-medium text-sm">{cmd.label}</span>
            <span className="text-xs text-neutral-500">{cmd.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Block View ───────────────────────────────────────────────────────────────

interface BlockViewProps {
  block: Block;
  focused: boolean;
  readonly: boolean;
  blockRef: (el: HTMLDivElement | null) => void;
  onInput: (id: string, value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>, id: string) => void;
  onFocus: (id: string) => void;
  onHover: (id: string | null) => void;
  hoveredId: string | null;
  onAddBelow: (id: string) => void;
  onToggleCollapse: (id: string) => void;
  numberIndex?: number;
}

function BlockView({
  block, focused, readonly, blockRef,
  onInput, onKeyDown, onFocus, onHover, hoveredId,
  onAddBelow, onToggleCollapse, numberIndex,
}: BlockViewProps) {
  const isHovered = hoveredId === block.id;

  const editableProps = readonly
    ? {}
    : {
        contentEditable: true as const,
        suppressContentEditableWarning: true,
        onInput: (e: React.FormEvent<HTMLDivElement>) =>
          onInput(block.id, e.currentTarget.textContent ?? ""),
        onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => onKeyDown(e, block.id),
        onFocus: () => onFocus(block.id),
      };

  const field = (className: string, placeholder = "Write something...") => (
    <div
      ref={blockRef}
      {...editableProps}
      data-placeholder={placeholder}
      className={`outline-none w-full empty:before:content-[attr(data-placeholder)] empty:before:text-neutral-600 ${className}`}
    >
      {block.content}
    </div>
  );

  const handle = !readonly && (
    <div
      className={`absolute -left-10 top-1/2 -translate-y-1/2 flex items-center gap-0.5 transition-opacity ${
        isHovered ? "opacity-100" : "opacity-0"
      }`}
    >
      <button
        onClick={() => onAddBelow(block.id)}
        className="p-0.5 rounded text-neutral-500 hover:text-neutral-200 hover:bg-white/10"
      >
        <Plus size={14} />
      </button>
      <button className="p-0.5 rounded text-neutral-500 hover:text-neutral-200 hover:bg-white/10 cursor-grab">
        <GripVertical size={14} />
      </button>
    </div>
  );

  const wrap = (children: React.ReactNode, extra = "") => (
    <div
      className={`relative group ${extra}`}
      onMouseEnter={() => onHover(block.id)}
      onMouseLeave={() => onHover(null)}
    >
      {handle}
      {children}
    </div>
  );

  switch (block.type) {
    case "heading1":
      return wrap(field("text-3xl font-semibold text-neutral-100 py-1", "Heading 1"), "mt-6");
    case "heading2":
      return wrap(field("text-2xl font-semibold text-neutral-100 py-1", "Heading 2"), "mt-4");
    case "heading3":
      return wrap(field("text-xl font-semibold text-neutral-100 py-1", "Heading 3"), "mt-3");
    case "bulletList":
      return wrap(
        <div className="flex gap-2 items-start">
          <span className="text-neutral-400 mt-1 select-none">•</span>
          {field("text-neutral-200 leading-7", "List item")}
        </div>
      );
    case "numberedList":
      return wrap(
        <div className="flex gap-2 items-start">
          <span className="text-neutral-400 mt-1 select-none min-w-[1.2rem]">{numberIndex}.</span>
          {field("text-neutral-200 leading-7", "List item")}
        </div>
      );
    case "quote":
      return wrap(
        <div className="border-l-4 border-[#6366F1] pl-4 italic text-neutral-400">
          {field("leading-7", "Quote")}
        </div>
      );
    case "code":
      return wrap(
        <div className="bg-[#0D0D14] rounded-lg p-4">
          {field("font-mono text-sm text-[#A5B4FC] whitespace-pre-wrap", "// code...")}
        </div>
      );
    case "divider":
      return <hr className="border-white/10 my-4" />;
    case "callout": {
      const ct = block.meta?.calloutType ?? "info";
      const s = CALLOUT_STYLES[ct];
      return wrap(
        <div className={`flex gap-3 p-4 rounded-lg border-l-4 ${s.border} ${s.bg}`}>
          <span className="text-lg select-none">{s.icon}</span>
          {field("text-neutral-200 leading-7 flex-1", "Callout text")}
        </div>
      );
    }
    case "toggle":
      return wrap(
        <div>
          <div className="flex items-start gap-1">
            <button
              onClick={() => onToggleCollapse(block.id)}
              className="mt-1.5 text-neutral-400 hover:text-neutral-200 flex-shrink-0"
            >
              {block.collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
            </button>
            {field("text-neutral-200 leading-7 font-medium", "Toggle heading")}
          </div>
          {!block.collapsed && block.children && (
            <div className="ml-5 pl-3 border-l border-white/10 mt-1">
              {block.children.map((child) => (
                <div key={child.id} className="py-0.5 text-neutral-300 text-sm leading-6">
                  {child.content}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    case "image": {
      const url = block.meta?.imageUrl;
      return wrap(
        url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={block.content || "image"} className="rounded-lg max-w-full" />
        ) : (
          <div className="rounded-lg border border-dashed border-white/20 p-8 text-center text-neutral-500 text-sm">
            Image block — set imageUrl in meta
          </div>
        )
      );
    }
    default:
      return wrap(field("text-neutral-200 leading-7", "Write something, or press / for commands..."));
  }
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────

export function BlockEditorToolbar({
  selectedBlockId,
  onFormat,
  onTypeChange,
}: {
  selectedBlockId: string | null;
  onFormat: (fmt: "bold" | "italic" | "strikethrough" | "code") => void;
  onTypeChange: (type: BlockType) => void;
}) {
  if (!selectedBlockId) return null;

  const TEXT_COLORS = [
    { label: "White", cls: "bg-white" },
    { label: "Gray",  cls: "bg-neutral-400" },
    { label: "Red",   cls: "bg-red-400" },
    { label: "Blue",  cls: "bg-blue-400" },
    { label: "Green", cls: "bg-green-400" },
    { label: "Amber", cls: "bg-amber-400" },
  ];

  return (
    <div className="flex items-center gap-1 px-2 py-1.5 bg-[#13131C] border border-white/10 rounded-xl shadow-2xl shadow-black/50">
      {(["bold", "italic", "strikethrough", "code"] as const).map((fmt) => {
        const Icon = fmt === "bold" ? Bold : fmt === "italic" ? Italic : fmt === "strikethrough" ? Strikethrough : Code2;
        return (
          <button
            key={fmt}
            onClick={() => onFormat(fmt)}
            title={fmt}
            className="p-1.5 rounded hover:bg-white/10 text-neutral-300 hover:text-white"
          >
            <Icon size={14} />
          </button>
        );
      })}
      <button title="Link" className="p-1.5 rounded hover:bg-white/10 text-neutral-300 hover:text-white">
        <Link2 size={14} />
      </button>
      <div className="w-px h-4 bg-white/10 mx-1" />
      <select
        onChange={(e) => onTypeChange(e.target.value as BlockType)}
        className="bg-transparent text-neutral-300 text-xs border border-white/10 rounded px-1.5 py-1 focus:outline-none"
      >
        {TYPE_OPTIONS.map((o) => (
          <option key={o.type} value={o.type} className="bg-[#13131C]">
            {o.label}
          </option>
        ))}
      </select>
      <div className="w-px h-4 bg-white/10 mx-1" />
      <div className="flex items-center gap-0.5">
        {TEXT_COLORS.map((c) => (
          <button
            key={c.label}
            title={c.label}
            className={`w-3.5 h-3.5 rounded-full ${c.cls} hover:ring-2 ring-white/40`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main Editor ──────────────────────────────────────────────────────────────

export default function BlockEditor({
  initialBlocks,
  onChange,
  readonly = false,
}: BlockEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks ?? DEFAULT_BLOCKS);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [slashMenu, setSlashMenu] = useState<{
    blockId: string;
    query: string;
    position: { x: number; y: number };
  } | null>(null);

  const refs = useRef<Map<string, HTMLDivElement>>(new Map());
  const historyStack = useRef<Block[][]>([]);

  const pushHistory = useCallback((state: Block[]) => {
    historyStack.current = [...historyStack.current.slice(-19), state];
  }, []);

  const update = useCallback(
    (next: Block[]) => {
      setBlocks(next);
      onChange?.(next);
    },
    [onChange]
  );

  const getNumberIndex = useCallback(
    (id: string) => {
      let count = 0;
      for (const b of blocks) {
        if (b.type === "numberedList") count++;
        if (b.id === id) return count;
      }
      return count;
    },
    [blocks]
  );

  const handleInput = useCallback(
    (id: string, value: string) => {
      if (value.startsWith("/")) {
        const el = refs.current.get(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          setSlashMenu({ blockId: id, query: value.slice(1), position: { x: rect.left, y: rect.bottom + 4 } });
        }
      } else {
        setSlashMenu(null);
      }
      setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, content: value } : b)));
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>, id: string) => {
      const idx = blocks.findIndex((b) => b.id === id);

      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        const prev = historyStack.current.pop();
        if (prev) setBlocks(prev);
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, content: `**${b.content}**` } : b)));
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "i") {
        e.preventDefault();
        setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, content: `_${b.content}_` } : b)));
        return;
      }

      if (e.key === "Enter" && !e.shiftKey) {
        if (slashMenu) return;
        e.preventDefault();
        pushHistory(blocks);
        const newBlock: Block = { id: uid(), type: "paragraph", content: "" };
        const next = [...blocks];
        next.splice(idx + 1, 0, newBlock);
        update(next);
        setTimeout(() => refs.current.get(newBlock.id)?.focus(), 0);
        return;
      }

      if (e.key === "Backspace" && blocks[idx]?.content === "" && blocks.length > 1) {
        e.preventDefault();
        pushHistory(blocks);
        const next = blocks.filter((b) => b.id !== id);
        update(next);
        const prevBlock = blocks[Math.max(0, idx - 1)];
        setTimeout(() => refs.current.get(prevBlock.id)?.focus(), 0);
        return;
      }

      if (e.key === "Tab") {
        e.preventDefault();
        setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, content: "  " + b.content } : b)));
      }
    },
    [blocks, slashMenu, pushHistory, update]
  );

  const handleSlashSelect = useCallback(
    (type: BlockType) => {
      if (!slashMenu) return;
      pushHistory(blocks);
      update(
        blocks.map((b) =>
          b.id === slashMenu.blockId
            ? { ...b, type, content: "", meta: type === "callout" ? { calloutType: "info" } : b.meta }
            : b
        )
      );
      setSlashMenu(null);
      setTimeout(() => refs.current.get(slashMenu.blockId)?.focus(), 0);
    },
    [slashMenu, blocks, pushHistory, update]
  );

  const handleAddBelow = useCallback(
    (id: string) => {
      const idx = blocks.findIndex((b) => b.id === id);
      const newBlock: Block = { id: uid(), type: "paragraph", content: "" };
      const next = [...blocks];
      next.splice(idx + 1, 0, newBlock);
      update(next);
      setTimeout(() => refs.current.get(newBlock.id)?.focus(), 0);
    },
    [blocks, update]
  );

  const handleToggleCollapse = useCallback(
    (id: string) => {
      update(blocks.map((b) => (b.id === id ? { ...b, collapsed: !b.collapsed } : b)));
    },
    [blocks, update]
  );

  return (
    <div className="relative max-w-3xl mx-auto px-14 py-8">
      <div className="space-y-1">
        {blocks.map((block) => (
          <BlockView
            key={block.id}
            block={block}
            focused={focusedId === block.id}
            readonly={readonly}
            blockRef={(el) => {
              if (el) refs.current.set(block.id, el);
              else refs.current.delete(block.id);
            }}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={setFocusedId}
            onHover={setHoveredId}
            hoveredId={hoveredId}
            onAddBelow={handleAddBelow}
            onToggleCollapse={handleToggleCollapse}
            numberIndex={block.type === "numberedList" ? getNumberIndex(block.id) : undefined}
          />
        ))}
      </div>

      {slashMenu && (
        <SlashMenu
          query={slashMenu.query}
          position={slashMenu.position}
          onSelect={handleSlashSelect}
          onClose={() => setSlashMenu(null)}
        />
      )}
    </div>
  );
}

export type { Block, BlockType, BlockEditorProps };
