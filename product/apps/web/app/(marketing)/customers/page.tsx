import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "../../components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Customer Stories | OmniOS — How Teams Replace Their Entire SaaS Stack",
  description:
    "See how companies replace Notion, Salesforce, Slack, Jira, and Zapier with OmniOS. Real case studies with measurable outcomes: hours saved, tools retired, revenue impact.",
  keywords: [
    "OmniOS customer stories",
    "SaaS consolidation case studies",
    "replace notion salesforce slack",
    "AI workspace ROI",
    "workflow automation results",
    "OmniOS reviews",
  ],
  alternates: { canonical: "/customers" },
  openGraph: {
    title: "Customer Stories | OmniOS",
    description:
      "How teams replace their entire SaaS stack with OmniOS. Real outcomes, real numbers.",
    type: "website",
    url: "/customers",
  },
};

interface Metric {
  value: string;
  label: string;
}

interface CaseStudy {
  slug: string;
  company: string;
  industry: string;
  size: string;
  tagline: string;
  story: string;
  toolsReplaced: string[];
  metrics: Metric[];
  quote: string;
  quoteName: string;
  quoteRole: string;
  accent: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "tempo-creative",
    company: "Tempo Creative",
    industry: "Creative Agency",
    size: "22 people",
    tagline: "63% reduction in ops overhead in 6 months.",
    story:
      "Tempo Creative was drowning in tool switching. Every client project touched Notion for briefs, Asana for tasks, HubSpot for contacts, Slack for comms, and Harvest for time tracking. The ops manager spent 12 hours a week just keeping these in sync. After migrating to OmniOS, all five tools consolidated into one workspace. Automations now handle status updates, invoice generation, and client report delivery automatically.",
    toolsReplaced: ["Notion", "Asana", "HubSpot", "Slack", "Harvest"],
    metrics: [
      { value: "63%", label: "Ops time reduction" },
      { value: "840h", label: "Hours reclaimed/year" },
      { value: "5→1", label: "Tools consolidated" },
      { value: "$54K", label: "Annual SaaS savings" },
    ],
    quote:
      "I used to start every Monday reconciling five different systems. Now I open one tab and everything is already done. OmniOS is the first tool that actually reduced my workload instead of adding to it.",
    quoteName: "Sarah Chen",
    quoteRole: "Operations Manager, Tempo Creative",
    accent: "#6366F1",
  },
  {
    slug: "riverview-capital",
    company: "Riverview Capital",
    industry: "Venture Capital",
    size: "11 people",
    tagline: "Deal pipeline and LP reporting unified in one OS.",
    story:
      "A small VC firm had their deal flow in Airtable, LP communications in Gmail threads, financial models in Google Sheets, and meeting notes scattered across Notion pages. The managing partner was manually compiling quarterly LP reports that took two full days each quarter. OmniOS connected every data source and now generates their quarterly reports in 4 minutes via an automated workflow.",
    toolsReplaced: ["Airtable", "Notion", "Google Sheets", "Mailchimp"],
    metrics: [
      { value: "4 min", label: "Quarterly report generation" },
      { value: "16h", label: "Time saved per quarter" },
      { value: "100%", label: "LP data accuracy" },
      { value: "$38K", label: "Annual tool savings" },
    ],
    quote:
      "Our LP reports used to take me two full days and still had errors. Now they generate themselves on the last Friday of the quarter. I've used those two days to close two additional deals this year.",
    quoteName: "Marcus Webb",
    quoteRole: "Managing Partner, Riverview Capital",
    accent: "#D4AF37",
  },
  {
    slug: "northsun-health",
    company: "Northsun Health",
    industry: "Healthcare Technology",
    size: "47 people",
    tagline: "HIPAA-compliant AI with zero data leaving their servers.",
    story:
      "Northsun builds software for independent medical practices. Their team needed AI for documentation and internal workflows but had a hard compliance requirement: no patient-adjacent data could leave their infrastructure. OmniOS's local AI deployment meant the entire OmniMind layer ran on their own hardware — full AI capability, zero cloud data exposure.",
    toolsReplaced: ["Jira", "Confluence", "Salesforce", "Zapier"],
    metrics: [
      { value: "0", label: "Data sent to cloud AI" },
      { value: "HIPAA", label: "Compliance maintained" },
      { value: "4→1", label: "Tools consolidated" },
      { value: "91%", label: "Team AI adoption rate" },
    ],
    quote:
      "Every other AI tool was a non-starter for us because of HIPAA. OmniOS was the first solution that let us actually use AI without our legal team shutting it down immediately.",
    quoteName: "Dr. Priya Nair",
    quoteRole: "CTO, Northsun Health",
    accent: "#10B981",
  },
  {
    slug: "layer-studio",
    company: "Layer Studio",
    industry: "Product Design",
    size: "8 people",
    tagline: "A solo ops person running an agency that feels like 20.",
    story:
      "Layer Studio is a boutique product design agency where every person is a designer — no dedicated ops, no project manager. The founding designer was spending 30% of their time on non-design work: client updates, invoicing, project status reports, tool management. OmniOS automated all of it. The founding designer now spends 95% of their time designing.",
    toolsReplaced: ["Linear", "Notion", "FreshBooks", "Calendly", "Loom"],
    metrics: [
      { value: "30%→5%", label: "Time on ops work" },
      { value: "5", label: "Tools eliminated" },
      { value: "2×", label: "Client capacity increase" },
      { value: "$29K", label: "Annual tool savings" },
    ],
    quote:
      "I run an 8-person agency but I'm the only non-designer. OmniOS is my operations department. Client updates, invoicing, project tracking — it all just happens.",
    quoteName: "Alex Torres",
    quoteRole: "Founder, Layer Studio",
    accent: "#A855F7",
  },
  {
    slug: "cascade-logistics",
    company: "Cascade Logistics",
    industry: "Logistics & Supply Chain",
    size: "134 people",
    tagline: "Enterprise migration from Salesforce + Monday in 6 weeks.",
    story:
      "Cascade had Salesforce for CRM, Monday.com for project management, Slack for communications, and spreadsheets filling every gap. Reporting took days, onboarding took weeks. OmniOS replaced all four, the migration took 6 weeks with no operational downtime, and onboarding time dropped from 3 weeks to 4 days.",
    toolsReplaced: ["Salesforce", "Monday.com", "Slack", "Tableau"],
    metrics: [
      { value: "6 weeks", label: "Migration timeline" },
      { value: "3wk→4d", label: "Onboarding time" },
      { value: "$218K", label: "Annual savings" },
      { value: "4→1", label: "Systems consolidated" },
    ],
    quote:
      "Migrating off Salesforce felt impossible until we saw the OmniOS migration playbook. Six weeks later, 134 people were on one system and we'd already eliminated three reporting bottlenecks.",
    quoteName: "Jennifer Park",
    quoteRole: "VP of Operations, Cascade Logistics",
    accent: "#F59E0B",
  },
  {
    slug: "plaintext-labs",
    company: "Plaintext Labs",
    industry: "Developer Tools",
    size: "6 people",
    tagline: "From 12 tabs to one — a fully remote engineering team.",
    story:
      "Plaintext Labs is a 6-person remote team building developer tools. Their workflow was spread across Linear, Notion, Slack, GitHub, Loom, and Stripe's dashboard. Onboarding a new contractor meant provisioning 6 separate tools. OmniOS unified everything except GitHub. Provisioning now takes 3 minutes, and the team reports shipping 40% faster.",
    toolsReplaced: ["Linear", "Notion", "Slack", "Loom", "Stripe Dashboard"],
    metrics: [
      { value: "3 min", label: "New team member provisioning" },
      { value: "40%", label: "Faster shipping velocity" },
      { value: "6→1", label: "Tools consolidated" },
      { value: "$19K", label: "Annual tool savings" },
    ],
    quote:
      "We used to spend the first week of every contractor engagement just getting them set up on our tools. Now it's 3 minutes and they're in a working context. That alone paid for OmniOS.",
    quoteName: "Kai Nakamura",
    quoteRole: "Co-founder, Plaintext Labs",
    accent: "#3B82F6",
  },
];

