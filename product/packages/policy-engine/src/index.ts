// @sso/policy-engine — Approval routing, RBAC, budget gates, audit
// Implements the policy/governance layer from blueprint Part 3 + Section 6.1

import { and, desc, eq } from "drizzle-orm";

export type PolicyType = "approval_required" | "rate_limit" | "budget_cap" | "rbac" | "audit_required";
export type ApprovalStatus = "pending" | "approved" | "rejected" | "expired" | "cancelled";
export type ActorType = "user" | "system" | "api_key";

export interface PolicyRule {
  id: string;
  type: PolicyType;
  targetNodeId: string;
  config: Record<string, unknown>;
}

export interface ApprovalRequest {
  id: string;
  workspaceId: string;
  approvalType: string; // "email_send" | "publish" | "export" | "dangerous_write" | "package_install"
  targetType: string;
  targetId: string;
  runId?: string;
  requestedBy: string;
  status: ApprovalStatus;
  dueAt?: Date;
  createdAt: Date;
  resolvedAt?: Date;
  resolution?: {
    actorId: string;
    comment?: string;
    actedAt: Date;
  };
}

export interface RBACContext {
  userId: string;
  orgId: string;
  workspaceId: string;
  roles: string[]; // e.g. ["owner", "editor", "viewer"]
}

