"use client";

import { useState } from "react";
import Link from "next/link";

interface Sprint {
  id: string;
  label: string;
  committed: number;
  completed: number;
}

const DEFAULT_SPRINTS: Sprint[] = [
  { id: "s1", label: "Sprint 12", committed: 42, completed: 38 },
  { id: "s2", label: "Sprint 13", committed: 40, completed: 41 },
  { id: "s3", label: "Sprint 14", committed: 45, completed: 37 },
  { id: "s4", label: "Sprint 15", committed: 44, completed: 43 },
  { id: "s5", label: "Sprint 16", committed: 46, completed: 40 },
  { id: "s6", label: "Sprint 17", committed: 42, completed: 44 },
];

function fmt(n: number, decimals = 0) {
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export default function SprintVelocityCalculator() {
  const [sprints, setSprints] = useState<Sprint[]>(DEFAULT_SPRINTS);
  const [nextCommitment, setNextCommitment] = useState(44);

  function update(id: string, field: keyof Sprint, raw: string) {
    setSprints((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, [field]: field === "label" ? raw : Number(raw) } : s
      )
    );
  }

  function addSprint() {
    const id = `s${Date.now()}`;
    const last = sprints[sprints.length - 1];
    const num = last ? parseInt(last.label.replace(/\D/g, ""), 10) + 1 : 1;
    setSprints((prev) => [
      ...prev,
      { id, label: `Sprint ${num}`, committed: 42, completed: 38 },
    ]);
  }

  function removeSprint(id: string) {
    if (sprints.length > 2) setSprints((prev) => prev.filter((s) => s.id !== id));
  }

  const velocities = sprints.map((s) => s.completed);
  const avgVelocity = velocities.reduce((a, b) => a + b, 0) / velocities.length;
  const recent3 = velocities.slice(-3);
  const recentAvg = recent3.reduce((a, b) => a + b, 0) / recent3.length;
  const minV = Math.min(...velocities);
  const maxV = Math.max(...velocities);
  const stdDev =
    velocities.length > 1
      ? Math.sqrt(
          velocities.reduce((s, v) => s + Math.pow(v - avgVelocity, 2), 0) /
            (velocities.length - 1)
        )
      : 0;

  const totalCommitted = sprints.reduce((s, sp) => s + sp.committed, 0);
  const totalCompleted = sprints.reduce((s, sp) => s + sp.completed, 0);
  const completionRate = totalCommitted > 0 ? (totalCompleted / totalCommitted) * 100 : 0;

  const conservativeCommit = Math.floor(recentAvg * 0.85);
  const realisticCommit = Math.round(recentAvg);
  const optimisticCommit = Math.ceil(recentAvg * 1.1);

  const overcommitCount = sprints.filter((s) => s.completed < s.committed * 0.85).length;

  const early3avg =
    velocities.length >= 6
      ? velocities.slice(0, 3).reduce((a, b) => a + b, 0) / 3
      : avgVelocity;
  const trend = recentAvg - early3avg;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Sprint history */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-white">Sprint History</h2>
            <p className="mt-0.5 text-xs text-white/50">
              Enter your last 4–8 sprints. More history = more accurate forecast.
            </p>
          </div>
          <button
            onClick={addSprint}
            className="rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:border-white/30 hover:text-white"
          >
            + Add sprint
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {["Sprint", "Committed (pts)", "Completed (pts)", "Completion %", ""].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-white/40"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sprints.map((s) => {
                const pct = s.committed > 0 ? Math.round((s.completed / s.committed) * 100) : 0;
                return (
                  <tr key={s.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <input
                        value={s.label}
                        onChange={(e) => update(s.id, "label", e.target.value)}
                        className="w-28 bg-transparent text-sm text-white outline-none focus:underline"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min={1}
                        value={s.committed}
                        onChange={(e) => update(s.id, "committed", e.target.value)}
                        className="w-24 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1 text-center text-sm text-white outline-none focus:border-[#6366F1]/60"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min={0}
                        value={s.completed}
                        onChange={(e) => update(s.id, "completed", e.target.value)}
                        className="w-24 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1 text-center text-sm text-white outline-none focus:border-[#6366F1]/60"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm font-semibold ${
                          pct >= 90
                            ? "text-emerald-400"
                            : pct >= 75
                            ? "text-[#D4AF37]"
                            : "text-red-400"
                        }`}
                      >
                        {pct}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => removeSprint(s.id)}
                        disabled={sprints.length <= 2}
                        className="text-white/20 transition hover:text-red-400 disabled:opacity-30"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Next sprint input */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <label className="block text-xs font-semibold uppercase tracking-wider text-white/50">
          Next sprint commitment under consideration (pts)
        </label>
        <p className="mt-1 text-xs text-white/40">
          What is the team thinking of committing to? We will tell you whether it is realistic.
        </p>
        <input
          type="number"
          min={1}
          value={nextCommitment}
          onChange={(e) => setNextCommitment(Number(e.target.value))}
          className="mt-3 w-48 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-lg font-semibold text-white outline-none focus:border-[#6366F1]/60"
        />
      </div>

      {/* Velocity stats */}
      <div className="rounded-2xl border border-[#6366F1]/30 bg-[#6366F1]/5 p-8">
        <h2 className="mb-6 text-lg font-semibold text-white">Velocity Analysis</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Historical avg velocity",
              value: fmt(avgVelocity, 1),
              sub: `range ${minV}–${maxV} pts`,
              color: "text-white",
            },
            {
              label: "Recent avg (last 3 sprints)",
              value: fmt(recentAvg, 1),
              sub: trend >= 1 ? "↑ velocity trending up" : trend <= -1 ? "↓ velocity trending down" : "→ stable",
              color: trend >= 1 ? "text-emerald-400" : trend <= -1 ? "text-orange-400" : "text-white",
            },
            {
              label: "Sprint completion rate",
              value: `${fmt(completionRate)}%`,
              sub: `${overcommitCount}/${sprints.length} sprints over-committed`,
              color:
                completionRate >= 90
                  ? "text-emerald-400"
                  : completionRate >= 75
                  ? "text-[#D4AF37]"
                  : "text-red-400",
            },
            {
              label: "Velocity std deviation",
              value: fmt(stdDev, 1),
              sub: stdDev < 4 ? "very consistent" : stdDev < 8 ? "normal variability" : "high variability",
              color: stdDev < 4 ? "text-emerald-400" : stdDev < 8 ? "text-[#D4AF37]" : "text-orange-400",
            },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <div className="text-xs font-medium text-white/50">{s.label}</div>
              <div className={`mt-2 text-2xl font-bold tracking-tight ${s.color}`}>{s.value}</div>
              <div className="mt-1 text-xs text-white/40">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Commitment recommendation */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="mb-1 text-base font-semibold text-white">Commitment Recommendations</h2>
        <p className="mb-5 text-xs text-white/50">
          Based on your last 3 sprints. Team is considering{" "}
          <span className="font-semibold text-white">{nextCommitment} points</span>.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Conservative",
              value: conservativeCommit,
              multiplier: "85% of recent avg",
              color: "text-emerald-400",
              note: "High confidence of delivery. Best when there are unknowns, dependencies, or planned time off.",
            },
            {
              label: "Realistic",
              value: realisticCommit,
              multiplier: "100% of recent avg",
              color: "text-[#D4AF37]",
              note: "Matches recent pace. Right for stable teams with no major blockers or disruptions.",
            },
            {
              label: "Optimistic",
              value: optimisticCommit,
              multiplier: "110% of recent avg",
              color: "text-orange-400",
              note: "Assumes improvement over recent pace. Only viable with a clear reason for the velocity jump.",
            },
          ].map((r) => (
            <div
              key={r.label}
              className={`rounded-xl border p-5 transition ${
                nextCommitment === r.value
                  ? "border-[#6366F1]/50 bg-[#6366F1]/10"
                  : "border-white/10"
              }`}
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-white/40">
                {r.label}
              </div>
              <div className={`mt-2 text-3xl font-bold tracking-tight ${r.color}`}>
                {r.value} <span className="text-base font-normal text-white/40">pts</span>
              </div>
              <div className="mt-1 text-xs text-white/50">{r.multiplier}</div>
              <p className="mt-3 text-xs leading-relaxed text-white/40">{r.note}</p>
            </div>
          ))}
        </div>

        {nextCommitment > optimisticCommit && (
          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4">
            <p className="text-sm font-medium text-red-300">
              ⚠ {nextCommitment} points exceeds your optimistic ceiling of {optimisticCommit}. Based on
              history, delivery risk is high. Consider reducing the commitment or splitting low-priority
              stories into a stretch goal.
            </p>
          </div>
        )}

        {nextCommitment <= conservativeCommit && (
          <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4">
            <p className="text-sm font-medium text-emerald-300">
              ✓ {nextCommitment} points is within your conservative range — high confidence of full
              delivery. If the team has capacity, consider adding a low-priority stretch story.
            </p>
          </div>
        )}
      </div>

      {/* Methodology */}
      <div className="rounded-xl border border-white/5 bg-white/[0.01] px-6 py-4 text-xs text-white/40">
        <strong className="text-white/60">Methodology:</strong> Historical avg = mean of all sprints entered.
        Recent avg = mean of last 3 sprints (weights current pace). Conservative = recent avg × 0.85.
        Realistic = recent avg (rounded). Optimistic = recent avg × 1.10. Std deviation measures
        consistency across sprints — teams below 4 pts std dev can commit to the realistic figure with
        confidence. Completion rate = total completed ÷ total committed across all sprints.
      </div>

      {/* CTA */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
        <h2 className="text-xl font-semibold text-white">
          Manage sprints, roadmaps, and OKRs in one place
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/60">
          OmniProjects connects sprint data to your roadmap, docs, and CRM — so everyone
          always knows where things stand without a status meeting.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-[#6366F1] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(99,102,241,0.5),0_12px_32px_-8px_rgba(99,102,241,0.7)] transition hover:bg-[#5558E3]"
          >
            Try OmniProjects free →
          </Link>
          <Link
            href="/tools/workflow-roi-calculator"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-white/70 transition hover:border-white/30 hover:text-white"
          >
            Also try: Workflow ROI Calculator
          </Link>
        </div>
      </div>
    </div>
  );
}
