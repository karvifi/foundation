'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Filter, ChevronRight } from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  type: 'doc' | 'task' | 'contact' | 'deal' | 'automation';
  x: number;
  y: number;
  connections: number;
}

interface GraphEdge {
  source: string;
  target: string;
  label?: string;
}

interface KnowledgeGraphProps {
  nodes?: GraphNode[];
  edges?: GraphEdge[];
  onNodeClick?: (node: GraphNode) => void;
  height?: number;
}

const DEFAULT_NODES: GraphNode[] = [
  { id: 'n1', label: 'Q2 Planning', type: 'doc', x: 400, y: 300, connections: 5 },
  { id: 'n2', label: 'TechCorp Deal', type: 'deal', x: 250, y: 180, connections: 3 },
  { id: 'n3', label: 'Product Roadmap', type: 'doc', x: 550, y: 160, connections: 4 },
  { id: 'n4', label: 'Lead Scoring Workflow', type: 'automation', x: 200, y: 380, connections: 2 },
  { id: 'n5', label: 'Sarah Chen', type: 'contact', x: 150, y: 260, connections: 2 },
  { id: 'n6', label: 'Invoice Approval', type: 'automation', x: 580, y: 380, connections: 2 },
  { id: 'n7', label: 'API Integration #234', type: 'task', x: 450, y: 450, connections: 3 },
  { id: 'n8', label: 'OmniMind Insights', type: 'doc', x: 650, y: 270, connections: 3 },
  { id: 'n9', label: 'Acme Corp', type: 'contact', x: 320, y: 430, connections: 2 },
  { id: 'n10', label: 'Sprint Planning', type: 'doc', x: 480, y: 200, connections: 3 },
];

const DEFAULT_EDGES: GraphEdge[] = [
  { source: 'n1', target: 'n2', label: 'references' },
  { source: 'n1', target: 'n3' },
  { source: 'n1', target: 'n4' },
  { source: 'n2', target: 'n5' },
  { source: 'n2', target: 'n9' },
  { source: 'n3', target: 'n7' },
  { source: 'n3', target: 'n10' },
  { source: 'n4', target: 'n9' },
  { source: 'n6', target: 'n7' },
  { source: 'n8', target: 'n1' },
  { source: 'n8', target: 'n3' },
  { source: 'n10', target: 'n7' },
  { source: 'n5', target: 'n4' },
];

const TYPE_COLORS: Record<string, string> = {
  doc: '#6366F1',
  task: '#F59E0B',
  contact: '#10B981',
  deal: '#EC4899',
  automation: '#8B5CF6',
};

const TYPE_LABELS: Record<string, string> = {
  doc: 'Document',
  task: 'Task',
  contact: 'Contact',
  deal: 'Deal',
  automation: 'Automation',
};

