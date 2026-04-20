import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "../../../components/seo/JsonLd";
import Assessment from "./_components/Assessment";

export const metadata: Metadata = {
  title: "Free AI Readiness Assessment for Business (2026) — 10-Minute Self-Evaluation",
  description:
    "Discover whether your organization is ready to deploy AI at scale. Answer 10 questions across data quality, tool sprawl, AI governance, team skill, and process readiness. Get a scored report and prioritized action list. No signup required.",
  keywords: [
    "AI readiness assessment",
    "AI readiness for business",
    "is my company ready for AI",
    "AI maturity assessment free",
    "enterprise AI readiness checklist",
    "AI adoption assessment tool",
    "AI readiness quiz",
  ],
  alternates: { canonical: "/tools/ai-readiness-assessment" },
  openGraph: {
    title: "Free AI Readiness Assessment for Business (2026)",
    description:
      "10 questions. Instant scored report. Find out exactly where your organization stands on AI adoption — and what to do next.",
    type: "website",
    url: "/tools/ai-readiness-assessment",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Readiness Assessment for Business (2026)",
    description:
      "10 questions across data quality, governance, team skill, and process readiness. Get your AI maturity score instantly.",
  },
};

const FAQ = [
  {
    q: "What does the AI Readiness Assessment measure?",
    a: "It scores your organization across five dimensions: data quality, tool sprawl, AI governance, team skill, and process readiness. Each dimension is scored 0–100% based on your answers to two questions per area.",
  },
  {
    q: "How long does the assessment take?",
    a: "Most respondents complete it in 5–10 minutes. There are 10 multiple-choice questions — two per dimension. Each question has four options ranging from not at all to fully implemented.",
  },
  {
    q: "What score indicates AI readiness?",
    a: "We use four levels: AI Foundation Needed (under 30%), Early Adopter Stage (30–55%), AI Ready (55–75%), and AI Native (75–100%). Most organizations attempting company-wide AI adoption without fixing foundational gaps score in the 30–55% range.",
  },
  {
    q: "Should I answer for my whole company or my department?",
    a: "Answer for your department or business unit if you're in a large organization, since AI readiness varies widely by team. For companies under 200 people, answer for the organization as a whole. The most honest answers produce the most useful results.",
  },
  {
    q: "What should I do with my results?",
    a: "Each score level comes with a recommended next step. The category breakdown shows exactly which dimensions are dragging your overall score — focus there first. Data Quality and Process Readiness are the most common bottlenecks for organizations scoring below 60%.",
  },
];

export default function AIReadinessPage() {
  return (
    <>
      <JsonLd
        data={[
          {
            "@type": "WebApplication",
            name: "AI Readiness Assessment",
            url: "https://omnios.app/tools/ai-readiness-assessment",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            description:
              "Free 10-question assessment to score your organization's AI readiness across data quality, tool sprawl, AI governance, team skill, and process readiness.",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            creator: { "@type": "Organization", name: "OmniOS", url: "https://omnios.app" },
          },
          {
            "@type": "FAQPage",
            mainEntity: FAQ.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />

      {/* Hero */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-4xl px-6 pb-14 pt-20 text-center">
          <nav className="mb-6 flex items-center justify-center gap-2 text-xs text-white/40">
            <Link href="/tools" className="transition hover:text-white/70">Free Tools</Link>
            <span>/</span>
            <span className="text-white/70">AI Readiness Assessment</span>
          </nav>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
            Free · 10 questions · Instant report
          </p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            AI Readiness Assessment{" "}
            <span className="text-[#D4AF37]">for Business</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/60">
            10 questions across data quality, tool sprawl, governance, team skill, and
            process readiness. Get a scored report and a prioritized action plan in under
            10 minutes.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-white/40">
            <span>✓ 5 dimensions scored</span>
            <span>✓ Instant results</span>
            <span>✓ Actionable next steps</span>
          </div>
        </div>
      </section>

      {/* Interactive assessment */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <Assessment />
      </section>

      {/* FAQ */}
      <section className="border-t border-white/5 bg-[#07070C]">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h2 className="mb-10 text-2xl font-semibold tracking-tight text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            {FAQ.map((f) => (
              <div key={f.q}>
                <h3 className="text-base font-semibold text-white">{f.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related tools */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="text-xl font-semibold text-white">More free tools</h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {[
              { label: "SaaS Cost Calculator",       href: "/tools/saas-cost-calculator" },
              { label: "Workflow ROI Calculator",    href: "/tools/workflow-roi-calculator" },
              { label: "Sprint Velocity Calculator", href: "/tools/sprint-velocity-calculator" },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-white/70 transition hover:border-white/30 hover:text-white"
              >
                {t.label} →
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
