import type {
  ContextBusEvent,
  ContextPropagationResult,
  EngineId,
  EngineReaction,
  LayoutMutation,
  WorkspacePattern,
} from "@sso/contracts";
import { executeEngineOperation } from "@sso/connector-runtime";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// ── Phase 3 re-exports ────────────────────────────────────────────────────
// Expose the operationStore persistence helpers so external consumers can
// import them via `@sso/workspace-orchestrator`.
export {
  persistOperation,
  persistOperations,
  getPersistedOperation,
  listPersistedOperations,
  recoverSessions,
  type RecoveryResult,
  type RecoveredSession,
  type ListPersistedOptions,
} from "./operationStore.js";

export interface WorkspaceSession {
  id: string;
  workspaceId: string;
  patternId: string;
  createdAt: string;
}

const patterns: WorkspacePattern[] = [
  {
    id: "sales_workspace",
    name: "Sales Workspace",
    summary: "Primary CRM with side-by-side communication engines.",
    panels: [
      { panelId: "p_crm", engineId: "crm", dock: "center", ratio: 0.6 },
      { panelId: "p_email", engineId: "email", dock: "right", ratio: 0.2 },
      { panelId: "p_calendar", engineId: "calendar", dock: "right", ratio: 0.2 },
    ],
  },
  {
    id: "dev_workspace",
    name: "Dev Workspace",
    summary: "Code IDE with issues and terminal in a focused build loop.",
    panels: [
      { panelId: "p_issues", engineId: "issues", dock: "left", ratio: 0.2 },
      { panelId: "p_ide", engineId: "code_ide", dock: "center", ratio: 0.6 },
      { panelId: "p_terminal", engineId: "terminal", dock: "bottom", ratio: 0.2 },
    ],
  },
  {
    id: "content_workspace",
    name: "Content Workspace",
    summary: "Document engine centered with research and calendar support.",
    panels: [
      { panelId: "p_research", engineId: "research", dock: "left", ratio: 0.25 },
      { panelId: "p_document", engineId: "document", dock: "center", ratio: 0.55 },
      { panelId: "p_calendar", engineId: "calendar", dock: "floating", ratio: 0.2 },
    ],
  },
  {
    id: "finance_workspace",
    name: "Finance Workspace",
    summary: "Spreadsheet-driven operations with invoice and dashboard views.",
    panels: [
      { panelId: "p_sheet", engineId: "sheet", dock: "center", ratio: 0.6 },
      { panelId: "p_dashboard", engineId: "dashboard", dock: "right", ratio: 0.2 },
      { panelId: "p_invoice", engineId: "invoice", dock: "right", ratio: 0.2 },
    ],
  },
  {
    id: "cs_workspace",
    name: "Customer Success Workspace",
    summary: "Customer context, support state, and account health in one view.",
    panels: [
      { panelId: "p_support", engineId: "support", dock: "center", ratio: 0.5 },
      { panelId: "p_health", engineId: "health", dock: "right", ratio: 0.25 },
      { panelId: "p_chat", engineId: "chat", dock: "right", ratio: 0.25 },
    ],
  },
  {
    id: "focus_mode",
    name: "Focus Mode",
    summary: "One primary engine takes full stage while secondary engines pause.",
    panels: [{ panelId: "p_focus", engineId: "document", dock: "center", ratio: 1 }],
  },
];

const sessions = new Map<string, WorkspaceSession>();
const eventsBySession = new Map<string, ContextBusEvent[]>();

const STORE_DIR = join(process.cwd(), ".data", "workspace-orchestrator");
const STORE_FILE = join(STORE_DIR, "store.json");

let seq = 0;

function genId(prefix: string): string {
  seq += 1;
  return `${prefix}_${Date.now()}_${seq}`;
}

function hydrateFromFile(): void {
  try {
    const raw = readFileSync(STORE_FILE, "utf-8");
    const parsed = JSON.parse(raw) as {
      sessions: WorkspaceSession[];
      eventsBySession: Record<string, ContextBusEvent[]>;
    };
    for (const session of parsed.sessions) {
      sessions.set(session.id, session);
    }
    for (const [sessionId, events] of Object.entries(parsed.eventsBySession)) {
      eventsBySession.set(sessionId, events);
    }
  } catch {
    // No persisted store yet.
  }
}

function persistToFile(): void {
  mkdirSync(STORE_DIR, { recursive: true });
  const payload = {
    sessions: Array.from(sessions.values()),
    eventsBySession: Object.fromEntries(eventsBySession.entries()),
  };
  writeFileSync(STORE_FILE, JSON.stringify(payload, null, 2), "utf-8");
}

let dbPromise: Promise<Awaited<ReturnType<typeof import("@sso/db")["createDb"]>> | null> | null = null;

async function getDb() {
  if (!process.env["DATABASE_URL"]) return null;
  if (!dbPromise) {
    dbPromise = (async () => {
      try {
        const { createDb } = await import("@sso/db");
        return await createDb();
      } catch {
        return null;
      }
    })();
  }
  return await dbPromise;
}

hydrateFromFile();

function reactionSummary(engineId: EngineId, selectedLabel: string): string {
  switch (engineId) {
    case "email":
      return `Email engine loaded history for ${selectedLabel}`;
    case "calendar":
      return `Calendar engine filtered meetings for ${selectedLabel}`;
    case "dashboard":
      return `Dashboard metrics filtered to ${selectedLabel}`;
    case "document":
      return `Document context hydrated for ${selectedLabel}`;
    case "chat":
      return `Chat context switched to ${selectedLabel}`;
    default:
      return `${engineId} reacted to ${selectedLabel}`;
  }
}

