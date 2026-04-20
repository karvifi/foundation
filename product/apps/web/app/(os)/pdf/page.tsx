"use client";

import { useState, useRef } from "react";
import {
  Layers, Scissors, RotateCw, GripVertical, Trash2, FileText,
  FileSpreadsheet, Image, Globe, Shield, Lock, Unlock, EyeOff,
  PenLine, Zap, Archive, Wrench, Edit3, MessageSquare, Hash,
  Sparkles, BrainCircuit, Database, RefreshCw, FileUp, Download,
  X, Check, AlignCenter, AlignJustify, ScanText, Languages,
  Droplets, FilePlus, ClipboardList, GitMerge, FileOutput,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type ProcessState = "idle" | "uploading" | "processing" | "done" | "error";
type LucideIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface Tool {
  id: string;
  label: string;
  desc: string;
  icon: LucideIcon;
}

interface Category {
  id: string;
  label: string;
  color: string;
  icon: LucideIcon;
  tools: Tool[];
}

// ── Data ──────────────────────────────────────────────────────────────────────

const TOOL_CATEGORIES: Category[] = [
  {
    id: "organize",
    label: "Organize",
    color: "#6366F1",
    icon: Layers,
    tools: [
      { id: "merge", label: "Merge PDFs", desc: "Combine multiple PDFs into one", icon: GitMerge },
      { id: "split", label: "Split PDF", desc: "Split into individual pages or ranges", icon: Scissors },
      { id: "rotate", label: "Rotate Pages", desc: "Rotate pages by 90°, 180°, or 270°", icon: RotateCw },
      { id: "reorder", label: "Reorder Pages", desc: "Drag and drop to rearrange pages", icon: GripVertical },
      { id: "delete-pages", label: "Delete Pages", desc: "Remove selected pages from PDF", icon: Trash2 },
      { id: "extract", label: "Extract Pages", desc: "Pull out specific pages as new PDFs", icon: FileOutput },
    ],
  },
  {
    id: "convert",
    label: "Convert",
    color: "#10B981",
    icon: RefreshCw,
    tools: [
      { id: "pdf-to-word", label: "PDF to Word", desc: "Convert PDF to editable .docx", icon: FileText },
      { id: "pdf-to-excel", label: "PDF to Excel", desc: "Extract tables to .xlsx", icon: FileSpreadsheet },
      { id: "pdf-to-image", label: "PDF to Image", desc: "Export pages as PNG or JPG", icon: Image },
      { id: "word-to-pdf", label: "Word to PDF", desc: "Convert .docx to PDF", icon: FileText },
      { id: "html-to-pdf", label: "HTML to PDF", desc: "Capture web pages as PDF", icon: Globe },
      { id: "image-to-pdf", label: "Image to PDF", desc: "Combine images into a PDF", icon: Image },
    ],
  },
  {
    id: "security",
    label: "Security",
    color: "#F59E0B",
    icon: Shield,
    tools: [
      { id: "add-password", label: "Add Password", desc: "Encrypt PDF with a password", icon: Lock },
      { id: "remove-password", label: "Remove Password", desc: "Unlock a password-protected PDF", icon: Unlock },
      { id: "redact", label: "Redact Content", desc: "Permanently black-out sensitive text", icon: EyeOff },
      { id: "sign", label: "Sign PDF", desc: "Add digital signatures", icon: PenLine },
      { id: "watermark", label: "Add Watermark", desc: "Add text or image watermarks", icon: Droplets },
    ],
  },
  {
    id: "optimize",
    label: "Optimize",
    color: "#8B5CF6",
    icon: Zap,
    tools: [
      { id: "compress", label: "Compress PDF", desc: "Reduce file size with minimal quality loss", icon: Archive },
      { id: "repair", label: "Repair PDF", desc: "Fix corrupted or damaged PDFs", icon: Wrench },
      { id: "flatten", label: "Flatten PDF", desc: "Flatten forms and annotations", icon: AlignCenter },
    ],
  },
  {
    id: "edit",
    label: "Edit",
    color: "#EC4899",
    icon: Edit3,
    tools: [
      { id: "annotate", label: "Annotate", desc: "Highlight, underline, add comments", icon: MessageSquare },
      { id: "fill-form", label: "Fill Forms", desc: "Fill PDF forms interactively", icon: ClipboardList },
      { id: "add-page-numbers", label: "Page Numbers", desc: "Add page numbers to any PDF", icon: Hash },
      { id: "add-header-footer", label: "Header & Footer", desc: "Add custom header and footer text", icon: AlignJustify },
    ],
  },
  {
    id: "ai",
    label: "AI Tools",
    color: "#D97706",
    icon: Sparkles,
    tools: [
      { id: "ocr", label: "OCR — Make Searchable", desc: "Extract text from scanned PDFs using AI", icon: ScanText },
      { id: "summarize", label: "AI Summarize", desc: "Get a summary of any PDF document", icon: BrainCircuit },
      { id: "translate", label: "AI Translate", desc: "Translate PDF content to any language", icon: Languages },
      { id: "extract-data", label: "Extract Data", desc: "Pull structured data from PDFs with AI", icon: Database },
    ],
  },
];

const ALL_TOOLS = TOOL_CATEGORIES.flatMap((c) =>
  c.tools.map((t) => ({ ...t, categoryColor: c.color, categoryLabel: c.label }))
);

const RECENT_FILES = [
  { name: "Q2-Report.pdf", size: "2.4 MB", pages: 24, modified: "2h ago" },
  { name: "Contract-TechCorp.pdf", size: "890 KB", pages: 8, modified: "1d ago" },
  { name: "Invoice-INV-0089.pdf", size: "124 KB", pages: 1, modified: "2d ago" },
  { name: "Product-Roadmap.pdf", size: "3.1 MB", pages: 47, modified: "4d ago" },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function StatsBadge({ label }: { label: string }) {
  return (
    <span className="px-3 py-1 rounded-full text-xs font-medium border border-white/10 bg-white/5 text-white/60 whitespace-nowrap">
      {label}
    </span>
  );
}

function RecentFileChip({ file }: { file: (typeof RECENT_FILES)[number] }) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/[0.08] hover:border-indigo-500/30 hover:bg-white/[0.08] transition-all cursor-pointer">
      <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
        <FileText className="w-3.5 h-3.5 text-indigo-400" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-white/80 truncate max-w-[120px]">{file.name}</p>
        <p className="text-[10px] text-white/35">{file.size} · {file.pages}p · {file.modified}</p>
      </div>
    </div>
  );
}

