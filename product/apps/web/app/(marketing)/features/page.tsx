import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features — Everything your business needs, in one OS | OmniOS",
  description:
    "Twelve deeply integrated modules. One context-aware OS. Inbox, Calendar, Documents, CRM, Spreadsheets, Code IDE, Finance, Support Desk, Messages, Automation, Analytics, and AI Assistant.",
  openGraph: {
    title: "OmniOS Features — Everything your business needs. One OS.",
    description: "Twelve modules, one context graph, zero integration headaches.",
  },
};

interface Module {
  id: string;
  name: string;
  glyph: string;
  blurb: string;
  bullets: readonly string[];
  gradient: string;
}

const MODULES: readonly Module[] = [
  {
    id: "inbox",
    name: "Inbox",
    glyph: "✉",
    blurb: "The last email client you'll ever need.",
    bullets: ["Unified inbox across domains", "AI triage and smart bundles", "Turn any thread into a deal, ticket, or task"],
    gradient: "from-[#6366F1]/25 via-[#6366F1]/5 to-transparent",
  },
  {
    id: "calendar",
    name: "Calendar",
    glyph: "◱",
    blurb: "Time, finally treated like a first-class object.",
    bullets: ["Multi-account, multi-timezone", "AI scheduling that respects focus", "Auto-links to CRM, Docs, and Meetings"],
    gradient: "from-[#D4AF37]/20 via-[#D4AF37]/5 to-transparent",
  },
  {
    id: "documents",
    name: "Documents",
    glyph: "❖",
    blurb: "Collaborative writing with a graph underneath.",
    bullets: ["Block-based, real-time co-edit", "Citation-aware AI drafts", "Link to any record in the OS"],
    gradient: "from-[#6366F1]/25 via-[#6366F1]/5 to-transparent",
  },
  {
    id: "crm",
    name: "CRM",
    glyph: "◊",
    blurb: "A pipeline that thinks with you.",
    bullets: ["Deal stages with rich custom fields", "Auto-logged emails, calls, meetings", "AI next-step suggestions"],
    gradient: "from-[#D4AF37]/20 via-[#D4AF37]/5 to-transparent",
  },
  {
    id: "spreadsheets",
    name: "Spreadsheets",
    glyph: "▦",
    blurb: "Formulas meet the full company graph.",
    bullets: ["=CRM(), =FINANCE(), =SUPPORT() formulas", "Live queries across modules", "AI-assisted analysis"],
    gradient: "from-[#6366F1]/25 via-[#6366F1]/5 to-transparent",
  },
  {
    id: "code",
    name: "Code IDE",
    glyph: "〈〉",
    blurb: "Ship directly from the OS that runs your business.",
    bullets: ["Git + branch previews", "AI pair-programmer with business context", "One-click deploys to OmniRun"],
    gradient: "from-[#D4AF37]/20 via-[#D4AF37]/5 to-transparent",
  },
  {
    id: "finance",
    name: "Finance",
    glyph: "$",
    blurb: "Books, invoicing, and cash — connected to reality.",
    bullets: ["Invoices linked to CRM deals", "Automatic reconciliation", "Runway and burn forecasts"],
    gradient: "from-[#6366F1]/25 via-[#6366F1]/5 to-transparent",
  },
  {
    id: "support",
    name: "Support Desk",
    glyph: "⊕",
    blurb: "Customer context, surfaced in the moment.",
    bullets: ["Tickets tied to CRM + Finance", "AI first-draft replies with citations", "SLA tracking per segment"],
    gradient: "from-[#D4AF37]/20 via-[#D4AF37]/5 to-transparent",
  },
  {
    id: "messages",
    name: "Messages",
    glyph: "◈",
    blurb: "Internal chat that keeps up with your work.",
    bullets: ["Threaded channels + DMs", "Share records, not links", "Voice and huddles built in"],
    gradient: "from-[#6366F1]/25 via-[#6366F1]/5 to-transparent",
  },
  {
    id: "automation",
    name: "Automation",
    glyph: "⟿",
    blurb: "OmniFlow. Visual logic for the entire OS.",
    bullets: ["100+ native triggers and actions", "AI step: reason, draft, decide", "Version-controlled workflows"],
    gradient: "from-[#D4AF37]/20 via-[#D4AF37]/5 to-transparent",
  },
  {
    id: "analytics",
    name: "Analytics",
    glyph: "◢",
    blurb: "Dashboards sourced from one source of truth.",
    bullets: ["Self-serve exploration", "Alerting on anomalies", "AI-generated narratives"],
    gradient: "from-[#6366F1]/25 via-[#6366F1]/5 to-transparent",
  },
  {
    id: "ai",
    name: "AI Assistant",
    glyph: "✦",
    blurb: "OmniMind. Context-aware, cross-module, agent-capable.",
    bullets: ["Cited answers across your data", "Scoped autonomous agents", "Run locally on enterprise"],
    gradient: "from-[#D4AF37]/20 via-[#D4AF37]/5 to-transparent",
  },
];

