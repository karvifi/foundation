'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  MousePointer2, Type, StickyNote, Square, Sparkles,
  ZoomIn, ZoomOut, Maximize2, Share2, Trash2, Lock, Unlock, ChevronRight
} from 'lucide-react';

type BlockType = 'text' | 'sticky' | 'shape' | 'image' | 'embed' | 'ai' | 'metric';
type ShapeType = 'rect' | 'ellipse' | 'diamond';

interface CanvasBlock {
  id: string;
  type: BlockType;
  x: number;
  y: number;
  w: number;
  h: number;
  content: string;
  color?: string;
  shape?: ShapeType;
  locked?: boolean;
}

type Tool = 'select' | 'text' | 'sticky' | 'shape' | 'ai';

const INITIAL_BLOCKS: CanvasBlock[] = [
  { id: 'b1', type: 'text',   x: 200, y: 150, w: 320, h: 56,  content: 'Q2 2026 Planning' },
  { id: 'b2', type: 'sticky', x: 200, y: 280, w: 220, h: 130, content: 'Launch OmniOS v2 by June 1', color: '#FEF3C7' },
  { id: 'b3', type: 'sticky', x: 450, y: 280, w: 220, h: 130, content: 'Goal: 1000 paying teams',    color: '#EFF6FF' },
  { id: 'b4', type: 'sticky', x: 700, y: 280, w: 220, h: 130, content: 'Feature freeze: May 15',     color: '#F0FDF4' },
  { id: 'b5', type: 'metric', x: 200, y: 480, w: 200, h: 110, content: 'MRR $89.4K ↑4.2%' },
  { id: 'b6', type: 'metric', x: 450, y: 480, w: 200, h: 110, content: 'Pipeline $892K' },
  { id: 'b7', type: 'metric', x: 700, y: 480, w: 200, h: 110, content: 'NPS 72' },
  { id: 'b8', type: 'ai',     x: 950, y: 280, w: 260, h: 140, content: "Ask OmniMind: What's blocking Q2 target?" },
  { id: 'b9', type: 'shape',  x: 950, y: 480, w: 240, h: 100, content: 'Ship invoicing redesign', shape: 'rect' },
];

const STICKY_COLORS = ['#FEF3C7', '#EFF6FF', '#F0FDF4', '#FDF2F8', '#F5F3FF'];

const HANDLE_OFFSETS = [
  { id: 'tl', px: 0,   py: 0   },
  { id: 'tc', px: 0.5, py: 0   },
  { id: 'tr', px: 1,   py: 0   },
  { id: 'ml', px: 0,   py: 0.5 },
  { id: 'mr', px: 1,   py: 0.5 },
  { id: 'bl', px: 0,   py: 1   },
  { id: 'bc', px: 0.5, py: 1   },
  { id: 'br', px: 1,   py: 1   },
];

