import type { Metadata } from "next";
import Link from "next/link";

import Calculator from "./_components/Calculator";

export const metadata: Metadata = {
  title:
    "Free SaaS Cost Calculator: Find Out What You're Overpaying (2025)",
  description:
    "Calculate your total SaaS spend in 60 seconds. See exactly how much you could save by switching to OmniOS.",
  alternates: {
    canonical: "/tools/saas-cost-calculator",
  },
  openGraph: {
    title:
      "Free SaaS Cost Calculator: Find Out What You're Overpaying (2025)",
    description:
      "Calculate your total SaaS spend in 60 seconds. See exactly how much you could save by switching to OmniOS.",
    type: "website",
    url: "/tools/saas-cost-calculator",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Free SaaS Cost Calculator: Find Out What You're Overpaying (2025)",
    description:
      "Calculate your total SaaS spend in 60 seconds. See exactly how much you could save by switching to OmniOS.",
  },
};

const JSON_LD_WEB_APP = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SaaS Cost Calculator",
  url: "https://omnios.app/tools/saas-cost-calculator",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Free calculator to estimate your team's total SaaS spend across Notion, Slack, HubSpot, Jira, Salesforce, Zoom and more. See how much you could save by consolidating onto OmniOS.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  creator: {
    "@type": "Organization",
    name: "OmniOS, Inc.",
    url: "https://omnios.app",
  },
  featureList: [
    "15 pre-loaded SaaS tools with current 2025 pricing",
    "Per-seat and flat-fee pricing modes",
    "Custom tool entry",
    "Monthly and annual cost breakdown",
    "Savings vs OmniOS consolidation",
  ],
} as const;

// JSON.stringify on a static, fully-controlled literal with no user input.
// This is the Next.js-documented pattern for embedding JSON-LD structured data.
const JSON_LD_STRING = JSON.stringify(JSON_LD_WEB_APP);