function ToolCard({
  tool,
  categoryColor,
  onClick,
}: {
  tool: Tool;
  categoryColor: string;
  onClick: () => void;
}) {
  const Icon = tool.icon;
  return (
    <button
      onClick={onClick}
      className="group text-left p-4 rounded-2xl border border-white/[0.08] bg-[#13131C] hover:border-white/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px -4px ${categoryColor}40`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
        style={{ backgroundColor: `${categoryColor}22`, border: `1px solid ${categoryColor}44` }}
      >
        <Icon className="w-4 h-4" style={{ color: categoryColor }} />
      </div>
      <p className="text-sm font-semibold text-white/90 mb-1 group-hover:text-white transition-colors">
        {tool.label}
      </p>
      <p className="text-xs text-white/40 leading-relaxed">{tool.desc}</p>
    </button>
  );
}

function ProcessModal({
  tool,
  processState,
  progress,
  onClose,
  onProcess,
}: {
  tool: Tool & { categoryColor: string; categoryLabel: string };
  processState: ProcessState;
  progress: number;
  onClose: () => void;
  onProcess: () => void;
}) {
  const Icon = tool.icon;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const color = tool.categoryColor;
  const isDone = processState === "done";
  const isProcessing = processState === "uploading" || processState === "processing";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)" }}
      role="dialog"
      aria-modal="true"
      aria-label={tool.label}
    >
      <div
        className="w-full max-w-lg rounded-3xl border border-white/[0.12] bg-[#0F0F1A] shadow-2xl"
        style={{ boxShadow: `0 0 60px -8px ${color}30` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${color}22`, border: `1px solid ${color}44` }}
            >
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">{tool.label}</h2>
              <p className="text-xs text-white/40">{tool.categoryLabel}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors text-white/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-white/50">{tool.desc}</p>

          {/* Upload zone */}
          {!isDone && (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="w-full rounded-2xl border-2 border-dashed border-white/10 p-10 flex flex-col items-center gap-3 hover:border-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Upload PDF files"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${color}18` }}
              >
                <FileUp className="w-6 h-6" style={{ color }} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white/70">Drop PDF files here</p>
                <p className="text-xs text-white/35 mt-0.5">or click to browse</p>
              </div>
              <span className="text-[10px] px-3 py-1 rounded-full border border-white/10 text-white/30">
                PDF · Max 100 MB
              </span>
            </button>
          )}
          <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" aria-hidden="true" />

          {/* Progress */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-white/40">
                <span>{processState === "uploading" ? "Uploading…" : "Processing…"}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.08] overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                <div
                  className="h-full rounded-full transition-all duration-200"
                  style={{ width: `${progress}%`, backgroundColor: color }}
                />
              </div>
            </div>
          )}

          {/* Success */}
          {isDone && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-emerald-300">Processing complete</p>
                <p className="text-xs text-emerald-400/60 mt-0.5">Your file is ready to download</p>
              </div>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                style={{ backgroundColor: color }}
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isDone && (
          <div className="flex items-center justify-between px-6 pb-6">
            <button
              onClick={onClose}
              className="text-sm text-white/40 hover:text-white/70 transition-colors focus:outline-none focus:underline"
            >
              Cancel
            </button>
            <button
              onClick={onProcess}
              disabled={isProcessing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0F0F1A]"
              style={{ backgroundColor: color, boxShadow: `0 0 24px -4px ${color}80` }}
            >
              {isProcessing ? "Processing…" : "Process File"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PDFPage() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [processState, setProcessState] = useState<ProcessState>("idle");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [progress, setProgress] = useState(0);

  const totalTools = TOOL_CATEGORIES.reduce((acc, c) => acc + c.tools.length, 0);

  const visibleTools =
    activeCategory === "all"
      ? ALL_TOOLS
      : ALL_TOOLS.filter((t) => {
          const cat = TOOL_CATEGORIES.find((c) => c.id === activeCategory);
          return cat?.tools.some((ct) => ct.id === t.id) ?? false;
        });

  const activeToolData = activeTool ? ALL_TOOLS.find((t) => t.id === activeTool) ?? null : null;

  function openTool(id: string) {
    setActiveTool(id);
    setProcessState("idle");
    setProgress(0);
  }

  function closeTool() {
    setActiveTool(null);
    setProcessState("idle");
    setProgress(0);
  }

  function handleProcess() {
    setProcessState("uploading");
    setProgress(0);

    const steps: Array<{ pct: number; delay: number }> = [
      { pct: 30, delay: 300 },
      { pct: 55, delay: 700 },
      { pct: 75, delay: 1100 },
      { pct: 90, delay: 1500 },
      { pct: 100, delay: 1900 },
    ];

    steps.forEach(({ pct, delay }) => {
      setTimeout(() => {
        setProgress(pct);
        if (pct >= 55) setProcessState("processing");
        if (pct === 100) setTimeout(() => setProcessState("done"), 200);
      }, delay);
    });
  }

  const activeCategoryData = TOOL_CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0A0A0F", color: "#F8F8FC" }}>
      {/* ── Header ── */}
      <header className="border-b border-white/[0.08] px-6 py-4" style={{ backgroundColor: "#0D0D18" }}>
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
                <FilePlus className="w-[18px] h-[18px] text-indigo-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">PDF Studio</h1>
                <p className="text-xs text-white/35">{totalTools} tools · On-device processing</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
              <FilePlus className="w-4 h-4" />
              New File
            </button>
          </div>

          {/* Stats bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <StatsBadge label={`Tools available: ${totalTools}+`} />
            <StatsBadge label="Files processed today: 1,247" />
            <StatsBadge label="AI OCR accuracy: 99.2%" />
            <StatsBadge label="On-device processing: Private" />
          </div>

          {/* Recent files */}
          <div className="flex items-center gap-3 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
            <span className="text-xs text-white/30 shrink-0 font-medium">Recent:</span>
            {RECENT_FILES.map((f) => (
              <RecentFileChip key={f.name} file={f} />
            ))}
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-6 py-6 gap-6">
        {/* Category sidebar */}
        <nav className="w-48 shrink-0 space-y-1" aria-label="Tool categories">
          <button
            onClick={() => setActiveCategory("all")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
              activeCategory === "all"
                ? "bg-indigo-500/20 border border-indigo-500/40 text-indigo-300"
                : "text-white/50 hover:text-white/80 hover:bg-white/5 border border-transparent"
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span>All Tools</span>
            <span className="ml-auto text-xs opacity-60">{totalTools}</span>
          </button>

          {TOOL_CATEGORIES.map((cat) => {
            const CatIcon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left focus:outline-none focus:ring-2 focus:ring-white/20 border ${
                  isActive ? "" : "text-white/50 hover:text-white/80 hover:bg-white/5 border-transparent"
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: `${cat.color}18`,
                        borderColor: `${cat.color}44`,
                        color: cat.color,
                      }
                    : {}
                }
              >
                <CatIcon className="w-4 h-4 shrink-0" />
                <span>{cat.label}</span>
                <span className="ml-auto text-xs opacity-60">{cat.tools.length}</span>
              </button>
            );
          })}
        </nav>

        {/* Tool grid */}
        <main className="flex-1 min-w-0">
          {activeCategoryData && (
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 rounded-full" style={{ backgroundColor: activeCategoryData.color }} />
              <h2 className="text-sm font-semibold text-white/70">{activeCategoryData.label} Tools</h2>
              <span className="text-xs text-white/30">{activeCategoryData.tools.length} tools</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {visibleTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                categoryColor={tool.categoryColor}
                onClick={() => openTool(tool.id)}
              />
            ))}
          </div>
        </main>
      </div>

      {/* ── Tool Modal ── */}
      {activeTool && activeToolData && (
        <ProcessModal
          tool={activeToolData}
          processState={processState}
          progress={progress}
          onClose={closeTool}
          onProcess={handleProcess}
        />
      )}
    </div>
  );
}
