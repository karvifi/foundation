"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

interface SaasTool {
  id: string;
  name: string;
  price: number;
  perUser: boolean;
  enabled: boolean;
  custom?: boolean;
}

const OMNIOS_PRICE_PER_MONTH = 99;

const DEFAULT_TEAM_SIZE = 5;
const MIN_TEAM_SIZE = 1;
const MAX_TEAM_SIZE = 500;

const DEFAULT_TOOLS: ReadonlyArray<SaasTool> = [
  { id: "notion", name: "Notion", price: 16, perUser: true, enabled: true },
  { id: "slack", name: "Slack", price: 7.25, perUser: true, enabled: true },
  { id: "hubspot", name: "HubSpot (Starter)", price: 90, perUser: false, enabled: true },
  { id: "jira", name: "Jira", price: 7.75, perUser: true, enabled: true },
  { id: "asana", name: "Asana", price: 10.99, perUser: true, enabled: true },
  { id: "zoom", name: "Zoom", price: 15.99, perUser: true, enabled: true },
  { id: "salesforce", name: "Salesforce (Essentials)", price: 25, perUser: true, enabled: true },
  { id: "zapier", name: "Zapier", price: 49, perUser: false, enabled: true },
  { id: "airtable", name: "Airtable", price: 20, perUser: true, enabled: true },
  { id: "linear", name: "Linear", price: 8, perUser: true, enabled: true },
  { id: "intercom", name: "Intercom", price: 74, perUser: false, enabled: true },
  { id: "quickbooks", name: "QuickBooks", price: 30, perUser: false, enabled: true },
  { id: "googleworkspace", name: "Google Workspace", price: 12, perUser: true, enabled: true },
  { id: "figma", name: "Figma", price: 15, perUser: true, enabled: true },
  { id: "github", name: "GitHub", price: 4, perUser: true, enabled: true },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value)));
}

function clampTeamSize(value: number): number {
  if (Number.isNaN(value)) return DEFAULT_TEAM_SIZE;
  return Math.min(MAX_TEAM_SIZE, Math.max(MIN_TEAM_SIZE, Math.floor(value)));
}

function computeToolCost(tool: SaasTool, teamSize: number): number {
  if (!tool.enabled) return 0;
  const price = Number.isFinite(tool.price) ? tool.price : 0;
  return tool.perUser ? price * teamSize : price;
}

