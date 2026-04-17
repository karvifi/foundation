"use client";

import { useEffect, useState } from "react";
import type {
  AppCatalogItem,
  BuildResult,
  CloneCapability,
  CloneCodeSignature,
  CloneIngestionBrief,
  CloneTemplateSnippet,
  ContextBusEvent,
  ContextPropagationResult,
  SkillCatalogItem,
  WorkspacePattern,
} from "@sso/contracts";
import GraphCanvas from "./components/GraphCanvas";
import SpatialWorkspaceRenderer from "./components/SpatialWorkspaceRenderer";

interface WorkflowRunResult {
  workflowId: string;
  startedAt: string;
  finishedAt: string;
  nodeResults: Array<{
    nodeId: string;
    connector: string;
    status: string;
    output: Record<string, unknown>;
  }>;
}

interface IntakeSummary {
  totalRepos: number;
  extractedRepos: number;
  cloneFailedRepos: number;
}

interface SelectedRepo {
  slug: string;
  status: string;
  filesInClone: number;
  tags: string[];
}

interface SynthesisPackResult {
  augmentedPrompt: string;
  selectedRepos: SelectedRepo[];
  selectedCapabilities: CloneCapability[];
  adoptedTemplateKeys?: string[];
  enginePacks?: Array<{
    id: string;
    engineId: string;
    title: string;
    summary: string;
    sourceRepoSlugs: string[];
    frameworks: string[];
  }>;
}

interface ConnectorPreflight {
  connector: string;
  ready: boolean;
  checks: {
    token: boolean;
    baseUrl: boolean;
  };
  message: string;
}

interface SystemReadiness {
  status: "ready" | "attention_required";
  checks: {
    health: boolean;
    workspacePatterns: boolean;
    cloneRepoIngestion: boolean;
    cloneCapabilityCatalog: boolean;
    connectorPreflight: {
      ready: boolean;
      readyCount: number;
      total: number;
    };
  };
}

const START_PROMPT =
  "Build me Revenue OS with lead scoring, project execution, and support automation";

