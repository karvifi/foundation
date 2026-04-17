export type ConnectorName =
  | "hubspot"
  | "notion"
  | "jira"
  | "linear"
  | "airtable"
  | "slack"
  | "gmail"
  | "calendar"
  | "drive"
  | "stripe"
  | "github"
  | "salesforce"
  | "zendesk"
  | "intercom"
  | "shopify"
  | "n8n"
  | "dify";

// ── Canonical Node Taxonomy (blueprint Part 6) ────────────────────────────
export type PortType =
  | "any" | "string" | "number" | "boolean" | "object" | "array"
  | "document" | "sheet" | "table" | "form_schema" | "artifact"
  | "artifact_list" | "chat_session" | "code" | "dashboard"
  | "email_template" | "calendar_event" | "image" | "audio"
  | "video" | "workflow_log" | "crm_contacts" | "crm_deals"
  | "dataset" | "trigger_event" | "status";

export interface PortBinding {
  bindingType: "upstream" | "artifact" | "literal" | "secret" | "connector" | "unbound";
  value?: string | unknown;
  type: PortType;
}

export interface PortSchema {
  type: PortType;
  description?: string;
  nullable?: boolean;
}

export interface NodeSurfaceSpec {
  kind: "card" | "panel" | "editor" | "fullscreen" | "modal" | "inspector";
  title?: string;
  width?: number | "full";
  defaultOpen?: boolean;
}

export interface NodePolicy {
  timeoutMs?: number;
  retryCount?: number;
  continueOnError?: boolean;
  requireApproval?: boolean;
}

export interface NodeMeta {
  label?: string;
  description?: string;
  addedBy?: "user" | "intent_service" | "package_template";
  addedAt?: string;
}

// ── Canonical Graph Contract ──────────────────────────────────────────────
export interface CanonicalNode {
  id:       string;
  kind:     string;              // e.g. "ui.kanban", "data.table", "engine.document"
  tier:     1 | 2 | 3 | 4 | 5;
  position: { x: number; y: number };
  inputs:   Record<string, PortBinding>;
  outputs:  Record<string, PortSchema>;
  config:   Record<string, unknown>;
  surface?: NodeSurfaceSpec;
  policy?:  NodePolicy;
  meta?:    NodeMeta;
  // Legacy compat
  connector?: ConnectorName;
}

export interface CanonicalEdge {
  id:   string;
  from: string; // "nodeId.outputPort"
  to:   string; // "nodeId.inputPort"
}

export interface CanonicalPolicy {
  id:           string;
  type:         "approval_required" | "rate_limit" | "budget_cap" | "rbac" | "audit_required";
  targetNodeId: string;
  config:       Record<string, unknown>;
}

export interface CanonicalGraphLayout {
  builderMode: { leftPanel: string | null; rightPanel: string | null };
  operatorMode: { mainSurface: string | null; pinnedSurfaces: string[]; hiddenSections: string[] };
}

export interface IntentRequest {
  prompt: string;
  workspaceId: string;
  userId: string;
  workspacePatternId?: string;
  capabilityIds?: string[];
  absorbAllCloneCapabilities?: boolean;
}

export interface IntentEntity {
  connector: ConnectorName;
  operation: string;
}

export interface IntentPlan {
  appName: string;
  entities: IntentEntity[];
  uiMode: "guided" | "operator" | "builder" | "canvas";
}

export interface GraphNode {
  id: string;
  type: string;
  connector?: ConnectorName;
  config: Record<string, unknown>;
  // Canvas position for xyflow
  position?: { x: number; y: number };
  surface?: NodeSurfaceSpec;
  policy?: NodePolicy;
  meta?: NodeMeta;
}

export interface GraphEdge {
  from: string;
  to: string;
  label?: string;
}

export interface WorkflowGraph {
  id: string;
  name: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  policies?: CanonicalPolicy[];
  layout?: CanonicalGraphLayout;
  workspacePatternId?: string;
  schemaVersion?: "1.0.0";
}

export interface SurfaceComponent {
  id: string;
  kind: "table" | "form" | "kanban" | "timeline" | "chat" | "dashboard" | "document" | "sheet" | "code" | "email";
  title: string;
  bindsToNodeId: string;
  props: Record<string, unknown>;
}