function inferAction(engineId: EngineId): EngineReaction["action"] {
  if (engineId === "calendar" || engineId === "dashboard") return "filter";
  if (engineId === "document" || engineId === "email") return "hydrate";
  if (engineId === "chat") return "show";
  return "focus";
}

export function listWorkspacePatterns(): WorkspacePattern[] {
  return patterns;
}

export async function createWorkspaceSession(workspaceId: string, patternId: string): Promise<WorkspaceSession> {
  const pattern = patterns.find((item) => item.id === patternId);
  if (!pattern) {
    throw new Error(`Unknown workspace pattern: ${patternId}`);
  }

  const session: WorkspaceSession = {
    id: genId("wss"),
    workspaceId,
    patternId,
    createdAt: new Date().toISOString(),
  };

  sessions.set(session.id, session);
  eventsBySession.set(session.id, []);
  persistToFile();

  const db = await getDb();
  if (db) {
    const { workspaceSessions } = await import("@sso/db");
    await db.insert(workspaceSessions).values({
      id: session.id,
      workspaceId: session.workspaceId,
      patternId: session.patternId,
      createdAt: new Date(session.createdAt),
    });
  }

  return session;
}

export async function getWorkspaceSession(sessionId: string): Promise<WorkspaceSession | undefined> {
  const db = await getDb();
  if (db) {
    const { workspaceSessions } = await import("@sso/db");
    const row = await db.query.workspaceSessions.findFirst({ where: (table, ops) => ops.eq(table.id, sessionId) });
    if (row) {
      const session: WorkspaceSession = {
        id: row.id,
        workspaceId: row.workspaceId,
        patternId: row.patternId,
        createdAt: row.createdAt.toISOString(),
      };
      sessions.set(session.id, session);
      return session;
    }
  }

  return sessions.get(sessionId);
}

export async function listSessionEvents(sessionId: string, limit = 50): Promise<ContextBusEvent[]> {
  const db = await getDb();
  if (db) {
    const { contextBusEvents } = await import("@sso/db");
    const rows = await db.query.contextBusEvents.findMany({
      where: (table, ops) => ops.eq(table.sessionId, sessionId),
      orderBy: (table, ops) => [ops.desc(table.createdAt)],
      limit,
    });

    const events = rows.map((row) => ({
      id: row.id,
      workspaceId: row.workspaceId,
      sessionId: row.sessionId,
      sourceEngineId: row.sourceEngineId as EngineId,
      type: row.eventType as ContextBusEvent["type"],
      payload: row.payload as ContextBusEvent["payload"],
      createdAt: row.createdAt.toISOString(),
    })) satisfies ContextBusEvent[];

    eventsBySession.set(sessionId, [...events].reverse());
    return events;
  }

  const events = eventsBySession.get(sessionId) ?? [];
  return events.slice(-limit).reverse();
}

export async function publishRecordSelected(
  sessionId: string,
  sourceEngineId: EngineId,
  entityType: string,
  entityId: string,
  selectedLabel: string,
): Promise<ContextPropagationResult> {
  const session = await getWorkspaceSession(sessionId);
  if (!session) {
    throw new Error(`Unknown workspace session: ${sessionId}`);
  }

  const pattern = patterns.find((item) => item.id === session.patternId);
  if (!pattern) {
    throw new Error(`Missing pattern: ${session.patternId}`);
  }

  const event: ContextBusEvent = {
    id: genId("evt"),
    workspaceId: session.workspaceId,
    sessionId,
    sourceEngineId,
    type: "record.selected",
    payload: {
      entityType,
      entityId,
      selectedLabel,
    },
    createdAt: new Date().toISOString(),
  };

  const reactions: EngineReaction[] = pattern.panels
    .map((panel) => panel.engineId)
    .filter((engineId) => engineId !== sourceEngineId)
    .map((engineId) => ({
      engineId,
      action: inferAction(engineId),
      summary: reactionSummary(engineId, selectedLabel),
    }));

  // Execute operations for each reacting engine
  const executedOperations = reactions.map((reaction) =>
    executeEngineOperation(sessionId, reaction.engineId, entityId, selectedLabel, session.workspaceId)
  );

  const layoutMutations: LayoutMutation[] = pattern.panels.map((panel) => {
    if (panel.engineId === sourceEngineId) {
      return { panelId: panel.panelId, action: "focus", ratio: Math.max(panel.ratio, 0.55) };
    }
    if (panel.engineId === "email" || panel.engineId === "calendar") {
      return { panelId: panel.panelId, action: "show", ratio: Math.max(panel.ratio, 0.2) };
    }
    return { panelId: panel.panelId, action: "resize", ratio: panel.ratio };
  });

  const events = eventsBySession.get(sessionId) ?? [];
  events.push(event);
  eventsBySession.set(sessionId, events);
  persistToFile();

  const db = await getDb();
  if (db) {
    const { contextBusEvents, operationRecords } = await import("@sso/db");
    await db.insert(contextBusEvents).values({
      id: event.id,
      workspaceId: event.workspaceId,
      sessionId: event.sessionId,
      sourceEngineId: event.sourceEngineId,
      eventType: event.type,
      payload: event.payload,
      createdAt: new Date(event.createdAt),
    });

    if (executedOperations.length > 0) {
      await db.insert(operationRecords).values(
        executedOperations.map((operation) => ({
          id: operation.id,
          sessionId: operation.sessionId,
          workspaceId: session.workspaceId,
          engineId: operation.engineId,
          operation: operation.operation,
          input: operation.input,
          output: operation.output,
          status: operation.status,
          startedAt: new Date(operation.startedAt),
          finishedAt: operation.finishedAt ? new Date(operation.finishedAt) : null,
          durationMs: operation.durationMs ?? null,
          error: operation.error ?? null,
        })),
      );
    }
  }

  return {
    event,
    reactions,
    layoutMutations,
    operations: executedOperations,
  };
}
