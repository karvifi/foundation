import type { NextRequest } from "next/server";
import { fail, isRecord, ok, readJson } from "../../_lib/response";

export type ChatRole = "system" | "user" | "assistant" | "tool";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatResponse {
  reply: string;
  model: string;
  tokensUsed: { prompt: number; completion: number; total: number };
  cost: number;
  traceId: string;
  toolsUsed: string[];
}

const MODEL_PRICING: Record<string, { in: number; out: number }> = {
  "gpt-4o-mini": { in: 0.00015, out: 0.0006 },
  "claude-haiku-4-5": { in: 0.00025, out: 0.00125 },
  "claude-sonnet-4-6": { in: 0.003, out: 0.015 },
  "claude-opus-4-5": { in: 0.015, out: 0.075 },
  "local-llama-3.1-70b": { in: 0, out: 0 },
};

const DEFAULT_MODEL = "claude-sonnet-4-6";

function pickModel(requested: string | undefined, prompt: string): string {
  if (requested && MODEL_PRICING[requested]) return requested;
  const wordCount = prompt.split(/\s+/).filter(Boolean).length;
  if (wordCount > 600) return "claude-opus-4-5";
  if (wordCount < 40) return "claude-haiku-4-5";
  return DEFAULT_MODEL;
}

function craftReply(prompt: string, useMemory: boolean, toolsUsed: string[]): string {
  const lower = prompt.toLowerCase();
  if (lower.includes("revenue") || lower.includes("mrr")) {
    return "Current MRR is $487,210 (+8.2% MoM). ARR pacing to $5.84M with NRR at 118%. Top contributor: Enterprise tier (+$31k net new).";
  }
  if (lower.includes("workflow") || lower.includes("automation")) {
    return "You have 14 active workflows. Lead Enrichment Pipeline executed 1,204 times in the last 24h with a 99.1% success rate. Want me to draft a new automation?";
  }
  if (lower.includes("contact") || lower.includes("crm")) {
    return "Found 3,482 matching contacts. The top 10 by engagement score are loaded into your view. Shall I queue a re-engagement sequence?";
  }
  const memoryHint = useMemory ? " (recalled 4 prior threads from memory)" : "";
  const toolHint = toolsUsed.length ? ` Used tools: ${toolsUsed.join(", ")}.` : "";
  return `Acknowledged.${memoryHint}${toolHint} How would you like to proceed?`;
}

function estimateTokens(text: string): number {
  return Math.max(1, Math.ceil(text.length / 4));
}

export async function POST(req: NextRequest) {
  const body = await readJson(req);
  if (!isRecord(body)) return fail("Invalid JSON body", 400);

  const messages = Array.isArray(body.messages) ? body.messages : null;
  if (!messages || messages.length === 0) {
    return fail("Field 'messages' must be a non-empty array", 400);
  }

  const normalized: ChatMessage[] = [];
  for (const m of messages) {
    if (!isRecord(m) || typeof m.content !== "string" || typeof m.role !== "string") {
      return fail("Each message requires 'role' and 'content' strings", 400);
    }
    normalized.push({ role: m.role as ChatRole, content: m.content });
  }

  const lastUser =
    [...normalized].reverse().find((m) => m.role === "user")?.content ?? "";

  const requestedModel = typeof body.model === "string" ? body.model : undefined;
  const useMemory = body.useMemory === true;
  const requestedTools = Array.isArray(body.tools)
    ? body.tools.filter((t): t is string => typeof t === "string")
    : [];

  const model = pickModel(requestedModel, lastUser);
  const toolsUsed = requestedTools.slice(0, 3);
  const reply = craftReply(lastUser, useMemory, toolsUsed);

  const promptTokens = normalized.reduce((sum, m) => sum + estimateTokens(m.content), 0);
  const completionTokens = estimateTokens(reply);
  const pricing = MODEL_PRICING[model];
  const cost =
    (promptTokens / 1000) * pricing.in + (completionTokens / 1000) * pricing.out;

  const data: ChatResponse = {
    reply,
    model,
    tokensUsed: {
      prompt: promptTokens,
      completion: completionTokens,
      total: promptTokens + completionTokens,
    },
    cost: Number(cost.toFixed(6)),
    traceId: `trc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    toolsUsed,
  };

  return ok(data);
}
