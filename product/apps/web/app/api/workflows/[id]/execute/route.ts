import type { NextRequest } from "next/server";
import { fail, ok } from "../../../_lib/response";

export type StepStatus = "succeeded" | "failed" | "skipped";
export type RunStatus = "succeeded" | "failed";

export interface RunStep {
  nodeId: string;
  status: StepStatus;
  duration: number;
  output: Record<string, unknown>;
}

export interface RunResult {
  runId: string;
  status: RunStatus;
  steps: RunStep[];
  totalDuration: number;
}

const TEMPLATE_STEPS: ReadonlyArray<Omit<RunStep, "duration">> = [
  {
    nodeId: "trigger",
    status: "succeeded",
    output: { received: true, source: "webhook" },
  },
  {
    nodeId: "enrich.clearbit",
    status: "succeeded",
    output: { matched: true, company: "Acme, Inc.", employees: 482 },
  },
  {
    nodeId: "score.ai",
    status: "succeeded",
    output: { score: 0.87, tier: "A" },
  },
  {
    nodeId: "route.crm",
    status: "succeeded",
    output: { recordId: "ctc_9f3b21", owner: "rep_42" },
  },
  {
    nodeId: "notify.slack",
    status: "succeeded",
    output: { channel: "#sales-hot", ts: "1713513600.000100" },
  },
];

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id || typeof id !== "string") {
    return fail("Workflow id is required", 400);
  }

  const steps: RunStep[] = TEMPLATE_STEPS.map((s) => ({
    ...s,
    duration: 40 + Math.floor(Math.random() * 220),
  }));

  const totalDuration = steps.reduce((sum, s) => sum + s.duration, 0);
  const status: RunStatus = steps.every((s) => s.status === "succeeded")
    ? "succeeded"
    : "failed";

  const result: RunResult = {
    runId: `run_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    status,
    steps,
    totalDuration,
  };

  return ok(result, undefined, 202);
}