const FLOW_NODES = [
  { t: "Trigger", v: "New deal in CRM", color: "#6366F1" },
  { t: "Condition", v: "Value > $50K", color: "#D4AF37" },
  { t: "AI Step", v: "Draft proposal from template", color: "#6366F1" },
  { t: "Action", v: "Create doc, notify channel", color: "#D4AF37" },
  { t: "Action", v: "Schedule follow-up", color: "#6366F1" },
] as const;

const STATS = [
  { k: "<100ms", v: "p95 response time" },
  { k: "99.99%", v: "measured uptime" },
  { k: "<2s", v: "OmniMind AI response" },
  { k: "12", v: "deeply integrated modules" },
] as const;

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0F] text-neutral-200 antialiased selection:bg-[#6366F1]/30 selection:text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(99,102,241,0.3), transparent 65%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 pt-32 pb-40 lg:px-10">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
            <span className="h-px w-10 bg-[#D4AF37]/60" />
            Features
          </div>
          <h1 className="mt-8 max-w-5xl font-serif text-5xl font-light leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-8xl">
            Everything your business needs.
            <br />
            <span className="bg-gradient-to-r from-white to-[#D4AF37] bg-clip-text text-transparent">
              One OS.
            </span>
          </h1>
          <p className="mt-10 max-w-2xl text-lg leading-relaxed text-neutral-400">
            Twelve modules that share one context graph, one identity layer, one design language — and one AI
            that understands them all.
          </p>
        </div>
      </section>

      {/* Module Showcase */}
      <section className="relative border-b border-white/5 py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex items-end justify-between gap-8">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">Modules</div>
              <h2 className="mt-6 max-w-3xl font-serif text-4xl font-light leading-tight text-white lg:text-5xl">
                Twelve surfaces. One fabric.
              </h2>
            </div>
          </div>

          <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((m) => (
              <article
                key={m.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d15] p-8 transition hover:border-[#6366F1]/40"
              >
                <div
                  aria-hidden
                  className={`absolute inset-0 bg-gradient-to-br ${m.gradient} opacity-0 transition group-hover:opacity-100`}
                />

                {/* Screenshot placeholder */}
                <div className="relative mb-8 h-40 overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-[#141420] via-[#0d0d15] to-[#0A0A0F]">
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse 60% 60% at 30% 30%, rgba(99,102,241,0.25), transparent 70%)",
                    }}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-x-6 bottom-6 top-10 rounded-md border border-white/10 bg-black/30 backdrop-blur"
                  >
                    <div className="flex gap-1 border-b border-white/5 p-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
                      <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
                      <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
                    </div>
                    <div className="space-y-2 p-3">
                      <div className="h-1.5 w-3/4 rounded-full bg-white/10" />
                      <div className="h-1.5 w-1/2 rounded-full bg-white/10" />
                      <div className="h-1.5 w-2/3 rounded-full bg-[#6366F1]/40" />
                    </div>
                  </div>
                  <div className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-widest text-[#D4AF37]">
                    {m.id}
                  </div>
                </div>

                <div className="relative flex items-center gap-3">
                  <span className="font-serif text-2xl text-[#D4AF37]" aria-hidden>
                    {m.glyph}
                  </span>
                  <h3 className="font-serif text-2xl font-light text-white">{m.name}</h3>
                </div>
                <p className="relative mt-3 text-sm text-neutral-400">{m.blurb}</p>
                <ul className="relative mt-6 space-y-2 border-t border-white/5 pt-6 text-sm text-neutral-300">
                  {m.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-[#6366F1]" aria-hidden />
                      {b}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* OmniFlow Automation */}
      <section className="relative border-b border-white/5 py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">OmniFlow</div>
              <h2 className="mt-6 font-serif text-4xl font-light leading-tight text-white lg:text-5xl">
                Automation with a brain.
              </h2>
              <p className="mt-8 text-lg leading-relaxed text-neutral-400">
                Build workflows that span every module — and drop an AI step anywhere to reason, draft, or
                decide. Version-controlled. Observable. Reversible.
              </p>
              <ul className="mt-10 space-y-3 text-sm text-neutral-300">
                {[
                  "100+ native triggers across every module",
                  "AI reasoning nodes with policy guardrails",
                  "Full execution history + one-click replays",
                  "Git-style branching for workflow drafts",
                ].map((i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-[#D4AF37]" aria-hidden />
                    {i}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-6 lg:p-10">
              <div className="space-y-3">
                {FLOW_NODES.map((n, i) => (
                  <div key={n.v} className="relative">
                    <div
                      className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#0d0d15] px-5 py-4"
                      style={{ borderLeftWidth: 3, borderLeftColor: n.color }}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-black/30 font-mono text-[10px] text-[#D4AF37]">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: n.color }}>
                          {n.t}
                        </div>
                        <div className="mt-0.5 text-sm text-white">{n.v}</div>
                      </div>
                    </div>
                    {i < FLOW_NODES.length - 1 && (
                      <div className="ml-9 flex h-6 items-center" aria-hidden>
                        <span className="h-full w-px bg-gradient-to-b from-white/30 to-white/5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-8 flex items-center justify-between rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-5 py-4">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#D4AF37]">Outcome</div>
                <div className="text-sm text-white">Proposal drafted, routed, scheduled — in 3.4s</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-module magic */}
      <section className="relative border-b border-white/5 py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">Cross-module magic</div>
            <h2 className="mt-6 font-serif text-4xl font-light leading-tight text-white lg:text-5xl">
              One click. Every context.
            </h2>
            <p className="mt-6 text-neutral-400">
              Select a contact in CRM. See their support tickets. See their invoices. See every thread, doc,
              and deal — all in one pane.
            </p>
          </div>

          <div className="mt-16 overflow-hidden rounded-2xl border border-white/10 bg-[#06060A]">
            <div className="grid lg:grid-cols-[320px_1fr]">
              <div className="border-b border-white/5 bg-white/[0.02] p-6 lg:border-b-0 lg:border-r">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#D4AF37]">CRM</div>
                <div className="mt-4 space-y-2">
                  {["Aperture Industries", "Northwind Capital", "Helios Logistics", "Meridian Group"].map((c, i) => (
                    <div
                      key={c}
                      className={`rounded-lg px-4 py-3 text-sm ${
                        i === 0
                          ? "border border-[#6366F1]/40 bg-[#6366F1]/10 text-white"
                          : "border border-transparent text-neutral-400"
                      }`}
                    >
                      {c}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-px bg-white/5 sm:grid-cols-3">
                {[
                  {
                    label: "Support",
                    items: ["#2814 · SSO config", "#2770 · Billing question", "#2651 · Feature request"],
                  },
                  {
                    label: "Finance",
                    items: ["INV-9821 · $24,000 · Paid", "INV-9740 · $18,000 · Overdue", "INV-9688 · $22,500 · Paid"],
                  },
                  {
                    label: "Deals & Docs",
                    items: ["Enterprise Q4 · $240K · Negotiation", "MSA-v3.pdf · Signed", "Proposal-2026.doc · Draft"],
                  },
                ].map((col) => (
                  <div key={col.label} className="bg-[#0A0A0F] p-6">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[#D4AF37]">{col.label}</div>
                    <ul className="mt-4 space-y-3 text-sm text-neutral-300">
                      {col.items.map((i) => (
                        <li key={i} className="border-l border-[#6366F1]/30 pl-3">
                          {i}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Stats */}
      <section className="relative py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">Performance</div>
            <h2 className="mt-6 font-serif text-4xl font-light leading-tight text-white lg:text-5xl">
              Fast enough to disappear.
            </h2>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.k} className="bg-[#0A0A0F] p-10">
                <div className="font-serif text-5xl font-light text-white lg:text-6xl">{s.k}</div>
                <div className="mt-4 text-xs uppercase tracking-widest text-neutral-500">{s.v}</div>
              </div>
            ))}
          </div>

          <div className="mt-20 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-[#6366F1] px-8 py-4 text-sm font-medium text-white shadow-[0_0_40px_-10px_#6366F1]"
            >
              Start free →
            </a>
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-8 py-4 text-sm text-neutral-200"
            >
              See pricing
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
