import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Integrations | OmniOS",
  description:
    "Connect OmniOS to your entire stack. 40+ native integrations across CRM, productivity, finance, developer tools, marketing, and support.",
  alternates: { canonical: "/integrations" },
};

type Category =
  | "CRM"
  | "Productivity"
  | "Finance"
  | "Dev"
  | "Marketing"
  | "Support";

interface Integration {
  name: string;
  category: Category;
  native: boolean;
  from: string;
  to: string;
}

const categories: { label: string; slug: string }[] = [
  { label: "All", slug: "all" },
  { label: "CRM", slug: "crm" },
  { label: "Productivity", slug: "productivity" },
  { label: "Finance", slug: "finance" },
  { label: "Dev", slug: "dev" },
  { label: "Marketing", slug: "marketing" },
  { label: "Support", slug: "support" },
];

const integrations: Integration[] = [
  { name: "Salesforce", category: "CRM", native: true, from: "#6366F1", to: "#22D3EE" },
  { name: "HubSpot", category: "CRM", native: true, from: "#F97316", to: "#D4AF37" },
  { name: "Intercom", category: "Support", native: true, from: "#6366F1", to: "#A855F7" },
  { name: "Zendesk", category: "Support", native: true, from: "#10B981", to: "#6366F1" },
  { name: "Notion", category: "Productivity", native: true, from: "#E5E7EB", to: "#9CA3AF" },
  { name: "Slack", category: "Productivity", native: true, from: "#A855F7", to: "#EC4899" },
  { name: "Asana", category: "Productivity", native: true, from: "#EC4899", to: "#F97316" },
  { name: "Monday", category: "Productivity", native: true, from: "#6366F1", to: "#EC4899" },
  { name: "Zoom", category: "Productivity", native: true, from: "#3B82F6", to: "#6366F1" },
  { name: "Google Workspace", category: "Productivity", native: true, from: "#22D3EE", to: "#10B981" },
  { name: "Microsoft 365", category: "Productivity", native: true, from: "#F97316", to: "#EAB308" },
  { name: "Dropbox", category: "Productivity", native: true, from: "#3B82F6", to: "#22D3EE" },
  { name: "Box", category: "Productivity", native: false, from: "#1E40AF", to: "#6366F1" },
  { name: "Airtable", category: "Productivity", native: true, from: "#EAB308", to: "#EC4899" },
  { name: "Figma", category: "Productivity", native: true, from: "#EC4899", to: "#A855F7" },
  { name: "Loom", category: "Productivity", native: false, from: "#A855F7", to: "#6366F1" },
  { name: "Stripe", category: "Finance", native: true, from: "#6366F1", to: "#A855F7" },
  { name: "QuickBooks", category: "Finance", native: true, from: "#10B981", to: "#22D3EE" },
  { name: "Shopify", category: "Finance", native: true, from: "#10B981", to: "#84CC16" },
  { name: "WooCommerce", category: "Finance", native: false, from: "#A855F7", to: "#EC4899" },
  { name: "GitHub", category: "Dev", native: true, from: "#E5E7EB", to: "#525252" },
  { name: "Jira", category: "Dev", native: true, from: "#3B82F6", to: "#6366F1" },
  { name: "Linear", category: "Dev", native: true, from: "#6366F1", to: "#D4AF37" },
  { name: "AWS", category: "Dev", native: true, from: "#F97316", to: "#EAB308" },
  { name: "GCP", category: "Dev", native: true, from: "#3B82F6", to: "#EF4444" },
  { name: "Azure", category: "Dev", native: true, from: "#22D3EE", to: "#3B82F6" },
  { name: "Snowflake", category: "Dev", native: true, from: "#22D3EE", to: "#6366F1" },
  { name: "Databricks", category: "Dev", native: true, from: "#EF4444", to: "#F97316" },
  { name: "dbt", category: "Dev", native: false, from: "#F97316", to: "#EF4444" },
  { name: "Datadog", category: "Dev", native: true, from: "#A855F7", to: "#6366F1" },
  { name: "PagerDuty", category: "Dev", native: true, from: "#10B981", to: "#84CC16" },
  { name: "n8n", category: "Dev", native: false, from: "#EF4444", to: "#EC4899" },
  { name: "Zapier", category: "Dev", native: true, from: "#F97316", to: "#EAB308" },
  { name: "Segment", category: "Marketing", native: true, from: "#10B981", to: "#22D3EE" },
  { name: "Mixpanel", category: "Marketing", native: true, from: "#A855F7", to: "#6366F1" },
  { name: "Amplitude", category: "Marketing", native: true, from: "#3B82F6", to: "#A855F7" },
  { name: "PostHog", category: "Marketing", native: true, from: "#F97316", to: "#EC4899" },
  { name: "Mailchimp", category: "Marketing", native: true, from: "#EAB308", to: "#F97316" },
  { name: "SendGrid", category: "Marketing", native: true, from: "#3B82F6", to: "#22D3EE" },
  { name: "Twilio", category: "Marketing", native: true, from: "#EF4444", to: "#EC4899" },
];

