import type { BuildResult, ConnectorName, EngineId, IntentPlan, IntentRequest, SynthesisSignal, WorkflowGraph } from "@sso/contracts";
import { runMeteredInference } from "@sso/ai-gateway";
import { buildArchetypePlan } from "@sso/archetypes";
import { buildAdoptedTemplateKeys, buildEnginePacksFromPatterns, getCoreTemplates, resolveConnectorTemplate, resolveEnginePack } from "@sso/node-registry";
import { selectReposForPrompt } from "@sso/repo-intelligence";
import { compileSurface } from "@sso/surface-compiler";

const connectors: ConnectorName[] = ["hubspot", "notion", "jira", "linear", "airtable", "slack", "gmail", "calendar", "drive"];

interface BuildFromIntentOptions {
  synthesis?: SynthesisSignal;
}

interface WorkspacePanelDefinition {
  panelId: string;
  engineId: EngineId;
  dock: "center" | "left" | "right" | "bottom" | "floating";
  ratio: number;
}

const workspacePatterns: Record<string, WorkspacePanelDefinition[]> = {
  sales_workspace: [
    { panelId: "p_crm", engineId: "crm", dock: "center", ratio: 0.6 },
    { panelId: "p_email", engineId: "email", dock: "right", ratio: 0.2 },
    { panelId: "p_calendar", engineId: "calendar", dock: "right", ratio: 0.2 },
  ],
  dev_workspace: [
    { panelId: "p_issues", engineId: "issues", dock: "left", ratio: 0.2 },
    { panelId: "p_ide", engineId: "code_ide", dock: "center", ratio: 0.6 },
    { panelId: "p_terminal", engineId: "terminal", dock: "bottom", ratio: 0.2 },
  ],
  content_workspace: [
    { panelId: "p_research", engineId: "research", dock: "left", ratio: 0.25 },
    { panelId: "p_document", engineId: "document", dock: "center", ratio: 0.55 },
    { panelId: "p_calendar", engineId: "calendar", dock: "floating", ratio: 0.2 },
  ],
  finance_workspace: [
    { panelId: "p_sheet", engineId: "sheet", dock: "center", ratio: 0.6 },
    { panelId: "p_dashboard", engineId: "dashboard", dock: "right", ratio: 0.2 },
    { panelId: "p_invoice", engineId: "invoice", dock: "right", ratio: 0.2 },
  ],
  cs_workspace: [
    { panelId: "p_support", engineId: "support", dock: "center", ratio: 0.5 },
    { panelId: "p_health", engineId: "health", dock: "right", ratio: 0.25 },
    { panelId: "p_chat", engineId: "chat", dock: "right", ratio: 0.25 },
  ],
  focus_mode: [{ panelId: "p_focus", engineId: "document", dock: "center", ratio: 1 }],
};

const engineTitles: Record<EngineId, string> = {
  crm: "CRM Engine",
  email: "Email Engine",
  calendar: "Calendar Engine",
  document: "Document Engine",
  dashboard: "Dashboard Engine",
  issues: "Issue Engine",
  code_ide: "Code IDE",
  terminal: "Terminal",
  research: "Research Engine",
  sheet: "Sheet Engine",
  invoice: "Invoice Engine",
  support: "Support Engine",
  health: "Health Engine",
  chat: "Chat Engine",
  video: "Video Engine",
};

const engineNodeTypes: Record<EngineId, string> = {
  crm: "engine.crm",
  email: "engine.email",
  calendar: "engine.calendar",
  document: "engine.document",
  dashboard: "engine.dashboard",
  issues: "engine.issues",
  code_ide: "engine.code_ide",
  terminal: "engine.terminal",
  research: "engine.research",
  sheet: "engine.sheet",
  invoice: "engine.invoice",
  support: "engine.support",
  health: "engine.health",
  chat: "engine.chat",
  video: "engine.video",
};

