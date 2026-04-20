// @sso/db — Drizzle ORM schema and client for the Software Synthesis OS
// Full canonical schema matching THE_BIBLE blueprint (Part 4)

import { pgSchema, text, jsonb, timestamp, integer, boolean, bigint, numeric, index, uniqueIndex, pgEnum } from "drizzle-orm/pg-core";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

// ── ULID generator (client-side for typed IDs) ─────────────────────────────
export function genUlid(): string {
  const ts = Date.now().toString(36).toUpperCase().padStart(10, "0");
  const rand = Math.random().toString(36).slice(2, 12).toUpperCase().padStart(10, "0");
  return (ts + rand).slice(0, 26);
}

// ── Schemas ────────────────────────────────────────────────────────────────
const os = pgSchema("os");

// ── Enums ──────────────────────────────────────────────────────────────────
export const workspaceTierEnum = pgEnum("workspace_tier", ["free", "pro", "team", "business", "enterprise"]);
export const graphStatusEnum = pgEnum("graph_status", ["draft", "active", "paused", "archived"]);
export const packageKindEnum = pgEnum("package_kind", ["engine", "compound", "connector", "surface", "policy", "app", "agent"]);
export const trustLevelEnum = pgEnum("trust_level", ["ai_generated", "community", "community_verified", "verified_partner", "first_party"]);
export const nodeTypeEnum = pgEnum("node_type", ["primitive", "connector", "engine", "surface", "compound", "agent", "policy", "artifact", "app"]);
export const artifactStatusEnum = pgEnum("artifact_status", ["draft", "review", "approved", "published", "archived"]);
export const runStatusEnum = pgEnum("run_status", ["queued", "running", "waiting_approval", "succeeded", "failed", "cancelled", "retrying"]);
export const triggerTypeEnum = pgEnum("trigger_type", ["manual", "cron", "webhook", "email", "event", "test", "database"]);
export const approvalStatusEnum = pgEnum("approval_status", ["pending", "approved", "rejected", "expired", "cancelled"]);
export const deploymentStatusEnum = pgEnum("deployment_status", ["pending", "building", "live", "failed", "paused"]);

// ── os.workspaces ──────────────────────────────────────────────────────────
export const workspaces = os.table("workspaces", {
  id:           text("id").primaryKey().$defaultFn(genUlid),
  orgId:        text("org_id").notNull(),
  name:         text("name").notNull(),
  slug:         text("slug").notNull(),
  tier:         text("tier").notNull().default("free"),
  domainHint:   text("domain_hint"),
  tokenBudget:  bigint("token_budget", { mode: "number" }).notNull().default(50000),
  tokensUsed:   bigint("tokens_used", { mode: "number" }).notNull().default(0),
  settings:     jsonb("settings").default({}),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
  updatedAt:    timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  index("os_workspaces_org_idx").on(t.orgId),
  uniqueIndex("os_workspaces_org_slug_idx").on(t.orgId, t.slug),
]);

// ── os.graph_instances ─────────────────────────────────────────────────────
export const graphInstances = os.table("graph_instances", {
  id:              text("id").primaryKey().$defaultFn(genUlid),
  workspaceId:     text("workspace_id").notNull(),
  name:            text("name").notNull(),
  description:     text("description"),
  intentPrompt:    text("intent_prompt"),
  graph:           jsonb("graph").notNull().default({ nodes: [], edges: [], policies: [] }),
  graphVersion:    integer("graph_version").notNull().default(1),
  status:          text("status").notNull().default("draft"),
  templateKey:     text("template_key"),
  surfaceOverrides: jsonb("surface_overrides").default([]),
  createdBy:       text("created_by").notNull(),
  createdAt:       timestamp("created_at").defaultNow().notNull(),
  updatedAt:       timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  index("os_graph_instances_workspace_idx").on(t.workspaceId),
  index("os_graph_instances_status_idx").on(t.workspaceId, t.status),
]);