function initials(name: string): string {
  const parts = name.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function groupByCategory(items: Integration[]): Record<string, Integration[]> {
  return items.reduce<Record<string, Integration[]>>((acc, item) => {
    const key = item.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

function IntegrationCard({ item }: { item: Integration }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-[#D4AF37]/30 hover:bg-white/[0.04]">
      <div className="flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-full text-xs font-semibold text-[#0A0A0F]"
          style={{ background: `linear-gradient(135deg, ${item.from}, ${item.to})` }}
          aria-hidden
        >
          {initials(item.name)}
        </div>
        <span
          className={
            item.native
              ? "rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-[#D4AF37]"
              : "rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-500"
          }
        >
          {item.native ? "Native" : "Coming Soon"}
        </span>
      </div>
      <div className="mt-5">
        <h3 className="text-sm font-semibold text-white">{item.name}</h3>
        <p className="mt-1 text-xs text-neutral-500">{item.category}</p>
      </div>
    </div>
  );
}

export default function IntegrationsPage() {
  const grouped = groupByCategory(integrations);
  const orderedCategories: Category[] = [
    "CRM",
    "Productivity",
    "Finance",
    "Dev",
    "Marketing",
    "Support",
  ];

  return (
    <main className="bg-[#0A0A0F] text-neutral-100">
      <section className="relative overflow-hidden border-b border-white/5">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.2), transparent 60%), radial-gradient(ellipse 40% 30% at 20% 20%, rgba(212,175,55,0.08), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-32 md:pt-40">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
            <span className="h-1 w-1 rounded-full bg-[#D4AF37]" />
            {integrations.length}+ integrations
          </p>
          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            Connect your{" "}
            <span className="bg-gradient-to-r from-[#6366F1] to-[#D4AF37] bg-clip-text text-transparent">
              entire stack.
            </span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-neutral-400 md:text-xl">
            OmniOS plugs into the tools your team already lives in. Sync data, trigger workflows, and bring context from every surface into one operating system.
          </p>
        </div>
      </section>

      <section className="sticky top-0 z-10 border-b border-white/5 bg-[#0A0A0F]/90 backdrop-blur">
        <nav aria-label="Integration categories" className="mx-auto max-w-6xl px-6">
          <ul className="flex flex-wrap gap-2 py-4">
            {categories.map((c) => (
              <li key={c.slug}>
                <a
                  href={`#${c.slug}`}
                  className="inline-flex rounded-full border border-white/10 bg-white/[0.02] px-4 py-1.5 text-xs font-medium text-neutral-300 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
                >
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <section id="all" className="scroll-mt-20 border-b border-white/5 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">All integrations</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              {integrations.length} total
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {integrations.map((item) => (
              <IntegrationCard key={item.name} item={item} />
            ))}
          </div>
        </div>
      </section>

      {orderedCategories.map((cat) => {
        const items = grouped[cat] ?? [];
        if (items.length === 0) return null;
        const slug = cat.toLowerCase();
        return (
          <section key={cat} id={slug} className="scroll-mt-20 border-b border-white/5 py-20">
            <div className="mx-auto max-w-6xl px-6">
              <div className="mb-10 flex items-end justify-between">
                <div>
                  <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">Category</p>
                  <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{cat}</h2>
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                  {items.length} integrations
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {items.map((item) => (
                  <IntegrationCard key={item.name} item={item} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#6366F1]/10 via-transparent to-[#D4AF37]/10 p-10 md:p-16">
            <div aria-hidden className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#D4AF37]/10 blur-3xl" />
            <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">Developer API</p>
                <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  Build your own integration.
                </h2>
                <p className="mt-4 text-neutral-400">
                  Need something we haven&rsquo;t shipped yet? Our REST and event APIs make it simple to wire OmniOS into any internal system. Webhooks, OAuth, fine-grained scopes, and typed SDKs included.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a href="/docs" className="rounded-lg bg-[#6366F1] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#5457e0]">
                    Read the docs
                  </a>
                  <a href="/docs#quickstart" className="rounded-lg border border-white/10 px-6 py-3 text-sm font-medium text-neutral-200 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]">
                    Quickstart
                  </a>
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#0A0A0F] p-6 font-mono text-xs leading-relaxed text-neutral-300">
                <div className="mb-3 text-neutral-500"># Create a webhook subscription</div>
                <div>
                  <span className="text-[#D4AF37]">curl</span> -X POST https://api.omnios.app/v1/webhooks \
                </div>
                <div className="pl-4">
                  -H <span className="text-[#6366F1]">&quot;Authorization: Bearer $OMNIOS_KEY&quot;</span> \
                </div>
                <div className="pl-4">
                  -d <span className="text-[#6366F1]">&apos;{"{ \"event\": \"doc.created\" }"}&apos;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