function inferConnectors(prompt: string): ConnectorName[] {
  const lower = prompt.toLowerCase();
  const found = connectors.filter((name) => lower.includes(name));
  return found.length > 0 ? found : ["notion", "slack"];
}

function inferAppName(prompt: string): string {
  const hit = prompt.match(/build me (?:a|an)?\s*([a-z0-9\- ]+)/i);
  if (hit?.[1]) return hit[1].trim().replace(/\s+/g, " ");
  return "Generated App";
}

function inferConnectorsFromRepoHints(prompt: string): ConnectorName[] {
  const hints = selectReposForPrompt(prompt, process.cwd(), 12);
  const inferred = new Set<ConnectorName>();
  for (const hint of hints) {
    const s = hint.slug.toLowerCase();
    if (s.includes("hubspot")) inferred.add("hubspot");
    if (s.includes("notion")) inferred.add("notion");
    if (s.includes("jira")) inferred.add("jira");
    if (s.includes("linear")) inferred.add("linear");
    if (s.includes("airtable")) inferred.add("airtable");
    if (s.includes("slack")) inferred.add("slack");
    if (s.includes("gmail")) inferred.add("gmail");
    if (s.includes("calendar")) inferred.add("calendar");
    if (s.includes("drive")) inferred.add("drive");
  }
  return Array.from(inferred);
}

function inferWorkspacePattern(prompt: string, explicitPatternId?: string): string {
  if (explicitPatternId && workspacePatterns[explicitPatternId]) return explicitPatternId;
  const lower = prompt.toLowerCase();
  if (lower.includes("focus mode") || lower.includes("fullscreen")) return "focus_mode";
  if (lower.includes("revenue") || lower.includes("sales") || lower.includes("crm")) return "sales_workspace";
  if (lower.includes("support") || lower.includes("customer success") || lower.includes("ticket")) return "cs_workspace";
  if (lower.includes("finance") || lower.includes("invoice") || lower.includes("sheet") || lower.includes("spreadsheet")) return "finance_workspace";
  if (lower.includes("content") || lower.includes("document") || lower.includes("wiki") || lower.includes("research")) return "content_workspace";
  if (lower.includes("dev") || lower.includes("code") || lower.includes("issue") || lower.includes("sprint")) return "dev_workspace";
  return "sales_workspace";
}

function inferUiMode(prompt: string, workspacePatternId: string): IntentPlan["uiMode"] {
  const lower = prompt.toLowerCase();
  if (workspacePatternId === "focus_mode") return "operator";
  if (lower.includes("canvas")) return "canvas";
  if (lower.includes("guided")) return "guided";
  if (lower.includes("operator")) return "operator";
  return "builder";
}

function panelPosition(dock: WorkspacePanelDefinition["dock"], index: number): { x: number; y: number } {
  if (dock === "left") return { x: 80, y: 120 + index * 120 };
  if (dock === "right") return { x: 560, y: 120 + index * 120 };
  if (dock === "bottom") return { x: 320, y: 520 + index * 80 };
  if (dock === "floating") return { x: 500, y: 180 + index * 100 };
  return { x: 320, y: 140 + index * 120 };
}

function connectorMatchesEngine(engineId: EngineId, connector: ConnectorName): boolean {
  if (engineId === "crm") return connector === "hubspot" || connector === "airtable";
  if (engineId === "email") return connector === "gmail" || connector === "slack";
  if (engineId === "calendar") return connector === "calendar" || connector === "gmail";
  if (engineId === "document") return connector === "notion" || connector === "drive";
  if (engineId === "dashboard") return connector === "airtable" || connector === "hubspot";
  if (engineId === "issues") return connector === "jira" || connector === "linear";
  if (engineId === "code_ide" || engineId === "terminal") return connector === "linear" || connector === "jira";
  if (engineId === "research") return connector === "drive" || connector === "notion";
  if (engineId === "sheet" || engineId === "invoice") return connector === "airtable" || connector === "drive";
  if (engineId === "support" || engineId === "health" || engineId === "chat") return connector === "slack" || connector === "gmail" || connector === "hubspot";
  return false;
}

