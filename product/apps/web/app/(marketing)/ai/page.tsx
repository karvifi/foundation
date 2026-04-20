import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "OmniMind AI — One AI brain for your entire business | OmniOS",
  description:
    "OmniMind is the AI workspace built into OmniOS. Local inference by default, Claude when needed. Knows your CRM, docs, email, and calendar simultaneously. Privacy-first AI business software.",
  keywords: [
    "AI workspace",
    "AI business software",
    "local AI for business",
    "OmniMind AI",
    "private AI assistant",
    "AI for CRM",
    "HIPAA compliant AI",
    "on-device AI",
    "Phi-4-mini",
    "Claude 3.5 Sonnet business",
  ],
  openGraph: {
    title: "OmniMind AI — One AI brain for your entire business",
    description:
      "Local inference by default. Claude when it matters. OmniMind knows your CRM, docs, email, and calendar — simultaneously.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OmniMind AI — One AI brain for your entire business",
    description:
      "Local inference by default. Claude when it matters. $0/month at scale with local AI.",
  },
};

interface RoutingTier {
  tier: string;
  model: string;
  label: string;
  price: string;
  share: number;
  role: string;
  examples: readonly string[];
  accent: string;
}

interface Capability {
  icon: string;
  title: string;
  desc: string;
  examples: readonly string[];
}

interface ChatExchange {
  source: string;
  prompt: string;
  thinking: string;
  response: React.ReactNode;
  citations: readonly string[];
  model: string;
  latency: string;
}

interface PrivacyPoint {
  title: string;
  desc: string;
  badge: string;
}

const ROUTING: readonly RoutingTier[] = [
  {
    tier: "01",
    model: "Phi-4-mini",
    label: "Local inference",
    price: "$0",
    share: 62,
    role: "Default for 60%+ of queries. Runs on your device. No network call.",
    examples: [
      "Summarize this email thread",
      "Extract todos from meeting notes",
      "Reformat this list as markdown",
    ],
    accent: "#6366F1",
  },
  {
    tier: "02",
    model: "Claude 3.5 Haiku",
    label: "Standard",
    price: "$0.25 / 1M tok",
    share: 28,
    role: "Fast cloud tier when the local model is not enough.",
    examples: [
      "Draft a two-paragraph reply",
      "Classify 400 support tickets",
      "Generate a weekly status update",
    ],
    accent: "#A855F7",
  },
  {
    tier: "03",
    model: "Claude 3.5 Sonnet",
    label: "Advanced",
    price: "$3.00 / 1M tok",
    share: 10,
    role: "Reserved for complex reasoning and long-context synthesis.",
    examples: [
      "Analyze Q3 pipeline and recommend moves",
      "Draft the 15-page RFP response",
      "Refactor this 2K-line service",
    ],
    accent: "#D4AF37",
  },
];

const CAPABILITIES: readonly Capability[] = [
  {
    icon: "⌨",
    title: "Code generation",
    desc: "Scaffold full features across your stack. OmniMind reads your repo, follows your conventions, and ships pull-request-ready diffs.",
    examples: ["TypeScript · Python · Go · Rust", "Repo-aware refactors", "Test + migration scaffolds"],
  },
  {
    icon: "✦",
    title: "Image creation",
    desc: "Generate on-brand imagery for decks, campaigns, and product UI. Style-tuned to your workspace and brand tokens.",
    examples: ["Hero and social visuals", "Product mockups", "Iconography systems"],
  },
  {
    icon: "≋",
    title: "Research synthesis",
    desc: "Point OmniMind at sources — URLs, PDFs, internal docs — and receive a cited synthesis with confidence scores.",
    examples: ["Competitive teardowns", "Literature reviews", "Vendor evaluations"],
  },
  {
    icon: "¶",
    title: "Document drafting",
    desc: "Turn bullet points into polished documents in your voice: proposals, SOPs, contracts, and long-form memos.",
    examples: ["Proposals + SOWs", "Policies + playbooks", "Board memos"],
  },
  {
    icon: "∑",
    title: "Data analysis",
    desc: "Ask questions against your warehouse, spreadsheets, or CRM. OmniMind writes the query, runs it, and explains the chart.",
    examples: ["SQL + pandas + DuckDB", "Cohort and funnel analysis", "Forecasts with confidence bands"],
  },
  {
    icon: "◈",
    title: "Business intelligence",
    desc: "Always-on signals across your tenant. OmniMind surfaces risks, opportunities, and anomalies before you ask.",
    examples: ["Pipeline health + at-risk deals", "Spend + burn anomalies", "Customer churn signals"],
  },
];

