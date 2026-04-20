import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "../../../components/seo/JsonLd";
import Calculator from "./_components/Calculator";

export const metadata: Metadata = {
  title: "Free Sprint Velocity Calculator (2026) — Plan Sprints Without the Guesswork",
  description:
    "Calculate your team's true sprint velocity from historical data. Get conservative, realistic, and optimistic commitment recommendations for your next sprint — with over-commitment risk warnings. No signup required.",
  keywords: [
    "sprint velocity calculator",
    "agile sprint velocity",
    "scrum velocity calculator free",
    "sprint commitment calculator",
    "sprint planning tool",
    "team velocity forecast",
    "sprint points calculator",
  ],
  alternates: { canonical: "/tools/sprint-velocity-calculator" },
  openGraph: {
    title: "Free Sprint Velocity Calculator (2026)",
    description:
      "Enter your sprint history and get data-driven commitment recommendations — conservative, realistic, and optimistic — with over-commitment risk warnings.",
    type: "website",
    url: "/tools/sprint-velocity-calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Sprint Velocity Calculator (2026)",
    description:
      "Stop guessing your sprint commitment. Enter your history and get a data-backed recommendation in 60 seconds.",
  },
};

const FAQ = [
  {
    q: "How does the sprint velocity calculator work?",
    a: "Enter your last 4–8 sprints with points committed and completed. The calculator computes your historical average, recent average (last 3 sprints), standard deviation, and overall completion rate. It then gives three commitment recommendations for the next sprint: conservative (85% of recent avg), realistic (100%), and optimistic (110%), plus an over-commitment warning if your planned commitment exceeds the optimistic ceiling.",
  },
  {
    q: "How many sprints should I enter?",
    a: "Enter at least 4 sprints for a useful baseline. 6–8 sprints is ideal — it gives enough history to separate random variation from a real velocity trend. Fewer than 3 sprints produces unreliable averages. If you have a new team, enter what you have and treat the conservative recommendation as your target until you have more data.",
  },
  {
    q: "Why does the calculator weight the last 3 sprints?",
    a: "Recent sprints reflect current team capacity, tooling, and process better than older data. If your team grew, lost a member, changed tech stacks, or improved a process recently, the last 3 sprints are a better predictor than a 20-sprint average that includes very different conditions.",
  },
  {
    q: "What is a good sprint completion rate?",
    a: "Above 90% indicates the team is consistently right-sizing commitments. Between 75–90% suggests some over-commitment or regular scope creep. Below 75% usually signals systemic issues: poor story estimation, frequent interruptions, unclear acceptance criteria, or cross-team dependencies. Fix the root cause rather than just reducing commitment.",
  },
  {
    q: "When should I use the conservative recommendation?",
    a: "Use 85% of recent average when: there are unknowns in the backlog, a team member is on leave, there is a major release or external deadline mid-sprint, cross-team dependencies are involved, or the team has been consistently over-committing for the last few sprints.",
  },
];

export default function SprintVelocityPage() {
  return (
    <>
      <JsonLd
        data={[
          {
            "@type": "WebApplication",
            name: "Sprint Velocity Calculator",
            url: "https://omnios.app/tools/sprint-velocity-calculator",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            description:
              "Free sprint velocity calculator for agile teams. Enter sprint history to get conservative, realistic, and optimistic commitment recommendations with over-commitment risk warnings.",
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
            <Link href="/tools" className="transition hover:text-white/70">
              Free Tools
            </Link>
            <span>/</span>
            <span className="text-white/70">Sprint Velocity Calculator</span>
          </nav>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
            Free · No signup · Instant results
          </p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Sprint Velocity{" "}
            <span className="text-[#6366F1]">Calculator</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/60">
            Enter your sprint history and get data-backed commitment recommendations —
            conservative, realistic, and optimistic — with over-commitment risk warnings
            built in.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-white/40">
            <span>✓ Trend detection</span>
            <span>✓ 3-tier recommendations</span>
            <span>✓ Over-commitment alerts</span>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <Calculator />
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
              { label: "SaaS Cost Calculator",    href: "/tools/saas-cost-calculator" },
              { label: "Workflow ROI Calculator", href: "/tools/workflow-roi-calculator" },
              { label: "AI Readiness Assessment", href: "/tools/ai-readiness-assessment" },
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
