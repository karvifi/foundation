import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Context } from "hono";
import type { CloneRepoPattern, EngineId, EnginePack, IntentRequest } from "@sso/contracts";
import { buildFromIntent } from "@sso/graph-engine";
import { getWorkspaceUsage } from "@sso/ai-gateway";
import { executeWorkflow } from "@sso/connector-runtime";
import {
  augmentPromptWithCapabilities,
  buildCloneCapabilityCatalog,
  buildCloneIngestionBrief,
  buildCloneRepoPatternCatalog,
  buildRepoCatalog,
  extractCloneCodeSignatures,
  extractCloneRepoPattern,
  extractCloneTemplateSnippets,
  selectCorpusRepos,
  selectReposForPrompt,
} from "@sso/repo-intelligence";
import { getWorkflow, listWorkflows, upsertWorkflow } from "@sso/workflow-store";
import { createArtifact, deleteArtifact, exportArtifactAsJson, getArtifact, getArtifactLineage, linkArtifacts, listArtifacts, reviseArtifact, updateArtifactStatus } from "@sso/artifact-service";
import { evaluatePolicies, getApproval, getAuditLog, initBudget, listApprovals, logAudit, recordUsage, requirePermission, resolveApproval, type PolicyRule } from "@sso/policy-engine";
import { airtableAdapter, hubspotAdapter, jiraAdapter, linearAdapter, n8nAdapter, notionAdapter, slackAdapter, type AdapterCredential } from "@sso/connector-adapters";
import type { AppCatalogItem, CloneCapability, SkillCatalogItem } from "@sso/contracts";
import { createWorkspaceSession, getWorkspaceSession, listSessionEvents, listWorkspacePatterns, publishRecordSelected } from "@sso/workspace-orchestrator";

const app = new Hono();
app.use("*", cors({ origin: "http://localhost:3000" }));

const deploymentStore = new Map<string, {
  id: string;
  appId: string;
  workspaceId: string;
  graphId: string;
  status: "pending" | "building" | "live" | "failed" | "paused";
  deploymentUrl?: string;
  createdAt: string;
  updatedAt: string;
}>();

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

const approvalPolicies: PolicyRule[] = [
  {
    id: "pol_email_send",
    type: "approval_required",
    targetNodeId: "*",
    config: { approvalType: "dangerous_write" },
  },
];

function buildAdoptedTemplateKeys(repoPatterns: CloneRepoPattern[]): string[] {
  const keys = new Set<string>();
  for (const pattern of repoPatterns) {
    for (const framework of pattern.frameworks.slice(0, 3)) {
      keys.add(`${pattern.slug}:${framework}`);
    }
    for (const signature of pattern.sampleSignatures.slice(0, 4)) {
      keys.add(`${pattern.slug}:${signature.kind}:${signature.symbol}`);
    }
  }
  return Array.from(keys).slice(0, 24);
}

function engineKeywords(engineId: EngineId): string[] {
  switch (engineId) {
    case "crm":
      return ["crm", "contact", "deal", "lead", "account"];
    case "email":
      return ["email", "mail", "inbox", "compose", "thread"];
    case "calendar":
      return ["calendar", "meeting", "schedule", "event"];
    case "document":
      return ["document", "wiki", "page", "knowledge", "note"];
    case "dashboard":
      return ["dashboard", "metric", "chart", "analytics"];
    case "issues":
      return ["issue", "ticket", "sprint", "board", "project"];
    case "code_ide":
      return ["code", "editor", "repository", "commit", "ide"];
    case "terminal":
      return ["terminal", "cli", "shell", "command"];
    case "research":
      return ["research", "search", "knowledge", "source"];
    case "sheet":
      return ["sheet", "spreadsheet", "table", "cell"];
    case "invoice":
      return ["invoice", "billing", "payment", "finance"];
    case "support":
      return ["support", "ticket", "customer", "conversation"];
    case "health":
      return ["health", "score", "sla", "risk"];
    case "chat":
      return ["chat", "message", "assistant", "conversation"];
    case "video":
      return ["video", "webrtc", "meeting", "call"];
    default:
      return [engineId];
  }
}

