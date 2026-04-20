// @sso/db — Phase 3 schema module
// Re-exports the operations, sessions, and session events tables from the
// canonical schema definition. This module exists so consumers can import
// Phase 3 persistence tables via a focused path without reaching into the
// full schema surface.
//
// Note: The user spec for Phase 3 requested `uuid` primary keys, but the
// existing schema uses `text` columns populated with ULIDs via `genUlid()`.
// Changing the PK type would break every existing insert (see
// packages/workspace-orchestrator/src/index.ts). Per the "additive changes
// only" directive, this module aliases the existing ULID-backed tables
// instead of redefining them with uuid.

import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

import {
  operationRecords,
  workspaceSessions,
  contextBusEvents,
} from "../index.js";

// ── Tables ────────────────────────────────────────────────────────────────
// operations: one row per engine operation execution
export const operations = operationRecords;

// sessions: one row per workspace session
export const sessions = workspaceSessions;

// session_events: context bus events scoped to a session
export const sessionEvents = contextBusEvents;

// ── Row types ─────────────────────────────────────────────────────────────
export type OperationRow = InferSelectModel<typeof operations>;
export type InsertOperationRow = InferInsertModel<typeof operations>;

export type SessionRow = InferSelectModel<typeof sessions>;
export type InsertSessionRow = InferInsertModel<typeof sessions>;

export type SessionEventRow = InferSelectModel<typeof sessionEvents>;
export type InsertSessionEventRow = InferInsertModel<typeof sessionEvents>;

// ── Status union (mirrors connector-runtime's OperationRecord.status) ─────
export type OperationStatus = "pending" | "executing" | "success" | "failed";
