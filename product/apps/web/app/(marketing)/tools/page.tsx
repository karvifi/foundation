import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Business Tools & SaaS Calculators | OmniOS",
  description:
    "Free, no-signup tools for founders and operators: SaaS cost calculator, workflow ROI, AI readiness, and sprint velocity. Built by the OmniOS team.",
  keywords: [
    "free business tools",
    "SaaS tools",
    "SaaS cost calculator",
    "workflow ROI calculator",
    "AI readiness assessment",
    "sprint velocity calculator",
  ],
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "Free Business Tools & SaaS Calculators | OmniOS",
    description:
      "Free, no-signup tools for founders and operators. SaaS cost calculator, workflow ROI, AI readiness, and more.",
    type: "website",
    url: "/tools",
  },
};

interface ToolCard {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  tag: string;
  available: boolean;
  href?: string;
}

const TOOLS: ReadonlyArray<ToolCard> = [
  {
    slug: "saas-cost-calculator",
    title: "SaaS Cost Calculator",
    tagline: "Find out what you're overpaying.",
    description:
      "Add your stack (Notion, Slack, HubSpot, Salesforce, 12 more pre-loaded) and see your real monthly and annual SaaS bill — plus what you'd save by consolidating on OmniOS.",
    tag: "Finance",
    available: true,
    href: "/tools/saas-cost-calculator",
  },
  {
    slug: "workflow-roi-calculator",
    title: "Workflow ROI Calculator",
    tagline: "Quantify the cost of manual work.",
    description:
      "Map any repetitive process — onboarding, invoicing, reporting — and see exactly how much time and money automation would return. Great for making the business case to finance.",
    tag: "Operations",
    available: true,
    href: "/tools/workflow-roi-calculator",
  },
  {
    slug: "ai-readiness-assessment",
    title: "AI Readiness Assessment",
    tagline: "Is your team actually ready for AI?",
    description:
      "A 10-question self-assessment across data quality, tool sprawl, governance, and team skill. Get a scored report and a prioritized action list instantly.",
    tag: "Strategy",
    available: true,
    href: "/tools/ai-readiness-assessment",
  },
  {
    slug: "sprint-velocity-calculator",
    title: "Sprint Velocity Calculator",
    tagline: "Plan sprints without the guesswork.",
    description:
      "Enter recent sprint history and get conservative, realistic, and optimistic commitment recommendations — with over-commitment risk warnings built in.",
    tag: "Engineering",
    available: true,
    href: "/tools/sprint-velocity-calculator",
  },
];

export default function ToolsHubPage() {
  return (
    <>
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-4xl px-6 pb-14 pt-20 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
            Free tools
          </p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Tools we wish existed —{" "}
            <span className="text-[#D4AF37]">so we built them.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
            No signup. No email wall. No spam. Just fast, opinionated
            calculators for the decisions operators actually make.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <ul className="grid gap-6 md:grid-cols-2">
          {TOOLS.map((tool) => (
            <li key={tool.slug}>
              <ToolCardView tool={tool} />
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-white/5 bg-[#07070C]">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Have a tool you wish existed?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/60">
            We build one new free tool every month based on what readers ask
            for. Tell us what would save your team the most time.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:hello@omnios.app?subject=Tool%20request"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
            >
              Suggest a tool
            </a>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-[#6366F1] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(99,102,241,0.5),0_12px_32px_-8px_rgba(99,102,241,0.7)] transition hover:bg-[#5558E3]"
            >
              Try OmniOS free
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

interface ToolCardViewProps {
  tool: ToolCard;
}

function ToolCardView({ tool }: ToolCardViewProps) {
  const cardClass =
    "group relative flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition";

  const body = (
    <>
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
            {tool.tag}
          </span>
          {tool.available ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#D4AF37]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
              Live
            </span>
          ) : (
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/30">
              Coming soon
            </span>
          )}
        </div>

        <h3 className="mt-6 text-xl font-semibold tracking-tight text-white">
          {tool.title}
        </h3>
        <p className="mt-1 text-sm font-medium text-[#D4AF37]">
          {tool.tagline}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-white/60">
          {tool.description}
        </p>
      </div>

      <div className="mt-8 flex items-center justify-between">
        {tool.available ? (
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-white transition group-hover:text-[#6366F1]">
            Open calculator
            <span aria-hidden="true">→</span>
          </span>
        ) : (
          <span className="text-sm text-white/30">Notify me when ready</span>
        )}
      </div>
    </>
  );

  if (tool.available && tool.href) {
    return (
      <Link
        href={tool.href}
        className={`${cardClass} hover:border-[#6366F1]/40 hover:bg-white/[0.04]`}
      >
        {body}
      </Link>
    );
  }

  return (
    <div className={`${cardClass} opacity-70`} aria-disabled="true">
      {body}
    </div>
  );
}