const CHAT_EXCHANGES: readonly ChatExchange[] = [
  {
    source: "Reads CRM · Email · Support",
    prompt: "Which deals are at risk this quarter?",
    thinking:
      "Joined 47 open deals with inbox activity and support tickets. Flagging anything with >10d silence, unresolved blocker, or stalled champion.",
    model: "Claude 3.5 Sonnet",
    latency: "1.8s",
    response: (
      <ul className="mt-4 divide-y divide-white/5 rounded-lg border border-white/10 bg-white/[0.02]">
        {[
          { name: "Aperture Industries", value: "$240K", reason: "Awaiting legal redlines · 14d silence" },
          { name: "Northwind Capital", value: "$180K", reason: "Blocked on SSO setup · ticket #2814 open 9d" },
          { name: "Helios Logistics", value: "$95K", reason: "Champion left company · no new contact" },
          { name: "Meridian Group", value: "$312K", reason: "Procurement review stalled · 17d in legal" },
        ].map((d) => (
          <li key={d.name} className="flex items-center justify-between gap-4 px-4 py-3">
            <div>
              <div className="text-sm text-white">{d.name}</div>
              <div className="mt-0.5 text-xs text-neutral-500">{d.reason}</div>
            </div>
            <span className="font-mono text-sm text-[#D4AF37]">{d.value}</span>
          </li>
        ))}
      </ul>
    ),
    citations: ["CRM · 47 deals", "Inbox · 312 threads", "Support · 18 tickets"],
  },
  {
    source: "Reads Contacts · Docs · Brand",
    prompt: "Draft a cold email to enterprise prospects.",
    thinking:
      "Pulled your positioning doc, last 3 case studies, and persona notes for VP Ops at 1k+ employee companies.",
    model: "Phi-4-mini · local",
    latency: "412ms",
    response: (
      <div className="mt-4 space-y-3 rounded-lg border border-white/10 bg-white/[0.02] p-5 text-sm leading-relaxed text-neutral-200">
        <div className="text-xs text-neutral-500">Subject: Cut your ops stack, not your margin</div>
        <p>Hi {"{firstName}"},</p>
        <p>
          Most ops leaders at {"{company}"}-sized companies are managing 14+ SaaS contracts just to run the business. We
          replaced that sprawl for Meridian with one AI-native workspace — and cut their tooling spend by 61% in the first
          quarter.
        </p>
        <p>Worth a 20-minute look? I can share the teardown we did for a team your size, no deck required.</p>
        <p className="text-neutral-400">— Kira, OmniOS</p>
      </div>
    ),
    citations: ["Brand voice · v3", "Case study · Meridian", "ICP · VP Ops 1k+"],
  },
  {
    source: "Reads Zendesk · Intercom · Linear",
    prompt: "Summarize last week's support tickets.",
    thinking:
      "Clustered 318 tickets from Nov 11–17 into themes by intent. Cross-referenced with Linear issues to flag known bugs.",
    model: "Claude 3.5 Haiku",
    latency: "720ms",
    response: (
      <ul className="mt-4 space-y-2 rounded-lg border border-white/10 bg-white/[0.02] p-4 text-sm">
        {[
          { theme: "SSO / SAML setup friction", count: 71, trend: "+38% WoW" },
          { theme: "Mobile push delivery delays (iOS 18)", count: 54, trend: "new" },
          { theme: "Bulk CSV import > 50K rows", count: 42, trend: "+12% WoW" },
          { theme: "Calendar sync (Google)", count: 29, trend: "-8% WoW" },
          { theme: "Billing invoice export formatting", count: 21, trend: "flat" },
        ].map((t) => (
          <li key={t.theme} className="flex items-center justify-between gap-4">
            <span className="text-neutral-200">{t.theme}</span>
            <span className="flex items-center gap-3">
              <span className="font-mono text-xs text-neutral-500">{t.count}</span>
              <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] text-[#D4AF37]">
                {t.trend}
              </span>
            </span>
          </li>
        ))}
      </ul>
    ),
    citations: ["Zendesk · 248 tickets", "Intercom · 70 threads", "Linear · 12 issues"],
  },
];

