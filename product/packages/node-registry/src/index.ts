import type { CloneRepoPattern, ConnectorName, EngineId, EnginePack } from "@sso/contracts";

export interface NodeTemplate {
  type: string;
  connector?: ConnectorName;
  operation: string;
  defaultConfig: Record<string, unknown>;
  source?: "core" | "clone";
  sourceRepoSlug?: string;
}

const templates: NodeTemplate[] = [
  { type: "trigger.intent", operation: "prompt_received", defaultConfig: {} },
  { type: "core.router", operation: "route", defaultConfig: {} },
  { type: "core.storage", operation: "persist", defaultConfig: {} },
  { type: "hubspot.contact", connector: "hubspot", operation: "upsert_contact", defaultConfig: {} },
  { type: "hubspot.deal", connector: "hubspot", operation: "upsert_deal", defaultConfig: {} },
  { type: "notion.page", connector: "notion", operation: "upsert_page", defaultConfig: {} },
  { type: "notion.database", connector: "notion", operation: "query_database", defaultConfig: {} },
  { type: "jira.issue", connector: "jira", operation: "upsert_issue", defaultConfig: {} },
  { type: "jira.board", connector: "jira", operation: "list_board", defaultConfig: {} },
  { type: "linear.issue", connector: "linear", operation: "upsert_issue", defaultConfig: {} },
  { type: "linear.project", connector: "linear", operation: "list_project", defaultConfig: {} },
  { type: "airtable.record", connector: "airtable", operation: "upsert_record", defaultConfig: {} },
  { type: "airtable.base", connector: "airtable", operation: "query_base", defaultConfig: {} },
  { type: "slack.message", connector: "slack", operation: "send_message", defaultConfig: {} },
  { type: "slack.channel", connector: "slack", operation: "list_channel", defaultConfig: {} },
  { type: "gmail.send", connector: "gmail", operation: "send_email", defaultConfig: {} },
  { type: "calendar.event", connector: "calendar", operation: "create_event", defaultConfig: {} },
  { type: "drive.file", connector: "drive", operation: "upsert_file", defaultConfig: {} }
];

export function getConnectorTemplates(connector: ConnectorName): NodeTemplate[] {
  return templates.filter((t) => t.connector === connector);
}

export function getCoreTemplates(): NodeTemplate[] {
  return templates.filter((t) => !t.connector);
}

function connectorKeywords(connector: ConnectorName): string[] {
  switch (connector) {
    case "hubspot":
    case "salesforce":
      return ["crm", "contact", "deal", "account", "lead"];
    case "notion":
      return ["document", "page", "database", "wiki", "knowledge"];
    case "jira":
    case "linear":
      return ["issue", "ticket", "sprint", "project", "board"];
    case "airtable":
      return ["record", "base", "table", "dataset"];
    case "slack":
      return ["message", "channel", "chat", "thread"];
    case "gmail":
      return ["email", "mail", "compose", "thread"];
    case "calendar":
      return ["calendar", "meeting", "schedule", "event"];
    case "drive":
      return ["file", "document", "drive", "folder"];
    case "github":
      return ["repository", "pull", "issue", "commit"];
    case "zendesk":
    case "intercom":
      return ["support", "ticket", "conversation", "customer"];
    case "shopify":
      return ["order", "product", "catalog", "commerce"];
    case "stripe":
      return ["payment", "invoice", "subscription", "billing"];
    case "n8n":
    case "dify":
      return ["workflow", "automation", "agent", "run"];
    default:
      return [connector];
  }
}

function inferOperationFromPattern(connector: ConnectorName, pattern: CloneRepoPattern): string {
  const haystack = [
    ...pattern.sampleSignatures.map((item) => `${item.symbol} ${item.signature}`),
    ...pattern.sampleTemplates.map((item) => `${item.summary} ${item.file}`),
    ...pattern.keywords,
    ...pattern.readmeHighlights,
  ].join(" ").toLowerCase();

  if (haystack.includes("send") || haystack.includes("message") || haystack.includes("compose")) return connector === "gmail" ? "send_email" : "send_message";
  if (haystack.includes("schedule") || haystack.includes("meeting") || haystack.includes("event")) return "create_event";
  if (haystack.includes("query") || haystack.includes("search") || haystack.includes("list")) return "query_records";
  if (haystack.includes("issue") || haystack.includes("ticket")) return "upsert_issue";
  if (haystack.includes("page") || haystack.includes("document")) return "upsert_page";
  if (haystack.includes("file") || haystack.includes("folder")) return "upsert_file";
  if (haystack.includes("deal") || haystack.includes("contact") || haystack.includes("lead")) return "upsert_contact";
  return `sync_${connector}_capability`;
}

