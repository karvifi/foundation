// @sso/db — Phase 3 query helpers
// Typed helpers for persisting and reading operations, sessions, and
// session events. These functions accept a Drizzle client (created via
// `createDb()`) so callers retain full control over pooling and lifetime.

import { and, asc, desc, eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import {
  operations,
  sessions,
  sessionEvents,
  type InsertOperationRow,
  type InsertSessionRow,
  type InsertSessionEventRow,
  type OperationRow,
  type SessionRow,
  type SessionEventRow,
} from "./schema/operations.js";

// Loose database type — `createDb()` returns a schema-bound instance, but
// these helpers only rely on the core query builder surface.
type Db = NodePgDatabase<Record<string, unknown>>;

// ── Operation helpers ─────────────────────────────────────────────────────
export interface CreateOperationInput {
  id: string;
  sessionId: string;
  workspaceId: string;
  engineId: string;
  operation: string;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  status: "pending" | "executing" | "success" | "failed";
  startedAt: Date;
  finishedAt?: Date | null;
  durationMs?: number | null;
  error?: string | null;
}

export async function createOperation(
  db: Db,
  input: CreateOperationInput,
): Promise<OperationRow> {
  const row: InsertOperationRow = {
    id: input.id,
    sessionId: input.sessionId,
    workspaceId: input.workspaceId,
    engineId: input.engineId,
    operation: input.operation,
    input: input.input ?? {},
    output: input.output ?? {},
    status: input.status,
    startedAt: input.startedAt,
    finishedAt: input.finishedAt ?? null,
    durationMs: input.durationMs ?? null,
    error: input.error ?? null,
  };

  const [inserted] = await db.insert(operations).values(row).returning();
  if (!inserted) {
    throw new Error(`createOperation failed: no row returned for id ${input.id}`);
  }
  return inserted;
}

export async function getOperation(
  db: Db,
  operationId: string,
): Promise<OperationRow | null> {
  const rows = await db
    .select()
    .from(operations)
    .where(eq(operations.id, operationId))
    .limit(1);
  return rows[0] ?? null;
}

export interface ListOperationsOptions {
  sessionId?: string;
  workspaceId?: string;
  engineId?: string;
  limit?: number;
  order?: "asc" | "desc";
}

export async function listOperations(
  db: Db,
  options: ListOperationsOptions = {},
): Promise<OperationRow[]> {
  const conditions = [] as ReturnType<typeof eq>[];
  if (options.sessionId) conditions.push(eq(operations.sessionId, options.sessionId));
  if (options.workspaceId) conditions.push(eq(operations.workspaceId, options.workspaceId));
  if (options.engineId) conditions.push(eq(operations.engineId, options.engineId));

  const order = options.order === "asc" ? asc(operations.startedAt) : desc(operations.startedAt);
  const limit = options.limit ?? 100;

  if (conditions.length > 0) {
    return await db
      .select()
      .from(operations)
      .where(and(...conditions))
      .orderBy(order)
      .limit(limit);
  }
  return await db.select().from(operations).orderBy(order).limit(limit);
}

// ── Session helpers ───────────────────────────────────────────────────────
export interface CreateSessionInput {
  id: string;
  workspaceId: string;
  patternId: string;
  createdAt?: Date;
}

export async function createSession(
  db: Db,
  input: CreateSessionInput,
): Promise<SessionRow> {
  const row: InsertSessionRow = {
    id: input.id,
    workspaceId: input.workspaceId,
    patternId: input.patternId,
    createdAt: input.createdAt ?? new Date(),
  };

  const [inserted] = await db.insert(sessions).values(row).returning();
  if (!inserted) {
    throw new Error(`createSession failed: no row returned for id ${input.id}`);
  }
  return inserted;
}

export async function getSession(
  db: Db,
  sessionId: string,
): Promise<SessionRow | null> {
  const rows = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId))
    .limit(1);
  return rows[0] ?? null;
}

export async function listSessions(
  db: Db,
  workspaceId?: string,
  limit = 100,
): Promise<SessionRow[]> {
  const order = desc(sessions.createdAt);
  if (workspaceId) {
    return await db
      .select()
      .from(sessions)
      .where(eq(sessions.workspaceId, workspaceId))
      .orderBy(order)
      .limit(limit);
  }
  return await db.select().from(sessions).orderBy(order).limit(limit);
}

// ── Session event helpers ─────────────────────────────────────────────────
export interface CreateSessionEventInput {
  id: string;
  workspaceId: string;
  sessionId: string;
  sourceEngineId: string;
  eventType: string;
  payload?: Record<string, unknown>;
  createdAt?: Date;
}

export async function createSessionEvent(
  db: Db,
  input: CreateSessionEventInput,
): Promise<SessionEventRow> {
  const row: InsertSessionEventRow = {
    id: input.id,
    workspaceId: input.workspaceId,
    sessionId: input.sessionId,
    sourceEngineId: input.sourceEngineId,
    eventType: input.eventType,
    payload: input.payload ?? {},
    createdAt: input.createdAt ?? new Date(),
  };

  const [inserted] = await db.insert(sessionEvents).values(row).returning();
  if (!inserted) {
    throw new Error(`createSessionEvent failed: no row returned for id ${input.id}`);
  }
  return inserted;
}

export async function listSessionEventsForSession(
  db: Db,
  sessionId: string,
  limit = 50,
): Promise<SessionEventRow[]> {
  return await db
    .select()
    .from(sessionEvents)
    .where(eq(sessionEvents.sessionId, sessionId))
    .orderBy(desc(sessionEvents.createdAt))
    .limit(limit);
}
