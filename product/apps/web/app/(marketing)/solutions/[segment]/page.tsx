import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Segment = "freelancers" | "startups" | "agencies" | "enterprises";

interface SegmentData {
  slug: Segment;
  title: string;
  subtitle: string;
  kicker: string;
  plan: string;
  planPrice: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  pains: Array<{ title: string; body: string }>;
  features: Array<{ title: string; body: string }>;
  useCases: string[];
  testimonial: { quote: string; attribution: string; company: string };
  cta: { label: string; href: string };
}

const SEGMENTS: Record<Segment, SegmentData> = {
  freelancers: {
    slug: "freelancers",
    title: "Run a one-person business that looks like a team of ten.",
    subtitle:
      "OmniOS is the operating system for independents. Invoice, track time, follow up, file taxes, and close the next client — without paying for seven tools to do it.",
    kicker: "For Freelancers",
    plan: "Solo",
    planPrice: "$20/mo",
    metaTitle: "OmniOS for Freelancers — Invoicing, time tracking, CRM, in one place.",
    metaDescription:
      "The all-in-one operating system for freelancers and independent operators. Invoice automation, time tracking, CRM, and AI follow-up for $20/month. Start free.",
    keywords: [
      "OmniOS for freelancers",
      "freelancer software",
      "freelancer invoicing",
      "freelancer CRM",
      "freelancer time tracking",
      "solo business software",
    ],
    pains: [
      {
        title: "Chasing invoices instead of shipping work",
        body: "You are not a collections agency. But you spend six hours a month tracking down overdue invoices, writing polite-but-firm emails, and re-uploading the same bank detail into the same form for the fourth time.",
      },
      {
        title: "Time tracking you forget to do",
        body: "Every week you sit down on Friday and try to reconstruct where Tuesday afternoon went. You round up. You round down. You quietly lose two billable hours a week you will never invoice for.",
      },
      {
        title: "A CRM you built in a spreadsheet",
        body: "Leads live in your inbox. Follow-ups live in your calendar. Notes live in your head. Nothing talks to anything. You miss the call you meant to make last month.",
      },
      {
        title: "Seven tools, seven bills, one you",
        body: "QuickBooks, Harvest, HoneyBook, Calendly, Notion, HubSpot Free, and a Stripe dashboard you open when you feel brave. The bill is real. The sync is fake.",
      },
    ],
    features: [
      {
        title: "Invoice automation with Stripe payouts",
        body: "Log a completed project and OmniOS drafts, reviews, and sends the invoice. When the client pays, Stripe deposits the money, books the revenue, and updates your P&L. You see the notification. That is your entire job.",
      },
      {
        title: "Time tracking that tracks itself",
        body: "Auto-log time across your calendar events, the docs you edit, and the deals you work on. Review at the end of the week, approve or adjust, and bill the hours. No stopwatches. No guilt.",
      },
      {
        title: "A CRM that remembers for you",
        body: "Every email, every contract, every meeting. OmniMind watches the pipeline and says, 'You told Priya you would send the scope by Thursday. Want me to draft it?' You say yes. It is drafted.",
      },
      {
        title: "Contracts, quotes, and e-signatures",
        body: "Generate a proposal from a template, tweak the line items, and send for signature. When they sign, the project starts — tasks, time tracking, invoice schedule all wired in automatically.",
      },
    ],
    useCases: [
      "Design studio of one, billing retainer + project hybrid",
      "Independent engineering contractor, hourly with monthly caps",
      "Consultant running 6 active clients across 3 time zones",
      "Copywriter splitting output between subscriptions and one-off briefs",
    ],
    testimonial: {
      quote:
        "I stopped invoicing on Sundays. Literally the whole job of running the business just disappeared. I write, OmniOS handles the rest.",
      attribution: "Sana Qureshi",
      company: "Freelance brand strategist",
    },
    cta: { label: "Start Solo free for 14 days", href: "/register?plan=solo" },
  },
  startups: {
    slug: "startups",
    title: "Ship faster without a PM, a CRM, and six SaaS subscriptions.",
    subtitle:
      "OmniOS Team is the operating system for founders who are writing the code, closing the deals, and running the company — sometimes in the same hour. Sprints, pipeline, and the product in one place.",
    kicker: "For Startups",
    plan: "Team",
    planPrice: "$50/mo",
    metaTitle: "OmniOS for Startups — Sprint planning, CRM, and AI in one OS.",
    metaDescription:
      "The all-in-one operating system for early-stage startups. AI sprint generation, lightweight CRM, and real collaboration for $50/month. Free 14-day trial.",
    keywords: [
      "OmniOS for startups",
      "startup software",
      "startup CRM",
      "sprint planning AI",
      "early-stage productivity",
      "founder tooling",
    ],
    pains: [
      {
        title: "Context-switching tax",
        body: "You jump between Notion (specs), Linear (tickets), HubSpot (deals), Slack (everything), and a Google Doc somebody made last month and nobody can find. Each switch costs 23 minutes of focus. You switch 80 times a day.",
      },
      {
        title: "A sales pipeline held together by three reminders",
        body: "The first 30 customers live in your head, your co-founder's head, and a tab that never quite closes. Somebody dropped off at 'evaluating' three weeks ago. Nobody is quite sure who.",
      },
      {
        title: "Sprint planning that eats Monday",
        body: "Every Monday the founders draft the sprint, assign the tickets, and write the spec. By Wednesday half of it is stale. By Friday nobody remembers why a specific ticket was priority.",
      },
      {
        title: "The tooling bill is bigger than your hosting bill",
        body: "You are paying $2,400/month for software to run a six-person company that could run on one tool. It is embarrassing and real and nobody wants to say it at the investor update.",
      },
    ],
    features: [
      {
        title: "Sprint generation from one sentence",
        body: "Type 'ship the billing migration by Friday' and OmniOS drafts the sprint: tasks, owners, acceptance criteria, QA list, standup prompts. You edit. You ship. You skip the meeting.",
      },
      {
        title: "Founder-grade CRM, zero overhead",
        body: "Every email thread becomes a deal. Every deal has a next action. OmniMind watches for dormant leads and drafts the follow-up. You are selling while you are coding.",
      },
      {
        title: "Docs, tickets, and tasks that share a brain",
        body: "A spec references a ticket. A ticket references a customer. A customer references a deal. Everything is one graph. Rename something once and it updates everywhere.",
      },
      {
        title: "Weekly founder digest",
        body: "Every Friday OmniOS writes the memo: shipped, slipped, revenue, pipeline, team pulse. Five minutes of reading instead of five hours of assembling. Optionally emailed to your investors.",
      },
    ],
    useCases: [
      "Pre-seed team of 4 running weekly sprints + founder-led sales",
      "Seed-stage product company with 12 engineers and 3 GTM",
      "Solo founder running tech + sales while looking for a co-founder",
      "Accelerator cohort using OmniOS as the shared operating substrate",
    ],
    testimonial: {
      quote:
        "We replaced Linear, Notion, HubSpot, and three Slack integrations on a Sunday afternoon. Monday standup was the fastest we have had in six months.",
      attribution: "Jules Hadley",
      company: "Co-founder & CEO, Meridian Automations",
    },
    cta: { label: "Start Team free for 14 days", href: "/register?plan=team" },
  },
  agencies: {
    slug: "agencies",
    title: "White-label client portals. One bill. One brand. One source of truth.",
    subtitle:
      "OmniOS Business is the operating system for agencies. Deliver projects, bill retainers, and hand clients a portal that looks like it was built by your team — because it was.",
    kicker: "For Agencies",
    plan: "Business",
    planPrice: "$100/mo",
    metaTitle: "OmniOS for Agencies — White-label portals, retainers, and client delivery.",
    metaDescription:
      "The operating system for creative, development, and marketing agencies. White-label client portals, retainer billing, and delivery tracking for $100/month.",
    keywords: [
      "OmniOS for agencies",
      "agency software",
      "white-label client portal",
      "agency project management",
      "agency retainer billing",
      "creative agency operations",
    ],
    pains: [
      {
        title: "Clients live in a maze of tools",
        body: "Figma for design, Google Drive for assets, Basecamp for comms, Notion for wikis, QuickBooks for invoices. Every new client costs you a half-day of tool-access provisioning and a password doc.",
      },
      {
        title: "Retainer scope creep you cannot see",
        body: "A client on a 40-hour retainer has used 56. You find out at the end of the month. You either eat it or have an awkward conversation. You do both, in alternating months.",
      },
      {
        title: "Deliverables that feel unfinished",
        body: "You hand off a project and the client gets a zip file and three email threads. The polish ends at the deliverable. The experience should extend to the handoff.",
      },
      {
        title: "Referring a client to 'your PM' when the PM is you",
        body: "Agencies under 30 people wear ten hats. Ops is the hat that slips.",
      },
    ],
    features: [
      {
        title: "White-label client portal on your subdomain",
        body: "clients.youragency.com. Your logo. Your colors. Your email domain. Clients log in, see active projects, approve deliverables, and pay invoices. They never see OmniOS. That is the point.",
      },
      {
        title: "Retainer + project hybrid billing",
        body: "Sell the retainer, track the hours, cap the overages, and bill the extras as separate projects — automatically. Your clients see a single, clean invoice.",
      },
      {
        title: "Role-based permissions",
        body: "Admins see everything. Editors see what they own. Clients see only their project, their deliverables, and their budget. No accidental leaks, no permission audits at 2 a.m.",
      },
      {
        title: "Client-approved asset handoff",
        body: "Every deliverable has a version history, a review state, and an approval trail. The client signs off once. You keep the record forever. No more 'I never got it.'",
      },
    ],
    useCases: [
      "Creative agency delivering brand systems to 12 active clients",
      "Development shop running custom builds on 6-week sprints",
      "Marketing agency managing retainers across 25 SMB accounts",
      "Growth consultancy running research sprints + exec coaching",
    ],
    testimonial: {
      quote:
        "Our clients think we built the portal. We did not tell them otherwise. They renewed at 40% higher rates this cycle.",
      attribution: "Dario Venturini",
      company: "Managing Partner, Atlas Collective",
    },
    cta: { label: "Start Business free for 14 days", href: "/register?plan=business" },
  },
  enterprises: {
    slug: "enterprises",
    title: "One operating system. SOC 2 Type II, HIPAA-ready, 99.99% SLA.",
    subtitle:
      "OmniOS Enterprise replaces the fragmented SaaS middle layer in regulated, mission-critical organizations — with SSO, audit logs, residency controls, and an MSA your procurement team will actually sign.",
    kicker: "For Enterprises",
    plan: "Enterprise",
    planPrice: "From $2,000/mo",
    metaTitle: "OmniOS for Enterprise — SSO, HIPAA, SOC 2, and a 99.99% SLA.",
    metaDescription:
      "Enterprise-grade AI-native OS. SAML SSO, SCIM, HIPAA-ready BAAs, SOC 2 Type II, private-cloud deployment, and a dedicated architect. Talk to sales.",
    keywords: [
      "OmniOS for enterprise",
      "enterprise AI workspace",
      "HIPAA compliant software",
      "SOC 2 workspace",
      "SAML SSO SaaS",
      "private cloud operating system",
    ],
    pains: [
      {
        title: "Seventeen vendors, seventeen SOC 2 reviews",
        body: "Every new SaaS is another security review, another DPA, another procurement cycle. Your risk surface is the union of every tool you touch. You cannot keep up.",
      },
      {
        title: "AI tools that never get approved",
        body: "Your teams want modern AI tooling. Your legal team wants data residency, zero-retention, and a BAA. The gap between those two wants is where productivity goes to die.",
      },
      {
        title: "Identity and access hell",
        body: "Offboarding takes four hours and touches twelve admin panels. You always miss one. The password rotation runbook is thirty-one pages long.",
      },
      {
        title: "No single source of truth",
        body: "Finance says one number, the CRM says another, the analytics dashboard says a third. The CFO asks which is right. Nobody is sure.",
      },
    ],
    features: [
      {
        title: "SAML SSO + SCIM provisioning",
        body: "Wire OmniOS into Okta, Azure AD, Google Workspace, or any SAML 2.0 IdP. SCIM pushes user and group changes in real time. Offboarding a user is one action, everywhere.",
      },
      {
        title: "HIPAA, SOC 2 Type II, and executed BAA",
        body: "We sign BAAs on paid Enterprise contracts, publish SOC 2 Type II annually, and support pen-test sharing under NDA. Security questionnaires usually turn around in under a week.",
      },
      {
        title: "Private cloud and on-premise deployments",
        body: "Run OmniOS in your AWS, GCP, or Azure VPC. Bring-your-own-key encryption. Data never leaves your perimeter. Full audit logs streamed to your SIEM.",
      },
      {
        title: "99.99% uptime SLA with financial credits",
        body: "We measure availability per service, publish a real-time status page, and credit your invoice automatically when we miss. Written into the MSA, not the marketing page.",
      },
    ],
    useCases: [
      "Healthcare SaaS company unifying PHI-adjacent ops under one HIPAA-covered system",
      "Regional bank consolidating internal RFP, vendor, and audit workflows",
      "1,200-person manufacturing company running plant ops + sales + finance in one OS",
      "Regulated AI lab with strict data residency and zero-retention AI requirements",
    ],
    testimonial: {
      quote:
        "OmniOS passed procurement in 11 days. Our last vendor took eight months. We retired four point solutions and a custom internal tool in the first quarter.",
      attribution: "Cheryl Okonkwo",
      company: "VP IT, Brightline Clinical",
    },
    cta: { label: "Talk to sales", href: "/register?plan=enterprise" },
  },
};