// ── os.graph_versions (immutable snapshots) ────────────────────────────────
export const graphVersions = os.table("graph_versions", {
  id:             text("id").primaryKey().$defaultFn(genUlid),
  graphId:        text("graph_id").notNull(),
  version:        integer("version").notNull(),
  graphSnapshot:  jsonb("graph_snapshot").notNull(),
  patch:          jsonb("patch"),
  changeReason:   text("change_reason"),
  changedBy:      text("changed_by").notNull(),
  createdAt:      timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("os_graph_versions_graph_idx").on(t.graphId, t.version),
  uniqueIndex("os_graph_versions_unique").on(t.graphId, t.version),
]);

// ── os.packages ────────────────────────────────────────────────────────────
export const packages = os.table("packages", {
  id:           text("id").primaryKey().$defaultFn(genUlid),
  packageKey:   text("package_key").notNull().unique(),
  displayName:  text("display_name").notNull(),
  description:  text("description"),
  version:      text("version").notNull(),
  kind:         text("kind").notNull(),
  manifest:     jsonb("manifest").notNull(),
  trustLevel:   text("trust_level").notNull().default("ai_generated"),
  publisherId:  text("publisher_id"),
  signature:    text("signature"),
  isPublic:     boolean("is_public").notNull().default(false),
  downloadCount: integer("download_count").notNull().default(0),
  tags:         jsonb("tags").default([]),
  iconUrl:      text("icon_url"),
  tierColor:    text("tier_color"),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
  updatedAt:    timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  index("os_packages_trust_idx").on(t.trustLevel),
  index("os_packages_kind_idx").on(t.kind),
]);

// ── os.workspace_packages ──────────────────────────────────────────────────
export const workspacePackages = os.table("workspace_packages", {
  workspaceId:       text("workspace_id").notNull(),
  packageKey:        text("package_key").notNull(),
  installedVersion:  text("installed_version").notNull(),
  config:            jsonb("config").default({}),
  installedAt:       timestamp("installed_at").defaultNow().notNull(),
  installedBy:       text("installed_by"),
}, (t) => [
  uniqueIndex("os_workspace_packages_pk").on(t.workspaceId, t.packageKey),
]);

// ── os.node_definitions ────────────────────────────────────────────────────
export const nodeDefinitions = os.table("node_definitions", {
  id:           text("id").primaryKey().$defaultFn(genUlid),
  packageKey:   text("package_key").notNull(),
  nodeKey:      text("node_key").notNull(),
  nodeType:     text("node_type").notNull(),
  tier:         integer("tier").notNull().default(1),
  displayName:  text("display_name").notNull(),
  description:  text("description"),
  inputSchema:  jsonb("input_schema").notNull().default({}),
  outputSchema: jsonb("output_schema").notNull().default({}),
  configSchema: jsonb("config_schema").notNull().default({}),
  permissions:  jsonb("permissions").default([]),
  surfaceSpec:  jsonb("surface_spec").default({}),
  runFnKey:     text("run_fn_key"),
  icon:         text("icon"),
  tierColor:    text("tier_color"),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("os_node_defs_package_idx").on(t.packageKey),
  index("os_node_defs_type_idx").on(t.nodeType),
  uniqueIndex("os_node_defs_unique").on(t.packageKey, t.nodeKey),
]);

// ── os.artifacts ───────────────────────────────────────────────────────────
export const artifacts = os.table("artifacts", {
  id:               text("id").primaryKey().$defaultFn(genUlid),
  workspaceId:      text("workspace_id").notNull(),
  graphId:          text("graph_id"),
  runId:            text("run_id"),
  sourceNodeId:     text("source_node_id"),
  artifactType:     text("artifact_type").notNull(),
  name:             text("name").notNull(),
  status:           text("status").notNull().default("draft"),
  currentRevision:  integer("current_revision").notNull().default(1),
  storageKey:       text("storage_key"),
  metadata:         jsonb("metadata").default({}),
  tags:             jsonb("tags").default([]),
  createdBy:        text("created_by"),
  createdAt:        timestamp("created_at").defaultNow().notNull(),
  updatedAt:        timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  index("os_artifacts_workspace_idx").on(t.workspaceId, t.createdAt),
  index("os_artifacts_graph_idx").on(t.graphId),
  index("os_artifacts_type_idx").on(t.workspaceId, t.artifactType),
]);

