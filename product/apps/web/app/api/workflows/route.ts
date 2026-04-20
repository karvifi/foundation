import type { NextRequest } from "next/server";
import { fail, isRecord, ok, readJson } from "../_lib/response";

export type WorkflowStatus = "active" | "paused" | "draft";

export interface Workflow {
  id: string;
  name: string;
  status: WorkflowStatus;
  trigger: string;
  lastRun: string | null;
  executions: number;
  successRate: number;
}

const workflows: Workflow[] = [
  {
    id: "wf_lead_enrich",
    name: "Lead Enrichment Pipeline",
    status: "active",
    trigger: "webhook:hubspot.contact.created",
    lastRun: "2026-04-19T08:14:22.000Z",
    executions: 14823,
    successRate: 0.991,
  },
  {
    id: "wf_invoice_sync",
    name: "Stripe to QuickBooks Invoice Sync",
    status: "active",
    trigger: "schedule:every_15m",
    lastRun: "2026-04-19T08:30:00.000Z",
    executions: 9742,
    successRate: 0.998,
  },
  {
    id: "wf_churn_alert",
    name: "Churn Risk Alert",
    status: "paused",
    trigger: "event:metric.nrr.drop",
    lastRun: "2026-04-12T17:02:11.000Z",
    executions: 312,
    successRate: 0.946,
  },
  {
    id: "wf_onboarding",
    name: "New Customer Onboarding",
    status: "draft",
    trigger: "manual",
    lastRun: null,
    executions: 0,
    successRate: 0,
  },
];

export async function GET() {
  return ok(workflows, { total: workflows.length, page: 1, limit: workflows.length });
}

export async function POST(req: NextRequest) {
  const body = await readJson(req);
  if (!isRecord(body)) return fail("Invalid JSON body", 400);

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const trigger = typeof body.trigger === "string" ? body.trigger.trim() : "";
  const statusInput = typeof body.status === "string" ? body.status : "draft";

  if (!name) return fail("Field 'name' is required", 400);
  if (!trigger) return fail("Field 'trigger' is required", 400);

  const status: WorkflowStatus =
    statusInput === "active" || statusInput === "paused" || statusInput === "draft"
      ? statusInput
      : "draft";

  const created: Workflow = {
    id: `wf_${Math.random().toString(36).slice(2, 10)}`,
    name,
    status,
    trigger,
    lastRun: null,
    executions: 0,
    successRate: 0,
  };

  return ok(created, undefined, 201);
}
