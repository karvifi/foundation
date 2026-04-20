"use client";

import { useState } from "react";
import Link from "next/link";

interface Question {
  id: string;
  category: string;
  text: string;
  options: { label: string; score: number }[];
}

const QUESTIONS: Question[] = [
  { id: "q1",  category: "Data Quality",       text: "How would you describe your business data today?",                                 options: [{ label: "Scattered across spreadsheets, emails, and siloed apps",        score: 1 }, { label: "Centralized but inconsistently formatted",                           score: 2 }, { label: "Centralized with mostly consistent structure",                      score: 3 }, { label: "Clean, structured, and versioned in a central system",               score: 4 }] },
  { id: "q2",  category: "Data Quality",       text: "How often do employees manually re-enter the same data across different tools?",   options: [{ label: "Daily — it's a constant pain point",                              score: 1 }, { label: "Weekly for most processes",                                          score: 2 }, { label: "Occasionally for a few edge cases",                                 score: 3 }, { label: "Almost never — our systems stay in sync",                           score: 4 }] },
  { id: "q3",  category: "Tool Sprawl",        text: "How many SaaS tools does your team use regularly?",                               options: [{ label: "20+ tools, many overlapping in purpose",                           score: 1 }, { label: "10–20 tools with some redundancy",                                   score: 2 }, { label: "5–10 well-chosen tools",                                            score: 3 }, { label: "Under 5 tightly integrated tools",                                  score: 4 }] },
  { id: "q4",  category: "Tool Sprawl",        text: "How much time do employees spend switching between tools per day?",               options: [{ label: "2+ hours — constant context switching",                           score: 1 }, { label: "1–2 hours",                                                          score: 2 }, { label: "30–60 minutes",                                                     score: 3 }, { label: "Under 30 minutes",                                                  score: 4 }] },
  { id: "q5",  category: "AI Governance",      text: "Does your organization have a documented AI usage policy?",                      options: [{ label: "No — employees use AI tools without any guidance",                score: 1 }, { label: "Informal guidance exists but nothing is written down",                score: 2 }, { label: "A written policy exists but isn't consistently followed",           score: 3 }, { label: "A clear policy exists and is actively enforced",                    score: 4 }] },
  { id: "q6",  category: "AI Governance",      text: "How do you handle sensitive data when using AI tools?",                          options: [{ label: "No restrictions — teams paste anything into AI tools",             score: 1 }, { label: "Informal caution but no formal controls",                             score: 2 }, { label: "We avoid customer data but have no documented process",              score: 3 }, { label: "Clear data classification rules and an approved AI tools list",     score: 4 }] },
  { id: "q7",  category: "Team Skill",         text: "What best describes your team's AI literacy?",                                   options: [{ label: "Most people have never used AI tools professionally",              score: 1 }, { label: "A few enthusiasts use AI tools informally",                           score: 2 }, { label: "Many people use AI tools but without structured training",           score: 3 }, { label: "Structured AI training and champions across departments",            score: 4 }] },
  { id: "q8",  category: "Team Skill",         text: "How often do you verify AI outputs before acting on them?",                      options: [{ label: "Rarely — we treat AI outputs as correct by default",              score: 1 }, { label: "Sometimes, for high-stakes decisions only",                           score: 2 }, { label: "Usually — we have informal review habits",                          score: 3 }, { label: "Always — we have a structured AI output review process",            score: 4 }] },
  { id: "q9",  category: "Process Readiness",  text: "Are your core business processes documented?",                                   options: [{ label: "No documentation — knowledge lives in people's heads",            score: 1 }, { label: "Some documentation but mostly outdated",                             score: 2 }, { label: "Most processes documented with some gaps",                          score: 3 }, { label: "Processes are documented, current, and accessible to the team",     score: 4 }] },
  { id: "q10", category: "Process Readiness",  text: "How do you measure whether a process improvement worked?",                       options: [{ label: "We don't — it's mostly gut feel",                                 score: 1 }, { label: "Anecdotally from team feedback",                                      score: 2 }, { label: "We track a few key metrics manually",                               score: 3 }, { label: "Defined KPIs tracked automatically in dashboards",                  score: 4 }] },
];

const MAX_SCORE = QUESTIONS.length * 4;

interface Level {
  label: string;
  color: string;
  description: string;
  next: string;
}

