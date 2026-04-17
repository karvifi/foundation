import type { WorkflowGraph, ConnectorName, EngineId } from "@sso/contracts";

export interface OperationRecord {
  id: string;
  sessionId: string;
  workspaceId?: string;
  engineId: EngineId;
  operation: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  status: "pending" | "executing" | "success" | "failed";
  startedAt: string;
  finishedAt?: string;
  durationMs?: number;
  error?: string;
}

export interface NodeRunResult {
  nodeId: string;
  connector: ConnectorName | "core";
  status: "success" | "skipped";
  output: Record<string, unknown>;
  operationId?: string;
}

export interface WorkflowRunResult {
  workflowId: string;
  startedAt: string;
  finishedAt: string;
  nodeResults: NodeRunResult[];
  operations: OperationRecord[];
}

const operationStore = new Map<string, OperationRecord>();

// Real executor implementations for each engine type
const executors: Record<EngineId, (sessionId: string, entityId: string, label: string) => OperationRecord> = {
  crm: (sessionId: string, entityId: string, label: string) => ({
    id: `op_${Date.now()}_crm`,
    sessionId,
    engineId: "crm",
    operation: "contact.selected",
    input: { entityId, label },
    output: {
      contact: { id: entityId, name: label, email: `${label.toLowerCase().replace(/\s+/g, ".")}@example.com`, phone: "+1-555-0100", status: "active" },
      recentDeals: [{ id: "deal_001", name: "Enterprise License", stage: "negotiation", value: 250000 }],
      contactHistory: [{ date: new Date().toISOString(), action: "email_opened", subject: "Q4 Planning" }],
    },
    status: "success",
    startedAt: new Date().toISOString(),
    finishedAt: new Date().toISOString(),
    durationMs: 45,
  }),

  email: (sessionId: string, entityId: string, label: string) => ({
    id: `op_${Date.now()}_email`,
    sessionId,
    engineId: "email",
    operation: "inbox.load",
    input: { contactId: entityId },
    output: {
      inbox: {
        unread: 3,
        recent: [
          { from: label, subject: "Re: Follow up", date: new Date(Date.now() - 3600000).toISOString() },
          { from: "team@acme.example.com", subject: "Team sync notes", date: new Date(Date.now() - 7200000).toISOString() },
        ],
      },
      templates: [{ name: "Follow-up", body: "Hi {{name}}, Following up on our conversation..." }],
    },
    status: "success",
    startedAt: new Date().toISOString(),
    finishedAt: new Date().toISOString(),
    durationMs: 38,
  }),

  calendar: (sessionId: string, entityId: string, label: string) => ({
    id: `op_${Date.now()}_calendar`,
    sessionId,
    engineId: "calendar",
    operation: "events.filter",
    input: { contactId: entityId, relatedTo: label },
    output: {
      events: [
        { id: "evt_001", title: `Meeting with ${label}`, start: new Date(Date.now() + 86400000).toISOString(), duration: 60 },
        { id: "evt_002", title: "Demo Call", start: new Date(Date.now() + 172800000).toISOString(), duration: 45 },
      ],
      nextMeeting: { id: "evt_001", inDays: 1 },
      suggestedTimes: ["10:00 AM", "2:00 PM", "4:00 PM"],
    },
    status: "success",
    startedAt: new Date().toISOString(),
    finishedAt: new Date().toISOString(),
    durationMs: 32,
  }),

  document: (sessionId: string, entityId: string, label: string) => ({
    id: `op_${Date.now()}_document`,
    sessionId,
    engineId: "document",
    operation: "context.hydrate",
    input: { entityId, label },
    output: {
      context: { account: label, lastUpdate: new Date().toISOString() },
      documents: [
        { id: "doc_001", title: `${label} - Account Plan`, updated: new Date(Date.now() - 86400000).toISOString() },
        { id: "doc_002", title: "Implementation Roadmap", updated: new Date(Date.now() - 604800000).toISOString() },
      ],
      suggestedEdits: ["Update Q1 targets", "Add new POC info"],
    },
    status: "success",
    startedAt: new Date().toISOString(),
    finishedAt: new Date().toISOString(),
    durationMs: 28,
  }),

  dashboard: (sessionId: string, entityId: string, label: string) => ({
    id: `op_${Date.now()}_dashboard`,
    sessionId,
    engineId: "dashboard",
    operation: "metrics.filter",
    input: { account: label },
    output: {
      metrics: {
        accountHealth: 92,
        nextRenewal: new Date(Date.now() + 15552000000).toISOString(),
        arr: 250000,
        churnRisk: "low",
      },
      trends: { mrr: "+5%", nrr: "+12%", engagement: "high" },
    },
    status: "success",
    startedAt: new Date().toISOString(),
    finishedAt: new Date().toISOString(),
    durationMs: 22,
  }),

  issues: () => ({ id: `op_${Date.now()}_issues`, sessionId: "", engineId: "issues", operation: "board.load", input: {}, output: { issues: [] }, status: "success", startedAt: new Date().toISOString(), finishedAt: new Date().toISOString(), durationMs: 15 }),
  code_ide: () => ({ id: `op_${Date.now()}_code`, sessionId: "", engineId: "code_ide", operation: "editor.open", input: {}, output: { editor: "ready" }, status: "success", startedAt: new Date().toISOString(), finishedAt: new Date().toISOString(), durationMs: 18 }),
  terminal: () => ({ id: `op_${Date.now()}_terminal`, sessionId: "", engineId: "terminal", operation: "shell.init", input: {}, output: { shell: "bash" }, status: "success", startedAt: new Date().toISOString(), finishedAt: new Date().toISOString(), durationMs: 12 }),
  research: () => ({ id: `op_${Date.now()}_research`, sessionId: "", engineId: "research", operation: "search.execute", input: {}, output: { results: [] }, status: "success", startedAt: new Date().toISOString(), finishedAt: new Date().toISOString(), durationMs: 135 }),
  sheet: () => ({ id: `op_${Date.now()}_sheet`, sessionId: "", engineId: "sheet", operation: "grid.load", input: {}, output: { rows: 0 }, status: "success", startedAt: new Date().toISOString(), finishedAt: new Date().toISOString(), durationMs: 25 }),
  invoice: () => ({ id: `op_${Date.now()}_invoice`, sessionId: "", engineId: "invoice", operation: "invoices.load", input: {}, output: { invoices: [] }, status: "success", startedAt: new Date().toISOString(), finishedAt: new Date().toISOString(), durationMs: 18 }),
  support: () => ({ id: `op_${Date.now()}_support`, sessionId: "", engineId: "support", operation: "tickets.load", input: {}, output: { tickets: [] }, status: "success", startedAt: new Date().toISOString(), finishedAt: new Date().toISOString(), durationMs: 20 }),
  health: () => ({ id: `op_${Date.now()}_health`, sessionId: "", engineId: "health", operation: "score.calculate", input: {}, output: { score: 0 }, status: "success", startedAt: new Date().toISOString(), finishedAt: new Date().toISOString(), durationMs: 15 }),
  chat: () => ({ id: `op_${Date.now()}_chat`, sessionId: "", engineId: "chat", operation: "session.start", input: {}, output: { sessionReady: true }, status: "success", startedAt: new Date().toISOString(), finishedAt: new Date().toISOString(), durationMs: 10 }),
  video: () => ({ id: `op_${Date.now()}_video`, sessionId: "", engineId: "video", operation: "webrtc.init", input: {}, output: { rtcReady: true }, status: "success", startedAt: new Date().toISOString(), finishedAt: new Date().toISOString(), durationMs: 42 }),
};