function buildEnginePacksFromPatterns(repoPatterns: CloneRepoPattern[]): EnginePack[] {
  const engineIds: EngineId[] = [
    "crm", "email", "calendar", "document", "dashboard", "issues", "code_ide", "terminal",
    "research", "sheet", "invoice", "support", "health", "chat", "video",
  ];

  return engineIds.map((engineId) => {
    const ranked = repoPatterns
      .map((pattern) => {
        const text = [
          pattern.slug,
          pattern.manifestName ?? "",
          ...pattern.frameworks,
          ...pattern.keywords,
          ...pattern.dependencies,
          ...pattern.readmeHighlights,
          ...pattern.sampleSignatures.map((item) => `${item.symbol} ${item.signature}`),
          ...pattern.sampleTemplates.map((item) => `${item.summary} ${item.file}`),
        ].join(" ").toLowerCase();
        let score = 0;
        for (const keyword of engineKeywords(engineId)) {
          if (text.includes(keyword)) score += 3;
        }
        return { pattern, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    if (ranked.length === 0) return null;

    const patterns = ranked.map((item) => item.pattern);
    const sourceRepoSlugs = patterns.map((pattern) => pattern.slug);
    const frameworks = Array.from(new Set(patterns.flatMap((pattern) => pattern.frameworks))).slice(0, 6);
    const capabilities = Array.from(new Set(patterns.flatMap((pattern) => pattern.keywords))).slice(0, 6);
    const adoptedTemplateKeys = buildAdoptedTemplateKeys(patterns).slice(0, 8);

    return {
      id: `pack_${engineId}`,
      engineId,
      title: `${engineId.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())} Pack`,
      summary: `${engineId.replace(/_/g, " ")} engine synthesized from ${sourceRepoSlugs.join(", ")}`,
      sourceRepoSlugs,
      frameworks,
      adoptedTemplateKeys,
      capabilities,
    } satisfies EnginePack;
  }).filter((item): item is EnginePack => item !== null);
}

function authContext(c: Context, workspaceId = "ws_demo") {
  const userId = c.req.header("x-user-id") ?? "usr_demo";
  const orgId = c.req.header("x-org-id") ?? "org_demo";
  const role = c.req.header("x-user-role") ?? "owner";
  return { userId, orgId, workspaceId, roles: [role] };
}

const appCatalog: AppCatalogItem[] = [
  {
    id: "app_revenue_os",
    name: "Revenue OS",
    category: "crm",
    summary: "Pipeline, account intelligence, and lifecycle automation for B2B sales teams.",
    capabilities: ["lead scoring", "pipeline automation", "sequence builder", "territory analytics"],
    references: [{ key: "hubspot", reference: "reference only" }, { key: "salesforce", reference: "reference only" }],
    starterPrompt: "Build me Revenue OS with lead scoring, deal stage automations, and account timeline."
  },
  {
    id: "app_knowledge_os",
    name: "Knowledge OS",
    category: "work",
    summary: "Collaborative docs, knowledge graph search, and live decision logs.",
    capabilities: ["block editor", "knowledge graph", "meeting notes sync", "doc approvals"],
    references: [{ key: "notion", reference: "reference only" }],
    starterPrompt: "Build me Knowledge OS with team wikis, approvals, and semantic retrieval."
  },
  {
    id: "app_project_os",
    name: "Project OS",
    category: "work",
    summary: "Execution operating system with goals, issues, and delivery telemetry.",
    capabilities: ["roadmap planning", "sprint management", "issue dependencies", "release health"],
    references: [{ key: "jira", reference: "reference only" }, { key: "linear", reference: "reference only" }],
    starterPrompt: "Build me Project OS with epics, sprints, risk scoring, and release dashboards."
  },
  {
    id: "app_support_os",
    name: "Support OS",
    category: "support",
    summary: "Omnichannel support desk with AI triage and SLA policy controls.",
    capabilities: ["ticket routing", "SLA timers", "AI triage", "customer health"],
    references: [{ key: "zendesk", reference: "reference only" }, { key: "intercom", reference: "reference only" }],
    starterPrompt: "Build me Support OS with AI routing, SLA playbooks, and escalation automation."
  },
  {
    id: "app_commerce_os",
    name: "Commerce OS",
    category: "commerce",
    summary: "Catalog, orders, promotions, and merchant analytics for digital commerce.",
    capabilities: ["catalog studio", "order orchestration", "promotion engine", "merchant analytics"],
    references: [{ key: "shopify", reference: "reference only" }],
    starterPrompt: "Build me Commerce OS with product catalog workflows, pricing rules, and fulfillment states."
  },
  {
    id: "app_automation_os",
    name: "Automation OS",
    category: "automation",
    summary: "Visual workflow automation with runtime governance and execution traces.",
    capabilities: ["workflow canvas", "connector actions", "runtime policy", "run replay"],
    references: [{ key: "n8n", reference: "reference only" }, { key: "dify", reference: "reference only" }],
    starterPrompt: "Build me Automation OS with event triggers, policy gates, and cost controls."
  }
];

const skillCatalog: SkillCatalogItem[] = [
  { id: "skill_intent_planner", name: "Intent Planner", description: "Converts natural language goals into executable graph plans.", category: "ai", level: "core" },
  { id: "skill_graph_compiler", name: "Graph Compiler", description: "Validates node/edge contracts and compiles canonical graph versions.", category: "automation", level: "core" },
  { id: "skill_surface_compiler", name: "Surface Compiler", description: "Maps graph topology into builder, operator, and canvas surfaces.", category: "ui", level: "core" },
  { id: "skill_policy_guard", name: "Policy Guard", description: "Enforces RBAC, budget caps, approvals, and audit logging.", category: "governance", level: "core" },
  { id: "skill_connector_studio", name: "Connector Studio", description: "Creates and manages provider-agnostic connector contracts.", category: "integration", level: "advanced" },
  { id: "skill_artifact_lineage", name: "Artifact Lineage", description: "Tracks immutable revisions, lineage links, and export chains.", category: "data", level: "core" },
  { id: "skill_deploy_orchestrator", name: "Deploy Orchestrator", description: "Controls build, promote, rollback, and environment status flows.", category: "automation", level: "advanced" },
  { id: "skill_observability", name: "Runtime Observability", description: "Captures run traces, token burn, and operational health metrics.", category: "data", level: "advanced" }
];

app.get("/health", (c) => c.json({ status: "ok" }));

app.get("/catalog/apps", (c) => {
  return c.json({
    items: appCatalog,
    policy: {
      logosAllowed: false,
      referenceNamesOnly: true,
      ownership: "first_party"
    }
  });
});

app.get("/catalog/skills", (c) => {
  return c.json({ items: skillCatalog });
});

app.get("/workspace/patterns", (c) => {
  return c.json({ items: listWorkspacePatterns() });
});

app.post("/workspace/sessions", async (c) => {
  requirePermission(authContext(c), "graph.update");
  const body = (await c.req.json()) as { workspaceId?: string; patternId?: string };
  if (!body.workspaceId || !body.patternId) {
    return c.json({ error: "workspaceId and patternId are required" }, 400);
  }
  try {
    const session = await createWorkspaceSession(body.workspaceId, body.patternId);
    return c.json(session, 201);
  } catch (err) {
    return c.json({ error: String(err) }, 400);
  }
});

app.get("/workspace/sessions/:id", async (c) => {
  const session = await getWorkspaceSession(c.req.param("id"));
  if (!session) return c.json({ error: "workspace session not found" }, 404);
  return c.json(session);
});

app.get("/workspace/sessions/:id/events", async (c) => {
  const sessionId = c.req.param("id");
  const session = await getWorkspaceSession(sessionId);
  if (!session) return c.json({ error: "workspace session not found" }, 404);
  const limit = Number(c.req.query("limit") ?? "50");
  return c.json({ items: await listSessionEvents(sessionId, limit) });
});

app.post("/workspace/sessions/:id/select", async (c) => {
  requirePermission(authContext(c), "run.trigger");
  const sessionId = c.req.param("id");
  const body = (await c.req.json()) as {
    sourceEngineId?: "crm" | "document" | "sheet" | "code_ide";
    entityType?: string;
    entityId?: string;
    selectedLabel?: string;
  };
  if (!body.sourceEngineId || !body.entityType || !body.entityId || !body.selectedLabel) {
    return c.json({ error: "sourceEngineId, entityType, entityId, selectedLabel are required" }, 400);
  }
  try {
    const propagation = await publishRecordSelected(
      sessionId,
      body.sourceEngineId,
      body.entityType,
      body.entityId,
      body.selectedLabel,
    );
    return c.json(propagation);
  } catch (err) {
    return c.json({ error: String(err) }, 400);
  }
});

app.post("/workspaces/:id/budget", async (c) => {
  const workspaceId = c.req.param("id");
  requirePermission(authContext(c, workspaceId), "run.trigger");
  const body = (await c.req.json()) as { tokenBudget?: number; costBudgetUsd?: number };
  const budget = await initBudget(workspaceId, body.tokenBudget ?? 50000, body.costBudgetUsd ?? 50);
  return c.json(budget);
});

app.get("/intake/summary", (c) => {
  return c.json(buildRepoCatalog());
});

app.post("/intake/select", async (c) => {
  const body = (await c.req.json()) as { prompt?: string; limit?: number };
  if (!body.prompt) return c.json({ error: "prompt is required" }, 400);
  const items = selectReposForPrompt(body.prompt, process.cwd(), body.limit ?? 10);
  return c.json({ items });
});

app.get("/intake/capabilities", (c) => {
  const limit = Number(c.req.query("limit") ?? "24");
  const items = buildCloneCapabilityCatalog(process.cwd(), limit);
  return c.json({ items });
});

app.get("/intake/repo-patterns", (c) => {
  const limit = Number(c.req.query("limit") ?? "30");
  const mode = c.req.query("mode") ?? "focused";
  if (mode === "full") {
    return c.json({ items: buildCloneRepoPatternCatalog(process.cwd(), Math.max(limit, 120)) });
  }
  return c.json({ items: buildCloneRepoPatternCatalog(process.cwd(), limit) });
});

app.get("/intake/ingestion-brief", (c) => {
  return c.json(buildCloneIngestionBrief(process.cwd()));
});

app.post("/intake/capabilities/augment", async (c) => {
  const body = (await c.req.json()) as { prompt?: string; capabilityIds?: string[] };
  if (!body.prompt) return c.json({ error: "prompt is required" }, 400);
  const result = augmentPromptWithCapabilities(body.prompt, body.capabilityIds ?? [], process.cwd());
  return c.json({
    augmentedPrompt: result.augmentedPrompt,
    selected: result.selected satisfies CloneCapability[],
  });
});

app.get("/intake/repo-pattern", (c) => {
  const slug = c.req.query("slug");
  if (!slug) return c.json({ error: "slug is required" }, 400);
  const mode = c.req.query("mode") === "deep" ? "deep" : "sample";
  const pattern = extractCloneRepoPattern(slug, process.cwd(), mode);
  if (!pattern) return c.json({ error: "cloned repo not found for slug" }, 404);
  return c.json(pattern);
});

app.get("/intake/repo-signatures", (c) => {
  const slug = c.req.query("slug");
  if (!slug) return c.json({ error: "slug is required" }, 400);
  const limit = Number(c.req.query("limit") ?? "60");
  const mode = c.req.query("mode") === "deep" ? "deep" : "sample";
  const signatures = extractCloneCodeSignatures(slug, process.cwd(), limit, mode);
  return c.json({ slug, items: signatures });
});

app.get("/intake/repo-templates", (c) => {
  const slug = c.req.query("slug");
  if (!slug) return c.json({ error: "slug is required" }, 400);
  const limit = Number(c.req.query("limit") ?? "18");
  const mode = c.req.query("mode") === "deep" ? "deep" : "sample";
  const templates = extractCloneTemplateSnippets(slug, process.cwd(), limit, mode);
  return c.json({ slug, items: templates });
});

app.post("/intake/synthesis-pack", async (c) => {
  const body = (await c.req.json()) as {
    prompt?: string;
    capabilityIds?: string[];
    absorbAllCloneCapabilities?: boolean;
    repoLimit?: number;
  };
  if (!body.prompt) return c.json({ error: "prompt is required" }, 400);

  const repoLimit = body.repoLimit ?? 6;
  const selectedRepos = selectReposForPrompt(body.prompt, process.cwd(), repoLimit);
  const corpusRepos = body.absorbAllCloneCapabilities
    ? selectCorpusRepos(process.cwd(), 140)
    : selectedRepos;

  const allCapabilities = buildCloneCapabilityCatalog(process.cwd(), 80);
  const selectedCapabilities = body.absorbAllCloneCapabilities
    ? allCapabilities
    : allCapabilities.filter((capability) => (body.capabilityIds ?? []).includes(capability.id));

  const augmented = augmentPromptWithCapabilities(
    body.prompt,
    selectedCapabilities.map((capability) => capability.id),
    process.cwd(),
  );

  const repoPatterns = corpusRepos
    .map((repo) => extractCloneRepoPattern(repo.slug, process.cwd()))
    .filter((item): item is NonNullable<typeof item> => item !== null);
  const adoptedTemplateKeys = buildAdoptedTemplateKeys(repoPatterns);
  const enginePacks = buildEnginePacksFromPatterns(repoPatterns);

  return c.json({
    augmentedPrompt: augmented.augmentedPrompt,
    selectedRepos,
    selectedCapabilities,
    repoPatterns,
    adoptedTemplateKeys,
    enginePacks,
  });
});

app.get("/workflows", (c) => {
  return c.json({ items: listWorkflows() });
});

app.get("/workflows/:id", (c) => {
  const id = c.req.param("id");
  const hit = getWorkflow(id);
  if (!hit) return c.json({ error: "workflow not found" }, 404);
  return c.json(hit);
});

app.post("/workflows/:id/run", async (c) => {
  const id = c.req.param("id");
  requirePermission(authContext(c), "run.trigger");
  const hit = getWorkflow(id);
  if (!hit) return c.json({ error: "workflow not found" }, 404);

  const decision = await evaluatePolicies(approvalPolicies, {
    nodeId: "*",
    nodeKey: "runtime.execute",
    workspaceId: "ws_demo",
    userId: "usr_demo",
    roles: ["owner"],
    estimatedCostUsd: 0.01,
    estimatedTokens: 300,
  });

  if (decision.requiresApproval) {
    return c.json({
      status: "waiting_approval",
      approvalId: decision.approvalId,
      message: "Run requires approval",
    }, 202);
  }

  const run = executeWorkflow(hit.graph);
  await recordUsage("ws_demo", 300, 0.01);
  await logAudit({
    workspaceId: "ws_demo",
    orgId: "org_demo",
    eventType: "workflow.run",
    actorId: "usr_demo",
    actorType: "user",
    targetType: "workflow",
    targetId: id,
    payload: { nodeCount: hit.graph.nodes.length },
  });

  return c.json(run);
});

app.post("/intent/build", async (c) => {
  requirePermission(authContext(c), "graph.update");
  const body = (await c.req.json()) as Partial<IntentRequest>;
  if (!body.prompt || !body.workspaceId || !body.userId) {
    return c.json({ error: "prompt, workspaceId, userId are required" }, 400);
  }

  const selectedRepos = selectReposForPrompt(body.prompt, process.cwd(), 8);
  const corpusRepos = body.absorbAllCloneCapabilities
    ? selectCorpusRepos(process.cwd(), 140)
    : selectedRepos;
  const allCapabilities = buildCloneCapabilityCatalog(process.cwd(), 60);
  const selectedCapabilities = body.absorbAllCloneCapabilities
    ? allCapabilities
    : allCapabilities.filter((capability) => (body.capabilityIds ?? []).includes(capability.id));
  const signatureHints = corpusRepos.flatMap((repo) =>
    extractCloneCodeSignatures(repo.slug, process.cwd(), 5).map((signature) => `${signature.kind}:${signature.symbol}`),
  );
  const templateFiles = corpusRepos.flatMap((repo) =>
    extractCloneTemplateSnippets(repo.slug, process.cwd(), 2).map((template) => template.file),
  );
  const repoPatterns = corpusRepos
    .map((repo) => extractCloneRepoPattern(repo.slug, process.cwd()))
    .filter((item): item is NonNullable<typeof item> => item !== null);
  const adoptedTemplateKeys = buildAdoptedTemplateKeys(repoPatterns);
  const enginePacks = buildEnginePacksFromPatterns(repoPatterns);

  let prompt = body.prompt;
  if (body.absorbAllCloneCapabilities) {
    const augmented = augmentPromptWithCapabilities(prompt, allCapabilities.map((capability) => capability.id), process.cwd());
    prompt = augmented.augmentedPrompt;
  } else if ((body.capabilityIds ?? []).length > 0) {
    const augmented = augmentPromptWithCapabilities(prompt, body.capabilityIds ?? [], process.cwd());
    prompt = augmented.augmentedPrompt;
  }

  const result = buildFromIntent({
    prompt,
    workspaceId: body.workspaceId,
    userId: body.userId,
    workspacePatternId: body.workspacePatternId,
    capabilityIds: selectedCapabilities.map((capability) => capability.id),
    absorbAllCloneCapabilities: body.absorbAllCloneCapabilities,
  }, {
    synthesis: {
      workspacePatternId: body.workspacePatternId ?? "sales_workspace",
      selectedRepoSlugs: corpusRepos.map((repo) => repo.slug).slice(0, 140),
      selectedCapabilityIds: selectedCapabilities.map((capability) => capability.id),
      signatureHints,
      templateFiles,
      repoPatterns,
      adoptedTemplateKeys,
      enginePacks,
    },
  });
  upsertWorkflow(result);

  await logAudit({
    workspaceId: body.workspaceId,
    orgId: "org_demo",
    eventType: "intent.build",
    actorId: body.userId,
    actorType: "user",
    targetType: "workflow",
    targetId: result.graph.id,
    payload: { promptLength: prompt.length },
  });

  return c.json({
    ...result,
    billing: {
      usedTokens: getWorkspaceUsage(body.workspaceId)
    },
    intake: {
      selectedRepos,
      selectedCapabilities,
      adoptedTemplateKeys,
      enginePacks,
    }
  });
});

// ── Approval API ──────────────────────────────────────────────────────────

app.get("/approvals", async (c) => {
  const workspaceId = c.req.query("workspaceId") ?? "ws_demo";
  const status = c.req.query("status") as "pending" | "approved" | "rejected" | "expired" | "cancelled" | undefined;
  return c.json({ items: await listApprovals(workspaceId, status) });
});

app.get("/approvals/:id", async (c) => {
  const approval = await getApproval(c.req.param("id"));
  if (!approval) return c.json({ error: "approval not found" }, 404);
  return c.json(approval);
});

app.post("/approvals/:id/resolve", async (c) => {
  requirePermission(authContext(c), "approval.resolve");
  const id = c.req.param("id");
  const body = (await c.req.json()) as { actorId?: string; decision?: "approved" | "rejected"; comment?: string };
  if (!body.actorId || !body.decision) {
    return c.json({ error: "actorId and decision are required" }, 400);
  }
  const approval = await resolveApproval(id, body.actorId, body.decision, body.comment);
  if (!approval) return c.json({ error: "approval not found" }, 404);
  return c.json(approval);
});

// ── Artifact API ──────────────────────────────────────────────────────────

app.get("/artifacts", async (c) => {
  const workspaceId = c.req.query("workspaceId") ?? "ws_demo";
  const type = c.req.query("type") as Parameters<typeof listArtifacts>[1] | undefined;
  const status = c.req.query("status") as Parameters<typeof listArtifacts>[2] | undefined;
  return c.json({ items: await listArtifacts(workspaceId, type, status) });
});

app.post("/artifacts", async (c) => {
  requirePermission(authContext(c), "artifact.create");
  const body = (await c.req.json()) as {
    workspaceId?: string;
    artifactType?: Parameters<typeof createArtifact>[0]["artifactType"];
    name?: string;
    content?: unknown;
    metadata?: Record<string, unknown>;
    tags?: string[];
    createdBy?: string;
  };
  if (!body.workspaceId || !body.artifactType || !body.name) {
    return c.json({ error: "workspaceId, artifactType, and name are required" }, 400);
  }
  const artifact = await createArtifact({
    workspaceId: body.workspaceId,
    artifactType: body.artifactType,
    name: body.name,
    content: body.content ?? {},
    metadata: body.metadata,
    tags: body.tags,
    createdBy: body.createdBy,
  });
  return c.json(artifact, 201);
});

app.get("/artifacts/:id", async (c) => {
  const artifact = await getArtifact(c.req.param("id"));
  if (!artifact) return c.json({ error: "artifact not found" }, 404);
  return c.json(artifact);
});

app.post("/artifacts/:id/revise", async (c) => {
  requirePermission(authContext(c), "artifact.create");
  const id = c.req.param("id");
  const body = (await c.req.json()) as { content?: unknown; changeSummary?: string; createdBy?: string };
  const updated = await reviseArtifact(id, body.content ?? {}, { changeSummary: body.changeSummary, createdBy: body.createdBy });
  if (!updated) return c.json({ error: "artifact not found" }, 404);
  return c.json(updated);
});

app.post("/artifacts/:id/status", async (c) => {
  requirePermission(authContext(c), "artifact.create");
  const id = c.req.param("id");
  const body = (await c.req.json()) as { status?: "draft" | "review" | "approved" | "published" | "archived" };
  if (!body.status) return c.json({ error: "status is required" }, 400);
  const updated = await updateArtifactStatus(id, body.status);
  if (!updated) return c.json({ error: "artifact not found" }, 404);
  return c.json(updated);
});

app.get("/artifacts/:id/export", async (c) => {
  const payload = await exportArtifactAsJson(c.req.param("id"));
  if (!payload) return c.json({ error: "artifact not found" }, 404);
  return c.text(payload);
});

app.get("/artifacts/:id/lineage", (c) => {
  return c.json(getArtifactLineage(c.req.param("id")));
});

app.post("/artifacts/link", async (c) => {
  const body = (await c.req.json()) as { parentId?: string; childId?: string; relationType?: "source" | "derived" | "export_of" | "snapshot_of" };
  if (!body.parentId || !body.childId || !body.relationType) {
    return c.json({ error: "parentId, childId, relationType are required" }, 400);
  }
  linkArtifacts(body.parentId, body.childId, body.relationType);
  return c.json({ ok: true });
});

app.delete("/artifacts/:id", async (c) => {
  requirePermission(authContext(c), "artifact.create");
  const ok = await deleteArtifact(c.req.param("id"));
  if (!ok) return c.json({ error: "artifact not found" }, 404);
  return c.json({ ok: true });
});

// ── Deployment plane (mock control-plane implementation) ─────────────────

app.post("/apps/:id/deploy", async (c) => {
  requirePermission(authContext(c), "run.trigger");
  const appId = c.req.param("id");
  const body = (await c.req.json()) as { workspaceId?: string; graphId?: string };
  if (!body.workspaceId || !body.graphId) {
    return c.json({ error: "workspaceId and graphId are required" }, 400);
  }
  const id = `dep_${Date.now()}`;
  const createdAt = new Date().toISOString();

  const db = await getDb();
  if (db) {
    const { synthesizedApps } = await import("@sso/db");
    const slug = `${appId}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    await db.insert(synthesizedApps).values({
      id,
      workspaceId: body.workspaceId,
      graphId: body.graphId,
      name: appId,
      slug,
      deploymentStatus: "building",
      createdBy: authContext(c, body.workspaceId).userId,
      createdAt: new Date(createdAt),
      updatedAt: new Date(createdAt),
    });
    return c.json({ deploymentId: id, status: "building" }, 202);
  }

  deploymentStore.set(id, {
    id,
    appId,
    workspaceId: body.workspaceId,
    graphId: body.graphId,
    status: "building",
    createdAt,
    updatedAt: createdAt,
  });
  return c.json({ deploymentId: id, status: "building" }, 202);
});

app.get("/deployments/:id", async (c) => {
  const id = c.req.param("id");

  const db = await getDb();
  if (db) {
    const { synthesizedApps } = await import("@sso/db");
    const row = await db.query.synthesizedApps.findFirst({ where: (table, ops) => ops.eq(table.id, id) });
    if (!row) return c.json({ error: "deployment not found" }, 404);

    let status = row.deploymentStatus as "pending" | "building" | "live" | "failed" | "paused";
    let deploymentUrl = row.deploymentUrl ?? undefined;
    let updatedAt = row.updatedAt;

    if (status === "building" && Date.now() - row.createdAt.getTime() > 1500) {
      status = "live";
      deploymentUrl = `https://preview-${row.name}.sso.local`;
      updatedAt = new Date();
    }

    return c.json({
      id: row.id,
      appId: row.name,
      workspaceId: row.workspaceId,
      graphId: row.graphId,
      status,
      deploymentUrl,
      createdAt: row.createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    });
  }

  const dep = deploymentStore.get(id);
  if (!dep) return c.json({ error: "deployment not found" }, 404);

  // Simulate state transition to live
  if (dep.status === "building" && Date.now() - new Date(dep.createdAt).getTime() > 1500) {
    dep.status = "live";
    dep.deploymentUrl = `https://preview-${dep.appId}.sso.local`;
    dep.updatedAt = new Date().toISOString();
  }
  return c.json(dep);
});

// ── Connector endpoint execution (real adapters) ─────────────────────────

function readCredentialFromEnv(connector: string): AdapterCredential {
  const normalized = connector.toUpperCase();
  const value = process.env[`${normalized}_TOKEN`] ?? process.env[`${normalized}_API_KEY`] ?? "";
  const baseUrl = process.env[`${normalized}_BASE_URL`];
  return {
    type: "bearer",
    value,
    baseUrl,
    extra: {
      domain: process.env[`${normalized}_DOMAIN`] ?? "",
      email: process.env[`${normalized}_EMAIL`] ?? "",
    },
  };
}

type ConnectorPreflightItem = {
  connector: string;
  ready: boolean;
  checks: {
    token: boolean;
    baseUrl: boolean;
  };
  message: string;
};

function getConnectorPreflightItems(): ConnectorPreflightItem[] {
  const connectors = ["hubspot", "notion", "jira", "linear", "slack", "airtable", "n8n"];
  return connectors.map(buildConnectorPreflight);
}

function buildConnectorPreflight(connector: string): ConnectorPreflightItem {
  const normalized = connector.toUpperCase();
  const token = (process.env[`${normalized}_TOKEN`] ?? process.env[`${normalized}_API_KEY`] ?? "").trim();
  const baseUrl = (process.env[`${normalized}_BASE_URL`] ?? "").trim();
  const requiresBaseUrl = connector === "n8n" || connector === "airtable";
  const tokenReady = token.length > 0;
  const baseUrlReady = requiresBaseUrl ? baseUrl.length > 0 : true;
  const ready = tokenReady && baseUrlReady;

  let message = "ready";
  if (!tokenReady && !baseUrlReady) {
    message = "missing token and base URL";
  } else if (!tokenReady) {
    message = "missing token";
  } else if (!baseUrlReady) {
    message = "missing base URL";
  }

  return {
    connector,
    ready,
    checks: {
      token: tokenReady,
      baseUrl: baseUrlReady,
    },
    message,
  };
}

app.get("/connectors/preflight", (c) => {
  const items = getConnectorPreflightItems();
  return c.json({
    items,
    readyCount: items.filter((item) => item.ready).length,
    total: items.length,
  });
});

app.get("/system/readiness", (c) => {
  const connectorItems = getConnectorPreflightItems();
  const connectorReadyCount = connectorItems.filter((item) => item.ready).length;
  const connectorTotal = connectorItems.length;

  const workspacePatternsCount = listWorkspacePatterns().length;
  const repoCatalogCount = buildRepoCatalog(process.cwd()).items.length;
  const capabilityCount = buildCloneCapabilityCatalog(process.cwd(), 40).length;

  const checks = {
    health: true,
    workspacePatterns: workspacePatternsCount > 0,
    cloneRepoIngestion: repoCatalogCount > 0,
    cloneCapabilityCatalog: capabilityCount > 0,
    connectorPreflight: {
      ready: connectorReadyCount === connectorTotal,
      readyCount: connectorReadyCount,
      total: connectorTotal,
    },
  };

  const ready = checks.health
    && checks.workspacePatterns
    && checks.cloneRepoIngestion
    && checks.cloneCapabilityCatalog
    && checks.connectorPreflight.ready;

  return c.json({
    status: ready ? "ready" : "attention_required",
    checks,
  });
});

app.post("/connectors/:connector/execute", async (c) => {
  requirePermission(authContext(c), "connector.execute");
  const connector = c.req.param("connector");
  const body = (await c.req.json()) as { operation?: string; input?: Record<string, unknown> };
  if (!body.operation) return c.json({ error: "operation is required" }, 400);
  const cred = readCredentialFromEnv(connector);

  try {
    if (connector === "hubspot" && body.operation === "listDeals") {
      return c.json(await hubspotAdapter.listDeals(cred));
    }
    if (connector === "notion" && body.operation === "searchPages") {
      return c.json(await notionAdapter.searchPages(cred, String(body.input?.["query"] ?? "")));
    }
    if (connector === "jira" && body.operation === "listIssues") {
      return c.json(await jiraAdapter.listIssues(cred));
    }
    if (connector === "linear" && body.operation === "listIssues") {
      return c.json(await linearAdapter.listIssues(cred, body.input?.["teamId"] as string | undefined));
    }
    if (connector === "slack" && body.operation === "postMessage") {
      return c.json(await slackAdapter.postMessage(cred, String(body.input?.["channel"] ?? "general"), String(body.input?.["text"] ?? "Hello from SSO")));
    }
    if (connector === "airtable" && body.operation === "listRecords") {
      return c.json(await airtableAdapter.listRecords(cred, String(body.input?.["baseId"] ?? ""), String(body.input?.["tableId"] ?? "")));
    }
    if (connector === "n8n" && body.operation === "listWorkflows") {
      return c.json(await n8nAdapter.listWorkflows(cred));
    }
    return c.json({ error: `Unsupported connector operation: ${connector}.${body.operation}` }, 400);
  } catch (err) {
    return c.json({ ok: false, error: String(err) }, 500);
  }
});

app.get("/audit", async (c) => {
  const workspaceId = c.req.query("workspaceId") ?? "ws_demo";
  const limit = Number(c.req.query("limit") ?? "100");
  return c.json({ items: await getAuditLog(workspaceId, limit) });
});

// ── Graph Execution & Operation Tracking ──────────────────────────────

app.post("/graphs/:id/execute", async (c) => {
  requirePermission(authContext(c), "run.trigger");
  const graphId = c.req.param("id");
  const body = (await c.req.json()) as { workspaceId?: string };
  if (!body.workspaceId) {
    return c.json({ error: "workspaceId is required" }, 400);
  }

  const workflow = getWorkflow(graphId);
  if (!workflow) {
    return c.json({ error: "workflow not found" }, 404);
  }

  try {
    const result = executeWorkflow(workflow.graph);
    await recordUsage(body.workspaceId, 500, 0.05);
    await logAudit({
      workspaceId: body.workspaceId,
      orgId: "org_demo",
      eventType: "graph.execute",
      actorId: authContext(c, body.workspaceId).userId,
      actorType: "user",
      targetType: "graph",
      targetId: graphId,
      payload: { nodeCount: workflow.graph.nodes.length },
    });
    return c.json(result);
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

app.get("/operations/:id", async (c) => {
  const operationId = c.req.param("id");

  const db = await getDb();
  if (db) {
    const { operationRecords } = await import("@sso/db");
    const row = await db.query.operationRecords.findFirst({ where: (table, ops) => ops.eq(table.id, operationId) });
    if (row) {
      return c.json({
        id: row.id,
        sessionId: row.sessionId,
        workspaceId: row.workspaceId,
        engineId: row.engineId,
        operation: row.operation,
        input: (row.input ?? {}) as Record<string, unknown>,
        output: (row.output ?? {}) as Record<string, unknown>,
        status: row.status,
        startedAt: row.startedAt.toISOString(),
        finishedAt: row.finishedAt?.toISOString(),
        durationMs: row.durationMs ?? undefined,
        error: row.error ?? undefined,
      });
    }
  }

  const { getOperation } = await import("@sso/connector-runtime");
  const operation = getOperation(operationId);
  if (!operation) return c.json({ error: "operation not found" }, 404);
  return c.json(operation);
});

app.get("/operations", async (c) => {
  const workspaceId = c.req.query("workspaceId") ?? "ws_demo";
  const sessionId = c.req.query("sessionId");
  const limit = Number(c.req.query("limit") ?? "50");
  const { listOperationsForSession } = await import("@sso/connector-runtime");

  if (!sessionId) {
    return c.json({ items: [] });
  }

  const db = await getDb();
  if (db) {
    const { operationRecords } = await import("@sso/db");
    const rows = await db.query.operationRecords.findMany({
      where: (table, ops) => ops.and(
        ops.eq(table.workspaceId, workspaceId),
        ops.eq(table.sessionId, sessionId),
      ),
      orderBy: (table, ops) => [ops.desc(table.createdAt)],
      limit,
    });

    return c.json({
      items: rows.map((row) => ({
        id: row.id,
        sessionId: row.sessionId,
        workspaceId: row.workspaceId,
        engineId: row.engineId,
        operation: row.operation,
        input: (row.input ?? {}) as Record<string, unknown>,
        output: (row.output ?? {}) as Record<string, unknown>,
        status: row.status,
        startedAt: row.startedAt.toISOString(),
        finishedAt: row.finishedAt?.toISOString(),
        durationMs: row.durationMs ?? undefined,
        error: row.error ?? undefined,
      })),
    });
  }

  const operations = listOperationsForSession(sessionId);
  return c.json({ items: operations.slice(-limit) });
});

serve({
  fetch: app.fetch,
  port: 3001
});