function getLevel(score: number): Level {
  const pct = (score / MAX_SCORE) * 100;
  if (pct < 30) return {
    label: "AI Foundation Needed",
    color: "text-red-400",
    description: "Your organization is not yet ready to capture meaningful AI value. The foundational work — data consolidation, process documentation, and basic AI literacy — needs to happen first.",
    next: "Start with data: consolidate your most important data into one system, document your top 5 processes, and run an AI literacy workshop for your team before deploying any AI tools.",
  };
  if (pct < 55) return {
    label: "Early Adopter Stage",
    color: "text-orange-400",
    description: "You have the instincts for AI but the infrastructure isn't ready yet. Individual experiments work, but company-wide AI adoption will hit walls around data quality and tool sprawl.",
    next: "Focus on integration: reduce your SaaS stack, standardize data formats across your top tools, and create an informal AI policy before deploying anything business-critical.",
  };
  if (pct < 75) return {
    label: "AI Ready",
    color: "text-[#D4AF37]",
    description: "Your organization can deploy AI tools across most business processes and expect meaningful productivity gains. Some friction remains in governance and consistency.",
    next: "Start automating: identify your 3 highest-ROI manual processes, pilot AI automation with clear success metrics, and document what you learn for broader rollout.",
  };
  return {
    label: "AI Native",
    color: "text-emerald-400",
    description: "Your organization is structured to capture maximum AI value. Clean data, low tool sprawl, strong governance, and a skilled team put you in the top tier of AI-ready businesses.",
    next: "Accelerate: deploy AI across all major workflows, build custom agents for your unique processes, and treat AI as a competitive moat rather than just a productivity tool.",
  };
}

export default function AIReadinessAssessment() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const answered = Object.keys(answers).length;
  const totalScore = Object.values(answers).reduce((s, v) => s + v, 0);
  const level = getLevel(totalScore);
  const pct = Math.round((totalScore / MAX_SCORE) * 100);

  const categories = [...new Set(QUESTIONS.map((q) => q.category))];
  const categoryScores = categories.map((cat) => {
    const qs = QUESTIONS.filter((q) => q.category === cat);
    const score = qs.reduce((s, q) => s + (answers[q.id] ?? 0), 0);
    const max = qs.length * 4;
    return { cat, score, max, pct: max > 0 ? Math.round((score / max) * 100) : 0 };
  });

  function barColor(p: number) {
    if (p >= 75) return "#34d399";
    if (p >= 50) return "#D4AF37";
    if (p >= 30) return "#f97316";
    return "#f87171";
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="rounded-2xl border border-[#6366F1]/30 bg-[#6366F1]/5 p-8 text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-white/50">Your AI Readiness Score</div>
          <div className={`mt-3 text-6xl font-bold tracking-tight ${level.color}`}>
            {pct}<span className="text-3xl">%</span>
          </div>
          <div className={`mt-2 text-xl font-semibold ${level.color}`}>{level.label}</div>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/60">{level.description}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="mb-5 text-base font-semibold text-white">Score by Category</h2>
          <div className="space-y-4">
            {categoryScores.map((cs) => (
              <div key={cs.cat}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{cs.cat}</span>
                  <span className="text-sm font-bold text-white/70">{cs.pct}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${cs.pct}%`, background: barColor(cs.pct) }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="mb-3 text-base font-semibold text-white">Your Recommended Next Step</h2>
          <p className="text-sm leading-relaxed text-white/60">{level.next}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
          <h2 className="text-xl font-semibold text-white">OmniOS meets you at every readiness level</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/60">
            Whether you need to consolidate data, reduce tool sprawl, or deploy advanced AI agents — OmniOS is built for the whole journey.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-[#6366F1] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(99,102,241,0.5),0_12px_32px_-8px_rgba(99,102,241,0.7)] transition hover:bg-[#5558E3]"
            >
              Start free →
            </Link>
            <button
              onClick={() => { setAnswers({}); setSubmitted(false); }}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-white/70 transition hover:border-white/30 hover:text-white"
            >
              Retake assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-4">
        <div className="flex items-center justify-between text-xs text-white/50">
          <span>{answered} of {QUESTIONS.length} answered</span>
          <span>{Math.round((answered / QUESTIONS.length) * 100)}% complete</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#6366F1] transition-all duration-300"
            style={{ width: `${(answered / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {QUESTIONS.map((q, idx) => (
        <div key={q.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-white/40">{q.category}</div>
          <p className="text-sm font-semibold text-white">{idx + 1}. {q.text}</p>
          <div className="mt-4 space-y-2">
            {q.options.map((opt) => (
              <button
                key={opt.score}
                onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.score }))}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                  answers[q.id] === opt.score
                    ? "border-[#6366F1]/60 bg-[#6366F1]/10 text-white"
                    : "border-white/10 bg-white/[0.01] text-white/60 hover:border-white/20 hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="sticky bottom-6 flex justify-center pb-2">
        <button
          onClick={() => setSubmitted(true)}
          disabled={answered < QUESTIONS.length}
          className="rounded-xl bg-[#6366F1] px-8 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(99,102,241,0.5),0_12px_32px_-8px_rgba(99,102,241,0.7)] transition hover:bg-[#5558E3] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {answered < QUESTIONS.length
            ? `Answer ${QUESTIONS.length - answered} more question${QUESTIONS.length - answered !== 1 ? "s" : ""}`
            : "See my AI Readiness Score →"}
        </button>
      </div>
    </div>
  );
}
