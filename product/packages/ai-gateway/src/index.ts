import type { IntentRequest } from "@sso/contracts";

export interface MeteringUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

export interface GatewayResult {
  text: string;
  model: "claude-sonnet" | "gpt-4o" | "gpt-4o-mini";
  usage: MeteringUsage;
}

const WORKSPACE_LIMIT = 1_000_000;
const usageLedger = new Map<string, number>();

export function runMeteredInference(request: IntentRequest): GatewayResult {
  const inputTokens = Math.max(30, Math.ceil(request.prompt.length / 4));
  const outputTokens = Math.max(120, Math.ceil(request.prompt.length / 2));
  const totalTokens = inputTokens + outputTokens;

  const used = usageLedger.get(request.workspaceId) ?? 0;
  const next = used + totalTokens;
  if (next > WORKSPACE_LIMIT) {
    throw new Error("workspace token cap exceeded");
  }

  usageLedger.set(request.workspaceId, next);
  return {
    text: request.prompt,
    model: request.prompt.length > 160 ? "claude-sonnet" : "gpt-4o-mini",
    usage: { inputTokens, outputTokens, totalTokens }
  };
}

export function getWorkspaceUsage(workspaceId: string): number {
  return usageLedger.get(workspaceId) ?? 0;
}