function MetricBlock({ block }: { block: CanvasBlock }) {
  const tokens = block.content.split(' ');
  const trend   = tokens.find(t => t.includes('↑') || t.includes('↓')) ?? '';
  const isUp    = trend.includes('↑');
  const rest    = tokens.filter(t => t !== trend);
  const value   = rest.filter(t => /[\d$K%.]+/.test(t)).join(' ');
  const label   = rest.filter(t => !/[\d$K%.]+/.test(t)).join(' ');

  return (
    <div className="flex flex-col justify-between h-full p-3">
      <span className="text-[10px] text-white/40 uppercase tracking-widest">{label || 'Metric'}</span>
      <span className="text-2xl font-bold text-white leading-none">{value || block.content}</span>
      {trend && (
        <span className={`text-sm font-semibold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>{trend}</span>
      )}
    </div>
  );
}

function ShapeBlock({ block }: { block: CanvasBlock }) {
  const s = block.shape ?? 'rect';
  const W = block.w;
  const H = block.h;
  return (
    <svg width={W} height={H} className="absolute inset-0">
      {s === 'rect' && (
        <rect x={2} y={2} width={W - 4} height={H - 4} rx={6}
          fill="rgba(99,102,241,0.08)" stroke="#6366f1" strokeWidth={2} />
      )}
      {s === 'ellipse' && (
        <ellipse cx={W / 2} cy={H / 2} rx={(W - 4) / 2} ry={(H - 4) / 2}
          fill="rgba(99,102,241,0.08)" stroke="#6366f1" strokeWidth={2} />
      )}
      {s === 'diamond' && (
        <polygon
          points={`${W / 2},2 ${W - 2},${H / 2} ${W / 2},${H - 2} 2,${H / 2}`}
          fill="rgba(99,102,241,0.08)" stroke="#6366f1" strokeWidth={2} />
      )}
      <text x={W / 2} y={H / 2} textAnchor="middle" dominantBaseline="middle"
        fill="white" fontSize={13} fontFamily="inherit">{block.content}</text>
    </svg>
  );
}

export default function CanvasPage() {
  const [blocks,    setBlocks]    = useState<CanvasBlock[]>(INITIAL_BLOCKS);
  const [viewport,  setViewport]  = useState({ x: 0, y: 0, zoom: 1 });
  const [selected,  setSelected]  = useState<string | null>(null);
  const [tool,      setTool]      = useState<Tool>('select');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dragging,  setDragging]  = useState<{ blockId: string; startCx: number; startCy: number; bx: number; by: number } | null>(null);
  const [panning,   setPanning]   = useState<{ startX: number; startY: number; vx: number; vy: number } | null>(null);

  const canvasRef  = useRef<HTMLDivElement>(null);
  const counterRef = useRef(100);

  const selectedBlock = blocks.find(b => b.id === selected) ?? null;

  const screenToCanvas = useCallback((sx: number, sy: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (sx - rect.left - viewport.x) / viewport.zoom,
      y: (sy - rect.top  - viewport.y) / viewport.zoom,
    };
  }, [viewport]);

  const updateBlock = useCallback((id: string, patch: Partial<CanvasBlock>) =>
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...patch } : b)), []);

  const deleteBlock = useCallback((id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
    setSelected(null);
  }, []);

  const fitScreen = useCallback(() => {
    if (!canvasRef.current || blocks.length === 0) return;
    const rect   = canvasRef.current.getBoundingClientRect();
    const minX   = Math.min(...blocks.map(b => b.x))       - 60;
    const minY   = Math.min(...blocks.map(b => b.y))       - 60;
    const maxX   = Math.max(...blocks.map(b => b.x + b.w)) + 60;
    const maxY   = Math.max(...blocks.map(b => b.y + b.h)) + 60;
    const zoom   = Math.min(rect.width / (maxX - minX), rect.height / (maxY - minY), 2);
    const x      = -minX * zoom + (rect.width  - (maxX - minX) * zoom) / 2;
    const y      = -minY * zoom + (rect.height - (maxY - minY) * zoom) / 2;
    setViewport({ x, y, zoom });
  }, [blocks]);

  // Global keydown
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSelected(null); setEditingId(null); setTool('select'); }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selected && !editingId) {
        deleteBlock(selected);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, editingId, deleteBlock]);

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('[data-block]')) return;

    if (tool !== 'select') {
      const pos = screenToCanvas(e.clientX, e.clientY);
      const id  = `b${++counterRef.current}`;
      const defaults: Record<Exclude<Tool, 'select'>, Partial<CanvasBlock>> = {
        text:   { type: 'text',   w: 240, h: 56,  content: 'New text' },
        sticky: { type: 'sticky', w: 220, h: 130, content: 'Note', color: '#FEF3C7' },
        shape:  { type: 'shape',  w: 200, h: 100, content: 'Shape', shape: 'rect' },
        ai:     { type: 'ai',     w: 260, h: 140, content: 'Ask OmniMind…' },
      };
      const d = defaults[tool as Exclude<Tool, 'select'>];
      const block: CanvasBlock = {
        id, x: pos.x - (d.w ?? 200) / 2, y: pos.y - (d.h ?? 100) / 2, ...d,
      } as CanvasBlock;
      setBlocks(prev => [...prev, block]);
      setSelected(id);
      setTool('select');
      return;
    }

    setSelected(null);
    setPanning({ startX: e.clientX, startY: e.clientY, vx: viewport.x, vy: viewport.y });
  };

  const handleBlockMouseDown = (e: React.MouseEvent, block: CanvasBlock) => {
    if (block.locked || tool !== 'select') return;
    e.stopPropagation();
    setSelected(block.id);
    const pos = screenToCanvas(e.clientX, e.clientY);
    setDragging({ blockId: block.id, startCx: pos.x, startCy: pos.y, bx: block.x, by: block.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (panning) {
      setViewport(v => ({ ...v, x: panning.vx + e.clientX - panning.startX, y: panning.vy + e.clientY - panning.startY }));
    }
    if (dragging) {
      const pos = screenToCanvas(e.clientX, e.clientY);
      updateBlock(dragging.blockId, {
        x: dragging.bx + pos.x - dragging.startCx,
        y: dragging.by + pos.y - dragging.startCy,
      });
    }
  };

  const handleMouseUp = () => { setPanning(null); setDragging(null); };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    const ox = e.clientX - rect.left;
    const oy = e.clientY - rect.top;
    setViewport(v => {
      const newZoom = Math.min(3, Math.max(0.25, v.zoom * factor));
      const scale   = newZoom / v.zoom;
      return { zoom: newZoom, x: ox - (ox - v.x) * scale, y: oy - (oy - v.y) * scale };
    });
  };

  // Minimap geometry
  const allX  = blocks.map(b => b.x);
  const allY  = blocks.map(b => b.y);
  const mmMinX = Math.min(...allX, 0);
  const mmMinY = Math.min(...allY, 0);
  const mmMaxX = Math.max(...blocks.map(b => b.x + b.w), mmMinX + 1400);
  const mmMaxY = Math.max(...blocks.map(b => b.y + b.h), mmMinY + 800);
  const MM_W = 140, MM_H = 80;
  const mmSX = MM_W / (mmMaxX - mmMinX);
  const mmSY = MM_H / (mmMaxY - mmMinY);

  const TOOLS: { id: Tool; icon: React.ReactNode; label: string }[] = [
    { id: 'select', icon: <MousePointer2 size={14} />, label: 'Select'  },
    { id: 'text',   icon: <Type           size={14} />, label: 'Text'   },
    { id: 'sticky', icon: <StickyNote     size={14} />, label: 'Sticky' },
    { id: 'shape',  icon: <Square         size={14} />, label: 'Shape'  },
    { id: 'ai',     icon: <Sparkles       size={14} />, label: 'AI'     },
  ];

  const canvasCursor = tool !== 'select' ? 'crosshair' : panning ? 'grabbing' : 'grab';

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#080810] select-none">

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize:     `${28 * viewport.zoom}px ${28 * viewport.zoom}px`,
          backgroundPosition: `${viewport.x % (28 * viewport.zoom)}px ${viewport.y % (28 * viewport.zoom)}px`,
        }}
      />

      {/* ── Toolbar ────────────────────────────────────────────────────── */}
      <header className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1
                         bg-[#12121e]/90 border border-white/10 backdrop-blur-md
                         rounded-xl px-2 py-1.5 shadow-2xl">
        {TOOLS.map(t => (
          <button
            key={t.id}
            aria-label={t.label}
            aria-pressed={tool === t.id}
            onClick={() => setTool(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
              ${tool === t.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40'
                : 'text-white/60 hover:text-white hover:bg-white/[0.08]'}`}
          >
            {t.icon} {t.label}
          </button>
        ))}

        <div className="w-px h-5 bg-white/10 mx-1" aria-hidden />

        <button aria-label="Zoom out"
          onClick={() => setViewport(v => ({ ...v, zoom: Math.max(0.25, v.zoom / 1.2) }))}
          className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.08] transition-all">
          <ZoomOut size={14} />
        </button>
        <span className="w-12 text-center text-xs text-white/60 font-mono" aria-live="polite">
          {Math.round(viewport.zoom * 100)}%
        </span>
        <button aria-label="Zoom in"
          onClick={() => setViewport(v => ({ ...v, zoom: Math.min(3, v.zoom * 1.2) }))}
          className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.08] transition-all">
          <ZoomIn size={14} />
        </button>
        <button aria-label="Fit screen" onClick={fitScreen}
          className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.08] transition-all">
          <Maximize2 size={14} />
        </button>

        <div className="w-px h-5 bg-white/10 mx-1" aria-hidden />

        <button aria-label="Share"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                     text-white/60 hover:text-white hover:bg-white/[0.08] transition-all">
          <Share2 size={14} /> Share
        </button>
      </header>

      {/* ── Canvas ─────────────────────────────────────────────────────── */}
      <main
        ref={canvasRef}
        className="absolute inset-0"
        style={{ cursor: canvasCursor }}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        aria-label="Infinite canvas workspace"
      >
        <div
          className="absolute top-0 left-0"
          style={{
            transform: `translate(${viewport.x}px,${viewport.y}px) scale(${viewport.zoom})`,
            transformOrigin: '0 0',
          }}
        >
          {blocks.map(block => {
            const isSel = selected === block.id;
            const isEd  = editingId === block.id;

            return (
              <div
                key={block.id}
                data-block
                role="button"
                tabIndex={0}
                aria-label={`${block.type} block: ${block.content}`}
                aria-selected={isSel}
                className={`absolute ${isSel ? 'z-30' : 'z-10'}`}
                style={{ left: block.x, top: block.y, width: block.w, height: block.h }}
                onMouseDown={e => handleBlockMouseDown(e, block)}
                onDoubleClick={() => {
                  if (block.type === 'text' || block.type === 'sticky') setEditingId(block.id);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') setSelected(block.id);
                }}
              >
                {/* ── text ── */}
                {block.type === 'text' && (
                  <div className={`w-full h-full rounded-lg bg-[#1a1a2e] px-3 py-2 overflow-hidden shadow-xl
                    border ${isSel ? 'border-indigo-500' : 'border-white/10'}`}>
                    {isEd ? (
                      <textarea
                        autoFocus
                        defaultValue={block.content}
                        className="w-full h-full resize-none bg-transparent text-white text-2xl font-bold outline-none"
                        onBlur={e => { updateBlock(block.id, { content: e.target.value }); setEditingId(null); }}
                      />
                    ) : (
                      <p className="text-white text-2xl font-bold leading-tight break-words">{block.content}</p>
                    )}
                  </div>
                )}

                {/* ── sticky ── */}
                {block.type === 'sticky' && (
                  <div
                    className="w-full h-full rounded-xl px-3 py-3 overflow-hidden"
                    style={{
                      background: block.color ?? '#FEF3C7',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.3)',
                    }}
                  >
                    {isEd ? (
                      <textarea
                        autoFocus
                        defaultValue={block.content}
                        className="w-full h-full resize-none bg-transparent text-sm font-medium text-gray-800 outline-none"
                        onBlur={e => { updateBlock(block.id, { content: e.target.value }); setEditingId(null); }}
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-800 leading-snug break-words">{block.content}</p>
                    )}
                  </div>
                )}

                {/* ── metric ── */}
                {block.type === 'metric' && (
                  <div className={`w-full h-full rounded-xl bg-[#0f0f1a] overflow-hidden shadow-xl
                    border ${isSel ? 'border-indigo-500' : 'border-white/10'}`}>
                    <MetricBlock block={block} />
                  </div>
                )}

                {/* ── ai ── */}
                {block.type === 'ai' && (
                  <div
                    className={`w-full h-full rounded-xl overflow-hidden shadow-xl
                      border ${isSel ? 'border-indigo-400' : 'border-indigo-500/40'}`}
                    style={{ background: 'linear-gradient(135deg,#1e1b4b 0%,#2e1065 100%)' }}
                  >
                    <div className="flex flex-col h-full p-3 gap-2">
                      <div className="flex items-center gap-1.5">
                        <Sparkles size={13} className="text-indigo-300" aria-hidden />
                        <span className="text-[10px] font-semibold text-indigo-200 uppercase tracking-wider">OmniMind</span>
                      </div>
                      <p className="text-sm text-white/80 flex-1 leading-snug">{block.content}</p>
                      <button
                        aria-label="Submit AI query"
                        className="self-start flex items-center gap-0.5 text-xs text-indigo-300 hover:text-white font-medium transition-colors"
                        onClick={e => e.stopPropagation()}
                      >
                        Ask <ChevronRight size={12} aria-hidden />
                      </button>
                    </div>
                  </div>
                )}

                {/* ── shape ── */}
                {block.type === 'shape' && (
                  <div className="w-full h-full relative">
                    <ShapeBlock block={block} />
                  </div>
                )}

                {/* Selection ring + handles */}
                {isSel && (
                  <>
                    <div
                      className="absolute inset-0 rounded-lg ring-2 ring-indigo-500 pointer-events-none"
                      aria-hidden
                    />
                    {HANDLE_OFFSETS.map(h => (
                      <div
                        key={h.id}
                        aria-hidden
                        className="absolute w-2 h-2 bg-white border-2 border-indigo-500 rounded-sm"
                        style={{
                          left:      `calc(${h.px * 100}% - 4px)`,
                          top:       `calc(${h.py * 100}% - 4px)`,
                          cursor:    h.px === 0 && h.py === 0 ? 'nwse-resize'
                                   : h.px === 1 && h.py === 1 ? 'nwse-resize'
                                   : h.px === 0 && h.py === 1 ? 'nesw-resize'
                                   : h.px === 1 && h.py === 0 ? 'nesw-resize'
                                   : h.px === 0.5           ? 'ns-resize'
                                   : 'ew-resize',
                          zIndex: 50,
                        }}
                      />
                    ))}
                  </>
                )}

                {/* Lock badge */}
                {block.locked && (
                  <div className="absolute top-1 right-1 p-0.5 rounded bg-black/50" aria-label="Locked">
                    <Lock size={10} className="text-white/60" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* ── Right panel ────────────────────────────────────────────────── */}
      {selectedBlock && (
        <aside
          aria-label="Block properties"
          className="absolute right-4 top-16 z-50 w-56
                     bg-[#12121e]/95 border border-white/10 backdrop-blur-md
                     rounded-xl shadow-2xl p-4 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">
              {selectedBlock.type}
            </span>
            <div className="flex gap-1">
              <button
                aria-label={selectedBlock.locked ? 'Unlock block' : 'Lock block'}
                onClick={() => updateBlock(selectedBlock.id, { locked: !selectedBlock.locked })}
                className="p-1 rounded text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                {selectedBlock.locked ? <Unlock size={13} /> : <Lock size={13} />}
              </button>
              <button
                aria-label="Delete block"
                onClick={() => deleteBlock(selectedBlock.id)}
                className="p-1 rounded text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {(['x', 'y', 'w', 'h'] as const).map(key => (
              <label key={key} className="flex flex-col gap-1">
                <span className="text-[10px] text-white/40 uppercase">{key}</span>
                <input
                  type="number"
                  aria-label={`Block ${key}`}
                  value={Math.round(selectedBlock[key])}
                  onChange={e => updateBlock(selectedBlock.id, { [key]: Number(e.target.value) })}
                  className="bg-white/5 border border-white/10 rounded-md px-2 py-1 text-xs text-white
                             outline-none focus:border-indigo-500 transition-colors w-full"
                />
              </label>
            ))}
          </div>

          {selectedBlock.type === 'sticky' && (
            <fieldset>
              <legend className="text-[10px] text-white/40 uppercase mb-1.5">Color</legend>
              <div className="flex gap-2">
                {STICKY_COLORS.map(c => (
                  <button
                    key={c}
                    aria-label={`Sticky color ${c}`}
                    aria-pressed={selectedBlock.color === c}
                    onClick={() => updateBlock(selectedBlock.id, { color: c })}
                    className={`w-6 h-6 rounded-full border-2 transition-all
                      ${selectedBlock.color === c ? 'border-white scale-110' : 'border-transparent'}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </fieldset>
          )}

          {selectedBlock.type === 'shape' && (
            <fieldset>
              <legend className="text-[10px] text-white/40 uppercase mb-1.5">Shape</legend>
              <div className="flex gap-1">
                {(['rect', 'ellipse', 'diamond'] as ShapeType[]).map(s => (
                  <button
                    key={s}
                    aria-label={s}
                    aria-pressed={selectedBlock.shape === s}
                    onClick={() => updateBlock(selectedBlock.id, { shape: s })}
                    className={`flex-1 py-1 text-xs rounded-md border transition-all
                      ${selectedBlock.shape === s
                        ? 'border-indigo-500 bg-indigo-600/30 text-white'
                        : 'border-white/10 text-white/40 hover:text-white'}`}
                  >
                    {s[0].toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
        </aside>
      )}

      {/* ── Minimap ────────────────────────────────────────────────────── */}
      <div
        aria-hidden
        className="absolute bottom-5 right-5 z-50 rounded-xl overflow-hidden
                   border border-white/10 bg-[#0c0c18]/80 backdrop-blur-sm shadow-xl"
        style={{ width: MM_W, height: MM_H }}
      >
        <svg width={MM_W} height={MM_H}>
          {blocks.map(b => (
            <rect
              key={b.id}
              x={(b.x - mmMinX) * mmSX}
              y={(b.y - mmMinY) * mmSY}
              width={Math.max(2, b.w * mmSX)}
              height={Math.max(2, b.h * mmSY)}
              rx={1}
              fill={
                b.type === 'sticky' ? (b.color ?? '#FEF3C7') + 'bb'
                : b.type === 'ai'   ? '#6366f1aa'
                : '#ffffff22'
              }
              stroke={selected === b.id ? '#6366f1' : 'none'}
              strokeWidth={1}
            />
          ))}
          {canvasRef.current && (() => {
            const rect = canvasRef.current.getBoundingClientRect();
            const vx   = (-viewport.x / viewport.zoom - mmMinX) * mmSX;
            const vy   = (-viewport.y / viewport.zoom - mmMinY) * mmSY;
            const vw   = (rect.width  / viewport.zoom) * mmSX;
            const vh   = (rect.height / viewport.zoom) * mmSY;
            return <rect x={vx} y={vy} width={vw} height={vh} rx={2} fill="none" stroke="#6366f1" strokeWidth={1.5} opacity={0.8} />;
          })()}
        </svg>
      </div>

      {/* ── Tool hint ──────────────────────────────────────────────────── */}
      {tool !== 'select' && (
        <div
          role="status"
          aria-live="polite"
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50
                     px-4 py-2 bg-indigo-600/90 backdrop-blur-sm rounded-full
                     text-xs text-white font-medium shadow-xl border border-indigo-400/30"
        >
          Click anywhere to place {tool} block · Esc to cancel
        </div>
      )}
    </div>
  );
}