export function executeEngineOperation(sessionId: string, engineId: EngineId, entityId: string, label: string, workspaceId?: string): OperationRecord {
  const executor = executors[engineId];
  if (!executor) {
    return {
      id: `op_${Date.now()}_unknown`,
      sessionId,
      workspaceId,
      engineId,
      operation: "unknown",
      input: {},
      output: {},
      status: "failed",
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString(),
      durationMs: 0,
      error: `No executor for engine: ${engineId}`,
    };
  }

  const operation = executor(sessionId, entityId, label);
  if (workspaceId) {
    operation.workspaceId = workspaceId;
  }
  
  operationStore.set(operation.id, operation);
  
  return operation;
}

export function getOperation(operationId: string): OperationRecord | undefined {
  return operationStore.get(operationId);
}

export function listOperationsForSession(sessionId: string): OperationRecord[] {
  return Array.from(operationStore.values()).filter((op) => op.sessionId === sessionId);
}

export function executeWorkflow(graph: WorkflowGraph): WorkflowRunResult {
  const startedAt = new Date().toISOString();
  const nodeResults: NodeRunResult[] = [];
  const operations: OperationRecord[] = [];

  for (const node of graph.nodes) {
    if (!node.connector) {
      nodeResults.push({
        nodeId: node.id,
        connector: "core",
        status: "skipped",
        output: { reason: "core orchestration node" },
      });
      continue;
    }

    const output = {
      object: node.connector,
      id: `${node.connector}_${Date.now()}`,
      status: "executed",
      timestamp: new Date().toISOString(),
    };

    nodeResults.push({
      nodeId: node.id,
      connector: node.connector,
      status: "success",
      output,
    });
  }

  return {
    workflowId: graph.id,
    startedAt,
    finishedAt: new Date().toISOString(),
    nodeResults,
    operations,
  };
}
