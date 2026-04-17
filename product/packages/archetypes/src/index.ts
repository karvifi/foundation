import type { ConnectorName, IntentPlan } from "@sso/contracts";

interface AppArchetype {
  key: string;
  aliases: string[];
  appName: string;
  connectors: ConnectorName[];
}

const archetypes: AppArchetype[] = [
  {
    key: "revenue_os",
    aliases: ["hubspot", "crm", "salesforce", "sales pipeline", "revenue"],
    appName: "Revenue OS",
    connectors: ["hubspot", "gmail", "slack", "calendar"]
  },
  {
    key: "knowledge_os",
    aliases: ["notebooklm", "google notebook lm", "knowledge notebook", "notion", "knowledge base"],
    appName: "Knowledge OS",
    connectors: ["drive", "notion", "slack"]
  },
  {
    key: "studio_os",
    aliases: ["canva", "design studio", "creative studio", "adobe", "photoshop", "premiere"],
    appName: "Studio OS",
    connectors: ["drive", "notion", "slack"]
  },
  {
    key: "project",
    aliases: ["jira", "linear", "project manager", "issue tracker", "delivery", "sprint"],
    appName: "Project OS",
    connectors: ["jira", "linear", "slack", "notion"]
  },
  {
    key: "data_os",
    aliases: ["airtable", "database", "ops table", "internal tool", "backoffice"],
    appName: "Data OS",
    connectors: ["airtable", "slack", "notion"]
  },
  {
    key: "automation_os",
    aliases: ["n8n", "dify", "automation", "workflow engine", "agent flow"],
    appName: "Automation OS",
    connectors: ["n8n", "slack", "gmail"]
  }
];

export function resolveArchetype(prompt: string): AppArchetype | null {
  const lower = prompt.toLowerCase();
  return archetypes.find((a) => a.aliases.some((alias) => lower.includes(alias))) ?? null;
}

export function buildArchetypePlan(prompt: string): IntentPlan | null {
  const hit = resolveArchetype(prompt);
  if (!hit) return null;
  return {
    appName: hit.appName,
    entities: hit.connectors.map((connector) => ({
      connector,
      operation: `compose_${hit.key}_capability`
    })),
    uiMode: "builder"
  };
}