const AGGREGATE_STATS = [
  { value: "312+", label: "Companies on OmniOS" },
  { value: "$43K", label: "Average annual SaaS savings" },
  { value: "4.8/5", label: "Average customer satisfaction" },
  { value: "94%", label: "Retention after 12 months" },
];

export default function CustomersPage() {
  return (
    <>
      <JsonLd
        data={[
          {
            "@type": "CollectionPage",
            name: "OmniOS Customer Stories",
            description:
              "Case studies showing how businesses replace their SaaS stacks with OmniOS.",
            url: "https://omnios.app/customers",
          },
        ]}
      />

      {/* Hero */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-4xl px-6 pb-14 pt-20 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
            Customer stories
          </p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Real teams.{" "}
            <span className="text-[#6366F1]">Real results.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
            See how companies across every industry consolidated their SaaS
            stacks — and what happened to their velocity, costs, and sanity
            afterward.
          </p>
        </div>
      </section>

      {/* Aggregate stats */}
      <section className="border-b border-white/5 bg-white/[0.01]">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {AGGREGATE_STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold tracking-tight text-white">{s.value}</div>
                <div className="mt-1 text-xs text-white/50">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case studies */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="space-y-16">
          {CASE_STUDIES.map((cs, i) => (
            <article
              key={cs.slug}
              className={`grid gap-10 lg:grid-cols-2 ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}
            >
              {/* Metrics panel */}
              <div
                className="rounded-2xl border p-8"
                style={{ borderColor: `${cs.accent}30`, background: `${cs.accent}08` }}
              >
                <div className="[direction:ltr]">
                  <div className="mb-6 flex flex-wrap gap-2">
                    {cs.toolsReplaced.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[11px] text-white/50 line-through"
                      >
                        {t}
                      </span>
                    ))}
                    <span
                      className="rounded-full border px-2.5 py-0.5 text-[11px] font-semibold"
                      style={{ borderColor: `${cs.accent}50`, color: cs.accent }}
                    >
                      OmniOS ✓
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {cs.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                      >
                        <div
                          className="text-2xl font-bold tracking-tight"
                          style={{ color: cs.accent }}
                        >
                          {m.value}
                        </div>
                        <div className="mt-1 text-xs text-white/50">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  <blockquote
                    className="mt-6 border-l-2 pl-4"
                    style={{ borderColor: cs.accent }}
                  >
                    <p className="text-sm italic leading-relaxed text-white/70">
                      "{cs.quote}"
                    </p>
                    <footer className="mt-3">
                      <p className="text-xs font-semibold text-white">{cs.quoteName}</p>
                      <p className="text-xs text-white/40">{cs.quoteRole}</p>
                    </footer>
                  </blockquote>
                </div>
              </div>

              {/* Story */}
              <div className="flex flex-col justify-center [direction:ltr]">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-widest text-white/40">
                    {cs.industry}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-white/20" />
                  <span className="text-xs text-white/40">{cs.size}</span>
                </div>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">
                  {cs.company}
                </h2>
                <p className="mt-1 text-base font-medium" style={{ color: cs.accent }}>
                  {cs.tagline}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-white/60">{cs.story}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 bg-[#07070C]">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Ready to write your own story?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/60">
            The average OmniOS customer replaces 4.3 tools and saves $43,000 per
            year. See what your stack is actually costing you.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/tools/saas-cost-calculator"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
            >
              Calculate your SaaS spend
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-[#6366F1] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(99,102,241,0.5),0_12px_32px_-8px_rgba(99,102,241,0.7)] transition hover:bg-[#5558E3]"
            >
              Start free →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