// ── os.artifact_revisions (immutable) ─────────────────────────────────────
export const artifactRevisions = os.table("artifact_revisions", {
  id:           text("id").primaryKey().$defaultFn(genUlid),
  artifactId:   text("artifact_id").notNull(),
  revision:     integer("revision").notNull(),
  content:      jsonb("content"),
  storageKey:   text("storage_key"),
  contentHash:  text("content_hash").notNull(),
  byteSize:     bigint("byte_size", { mode: "number" }).notNull().default(0),
  changeSummary: text("change_summary"),
  createdBy:    text("created_by"),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("os_artifact_revisions_artifact_idx").on(t.artifactId, t.revision),
  uniqueIndex("os_artifact_revisions_unique").on(t.artifactId, t.revision),
]);

// ── os.runs ────────────────────────────────────────────────────────────────
export const runs = os.table("runs", {
  id:               text("id").primaryKey().$defaultFn(genUlid),
  graphId:          text("graph_id").notNull(),
  workspaceId:      text("workspace_id").notNull(),
  graphVersion:     integer("graph_version").notNull(),
  triggerType:      text("trigger_type").notNull(),
  triggerPayload:   jsonb("trigger_payload"),
  isTestRun:        boolean("is_test_run").notNull().default(false),
  status:           text("status").notNull().default("queued"),
  outputs:          jsonb("outputs"),
  surfaceResult:    jsonb("surface_result"),
  error:            text("error"),
  estimatedCostUsd: numeric("estimated_cost_usd", { precision: 12, scale: 4 }),
  actualCostUsd:    numeric("actual_cost_usd", { precision: 12, scale: 4 }),
  startedAt:        timestamp("started_at"),
  completedAt:      timestamp("completed_at"),
  triggerDevRunId:  text("trigger_dev_run_id"),
  createdAt:        timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("os_runs_graph_idx").on(t.graphId, t.createdAt),
  index("os_runs_workspace_idx").on(t.workspaceId, t.createdAt),
  index("os_runs_status_idx").on(t.status),
]);

// ── os.run_steps ───────────────────────────────────────────────────────────
export const runSteps = os.table("run_steps", {
  id:          text("id").primaryKey().$defaultFn(genUlid),
  runId:       text("run_id").notNull(),
  nodeId:      text("node_id").notNull(),
  nodeKey:     text("node_key").notNull(),
  stepIndex:   integer("step_index").notNull(),
  status:      text("status").notNull().default("queued"),
  inputJson:   jsonb("input_json"),
  outputJson:  jsonb("output_json"),
  errorJson:   jsonb("error_json"),
  durationMs:  integer("duration_ms"),
  costUsd:     numeric("cost_usd", { precision: 12, scale: 4 }),
  startedAt:   timestamp("started_at"),
  endedAt:     timestamp("ended_at"),
  createdAt:   timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("os_run_steps_run_idx").on(t.runId, t.stepIndex),
]);

// ── os.approvals ───────────────────────────────────────────────────────────
export const approvals = os.table("approvals", {
  id:           text("id").primaryKey().$defaultFn(genUlid),
  workspaceId:  text("workspace_id").notNull(),
  approvalType: text("approval_type").notNull(),
  targetType:   text("target_type").notNull(),
  targetId:     text("target_id").notNull(),
  runId:        text("run_id"),
  requestedBy:  text("requested_by"),
  status:       text("status").notNull().default("pending"),
  dueAt:        timestamp("due_at"),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
  resolvedAt:   timestamp("resolved_at"),
}, (t) => [
  index("os_approvals_workspace_idx").on(t.workspaceId, t.status),
  index("os_approvals_target_idx").on(t.targetType, t.targetId),
]);

