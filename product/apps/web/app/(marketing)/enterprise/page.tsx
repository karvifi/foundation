import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enterprise | OmniOS",
  description:
    "Enterprise-grade AI OS built for regulated industries. SOC 2, HIPAA, GDPR, ISO 27001. SSO, dedicated infrastructure, 99.99% SLA.",
  alternates: { canonical: "/enterprise" },
};

interface TrustBadge {
  label: string;
  note: string;
}

interface Feature {
  title: string;
  desc: string;
}

interface RoiRow {
  label: string;
  value: string;
}

interface ComparisonRow {
  feature: string;
  pro: boolean | string;
  ent: boolean | string;
}

const trustBadges: TrustBadge[] = [
  { label: "SOC 2 Type II", note: "Audited annually" },
  { label: "HIPAA", note: "BAA available" },
  { label: "GDPR", note: "EU data residency" },
  { label: "ISO 27001", note: "Certified ISMS" },
];

const features: Feature[] = [
  { title: "SSO / SAML", desc: "Okta, Azure AD, Google Workspace, OneLogin, and any SAML 2.0 provider." },
  { title: "Custom AI Models", desc: "Fine-tune on your private corpus. Bring your own weights or use ours." },
  { title: "Dedicated Infrastructure", desc: "Single-tenant VPC deployments. No noisy neighbors, ever." },
  { title: "99.99% SLA", desc: "Four nines of uptime with financial backing and real-time status." },
  { title: "Audit Logs", desc: "Immutable, exportable logs with SIEM streaming to Splunk or Datadog." },
  { title: "Role-Based Access", desc: "Fine-grained RBAC down to the workspace, document, and action level." },
  { title: "Data Residency", desc: "Pin data to US, EU, or APAC regions. Sovereignty controls per tenant." },
  { title: "Priority Support", desc: "Named CSM, 15-minute response on Sev-1, shared Slack channel." },
];

const logos: string[] = [
  "CASCADE",
  "NORTHWIND",
  "HELIOS",
  "ARGENT",
  "MERIDIAN",
  "OBSIDIAN",
  "VANTAGE",
  "QUANTA",
];

const roiRows: RoiRow[] = [
  { label: "Manual hours reclaimed per seat / year", value: "312 hrs" },
  { label: "Tooling consolidation savings", value: "$94,200" },
  { label: "Reduced incident response cost", value: "$71,400" },
  { label: "Faster time-to-decision uplift", value: "$52,800" },
];

const comparison: ComparisonRow[] = [
  { feature: "SSO / SAML", pro: false, ent: true },
  { feature: "Custom AI models", pro: false, ent: true },
  { feature: "Dedicated VPC", pro: false, ent: true },
  { feature: "SLA", pro: "99.9%", ent: "99.99%" },
  { feature: "Audit log retention", pro: "90 days", ent: "7 years" },
  { feature: "Data residency", pro: "US only", ent: "US / EU / APAC" },
  { feature: "Support", pro: "Business hours", ent: "24/7 + named CSM" },
  { feature: "Seats", pro: "Up to 500", ent: "Unlimited" },
];

function renderCell(value: boolean | string): string {
  if (typeof value === "boolean") return value ? "Included" : "—";
  return value;
}

