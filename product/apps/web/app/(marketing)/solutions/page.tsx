import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Solutions — OmniOS for every team size | OmniOS",
  description:
    "From freelancers to the Fortune 500. One OS, tuned to how your team actually works. Freelancer, Startup, Agency, and Enterprise solutions.",
  openGraph: {
    title: "OmniOS for every team size.",
    description:
      "Freelancers replace 8 tools. Startups move 2x faster. Agencies manage clients like never before. Enterprises scale securely.",
  },
};

interface Solution {
  slug: string;
  eyebrow: string;
  name: string;
  headline: string;
  price: string;
  priceUnit: string;
  benefits: readonly string[];
  accent: "primary" | "gold";
}

interface Testimonial {
  segment: string;
  quote: string;
  author: string;
  role: string;
}

interface RoiRow {
  metric: string;
  freelancer: string;
  startup: string;
  agency: string;
  enterprise: string;
}

const SOLUTIONS: readonly Solution[] = [
  {
    slug: "freelancers",
    eyebrow: "Solo operators",
    name: "Freelancers",
    headline: "Replace 8 tools with 1.",
    price: "$19",
    priceUnit: "/ month",
    benefits: [
      "Inbox, Calendar, Docs, Invoices, CRM in one place",
      "AI assistant that drafts proposals and follow-ups",
      "Client portals with white-labeling",
      "Unlimited projects, 2 team seats when you scale",
    ],
    accent: "primary",
  },
  {
    slug: "startups",
    eyebrow: "Early-stage teams",
    name: "Startups",
    headline: "Move 2x faster.",
    price: "$49",
    priceUnit: "/ workspace / month",
    benefits: [
      "Every module, every integration, every AI feature",
      "Pipeline → invoicing → runway in a single graph",
      "OmniFlow automation with AI reasoning steps",
      "Credits for the first 10 seats",
    ],
    accent: "gold",
  },
  {
    slug: "agencies",
    eyebrow: "Client services",
    name: "Agencies",
    headline: "Manage clients like never before.",
    price: "$89",
    priceUnit: "/ workspace / month",
    benefits: [
      "Per-client workspaces with branded portals",
      "Time tracking, retainers, and profitability baked in",
      "Cross-client dashboards for agency leadership",
      "Guest collaborators at zero seat cost",
    ],
    accent: "primary",
  },
  {
    slug: "enterprises",
    eyebrow: "2,000+ seats",
    name: "Enterprises",
    headline: "Security-first. At scale.",
    price: "Custom",
    priceUnit: "annual contract",
    benefits: [
      "SSO, SCIM, custom roles, audit log streaming",
      "On-prem / VPC / air-gapped OmniMind deployment",
      "Dedicated CSM + white-glove migration",
      "99.99% SLA, region pinning, FedRAMP-ready",
    ],
    accent: "gold",
  },
];

const TESTIMONIALS: readonly Testimonial[] = [
  {
    segment: "Freelancer",
    quote:
      "I cancelled seven subscriptions the week I switched. OmniOS paid for itself in month one, and I finally stopped dropping invoices through the cracks.",
    author: "Priya Anand",
    role: "Independent product designer",
  },
  {
    segment: "Startup",
    quote:
      "We onboarded ten new engineers and our first enterprise customer in the same quarter — entirely inside OmniOS. Context travels with the work.",
    author: "Diego Marin",
    role: "CEO, Lattice Compute (Seed → Series A)",
  },
  {
    segment: "Agency",
    quote:
      "Client workspaces, retainers, approvals, and reporting are finally in one system. Margin visibility went from quarterly guesswork to a live dashboard.",
    author: "Hannah Yoon",
    role: "Managing Partner, Northlight Studio",
  },
  {
    segment: "Enterprise",
    quote:
      "Running OmniMind inside our VPC was the unlock. Zero data egress, our own models, and the security team signed off in two weeks.",
    author: "Rahul Venkatesan",
    role: "SVP Engineering, Aperture Industries",
  },
];

const ROI_ROWS: readonly RoiRow[] = [
  { metric: "Tools replaced", freelancer: "8", startup: "14", agency: "17", enterprise: "22+" },
  { metric: "Monthly SaaS savings", freelancer: "~$240", startup: "~$3.1K", agency: "~$8.4K", enterprise: "~$180K" },
  { metric: "Hours saved / seat / week", freelancer: "6", startup: "9", agency: "11", enterprise: "13" },
  { metric: "Time-to-value", freelancer: "1 day", startup: "1 week", agency: "2 weeks", enterprise: "30 days" },
  { metric: "Typical payback period", freelancer: "< 1 month", startup: "6 weeks", agency: "2 months", enterprise: "1 quarter" },
];

function AccentBar({ accent }: { accent: Solution["accent"] }) {
  const color = accent === "gold" ? "#D4AF37" : "#6366F1";
  return (
    <div
      aria-hidden
      className="absolute inset-x-0 top-0 h-px"
      style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
    />
  );
}