const ALL_SLUGS: Segment[] = ["freelancers", "startups", "agencies", "enterprises"];

export function generateStaticParams(): Array<{ segment: Segment }> {
  return ALL_SLUGS.map((segment) => ({ segment }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ segment: string }>;
}): Promise<Metadata> {
  const { segment } = await params;
  const data = SEGMENTS[segment as Segment];
  if (!data) {
    return { title: "Solution not found" };
  }

  return {
    title: data.metaTitle,
    description: data.metaDescription,
    keywords: data.keywords,
    alternates: { canonical: `https://omnios.app/solutions/${data.slug}` },
    openGraph: {
      type: "website",
      url: `https://omnios.app/solutions/${data.slug}`,
      title: data.metaTitle,
      description: data.metaDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: data.metaTitle,
      description: data.metaDescription,
    },
  };
}

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ segment: string }>;
}) {
  const { segment } = await params;
  const data = SEGMENTS[segment as Segment];

  if (!data) {
    notFound();
  }

  const pageLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `OmniOS ${data.plan}`,
    description: data.metaDescription,
    url: `https://omnios.app/solutions/${data.slug}`,
    brand: {
      "@type": "Brand",
      name: "OmniOS",
    },
    offers: {
      "@type": "Offer",
      url: `https://omnios.app${data.cta.href}`,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    review: {
      "@type": "Review",
      reviewBody: data.testimonial.quote,
      author: { "@type": "Person", name: data.testimonial.attribution },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://omnios.app" },
      { "@type": "ListItem", position: 2, name: "Solutions", item: "https://omnios.app/solutions" },
      {
        "@type": "ListItem",
        position: 3,
        name: data.kicker,
        item: `https://omnios.app/solutions/${data.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <section className="relative overflow-hidden border-b border-white/5">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.15),transparent_55%)]"
        />
        <div className="relative mx-auto max-w-6xl px-6 pt-24 pb-20 sm:pt-32">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/40">
            <Link href="/" className="hover:text-white/70">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-white/60">Solutions</span>
            <span aria-hidden="true">/</span>
            <span className="text-white/60">{data.kicker}</span>
          </nav>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
            {data.kicker}
          </p>
          <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl">
            {data.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">{data.subtitle}</p>

          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link
              href={data.cta.href}
              className="inline-flex items-center gap-2 rounded-lg bg-[#6366F1] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(99,102,241,0.6)] hover:bg-[#5558E3]"
            >
              {data.cta.label}
              <span aria-hidden="true">→</span>
            </Link>
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
              <span className="text-white/50">Recommended plan</span>
              <span className="font-semibold text-white">
                {data.plan} · {data.planPrice}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="pains-heading"
        className="mx-auto max-w-6xl px-6 py-24"
      >
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            The problem
          </p>
          <h2
            id="pains-heading"
            className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            What is actually going wrong.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {data.pains.map((pain) => (
            <article
              key={pain.title}
              className="rounded-2xl border border-white/10 bg-[#13131A] p-6"
            >
              <h3 className="text-lg font-semibold text-white">{pain.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{pain.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="features-heading"
        className="border-y border-white/5 bg-[#07070C] py-24"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
              The fix
            </p>
            <h2
              id="features-heading"
              className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Exactly what {data.kicker.replace("For ", "").toLowerCase()} need, built in.
            </h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {data.features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#13131A] to-[#1C1C26] p-6"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#6366F1]/15 text-[#818CF8]"
                >
                  ◆
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{feature.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="use-cases-heading"
        className="mx-auto max-w-6xl px-6 py-24"
      >
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              In the wild
            </p>
            <h2
              id="use-cases-heading"
              className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Teams like yours, running on OmniOS.
            </h2>
            <p className="mt-4 text-white/60">
              Every {data.kicker.replace("For ", "").toLowerCase()} team runs differently.
              These are shapes we see most often — each one live on {data.plan}.
            </p>
          </div>
          <ul className="grid gap-3">
            {data.useCases.map((useCase, i) => (
              <li
                key={useCase}
                className="flex gap-4 rounded-2xl border border-white/10 bg-[#13131A] p-5"
              >
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#D4AF37]/15 text-xs font-semibold text-[#D4AF37]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm leading-relaxed text-white/75">{useCase}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-white/5 bg-gradient-to-b from-[#0A0A0F] to-[#07070C] py-24">
        <div className="mx-auto max-w-3xl px-6">
          <figure>
            <blockquote className="text-2xl font-medium leading-relaxed tracking-tight text-white sm:text-3xl">
              <span aria-hidden="true" className="text-[#D4AF37]">“</span>
              {data.testimonial.quote}
              <span aria-hidden="true" className="text-[#D4AF37]">”</span>
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 text-sm">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-xs font-semibold text-white"
              >
                {data.testimonial.attribution
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")}
              </span>
              <div>
                <p className="font-semibold text-white">{data.testimonial.attribution}</p>
                <p className="text-xs text-white/50">{data.testimonial.company}</p>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Ready to replace the stack?
        </h2>
        <p className="mt-4 text-white/60">
          {data.plan} starts at {data.planPrice}. 14 days free. 30-day money-back guarantee.
          Cancel in one click. Every dollar refundable if it does not earn its keep.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={data.cta.href}
            className="inline-flex items-center gap-2 rounded-lg bg-[#6366F1] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(99,102,241,0.6)] hover:bg-[#5558E3]"
          >
            {data.cta.label}
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            See all plans
          </Link>
        </div>

        <div className="mt-16 grid gap-3 border-t border-white/5 pt-12 text-xs text-white/40 sm:grid-cols-4">
          {ALL_SLUGS.filter((s) => s !== data.slug).map((other) => {
            const o = SEGMENTS[other];
            return (
              <Link
                key={other}
                href={`/solutions/${other}`}
                className="rounded-xl border border-white/5 bg-[#13131A] p-4 text-left transition-colors hover:border-[#6366F1]/40"
              >
                <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#D4AF37]">
                  {o.kicker}
                </span>
                <span className="mt-2 block text-sm font-medium text-white/80">
                  {o.plan} · {o.planPrice}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
