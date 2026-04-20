import type { Metadata } from "next";
import Link from "next/link";
import { PricingToggle } from "./_components/pricing-toggle";

export const metadata: Metadata = {
  title: "OmniOS Pricing — From $0 to Enterprise. Replace $43K/year of SaaS.",
  description:
    "Transparent OmniOS pricing. Start free, scale to Enterprise. Plans from $20/mo. The affordable SaaS alternative that replaces Notion, Salesforce, HubSpot, QuickBooks, Asana, Zoom, and more — for one predictable price.",
  keywords: [
    "OmniOS pricing",
    "affordable SaaS alternative",
    "all-in-one software pricing",
    "AI workspace pricing",
    "replace SaaS stack",
    "SMB software pricing",
  ],
  alternates: { canonical: "https://omnios.app/pricing" },
  openGraph: {
    title: "OmniOS Pricing — The End of the SaaS Fragmentation Tax",
    description:
      "Five plans. One operating system. Replace $43,000/year of disconnected SaaS for as little as $20/month.",
    url: "https://omnios.app/pricing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OmniOS Pricing — The End of the SaaS Fragmentation Tax",
    description:
      "Five plans. One operating system. Replace $43,000/year of disconnected SaaS for as little as $20/month.",
  },
};

interface Tier {
  name: string;
  tagline: string;
  priceMonthly: number;
  priceAnnual: number;
  ctaLabel: string;
  ctaHref: string;
  highlight?: boolean;
  badge?: string;
  features: string[];
  includes: string;
}

const TIERS: Tier[] = [
  {
    name: "Solo",
    tagline: "For freelancers and independent operators.",
    priceMonthly: 20,
    priceAnnual: 18,
    ctaLabel: "Start free trial",
    ctaHref: "/register?plan=solo",
    includes: "Everything you need to run a one-person business",
    features: [
      "OmniMind AI with 500 intents/month",
      "CRM, inbox, and calendar unified",
      "Invoice automation and Stripe payouts",
      "Time tracking with auto-logging",
      "Document workspace with version history",
      "Connect 10 external apps",
      "Email + chat support",
    ],
  },
  {
    name: "Team",
    tagline: "For growing startups ready to ship faster.",
    priceMonthly: 50,
    priceAnnual: 45,
    highlight: true,
    badge: "Most popular",
    ctaLabel: "Start free trial",
    ctaHref: "/register?plan=team",
    includes: "Up to 5 seats, every Solo feature, plus:",
    features: [
      "OmniMind AI with 5,000 intents/month",
      "Sprint generation and task orchestration",
      "Shared CRM with pipeline automation",
      "Real-time collaborative docs",
      "Goals, OKRs, and weekly digests",
      "Unlimited app connectors",
      "Priority support, 12-hour SLA",
    ],
  },
  {
    name: "Business",
    tagline: "For agencies and operators serving clients.",
    priceMonthly: 100,
    priceAnnual: 90,
    ctaLabel: "Start free trial",
    ctaHref: "/register?plan=business",
    includes: "Up to 15 seats, every Team feature, plus:",
    features: [
      "OmniMind AI with 25,000 intents/month",
      "White-label client portals",
      "Custom subdomain and branded email",
      "Client billing, retainers, and subscriptions",
      "Role-based permissions (admin, editor, client)",
      "Workflow automation builder",
      "Priority support, 4-hour SLA",
    ],
  },
  {
    name: "Growth",
    tagline: "For mid-market companies scaling revenue.",
    priceMonthly: 300,
    priceAnnual: 270,
    ctaLabel: "Start free trial",
    ctaHref: "/register?plan=growth",
    includes: "Up to 50 seats, every Business feature, plus:",
    features: [
      "OmniMind AI with 150,000 intents/month",
      "Advanced analytics and cohort reporting",
      "Multi-entity bookkeeping and P&L",
      "API access with 100 req/sec",
      "Custom integrations and data import",
      "Dedicated customer success manager",
      "Guaranteed 1-hour response SLA",
    ],
  },
  {
    name: "Enterprise",
    tagline: "For regulated and mission-critical organizations.",
    priceMonthly: 2000,
    priceAnnual: 1800,
    ctaLabel: "Talk to sales",
    ctaHref: "/register?plan=enterprise",
    includes: "Unlimited seats, every Growth feature, plus:",
    features: [
      "Unlimited OmniMind AI usage",
      "SAML SSO, SCIM, and directory sync",
      "HIPAA, SOC 2 Type II, and BAA on request",
      "On-premise or private-cloud deployment",
      "99.99% uptime SLA with financial credits",
      "Dedicated solution architect",
      "Custom MSA, DPA, and procurement support",
    ],
  },
];

interface Faq {
  q: string;
  a: string;
}

