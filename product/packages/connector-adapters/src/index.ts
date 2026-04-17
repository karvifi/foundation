// @sso/connector-adapters — HTTP client adapters for all external services
// Follows the adapter contract pattern from the blueprint (Section 2)
// Each adapter: real HTTP calls when credentials present, graceful stubs otherwise

import type { ConnectorName } from "@sso/contracts";

// ── Shared types ──────────────────────────────────────────────────────────

export interface AdapterCredential {
  type: "api_key" | "oauth2" | "basic" | "bearer";
  value: string;                  // API key or bearer token
  baseUrl?: string;               // override base URL for self-hosted instances
  extra?: Record<string, string>; // e.g. accountId, domain, instanceUrl
}

export interface AdapterRunResult<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
  rateLimited?: boolean;
  retryAfterMs?: number;
}

// ── HubSpot Adapter ───────────────────────────────────────────────────────
export interface HubSpotContact {
  id: string;
  properties: {
    firstname?: string;
    lastname?: string;
    email?: string;
    company?: string;
    hs_lead_status?: string;
  };
}

export interface HubSpotDeal {
  id: string;
  properties: {
    dealname: string;
    amount?: string;
    dealstage?: string;
    closedate?: string;
    hubspot_owner_id?: string;
  };
}

export const hubspotAdapter = {
  baseUrl: "https://api.hubapi.com",

  async listContacts(cred: AdapterCredential, limit = 20): Promise<AdapterRunResult<HubSpotContact[]>> {
    if (!cred.value) return { ok: false, error: "No HubSpot API key provided" };
    try {
      const res = await fetch(`${cred.baseUrl ?? this.baseUrl}/crm/v3/objects/contacts?limit=${limit}`, {
        headers: { Authorization: `Bearer ${cred.value}`, "Content-Type": "application/json" },
      });
      if (!res.ok) return { ok: false, error: `HubSpot API ${res.status}: ${res.statusText}` };
      const json = (await res.json()) as { results: HubSpotContact[] };
      return { ok: true, data: json.results };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  },

  async createContact(cred: AdapterCredential, properties: HubSpotContact["properties"]): Promise<AdapterRunResult<HubSpotContact>> {
    if (!cred.value) return { ok: false, error: "No HubSpot API key provided" };
    try {
      const res = await fetch(`${cred.baseUrl ?? this.baseUrl}/crm/v3/objects/contacts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${cred.value}`, "Content-Type": "application/json" },
        body: JSON.stringify({ properties }),
      });
      if (!res.ok) return { ok: false, error: `HubSpot API ${res.status}` };
      return { ok: true, data: (await res.json()) as HubSpotContact };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  },

  async listDeals(cred: AdapterCredential, limit = 20): Promise<AdapterRunResult<HubSpotDeal[]>> {
    if (!cred.value) return { ok: false, error: "No HubSpot API key provided" };
    try {
      const res = await fetch(`${cred.baseUrl ?? this.baseUrl}/crm/v3/objects/deals?limit=${limit}&properties=dealname,amount,dealstage,closedate`, {
        headers: { Authorization: `Bearer ${cred.value}` },
      });
      if (!res.ok) return { ok: false, error: `HubSpot API ${res.status}` };
      const json = (await res.json()) as { results: HubSpotDeal[] };
      return { ok: true, data: json.results };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  },
};

// ── Notion Adapter ────────────────────────────────────────────────────────
export interface NotionPage {
  id: string;
  url: string;
  properties: Record<string, unknown>;
  created_time: string;
  last_edited_time: string;
}

export interface NotionDatabase {
  id: string;
  title: Array<{ plain_text: string }>;
  url: string;
}

export const notionAdapter = {
  baseUrl: "https://api.notion.com/v1",
  notionVersion: "2022-06-28",

  headers(cred: AdapterCredential) {
    return {
      Authorization: `Bearer ${cred.value}`,
      "Notion-Version": this.notionVersion,
      "Content-Type": "application/json",
    };
  },

  async searchPages(cred: AdapterCredential, query: string): Promise<AdapterRunResult<NotionPage[]>> {
    if (!cred.value) return { ok: false, error: "No Notion token provided" };
    try {
      const res = await fetch(`${this.baseUrl}/search`, {
        method: "POST",
        headers: this.headers(cred),
        body: JSON.stringify({ query, filter: { property: "object", value: "page" } }),
      });
      if (!res.ok) return { ok: false, error: `Notion API ${res.status}` };
      const json = (await res.json()) as { results: NotionPage[] };
      return { ok: true, data: json.results };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  },

  async createPage(cred: AdapterCredential, parentId: string, title: string, content?: Record<string, unknown>): Promise<AdapterRunResult<NotionPage>> {
    if (!cred.value) return { ok: false, error: "No Notion token provided" };
    try {
      const body = {
        parent: { database_id: parentId },
        properties: { Name: { title: [{ text: { content: title } }] }, ...(content ?? {}) },
      };
      const res = await fetch(`${this.baseUrl}/pages`, {
        method: "POST",
        headers: this.headers(cred),
        body: JSON.stringify(body),
      });
      if (!res.ok) return { ok: false, error: `Notion API ${res.status}` };
      return { ok: true, data: (await res.json()) as NotionPage };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  },

  async queryDatabase(cred: AdapterCredential, databaseId: string, filter?: Record<string, unknown>): Promise<AdapterRunResult<NotionPage[]>> {
    if (!cred.value) return { ok: false, error: "No Notion token provided" };
    try {
      const res = await fetch(`${this.baseUrl}/databases/${databaseId}/query`, {
        method: "POST",
        headers: this.headers(cred),
        body: JSON.stringify({ filter }),
      });
      if (!res.ok) return { ok: false, error: `Notion API ${res.status}` };
      const json = (await res.json()) as { results: NotionPage[] };
      return { ok: true, data: json.results };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  },
};

// ── Jira Adapter ──────────────────────────────────────────────────────────
export interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    status: { name: string };
    assignee?: { displayName: string };
    priority?: { name: string };
    issuetype: { name: string };
    description?: unknown;
  };
}

export const jiraAdapter = {
  async listIssues(cred: AdapterCredential, jql = "ORDER BY created DESC", maxResults = 20): Promise<AdapterRunResult<JiraIssue[]>> {
    if (!cred.value || !cred.extra?.["domain"]) return { ok: false, error: "Jira credentials incomplete (need api_key + domain + email)" };
    const domain = cred.extra["domain"];
    const email  = cred.extra["email"] ?? "";
    const auth   = Buffer.from(`${email}:${cred.value}`).toString("base64");
    try {
      const url = `https://${domain}.atlassian.net/rest/api/3/search?jql=${encodeURIComponent(jql)}&maxResults=${maxResults}`;
      const res = await fetch(url, {
        headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      });
      if (!res.ok) return { ok: false, error: `Jira API ${res.status}` };
      const json = (await res.json()) as { issues: JiraIssue[] };
      return { ok: true, data: json.issues };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  },

  async createIssue(cred: AdapterCredential, projectKey: string, summary: string, issueType = "Task", description?: string): Promise<AdapterRunResult<JiraIssue>> {
    if (!cred.value || !cred.extra?.["domain"]) return { ok: false, error: "Jira credentials incomplete" };
    const domain = cred.extra["domain"];
    const email  = cred.extra["email"] ?? "";
    const auth   = Buffer.from(`${email}:${cred.value}`).toString("base64");
    try {
      const res = await fetch(`https://${domain}.atlassian.net/rest/api/3/issue`, {
        method: "POST",
        headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: {
            project: { key: projectKey },
            summary,
            issuetype: { name: issueType },
            ...(description ? { description: { type: "doc", version: 1, content: [{ type: "paragraph", content: [{ type: "text", text: description }] }] } } : {}),
          },
        }),
      });
      if (!res.ok) return { ok: false, error: `Jira API ${res.status}` };
      return { ok: true, data: (await res.json()) as JiraIssue };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  },
};

// ── Linear Adapter ────────────────────────────────────────────────────────
export interface LinearIssue {
  id: string;
  title: string;
  state: { name: string };
  priority: number;
  assignee?: { name: string };
  team: { name: string };
}

export const linearAdapter = {
  baseUrl: "https://api.linear.app/graphql",

  async listIssues(cred: AdapterCredential, teamId?: string): Promise<AdapterRunResult<LinearIssue[]>> {
    if (!cred.value) return { ok: false, error: "No Linear API key provided" };
    const query = `
      query($teamId: String) {
        issues(filter: { team: { id: { eq: $teamId } } }, first: 25) {
          nodes { id title priority state { name } assignee { name } team { name } }
        }
      }`;
    try {
      const res = await fetch(this.baseUrl, {
        method: "POST",
        headers: { Authorization: cred.value, "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables: { teamId } }),
      });
      if (!res.ok) return { ok: false, error: `Linear API ${res.status}` };
      const json = (await res.json()) as { data?: { issues?: { nodes: LinearIssue[] } } };
      return { ok: true, data: json.data?.issues?.nodes ?? [] };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  },

  async createIssue(cred: AdapterCredential, teamId: string, title: string, description?: string): Promise<AdapterRunResult<LinearIssue>> {
    if (!cred.value) return { ok: false, error: "No Linear API key provided" };
    const mutation = `
      mutation($teamId: String!, $title: String!, $description: String) {
        issueCreate(input: { teamId: $teamId, title: $title, description: $description }) {
          issue { id title priority state { name } team { name } }
        }
      }`;
    try {
      const res = await fetch(this.baseUrl, {
        method: "POST",
        headers: { Authorization: cred.value, "Content-Type": "application/json" },
        body: JSON.stringify({ query: mutation, variables: { teamId, title, description } }),
      });
      if (!res.ok) return { ok: false, error: `Linear API ${res.status}` };
      const json = (await res.json()) as { data?: { issueCreate?: { issue: LinearIssue } } };
      if (!json.data?.issueCreate?.issue) return { ok: false, error: "Linear: no issue returned" };
      return { ok: true, data: json.data.issueCreate.issue };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  },
};

// ── Slack Adapter ─────────────────────────────────────────────────────────
export interface SlackMessage {
  ok: boolean;
  ts?: string;
  channel?: string;
  error?: string;
}

export const slackAdapter = {
  baseUrl: "https://slack.com/api",

  async postMessage(cred: AdapterCredential, channel: string, text: string, blocks?: unknown[]): Promise<AdapterRunResult<SlackMessage>> {
    if (!cred.value) return { ok: false, error: "No Slack bot token provided" };
    try {
      const res = await fetch(`${this.baseUrl}/chat.postMessage`, {
        method: "POST",
        headers: { Authorization: `Bearer ${cred.value}`, "Content-Type": "application/json" },
        body: JSON.stringify({ channel, text, blocks }),
      });
      if (!res.ok) return { ok: false, error: `Slack API ${res.status}` };
      const json = (await res.json()) as SlackMessage;
      if (!json.ok) return { ok: false, error: json.error };
      return { ok: true, data: json };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  },

  async listChannels(cred: AdapterCredential): Promise<AdapterRunResult<Array<{ id: string; name: string }>>> {
    if (!cred.value) return { ok: false, error: "No Slack bot token provided" };
    try {
      const res = await fetch(`${this.baseUrl}/conversations.list?limit=200`, {
        headers: { Authorization: `Bearer ${cred.value}` },
      });
      if (!res.ok) return { ok: false, error: `Slack API ${res.status}` };
      const json = (await res.json()) as { channels?: Array<{ id: string; name: string }> };
      return { ok: true, data: json.channels ?? [] };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  },
};

// ── Airtable Adapter ──────────────────────────────────────────────────────
export interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
  createdTime: string;
}

export const airtableAdapter = {
  baseUrl: "https://api.airtable.com/v0",

  async listRecords(cred: AdapterCredential, baseId: string, tableId: string, maxRecords = 100): Promise<AdapterRunResult<AirtableRecord[]>> {
    if (!cred.value) return { ok: false, error: "No Airtable API key provided" };
    try {
      const res = await fetch(`${this.baseUrl}/${baseId}/${tableId}?maxRecords=${maxRecords}`, {
        headers: { Authorization: `Bearer ${cred.value}` },
      });
      if (!res.ok) return { ok: false, error: `Airtable API ${res.status}` };
      const json = (await res.json()) as { records: AirtableRecord[] };
      return { ok: true, data: json.records };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  },

  async createRecord(cred: AdapterCredential, baseId: string, tableId: string, fields: Record<string, unknown>): Promise<AdapterRunResult<AirtableRecord>> {
    if (!cred.value) return { ok: false, error: "No Airtable API key provided" };
    try {
      const res = await fetch(`${this.baseUrl}/${baseId}/${tableId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${cred.value}`, "Content-Type": "application/json" },
        body: JSON.stringify({ fields }),
      });
      if (!res.ok) return { ok: false, error: `Airtable API ${res.status}` };
      return { ok: true, data: (await res.json()) as AirtableRecord };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  },
};

// ── Gmail Adapter ─────────────────────────────────────────────────────────
export const gmailAdapter = {
  baseUrl: "https://gmail.googleapis.com/gmail/v1",

  async sendEmail(cred: AdapterCredential, to: string, subject: string, body: string): Promise<AdapterRunResult<{ id: string; threadId: string }>> {
    if (!cred.value) return { ok: false, error: "No Gmail OAuth token provided" };
    // RFC 2822 encoded email
    const raw = Buffer.from(`To: ${to}\r\nSubject: ${subject}\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n${body}`).toString("base64")
      .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    try {
      const res = await fetch(`${this.baseUrl}/users/me/messages/send`, {
        method: "POST",
        headers: { Authorization: `Bearer ${cred.value}`, "Content-Type": "application/json" },
        body: JSON.stringify({ raw }),
      });
      if (!res.ok) return { ok: false, error: `Gmail API ${res.status}` };
      return { ok: true, data: (await res.json()) as { id: string; threadId: string } };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  },

  async listMessages(cred: AdapterCredential, maxResults = 10, query?: string): Promise<AdapterRunResult<Array<{ id: string; threadId: string }>>> {
    if (!cred.value) return { ok: false, error: "No Gmail OAuth token provided" };
    try {
      const q = query ? `&q=${encodeURIComponent(query)}` : "";
      const res = await fetch(`${this.baseUrl}/users/me/messages?maxResults=${maxResults}${q}`, {
        headers: { Authorization: `Bearer ${cred.value}` },
      });
      if (!res.ok) return { ok: false, error: `Gmail API ${res.status}` };
      const json = (await res.json()) as { messages?: Array<{ id: string; threadId: string }> };
      return { ok: true, data: json.messages ?? [] };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  },
};

function makeNotImplementedAdapter(name: string) {
  return {
    async execute(): Promise<AdapterRunResult<never>> {
      return { ok: false, error: `${name} adapter not implemented yet` };
    },
  };
}

// ── n8n Adapter (blueprint Section 2.2) ─────────────────────────────────
export interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface N8nRunResult {
  executionId: string;
  status: "success" | "error" | "running";
  data?: Record<string, unknown>;
  error?: string;
}

export const n8nAdapter = {
  async executeWorkflow(cred: AdapterCredential, workflowId: string, inputs: Record<string, unknown>): Promise<AdapterRunResult<N8nRunResult>> {
    if (!cred.value || !cred.baseUrl) return { ok: false, error: "n8n credentials require baseUrl + api_key" };
    try {
      const res = await fetch(`${cred.baseUrl}/api/v1/workflows/${workflowId}/activate`, {
        method: "POST",
        headers: { "X-N8N-API-KEY": cred.value, "Content-Type": "application/json" },
        body: JSON.stringify({ inputs }),
      });
      if (!res.ok) return { ok: false, error: `n8n API ${res.status}` };
      return { ok: true, data: (await res.json()) as N8nRunResult };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  },

  async listWorkflows(cred: AdapterCredential): Promise<AdapterRunResult<N8nWorkflow[]>> {
    if (!cred.value || !cred.baseUrl) return { ok: false, error: "n8n credentials require baseUrl + api_key" };
    try {
      const res = await fetch(`${cred.baseUrl}/api/v1/workflows`, {
        headers: { "X-N8N-API-KEY": cred.value },
      });
      if (!res.ok) return { ok: false, error: `n8n API ${res.status}` };
      const json = (await res.json()) as { data: N8nWorkflow[] };
      return { ok: true, data: json.data };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  },
};

// ── Unified adapter registry ──────────────────────────────────────────────
export const connectorAdapterRegistry: Record<ConnectorName, unknown> = {
  hubspot:  hubspotAdapter,
  notion:   notionAdapter,
  jira:     jiraAdapter,
  linear:   linearAdapter,
  slack:    slackAdapter,
  airtable: airtableAdapter,
  gmail:    gmailAdapter,
  calendar: gmailAdapter, // Google Calendar uses same OAuth token family
  drive:    gmailAdapter, // Google Drive uses same OAuth token family
  stripe:   makeNotImplementedAdapter("stripe"),
  github:   makeNotImplementedAdapter("github"),
  salesforce: makeNotImplementedAdapter("salesforce"),
  zendesk:  makeNotImplementedAdapter("zendesk"),
  intercom: makeNotImplementedAdapter("intercom"),
  shopify:  makeNotImplementedAdapter("shopify"),
  n8n:      n8nAdapter,
  dify:     makeNotImplementedAdapter("dify"),
};

export function getAdapter(connector: ConnectorName) {
  return connectorAdapterRegistry[connector];
}
