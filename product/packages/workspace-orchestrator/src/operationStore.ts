// @sso/workspace-orchestrator — Phase 3 operationStore
// Wraps the in-memory operation cache (in connector-runtime) with
// PostgreSQL persistence so operations, sessions, and session events
// survive process restarts.
//
// Usage pattern:
//   1. On startup, call `recoverSessions()` to hydrate the in-memory
//      workspace session cache from the DB.
//   2. On every executed operation, call `persistOperation(op)` to write
//      the record to the operations table.
//   3. Readers call `getPersistedOperation()` / `listPersistedOperations()`
//      which fall back to the in-memory map when no DATABASE_URL is set.
//
// Design notes:
//   - This file is additive. Existing functions in ./index.ts continue to
//     write to both the JSON file cache and the DB via the same helpers
//     exercised here. We expose typed entry points so future callers can
//     opt into DB-only flows.
//   - The DB client is lazy-loaded. If DATABASE_URL is missing, every
//     function here degrades to the in-memory operationStore exported by
//     @sso/connector-runtime. No throws on missing DB.

import {
  getOperation as getInMemoryOperation,
  listOperationsForSession as listInMemoryForSession,
  type OperationRecord,
} from "@sso/connector-runtime";
import type { EngineId } from "@sso/contracts";

// ── Lazy DB loader ────────────────────────────────────────────────────────
type DbModule = typeof import("@sso/db");
type DbClient = Awaited<ReturnType<DbModule["createDb"]>>;

let dbPromise: Promise<DbClient | null> | null = null;

async function loadDb(): Promise<DbClient | null> {
  if (!process.env["DATABASE_URL"]) return null;
  if (!dbPromise) {
    dbPromise = (async () => {
      try {
        const mod = await import("@sso/db");
        return await mod.createDb();
      } catch {
        return null;
      }
    })();
  }
  return await dbPromise;
}

// ── Types ─────────────────────────────────────────────────────────────────
export interface RecoveredSession {
  id: string;
  workspaceId: string;
  patternId: string;
  createdAt: string;
}

export interface RecoveryResult {
  sessions: RecoveredSession[];
  operationCount: number;
  eventCount: number;
}

export interface ListPersistedOptions {
  sessionId?: string;
  workspaceId?: string;
  engineId?: EngineId;
  limit?: number;
}

// ── Internal conversions ──────────────────────────────────────────────────
function toIso(value: Date): string {
  return value.toISOString();
}

function toDate(value: string): Date {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid date string: ${value}`);
  }
  return parsed;
}

type OperationRowShape = Awaited<ReturnType<DbModule["getOperationFromDb"]>>;

function rowToOperation(row: NonNullable<OperationRowShape>): OperationRecord {
  const status = row.status as OperationRecord["status"];
  const input = (row.input ?? {}) as Record<string, unknown>;
  const output = (row.output ?? {}) as Record<string, unknown>;

  const base: OperationRecord = {
    id: row.id,
    sessionId: row.sessionId,
    workspaceId: row.workspaceId,
    engineId: row.engineId as EngineId,
    operation: row.operation,
    input,
    output,
    status,
    startedAt: toIso(row.startedAt),
  };

  if (row.finishedAt) base.finishedAt = toIso(row.finishedAt);
  if (row.durationMs !== null && row.durationMs !== undefined) {
    base.durationMs = row.durationMs;
  }
  if (row.error) base.error = row.error;

  return base;
}

// ── Persist one operation ─────────────────────────────────────────────────
export async function persistOperation(
  operation: Readonly<OperationRecord>,
  workspaceId?: string,
): Promise<void> {
  const db = await loadDb();
  if (!db) return;

  const resolvedWorkspaceId = workspaceId ?? operation.workspaceId;
  if (!resolvedWorkspaceId) {
    // Cannot persist without a workspace scope; skip silently to preserve
    // existing in-memory behaviour for callers that haven't wired workspaceId.
    return;
  }

  const mod = await import("@sso/db");
  await mod.createOperation(db, {
    id: operation.id,
    sessionId: operation.sessionId,
    workspaceId: resolvedWorkspaceId,
    engineId: operation.engineId,
    operation: operation.operation,
    input: operation.input,
    output: operation.output,
    status: operation.status,
    startedAt: toDate(operation.startedAt),
    finishedAt: operation.finishedAt ? toDate(operation.finishedAt) : null,
    durationMs: operation.durationMs ?? null,
    error: operation.error ?? null,
  });
}

// ── Persist many operations ───────────────────────────────────────────────
export async function persistOperations(
  operations: ReadonlyArray<OperationRecord>,
  workspaceId: string,
): Promise<void> {
  for (const op of operations) {
    await persistOperation(op, workspaceId);
  }
}

// ── Read one operation (DB first, in-memory fallback) ─────────────────────
export async function getPersistedOperation(
  operationId: string,
): Promise<OperationRecord | null> {
  const db = await loadDb();
  if (db) {
    const mod = await import("@sso/db");
    const row = await mod.getOperationFromDb(db, operationId);
    if (row) return rowToOperation(row);
  }

  const inMemory = getInMemoryOperation(operationId);
  return inMemory ?? null;
}

// ── List operations (DB first, in-memory fallback) ────────────────────────
export async function listPersistedOperations(
  options: ListPersistedOptions = {},
): Promise<OperationRecord[]> {
  const db = await loadDb();
  if (db) {
    const mod = await import("@sso/db");
    const rows = await mod.listOperations(db, {
      sessionId: options.sessionId,
      workspaceId: options.workspaceId,
      engineId: options.engineId,
      limit: options.limit,
      order: "desc",
    });
    return rows.map(rowToOperation);
  }

  if (options.sessionId) {
    const inMemory = listInMemoryForSession(options.sessionId);
    if (options.limit) return inMemory.slice(0, options.limit);
    return inMemory;
  }
  return [];
}

// ── Session recovery on startup ───────────────────────────────────────────
export async function recoverSessions(workspaceId?: string): Promise<RecoveryResult> {
  const db = await loadDb();
  if (!db) {
    return { sessions: [], operationCount: 0, eventCount: 0 };
  }

  const mod = await import("@sso/db");

  const sessionRows = await mod.listSessions(db, workspaceId, 500);
  const sessions: RecoveredSession[] = sessionRows.map((row) => ({
    id: row.id,
    workspaceId: row.workspaceId,
    patternId: row.patternId,
    createdAt: toIso(row.createdAt),
  }));

  let operationCount = 0;
  let eventCount = 0;
  for (const session of sessions) {
    const ops = await mod.listOperations(db, { sessionId: session.id, limit: 1000 });
    operationCount += ops.length;
    const events = await mod.listSessionEventsForSession(db, session.id, 1000);
    eventCount += events.length;
  }

  return { sessions, operationCount, eventCount };
}