// ── os.connector_credentials ──────────────────────────────────────────────
export const connectorCredentials = os.table("connector_credentials", {
  id:            text("id").primaryKey().$defaultFn(genUlid),
  workspaceId:   text("workspace_id").notNull(),
  connectorKey:  text("connector_key").notNull(),
  displayName:   text("display_name").notNull(),
  authType:      text("auth_type").notNull(),
  encryptedData: text("encrypted_data").notNull(),
  status:        text("status").notNull().default("active"),
  lastTestedAt:  timestamp("last_tested_at"),
  lastUsedAt:    timestamp("last_used_at"),
  expiresAt:     timestamp("expires_at"),
  createdBy:     text("created_by"),
  createdAt:     timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  uniqueIndex("os_connector_creds_unique").on(t.workspaceId, t.connectorKey, t.displayName),
]);

// ── os.synthesized_apps ────────────────────────────────────────────────────
export const synthesizedApps = os.table("synthesized_apps", {
  id:                text("id").primaryKey().$defaultFn(genUlid),
  workspaceId:       text("workspace_id").notNull(),
  graphId:           text("graph_id").notNull(),
  name:              text("name").notNull(),
  slug:              text("slug").notNull(),
  customDomain:      text("custom_domain"),
  deploymentUrl:     text("deployment_url"),
  deploymentStatus:  text("deployment_status").notNull().default("pending"),
  whiteLabelConfig:  jsonb("white_label_config").default({}),
  createdBy:         text("created_by"),
  createdAt:         timestamp("created_at").defaultNow().notNull(),
  updatedAt:         timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  index("os_synthesized_apps_workspace_idx").on(t.workspaceId),
  uniqueIndex("os_synthesized_apps_slug_idx").on(t.workspaceId, t.slug),
]);

// ── os.audit_events ────────────────────────────────────────────────────────
export const auditEvents = os.table("audit_events", {
  id:          text("id").primaryKey().$defaultFn(genUlid),
  workspaceId: text("workspace_id").notNull(),
  orgId:       text("org_id").notNull(),
  eventType:   text("event_type").notNull(),
  actorId:     text("actor_id"),
  actorType:   text("actor_type").notNull().default("user"),
  targetType:  text("target_type"),
  targetId:    text("target_id"),
  payload:     jsonb("payload").default({}),
  ipAddress:   text("ip_address"),
  userAgent:   text("user_agent"),
  createdAt:   timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("os_audit_events_workspace_idx").on(t.workspaceId, t.createdAt),
  index("os_audit_events_actor_idx").on(t.actorId, t.createdAt),
]);

// ── os.workspace_sessions ─────────────────────────────────────────────────
export const workspaceSessions = os.table("workspace_sessions", {
  id:          text("id").primaryKey().$defaultFn(genUlid),
  workspaceId: text("workspace_id").notNull(),
  patternId:   text("pattern_id").notNull(),
  createdAt:   timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("os_workspace_sessions_workspace_idx").on(t.workspaceId, t.createdAt),
]);

// ── os.context_bus_events ─────────────────────────────────────────────────
export const contextBusEvents = os.table("context_bus_events", {
  id:             text("id").primaryKey().$defaultFn(genUlid),
  workspaceId:    text("workspace_id").notNull(),
  sessionId:      text("session_id").notNull(),
  sourceEngineId: text("source_engine_id").notNull(),
  eventType:      text("event_type").notNull(),
  payload:        jsonb("payload").notNull().default({}),
  createdAt:      timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("os_context_bus_events_session_idx").on(t.sessionId, t.createdAt),
  index("os_context_bus_events_workspace_idx").on(t.workspaceId, t.createdAt),
]);

