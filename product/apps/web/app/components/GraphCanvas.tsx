"use client";

import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEffect, useMemo } from "react";
import type { WorkflowGraph } from "@sso/contracts";

interface GraphCanvasProps {
  graph: WorkflowGraph;
  onGraphChange?: (graph: WorkflowGraph) => void;
}

function toFlowNodes(graph: WorkflowGraph): Node[] {
  return graph.nodes.map((n, idx) => ({
    id: n.id,
    data: { label: `${n.type}${n.connector ? ` (${n.connector})` : ""}` },
    position: n.position ?? { x: 80 + idx * 180, y: 120 + (idx % 3) * 140 },
    type: "default",
  }));
}

function toFlowEdges(graph: WorkflowGraph): Edge[] {
  return graph.edges.map((e, idx) => ({
    id: `e-${idx}-${e.from}-${e.to}`,
    source: e.from,
    target: e.to,
    label: e.label,
  }));
}

export default function GraphCanvas({ graph, onGraphChange }: GraphCanvasProps) {
  const initialNodes = useMemo(() => toFlowNodes(graph), [graph]);
  const initialEdges = useMemo(() => toFlowEdges(graph), [graph]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  function emit(nextNodes: Node[], nextEdges: Edge[]) {
    if (!onGraphChange) return;
    const edgesOut = nextEdges.map((e) => ({ from: e.source, to: e.target, label: typeof e.label === "string" ? e.label : undefined }));

    const nodeById = new Map(graph.nodes.map((n) => [n.id, n]));
    const nodesOut = nextNodes.map((n) => {
      const base = nodeById.get(n.id);
      return {
        id: n.id,
        type: base?.type ?? "core.router",
        connector: base?.connector,
        config: base?.config ?? {},
        position: n.position,
        surface: base?.surface,
        policy: base?.policy,
        meta: base?.meta,
      };
    });

    onGraphChange({ ...graph, nodes: nodesOut, edges: edgesOut, schemaVersion: "1.0.0" });
  }

  function handleConnect(connection: Connection) {
    const next = addEdge({ ...connection, id: `e-${Date.now()}` }, edges);
    setEdges(next);
    emit(nodes, next);
  }

  function hasId(change: unknown): change is { id: string; type: string } {
    return typeof change === "object" && change !== null && "id" in change && typeof (change as { id: unknown }).id === "string";
  }

  return (
    <div style={{ height: 420, width: "100%", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 14, overflow: "hidden" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={(changes) => {
          onNodesChange(changes);
          // state updates are async, so compute with current snapshot after applying changes
          const nextNodes = nodes.map((node) => {
            const change = changes.find((c) => hasId(c) && c.id === node.id && c.type === "position");
            if (change && "position" in change && change.position) {
              return { ...node, position: change.position };
            }
            return node;
          });
          emit(nextNodes, edges);
        }}
        onEdgesChange={(changes) => {
          onEdgesChange(changes);
          const removed = new Set(changes.filter((c) => hasId(c) && c.type === "remove").map((c) => c.id));
          const nextEdges = edges.filter((e) => !removed.has(e.id));
          emit(nodes, nextEdges);
        }}
        onConnect={handleConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background gap={16} size={1} />
      </ReactFlow>
    </div>
  );
}