const PRIVACY: readonly PrivacyPoint[] = [
  {
    title: "Data never leaves your machine",
    desc: "Local inference means every prompt, document, and response stays on-device. No network call, no logs, no training signal.",
    badge: "On-device",
  },
  {
    title: "HIPAA & GDPR compliant",
    desc: "BAAs available on Enterprise. DPA for EU workloads. Per-module residency pinning for US, EU, and APAC regions.",
    badge: "Audited",
  },
  {
    title: "Zero training signal",
    desc: "Your prompts and outputs are never used to train foundation models. Not ours, not Anthropic's, not anyone's.",
    badge: "Contractual",
  },
  {
    title: "Tenant-scoped everything",
    desc: "Embeddings, caches, and indexes live in your workspace. Deleted the moment you delete the source. Fully auditable.",
    badge: "Isolated",
  },
];

const COST_SAVINGS = [
  {
    scenario: "Cloud-only (GPT-4 class)",
    monthly: "$356",
    bar: 100,
    barStyle: "linear-gradient(90deg,rgba(255,255,255,0.25),rgba(255,255,255,0.08))",
    priceClass: "text-neutral-400",
  },
  {
    scenario: "Mixed (no local tier)",
    monthly: "$148",
    bar: 42,
    barStyle: "linear-gradient(90deg,rgba(255,255,255,0.35),rgba(255,255,255,0.1))",
    priceClass: "text-neutral-300",
  },
  {
    scenario: "OmniMind 3-tier routing",
    monthly: "$0",
    bar: 2,
    barStyle: "linear-gradient(90deg,#D4AF37,#A855F7)",
    priceClass: "text-[#D4AF37]",
  },
] as const;

