import type { Metadata } from "next";
import Link from "next/link";

interface CompetitorCard {
  slug: string;
  name: string;
  category: string;
  priceLabel: string;
  pitch: string;
  savings: string;
  accent: string;
}

const COMPETITORS: ReadonlyArray<CompetitorCard> = [
  {
    slug: "notion",
    name: "Notion",
    category: "Docs + wiki",
    priceLabel: "$16 per user / month",
    pitch:
      "Notion stops at documents. OmniOS ships the CRM, inbox, finance, and analytics that should have been inside the doc the whole time.",
    savings: "Save $2,304/yr on a 12-seat team.",
    accent: "#E5E5E5",
  },
  {
    slug: "zapier",
    name: "Zapier",
    category: "Workflow glue",
    priceLabel: "from $49 / month",
    pitch:
      "Zapier is plumbing between broken tools. OmniOS is the tool those zaps were trying to simulate — native graph, one context, zero per-task billing.",
    savings: "Save $2,700/yr plus task overages.",
    accent: "#FF4A00",
  },
  {
    slug: "linear",
    name: "Linear",
    category: "Issue tracker",
    priceLabel: "$8 per user / month",
    pitch:
      "Linear is a beautiful tracker inside a company that lives everywhere else. OmniOS tracks issues next to the customer, the revenue, and the code.",
    savings: "Save $1,056/yr on a 12-seat team.",
    accent: "#5E6AD2",
  },
  {
    slug: "hubspot",
    name: "HubSpot",
    category: "Marketing + sales CRM",
    priceLabel: "from $450 / month (5 users)",
    pitch:
      "HubSpot charges enterprise money for what is fundamentally a contact database with email. OmniOS gives you the CRM plus the product for a flat $99.",
    savings: "Save $4,212/yr on the Starter comparison alone.",
    accent: "#FF7A59",
  },
  {
    slug: "airtable",
    name: "Airtable",
    category: "Spreadsheet DB",
    priceLabel: "$20 per user / month",
    pitch:
      "Airtable is a spreadsheet that wants to be software. OmniOS is the software your spreadsheet was trying to become — no blocks, no interfaces, no Pro tier roulette.",
    savings: "Save $2,712/yr on a 12-seat team.",
    accent: "#F9A825",
  },
  {
    slug: "monday",
    name: "Monday",
    category: "Work OS",
    priceLabel: "$9 per user / month",
    pitch:
      "Monday colors tasks. OmniOS runs the entire business behind the task — intake, revenue, delivery, reporting — without stitching ten products together.",
    savings: "Save $1,188/yr on a 12-seat team.",
    accent: "#FF3D57",
  },
  {
    slug: "asana",
    name: "Asana",
    category: "Project tracker",
    priceLabel: "$10.99 per user / month",
    pitch:
      "Asana asks you to rebuild your company in projects and tasks. OmniOS models your company as it actually runs, then renders projects on top of that.",
    savings: "Save $1,483/yr on a 12-seat team.",
    accent: "#F06A6A",
  },
  {
    slug: "jira",
    name: "Jira",
    category: "Engineering tracker",
    priceLabel: "$7.75 per user / month",
    pitch:
      "Jira punishes engineers with configuration. OmniOS gives you issue tracking, code context, deploys, and the customer complaint that caused the ticket — in one surface.",
    savings: "Save $1,044/yr on a 12-seat team.",
    accent: "#0052CC",
  },
  {
    slug: "salesforce",
    name: "Salesforce",
    category: "Enterprise CRM",
    priceLabel: "from $25 per user / month",
    pitch:
      "Salesforce requires a consultant before the first lead is logged. OmniOS compiles your pipeline in 90 seconds from one sentence of intent.",
    savings: "Save $3,300/yr on a 12-seat team — before implementation costs.",
    accent: "#00A1E0",
  },
  {
    slug: "n8n",
    name: "n8n",
    category: "Self-hosted automation",
    priceLabel: "$20 / month (cloud starter)",
    pitch:
      "n8n is a workflow canvas bolted onto someone else's app. OmniOS is the app, the canvas, and the AI that writes the workflow from an English sentence.",
    savings: "Save $240/yr plus the ops cost of self-hosting.",
    accent: "#EA4B71",
  },
];