export default function KnowledgeGraph({
  nodes = DEFAULT_NODES,
  edges = DEFAULT_EDGES,
  onNodeClick,
  height = 600,
}: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(() => {
    const pos: Record<string, { x: number; y: number }> = {};
    nodes.forEach((n) => {
      pos[n.id] = { x: n.x, y: n.y };
    });
    return pos;
  });
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const filteredNodes = useMemo(() => {
    if (filter === 'all') return nodes;
    return nodes.filter((n) => n.type === filter);
  }, [nodes, filter]);

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map((n) => n.id)), [filteredNodes]);

  const filteredEdges = useMemo(
    () => edges.filter((e) => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)),
    [edges, filteredNodeIds]
  );

  const connectedToSelected = useMemo(() => {
    if (!selectedId) return new Set<string>();
    const connected = new Set<string>();
    filteredEdges.forEach((e) => {
      if (e.source === selectedId) connected.add(e.target);
      if (e.target === selectedId) connected.add(e.source);
    });
    return connected;
  }, [selectedId, filteredEdges]);

  const selectedNode = filteredNodes.find((n) => n.id === selectedId);

  const handleNodeMouseDown = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setDraggingId(id);
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!draggingId || !svgRef.current) return;
      const svg = svgRef.current;
      const rect = svg.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      setPositions((prev) => ({
        ...prev,
        [draggingId]: { x, y },
      }));
    },
    [draggingId, pan, zoom]
  );

  const handleMouseUp = useCallback(() => {
    setDraggingId(null);
  }, []);

  const fitToView = useCallback(() => {
    if (filteredNodes.length === 0) return;
    const xs = filteredNodes.map((n) => positions[n.id]?.x || n.x);
    const ys = filteredNodes.map((n) => positions[n.id]?.y || n.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const w = maxX - minX + 200;
    const h = maxY - minY + 200;
    const scale = Math.min(1, 800 / w, (height - 60) / h);
    setZoom(scale);
    setPan({
      x: (800 - w * scale) / 2 - minX * scale + 100,
      y: (height - 120 - h * scale) / 2 - minY * scale + 100,
    });
  }, [filteredNodes, positions, height]);

  const getNodeRadius = (connections: number) => 12 + connections * 3;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2 p-3 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={fitToView}
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Fit to view"
        >
          <Maximize2 size={18} className="text-slate-600 dark:text-slate-400" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.min(3, z + 0.2))}
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Zoom in"
        >
          <ZoomIn size={18} className="text-slate-600 dark:text-slate-400" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Zoom out"
        >
          <ZoomOut size={18} className="text-slate-600 dark:text-slate-400" />
        </button>
        <div className="w-px h-6 bg-slate-300 dark:bg-slate-700" />
        <div className="flex items-center gap-1">
          <Filter size={16} className="text-slate-600 dark:text-slate-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"
          >
            <option value="all">All types</option>
            <option value="doc">Documents</option>
            <option value="task">Tasks</option>
            <option value="contact">Contacts</option>
            <option value="deal">Deals</option>
            <option value="automation">Automations</option>
          </select>
        </div>
        <div className="ml-auto text-xs text-slate-500 dark:text-slate-400">
          {filteredNodes.length} nodes • {filteredEdges.length} connections
        </div>
      </div>

      <svg
        ref={svgRef}
        width="100%"
        height={height - 60}
        className="flex-1 bg-slate-50 dark:bg-slate-900 cursor-grab active:cursor-grabbing"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ overflow: 'hidden' }}
      >
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#94a3b8" />
          </marker>
        </defs>

        <g style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
          {filteredEdges.map((edge, idx) => {
            const sourcePos = positions[edge.source];
            const targetPos = positions[edge.target];
            if (!sourcePos || !targetPos) return null;
            const isRelated =
              !hoveredId ||
              hoveredId === edge.source ||
              hoveredId === edge.target ||
              (selectedId && (selectedId === edge.source || selectedId === edge.target));
            const opacity = !hoveredId && !selectedId ? 1 : isRelated ? 1 : 0.15;
            return (
              <line
                key={`edge-${idx}`}
                x1={sourcePos.x}
                y1={sourcePos.y}
                x2={targetPos.x}
                y2={targetPos.y}
                stroke="#d1d5db"
                strokeWidth={hoveredId || selectedId ? (isRelated ? 2 : 1) : 1.5}
                markerEnd="url(#arrowhead)"
                opacity={opacity}
                className="transition-opacity duration-150"
              />
            );
          })}

          {filteredNodes.map((node) => {
            const pos = positions[node.id];
            const radius = getNodeRadius(node.connections);
            const isHovered = hoveredId === node.id;
            const isSelected = selectedId === node.id;
            const isConnected = hoveredId && connectedToSelected.has(node.id);
            const color = TYPE_COLORS[node.type];
            const opacity =
              !hoveredId && !selectedId
                ? 1
                : isHovered || isSelected || isConnected
                  ? 1
                  : 0.2;

            return (
              <g key={node.id} opacity={opacity} className="transition-opacity duration-150">
                {isHovered || isSelected ? (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={radius + 6}
                    fill="none"
                    stroke="white"
                    strokeWidth={2}
                    style={{
                      filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.2))',
                    }}
                  />
                ) : null}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={radius}
                  fill={color}
                  stroke={isSelected ? '#fff' : 'none'}
                  strokeWidth={isSelected ? 3 : 0}
                  onMouseEnter={() => setHoveredId(node.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => {
                    setSelectedId(node.id);
                    onNodeClick?.(node);
                  }}
                  onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
                  className="cursor-pointer"
                  style={{
                    filter: isHovered ? 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))' : 'none',
                  }}
                />
                <text
                  x={pos.x}
                  y={pos.y + radius + 20}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#1f2937"
                  className="dark:fill-slate-300 pointer-events-none font-medium"
                  style={{ wordBreak: 'break-word' }}
                >
                  {node.label.length > 20 ? node.label.slice(0, 17) + '...' : node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {selectedNode && (
        <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900 text-sm">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">{selectedNode.label}</h3>
              <span className="inline-block mt-1 px-2 py-1 rounded text-xs font-medium text-white" style={{ backgroundColor: TYPE_COLORS[selectedNode.type] }}>
                {TYPE_LABELS[selectedNode.type]}
              </span>
            </div>
            <button
              onClick={() => setSelectedId(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              ×
            </button>
          </div>
          {connectedToSelected.size > 0 && (
            <div className="mt-3">
              <p className="text-slate-600 dark:text-slate-400 font-medium mb-2">Connected to:</p>
              <div className="flex flex-wrap gap-2">
                {Array.from(connectedToSelected).map((id) => {
                  const connNode = filteredNodes.find((n) => n.id === id);
                  return connNode ? (
                    <button
                      key={id}
                      onClick={() => setSelectedId(id)}
                      className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      {connNode.label}
                      <ChevronRight size={12} />
                    </button>
                  ) : null;
                })}
              </div>
            </div>
          )}
          <button className="mt-4 px-3 py-1.5 rounded text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
            Open document
          </button>
        </div>
      )}
    </div>
  );
}