// ── os.operation_records ───────────────────────────────────────────────────
export const operationRecords = os.table("operation_records", {
  id:          text("id").primaryKey().notNull(),
  sessionId:   text("session_id").notNull(),
  workspaceId: text("workspace_id").notNull(),
  engineId:    text("engine_id").notNull(),
  operation:   text("operation").notNull(),
  input:       jsonb("input").default({}),
  output:      jsonb("output").default({}),
  status:      text("status").notNull().default("success"),
  startedAt:   timestamp("started_at").notNull(),
  finishedAt:  timestamp("finished_at"),
  durationMs:  integer("duration_ms"),
  error:       text("error"),
  createdAt:   timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("os_operation_records_session_idx").on(t.sessionId, t.createdAt),
  index("os_operation_records_workspace_idx").on(t.workspaceId, t.createdAt),
  index("os_operation_records_engine_idx").on(t.engineId, t.createdAt),
]);

// ── Type exports ──────────────────────────────────────────────────────────
export type Workspace            = InferSelectModel<typeof workspaces>;
export type InsertWorkspace      = InferInsertModel<typeof workspaces>;
export type GraphInstance        = InferSelectModel<typeof graphInstances>;
export type InsertGraphInstance  = InferInsertModel<typeof graphInstances>;
export type Package              = InferSelectModel<typeof packages>;
export type InsertPackage        = InferInsertModel<typeof packages>;
export type Artifact             = InferSelectModel<typeof artifacts>;
export type InsertArtifact       = InferInsertModel<typeof artifacts>;
export type Run                  = InferSelectModel<typeof runs>;
export type InsertRun            = InferInsertModel<typeof runs>;
export type RunStep              = InferSelectModel<typeof runSteps>;
export type InsertRunStep        = InferInsertModel<typeof runSteps>;
export type Approval             = InferSelectModel<typeof approvals>;
export type SynthesizedApp       = InferSelectModel<typeof synthesizedApps>;
export type ConnectorCredential  = InferSelectModel<typeof connectorCredentials>;
export type AuditEvent           = InferSelectModel<typeof auditEvents>;
export type WorkspaceSessionRow  = InferSelectModel<typeof workspaceSessions>;
export type ContextBusEventRow   = InferSelectModel<typeof contextBusEvents>;
export type OperationRecord      = InferSelectModel<typeof operationRecords>;
export type InsertOperationRecord = InferInsertModel<typeof operationRecords>;

// ── DB client factory (requires DATABASE_URL env var) ─────────────────────
export type { NodePgDatabase } from "drizzle-orm/node-postgres";

export async function createDb(databaseUrl?: string) {
  const { drizzle } = await import("drizzle-orm/node-postgres");
  const { Pool }    = await import("pg");
  const url = databaseUrl ?? process.env["DATABASE_URL"];
  if (!url) throw new Error("DATABASE_URL env var is required");
  const pool = new Pool({ connectionString: url, max: 10 });
  return drizzle(pool, {
    schema: {
      workspaces, graphInstances, graphVersions, packages, workspacePackages,
      nodeDefinitions, artifacts, artifactRevisions, runs, runSteps,
      approvals, connectorCredentials, synthesizedApps, auditEvents,
      workspaceSessions, contextBusEvents, operationRecords,
    },
  });
}

// ── Phase 3 re-exports ────────────────────────────────────────────────────
// Focused schema module (operations, sessions, session_events aliases)
export {
  operations,
  sessions,
  sessionEvents,
  type OperationRow,
  type InsertOperationRow,
  type SessionRow,
  type InsertSessionRow,
  type SessionEventRow,
  type InsertSessionEventRow,
  type OperationStatus,
} from "./schema/operations.js";

// Typed query helpers (getOperation renamed to avoid collision with the
// in-memory helper exported by @sso/connector-runtime).
export {
  createOperation,
  getOperation as getOperationFromDb,
  listOperations,
  createSession,
  getSession,
  listSessions,
  createSessionEvent,
  listSessionEventsForSession,
  type CreateOperationInput,
  type ListOperationsOptions,
  type CreateSessionInput,
  type CreateSessionEventInput,
} from "./queries.js";

// ── Phase 4 users schema ───────────────────────────────────────────────────
export { users, type User, type InsertUser } from "./schema/users.js";