export const metadata: Metadata = {
  title: "OmniOS Alternatives: The Best SaaS Replacement for 2026",
  description:
    "Compare OmniOS to Notion, Zapier, Linear, HubSpot, Airtable, Monday, Asana, Jira, Salesforce and n8n. One AI-native OS replaces $43,000/year of disconnected SaaS for $99/month.",
  keywords: [
    "OmniOS alternatives",
    "best SaaS replacement",
    "Notion alternative",
    "Zapier alternative",
    "HubSpot alternative",
    "Salesforce alternative",
    "Linear alternative",
    "Airtable alternative",
    "Monday alternative",
    "Asana alternative",
    "Jira alternative",
    "n8n alternative",
    "replace SaaS stack",
    "all-in-one workspace",
  ],
  alternates: {
    canonical: "https://omnios.app/compare",
  },
  openGraph: {
    type: "website",
    url: "https://omnios.app/compare",
    siteName: "OmniOS",
    title: "OmniOS Alternatives: Replace Your Entire SaaS Stack for $99/Month",
    description:
      "Side-by-side comparisons against the 10 tools OmniOS replaces. See pricing, migration paths, and the $43,000/year case for switching.",
    images: [
      {
        url: "/og-compare.png",
        width: 1200,
        height: 630,
        alt: "OmniOS versus Notion, Salesforce, HubSpot, Linear and more",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OmniOS Alternatives: Replace Your Entire SaaS Stack for $99/Month",
    description:
      "Compare OmniOS to the 10 biggest SaaS tools. $43,000/year replaced by a single AI-native OS.",
    images: ["/og-compare.png"],
  },
};

/**
 * Serialize a statically-defined object for inclusion in a JSON-LD script
 * element. Escapes any sequences that could let the payload escape the
 * script context. All inputs here are compile-time constants, but the
 * hardening is retained for defense in depth.
 */
function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export default function CompareHubPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "OmniOS alternatives and comparisons",
    description:
      "Comparisons between OmniOS and the ten most common SaaS tools it replaces.",
    itemListElement: COMPETITORS.map((competitor, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `OmniOS vs ${competitor.name}`,
      url: `https://omnios.app/compare/${competitor.slug}`,
    })),
  };

  return (
    <>
      {/*
        JSON-LD is rendered as React text children. React text-encodes all
        strings, and since browsers parse application/ld+json as JSON rather
        than HTML, this path eliminates any XSS surface. serializeJsonLd also
        escapes script-context-breaking sequences for defense in depth.
      */}
      <script type="application/ld+json">
        {serializeJsonLd(itemListJsonLd)}
      </script>

      <section className="relative overflow-hidden border-b border-white/5">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(99,102,241,0.18),transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6366F1]/40 to-transparent"
        />

        <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-24 text-center sm:pt-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
            The SaaS consolidation play
          </div>

          <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            Ten tools.{" "}
            <span className="bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#D4AF37] bg-clip-text text-transparent">
              One OS.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">
            The average scaling company burns $43,000 a year stitching Notion,
            Zapier, Salesforce, HubSpot, Linear, Jira, Asana, Monday, Airtable
            and n8n together. OmniOS replaces the entire stack for $99/month —
            and the AI Graph Compiler assembles it in 90 seconds.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-[#6366F1] px-6 py-3 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(99,102,241,0.4),0_12px_32px_-8px_rgba(99,102,241,0.8)] transition-all hover:bg-[#5558E3]"
            >
              Start free — replace one tool this week
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.06]"
            >
              See pricing
            </Link>
          </div>

          <dl className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-8 border-t border-white/5 pt-12 sm:grid-cols-4">
            {[
              { label: "Tools replaced", value: "10+" },
              { label: "Annual savings", value: "$43K" },
              { label: "Flat price", value: "$99" },
              { label: "Time to value", value: "90s" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="text-xs uppercase tracking-[0.14em] text-white/40">
                  {stat.label}
                </dt>
                <dd className="mt-2 text-3xl font-semibold tracking-tight text-white">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#D4AF37]">
              Head-to-head
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Pick the tool you are paying too much for.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-white/50">
            Each page includes a cost calculator, an 8-point feature table, a
            migration playbook, and a customer story from a team that already
            switched.
          </p>
        </div>

        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {COMPETITORS.map((competitor) => (
            <li key={competitor.slug}>
              <Link
                href={`/compare/${competitor.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:-translate-y-1 hover:border-[#6366F1]/40 hover:bg-white/[0.04] hover:shadow-[0_24px_60px_-20px_rgba(99,102,241,0.4)]"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px opacity-50"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${competitor.accent}, transparent)`,
                  }}
                />

                <div className="flex items-center justify-between">
                  <span
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-base font-semibold text-black"
                    style={{ backgroundColor: competitor.accent }}
                  >
                    {competitor.name.charAt(0)}
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/40">
                    {competitor.category}
                  </span>
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-semibold tracking-tight text-white">
                    OmniOS vs {competitor.name}
                  </h3>
                  <p className="mt-1 text-sm text-white/40">
                    {competitor.priceLabel}
                  </p>
                </div>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-white/65">
                  {competitor.pitch}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="text-xs font-medium text-[#D4AF37]">
                    {competitor.savings}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-[#6366F1] transition-transform group-hover:translate-x-1">
                    Read comparison
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-white/5 bg-[#07070C]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#D4AF37]">
              The real cost of your stack
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              It is not the subscriptions. It is the seams between them.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/60">
              Your team loses ninety minutes a day context-switching between
              tools that do not share a model of your business. Zapier exists
              because your tools do not. Meetings exist because your dashboards
              do not agree. OmniOS removes the seams, and with them, the
              overhead.
            </p>
            <Link
              href="/blog/the-hidden-cost-of-the-average-saas-stack"
              className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-[#6366F1] hover:text-[#8B5CF6]"
            >
              Read the full cost breakdown
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <dl className="grid grid-cols-2 gap-6">
            {[
              { label: "Avg SaaS tools per scaling team", value: "87" },
              { label: "Avg annual spend on those tools", value: "$43,000" },
              { label: "Hours/week lost to context switching", value: "7.5" },
              { label: "OmniOS flat monthly price", value: "$99" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-6"
              >
                <dt className="text-xs uppercase tracking-[0.14em] text-white/40">
                  {item.label}
                </dt>
                <dd className="mt-2 text-3xl font-semibold tracking-tight">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(99,102,241,0.15),transparent_70%)]"
        />
        <div className="relative mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
          <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Stop renewing. Start consolidating.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/60">
            Point OmniOS at one tool you are sick of. In a single afternoon
            you will have a replacement you actually prefer — with the data
            migrated, the workflows recompiled, and your bill cut.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-[#6366F1] px-6 py-3 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(99,102,241,0.4),0_12px_32px_-8px_rgba(99,102,241,0.8)] transition-all hover:bg-[#5558E3]"
            >
              Start free trial
              <span aria-hidden="true">→</span>
            </Link>
            <a
              href="mailto:sales@omnios.app"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.06]"
            >
              Talk to a founder
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