export default function OmniMindAIPage() {
  return (
    <div className="bg-[#0A0A0F] text-neutral-200 antialiased selection:bg-[#6366F1]/30 selection:text-white">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% -10%, rgba(99,102,241,0.35), transparent 60%), radial-gradient(ellipse 40% 40% at 85% 30%, rgba(168,85,247,0.18), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 pt-28 pb-36 lg:px-10">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
            <span className="h-px w-10 bg-[#D4AF37]/60" />
            OmniMind AI
          </div>
          <h1 className="mt-8 max-w-5xl font-serif text-5xl font-light leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-[7.5rem]">
            One AI brain
            <br />
            <span className="text-neutral-400">for your entire</span>
            <br />
            <span className="bg-gradient-to-r from-white via-white to-[#D4AF37] bg-clip-text text-transparent">
              business.
            </span>
          </h1>
          <p className="mt-10 max-w-2xl text-lg leading-relaxed text-neutral-400">
            OmniMind knows your CRM, docs, email, and calendar simultaneously. It thinks locally by default — so your data
            never leaves your machine — and reaches for Claude only when the problem genuinely needs it.
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-[#6366F1] px-7 py-3.5 text-sm font-medium text-white shadow-[0_0_40px_-10px_#6366F1] transition hover:bg-[#7577f3]"
            >
              Experience OmniMind free for 14 days
              <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
            </Link>
            <a
              href="#demo"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-7 py-3.5 text-sm text-neutral-200 backdrop-blur transition hover:border-[#D4AF37]/40 hover:text-white"
            >
              See it think ↓
            </a>
          </div>

          <div className="mt-16 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-neutral-500">Simultaneous context across</span>
            {["CRM", "Docs", "Email", "Calendar", "Support", "Code", "Finance"].map((s) => (
              <span
                key={s}
                className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-neutral-300"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3-Tier Routing ── */}
      <section className="relative border-b border-white/5 py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">3-Tier Routing</div>
              <h2 className="mt-6 max-w-3xl font-serif text-4xl font-light leading-tight text-white lg:text-6xl">
                Local first.
                <br />
                <span className="text-neutral-500">Cloud when it matters.</span>
              </h2>
            </div>
            <p className="max-w-md text-neutral-400">
              OmniMind routes every query to the smallest model that can answer it. The result: the economics of open-source,
              the capability ceiling of frontier AI.
            </p>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 lg:grid-cols-3">
            {ROUTING.map((t) => (
              <article key={t.model} className="group relative flex flex-col bg-[#0A0A0F] p-10 transition hover:bg-[#0d0d15]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#D4AF37]">{t.tier}</span>
                  <span
                    className="rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest"
                    style={{ borderColor: `${t.accent}40`, color: t.accent }}
                  >
                    {t.label}
                  </span>
                </div>
                <h3 className="mt-10 font-serif text-3xl font-light text-white">{t.model}</h3>
                <p className="mt-4 text-sm leading-relaxed text-neutral-400">{t.role}</p>

                <div className="mt-8 flex items-end justify-between gap-4 border-t border-white/5 pt-6">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Share of queries</div>
                    <div className="mt-1 font-serif text-3xl text-white">{t.share}%</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Cost</div>
                    <div className="mt-1 font-mono text-lg" style={{ color: t.accent }}>
                      {t.price}
                    </div>
                  </div>
                </div>

                <div
                  className="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/5"
                  aria-label={`${t.share} percent of queries`}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${t.share}%`, background: `linear-gradient(90deg, ${t.accent}, ${t.accent}80)` }}
                  />
                </div>

                <ul className="mt-8 space-y-2 text-sm text-neutral-400">
                  {t.examples.map((ex) => (
                    <li key={ex} className="flex items-start gap-2">
                      <span className="mt-2 h-1 w-1 rounded-full" style={{ background: t.accent }} aria-hidden />
                      {ex}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          {/* Cost chart */}
          <div className="mt-16 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent p-10 lg:p-14">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">Per-seat AI cost</div>
                <h3 className="mt-5 font-serif text-3xl font-light leading-tight text-white lg:text-5xl">
                  $0/month at scale with local AI.
                </h3>
                <p className="mt-5 text-neutral-400">
                  A typical knowledge worker runs ~4,200 AI queries per month. Here&apos;s what that actually costs on each
                  architecture.
                </p>
              </div>

              <ul className="space-y-6 self-center">
                {COST_SAVINGS.map((c) => (
                  <li key={c.scenario}>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-sm text-neutral-300">{c.scenario}</span>
                      <span className={`font-mono text-2xl ${c.priceClass}`}>{c.monthly}</span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${c.bar}%`, background: c.barStyle }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Capabilities ── */}
      <section className="relative border-b border-white/5 py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">Capabilities</div>
            <h2 className="mt-6 font-serif text-4xl font-light leading-tight text-white lg:text-6xl">
              Six surfaces.
              <br />
              <span className="text-neutral-500">One reasoning engine.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-neutral-400">
              OmniMind is not a collection of bolted-on AI features. Every capability runs on the same contextual reasoning
              layer — so it all knows what you are working on, and why.
            </p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((c) => (
              <article
                key={c.title}
                className="group relative flex flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent p-8 transition hover:-translate-y-1 hover:border-[#6366F1]/40"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#6366F1]/30 bg-[#6366F1]/10 font-serif text-2xl text-[#D4AF37]">
                  {c.icon}
                </div>
                <h3 className="mt-6 font-serif text-2xl font-light text-white">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-400">{c.desc}</p>
                <ul className="mt-6 space-y-2 border-t border-white/5 pt-5 font-mono text-[11px] uppercase tracking-widest text-neutral-500">
                  {c.examples.map((e) => (
                    <li key={e}>· {e}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Chat Demo ── */}
      <section id="demo" className="relative border-b border-white/5 py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(99,102,241,0.12), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">Live interaction</div>
            <h2 className="mt-6 font-serif text-4xl font-light leading-tight text-white lg:text-5xl">
              Ask anything. Watch it reason.
            </h2>
            <p className="mt-6 text-neutral-400">
              Three real prompts. Full context. Cited answers. Open OmniMind anywhere with{" "}
              <kbd className="mx-1 rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-xs text-neutral-300">
                ⌘K
              </kbd>
              .
            </p>
          </div>

          <div className="mt-14 overflow-hidden rounded-2xl border border-white/10 bg-[#06060A] shadow-[0_40px_120px_-40px_#6366F1]">
            <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-5 py-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/70" />
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                OmniMind · ⌘K · contextual
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] text-[#D4AF37]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                live
              </div>
            </div>

            <div className="divide-y divide-white/5">
              {CHAT_EXCHANGES.map((ex) => (
                <div key={ex.prompt} className="px-6 py-8 lg:px-10">
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] font-mono text-xs text-neutral-400">
                      You
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="font-serif text-xl text-white lg:text-2xl">{ex.prompt}</p>
                      <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                        {ex.source}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-start gap-4">
                    <div
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-mono text-xs text-white"
                      style={{
                        background: "linear-gradient(135deg, #6366F1, #A855F7)",
                        boxShadow: "0 0 24px -6px #6366F1",
                      }}
                      aria-label="OmniMind"
                    >
                      OM
                    </div>
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.02] px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                        <span className="h-1 w-1 rounded-full bg-[#D4AF37]" />
                        {ex.model}
                        <span className="text-neutral-600">·</span>
                        <span className="text-neutral-400">{ex.latency}</span>
                      </div>
                      <p className="mt-3 text-sm italic leading-relaxed text-neutral-500">{ex.thinking}</p>
                      {ex.response}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {ex.citations.map((c) => (
                          <span
                            key={c}
                            className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#D4AF37]"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 border-t border-white/5 bg-white/[0.02] px-6 py-4">
              <span className="font-mono text-sm text-[#6366F1]">›</span>
              <span className="flex-1 text-sm text-neutral-500">Ask OmniMind anything…</span>
              <kbd className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-neutral-400">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>
      </section>

      {/* ── Privacy ── */}
      <section className="relative border-b border-white/5 py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">Privacy-first</div>
              <h2 className="mt-6 font-serif text-4xl font-light leading-tight text-white lg:text-6xl">
                Your data never
                <br />
                leaves your machine.
              </h2>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-neutral-400">
                Most AI products ship your business to someone else&apos;s datacenter. OmniMind runs the local tier on your
                device — no network call, no logging, no training signal. Cloud tiers are opt-in, per-workspace, and
                auditable.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                {["SOC 2 Type II", "ISO 27001", "HIPAA", "GDPR", "FedRAMP Ready"].map((b) => (
                  <span
                    key={b}
                    className="rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-neutral-300"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>

            <dl className="space-y-px overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              {PRIVACY.map((p) => (
                <div key={p.title} className="bg-[#0A0A0F] p-8">
                  <div className="flex items-start justify-between gap-6">
                    <dt className="font-serif text-xl text-white">{p.title}</dt>
                    <span className="flex-shrink-0 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#D4AF37]">
                      {p.badge}
                    </span>
                  </div>
                  <dd className="mt-3 text-sm leading-relaxed text-neutral-400">{p.desc}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(99,102,241,0.14), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-[#D4AF37]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
            14-day free trial · no credit card
          </div>
          <h2 className="mt-8 font-serif text-4xl font-light leading-tight text-white lg:text-7xl">
            Experience OmniMind
            <br />
            <span className="bg-gradient-to-r from-white via-white to-[#D4AF37] bg-clip-text text-transparent">
              free for 14 days.
            </span>
          </h2>
          <p className="mt-8 text-lg text-neutral-400">
            Local AI installed in 60 seconds. Connect your CRM, docs, and calendar. Ship real work by lunch.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-[#6366F1] px-8 py-4 text-sm font-medium text-white shadow-[0_0_40px_-10px_#6366F1] transition hover:bg-[#7577f3]"
            >
              Start free trial →
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-8 py-4 text-sm text-neutral-200 transition hover:border-[#D4AF37]/40 hover:text-white"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
