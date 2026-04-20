"use client";

import { useState } from "react";
import Link from "next/link";

interface Process {
  id: string;
  name: string;
  hoursPerWeek: number;
  peopleInvolved: number;
  hourlyRate: number;
  errorRatePercent: number;
  automatable: number;
}

const DEFAULT_PROCESSES: Process[] = [
  { id: "p1", name: "Invoice processing & approval", hoursPerWeek: 8,  peopleInvolved: 3, hourlyRate: 65, errorRatePercent: 12, automatable: 80 },
  { id: "p2", name: "Employee onboarding tasks",     hoursPerWeek: 6,  peopleInvolved: 4, hourlyRate: 55, errorRatePercent: 8,  automatable: 70 },
  { id: "p3", name: "Weekly reporting & dashboards", hoursPerWeek: 5,  peopleInvolved: 2, hourlyRate: 75, errorRatePercent: 15, automatable: 90 },
  { id: "p4", name: "Lead qualification & routing",  hoursPerWeek: 10, peopleInvolved: 3, hourlyRate: 60, errorRatePercent: 20, automatable: 75 },
];

function fmt(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export default function WorkflowROICalculator() {
  const [processes, setProcesses] = useState<Process[]>(DEFAULT_PROCESSES);
  const [implementationCost, setImplementationCost] = useState(5000);
  const [monthlyPlatformCost, setMonthlyPlatformCost] = useState(199);

  function update(id: string, field: keyof Process, raw: string) {
    setProcesses((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, [field]: field === "name" ? raw : Number(raw) } : p
      )
    );
  }

  function addProcess() {
    const id = `p${Date.now()}`;
    setProcesses((prev) => [
      ...prev,
      { id, name: "New process", hoursPerWeek: 4, peopleInvolved: 2, hourlyRate: 60, errorRatePercent: 10, automatable: 70 },
    ]);
  }

  function removeProcess(id: string) {
    if (processes.length > 1) setProcesses((prev) => prev.filter((p) => p.id !== id));
  }

  const weeklyLaborCost = processes.reduce((s, p) => s + p.hoursPerWeek * p.peopleInvolved * p.hourlyRate, 0);
  const annualLaborCost = weeklyLaborCost * 52;
  const annualTimeSaved = processes.reduce((s, p) => s + (p.hoursPerWeek * p.peopleInvolved * p.automatable / 100) * 52, 0);
  const annualLaborSaved = processes.reduce((s, p) => s + (p.hoursPerWeek * p.peopleInvolved * p.hourlyRate * p.automatable / 100) * 52, 0);
  const errorSaved = processes.reduce((s, p) => s + (p.hoursPerWeek * p.peopleInvolved * p.hourlyRate * (p.errorRatePercent / 100) * (p.automatable / 100)) * 52, 0);
  const totalAnnualBenefit = annualLaborSaved + errorSaved;
  const totalCost = implementationCost + monthlyPlatformCost * 12;
  const netROI = totalAnnualBenefit - totalCost;
  const roiPercent = totalCost > 0 ? Math.round((netROI / totalCost) * 100) : 0;
  const paybackMonths = totalAnnualBenefit > 0 ? Math.max(1, Math.round((totalCost / totalAnnualBenefit) * 12)) : 0;

  const numFields: Array<{ field: keyof Process; label: string; max?: number }> = [
    { field: "hoursPerWeek",     label: "Hrs/wk" },
    { field: "peopleInvolved",   label: "People" },
    { field: "hourlyRate",       label: "$/hr" },
    { field: "errorRatePercent", label: "Error %", max: 100 },
    { field: "automatable",      label: "Auto %",  max: 100 },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Processes table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-white">Your Manual Processes</h2>
            <p className="mt-0.5 text-xs text-white/50">Add every repetitive process your team handles. Conservative estimates make the ROI more credible to finance.</p>
          </div>
          <button
            onClick={addProcess}
            className="rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:border-white/30 hover:text-white"
          >
            + Add process
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-white/40">Process name</th>
                {numFields.map((f) => (
                  <th key={f.field} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-white/40">{f.label}</th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {processes.map((p) => (
                <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <input
                      value={p.name}
                      onChange={(e) => update(p.id, "name", e.target.value)}
                      className="w-full min-w-[180px] bg-transparent text-sm text-white outline-none focus:underline"
                    />
                  </td>
                  {numFields.map((f) => (
                    <td key={f.field} className="px-4 py-3">
                      <input
                        type="number"
                        min={0}
                        max={f.max}
                        value={p[f.field] as number}
                        onChange={(e) => update(p.id, f.field, e.target.value)}
                        className="w-20 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1 text-center text-sm text-white outline-none focus:border-[#6366F1]/60"
                      />
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => removeProcess(p.id)}
                      disabled={processes.length === 1}
                      className="text-white/20 transition hover:text-red-400 disabled:opacity-30"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Investment inputs */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { label: "One-time implementation cost ($)", hint: "Setup, configuration, training. Estimate conservatively.", value: implementationCost, set: setImplementationCost },
          { label: "Monthly platform cost ($)", hint: "OmniOS Team starts at $49/user/mo. Enter your estimate.", value: monthlyPlatformCost, set: setMonthlyPlatformCost },
        ].map((inp) => (
          <div key={inp.label} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/50">{inp.label}</label>
            <p className="mt-1 text-xs text-white/40">{inp.hint}</p>
            <input
              type="number"
              min={0}
              value={inp.value}
              onChange={(e) => inp.set(Number(e.target.value))}
              className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-lg font-semibold text-white outline-none focus:border-[#6366F1]/60"
            />
          </div>
        ))}
      </div>

      {/* Results */}
      <div className="rounded-2xl border border-[#6366F1]/30 bg-[#6366F1]/5 p-8">
        <h2 className="mb-6 text-lg font-semibold text-white">Your Automation ROI</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Annual labor cost today",      value: `$${fmt(annualLaborCost)}`,     sub: `$${fmt(weeklyLaborCost)}/week`,           color: "text-white/60" },
            { label: "Annual savings",               value: `$${fmt(totalAnnualBenefit)}`,  sub: `${fmt(annualTimeSaved)} hours freed/year`, color: "text-[#6366F1]" },
            { label: "Net ROI (year 1)",             value: netROI >= 0 ? `$${fmt(netROI)}` : `-$${fmt(Math.abs(netROI))}`, sub: `${roiPercent}% return`, color: netROI >= 0 ? "text-emerald-400" : "text-red-400" },
            { label: "Payback period",               value: `${paybackMonths} mo`,          sub: "to recover investment",                   color: "text-[#D4AF37]" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <div className="text-xs font-medium text-white/50">{s.label}</div>
              <div className={`mt-2 text-2xl font-bold tracking-tight ${s.color}`}>{s.value}</div>
              <div className="mt-1 text-xs text-white/40">{s.sub}</div>
            </div>
          ))}
        </div>
        {roiPercent > 100 && (
          <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4">
            <p className="text-sm font-medium text-emerald-300">
              Strong business case. A {roiPercent}% ROI with a {paybackMonths}-month payback exceeds the typical 18-month enterprise approval threshold. This is ready to present to finance.
            </p>
          </div>
        )}
      </div>

      {/* Methodology */}
      <div className="rounded-xl border border-white/5 bg-white/[0.01] px-6 py-4 text-xs text-white/40">
        <strong className="text-white/60">Methodology:</strong> Labor savings = (hrs/week × people × $/hr × automation%) × 52. Error savings = (labor cost × error% × automation%) × 52. Investment = setup + (monthly × 12). ROI = (benefit − investment) ÷ investment × 100. Conservative by design — excludes indirect benefits (faster cycle times, reduced context-switching, employee retention).
      </div>

      {/* CTA */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
        <h2 className="text-xl font-semibold text-white">Ready to automate these processes?</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/60">
          OmniFlow turns any process into a visual workflow in minutes — no code, no per-task fees, no data leaving your infrastructure.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/register" className="inline-flex items-center gap-2 rounded-xl bg-[#6366F1] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(99,102,241,0.5),0_12px_32px_-8px_rgba(99,102,241,0.7)] transition hover:bg-[#5558E3]">
            Start automating free →
          </Link>
          <Link href="/tools/saas-cost-calculator" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-white/70 transition hover:border-white/30 hover:text-white">
            Also try: SaaS Cost Calculator
          </Link>
        </div>
      </div>
    </div>
  );
}