function makeCustomId(): string {
  return `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export default function Calculator() {
  const [teamSize, setTeamSize] = useState<number>(DEFAULT_TEAM_SIZE);
  const [tools, setTools] = useState<SaasTool[]>(() =>
    DEFAULT_TOOLS.map((tool) => ({ ...tool }))
  );

  const monthlyTotal = useMemo(
    () => tools.reduce((sum, tool) => sum + computeToolCost(tool, teamSize), 0),
    [tools, teamSize]
  );

  const annualTotal = monthlyTotal * 12;
  const monthlySavings = Math.max(0, monthlyTotal - OMNIOS_PRICE_PER_MONTH);
  const annualSavings = monthlySavings * 12;
  const savingsPct =
    monthlyTotal > 0 ? Math.min(100, (monthlySavings / monthlyTotal) * 100) : 0;

  const handleTeamSize = (raw: string) => {
    const parsed = parseInt(raw, 10);
    setTeamSize(clampTeamSize(parsed));
  };

  const updateTool = (id: string, patch: Partial<SaasTool>) => {
    setTools((prev) =>
      prev.map((tool) => (tool.id === id ? { ...tool, ...patch } : tool))
    );
  };

  const removeTool = (id: string) => {
    setTools((prev) => prev.filter((tool) => tool.id !== id));
  };

  const addCustomTool = () => {
    setTools((prev) => [
      ...prev,
      {
        id: makeCustomId(),
        name: "Custom tool",
        price: 10,
        perUser: false,
        enabled: true,
        custom: true,
      },
    ]);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                Calculate Your SaaS Stack Cost
              </h2>
              <p className="mt-1 text-sm text-white/60">
                Add your tools and see your monthly burn rate.
              </p>
            </div>
            <div className="shrink-0">
              <label
                htmlFor="team-size"
                className="block text-xs font-medium uppercase tracking-[0.14em] text-white/50"
              >
                Team size
              </label>
              <input
                id="team-size"
                type="number"
                inputMode="numeric"
                min={MIN_TEAM_SIZE}
                max={MAX_TEAM_SIZE}
                value={teamSize}
                onChange={(e) => handleTeamSize(e.target.value)}
                className="mt-1 w-28 rounded-lg border border-white/10 bg-[#0A0A0F] px-3 py-2 text-right text-lg font-semibold text-white outline-none transition focus:border-[#6366F1]"
              />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
          <div className="hidden grid-cols-[minmax(0,1fr)_110px_130px_40px] gap-3 border-b border-white/5 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40 md:grid">
            <span>Tool</span>
            <span className="text-center">Per user</span>
            <span className="text-right">Monthly price</span>
            <span />
          </div>

          <ul className="divide-y divide-white/5">
            {tools.map((tool) => {
              const subtotal = computeToolCost(tool, teamSize);
              return (
                <li
                  key={tool.id}
                  className={`grid grid-cols-1 items-center gap-3 px-5 py-4 transition md:grid-cols-[minmax(0,1fr)_110px_130px_40px] ${
                    tool.enabled ? "" : "opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={tool.enabled}
                      onChange={(e) =>
                        updateTool(tool.id, { enabled: e.target.checked })
                      }
                      aria-label={`Include ${tool.name}`}
                      className="h-4 w-4 shrink-0 cursor-pointer accent-[#6366F1]"
                    />
                    {tool.custom ? (
                      <input
                        type="text"
                        value={tool.name}
                        onChange={(e) =>
                          updateTool(tool.id, { name: e.target.value })
                        }
                        className="w-full rounded-md border border-white/10 bg-[#0A0A0F] px-2 py-1 text-sm text-white outline-none focus:border-[#6366F1]"
                      />
                    ) : (
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-white">
                          {tool.name}
                        </div>
                        <div className="mt-0.5 text-xs text-white/40">
                          {tool.perUser ? "Per-seat pricing" : "Flat monthly"}
                          {tool.enabled && subtotal > 0
                            ? ` · ${formatCurrency(subtotal)}/mo`
                            : ""}
                        </div>
                      </div>
                    )}
                  </div>

                  <label className="flex items-center justify-center gap-2 text-xs text-white/60">
                    <input
                      type="checkbox"
                      checked={tool.perUser}
                      onChange={(e) =>
                        updateTool(tool.id, { perUser: e.target.checked })
                      }
                      className="h-4 w-4 cursor-pointer accent-[#6366F1]"
                    />
                    <span className="md:hidden">Per user</span>
                  </label>

                  <div className="flex items-center justify-end gap-1">
                    <span className="text-white/40">$</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="0.01"
                      value={tool.price}
                      onChange={(e) =>
                        updateTool(tool.id, {
                          price: Math.max(0, parseFloat(e.target.value) || 0),
                        })
                      }
                      className="w-24 rounded-md border border-white/10 bg-[#0A0A0F] px-2 py-1 text-right text-sm text-white outline-none focus:border-[#6366F1]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeTool(tool.id)}
                    aria-label={`Remove ${tool.name}`}
                    className="justify-self-end rounded-md p-1.5 text-white/30 transition hover:bg-white/5 hover:text-white/80"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-white/5 px-5 py-4">
            <button
              type="button"
              onClick={addCustomTool}
              className="inline-flex items-center gap-2 rounded-lg border border-dashed border-white/15 px-4 py-2 text-sm font-medium text-white/70 transition hover:border-[#6366F1]/60 hover:text-white"
            >
              <span aria-hidden="true">+</span>
              Add custom tool
            </button>
          </div>
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 shadow-[0_20px_60px_-30px_rgba(99,102,241,0.6)]">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
            Your Monthly SaaS Bill
          </p>
          <p className="mt-2 text-4xl font-bold tracking-tight text-white tabular-nums sm:text-5xl">
            {formatCurrency(monthlyTotal)}
          </p>
          <p className="mt-1 text-sm text-white/50">
            Per year:{" "}
            <span className="font-semibold text-white/80 tabular-nums">
              {formatCurrency(annualTotal)}
            </span>
          </p>

          <div className="mt-6 rounded-xl border border-[#6366F1]/30 bg-[#6366F1]/10 p-4">
            <p className="text-sm leading-relaxed text-white/80">
              <span className="font-semibold text-white">OmniOS replaces ALL of this</span>{" "}
              for just{" "}
              <span className="font-bold text-[#D4AF37]">
                ${OMNIOS_PRICE_PER_MONTH}/month
              </span>
              .
            </p>
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
              Your savings
            </p>
            <p className="mt-2 text-4xl font-bold tracking-tight tabular-nums text-[#D4AF37] sm:text-5xl">
              {formatCurrency(monthlySavings)}
              <span className="ml-1 text-base font-medium text-white/50">
                /mo
              </span>
            </p>
            <p className="mt-1 text-sm text-white/60">
              Annual savings:{" "}
              <span className="font-bold tabular-nums text-[#D4AF37]">
                {formatCurrency(annualSavings)}
              </span>
            </p>
          </div>

          <div
            className="mt-5"
            role="img"
            aria-label={`You save ${Math.round(savingsPct)} percent by switching to OmniOS`}
          >
            <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">
              <span>Current stack</span>
              <span>{Math.round(savingsPct)}% saved</span>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E8C96A] to-[#D4AF37] transition-[width] duration-500 ease-out"
                style={{ width: `${savingsPct}%` }}
              />
            </div>
          </div>

          <Link
            href="/register"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#6366F1] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(99,102,241,0.5),0_12px_32px_-8px_rgba(99,102,241,0.7)] transition hover:bg-[#5558E3]"
          >
            Start Saving {formatCurrency(monthlySavings)}/month
            <span aria-hidden="true">→</span>
          </Link>

          <p className="mt-3 text-center text-[11px] text-white/40">
            Free 14-day trial · No credit card · Cancel anytime
          </p>
        </div>
      </aside>
    </div>
  );
}
