import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "../../../components/seo/JsonLd";
import Calculator from "./_components/Calculator";

export const metadata: Metadata = {
  title: "Free Workflow Automation ROI Calculator (2026) — Quantify Your Manual Work",
  description:
    "Calculate the exact ROI of automating your business processes. Enter any repetitive workflow — invoicing, onboarding, reporting — and see annual savings, payback period, and net ROI in seconds. No signup required.",
  keywords: [
    "workflow automation ROI calculator",
    "business process automation ROI",
    "automation cost savings calculator",
    "workflow ROI calculator free",
    "process automation business case",
    "automation payback period calculator",
    "manual process cost calculator",
  ],
  alternates: { canonical: "/tools/workflow-roi-calculator" },
  openGraph: {
    title: "Free Workflow Automation ROI Calculator (2026)",
    description:
      "Calculate the exact ROI of automating your manual processes. See annual savings, payback period, and net ROI instantly.",
    type: "website",
    url: "/tools/workflow-roi-calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Workflow Automation ROI Calculator (2026)",
    description:
      "Quantify the cost of your manual processes and build a business case for automation in 60 seconds.",
  },
};

const APP_SCHEMA = {
  "@type": "WebApplication",
  name: "Workflow Automation ROI Calculator",
  url: "https://omnios.app/tools/workflow-roi-calculator",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Free calculator to quantify the ROI of automating manual business processes. Calculates annual labor savings, error reduction savings, payback period, and net ROI.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  creator: { "@type": "Organization", name: "OmniOS", url: "https://omnios.app" },
};

const FAQ = [
  {
    q: "How does the workflow ROI calculator work?",
    a: "Enter each manual process your team runs: hours per week, people involved, average hourly cost, error rate, and what percentage could realistically be automated. The calculator multiplies these across 52 weeks to give annualized labor cost, savings potential, and net ROI after deducting your automation investment.",
  },
  {
    q: "What counts as 'automatable percentage'?",
    a: "The share of the process fully handled by software without human review. An invoice approval workflow might be 80% automatable — extraction, routing, and logging are automated, but a human approves payments above a threshold. Conservative estimates make your business case more credible.",
  },
  {
    q: "Is this calculator accurate?",
    a: "It produces conservative estimates by design. It accounts only for direct labor savings and error-related rework costs. Real-world automation ROI typically exceeds these figures because it excludes indirect benefits: faster cycle times, reduced context-switching, improved customer response times, and employee retention gains.",
  },
  {
    q: "What is a good ROI for workflow automation?",
    a: "Most finance teams approve automation projects with a payback period under 18 months. An ROI above 150% in year one is considered strong. Complex multi-step workflows touching multiple departments often return 300–500% ROI because savings compound across every team involved.",
  },
  {
    q: "How do I estimate fully-loaded hourly rate?",
    a: "Use salary + benefits + overhead (typically 1.25–1.4× base salary). A knowledge worker earning $80,000/year costs roughly $100,000–$112,000 fully loaded, or $50–55/hour at 2,000 hours/year. Use the lower end to keep your business case conservative.",
  },
];

export default function WorkflowROIPage() {
  return (
    <>
      <JsonLd
        data={[
          APP_SCHEMA,
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
            <span className="text-white/70">Workflow ROI Calculator</span>
          </nav>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
            Free · No signup · Instant results
          </p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Workflow Automation{" "}
            <span className="text-[#6366F1]">ROI Calculator</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/60">
            Enter your manual processes and see exactly how much time and money automation
            would return — with a ready-to-present business case for finance.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-white/40">
            <span>✓ Conservative methodology</span>
            <span>✓ Fully editable assumptions</span>
            <span>✓ Payback period included</span>
          </div>
        </div>
      </section>

      {/* Interactive calculator */}
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
              { label: "SaaS Cost Calculator", href: "/tools/saas-cost-calculator" },
              { label: "Sprint Velocity Calculator", href: "/tools/sprint-velocity-calculator" },
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
