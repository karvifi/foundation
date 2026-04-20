'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  MousePointer2, Monitor, Square, Circle, Type, Minus, Image,
  ZoomIn, ZoomOut, Maximize2, AlignLeft, AlignCenter, AlignRight,
  Eye, EyeOff, Lock, Unlock, Trash2, Copy, ChevronRight,
  Plus, Download, Layers, Palette,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type ToolType = 'select' | 'frame' | 'rect' | 'ellipse' | 'text' | 'line' | 'pen' | 'image';

type DesignElement = {
  id: string;
  type: 'frame' | 'rect' | 'ellipse' | 'text' | 'line' | 'group';
  name: string;
  x: number; y: number; w: number; h: number;
  fill: string; stroke: string; strokeWidth: number;
  opacity: number; rotation: number;
  content?: string;
  fontSize?: number; fontWeight?: number;
  rx?: number;
  locked: boolean; visible: boolean;
  parentId?: string;
};

type Page = { id: string; name: string; elements: DesignElement[] };

// ── Constants ─────────────────────────────────────────────────────────────────

const PALETTE = ['#6366F1', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#EF4444', '#FFFFFF', '#000000'];

const FONT_WEIGHTS = [
  { label: 'Regular',  value: 400 },
  { label: 'Medium',   value: 500 },
  { label: 'SemiBold', value: 600 },
  { label: 'Bold',     value: 700 },
];

const INITIAL_ELEMENTS: DesignElement[] = [
  { id: 'f1', type: 'frame',   name: 'Main Frame',     x: 100, y: 60,  w: 800, h: 500, fill: '#0D0D14', stroke: 'none',      strokeWidth: 0, opacity: 1,    rotation: 0, locked: false, visible: true,  rx: 12 },
  { id: 'r1', type: 'rect',    name: 'Hero BG',        x: 100, y: 60,  w: 800, h: 200, fill: '#6366F1', stroke: 'none',      strokeWidth: 0, opacity: 0.15, rotation: 0, locked: false, visible: true,  rx: 12 },
  { id: 't1', type: 'text',    name: 'Title',          x: 160, y: 120, w: 400, h: 60,  fill: '#FFFFFF', stroke: 'none',      strokeWidth: 0, opacity: 1,    rotation: 0, locked: false, visible: true,  content: 'OmniOS Design Studio', fontSize: 32, fontWeight: 700 },
  { id: 't2', type: 'text',    name: 'Subtitle',       x: 160, y: 175, w: 500, h: 30,  fill: '#A5B4FC', stroke: 'none',      strokeWidth: 0, opacity: 1,    rotation: 0, locked: false, visible: true,  content: 'Design, prototype and ship at the speed of thought', fontSize: 14, fontWeight: 400 },
  { id: 'r2', type: 'rect',    name: 'CTA Button',     x: 160, y: 220, w: 140, h: 44,  fill: '#6366F1', stroke: 'none',      strokeWidth: 0, opacity: 1,    rotation: 0, locked: false, visible: true,  rx: 8 },
  { id: 't3', type: 'text',    name: 'CTA Text',       x: 184, y: 235, w: 100, h: 20,  fill: '#FFFFFF', stroke: 'none',      strokeWidth: 0, opacity: 1,    rotation: 0, locked: false, visible: true,  content: 'Get started →', fontSize: 13, fontWeight: 600 },
  { id: 'r3', type: 'rect',    name: 'Feature Card 1', x: 140, y: 310, w: 220, h: 120, fill: '#13131C', stroke: '#ffffff15', strokeWidth: 1, opacity: 1,    rotation: 0, locked: false, visible: true,  rx: 10 },
  { id: 'r4', type: 'rect',    name: 'Feature Card 2', x: 390, y: 310, w: 220, h: 120, fill: '#13131C', stroke: '#ffffff15', strokeWidth: 1, opacity: 1,    rotation: 0, locked: false, visible: true,  rx: 10 },
  { id: 'r5', type: 'rect',    name: 'Feature Card 3', x: 640, y: 310, w: 220, h: 120, fill: '#13131C', stroke: '#ffffff15', strokeWidth: 1, opacity: 1,    rotation: 0, locked: false, visible: true,  rx: 10 },
  { id: 'e1', type: 'ellipse', name: 'Glow Accent',    x: 600, y: 80,  w: 200, h: 200, fill: '#8B5CF6', stroke: 'none',      strokeWidth: 0, opacity: 0.12, rotation: 0, locked: false, visible: true },
];

// ── Utility helpers ───────────────────────────────────────────────────────────

function makeId() { return Math.random().toString(36).slice(2, 8); }

function elementIcon(type: DesignElement['type']) {
  const cls = 'w-3 h-3 shrink-0';
  if (type === 'frame')   return <Monitor   className={cls} />;
  if (type === 'rect')    return <Square    className={cls} />;
  if (type === 'ellipse') return <Circle    className={cls} />;
  if (type === 'text')    return <Type      className={cls} />;
  if (type === 'line')    return <Minus     className={cls} />;
  return <Layers className={cls} />;
}

function defaultForTool(tool: ToolType, x: number, y: number): Omit<DesignElement, 'id' | 'name'> {
  const base = { x, y, w: 160, h: 100, strokeWidth: 1, opacity: 1, rotation: 0, locked: false, visible: true };
  switch (tool) {
    case 'text':    return { ...base, type: 'text',    fill: '#FFFFFF', stroke: 'none', strokeWidth: 0, w: 200, h: 32, content: 'Text', fontSize: 16, fontWeight: 400 };
    case 'ellipse': return { ...base, type: 'ellipse', fill: '#6366F1', stroke: 'none', strokeWidth: 0, w: 120, h: 120 };
    case 'frame':   return { ...base, type: 'frame',   fill: '#0D0D14', stroke: '#6366F1', w: 400, h: 300, rx: 8 };
    case 'line':    return { ...base, type: 'line',    fill: 'none',    stroke: '#6366F1', strokeWidth: 2, h: 2 };
    default:        return { ...base, type: 'rect',    fill: '#6366F1', stroke: 'none', strokeWidth: 0, rx: 0 };
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="absolute z-50 top-full left-0 mt-1 p-2 rounded-lg border border-white/10 bg-[#1a1a2e] shadow-2xl grid grid-cols-4 gap-1">
      {PALETTE.map(c => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className="w-7 h-7 rounded-md border-2 transition-transform hover:scale-110"
          style={{ background: c, borderColor: value === c ? '#6366F1' : 'transparent' }}
        />
      ))}
    </div>
  );
}