export default function Page() {
  const [prompt, setPrompt] = useState(START_PROMPT);
  const [result, setResult] = useState<BuildResult | null>(null);
  const [saved, setSaved] = useState<BuildResult[]>([]);
  const [runResult, setRunResult] = useState<WorkflowRunResult | null>(null);
  const [intakeSummary, setIntakeSummary] = useState<IntakeSummary | null>(null);
  const [selectedRepos, setSelectedRepos] = useState<SelectedRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liveGraphJson, setLiveGraphJson] = useState<string>("");
  const [appsCatalog, setAppsCatalog] = useState<AppCatalogItem[]>([]);
  const [skillsCatalog, setSkillsCatalog] = useState<SkillCatalogItem[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [cloneCapabilities, setCloneCapabilities] = useState<CloneCapability[]>([]);
  const [selectedCapabilityIds, setSelectedCapabilityIds] = useState<string[]>([]);
  const [absorbAllCloneCapabilities, setAbsorbAllCloneCapabilities] = useState<boolean>(true);
  const [ingestionBrief, setIngestionBrief] = useState<CloneIngestionBrief | null>(null);
  const [deepRepoSlug, setDeepRepoSlug] = useState<string | null>(null);
  const [repoSignatures, setRepoSignatures] = useState<CloneCodeSignature[]>([]);
  const [repoTemplates, setRepoTemplates] = useState<CloneTemplateSnippet[]>([]);
  const [synthesisPack, setSynthesisPack] = useState<SynthesisPackResult | null>(null);
  const [workspacePatterns, setWorkspacePatterns] = useState<WorkspacePattern[]>([]);
  const [selectedPatternId, setSelectedPatternId] = useState<string>("sales_workspace");
  const [workspaceSessionId, setWorkspaceSessionId] = useState<string | null>(null);
  const [contextEvents, setContextEvents] = useState<ContextBusEvent[]>([]);
  const [propagation, setPropagation] = useState<ContextPropagationResult | null>(null);
  const [connectorPreflight, setConnectorPreflight] = useState<ConnectorPreflight[]>([]);
  const [systemReadiness, setSystemReadiness] = useState<SystemReadiness | null>(null);

  async function loadSaved() {
    const res = await fetch("http://localhost:3001/workflows");
    if (!res.ok) return;
    const data = (await res.json()) as { items: BuildResult[] };
    setSaved(data.items);
  }

  async function loadIntakeSummary() {
    const res = await fetch("http://localhost:3001/intake/summary");
    if (!res.ok) return;
    const data = (await res.json()) as IntakeSummary;
    setIntakeSummary(data);
  }

  async function loadSelectedRepos(intentPrompt: string) {
    const res = await fetch("http://localhost:3001/intake/select", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ prompt: intentPrompt, limit: 8 })
    });
    if (!res.ok) return;
    const data = (await res.json()) as { items: SelectedRepo[] };
    setSelectedRepos(data.items);
    if (data.items.length > 0) {
      const slug = data.items[0].slug;
      setDeepRepoSlug(slug);
      await Promise.all([
        loadRepoSignatures(slug),
        loadRepoTemplates(slug),
      ]);
    }
  }

  async function loadRepoSignatures(slug: string) {
    const res = await fetch(`http://localhost:3001/intake/repo-signatures?slug=${encodeURIComponent(slug)}&limit=40`);
    if (!res.ok) return;
    const data = (await res.json()) as { items: CloneCodeSignature[] };
    setRepoSignatures(data.items);
  }

  async function loadRepoTemplates(slug: string) {
    const res = await fetch(`http://localhost:3001/intake/repo-templates?slug=${encodeURIComponent(slug)}&limit=10`);
    if (!res.ok) return;
    const data = (await res.json()) as { items: CloneTemplateSnippet[] };
    setRepoTemplates(data.items);
  }

  async function loadSynthesisPack() {
    const res = await fetch("http://localhost:3001/intake/synthesis-pack", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        prompt,
        capabilityIds: selectedCapabilityIds,
        absorbAllCloneCapabilities,
        repoLimit: 6,
      }),
    });
    if (!res.ok) return;
    const data = (await res.json()) as SynthesisPackResult;
    setSynthesisPack(data);
  }

  async function loadCatalogs() {
    const [appsRes, skillsRes] = await Promise.all([
      fetch("http://localhost:3001/catalog/apps"),
      fetch("http://localhost:3001/catalog/skills")
    ]);
    if (appsRes.ok) {
      const appsData = (await appsRes.json()) as { items: AppCatalogItem[] };
      setAppsCatalog(appsData.items);
    }
    if (skillsRes.ok) {
      const skillsData = (await skillsRes.json()) as { items: SkillCatalogItem[] };
      setSkillsCatalog(skillsData.items);
    }
  }

  async function loadWorkspacePatterns() {
    const res = await fetch("http://localhost:3001/workspace/patterns");
    if (!res.ok) return;
    const data = (await res.json()) as { items: WorkspacePattern[] };
    setWorkspacePatterns(data.items);
    if (data.items.length > 0) {
      setSelectedPatternId(data.items[0].id);
    }
  }

  async function loadConnectorPreflight() {
    const res = await fetch("http://localhost:3001/connectors/preflight");
    if (!res.ok) return;
    const data = (await res.json()) as { items: ConnectorPreflight[] };
    setConnectorPreflight(data.items);
  }

  async function loadSystemReadiness() {
    const res = await fetch("http://localhost:3001/system/readiness");
    if (!res.ok) return;
    const data = (await res.json()) as SystemReadiness;
    setSystemReadiness(data);
  }

  async function loadCloneCapabilities() {
    const res = await fetch("http://localhost:3001/intake/capabilities?limit=20");
    if (!res.ok) return;
    const data = (await res.json()) as { items: CloneCapability[] };
    setCloneCapabilities(data.items);
  }

  async function loadIngestionBrief() {
    const res = await fetch("http://localhost:3001/intake/ingestion-brief");
    if (!res.ok) return;
    const data = (await res.json()) as CloneIngestionBrief;
    setIngestionBrief(data);
  }

  async function startWorkspaceSession() {
    setError(null);
    const res = await fetch("http://localhost:3001/workspace/sessions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ workspaceId: "ws_demo", patternId: selectedPatternId })
    });
    if (!res.ok) {
      setError(`Workspace session start failed: HTTP ${res.status}`);
      return;
    }
    const data = (await res.json()) as { id: string };
    setWorkspaceSessionId(data.id);
    setContextEvents([]);
    setPropagation(null);
  }

  async function loadContextEvents(sessionId: string) {
    const res = await fetch(`http://localhost:3001/workspace/sessions/${sessionId}/events`);
    if (!res.ok) return;
    const data = (await res.json()) as { items: ContextBusEvent[] };
    setContextEvents(data.items);
  }

  async function simulateRecordSelection() {
    if (!workspaceSessionId) {
      setError("Start a workspace session first.");
      return;
    }
    const res = await fetch(`http://localhost:3001/workspace/sessions/${workspaceSessionId}/select`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        sourceEngineId: "crm",
        entityType: "company",
        entityId: "co_acme",
        selectedLabel: "Acme Corp"
      })
    });
    if (!res.ok) {
      setError(`Context event failed: HTTP ${res.status}`);
      return;
    }
    const data = (await res.json()) as ContextPropagationResult;
    setPropagation(data);
    await loadContextEvents(workspaceSessionId);
  }

  async function runWorkflow(workflowId: string) {
    const res = await fetch(`http://localhost:3001/workflows/${workflowId}/run`, { method: "POST" });
    if (!res.ok) {
      setError(`Run failed: HTTP ${res.status}`);
      return;
    }
    const data = (await res.json()) as WorkflowRunResult;
    setRunResult(data);
  }

  useEffect(() => {
    void loadSaved();
    void loadIntakeSummary();
    void loadCatalogs();
    void loadWorkspacePatterns();
    void loadCloneCapabilities();
    void loadIngestionBrief();
    void loadConnectorPreflight();
    void loadSystemReadiness();
  }, []);

  useEffect(() => {
    void loadSynthesisPack();
  }, [prompt, absorbAllCloneCapabilities, selectedCapabilityIds]);

  useEffect(() => {
    void loadSystemReadiness();
  }, [connectorPreflight, synthesisPack, workspacePatterns]);

  useEffect(() => {
    if (!result?.surface) return;
    void startWorkspaceSession();
  }, [result?.surface]);

  async function build() {
    setLoading(true);
    setError(null);
    try {
      const buildPrompt = selectedSkills.length > 0 ? `${prompt}. Skills: ${selectedSkills.join(", ")}.` : prompt;

      const res = await fetch("http://localhost:3001/intent/build", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          prompt: buildPrompt,
          workspaceId: "ws_demo",
          userId: "usr_demo",
          workspacePatternId: selectedPatternId,
          capabilityIds: absorbAllCloneCapabilities ? [] : selectedCapabilityIds,
          absorbAllCloneCapabilities
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as BuildResult;
      setResult(data);
      setLiveGraphJson(JSON.stringify(data.graph, null, 2));
      await loadSaved();
      await loadSelectedRepos(prompt);
    } catch (e) {
      setError(e instanceof Error ? e.message : "build failed");
    } finally {
      setLoading(false);
    }
  }

  function toggleSkill(skill: string) {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((item) => item !== skill) : [...prev, skill]
    );
  }

  function toggleCapability(capabilityId: string) {
    setSelectedCapabilityIds((prev) =>
      prev.includes(capabilityId)
        ? prev.filter((id) => id !== capabilityId)
        : [...prev, capabilityId]
    );
  }

  return (
    <main>
      <section className="shell">
        <header className="header">
          <div className="title">Software Synthesis OS</div>
          <div className="muted">guided to builder to canvas</div>
        </header>

        <div className="grid">
          <div className="left">
            <div className="label">Intent</div>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} />
            <button onClick={build} disabled={loading}>{loading ? "Building..." : "Generate App"}</button>

            <div className="card">
              <h4>First-Party App Catalog</h4>
              <div className="muted">Provider names are compatibility references only. Generated apps are fully first-party.</div>
              {appsCatalog.length === 0 && <div className="muted">Loading app catalog...</div>}
              <div className="chipRow">
                {appsCatalog.map((item) => (
                  <button key={item.id} className="chip" onClick={() => setPrompt(item.starterPrompt)}>
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="card">
              <h4>Skills</h4>
              <div className="muted">Choose skills to include in this build request.</div>
              {skillsCatalog.length === 0 && <div className="muted">Loading skills...</div>}
              <div className="chipRow">
                {skillsCatalog.map((skill) => {
                  const active = selectedSkills.includes(skill.name);
                  return (
                    <button
                      key={skill.id}
                      className={`chip ${active ? "chipActive" : ""}`}
                      onClick={() => toggleSkill(skill.name)}
                    >
                      {skill.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="card">
              <h4>Clone Repo Capability Library</h4>
              <div className="muted">Absorb patterns mined from cloned repos and inject them into synthesis.</div>
              <label className="muted" style={{ display: "block", marginBottom: 8 }}>
                <input
                  type="checkbox"
                  checked={absorbAllCloneCapabilities}
                  onChange={(e) => setAbsorbAllCloneCapabilities(e.target.checked)}
                  style={{ marginRight: 8 }}
                />
                Absorb all cloned repo capabilities automatically
              </label>
              {cloneCapabilities.length === 0 && <div className="muted">Mining capabilities from cloned repos...</div>}
              <div className="chipRow">
                {cloneCapabilities.map((capability) => {
                  const active = selectedCapabilityIds.includes(capability.id);
                  return (
                    <button
                      key={capability.id}
                      className={`chip ${active ? "chipActive" : ""}`}
                      disabled={absorbAllCloneCapabilities}
                      onClick={() => toggleCapability(capability.id)}
                    >
                      {capability.name}
                    </button>
                  );
                })}
              </div>
              {ingestionBrief && (
                <>
                  <div className="muted" style={{ marginTop: 10 }}>
                    Extracted repos: {ingestionBrief.extractedRepoCount} | Capabilities: {ingestionBrief.capabilityCount}
                  </div>
                  <div className="muted">Top tags: {ingestionBrief.topTags.join(", ")}</div>
                </>
              )}
            </div>

            <div className="card">
              <h4>Spatial Workspace Patterns</h4>
              <div className="muted">Choose a workspace composition, start a context session, then emit record.selected events.</div>
              {workspacePatterns.length === 0 && <div className="muted">Loading workspace patterns...</div>}
              <div className="chipRow">
                {workspacePatterns.map((pattern) => (
                  <button
                    key={pattern.id}
                    className={`chip ${selectedPatternId === pattern.id ? "chipActive" : ""}`}
                    onClick={() => setSelectedPatternId(pattern.id)}
                  >
                    {pattern.name}
                  </button>
                ))}
              </div>
              <div className="chipRow" style={{ marginTop: 12 }}>
                <button className="chip" onClick={startWorkspaceSession}>Start Session</button>
                <button className="chip" onClick={simulateRecordSelection} disabled={!workspaceSessionId}>Emit record.selected</button>
              </div>
              {workspaceSessionId && <div className="muted">Session: {workspaceSessionId}</div>}
              {propagation && (
                <>
                  <div className="muted">Context fan-out reactions: {propagation.reactions.length}</div>
                  <pre>{JSON.stringify(propagation, null, 2)}</pre>
                </>
              )}
              {contextEvents.length > 0 && (
                <>
                  <div className="muted">Recent Context Bus Events</div>
                  <pre>{JSON.stringify(contextEvents.slice(0, 6), null, 2)}</pre>
                </>
              )}
            </div>

            {error && (
              <div className="card">
                <h4>Error</h4>
                <div className="muted">{error}</div>
              </div>
            )}

            {result && (
              <div className="card">
                <h4>Workflow Graph</h4>
                <div className="muted">Saved workflow id: {result.graph.id}</div>
                <div className="muted">Nodes: {result.graph.nodes.length} | Edges: {result.graph.edges.length}</div>
                <pre>{JSON.stringify(result.graph.nodes.slice(0, 6), null, 2)}</pre>
              </div>
            )}

            {result && (
              <div className="card">
                <h4>Canvas Graph Editor (xyflow)</h4>
                <div className="muted">Drag nodes, connect edges, and live-sync to the compiled surface graph.</div>
                <GraphCanvas
                  graph={result.graph}
                  onGraphChange={(nextGraph) => {
                    setResult((prev) => (prev ? { ...prev, graph: nextGraph } : prev));
                    setLiveGraphJson(JSON.stringify(nextGraph, null, 2));
                  }}
                />
              </div>
            )}

            {liveGraphJson && (
              <div className="card">
                <h4>Live Graph JSON</h4>
                <pre>{liveGraphJson}</pre>
              </div>
            )}
          </div>

          <div className="right">
            <div className="label">Compiled Surface</div>
            {!result && <div className="muted">Run a prompt to synthesize the app surface.</div>}
            {result && (
              <div className="card">
                <h4>{result.surface.appName}</h4>
                <div className="muted">layout: {result.surface.layout} | mode: {result.surface.mode ?? result.plan.uiMode}</div>
                <div className="muted">workspace pattern: {result.surface.workspacePatternId ?? result.synthesis?.workspacePatternId ?? "n/a"}</div>
                {result.surface.compiledFrom && result.surface.compiledFrom.length > 0 && (
                  <div className="muted">compiled from: {result.surface.compiledFrom.join(", ")}</div>
                )}
              </div>
            )}
            {result && (
              <>
                <SpatialWorkspaceRenderer
                  surface={result.surface}
                  propagation={propagation}
                  events={contextEvents}
                />
                <div className="card">
                  <h4>Live Context Bus</h4>
                  <div className="muted">Workspace session: {workspaceSessionId ?? "none"}</div>
                  <button onClick={simulateRecordSelection} disabled={!workspaceSessionId}>
                    Simulate CRM Selection (context event)
                  </button>
                  {propagation && (
                    <div style={{ marginTop: 10 }}>
                      <div className="muted">Propagation reactions: {propagation.reactions.length}</div>
                      <div className="muted">Executed operations: {propagation.operations?.length ?? 0}</div>
                      {propagation.reactions.map((reaction) => (
                        <div key={`${reaction.engineId}-${reaction.action}`} className="muted">
                          {reaction.engineId}: {reaction.action} · {reaction.summary}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="card">
              <h4>Saved Workflows</h4>
              {saved.length === 0 && <div className="muted">No workflows saved yet.</div>}
              {saved.slice(0, 8).map((item) => (
                <div key={item.graph.id} style={{ marginBottom: 10 }}>
                  <div className="muted">{item.plan.appName}</div>
                  <button onClick={() => runWorkflow(item.graph.id)}>Run {item.graph.id}</button>
                </div>
              ))}
            </div>

            {runResult && (
              <div className="card">
                <h4>Last Execution</h4>
                <div className="muted">Workflow: {runResult.workflowId}</div>
                <div className="muted">Nodes executed: {runResult.nodeResults.length}</div>
              </div>
            )}

            <div className="card">
              <h4>Repo Intake</h4>
              {!intakeSummary && <div className="muted">Loading intake summary...</div>}
              {intakeSummary && (
                <>
                  <div className="muted">Total repos: {intakeSummary.totalRepos}</div>
                  <div className="muted">Extracted: {intakeSummary.extractedRepos}</div>
                  <div className="muted">Clone failed: {intakeSummary.cloneFailedRepos}</div>
                </>
              )}
            </div>

            <div className="card">
              <h4>System Readiness</h4>
              {!systemReadiness && <div className="muted">Evaluating readiness...</div>}
              {systemReadiness && (
                <>
                  <div className="muted">
                    Status: {systemReadiness.status === "ready" ? "ready" : "attention required"}
                  </div>
                  <div className="muted">health: {systemReadiness.checks.health ? "ok" : "fail"}</div>
                  <div className="muted">workspace patterns: {systemReadiness.checks.workspacePatterns ? "ok" : "fail"}</div>
                  <div className="muted">clone repo ingestion: {systemReadiness.checks.cloneRepoIngestion ? "ok" : "fail"}</div>
                  <div className="muted">capability catalog: {systemReadiness.checks.cloneCapabilityCatalog ? "ok" : "fail"}</div>
                  <div className="muted">
                    connectors ready: {systemReadiness.checks.connectorPreflight.readyCount}/{systemReadiness.checks.connectorPreflight.total}
                  </div>
                </>
              )}
            </div>

            <div className="card">
              <h4>Connector Preflight</h4>
              <div className="muted">Checks required credentials before running third-party connector actions.</div>
              {connectorPreflight.length === 0 && <div className="muted">Loading connector checks...</div>}
              {connectorPreflight.map((item) => (
                <div key={item.connector} style={{ marginBottom: 8 }}>
                  <div className="muted">{item.connector}: {item.ready ? "ready" : "not ready"}</div>
                  <div className="muted">token: {item.checks.token ? "yes" : "no"} | base URL: {item.checks.baseUrl ? "yes" : "no"}</div>
                  {!item.ready && <div className="muted">{item.message}</div>}
                </div>
              ))}
            </div>

            <div className="card">
              <h4>Selected Repos For Intent</h4>
              {selectedRepos.length === 0 && <div className="muted">Build an app to see repo routing.</div>}
              {selectedRepos.map((repo) => (
                <div key={repo.slug} style={{ marginBottom: 8 }}>
                  <div className="muted">{repo.slug} ({repo.status})</div>
                  <div className="muted">files: {repo.filesInClone} | tags: {repo.tags.join(", ")}</div>
                  <button
                    className={`chip ${deepRepoSlug === repo.slug ? "chipActive" : ""}`}
                    onClick={() => {
                      setDeepRepoSlug(repo.slug);
                      void loadRepoSignatures(repo.slug);
                      void loadRepoTemplates(repo.slug);
                    }}
                  >
                    Inspect Patterns
                  </button>
                </div>
              ))}
            </div>

            <div className="card">
              <h4>Clone Synthesis Pack</h4>
              {!synthesisPack && <div className="muted">Building synthesis pack...</div>}
              {synthesisPack && (
                <>
                  <div className="muted">Repos blended: {synthesisPack.selectedRepos.length}</div>
                  <div className="muted">Capabilities blended: {synthesisPack.selectedCapabilities.length}</div>
                  <div className="muted">Adopted templates: {synthesisPack.adoptedTemplateKeys?.length ?? 0}</div>
                  <div className="muted">Engine packs: {synthesisPack.enginePacks?.length ?? 0}</div>
                  {synthesisPack.adoptedTemplateKeys && synthesisPack.adoptedTemplateKeys.length > 0 && (
                    <div className="chipRow">
                      {synthesisPack.adoptedTemplateKeys.slice(0, 8).map((key) => (
                        <span key={key} className="chip">{key}</span>
                      ))}
                    </div>
                  )}
                  {synthesisPack.enginePacks && synthesisPack.enginePacks.length > 0 && (
                    <div className="chipRow">
                      {synthesisPack.enginePacks.slice(0, 6).map((pack) => (
                        <span key={pack.id} className="chip">{pack.title}</span>
                      ))}
                    </div>
                  )}
                  <pre>{synthesisPack.augmentedPrompt}</pre>
                </>
              )}
            </div>

            {result?.synthesis?.adoptedTemplateKeys && result.synthesis.adoptedTemplateKeys.length > 0 && (
              <div className="card">
                <h4>Adopted Clone Templates</h4>
                <div className="muted">These mined patterns were normalized into the generated graph.</div>
                <div className="chipRow">
                  {result.synthesis.adoptedTemplateKeys.slice(0, 12).map((key) => (
                    <span key={key} className="chip">{key}</span>
                  ))}
                </div>
              </div>
            )}

            {result?.synthesis?.enginePacks && result.synthesis.enginePacks.length > 0 && (
              <div className="card">
                <h4>Adopted Engine Packs</h4>
                <div className="muted">Clone repos are normalized into first-party engine packs during synthesis.</div>
                {result.synthesis.enginePacks.slice(0, 8).map((pack) => (
                  <div key={pack.id} style={{ marginBottom: 10 }}>
                    <div className="muted">{pack.title} · repos: {pack.sourceRepoSlugs.join(", ")}</div>
                    <div className="muted">frameworks: {pack.frameworks.join(", ") || "n/a"}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="card">
              <h4>Code Signatures{deepRepoSlug ? ` (${deepRepoSlug})` : ""}</h4>
              {repoSignatures.length === 0 && <div className="muted">Select a repo to inspect extracted signatures.</div>}
              {repoSignatures.slice(0, 14).map((signature) => (
                <div key={signature.id} style={{ marginBottom: 8 }}>
                  <div className="muted">{signature.kind} · {signature.symbol} · {signature.file}:{signature.line}</div>
                  <div className="muted">{signature.tags.join(", ")}</div>
                </div>
              ))}
            </div>

            <div className="card">
              <h4>Template Snippets{deepRepoSlug ? ` (${deepRepoSlug})` : ""}</h4>
              {repoTemplates.length === 0 && <div className="muted">Select a repo to inspect extracted templates.</div>}
              {repoTemplates.slice(0, 6).map((template) => (
                <div key={template.id} style={{ marginBottom: 10 }}>
                  <div className="muted">{template.summary} · {template.file}</div>
                  <pre>{template.snippet}</pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