// ── os.documents (OmniDocs) ────────────────────────────────────────────────
export const documents = os.table("documents", {
  id:           text("id").primaryKey().$defaultFn(genUlid),
  workspaceId:  text("workspace_id").notNull(),
  ownerId:      text("owner_id").notNull(),
  parentId:     text("parent_id"),
  title:        text("title").notNull().default("Untitled"),
  content:      jsonb("content").default({}),
  contentText:  text("content_text"),
  icon:         text("icon").default("📄"),
  coverUrl:     text("cover_url"),
  isPublished:  boolean("is_published").default(false),
  publishSlug:  text("publish_slug"),
  wordCount:    integer("word_count").default(0),
  starred:      boolean("starred").default(false),
  archivedAt:   timestamp("archived_at"),
  deletedAt:    timestamp("deleted_at"),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
  updatedAt:    timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  index("os_docs_workspace_idx").on(t.workspaceId),
  index("os_docs_owner_idx").on(t.ownerId),
]);
export type Document       = InferSelectModel<typeof documents>;
export type InsertDocument = InferInsertModel<typeof documents>;

// ── os.projects (OmniProjects) ─────────────────────────────────────────────
export const projects = os.table("projects", {
  id:           text("id").primaryKey().$defaultFn(genUlid),
  workspaceId:  text("workspace_id").notNull(),
  ownerId:      text("owner_id").notNull(),
  name:         text("name").notNull(),
  description:  text("description"),
  icon:         text("icon").default("🎯"),
  status:       text("status").notNull().default("active"),
  identifier:   text("identifier").notNull(),
  deletedAt:    timestamp("deleted_at"),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
  updatedAt:    timestamp("updated_at").defaultNow().notNull(),
}, (t) => [index("os_projects_workspace_idx").on(t.workspaceId)]);
export type Project       = InferSelectModel<typeof projects>;
export type InsertProject = InferInsertModel<typeof projects>;

// ── os.tasks ───────────────────────────────────────────────────────────────
import { real } from "drizzle-orm/pg-core";
export const tasks = os.table("tasks", {
  id:           text("id").primaryKey().$defaultFn(genUlid),
  projectId:    text("project_id").notNull(),
  workspaceId:  text("workspace_id").notNull(),
  assigneeId:   text("assignee_id"),
  parentId:     text("parent_id"),
  title:        text("title").notNull(),
  description:  jsonb("description").default({}),
  status:       text("status").notNull().default("todo"),
  priority:     text("priority").notNull().default("medium"),
  identifier:   text("identifier").notNull(),
  estimate:     integer("estimate"),
  dueDate:      timestamp("due_date"),
  completedAt:  timestamp("completed_at"),
  sortOrder:    real("sort_order").default(0),
  labels:       jsonb("labels").default([]),
  deletedAt:    timestamp("deleted_at"),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
  updatedAt:    timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  index("os_tasks_project_idx").on(t.projectId),
  index("os_tasks_workspace_idx").on(t.workspaceId),
  index("os_tasks_status_idx").on(t.projectId, t.status),
]);
export type Task       = InferSelectModel<typeof tasks>;
export type InsertTask = InferInsertModel<typeof tasks>;

// ── os.contacts (OmniCRM) ─────────────────────────────────────────────────
export const contacts = os.table("contacts", {
  id:             text("id").primaryKey().$defaultFn(genUlid),
  workspaceId:    text("workspace_id").notNull(),
  ownerId:        text("owner_id"),
  name:           text("name").notNull(),
  email:          text("email"),
  phone:          text("phone"),
  company:        text("company"),
  role:           text("role"),
  avatarUrl:      text("avatar_url"),
  status:         text("status").default("lead"),
  tags:           jsonb("tags").default([]),
  customFields:   jsonb("custom_fields").default({}),
  lastContactAt:  timestamp("last_contact_at"),
  deletedAt:      timestamp("deleted_at"),
  createdAt:      timestamp("created_at").defaultNow().notNull(),
  updatedAt:      timestamp("updated_at").defaultNow().notNull(),
}, (t) => [index("os_contacts_workspace_idx").on(t.workspaceId)]);
export type Contact       = InferSelectModel<typeof contacts>;
export type InsertContact = InferInsertModel<typeof contacts>;

