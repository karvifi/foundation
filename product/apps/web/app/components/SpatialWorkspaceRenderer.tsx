"use client";

import type { ContextBusEvent, ContextPropagationResult, SurfaceComponent, SurfaceDefinition } from "@sso/contracts";

interface SpatialWorkspaceRendererProps {
  surface: SurfaceDefinition;
  propagation?: ContextPropagationResult | null;
  events?: ContextBusEvent[];
}

type Dock = "center" | "left" | "right" | "bottom" | "floating";

function asDock(value: unknown): Dock {
  return value === "left" || value === "right" || value === "bottom" || value === "floating" ? value : "center";
}

function asRatio(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0.25;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function engineTone(engineId: string | null): string {
  switch (engineId) {
    case "crm":
    case "code_ide":
    case "dashboard":
      return "toneInfo";
    case "email":
    case "calendar":
    case "sheet":
      return "toneSuccess";
    case "issues":
    case "research":
    case "health":
      return "toneWarning";
    case "chat":
    case "support":
    case "invoice":
      return "toneWarm";
    default:
      return "toneNeutral";
  }
}

function panelMutation(component: SurfaceComponent, propagation?: ContextPropagationResult | null) {
  const panelId = asString(component.props.panelId);
  if (!panelId || !propagation) return null;
  return propagation.layoutMutations.find((mutation) => mutation.panelId === panelId) ?? null;
}

function panelReaction(component: SurfaceComponent, propagation?: ContextPropagationResult | null) {
  const engineId = asString(component.props.engineId);
  if (!engineId || !propagation) return null;
  return propagation.reactions.find((reaction) => reaction.engineId === engineId) ?? null;
}

function panelStyle(component: SurfaceComponent, propagation?: ContextPropagationResult | null): React.CSSProperties {
  const mutation = panelMutation(component, propagation);
  const ratio = mutation?.ratio ?? asRatio(component.props.ratio);
  const dock = asDock(component.props.dock);

  if (dock === "center") {
    return { flex: `${Math.max(ratio, 0.45)} 1 0`, minHeight: 340 };
  }
  if (dock === "bottom") {
    return { flex: `${Math.max(ratio, 0.16)} 1 0`, minHeight: 120 };
  }
  if (dock === "floating") {
    return { width: `${Math.max(ratio * 100, 18)}%` };
  }
  return { flex: `${Math.max(ratio, 0.18)} 1 0` };
}

function groupByDock(components: SurfaceComponent[]) {
  return {
    left: components.filter((component) => asDock(component.props.dock) === "left"),
    center: components.filter((component) => asDock(component.props.dock) === "center"),
    right: components.filter((component) => asDock(component.props.dock) === "right"),
    bottom: components.filter((component) => asDock(component.props.dock) === "bottom"),
    floating: components.filter((component) => asDock(component.props.dock) === "floating"),
  };
}

export default function SpatialWorkspaceRenderer({ surface, propagation, events = [] }: SpatialWorkspaceRendererProps) {
  const grouped = groupByDock(surface.components);
  const latestEvent = events[0] ?? propagation?.event ?? null;

  return (
    <section className="workspaceStage card">
      <div className="workspaceHeaderRow">
        <div>
          <h4>{surface.appName}</h4>
          <div className="muted">
            {surface.layout} layout | {surface.mode ?? "builder"} mode | {surface.workspacePatternId ?? "custom pattern"}
          </div>
        </div>
        {latestEvent && (
          <div className="workspaceEventBadge">
            <strong>{latestEvent.type}</strong>
            <span>{String(latestEvent.payload.selectedLabel ?? latestEvent.payload.entityId ?? "context update")}</span>
          </div>
        )}
      </div>

      <div className="workspaceCanvas">
        {grouped.left.length > 0 && (
          <aside className="workspaceRail workspaceRailLeft">
            {grouped.left.map((component) => {
              const reaction = panelReaction(component, propagation);
              const focused = panelMutation(component, propagation)?.action === "focus";
              return (
                <article
                  key={component.id}
                  className={`workspacePanel ${engineTone(asString(component.props.engineId))} ${focused ? "workspacePanelFocused" : ""}`}
                  style={panelStyle(component, propagation)}
                >
                  <div className="workspacePanelMeta">{component.kind}</div>
                  <h5>{component.title}</h5>
                  {reaction && <div className="workspaceReaction">{reaction.summary}</div>}
                </article>
              );
            })}
          </aside>
        )}

        <div className="workspacePrimaryColumn">
          <div className="workspaceMainRow">
            {grouped.center.map((component) => {
              const focused = panelMutation(component, propagation)?.action === "focus";
              const engineId = asString(component.props.engineId);
              return (
                <article
                  key={component.id}
                  className={`workspacePanel workspacePanelPrimary ${engineTone(engineId)} ${focused ? "workspacePanelFocused" : ""}`}
                  style={panelStyle(component, propagation)}
                >
                  <div className="workspacePanelMeta">{engineId ?? component.kind}</div>
                  <h5>{component.title}</h5>
                  <div className="workspacePanelBody">
                    <div className="workspacePanelMetric">ratio {String(panelMutation(component, propagation)?.ratio ?? component.props.ratio ?? "n/a")}</div>
                    <div className="workspacePanelMetric">node {component.bindsToNodeId}</div>
                    {asString(component.props.enginePackTitle) && <div className="workspacePanelMetric">{asString(component.props.enginePackTitle)}</div>}
                  </div>
                  {asString(component.props.enginePackSummary) && <div className="workspaceReaction">{asString(component.props.enginePackSummary)}</div>}
                  {Array.isArray(component.props.suggestedRepos) && component.props.suggestedRepos.length > 0 && (
                    <div className="workspaceRepoStrip">
                      {(component.props.suggestedRepos as string[]).slice(0, 3).map((repo) => (
                        <span key={repo}>{repo}</span>
                      ))}
                    </div>
                  )}
                  {Array.isArray(component.props.enginePackRepos) && component.props.enginePackRepos.length > 0 && (
                    <div className="workspaceRepoStrip">
                      {(component.props.enginePackRepos as string[]).slice(0, 3).map((repo) => (
                        <span key={repo}>{repo}</span>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}

            {grouped.right.length > 0 && (
              <aside className="workspaceRail workspaceRailRight">
                {grouped.right.map((component) => {
                  const reaction = panelReaction(component, propagation);
                  const mutation = panelMutation(component, propagation);
                  return (
                    <article
                      key={component.id}
                      className={`workspacePanel ${engineTone(asString(component.props.engineId))} ${mutation?.action === "show" ? "workspacePanelVisible" : ""}`}
                      style={panelStyle(component, propagation)}
                    >
                      <div className="workspacePanelMeta">{component.kind}</div>
                      <h5>{component.title}</h5>
                      {reaction && <div className="workspaceReaction">{reaction.summary}</div>}
                    </article>
                  );
                })}
              </aside>
            )}
          </div>

          {grouped.bottom.length > 0 && (
            <div className="workspaceBottomDock">
              {grouped.bottom.map((component) => (
                <article
                  key={component.id}
                  className={`workspacePanel workspacePanelBottom ${engineTone(asString(component.props.engineId))}`}
                  style={panelStyle(component, propagation)}
                >
                  <div className="workspacePanelMeta">bottom dock</div>
                  <h5>{component.title}</h5>
                </article>
              ))}
            </div>
          )}
        </div>

        {grouped.floating.length > 0 && (
          <div className="workspaceFloatingLayer">
            {grouped.floating.map((component) => (
              <article
                key={component.id}
                className={`workspacePanel workspacePanelFloating ${engineTone(asString(component.props.engineId))}`}
                style={panelStyle(component, propagation)}
              >
                <div className="workspacePanelMeta">floating</div>
                <h5>{component.title}</h5>
              </article>
            ))}
          </div>
        )}
      </div>

      {propagation && (
        <div className="workspaceBusFooter">
          <div className="muted">Context bus reactions: {propagation.reactions.length}</div>
          <div className="workspaceReactionList">
            {propagation.reactions.map((reaction) => (
              <span key={`${reaction.engineId}-${reaction.action}`}>{reaction.engineId}: {reaction.action}</span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}