const FAQS: Faq[] = [
  {
    q: "Is there a free trial?",
    a: "Yes. Every paid plan starts with a 14-day free trial. No credit card required to start, and you can cancel any time before the trial ends without being charged.",
  },
  {
    q: "What does OmniOS actually replace?",
    a: "OmniOS consolidates the tools a modern business runs on: CRM (Salesforce, HubSpot), docs and wikis (Notion, Confluence), project management (Asana, Monday), meetings (Zoom, Google Meet), accounting (QuickBooks, Xero), email (Superhuman), and analytics (Mixpanel, Amplitude). Teams typically retire 7 to 14 tools within their first 90 days.",
  },
  {
    q: "How much will I actually save?",
    a: "The average team that migrates from a fragmented stack to OmniOS Team or Business reports $3,487/month in direct SaaS savings, plus an additional 11 hours per employee per week reclaimed from context-switching and duplicate data entry.",
  },
  {
    q: "Can I change plans later?",
    a: "Yes. Upgrade instantly and we only charge the prorated difference. Downgrade at the end of your current billing cycle. Your data, workflows, and history stay intact.",
  },
  {
    q: "How does annual billing work?",
    a: "Pick the annual cycle and we charge the full year up front at a 10 percent discount. You can still add or remove seats at any time, and unused seats are credited to your next invoice.",
  },
  {
    q: "Do you offer a money-back guarantee?",
    a: "Yes. We offer an unconditional 30-day money-back guarantee on every paid plan. If OmniOS does not save you time and money in the first month, email support@omnios.app and we refund every dollar. No retention call. No paperwork.",
  },
  {
    q: "What counts as an 'intent'?",
    a: "An intent is one natural-language instruction that OmniMind acts on. 'Send the Q3 proposal to every deal in Stage 3' is one intent. Routine reads, lookups, and UI navigation do not count. Most Team users use under 1,200 intents a month.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. OmniOS is SOC 2 Type II certified, encrypts all data at rest with AES-256 and in transit with TLS 1.3, and stores customer data in isolated tenants. Enterprise customers can deploy in their own VPC or on-premise.",
  },
  {
    q: "Do you offer non-profit or education discounts?",
    a: "Yes. Verified non-profits, educational institutions, and accredited journalism organizations receive 50 percent off any plan. Contact support@omnios.app with proof of status.",
  },
  {
    q: "What happens if I exceed my intent quota?",
    a: "Nothing breaks. Intents beyond your quota are billed at $0.008 each, capped at 2x your plan price for the month so you can never be surprised by a bill. You can also hard-cap usage from your admin console.",
  },
  {
    q: "How do I cancel?",
    a: "One click from Settings > Billing. No retention queue, no confirmation emails, no dark patterns. You keep access through the end of your current billing period and can export all of your data to JSON, CSV, or Markdown at any time.",
  },
  {
    q: "Do you support custom procurement and MSAs?",
    a: "Yes, on Enterprise plans. We accept custom MSAs, DPAs, and BAAs, and support procurement through Vanta, Drata, and major RFP platforms. Typical contract turnaround is under 10 business days.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "OmniOS",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, macOS, Windows, Linux, iOS, Android",
  description:
    "OmniOS is the AI-powered business platform that replaces $43,000/year of disconnected SaaS with one unified AI-native workspace.",
  url: "https://omnios.app",
  provider: {
    "@type": "Organization",
    name: "OmniOS, Inc.",
    url: "https://omnios.app",
  },
  offers: TIERS.map((tier) => ({
    "@type": "Offer",
    name: `OmniOS ${tier.name}`,
    price: tier.priceMonthly.toString(),
    priceCurrency: "USD",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: tier.priceMonthly.toString(),
      priceCurrency: "USD",
      unitCode: "MON",
      referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
    },
    availability: "https://schema.org/InStock",
    url: `https://omnios.app${tier.ctaHref}`,
  })),
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "1043",
  },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <section className="relative overflow-hidden border-b border-white/5">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.18),transparent_60%)]"
        />
        <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-12 text-center sm:pt-32">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-[#D4AF37]">
            <span aria-hidden="true">◆</span> Join 1,000+ teams already saving
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">
            Replace your entire SaaS stack. Pay for one product.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
            Transparent pricing, no per-module upsells, no annual contracts required.
            Start free, scale to Enterprise. Cancel in one click, any day, no questions asked.
          </p>

          <div className="mt-10">
            <div className="mx-auto inline-flex items-center gap-3 rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 px-5 py-2.5 text-sm">
              <span aria-hidden="true" className="text-[#D4AF37]">$</span>
              <span className="text-white">
                Average team saves{" "}
                <span className="font-semibold text-[#D4AF37]">$3,487/month</span>{" "}
                vs their current stack
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 pt-16">
        <PricingToggle tiers={TIERS} />

        <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-[#13131A] p-6 text-center md:flex-row md:justify-center md:gap-8 md:text-left">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AF37]/15 text-xl text-[#D4AF37]">
            ◉
          </span>
          <div>
            <p className="text-sm font-semibold">30-day money-back guarantee</p>
            <p className="text-xs text-white/50">
              No retention call. No paperwork. If OmniOS does not earn its keep, we refund every dollar.
            </p>
          </div>
          <div className="hidden h-8 w-px bg-white/10 md:block" />
          <div>
            <p className="text-sm font-semibold">Powered by Stripe</p>
            <p className="text-xs text-white/50">
              Secure checkout, SCA-compliant, supports 135+ currencies.
            </p>
          </div>
          <div className="hidden h-8 w-px bg-white/10 md:block" />
          <div>
            <p className="text-sm font-semibold">Cancel any time</p>
            <p className="text-xs text-white/50">
              One click from your settings. Your data is always exportable.
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="comparison-heading"
        className="border-y border-white/5 bg-[#07070C] py-20"
      >
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2
              id="comparison-heading"
              className="text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              What a typical team is paying now
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/60">
              The SaaS fragmentation tax is real. Here is the math for a 10-person team,
              pulled from anonymized migration data across our first 1,000 customers.
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#13131A] text-xs uppercase tracking-[0.12em] text-white/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Tool category</th>
                  <th className="px-6 py-4 font-medium">Typical vendor</th>
                  <th className="px-6 py-4 text-right font-medium">Per month, 10 seats</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  ["CRM", "Salesforce Sales Cloud", "$1,650"],
                  ["Docs + wiki", "Notion Business", "$180"],
                  ["Project management", "Asana Advanced", "$249"],
                  ["Accounting", "QuickBooks Advanced", "$235"],
                  ["Analytics", "Mixpanel Growth", "$420"],
                  ["Meetings", "Zoom Business", "$199"],
                  ["Inbox", "Superhuman", "$300"],
                  ["Forms + automations", "Zapier + Typeform", "$354"],
                ].map(([cat, vendor, price]) => (
                  <tr key={cat} className="bg-[#0A0A0F]/40">
                    <td className="px-6 py-4 font-medium text-white">{cat}</td>
                    <td className="px-6 py-4 text-white/60">{vendor}</td>
                    <td className="px-6 py-4 text-right text-white/70 tabular-nums">{price}</td>
                  </tr>
                ))}
                <tr className="bg-[#6366F1]/5">
                  <td className="px-6 py-4 font-semibold">Total</td>
                  <td className="px-6 py-4 text-white/60">Eight vendors, one blank look at the bill</td>
                  <td className="px-6 py-4 text-right text-lg font-semibold tabular-nums text-white">
                    $3,587/mo
                  </td>
                </tr>
                <tr className="bg-[#D4AF37]/10">
                  <td className="px-6 py-4 font-semibold text-[#D4AF37]">OmniOS Team (10 seats)</td>
                  <td className="px-6 py-4 text-white/60">One product, one login, one bill</td>
                  <td className="px-6 py-4 text-right text-lg font-semibold tabular-nums text-[#D4AF37]">
                    $100/mo
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-center text-xs text-white/40">
            Pricing reflects public list prices as of Q1 2026. Actual enterprise quotes vary.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="faq-heading"
        className="mx-auto max-w-4xl px-6 py-24"
      >
        <div className="text-center">
          <h2 id="faq-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Pricing and billing questions
          </h2>
          <p className="mt-4 text-white/60">
            Still unsure? Email{" "}
            <a
              href="mailto:sales@omnios.app"
              className="text-[#818CF8] underline-offset-4 hover:underline"
            >
              sales@omnios.app
            </a>{" "}
            and a human responds within 4 hours, weekdays and weekends.
          </p>
        </div>

        <dl className="mt-12 divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-[#13131A]">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group px-6 py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <dt className="text-base font-medium text-white">{faq.q}</dt>
                <span
                  aria-hidden="true"
                  className="mt-1 text-white/40 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <dd className="mt-3 text-sm leading-relaxed text-white/60">{faq.a}</dd>
            </details>
          ))}
        </dl>
      </section>

      <section className="border-t border-white/5 bg-gradient-to-b from-[#0A0A0F] to-[#07070C] py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Start free. Keep what works. Refund everything if it doesn't.
          </h2>
          <p className="mt-4 text-white/60">
            Every paid plan includes a 14-day free trial and a 30-day money-back guarantee.
            You have nothing to risk and a $43K/year stack to retire.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-[#6366F1] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(99,102,241,0.6)] transition-all hover:bg-[#5558E3]"
            >
              Start your free trial
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              See how we compare
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