function engineSummary(engineId: EngineId, synthesis?: SynthesisSignal): string {
  const repoFragment = synthesis?.selectedRepoSlugs.slice(0, 2).join(", ") || "first-party patterns";
  return `${engineTitles[engineId]} compiled from ${repoFragment}`;
}

export function buildPlan(request: IntentRequest, synthesis?: SynthesisSignal): IntentPlan {
  const ai = runMeteredInference(request);
  const archetype = buildArchetypePlan(ai.text);
  const workspacePatternId = inferWorkspacePattern(ai.text, synthesis?.workspacePatternId ?? request.workspacePatternId);
  if (archetype) {
    return {
      ...archetype,
      uiMode: inferUiMode(ai.text, workspacePatternId),
    };
  }

  const inferred = new Set<ConnectorName>(inferConnectors(ai.text));
  for (const fromRepo of inferConnectorsFromRepoHints(ai.text)) {
    inferred.add(fromRepo);
  }

  const entities = Array.from(inferred).map((connector) => ({
    connector,
    operation: "compose_backend_capability"
  }));

  return {
    appName: inferAppName(request.prompt),
    entities,
    uiMode: inferUiMode(ai.text, workspacePatternId),
  };
}

export function buildGraph(plan: IntentPlan, synthesis?: SynthesisSignal): WorkflowGraph {
  const nodes = [] as WorkflowGraph["nodes"];
  const edges = [] as WorkflowGraph["edges"];
  const workspacePatternId = inferWorkspacePattern(plan.appName, synthesis?.workspacePatternId);
  const panels = workspacePatterns[workspacePatternId] ?? workspacePatterns["sales_workspace"];

  const core = getCoreTemplates();
  nodes.push({ id: "n0", type: core[0].type, config: { ...core[0].defaultConfig, workspacePatternId }, position: { x: 120, y: 40 } });
  nodes.push({ id: "n1", type: core[1].type, config: { ...core[1].defaultConfig, uiMode: plan.uiMode }, position: { x: 320, y: 40 } });
  edges.push({ from: "n0", to: "n1", label: "intent" });

  let idx = 2;
  const engineNodeIds = new Map<EngineId, string>();

  panels.forEach((panel, index) => {
    const engineNodeId = `n${idx++}`;
    engineNodeIds.set(panel.engineId, engineNodeId);
    const enginePack = resolveEnginePack(panel.engineId, synthesis?.enginePacks ?? []);
    nodes.push({
      id: engineNodeId,
      type: engineNodeTypes[panel.engineId],
      config: {
        panelId: panel.panelId,
        engineId: panel.engineId,
        enginePackId: enginePack?.id ?? null,
        enginePackTitle: enginePack?.title ?? null,
        enginePackSummary: enginePack?.summary ?? null,
        enginePackRepos: enginePack?.sourceRepoSlugs ?? [],
        dock: panel.dock,
        ratio: panel.ratio,
        suggestedRepos: synthesis?.selectedRepoSlugs.slice(0, 4) ?? [],
        signatureHints: synthesis?.signatureHints.slice(0, 6) ?? [],
        templateFiles: synthesis?.templateFiles.slice(0, 4) ?? [],
      },
      position: panelPosition(panel.dock, index),
      surface: {
        kind: panel.dock === "center" ? "panel" : panel.dock === "floating" ? "modal" : panel.engineId === "code_ide" ? "editor" : "card",
        title: engineTitles[panel.engineId],
        width: panel.ratio >= 0.55 ? "full" : undefined,
        defaultOpen: true,
      },
      meta: {
        label: engineTitles[panel.engineId],
        description: enginePack?.summary ?? engineSummary(panel.engineId, synthesis),
        addedBy: "intent_service",
        addedAt: new Date().toISOString(),
      },
      policy: panel.engineId === "email" || panel.engineId === "invoice"
        ? { requireApproval: true, retryCount: 1, timeoutMs: 15000 }
        : { retryCount: 1, timeoutMs: 12000 },
    });
    edges.push({ from: "n1", to: engineNodeId, label: panel.dock });
  });

  for (const entity of plan.entities) {
    const template = resolveConnectorTemplate(entity.connector, synthesis?.repoPatterns ?? []);
    if (!template) continue;
    const id = `n${idx++}`;
    const anchor = panels.find((panel) => connectorMatchesEngine(panel.engineId, entity.connector));
    const sourceNodeId = anchor ? engineNodeIds.get(anchor.engineId) ?? "n1" : "n1";
    nodes.push({
      id,
      type: template.type,
      connector: entity.connector,
      config: {
        ...template.defaultConfig,
        operation: entity.operation,
        workspacePatternId,
        repoSignals: synthesis?.selectedRepoSlugs.slice(0, 3) ?? [],
        templateSource: template.source ?? "core",
        templateSourceRepo: template.sourceRepoSlug ?? null,
      },
      position: anchor
        ? { x: panelPosition(anchor.dock, 0).x, y: panelPosition(anchor.dock, 0).y + 140 + idx * 12 }
        : { x: 320, y: 240 + idx * 24 },
      meta: {
        label: `${entity.connector} capability`,
        description: template.sourceRepoSlug
          ? `Connector action for ${entity.operation} adopted from ${template.sourceRepoSlug}`
          : `Connector action for ${entity.operation}`,
        addedBy: "intent_service",
        addedAt: new Date().toISOString(),
      },
    });
    edges.push({ from: sourceNodeId, to: id, label: "bind" });
  }

  nodes.push({ id: `n${idx}`, type: core[2].type, config: { ...core[2].defaultConfig, workspacePatternId }, position: { x: 520, y: 40 } });
  edges.push({ from: "n1", to: `n${idx}`, label: "persist" });

  return {
    id: `wf_${Date.now()}`,
    name: plan.appName,
    nodes,
    edges,
    workspacePatternId,
    layout: {
      builderMode: {
        leftPanel: panels.find((panel) => panel.dock === "left")?.panelId ?? null,
        rightPanel: panels.find((panel) => panel.dock === "right")?.panelId ?? null,
      },
      operatorMode: {
        mainSurface: panels.find((panel) => panel.dock === "center")?.engineId ?? null,
        pinnedSurfaces: panels.filter((panel) => panel.dock !== "center").map((panel) => panel.engineId),
        hiddenSections: workspacePatternId === "focus_mode" ? ["secondary_panels"] : [],
      },
    },
    schemaVersion: "1.0.0",
  };
}

export function buildFromIntent(request: IntentRequest, options?: BuildFromIntentOptions): BuildResult {
  const synthesis = options?.synthesis ?? {
    workspacePatternId: inferWorkspacePattern(request.prompt, request.workspacePatternId),
    selectedRepoSlugs: [],
    selectedCapabilityIds: request.capabilityIds ?? [],
    signatureHints: [],
    templateFiles: [],
    repoPatterns: [],
    adoptedTemplateKeys: [],
    enginePacks: [],
  };
  if (!synthesis.adoptedTemplateKeys || synthesis.adoptedTemplateKeys.length === 0) {
    synthesis.adoptedTemplateKeys = buildAdoptedTemplateKeys(synthesis.repoPatterns ?? []);
  }
  if (!synthesis.enginePacks || synthesis.enginePacks.length === 0) {
    synthesis.enginePacks = buildEnginePacksFromPatterns(synthesis.repoPatterns ?? []);
  }
  const plan = buildPlan(request, synthesis);
  const graph = buildGraph(plan, synthesis);
  const surface = compileSurface(graph, synthesis, plan.uiMode);
  return { plan, graph, surface, synthesis };
}