function NumInput({ label, value, onChange, min, max }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number;
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[10px] text-white/40 w-4 shrink-0">{label}</span>
      <input
        type="number" value={Math.round(value)} min={min} max={max}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none focus:border-indigo-500"
      />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-2">{children}</p>;
}

// ── Page component ────────────────────────────────────────────────────────────

export default function DesignPage() {
  const [pages, setPages]             = useState<Page[]>([{ id: 'p1', name: 'Page 1', elements: INITIAL_ELEMENTS }]);
  const [pageId, setPageId]           = useState('p1');
  const [selectedId, setSelectedId]   = useState<string | null>(null);
  const [tool, setTool]               = useState<ToolType>('select');
  const [zoom, setZoom]               = useState(0.85);
  const [colorPicker, setColorPicker] = useState<'fill' | 'stroke' | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [toast, setToast]             = useState<string | null>(null);
  const [hovered, setHovered]         = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  const [dragState, setDragState]     = useState<{ id: string; ox: number; oy: number; mx: number; my: number } | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  const currentPage = pages.find(p => p.id === pageId)!;
  const elements    = currentPage.elements;
  const selected    = elements.find(e => e.id === selectedId) ?? null;

  const setElements = useCallback((updater: (prev: DesignElement[]) => DesignElement[]) => {
    setPages(prev => prev.map(p => p.id === pageId ? { ...p, elements: updater(p.elements) } : p));
  }, [pageId]);

  const updateEl = useCallback(<K extends keyof DesignElement>(id: string, key: K, val: DesignElement[K]) => {
    setElements(prev => prev.map(e => e.id === id ? { ...e, [key]: val } : e));
  }, [setElements]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

  // Canvas click — place new element or deselect
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) / zoom);
    const y = Math.round((e.clientY - rect.top)  / zoom);

    if (tool !== 'select') {
      const newEl: DesignElement = {
        id: makeId(),
        name: `${tool.charAt(0).toUpperCase() + tool.slice(1)} ${elements.length + 1}`,
        ...defaultForTool(tool, x, y),
      } as DesignElement;
      setElements(prev => [...prev, newEl]);
      setSelectedId(newEl.id);
      setTool('select');
      return;
    }
    setSelectedId(null);
    setColorPicker(null);
    setContextMenu(null);
  }, [tool, elements.length, zoom, setElements]);

  // Element mouse down — select + initiate drag
  const handleElMouseDown = useCallback((e: React.MouseEvent, el: DesignElement) => {
    e.stopPropagation();
    if (el.locked) return;
    setSelectedId(el.id);
    setColorPicker(null);
    setContextMenu(null);
    setDragState({ id: el.id, ox: el.x, oy: el.y, mx: e.clientX, my: e.clientY });
  }, []);

  // Global mouse move / up for dragging
  useEffect(() => {
    if (!dragState) return;
    const onMove = (e: MouseEvent) => {
      const dx = (e.clientX - dragState.mx) / zoom;
      const dy = (e.clientY - dragState.my) / zoom;
      setElements(prev => prev.map(el =>
        el.id === dragState.id ? { ...el, x: Math.round(dragState.ox + dx), y: Math.round(dragState.oy + dy) } : el,
      ));
    };
    const onUp = () => setDragState(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [dragState, zoom, setElements]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!selectedId || editingTextId) return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        setElements(prev => prev.filter(el => el.id !== selectedId));
        setSelectedId(null);
      }
      if (e.key === 'd' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setElements(prev => {
          const src = prev.find(el => el.id === selectedId);
          if (!src) return prev;
          return [...prev, { ...src, id: makeId(), name: src.name + ' copy', x: src.x + 20, y: src.y + 20 }];
        });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId, editingTextId, setElements]);

  const adjustZoom = (delta: number) => setZoom(z => Math.min(4, Math.max(0.1, +(z + delta).toFixed(2))));

  const deleteEl = (id: string) => {
    setElements(prev => prev.filter(e => e.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const duplicateEl = (id: string) => setElements(prev => {
    const src = prev.find(e => e.id === id);
    if (!src) return prev;
    return [...prev, { ...src, id: makeId(), name: src.name + ' copy', x: src.x + 20, y: src.y + 20 }];
  });

  const bringForward = () => setElements(prev => {
    const idx = prev.findIndex(e => e.id === selectedId);
    if (idx < prev.length - 1) { const a = [...prev]; [a[idx], a[idx + 1]] = [a[idx + 1], a[idx]]; return a; }
    return prev;
  });
  const sendBackward = () => setElements(prev => {
    const idx = prev.findIndex(e => e.id === selectedId);
    if (idx > 0) { const a = [...prev]; [a[idx], a[idx - 1]] = [a[idx - 1], a[idx]]; return a; }
    return prev;
  });

  const addPage = () => {
    const p: Page = { id: makeId(), name: `Page ${pages.length + 1}`, elements: [] };
    setPages(prev => [...prev, p]);
    setPageId(p.id);
    setSelectedId(null);
  };

  // ── Render canvas element ─────────────────────────────────────────────────

  const renderElement = (el: DesignElement) => {
    if (!el.visible) return null;
    const isSel = el.id === selectedId;
    const isHov = el.id === hovered && !isSel;

    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: el.x, top: el.y, width: el.w, height: el.h,
      opacity: el.opacity,
      transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
      cursor: el.locked ? 'not-allowed' : dragState?.id === el.id ? 'grabbing' : 'grab',
      userSelect: 'none',
      boxSizing: 'border-box',
    };

    if (el.type === 'text') {
      return (
        <div key={el.id} style={baseStyle}
          onMouseDown={ev => handleElMouseDown(ev, el)}
          onMouseEnter={() => setHovered(el.id)}
          onMouseLeave={() => setHovered(null)}
          onContextMenu={ev => { ev.preventDefault(); ev.stopPropagation(); setContextMenu({ id: el.id, x: ev.clientX, y: ev.clientY }); }}
        >
          <div
            suppressContentEditableWarning
            contentEditable={editingTextId === el.id}
            onDoubleClick={ev => { ev.stopPropagation(); setEditingTextId(el.id); }}
            onBlur={ev => { updateEl(el.id, 'content', ev.currentTarget.textContent ?? ''); setEditingTextId(null); }}
            style={{ width: '100%', height: '100%', color: el.fill, fontSize: el.fontSize, fontWeight: el.fontWeight, lineHeight: 1.3, outline: 'none', whiteSpace: 'pre-wrap', overflow: 'hidden' }}
          >{el.content}</div>
          {isSel && <SelectionOverlay />}
          {isHov && <HoverOverlay />}
        </div>
      );
    }

    const shapeStyle: React.CSSProperties = { ...baseStyle };
    if (el.type === 'ellipse') {
      shapeStyle.background  = el.fill === 'none' ? 'transparent' : el.fill;
      shapeStyle.borderRadius = '50%';
      shapeStyle.border = el.stroke !== 'none' && el.strokeWidth ? `${el.strokeWidth}px solid ${el.stroke}` : undefined;
    } else if (el.type === 'line') {
      shapeStyle.height     = el.strokeWidth || 2;
      shapeStyle.background = el.stroke !== 'none' ? el.stroke : el.fill;
      shapeStyle.borderRadius = 2;
    } else {
      shapeStyle.background  = el.fill === 'none' ? 'transparent' : el.fill;
      shapeStyle.borderRadius = el.rx ?? 0;
      shapeStyle.border = el.stroke !== 'none' && el.strokeWidth ? `${el.strokeWidth}px solid ${el.stroke}` : undefined;
      if (el.type === 'frame') shapeStyle.boxShadow = '0 8px 32px rgba(0,0,0,0.5)';
    }

    return (
      <div key={el.id} style={shapeStyle}
        onMouseDown={ev => handleElMouseDown(ev, el)}
        onMouseEnter={() => setHovered(el.id)}
        onMouseLeave={() => setHovered(null)}
        onContextMenu={ev => { ev.preventDefault(); ev.stopPropagation(); setContextMenu({ id: el.id, x: ev.clientX, y: ev.clientY }); }}
      >
        {isSel && <SelectionOverlay />}
        {isHov && <HoverOverlay />}
      </div>
    );
  };

  // ── Properties panel ──────────────────────────────────────────────────────

  const renderProps = () => {
    if (!selected) return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-white/20">
        <Palette className="w-8 h-8" />
        <p className="text-xs">Select an element</p>
      </div>
    );

    const el = selected;

    return (
      <div className="flex flex-col gap-4 p-3 overflow-y-auto h-full" onClick={() => setColorPicker(null)}>
        {/* Position & Size */}
        <div>
          <SectionTitle>Position & Size</SectionTitle>
          <div className="grid grid-cols-2 gap-1.5">
            <NumInput label="X" value={el.x} onChange={v => updateEl(el.id, 'x', v)} />
            <NumInput label="Y" value={el.y} onChange={v => updateEl(el.id, 'y', v)} />
            <NumInput label="W" value={el.w} onChange={v => updateEl(el.id, 'w', Math.max(1, v))} min={1} />
            <NumInput label="H" value={el.h} onChange={v => updateEl(el.id, 'h', Math.max(1, v))} min={1} />
          </div>
          <div className="mt-1.5">
            <NumInput label="R°" value={el.rotation} onChange={v => updateEl(el.id, 'rotation', v)} min={-360} max={360} />
          </div>
        </div>

        {/* Fill */}
        <div>
          <SectionTitle>Fill</SectionTitle>
          <div className="flex items-center gap-2 relative">
            <button
              className="w-7 h-7 rounded-md border border-white/20 shrink-0"
              style={{ background: el.fill === 'none' ? 'transparent' : el.fill }}
              onClick={ev => { ev.stopPropagation(); setColorPicker(colorPicker === 'fill' ? null : 'fill'); }}
            />
            <span className="text-xs text-white/60 font-mono">{el.fill}</span>
            {colorPicker === 'fill' && (
              <ColorPicker value={el.fill} onChange={c => { updateEl(el.id, 'fill', c); setColorPicker(null); }} />
            )}
          </div>
        </div>

        {/* Stroke */}
        <div>
          <SectionTitle>Stroke</SectionTitle>
          <div className="flex items-center gap-2 mb-1.5 relative">
            <button
              className="w-7 h-7 rounded-md border border-white/20 shrink-0"
              style={{ background: el.stroke === 'none' ? 'transparent' : el.stroke }}
              onClick={ev => { ev.stopPropagation(); setColorPicker(colorPicker === 'stroke' ? null : 'stroke'); }}
            />
            <span className="text-xs text-white/60 font-mono">{el.stroke}</span>
            {colorPicker === 'stroke' && (
              <ColorPicker value={el.stroke} onChange={c => { updateEl(el.id, 'stroke', c); setColorPicker(null); }} />
            )}
          </div>
          <NumInput label="W" value={el.strokeWidth} onChange={v => updateEl(el.id, 'strokeWidth', Math.max(0, v))} min={0} />
        </div>

        {/* Corner radius — rect / frame only */}
        {(el.type === 'rect' || el.type === 'frame') && (
          <div>
            <SectionTitle>Corner Radius</SectionTitle>
            <NumInput label="r" value={el.rx ?? 0} onChange={v => updateEl(el.id, 'rx', Math.max(0, v))} min={0} />
          </div>
        )}

        {/* Typography — text only */}
        {el.type === 'text' && (
          <div>
            <SectionTitle>Typography</SectionTitle>
            <div className="grid grid-cols-2 gap-1.5 mb-1.5">
              <NumInput label="px" value={el.fontSize ?? 16} onChange={v => updateEl(el.id, 'fontSize', Math.max(6, v))} min={6} />
              <select
                value={el.fontWeight ?? 400}
                onChange={e => updateEl(el.id, 'fontWeight', Number(e.target.value))}
                className="bg-white/5 border border-white/10 rounded px-1 py-0.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {FONT_WEIGHTS.map(fw => <option key={fw.value} value={fw.value}>{fw.label}</option>)}
              </select>
            </div>
            <div className="flex gap-1">
              {([AlignLeft, AlignCenter, AlignRight] as const).map((Icon, i) => (
                <button key={i} className="flex-1 flex justify-center py-1 rounded bg-white/5 hover:bg-white/10 text-white/60">
                  <Icon className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Opacity */}
        <div>
          <SectionTitle>Opacity</SectionTitle>
          <div className="flex items-center gap-2">
            <input type="range" min={0} max={1} step={0.01} value={el.opacity}
              onChange={e => updateEl(el.id, 'opacity', Number(e.target.value))}
              className="flex-1 accent-indigo-500" />
            <span className="text-xs text-white/60 w-8 text-right">{Math.round(el.opacity * 100)}%</span>
          </div>
        </div>

        {/* Layer actions */}
        <div>
          <SectionTitle>Layer</SectionTitle>
          <div className="grid grid-cols-2 gap-1.5">
            <button onClick={bringForward} className="text-xs py-1.5 rounded bg-white/5 hover:bg-white/10 text-white/70 transition-colors">Forward</button>
            <button onClick={sendBackward} className="text-xs py-1.5 rounded bg-white/5 hover:bg-white/10 text-white/70 transition-colors">Backward</button>
            <button onClick={() => duplicateEl(el.id)} className="flex items-center justify-center gap-1 text-xs py-1.5 rounded bg-white/5 hover:bg-white/10 text-white/70 transition-colors">
              <Copy className="w-3 h-3" /> Duplicate
            </button>
            <button onClick={() => deleteEl(el.id)} className="flex items-center justify-center gap-1 text-xs py-1.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors">
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ── Toolbar tool buttons config ───────────────────────────────────────────

  const toolButtons: { t: ToolType; Icon: React.FC<{ className?: string }>; label: string }[] = [
    { t: 'select',  Icon: MousePointer2, label: 'Select (V)'   },
    { t: 'frame',   Icon: Monitor,       label: 'Frame (F)'    },
    { t: 'rect',    Icon: Square,        label: 'Rect (R)'     },
    { t: 'ellipse', Icon: Circle,        label: 'Ellipse (E)'  },
    { t: 'text',    Icon: Type,          label: 'Text (T)'     },
    { t: 'line',    Icon: Minus,         label: 'Line (L)'     },
    { t: 'image',   Icon: Image,         label: 'Image'        },
  ];

  // ── JSX ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-screen bg-[#0D0D14] text-white font-sans select-none overflow-hidden">

      {/* Top menu bar */}
      <div className="flex items-center h-9 border-b border-white/10 bg-[#0D0D14] shrink-0 px-3 z-50 gap-1">
        <div className="flex items-center gap-2 pr-4 border-r border-white/10 mr-1">
          <div className="w-5 h-5 rounded bg-indigo-500 flex items-center justify-center">
            <Palette className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs font-semibold text-indigo-300">OmniOS Design</span>
        </div>
        {['File', 'Edit', 'View', 'Insert', 'Layers', 'Assets', 'Prototype', 'Help'].map(m => (
          <button key={m} className="px-2.5 py-1 text-xs text-white/50 hover:text-white hover:bg-white/5 rounded transition-colors">{m}</button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* ── Left: Layers panel ──────────────────────────────────────────── */}
        <div className="w-60 shrink-0 flex flex-col border-r border-white/10 bg-[#111118]">
          {/* Pages header */}
          <div className="flex items-center gap-1 px-2 py-1.5 border-b border-white/10 shrink-0">
            <Layers className="w-3 h-3 text-white/40" />
            <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider flex-1">Pages</span>
            <button onClick={addPage} className="p-0.5 rounded hover:bg-white/10 text-white/40 hover:text-white" aria-label="Add page">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          {/* Page tabs */}
          <div className="flex gap-1 px-2 py-1.5 border-b border-white/10 shrink-0 overflow-x-auto">
            {pages.map(p => (
              <button key={p.id} onClick={() => { setPageId(p.id); setSelectedId(null); }}
                className={`text-xs px-2 py-0.5 rounded whitespace-nowrap transition-colors ${p.id === pageId ? 'bg-indigo-500/20 text-indigo-300' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                {p.name}
              </button>
            ))}
          </div>
          {/* Layers label */}
          <div className="px-2 py-1.5 border-b border-white/10 shrink-0">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">Layers</span>
          </div>
          {/* Layer rows */}
          <div className="flex-1 overflow-y-auto py-1">
            {[...elements].reverse().map(el => (
              <div key={el.id}
                onClick={() => setSelectedId(el.id)}
                onContextMenu={ev => { ev.preventDefault(); setContextMenu({ id: el.id, x: ev.clientX, y: ev.clientY }); }}
                className={`flex items-center gap-1.5 px-2 py-1 rounded mx-1 cursor-pointer group transition-colors ${el.id === selectedId ? 'bg-indigo-500/20 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
              >
                <span className={el.id === selectedId ? 'text-indigo-400' : 'text-white/30'}>{elementIcon(el.type)}</span>
                <span className="text-xs flex-1 truncate">{el.name}</span>
                <button aria-label={el.visible ? 'Hide' : 'Show'}
                  onClick={ev => { ev.stopPropagation(); updateEl(el.id, 'visible', !el.visible); }}
                  className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-white transition-opacity">
                  {el.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>
                <button aria-label={el.locked ? 'Unlock' : 'Lock'}
                  onClick={ev => { ev.stopPropagation(); updateEl(el.id, 'locked', !el.locked); }}
                  className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-white transition-opacity">
                  {el.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Center: Canvas ───────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Canvas toolbar */}
          <div className="flex items-center gap-1 px-3 py-1.5 border-b border-white/10 bg-[#111118] shrink-0">
            {/* Tool buttons */}
            <div className="flex items-center gap-0.5 pr-2 border-r border-white/10">
              {toolButtons.map(({ t, Icon, label }) => (
                <button key={t} title={label} onClick={() => setTool(t)} aria-pressed={tool === t}
                  className={`p-1.5 rounded transition-colors ${tool === t ? 'bg-indigo-500/30 text-indigo-300' : 'text-white/40 hover:text-white hover:bg-white/10'}`}>
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
            {/* Zoom controls */}
            <div className="flex items-center gap-0.5 px-2 border-r border-white/10">
              <button aria-label="Zoom out" onClick={() => adjustZoom(-0.1)} className="p-1 rounded text-white/40 hover:text-white hover:bg-white/10"><ZoomOut className="w-3.5 h-3.5" /></button>
              <span className="text-xs text-white/50 w-12 text-center">{Math.round(zoom * 100)}%</span>
              <button aria-label="Zoom in"  onClick={() => adjustZoom(0.1)}  className="p-1 rounded text-white/40 hover:text-white hover:bg-white/10"><ZoomIn  className="w-3.5 h-3.5" /></button>
              <button aria-label="Fit"      onClick={() => setZoom(0.85)}     className="p-1 rounded text-white/40 hover:text-white hover:bg-white/10"><Maximize2 className="w-3.5 h-3.5" /></button>
            </div>
            {/* Align buttons (only when element selected) */}
            {selected && (
              <div className="flex items-center gap-0.5 px-2 border-r border-white/10">
                <button aria-label="Align left"   title="Align left"   onClick={() => updateEl(selected.id, 'x', 0)}     className="p-1 rounded text-white/40 hover:text-white hover:bg-white/10"><AlignLeft   className="w-3.5 h-3.5" /></button>
                <button aria-label="Align center" title="Align center"                                                     className="p-1 rounded text-white/40 hover:text-white hover:bg-white/10"><AlignCenter className="w-3.5 h-3.5" /></button>
                <button aria-label="Align right"  title="Align right"                                                      className="p-1 rounded text-white/40 hover:text-white hover:bg-white/10"><AlignRight  className="w-3.5 h-3.5" /></button>
              </div>
            )}
            <div className="flex-1" />
            {tool !== 'select' && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                Click canvas to place {tool}
              </span>
            )}
          </div>

          {/* Canvas viewport */}
          <div
            className="flex-1 overflow-hidden relative"
            style={{
              background: '#1A1A2E',
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
              cursor: tool !== 'select' ? 'crosshair' : 'default',
            }}
            onMouseDown={handleCanvasMouseDown}
            onClick={() => setContextMenu(null)}
          >
            <div ref={canvasRef} style={{ position: 'absolute', inset: 0 }}>
              <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', position: 'absolute', inset: 0 }}>
                {elements.map(renderElement)}
              </div>
            </div>

            {/* Context menu */}
            {contextMenu && (
              <div
                className="absolute z-50 bg-[#1a1a2e] border border-white/10 rounded-lg shadow-2xl py-1 min-w-36"
                style={{ left: contextMenu.x - 60, top: contextMenu.y - 10 }}
                onClick={e => e.stopPropagation()}
              >
                {[
                  { label: 'Duplicate', action: () => { duplicateEl(contextMenu.id); setContextMenu(null); } },
                  {
                    label: 'Rename', action: () => {
                      const el = elements.find(e => e.id === contextMenu.id);
                      if (el) { const n = prompt('Rename element', el.name); if (n?.trim()) updateEl(el.id, 'name', n.trim()); }
                      setContextMenu(null);
                    }
                  },
                  { label: 'Delete', action: () => { deleteEl(contextMenu.id); setContextMenu(null); }, danger: true },
                ].map(({ label, action, danger }) => (
                  <button key={label} onClick={action}
                    className={`block w-full text-left px-3 py-1.5 text-xs hover:bg-white/10 transition-colors ${danger ? 'text-red-400' : 'text-white/70'}`}>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export bar */}
          <div className="flex items-center gap-2 px-3 py-1.5 border-t border-white/10 bg-[#111118] shrink-0">
            <span className="text-[11px] text-white/30">Export{selected ? ` "${selected.name}"` : ' selection'}:</span>
            {(['PNG', 'SVG', 'JSON'] as const).map(fmt => (
              <button key={fmt} onClick={() => showToast(`Mock export as ${fmt} — saved to Downloads`)}
                className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border border-white/10 text-white/50 hover:border-indigo-500/50 hover:text-white transition-colors">
                <Download className="w-3 h-3" />{fmt}
              </button>
            ))}
          </div>
        </div>

        {/* ── Right: Properties panel ──────────────────────────────────────── */}
        <div className="w-64 shrink-0 border-l border-white/10 bg-[#111118] flex flex-col">
          <div className="px-3 py-2 border-b border-white/10 shrink-0 flex items-center gap-2">
            <ChevronRight className="w-3 h-3 text-white/30" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Properties</span>
          </div>
          <div className="flex-1 overflow-hidden">{renderProps()}</div>
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-[#1a1a2e] border border-indigo-500/30 text-indigo-200 text-xs px-4 py-2 rounded-xl shadow-2xl pointer-events-none">
          {toast}
        </div>
      )}
    </div>
  );
}

// ── Inline overlay components (kept tiny, no props needed) ─────────────────

function SelectionOverlay() {
  const handles = [
    { top: -4, left: -4 }, { top: -4, left: '50%' }, { top: -4, right: -4 },
    { top: '50%', left: -4 }, { top: '50%', right: -4 },
    { bottom: -4, left: -4 }, { bottom: -4, left: '50%' }, { bottom: -4, right: -4 },
  ] as React.CSSProperties[];

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ outline: '2px solid #6366F1', outlineOffset: 1, borderRadius: 'inherit' }}>
      {handles.map((pos, i) => (
        <div key={i} style={{ position: 'absolute', ...pos, transform: 'translate(-50%,-50%)', width: 8, height: 8, background: '#fff', border: '1.5px solid #6366F1', borderRadius: 2 }} />
      ))}
    </div>
  );
}

function HoverOverlay() {
  return <div className="absolute inset-0 pointer-events-none" style={{ outline: '1.5px solid rgba(99,102,241,0.5)', outlineOffset: 1, borderRadius: 'inherit' }} />;
}