function inferTypeFromPattern(connector: ConnectorName, operation: string): string {
  if (connector === "gmail" && operation === "send_email") return "gmail.send";
  if (connector === "calendar") return "calendar.event";
  if (connector === "slack") return operation.includes("channel") ? "slack.channel" : "slack.message";
  if (connector === "notion") return operation.includes("database") || operation.includes("query") ? "notion.database" : "notion.page";
  if (connector === "airtable") return operation.includes("query") ? "airtable.base" : "airtable.record";
  if (connector === "jira") return operation.includes("board") ? "jira.board" : "jira.issue";
  if (connector === "linear") return operation.includes("project") ? "linear.project" : "linear.issue";
  if (connector === "hubspot") return operation.includes("deal") ? "hubspot.deal" : "hubspot.contact";
  if (connector === "drive") return "drive.file";
  return `${connector}.${operation.replace(/[^a-z0-9]+/gi, "_").toLowerCase()}`;
}

function scorePatternForConnector(connector: ConnectorName, pattern: CloneRepoPattern): number {
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
  for (const keyword of connectorKeywords(connector)) {
    if (text.includes(keyword)) score += 3;
  }
  if (text.includes(connector)) score += 6;
  if (connector === "gmail" && text.includes("email")) score += 3;
  if (connector === "calendar" && text.includes("schedule")) score += 3;
  return score;
}

export function getConnectorTemplatesFromPatterns(
  connector: ConnectorName,
  repoPatterns: CloneRepoPattern[] = [],
): NodeTemplate[] {
  return repoPatterns
    .map((pattern) => ({ pattern, score: scorePatternForConnector(connector, pattern) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ pattern }) => {
      const operation = inferOperationFromPattern(connector, pattern);
      return {
        type: inferTypeFromPattern(connector, operation),
        connector,
        operation,
        defaultConfig: {
          sourceRepoSlug: pattern.slug,
          sourceFrameworks: pattern.frameworks,
          referenceEntrypoints: pattern.entrypoints,
          sampleSignatureSymbols: pattern.sampleSignatures.slice(0, 4).map((item) => item.symbol),
        },
        source: "clone",
        sourceRepoSlug: pattern.slug,
      } satisfies NodeTemplate;
    });
}

export function resolveConnectorTemplate(
  connector: ConnectorName,
  repoPatterns: CloneRepoPattern[] = [],
): NodeTemplate | undefined {
  return getConnectorTemplatesFromPatterns(connector, repoPatterns)[0] ?? getConnectorTemplates(connector)[0];
}

export function buildAdoptedTemplateKeys(repoPatterns: CloneRepoPattern[] = []): string[] {
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

function scorePatternForEngine(engineId: EngineId, pattern: CloneRepoPattern): number {
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
  if (text.includes(engineId.replace(/_/g, " "))) score += 5;
  return score;
}

function packTitle(engineId: EngineId): string {
  return `${engineId.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())} Pack`;
}

export function buildEnginePacksFromPatterns(repoPatterns: CloneRepoPattern[] = []): EnginePack[] {
  const engineIds: EngineId[] = [
    "crm",
    "email",
    "calendar",
    "document",
    "dashboard",
    "issues",
    "code_ide",
    "terminal",
    "research",
    "sheet",
    "invoice",
    "support",
    "health",
    "chat",
    "video",
  ];

  return engineIds
    .map((engineId) => {
      const ranked = repoPatterns
        .map((pattern) => ({ pattern, score: scorePatternForEngine(engineId, pattern) }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      if (ranked.length === 0) return null;

      const packsPatterns = ranked.map((item) => item.pattern);
      const sourceRepoSlugs = packsPatterns.map((pattern) => pattern.slug);
      const frameworks = Array.from(new Set(packsPatterns.flatMap((pattern) => pattern.frameworks))).slice(0, 6);
      const capabilities = Array.from(new Set(packsPatterns.flatMap((pattern) => pattern.keywords))).slice(0, 6);
      const adoptedTemplateKeys = buildAdoptedTemplateKeys(packsPatterns).slice(0, 8);

      return {
        id: `pack_${engineId}`,
        engineId,
        title: packTitle(engineId),
        summary: `${packTitle(engineId)} synthesized from ${sourceRepoSlugs.join(", ")}`,
        sourceRepoSlugs,
        frameworks,
        adoptedTemplateKeys,
        capabilities,
      } satisfies EnginePack;
    })
    .filter((item): item is EnginePack => item !== null);
}

export function resolveEnginePack(engineId: EngineId, enginePacks: EnginePack[] = []): EnginePack | undefined {
  return enginePacks.find((pack) => pack.engineId === engineId);
}