export default function EnterprisePage() {
  return (
    <main className="bg-[#0A0A0F] text-neutral-100">
      <section className="relative overflow-hidden border-b border-white/5">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.18), transparent 60%), radial-gradient(ellipse 40% 30% at 80% 10%, rgba(212,175,55,0.08), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 pb-28 pt-32 md:pt-40">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
            <span className="h-1 w-1 rounded-full bg-[#D4AF37]" />
            For Enterprise
          </p>
          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            Enterprise-grade AI OS.
            <br />
            <span className="text-neutral-400">Built for </span>
            <span className="bg-gradient-to-r from-[#6366F1] to-[#D4AF37] bg-clip-text text-transparent">
              regulated industries.
            </span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-neutral-400 md:text-xl">
            OmniOS gives banks, hospitals, logistics networks, and governments a single AI operating system with the controls, audit trails, and uptime their compliance teams demand.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#contact" className="rounded-lg bg-[#6366F1] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#5457e0]">
              Talk to sales
            </a>
            <a href="#comparison" className="rounded-lg border border-white/10 px-6 py-3 text-sm font-medium text-neutral-200 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]">
              Compare plans
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-8 text-xs uppercase tracking-[0.3em] text-neutral-500">
            Audited, certified, and continuously monitored
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {trustBadges.map((b) => (
              <div key={b.label} className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-[#D4AF37]/40">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className="text-base font-semibold text-white">{b.label}</div>
                <div className="mt-1 text-xs text-neutral-500">{b.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 max-w-2xl">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">Platform</p>
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Everything your security review already approved.
            </h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="group relative bg-[#0A0A0F] p-8 transition hover:bg-[#0F0F18]">
                <div className="mb-6 h-8 w-8 rounded-md bg-gradient-to-br from-[#6366F1] to-[#6366F1]/30 ring-1 ring-[#6366F1]/40" />
                <h3 className="text-base font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-10 text-center text-xs uppercase tracking-[0.3em] text-neutral-500">
            Trusted by teams that cannot afford to be wrong
          </p>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/5 bg-white/5 md:grid-cols-4">
            {logos.map((logo) => (
              <div key={logo} className="flex h-24 items-center justify-center bg-[#0A0A0F] text-sm font-semibold tracking-[0.25em] text-neutral-500 transition hover:text-[#D4AF37]">
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">ROI</p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
                The average enterprise saves{" "}
                <span className="bg-gradient-to-r from-[#6366F1] to-[#D4AF37] bg-clip-text text-transparent">
                  $218,400
                </span>{" "}
                per year.
              </h2>
              <p className="mt-6 text-neutral-400">
                Based on 47 deployments of 100+ seats in the last 12 months. Figures measured against pre-migration baselines and verified by customer finance teams.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-2">
              <div className="rounded-xl bg-[#0A0A0F] p-8">
                <div className="mb-6 flex items-baseline justify-between border-b border-white/5 pb-6">
                  <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">Total annual impact</span>
                  <span className="text-3xl font-semibold text-[#D4AF37]">$218,400</span>
                </div>
                <ul className="space-y-4">
                  {roiRows.map((r) => (
                    <li key={r.label} className="flex items-center justify-between text-sm">
                      <span className="text-neutral-400">{r.label}</span>
                      <span className="font-medium text-white">{r.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#6366F1]/10 via-transparent to-[#D4AF37]/10 p-10 md:p-16">
            <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#6366F1]/20 blur-3xl" />
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">Case study</p>
            <h3 className="max-w-3xl text-3xl font-semibold leading-tight md:text-4xl">
              How Cascade Logistics migrated 134 seats in 11 days with zero downtime.
            </h3>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              <div>
                <div className="text-4xl font-semibold text-white">134</div>
                <div className="mt-1 text-sm text-neutral-400">Seats migrated</div>
              </div>
              <div>
                <div className="text-4xl font-semibold text-[#D4AF37]">11 days</div>
                <div className="mt-1 text-sm text-neutral-400">End-to-end rollout</div>
              </div>
              <div>
                <div className="text-4xl font-semibold text-white">$412K</div>
                <div className="mt-1 text-sm text-neutral-400">Year-one savings</div>
              </div>
            </div>
            <p className="mt-10 max-w-2xl text-neutral-400">
              &ldquo;OmniOS replaced four vendors, cut our dispatch review window from 40 minutes to under 6, and cleared our ISO audit on the first pass.&rdquo;
              <span className="mt-2 block text-sm text-neutral-500">— Director of Operations, Cascade Logistics</span>
            </p>
          </div>
        </div>
      </section>

      <section id="comparison" className="border-b border-white/5 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">Plans</p>
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">Pro vs Enterprise</h2>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.03] text-xs uppercase tracking-[0.2em] text-neutral-500">
                <tr>
                  <th className="px-6 py-5 font-medium">Feature</th>
                  <th className="px-6 py-5 font-medium">Pro</th>
                  <th className="px-6 py-5 font-medium text-[#D4AF37]">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-[#0A0A0F]" : "bg-white/[0.015]"}>
                    <td className="px-6 py-4 font-medium text-white">{row.feature}</td>
                    <td className="px-6 py-4 text-neutral-400">{renderCell(row.pro)}</td>
                    <td className="px-6 py-4 text-neutral-200">{renderCell(row.ent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="contact" className="py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">Contact sales</p>
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Let&rsquo;s scope your deployment.
            </h2>
            <p className="mt-4 text-neutral-400">
              A solutions engineer will reply within one business day with a custom proposal, security packet, and reference calls.
            </p>
          </div>
          <form action="mailto:sales@omnios.app" method="post" encType="text/plain" className="grid gap-5 rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">Name</span>
                <input type="text" name="name" required className="w-full rounded-lg border border-white/10 bg-[#0A0A0F] px-4 py-3 text-sm text-white outline-none transition focus:border-[#6366F1]" />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">Work email</span>
                <input type="email" name="email" required className="w-full rounded-lg border border-white/10 bg-[#0A0A0F] px-4 py-3 text-sm text-white outline-none transition focus:border-[#6366F1]" />
              </label>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">Company</span>
                <input type="text" name="company" required className="w-full rounded-lg border border-white/10 bg-[#0A0A0F] px-4 py-3 text-sm text-white outline-none transition focus:border-[#6366F1]" />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">Team size</span>
                <select name="team_size" className="w-full rounded-lg border border-white/10 bg-[#0A0A0F] px-4 py-3 text-sm text-white outline-none transition focus:border-[#6366F1]">
                  <option>50 – 200</option>
                  <option>200 – 1,000</option>
                  <option>1,000 – 5,000</option>
                  <option>5,000+</option>
                </select>
              </label>
            </div>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500">Message</span>
              <textarea name="message" rows={5} className="w-full rounded-lg border border-white/10 bg-[#0A0A0F] px-4 py-3 text-sm text-white outline-none transition focus:border-[#6366F1]" />
            </label>
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <p className="text-xs text-neutral-500">
                Or email us directly at{" "}
                <a href="mailto:sales@omnios.app" className="text-[#D4AF37] hover:underline">sales@omnios.app</a>
              </p>
              <button type="submit" className="rounded-lg bg-[#6366F1] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#5457e0]">
                Request proposal
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