export default function SolutionsPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0F] text-neutral-200 antialiased selection:bg-[#6366F1]/30 selection:text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(212,175,55,0.18), transparent 65%), radial-gradient(ellipse 60% 40% at 20% 20%, rgba(99,102,241,0.25), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 pt-32 pb-40 lg:px-10">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
            <span className="h-px w-10 bg-[#D4AF37]/60" />
            Solutions
          </div>
          <h1 className="mt-8 max-w-5xl font-serif text-5xl font-light leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-8xl">
            OmniOS for
            <br />
            <span className="bg-gradient-to-r from-white to-[#D4AF37] bg-clip-text text-transparent">
              every team size.
            </span>
          </h1>
          <p className="mt-10 max-w-2xl text-lg leading-relaxed text-neutral-400">
            One OS. Four shapes. Tuned to how you actually operate — from the first invoice to the ten-thousandth
            seat.
          </p>
        </div>
      </section>

      {/* Solution Cards */}
      <section className="relative border-b border-white/5 py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-2">
            {SOLUTIONS.map((s) => (
              <Link
                key={s.slug}
                href={`/solutions/${s.slug}`}
                className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d15] p-10 transition hover:border-[#6366F1]/40 hover:bg-[#10101a] lg:p-14"
              >
                <AccentBar accent={s.accent} />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl opacity-60"
                  style={{
                    background: s.accent === "gold" ? "rgba(212,175,55,0.12)" : "rgba(99,102,241,0.18)",
                  }}
                />

                <div className="relative flex items-start justify-between gap-6">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[#D4AF37]">
                      {s.eyebrow}
                    </div>
                    <div className="mt-4 font-serif text-3xl font-light text-white lg:text-4xl">{s.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-serif text-3xl font-light text-white">{s.price}</div>
                    <div className="mt-1 text-xs uppercase tracking-widest text-neutral-500">{s.priceUnit}</div>
                  </div>
                </div>

                <p className="relative mt-8 font-serif text-2xl font-light leading-snug text-neutral-200">
                  {s.headline}
                </p>

                <ul className="relative mt-10 space-y-3 border-t border-white/5 pt-8 text-sm text-neutral-300">
                  {s.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <span
                        className="mt-1.5 h-1 w-1 rounded-full"
                        style={{ background: s.accent === "gold" ? "#D4AF37" : "#6366F1" }}
                        aria-hidden
                      />
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="relative mt-10 inline-flex items-center gap-2 text-sm text-[#D4AF37] transition group-hover:gap-3">
                  Explore {s.name.toLowerCase()}
                  <span aria-hidden>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative border-b border-white/5 py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">Operators on OmniOS</div>
            <h2 className="mt-6 font-serif text-4xl font-light leading-tight text-white lg:text-5xl">
              One system. Every scale.
            </h2>
          </div>

          <div className="mt-20 grid gap-6 lg:grid-cols-2">
            {TESTIMONIALS.map((t, i) => (
              <figure
                key={t.author}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent p-10"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl"
                  style={{
                    background: i % 2 === 0 ? "rgba(99,102,241,0.12)" : "rgba(212,175,55,0.1)",
                  }}
                />
                <div className="relative flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-[#D4AF37]">
                  <span className="h-px w-8 bg-[#D4AF37]/60" />
                  {t.segment}
                </div>
                <blockquote className="relative mt-8 font-serif text-2xl font-light leading-snug text-white">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="relative mt-10 border-t border-white/5 pt-6">
                  <div className="text-sm text-white">{t.author}</div>
                  <div className="mt-1 text-xs text-neutral-500">{t.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Table */}
      <section className="relative border-b border-white/5 py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">ROI</div>
            <h2 className="mt-6 font-serif text-4xl font-light leading-tight text-white lg:text-5xl">
              The math, by segment.
            </h2>
            <p className="mt-6 text-neutral-400">
              Measured across 1,200+ customers in the first 90 days. Your numbers may vary — usually upward.
            </p>
          </div>

          <div className="mt-16 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th scope="col" className="px-6 py-5 font-normal text-neutral-500">Metric</th>
                  <th scope="col" className="px-6 py-5 font-normal text-neutral-300">Freelancer</th>
                  <th scope="col" className="px-6 py-5 font-normal text-neutral-300">Startup</th>
                  <th scope="col" className="px-6 py-5 font-normal text-neutral-300">Agency</th>
                  <th scope="col" className="px-6 py-5 font-medium text-[#D4AF37]">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {ROI_ROWS.map((r, i) => (
                  <tr key={r.metric} className={i % 2 === 0 ? "bg-transparent" : "bg-white/[0.01]"}>
                    <td className="border-t border-white/5 px-6 py-5 text-neutral-200">{r.metric}</td>
                    <td className="border-t border-white/5 px-6 py-5 text-neutral-300">{r.freelancer}</td>
                    <td className="border-t border-white/5 px-6 py-5 text-neutral-300">{r.startup}</td>
                    <td className="border-t border-white/5 px-6 py-5 text-neutral-300">{r.agency}</td>
                    <td className="border-t border-white/5 px-6 py-5 font-medium text-white">{r.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-20 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-[#6366F1] px-8 py-4 text-sm font-medium text-white shadow-[0_0_40px_-10px_#6366F1]"
            >
              Start free →
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/5 px-8 py-4 text-sm text-[#D4AF37]"
            >
              Talk to solutions
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