export default function SaasCostCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- static JSON-LD, no user input
        dangerouslySetInnerHTML={{ __html: JSON_LD_STRING }}
      />

      <section className="border-b border-white/5">
        <div className="mx-auto max-w-5xl px-6 pb-10 pt-20 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
            Free · No signup required
          </p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            How much are you <span className="text-[#D4AF37]">overpaying</span>{" "}
            for SaaS?
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
            The average SMB wastes{" "}
            <span className="font-semibold text-white">$3,487/month</span> on
            fragmented, overlapping SaaS tools. Run the numbers in 60 seconds
            and see what it&apos;s costing you.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/40">
            <span>15 tools pre-loaded</span>
            <span aria-hidden="true">·</span>
            <span>2025 public pricing</span>
            <span aria-hidden="true">·</span>
            <span>Your data never leaves the browser</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <Calculator />
      </section>

      <section className="border-t border-white/5 bg-[#07070C]">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            The real cost of a fragmented SaaS stack
          </h2>
          <div className="mt-8 space-y-6 text-base leading-relaxed text-white/70">
            <p>
              The average 10-person company now pays for{" "}
              <span className="font-semibold text-white">
                87 different SaaS subscriptions
              </span>
              . Most of them overlap. Notion and Confluence. Asana and Linear.
              Salesforce and HubSpot. Slack and Teams. And every one of them
              charges per seat, per month, forever.
            </p>
            <p>
              The sticker price is only half the bill. The real cost shows up
              in context switching, duplicate data entry, integration
              maintenance, onboarding time, and the mental tax of remembering
              which app holds the source of truth for any given task.
            </p>
            <p>
              Our calculator above uses{" "}
              <span className="font-semibold text-white">
                current 2025 list pricing
              </span>{" "}
              from public vendor pages. Adjust the team size slider and watch
              the per-seat tools scale linearly — Notion alone costs a
              25-person team{" "}
              <span className="font-semibold text-[#D4AF37]">$4,800/year</span>{" "}
              before anyone writes a single doc.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <StatCard
              value="$43,000"
              label="Average annual SaaS spend for a 10-person team"
            />
            <StatCard
              value="87"
              label="SaaS apps in the average mid-market stack"
            />
            <StatCard value="28%" label="Of seats go unused every month" />
          </div>

          <h3 className="mt-16 text-2xl font-semibold tracking-tight text-white">
            Why does this happen?
          </h3>
          <ul className="mt-6 space-y-4 text-base leading-relaxed text-white/70">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6366F1]" />
              <span>
                <span className="font-semibold text-white">
                  Per-seat pricing
                </span>{" "}
                punishes growth. Every new hire adds a line item to 15+ tools
                the same day.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6366F1]" />
              <span>
                <span className="font-semibold text-white">Feature creep</span>{" "}
                pushes every tool toward the same product. Notion ships
                databases, Airtable ships docs, Slack ships lists. You end up
                paying three vendors for the same feature.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6366F1]" />
              <span>
                <span className="font-semibold text-white">Admin lock-in</span>.
                Once a team has 8 months of data in a tool, switching costs
                explode — even when the tool is the wrong fit.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6366F1]" />
              <span>
                <span className="font-semibold text-white">
                  No one owns the total
                </span>
                . Marketing owns HubSpot. Engineering owns Linear. Ops owns
                Airtable. No single person sees the combined bill until the
                CFO runs a vendor audit.
              </span>
            </li>
          </ul>

          <h3 className="mt-16 text-2xl font-semibold tracking-tight text-white">
            How OmniOS changes the math
          </h3>
          <p className="mt-4 text-base leading-relaxed text-white/70">
            OmniOS is one workspace that replaces docs, projects, CRM,
            helpdesk, automation, and analytics — priced at a flat{" "}
            <span className="font-semibold text-[#D4AF37]">$99/month</span> for
            the entire team. No per-seat tax. No integration fees. No separate
            plans for every feature you need.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-[#6366F1] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(99,102,241,0.5),0_12px_32px_-8px_rgba(99,102,241,0.7)] transition hover:bg-[#5558E3]"
            >
              Start free trial
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
            >
              See full comparison
            </Link>
          </div>

          <h3 className="mt-16 text-2xl font-semibold tracking-tight text-white">
            Frequently asked questions
          </h3>
          <dl className="mt-6 space-y-6">
            <FaqItem
              q="Where do the prices come from?"
              a="Every default price in the calculator is pulled from the vendor's public pricing page as of 2025. We use the entry business tier (e.g., HubSpot Starter, Salesforce Essentials) because that is what most teams actually buy."
            />
            <FaqItem
              q="Does OmniOS really replace all of these tools?"
              a="For most SMB and mid-market teams, yes. OmniOS covers documents, project management, CRM, helpdesk, automation, and dashboards in one workspace. Teams with heavy industry-specific needs may still keep one or two specialist tools."
            />
            <FaqItem
              q="Is the calculator accurate for enterprise pricing?"
              a="The defaults reflect self-serve list prices. If you have a negotiated enterprise contract, override the price fields with your actual line-item cost for a precise number."
            />
            <FaqItem
              q="Do you store the numbers I enter?"
              a="No. The calculator runs entirely in your browser. Nothing is sent to our servers and nothing is logged."
            />
          </dl>
        </div>
      </section>
    </>
  );
}

interface StatCardProps {
  value: string;
  label: string;
}

function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <p className="text-3xl font-bold tracking-tight text-[#D4AF37] tabular-nums">
        {value}
      </p>
      <p className="mt-2 text-sm text-white/60">{label}</p>
    </div>
  );
}

interface FaqItemProps {
  q: string;
  a: string;
}

function FaqItem({ q, a }: FaqItemProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <dt className="text-base font-semibold text-white">{q}</dt>
      <dd className="mt-2 text-sm leading-relaxed text-white/60">{a}</dd>
    </div>
  );
}
