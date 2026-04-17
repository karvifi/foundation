import type { IntentPlan, SurfaceComponent, SurfaceDefinition, SynthesisSignal, WorkflowGraph } from "@sso/contracts";

function componentKindFromNode(node: WorkflowGraph["nodes"][number]): SurfaceComponent["kind"] {
  const engineId = typeof node.config["engineId"] === "string" ? node.config["engineId"] : "";
  if (engineId === "code_ide") return "code";
  if (engineId === "sheet") return "sheet";
  if (engineId === "document" || engineId === "research") return "document";
  if (engineId === "email") return "email";
  if (engineId === "calendar") return "timeline";
  if (engineId === "issues") return "kanban";
  if (engineId === "chat" || node.type.includes("message") || node.type.includes("slack")) return "chat";
  if (engineId === "crm" || node.type.includes("record") || node.type.includes("database")) return "table";
  if (node.type.includes("issue") || node.type.includes("deal")) return "kanban";
  return "dashboard";
}

function componentProps(node: WorkflowGraph["nodes"][number], synthesis?: SynthesisSignal): Record<string, unknown> {
  return {
    editable: true,
    source: node.connector ?? "core",
    nodeType: node.type,
    panelId: node.config["panelId"] ?? null,
    dock: node.config["dock"] ?? null,
    ratio: node.config["ratio"] ?? null,
    engineId: node.config["engineId"] ?? null,
    enginePackId: node.config["enginePackId"] ?? null,
    enginePackTitle: node.config["enginePackTitle"] ?? null,
    enginePackSummary: node.config["enginePackSummary"] ?? null,
    enginePackRepos: node.config["enginePackRepos"] ?? [],
    suggestedRepos: synthesis?.selectedRepoSlugs.slice(0, 4) ?? node.config["suggestedRepos"] ?? [],
    templateFiles: synthesis?.templateFiles.slice(0, 4) ?? node.config["templateFiles"] ?? [],
  };
}

export function compileSurface(
  graph: WorkflowGraph,
  synthesis?: SynthesisSignal,
  mode?: IntentPlan["uiMode"],
): SurfaceDefinition {
  const engineNodes = graph.nodes.filter((node) => typeof node.config["engineId"] === "string");
  const sourceNodes = engineNodes.length > 0 ? engineNodes : graph.nodes.filter((node) => node.connector);

  const components: SurfaceComponent[] = sourceNodes.map((node) => ({
    id: `c_${node.id}`,
    kind: componentKindFromNode(node),
    title: node.surface?.title ?? node.meta?.label ?? `${node.connector ?? "core"} ${node.type.split(".").at(-1) ?? "panel"}`,
    bindsToNodeId: node.id,
    props: componentProps(node, synthesis),
  }));

  if (components.length === 0) {
    components.push({
      id: "c_dashboard",
      kind: "dashboard",
      title: "Automation Surface",
      bindsToNodeId: graph.nodes[0]?.id ?? "n0",
      props: { editable: true },
    });
  }

  return {
    appId: `app_${graph.id}`,
    appName: graph.name,
    layout: engineNodes.length > 0 ? "multi-engine" : components.length > 1 ? "split-pane" : "single-pane",
    workspacePatternId: graph.workspacePatternId,
    mode,
    compiledFrom: synthesis?.selectedRepoSlugs ?? [],
    components,
  };
}
