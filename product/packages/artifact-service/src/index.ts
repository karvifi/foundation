// @sso/artifact-service — Durable artifact storage with immutable revisions
// Implements blueprint Part 3 → artifact-service + Section 4.2 schema

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { and, asc, desc, eq } from "drizzle-orm";

export type ArtifactType =
  | "document" | "sheet" | "email" | "code" | "image" | "audio"
  | "video" | "bundle" | "dataset" | "form_data" | "crm_record"
  | "workflow_log" | "dashboard" | "report";

export type ArtifactStatus = "draft" | "review" | "approved" | "published" | "archived";

export interface ArtifactRevision {
  revision: number;
  content: unknown;           // Tiptap JSON, sheet data, etc.
  contentHash: string;        // SHA-256
  byteSize: number;
  changeSummary?: string;
  createdBy?: string;
  createdAt: string;
}

export interface Artifact {
  id: string;
  workspaceId: string;
  graphId?: string;
  runId?: string;
  sourceNodeId?: string;
  artifactType: ArtifactType;
  name: string;
  status: ArtifactStatus;
  currentRevision: number;
  metadata: Record<string, unknown>;
  tags: string[];
  revisions: ArtifactRevision[];
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArtifactLineage {
  parentId: string;
  childId: string;
  relationType: "source" | "derived" | "export_of" | "snapshot_of";
}

type StoreShape = { artifacts: Record<string, Artifact>; lineage: ArtifactLineage[] };

type DbClient = Awaited<ReturnType<(typeof import("@sso/db"))["createDb"]>>;

let dbPromise: Promise<DbClient | null> | null = null;

async function getDb(): Promise<DbClient | null> {
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

// ── Persistence ────────────────────────────────────────────────────────────
function getDataDir(): string {
  const dir = join(process.cwd(), ".data", "artifacts");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return dir;
}

function readStore(): StoreShape {
  const path = join(getDataDir(), "store.json");
  if (!existsSync(path)) return { artifacts: {}, lineage: [] };
  try {
    return JSON.parse(readFileSync(path, "utf-8")) as StoreShape;
  } catch {
    return { artifacts: {}, lineage: [] };
  }
}

function writeStore(store: StoreShape): void {
  const path = join(getDataDir(), "store.json");
  writeFileSync(path, JSON.stringify(store, null, 2), "utf-8");
}

let idSeq = 0;
function genId(): string {
  return `art_${Date.now()}_${++idSeq}`;
}

function hashContent(content: unknown): string {
  return createHash("sha256").update(JSON.stringify(content)).digest("hex");
}

function mapDbArtifact(row: {
  id: string;
  workspaceId: string;
  graphId: string | null;
  runId: string | null;
  sourceNodeId: string | null;
  artifactType: string;
  name: string;
  status: string;
  currentRevision: number;
  metadata: unknown;
  tags: unknown;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}, revisions: ArtifactRevision[]): Artifact {
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    graphId: row.graphId ?? undefined,
    runId: row.runId ?? undefined,
    sourceNodeId: row.sourceNodeId ?? undefined,
    artifactType: row.artifactType as ArtifactType,
    name: row.name,
    status: row.status as ArtifactStatus,
    currentRevision: row.currentRevision,
    metadata: (row.metadata ?? {}) as Record<string, unknown>,
    tags: (row.tags ?? []) as string[],
    revisions,
    createdBy: row.createdBy ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

async function loadDbRevisions(artifactId: string): Promise<ArtifactRevision[]> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.query.artifactRevisions.findMany({
    where: (table) => eq(table.artifactId, artifactId),
    orderBy: (table) => [asc(table.revision)],
  });

  return rows.map((row) => ({
    revision: row.revision,
    content: row.content,
    contentHash: row.contentHash,
    byteSize: row.byteSize,
    changeSummary: row.changeSummary ?? undefined,
    createdBy: row.createdBy ?? undefined,
    createdAt: row.createdAt.toISOString(),
  }));
}

// ── Artifact CRUD ─────────────────────────────────────────────────────────

export async function createArtifact(params: {
  workspaceId: string;
  artifactType: ArtifactType;
  name: string;
  content: unknown;
  graphId?: string;
  runId?: string;
  sourceNodeId?: string;
  metadata?: Record<string, unknown>;
  tags?: string[];
  createdBy?: string;
  changeSummary?: string;
}): Promise<Artifact> {
  const id = genId();
  const now = new Date().toISOString();
  const hash = hashContent(params.content);
  const firstRevision: ArtifactRevision = {
    revision: 1,
    content: params.content,
    contentHash: hash,
    byteSize: JSON.stringify(params.content).length,
    changeSummary: params.changeSummary ?? "Initial version",
    createdBy: params.createdBy,
    createdAt: now,
  };
  const artifact: Artifact = {
    id,
    workspaceId: params.workspaceId,
    graphId: params.graphId,
    runId: params.runId,
    sourceNodeId: params.sourceNodeId,
    artifactType: params.artifactType,
    name: params.name,
    status: "draft",
    currentRevision: 1,
    metadata: params.metadata ?? {},
    tags: params.tags ?? [],
    revisions: [firstRevision],
    createdBy: params.createdBy,
    createdAt: now,
    updatedAt: now,
  };

  const db = await getDb();
  if (db) {
    const { artifacts, artifactRevisions } = await import("@sso/db");
    await db.insert(artifacts).values({
      id: artifact.id,
      workspaceId: artifact.workspaceId,
      graphId: artifact.graphId,
      runId: artifact.runId,
      sourceNodeId: artifact.sourceNodeId,
      artifactType: artifact.artifactType,
      name: artifact.name,
      status: artifact.status,
      currentRevision: artifact.currentRevision,
      metadata: artifact.metadata,
      tags: artifact.tags,
      createdBy: artifact.createdBy,
      createdAt: new Date(artifact.createdAt),
      updatedAt: new Date(artifact.updatedAt),
    });
    await db.insert(artifactRevisions).values({
      artifactId: artifact.id,
      revision: firstRevision.revision,
      content: firstRevision.content,
      contentHash: firstRevision.contentHash,
      byteSize: firstRevision.byteSize,
      changeSummary: firstRevision.changeSummary,
      createdBy: firstRevision.createdBy,
      createdAt: new Date(firstRevision.createdAt),
    });
    return artifact;
  }

  const store = readStore();
  store.artifacts[id] = artifact;
  writeStore(store);
  return artifact;
}

export async function getArtifact(id: string): Promise<Artifact | undefined> {
  const db = await getDb();
  if (db) {
    const row = await db.query.artifacts.findFirst({
      where: (table) => eq(table.id, id),
    });
    if (!row) return undefined;
    const revisions = await loadDbRevisions(id);
    return mapDbArtifact(row, revisions);
  }

  return readStore().artifacts[id];
}

export async function listArtifacts(workspaceId: string, type?: ArtifactType, status?: ArtifactStatus): Promise<Artifact[]> {
  const db = await getDb();
  if (db) {
    const rows = await db.query.artifacts.findMany({
      where: (table) => and(
        eq(table.workspaceId, workspaceId),
        type ? eq(table.artifactType, type) : undefined,
        status ? eq(table.status, status) : undefined,
      ),
      orderBy: (table) => [desc(table.updatedAt)],
    });

    const artifacts = await Promise.all(rows.map(async (row) => {
      const revisions = await loadDbRevisions(row.id);
      return mapDbArtifact(row, revisions);
    }));

    return artifacts;
  }

  const store = readStore();
  return Object.values(store.artifacts)
    .filter((a) => a.workspaceId === workspaceId)
    .filter((a) => (!type || a.artifactType === type))
    .filter((a) => (!status || a.status === status))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function reviseArtifact(id: string, content: unknown, params?: { changeSummary?: string; createdBy?: string }): Promise<Artifact | null> {
  const db = await getDb();
  if (db) {
    const { artifacts, artifactRevisions } = await import("@sso/db");
    const row = await db.query.artifacts.findFirst({
      where: (table) => eq(table.id, id),
    });
    if (!row) return null;

    const revisions = await loadDbRevisions(id);
    const latest = revisions[revisions.length - 1];
    const hash = hashContent(content);
    if (latest && latest.contentHash === hash) {
      return mapDbArtifact(row, revisions);
    }

    const newRevision = (latest?.revision ?? row.currentRevision) + 1;
    const now = new Date();

    await db.insert(artifactRevisions).values({
      artifactId: id,
      revision: newRevision,
      content,
      contentHash: hash,
      byteSize: JSON.stringify(content).length,
      changeSummary: params?.changeSummary,
      createdBy: params?.createdBy,
      createdAt: now,
    });

    await db.update(artifacts)
      .set({ currentRevision: newRevision, updatedAt: now })
      .where(eq(artifacts.id, id));

    const next = await db.query.artifacts.findFirst({
      where: (table) => eq(table.id, id),
    });
    if (!next) return null;
    const nextRevisions = await loadDbRevisions(id);
    return mapDbArtifact(next, nextRevisions);
  }

  const store = readStore();
  const artifact = store.artifacts[id];
  if (!artifact) return null;

  const newRevision = artifact.currentRevision + 1;
  const hash = hashContent(content);

  // Dedup: if content hash matches latest revision, skip
  const latest = artifact.revisions[artifact.revisions.length - 1];
  if (latest && latest.contentHash === hash) return artifact;

  const revision: ArtifactRevision = {
    revision: newRevision,
    content,
    contentHash: hash,
    byteSize: JSON.stringify(content).length,
    changeSummary: params?.changeSummary,
    createdBy: params?.createdBy,
    createdAt: new Date().toISOString(),
  };

  const updated: Artifact = {
    ...artifact,
    currentRevision: newRevision,
    revisions: [...artifact.revisions, revision],
    updatedAt: new Date().toISOString(),
  };
  store.artifacts[id] = updated;
  writeStore(store);
  return updated;
}

export async function updateArtifactStatus(id: string, status: ArtifactStatus): Promise<Artifact | null> {
  const db = await getDb();
  if (db) {
    const { artifacts } = await import("@sso/db");
    await db.update(artifacts)
      .set({ status, updatedAt: new Date() })
      .where(eq(artifacts.id, id));

    const row = await db.query.artifacts.findFirst({
      where: (table) => eq(table.id, id),
    });
    if (!row) return null;
    const revisions = await loadDbRevisions(id);
    return mapDbArtifact(row, revisions);
  }

  const store = readStore();
  const artifact = store.artifacts[id];
  if (!artifact) return null;
  const updated = { ...artifact, status, updatedAt: new Date().toISOString() };
  store.artifacts[id] = updated;
  writeStore(store);
  return updated;
}

export async function deleteArtifact(id: string): Promise<boolean> {
  const db = await getDb();
  if (db) {
    const { artifacts } = await import("@sso/db");
    const row = await db.query.artifacts.findFirst({
      where: (table) => eq(table.id, id),
    });
    if (!row) return false;
    await db.update(artifacts)
      .set({ status: "archived", updatedAt: new Date() })
      .where(eq(artifacts.id, id));
    return true;
  }

  const store = readStore();
  if (!store.artifacts[id]) return false;
  // Soft-delete: set status to archived
  store.artifacts[id] = { ...store.artifacts[id]!, status: "archived", updatedAt: new Date().toISOString() };
  writeStore(store);
  return true;
}

// ── Artifact Lineage ──────────────────────────────────────────────────────

export function linkArtifacts(parentId: string, childId: string, relationType: ArtifactLineage["relationType"]): void {
  const store = readStore();
  const existing = store.lineage.find(
    (l) => l.parentId === parentId && l.childId === childId && l.relationType === relationType
  );
  if (!existing) store.lineage.push({ parentId, childId, relationType });
  writeStore(store);
}

export function getArtifactLineage(artifactId: string): { parents: ArtifactLineage[]; children: ArtifactLineage[] } {
  const { lineage } = readStore();
  return {
    parents:  lineage.filter((l) => l.childId  === artifactId),
    children: lineage.filter((l) => l.parentId === artifactId),
  };
}

// ── Export helpers ─────────────────────────────────────────────────────────

export async function exportArtifactAsJson(id: string): Promise<string | null> {
  const artifact = await getArtifact(id);
  if (!artifact) return null;
  return JSON.stringify({
    id:       artifact.id,
    name:     artifact.name,
    type:     artifact.artifactType,
    revision: artifact.currentRevision,
    content:  artifact.revisions[artifact.revisions.length - 1]?.content,
    metadata: artifact.metadata,
    exportedAt: new Date().toISOString(),
  }, null, 2);
}