// ── os.deals ──────────────────────────────────────────────────────────────
export const deals = os.table("deals", {
  id:           text("id").primaryKey().$defaultFn(genUlid),
  workspaceId:  text("workspace_id").notNull(),
  ownerId:      text("owner_id"),
  contactId:    text("contact_id"),
  title:        text("title").notNull(),
  stage:        text("stage").notNull().default("lead"),
  valueCents:   integer("value_cents").default(0),
  currency:     text("currency").default("USD"),
  probability:  integer("probability").default(50),
  closeDate:    timestamp("close_date"),
  wonAt:        timestamp("won_at"),
  lostAt:       timestamp("lost_at"),
  lostReason:   text("lost_reason"),
  customFields: jsonb("custom_fields").default({}),
  deletedAt:    timestamp("deleted_at"),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
  updatedAt:    timestamp("updated_at").defaultNow().notNull(),
}, (t) => [index("os_deals_workspace_idx").on(t.workspaceId)]);
export type Deal       = InferSelectModel<typeof deals>;
export type InsertDeal = InferInsertModel<typeof deals>;

// ── os.credit_ledger ─────────────────────────────────────────────────────
export const creditLedger = os.table("credit_ledger", {
  id:           text("id").primaryKey().$defaultFn(genUlid),
  workspaceId:  text("workspace_id").notNull(),
  userId:       text("user_id"),
  deltaCents:   integer("delta_cents").notNull(),
  reason:       text("reason").notNull(),
  meta:         jsonb("meta").default({}),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
}, (t) => [index("os_credit_ledger_ws_idx").on(t.workspaceId, t.createdAt)]);
export type CreditLedgerRow = InferSelectModel<typeof creditLedger>;

// ── os.ai_queries ─────────────────────────────────────────────────────────
export const aiQueryLog = os.table("ai_query_log", {
  id:               text("id").primaryKey().$defaultFn(genUlid),
  workspaceId:      text("workspace_id").notNull(),
  userId:           text("user_id"),
  model:            text("model").notNull(),
  promptTokens:     integer("prompt_tokens").default(0),
  completionTokens: integer("completion_tokens").default(0),
  costCents:        integer("cost_cents").default(0),
  cached:           boolean("cached").default(false),
  surface:          text("surface"),
  createdAt:        timestamp("created_at").defaultNow().notNull(),
}, (t) => [index("os_ai_query_log_ws_idx").on(t.workspaceId, t.createdAt)]);
export type AiQueryLogRow = InferSelectModel<typeof aiQueryLog>;

// ── os.automations (OmniFlow) ─────────────────────────────────────────────
export const automations = os.table("automations", {
  id:           text("id").primaryKey().$defaultFn(genUlid),
  workspaceId:  text("workspace_id").notNull(),
  ownerId:      text("owner_id"),
  name:         text("name").notNull(),
  description:  text("description"),
  enabled:      boolean("enabled").default(true),
  trigger:      jsonb("trigger").notNull(),
  steps:        jsonb("steps").notNull().default([]),
  runCount:     integer("run_count").default(0),
  lastRunAt:    timestamp("last_run_at"),
  deletedAt:    timestamp("deleted_at"),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
  updatedAt:    timestamp("updated_at").defaultNow().notNull(),
}, (t) => [index("os_automations_ws_idx").on(t.workspaceId)]);
export type Automation       = InferSelectModel<typeof automations>;
export type InsertAutomation = InferInsertModel<typeof automations>;

// ── os.waitlist ───────────────────────────────────────────────────────────
export const waitlist = os.table("waitlist", {
  id:           text("id").primaryKey().$defaultFn(genUlid),
  email:        text("email").notNull(),
  referralCode: text("referral_code"),
  referredBy:   text("referred_by"),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
}, (t) => [uniqueIndex("os_waitlist_email_uniq").on(t.email)]);
export type WaitlistRow = InferSelectModel<typeof waitlist>;