export interface AuditEvent {
  id: string;
  workspaceId: string;
  orgId: string;
  eventType: string;
  actorId?: string;
  actorType: ActorType;
  targetType?: string;
  targetId?: string;
  payload: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// ── In-memory approval store (replace with DB in production) ──────────────
const approvalStore = new Map<string, ApprovalRequest>();
const auditLog: AuditEvent[] = [];

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

let idSeq = 0;
function genId(): string {
  return `pol_${Date.now()}_${++idSeq}`;
}

// ── Approval Engine ───────────────────────────────────────────────────────

export async function requestApproval(params: Omit<ApprovalRequest, "id" | "status" | "createdAt">): Promise<ApprovalRequest> {
  const approval: ApprovalRequest = {
    ...params,
    id: genId(),
    status: "pending",
    createdAt: new Date(),
    dueAt: params.dueAt ?? new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h default
  };

  const db = await getDb();
  if (db) {
    const { approvals } = await import("@sso/db");
    await db.insert(approvals).values({
      id: approval.id,
      workspaceId: approval.workspaceId,
      approvalType: approval.approvalType,
      targetType: approval.targetType,
      targetId: approval.targetId,
      runId: approval.runId,
      requestedBy: approval.requestedBy,
      status: approval.status,
      dueAt: approval.dueAt,
      createdAt: approval.createdAt,
      resolvedAt: approval.resolvedAt,
    });
    return approval;
  }

  approvalStore.set(approval.id, approval);
  return approval;
}

export async function resolveApproval(id: string, actorId: string, decision: "approved" | "rejected", comment?: string): Promise<ApprovalRequest | null> {
  const db = await getDb();
  if (db) {
    const { approvals } = await import("@sso/db");
    const approval = await db.query.approvals.findFirst({ where: (table) => eq(table.id, id) });
    if (!approval) return null;
    if (approval.status !== "pending") {
      return {
        id: approval.id,
        workspaceId: approval.workspaceId,
        approvalType: approval.approvalType,
        targetType: approval.targetType,
        targetId: approval.targetId,
        runId: approval.runId ?? undefined,
        requestedBy: approval.requestedBy ?? "unknown",
        status: approval.status as ApprovalStatus,
        dueAt: approval.dueAt ?? undefined,
        createdAt: approval.createdAt,
        resolvedAt: approval.resolvedAt ?? undefined,
      };
    }

    const actedAt = new Date();
    await db.update(approvals)
      .set({ status: decision, resolvedAt: actedAt })
      .where(eq(approvals.id, id));

    return {
      id: approval.id,
      workspaceId: approval.workspaceId,
      approvalType: approval.approvalType,
      targetType: approval.targetType,
      targetId: approval.targetId,
      runId: approval.runId ?? undefined,
      requestedBy: approval.requestedBy ?? "unknown",
      status: decision,
      dueAt: approval.dueAt ?? undefined,
      createdAt: approval.createdAt,
      resolvedAt: actedAt,
      resolution: {
        actorId,
        comment,
        actedAt,
      },
    };
  }

  const approval = approvalStore.get(id);
  if (!approval) return null;
  if (approval.status !== "pending") return approval;

  const updated: ApprovalRequest = {
    ...approval,
    status: decision,
    resolvedAt: new Date(),
    resolution: { actorId, comment, actedAt: new Date() },
  };
  approvalStore.set(id, updated);
  return updated;
}

export async function getApproval(id: string): Promise<ApprovalRequest | undefined> {
  const db = await getDb();
  if (db) {
    const approval = await db.query.approvals.findFirst({ where: (table) => eq(table.id, id) });
    if (!approval) return undefined;
    return {
      id: approval.id,
      workspaceId: approval.workspaceId,
      approvalType: approval.approvalType,
      targetType: approval.targetType,
      targetId: approval.targetId,
      runId: approval.runId ?? undefined,
      requestedBy: approval.requestedBy ?? "unknown",
      status: approval.status as ApprovalStatus,
      dueAt: approval.dueAt ?? undefined,
      createdAt: approval.createdAt,
      resolvedAt: approval.resolvedAt ?? undefined,
    };
  }

  return approvalStore.get(id);
}

export async function listApprovals(workspaceId: string, status?: ApprovalStatus): Promise<ApprovalRequest[]> {
  const db = await getDb();
  if (db) {
    const rows = await db.query.approvals.findMany({
      where: (table) => and(
        eq(table.workspaceId, workspaceId),
        status ? eq(table.status, status) : undefined,
      ),
      orderBy: (table) => [desc(table.createdAt)],
    });

    return rows.map((row) => ({
      id: row.id,
      workspaceId: row.workspaceId,
      approvalType: row.approvalType,
      targetType: row.targetType,
      targetId: row.targetId,
      runId: row.runId ?? undefined,
      requestedBy: row.requestedBy ?? "unknown",
      status: row.status as ApprovalStatus,
      dueAt: row.dueAt ?? undefined,
      createdAt: row.createdAt,
      resolvedAt: row.resolvedAt ?? undefined,
    }));
  }

  const all = Array.from(approvalStore.values()).filter((a) => a.workspaceId === workspaceId);
  if (status) return all.filter((a) => a.status === status);
  return all;
}

// ── RBAC Engine ───────────────────────────────────────────────────────────

const PERMISSION_MAP: Record<string, string[]> = {
  owner:   ["*"],
  admin:   ["graph.*", "artifact.*", "run.*", "connector.*", "approval.resolve"],
  editor:  ["graph.read", "graph.update", "artifact.read", "artifact.create", "run.trigger"],
  viewer:  ["graph.read", "artifact.read"],
  operator: ["run.trigger", "artifact.read", "approval.request"],
};

export function checkPermission(ctx: RBACContext, permission: string): boolean {
  for (const role of ctx.roles) {
    const perms = PERMISSION_MAP[role] ?? [];
    if (perms.includes("*") || perms.includes(permission)) return true;
    // Wildcard prefix matching: "graph.*" grants "graph.read", "graph.update" etc.
    const prefix = permission.split(".")[0];
    if (perms.includes(`${prefix}.*`)) return true;
  }
  return false;
}

export function requirePermission(ctx: RBACContext, permission: string): void {
  if (!checkPermission(ctx, permission)) {
    throw new Error(`Forbidden: ${ctx.userId} lacks permission '${permission}' in workspace ${ctx.workspaceId}`);
  }
}

// ── Budget Gate ───────────────────────────────────────────────────────────

export interface BudgetState {
  workspaceId: string;
  tokenBudget: number;
  tokensUsed: number;
  costBudgetUsd: number;
  costUsedUsd: number;
}

const budgetStore = new Map<string, BudgetState>();

function readCostFields(settings: unknown): { costBudgetUsd: number; costUsedUsd: number } {
  if (!settings || typeof settings !== "object") {
    return { costBudgetUsd: 50, costUsedUsd: 0 };
  }
  const bag = settings as Record<string, unknown>;
  const costBudgetUsd = typeof bag["costBudgetUsd"] === "number" ? bag["costBudgetUsd"] : 50;
  const costUsedUsd = typeof bag["costUsedUsd"] === "number" ? bag["costUsedUsd"] : 0;
  return { costBudgetUsd, costUsedUsd };
}

async function getBudgetState(workspaceId: string): Promise<BudgetState | undefined> {
  const db = await getDb();
  if (db) {
    const { workspaces } = await import("@sso/db");
    const row = await db.query.workspaces.findFirst({ where: (table) => eq(table.id, workspaceId) });
    if (row) {
      const cost = readCostFields(row.settings);
      return {
        workspaceId: row.id,
        tokenBudget: row.tokenBudget,
        tokensUsed: row.tokensUsed,
        costBudgetUsd: cost.costBudgetUsd,
        costUsedUsd: cost.costUsedUsd,
      };
    }
  }
  return budgetStore.get(workspaceId);
}

export async function initBudget(workspaceId: string, tokenBudget: number, costBudgetUsd: number): Promise<BudgetState> {
  const db = await getDb();
  if (db) {
    const { workspaces } = await import("@sso/db");
    const row = await db.query.workspaces.findFirst({ where: (table) => eq(table.id, workspaceId) });
    if (row) {
      const settings = {
        ...(typeof row.settings === "object" && row.settings ? row.settings as Record<string, unknown> : {}),
        costBudgetUsd,
        costUsedUsd: 0,
      };

      await db.update(workspaces)
        .set({
          tokenBudget,
          tokensUsed: 0,
          settings,
          updatedAt: new Date(),
        })
        .where(eq(workspaces.id, workspaceId));

      return {
        workspaceId,
        tokenBudget,
        tokensUsed: 0,
        costBudgetUsd,
        costUsedUsd: 0,
      };
    }
  }

  const state: BudgetState = { workspaceId, tokenBudget, tokensUsed: 0, costBudgetUsd, costUsedUsd: 0 };
  budgetStore.set(workspaceId, state);
  return state;
}

export async function checkBudget(workspaceId: string, tokensRequested: number, costUsd: number): Promise<{ allowed: boolean; reason?: string }> {
  const state = await getBudgetState(workspaceId);
  if (!state) return { allowed: true }; // no budget state = unlimited
  if (state.tokensUsed + tokensRequested > state.tokenBudget) {
    return { allowed: false, reason: `Token budget exceeded: ${state.tokensUsed}/${state.tokenBudget}` };
  }
  if (state.costUsedUsd + costUsd > state.costBudgetUsd) {
    return { allowed: false, reason: `Cost budget exceeded: $${state.costUsedUsd.toFixed(4)}/$${state.costBudgetUsd}` };
  }
  return { allowed: true };
}

export async function recordUsage(workspaceId: string, tokens: number, costUsd: number): Promise<void> {
  const db = await getDb();
  if (db) {
    const { workspaces } = await import("@sso/db");
    const row = await db.query.workspaces.findFirst({ where: (table) => eq(table.id, workspaceId) });
    if (row) {
      const cost = readCostFields(row.settings);
      const nextTokens = row.tokensUsed + tokens;
      const nextCost = cost.costUsedUsd + costUsd;
      const settings = {
        ...(typeof row.settings === "object" && row.settings ? row.settings as Record<string, unknown> : {}),
        costBudgetUsd: cost.costBudgetUsd,
        costUsedUsd: nextCost,
      };

      await db.update(workspaces)
        .set({
          tokensUsed: nextTokens,
          settings,
          updatedAt: new Date(),
        })
        .where(eq(workspaces.id, workspaceId));
      return;
    }
  }

  const state = budgetStore.get(workspaceId);
  if (!state) return;
  state.tokensUsed += tokens;
  state.costUsedUsd += costUsd;
}

// ── Audit Logger ──────────────────────────────────────────────────────────

export async function logAudit(params: Omit<AuditEvent, "id" | "createdAt">): Promise<AuditEvent> {
  const event: AuditEvent = {
    ...params,
    id: genId(),
    createdAt: new Date(),
  };

  const db = await getDb();
  if (db) {
    const { auditEvents } = await import("@sso/db");
    await db.insert(auditEvents).values({
      id: event.id,
      workspaceId: event.workspaceId,
      orgId: event.orgId,
      eventType: event.eventType,
      actorId: event.actorId,
      actorType: event.actorType,
      targetType: event.targetType,
      targetId: event.targetId,
      payload: event.payload,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      createdAt: event.createdAt,
    });
    return event;
  }

  auditLog.push(event);
  // Keep last 10,000 events in memory (real impl → DB)
  if (auditLog.length > 10000) auditLog.splice(0, auditLog.length - 10000);
  return event;
}

export async function getAuditLog(workspaceId: string, limit = 100): Promise<AuditEvent[]> {
  const db = await getDb();
  if (db) {
    const rows = await db.query.auditEvents.findMany({
      where: (table) => eq(table.workspaceId, workspaceId),
      orderBy: (table) => [desc(table.createdAt)],
      limit,
    });

    return rows.map((row) => ({
      id: row.id,
      workspaceId: row.workspaceId,
      orgId: row.orgId,
      eventType: row.eventType,
      actorId: row.actorId ?? undefined,
      actorType: row.actorType as ActorType,
      targetType: row.targetType ?? undefined,
      targetId: row.targetId ?? undefined,
      payload: (row.payload ?? {}) as Record<string, unknown>,
      ipAddress: row.ipAddress ?? undefined,
      userAgent: row.userAgent ?? undefined,
      createdAt: row.createdAt,
    }));
  }

  return auditLog
    .filter((e) => e.workspaceId === workspaceId)
    .slice(-limit)
    .reverse();
}

// ── Policy Evaluator ──────────────────────────────────────────────────────

export interface PolicyEvalContext {
  nodeId: string;
  nodeKey: string;
  workspaceId: string;
  userId: string;
  roles: string[];
  estimatedCostUsd?: number;
  estimatedTokens?: number;
}

export interface PolicyEvalResult {
  allowed: boolean;
  requiresApproval: boolean;
  approvalId?: string;
  reason?: string;
}

export async function evaluatePolicies(policies: PolicyRule[], ctx: PolicyEvalContext): Promise<PolicyEvalResult> {
  const applicable = policies.filter((p) => p.targetNodeId === ctx.nodeId || p.targetNodeId === "*");

  for (const policy of applicable) {
    if (policy.type === "rbac") {
      const required = (policy.config["permission"] as string | undefined) ?? "run.trigger";
      const rbacCtx: RBACContext = { userId: ctx.userId, orgId: "", workspaceId: ctx.workspaceId, roles: ctx.roles };
      if (!checkPermission(rbacCtx, required)) {
        return { allowed: false, requiresApproval: false, reason: `RBAC: missing ${required}` };
      }
    }

    if (policy.type === "budget_cap" && ctx.estimatedCostUsd !== undefined) {
      const check = await checkBudget(ctx.workspaceId, ctx.estimatedTokens ?? 0, ctx.estimatedCostUsd);
      if (!check.allowed) {
        return { allowed: false, requiresApproval: false, reason: check.reason };
      }
    }

    if (policy.type === "approval_required") {
      const approval = await requestApproval({
        workspaceId: ctx.workspaceId,
        approvalType: (policy.config["approvalType"] as string | undefined) ?? "action",
        targetType:   "node",
        targetId:     ctx.nodeId,
        requestedBy:  ctx.userId,
      });
      return { allowed: false, requiresApproval: true, approvalId: approval.id };
    }
  }

  return { allowed: true, requiresApproval: false };
}