export interface SurfaceDefinition {
  appId: string;
  appName: string;
  layout: "split-pane" | "single-pane" | "multi-engine";
  workspacePatternId?: string;
  mode?: IntentPlan["uiMode"];
  compiledFrom?: string[];
  components: SurfaceComponent[];
}

export interface SynthesisSignal {
  workspacePatternId: string;
  selectedRepoSlugs: string[];
  selectedCapabilityIds: string[];
  signatureHints: string[];
  templateFiles: string[];
  repoPatterns?: CloneRepoPattern[];
  adoptedTemplateKeys?: string[];
  enginePacks?: EnginePack[];
}

export interface BuildResult {
  plan: IntentPlan;
  graph: WorkflowGraph;
  surface: SurfaceDefinition;
  synthesis?: SynthesisSignal;
}

export interface AppReference {
  key: string;
  reference: string;
}

export interface AppCatalogItem {
  id: string;
  name: string;
  category: "crm" | "work" | "support" | "commerce" | "marketing" | "finance" | "automation" | "studio";
  summary: string;
  capabilities: string[];
  references: AppReference[];
  starterPrompt: string;
}

export interface SkillCatalogItem {
  id: string;
  name: string;
  description: string;
  category: "automation" | "ai" | "data" | "governance" | "integration" | "ui";
  level: "core" | "advanced";
}

export type EngineId =
  | "crm"
  | "email"
  | "calendar"
  | "document"
  | "dashboard"
  | "issues"
  | "code_ide"
  | "terminal"
  | "research"
  | "sheet"
  | "invoice"
  | "support"
  | "health"
  | "chat"
  | "video";

export interface SpatialPanel {
  panelId: string;
  engineId: EngineId;
  dock: "center" | "left" | "right" | "bottom" | "floating";
  ratio: number;
}

export interface WorkspacePattern {
  id: string;
  name: string;
  summary: string;
  panels: SpatialPanel[];
}

export interface ContextBusEvent {
  id: string;
  workspaceId: string;
  sessionId: string;
  sourceEngineId: EngineId;
  type: "record.selected" | "entity.updated" | "intent.submitted";
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface EngineReaction {
  engineId: EngineId;
  action: "filter" | "focus" | "hydrate" | "show";
  summary: string;
}

export interface LayoutMutation {
  panelId: string;
  action: "resize" | "show" | "focus";
  ratio?: number;
}

export interface ContextPropagationResult {
  event: ContextBusEvent;
  reactions: EngineReaction[];
  layoutMutations: LayoutMutation[];
  operations?: Array<{
    id: string;
    sessionId: string;
    workspaceId?: string;
    engineId: EngineId;
    operation: string;
    input: Record<string, unknown>;
    output: Record<string, unknown>;
    status: "pending" | "executing" | "success" | "failed";
    startedAt: string;
    finishedAt?: string;
    durationMs?: number;
    error?: string;
  }>;
}

export interface CloneCapability {
  id: string;
  name: string;
  summary: string;
  tags: string[];
  sourceRepos: string[];
  confidence: number;
  examplePrompt: string;
}

export interface CloneCodeSignature {
  id: string;
  slug: string;
  file: string;
  line: number;
  kind: "route" | "function" | "class" | "component" | "type" | "workflow";
  symbol: string;
  signature: string;
  tags: string[];
}

export interface CloneTemplateSnippet {
  id: string;
  slug: string;
  file: string;
  language: string;
  summary: string;
  snippet: string;
}

export interface CloneRepoPattern {
  slug: string;
  manifestName?: string;
  scripts: string[];
  dependencies: string[];
  keywords: string[];
  readmeHighlights: string[];
  frameworks: string[];
  entrypoints: string[];
  signatureCount: number;
  templateCount: number;
  sampleSignatures: CloneCodeSignature[];
  sampleTemplates: CloneTemplateSnippet[];
}

export interface EnginePack {
  id: string;
  engineId: EngineId;
  title: string;
  summary: string;
  sourceRepoSlugs: string[];
  frameworks: string[];
  adoptedTemplateKeys: string[];
  capabilities: string[];
}

export interface CloneIngestionBrief {
  generatedAt: string;
  extractedRepoCount: number;
  capabilityCount: number;
  topTags: string[];
  signatureCount: number;
  templateCount: number;
  synthesisDirectives: string[];
}
