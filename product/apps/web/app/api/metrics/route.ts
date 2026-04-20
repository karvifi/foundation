import type { NextRequest } from "next/server";
import { ok } from "../_lib/response";

export interface MetricPoint {
  value: number;
  previous: number;
  deltaPct: number;
  unit?: string;
  currency?: "USD";
}

export interface MetricsPeriod {
  current: string;
  previous: string;
  range: string;
}

export interface MetricsResponse {
  period: MetricsPeriod;
  revenue: MetricPoint;
  mrr: MetricPoint;
  arr: MetricPoint;
  churn: MetricPoint;
  nrr: MetricPoint;
  deals: MetricPoint;
  automations: MetricPoint;
  aiUsage: MetricPoint;
}

function pct(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Number((((current - previous) / previous) * 100).toFixed(2));
}

function point(
  current: number,
  previous: number,
  extras: Pick<MetricPoint, "unit" | "currency"> = {}
): MetricPoint {
  return {
    value: current,
    previous,
    deltaPct: pct(current, previous),
    ...extras,
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") ?? "30d";

  const period: MetricsPeriod = {
    current: "2026-04",
    previous: "2026-03",
    range,
  };

  const data: MetricsResponse = {
    period,
    revenue: point(1_284_300, 1_142_770, { currency: "USD" }),
    mrr: point(487_210, 450_120, { currency: "USD" }),
    arr: point(5_846_520, 5_401_440, { currency: "USD" }),
    churn: point(1.8, 2.3, { unit: "%" }),
    nrr: point(118, 112, { unit: "%" }),
    deals: point(214, 187, { unit: "count" }),
    automations: point(14_823, 12_410, { unit: "executions" }),
    aiUsage: point(1_842_300, 1_502_900, { unit: "tokens" }),
  };

  return ok(data);
}
