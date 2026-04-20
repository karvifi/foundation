import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Changelog — What shipped this week',
  description:
    'Release notes for the Foundation platform. New features, improvements, fixes, and security updates shipped each week.',
  alternates: { canonical: 'https://foundation.dev/changelog' },
  openGraph: {
    title: 'Changelog — Foundation',
    description: 'New features, improvements, and fixes shipped each week.',
    url: 'https://foundation.dev/changelog',
    type: 'website',
  },
};

type Category = 'New' | 'Improved' | 'Fixed' | 'Security';

interface Release {
  version: string;
  date: string;
  categories: Category[];
  title: string;
  bullets: string[];
  next: string;
}

const CATEGORY_STYLES: Record<Category, string> = {
  New: 'bg-[#6366F1]/15 text-[#A5B4FC] border-[#6366F1]/40',
  Improved: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  Fixed: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  Security: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
};

const RELEASES: readonly Release[] = [
  {
    version: 'v2.4.0',
    date: 'April 18, 2026',
    categories: ['New', 'Improved'],
    title: 'Workspace-wide AI actions and faster search',
    bullets: [
      'Introduced AI actions that can run across any workspace block from the command palette.',
      'Search is now 4x faster on workspaces above 10,000 pages thanks to a new inverted index.',
      'Added keyboard shortcut (Cmd+.) to trigger the AI assistant from anywhere.',
      'Collaborators list now shows live cursors in database views.',
    ],
    next: 'Next up: natural language formulas inside database fields.',
  },
  {
    version: 'v2.3.2',
    date: 'April 11, 2026',
    categories: ['Fixed', 'Security'],
    title: 'Session hardening and sync reliability',
    bullets: [
      'Rotated refresh token strategy and added device-level revocation from Settings.',
      'Fixed a race condition that could drop the last edit during rapid offline/online transitions.',
      'Patched a potential XSS vector in embedded iframe blocks (CVE pending disclosure).',
      'Resolved an issue where exported PDFs would occasionally omit the cover image.',
    ],
    next: 'Next up: SSO via SAML for Business tier.',
  },
  {
    version: 'v2.3.0',
    date: 'April 4, 2026',
    categories: ['New'],
    title: 'Templates gallery and one-click install',
    bullets: [
      'Launched 10 first-party templates ranging from CRM Starter to AI Personal Assistant.',
      'Template install now copies blocks, automations, and seed data in a single transaction.',
      'Added per-template preview routes with live demo workspaces.',
      'Published a public template JSON schema for community contributions.',
    ],
    next: 'Next up: community template marketplace with revenue sharing.',
  },
  {
    version: 'v2.2.1',
    date: 'March 28, 2026',
    categories: ['Improved', 'Fixed'],
    title: 'Editor polish and database view upgrades',
    bullets: [
      'Reduced block insertion latency from 180ms to 40ms on large documents.',
      'Kanban view now supports swim lanes grouped by a second property.',
      'Fixed drag-and-drop ghost artifacts in Safari 17.4+.',
      'Restored keyboard navigation inside nested toggle blocks.',
    ],
    next: 'Next up: timeline view with dependencies.',
  },
  {
    version: 'v2.2.0',
    date: 'March 21, 2026',
    categories: ['New', 'Improved'],
    title: 'Automations v2',
    bullets: [
      'Rewrote automation runtime on a durable workflow engine (Temporal-compatible).',
      'Added branching, retries with backoff, and human approval steps.',
      'New visual canvas for composing multi-step flows.',
      'Expanded library of 40+ native integrations including Linear, Stripe, and HubSpot.',
    ],
    next: 'Next up: scheduled runs with cron expressions.',
  },
  {
    version: 'v2.1.4',
    date: 'March 14, 2026',
    categories: ['Security', 'Fixed'],
    title: 'Audit log improvements',
    bullets: [
      'Audit log now captures workspace permission changes at row-level granularity.',
      'Exportable to CSV and streamable to SIEM targets (Datadog, Splunk).',
      'Fixed an issue where API keys could appear truncated in the settings UI.',
      'Tightened CSP headers on the marketing site.',
    ],
    next: 'Next up: SOC 2 Type II report refresh.',
  },
  {
    version: 'v2.1.0',
    date: 'March 7, 2026',
    categories: ['New'],
    title: 'Public API and webhooks',
    bullets: [
      'Shipped a stable REST API covering pages, databases, users, and automations.',
      'Added signed webhook deliveries with configurable retries.',
      'Published an OpenAPI spec and TypeScript SDK on npm.',
      'Rate limits now visible in response headers and the developer portal.',
    ],
    next: 'Next up: GraphQL gateway for aggregated reads.',
  },
  {
    version: 'v2.0.0',
    date: 'February 28, 2026',
    categories: ['New', 'Improved'],
    title: 'Foundation 2.0 — the big one',
    bullets: [
      'Brand new editor built on a CRDT core for instant multiplayer.',
      'Redesigned navigation with workspace switcher and pinned spaces.',
      'Performance: p95 page load down 62% vs 1.x.',
      'Dark mode refresh across all surfaces with OKLCH color tokens.',
      'Migration tool to bring 1.x workspaces over with zero downtime.',
    ],
    next: 'Next up: mobile apps for iOS and Android (beta in May).',
  },
];

export default function ChangelogPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0F] text-white">
      <section className="relative overflow-hidden border-b border-white/5">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 0%, rgba(99,102,241,0.35) 0%, rgba(10,10,15,0) 70%)',
          }}
        />
        <div className="relative mx-auto max-w-5xl px-6 py-28 sm:py-36">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-[#6366F1]" />
            Weekly releases
          </div>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight sm:text-7xl">
            Changelog.
            <span className="block text-white/60">What shipped this week.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/60">
            Every Friday we ship. Here is the running log of features, fixes,
            and security work the team has landed.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20">
        <ol className="relative space-y-14">
          <div
            aria-hidden
            className="absolute left-[7px] top-2 bottom-2 hidden w-px bg-gradient-to-b from-[#6366F1]/60 via-white/10 to-transparent sm:block"
          />
          {RELEASES.map((release) => (
            <li key={release.version} className="relative sm:pl-10">
              <span
                aria-hidden
                className="absolute left-0 top-2 hidden h-4 w-4 rounded-full border-2 border-[#6366F1] bg-[#0A0A0F] sm:block"
              />
              <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition hover:border-[#6366F1]/40 hover:bg-white/[0.04]">
                <header className="flex flex-wrap items-center gap-3">
                  <span className="rounded-md border border-[#6366F1]/40 bg-[#6366F1]/10 px-2.5 py-1 font-mono text-sm text-[#A5B4FC]">
                    {release.version}
                  </span>
                  <time className="text-sm text-white/50">{release.date}</time>
                  <div className="ml-auto flex flex-wrap gap-2">
                    {release.categories.map((cat) => (
                      <span
                        key={cat}
                        className={`rounded-full border px-2.5 py-0.5 text-xs ${CATEGORY_STYLES[cat]}`}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </header>
                <h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {release.title}
                </h2>
                <ul className="mt-5 space-y-2.5">
                  {release.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-white/75">
                      <span
                        aria-hidden
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6366F1]"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 border-t border-white/5 pt-4 text-sm text-white/50">
                  <span className="font-medium text-white/70">
                    What&apos;s next:{' '}
                  </span>
                  {release.next}
                </p>
              </article>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-white/5 bg-gradient-to-b from-transparent to-[#6366F1]/5">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-6 px-6 py-24 sm:items-center sm:text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Get the changelog in your inbox.
          </h2>
          <p className="max-w-xl text-white/60">
            One short email every Friday. No marketing fluff — just the release
            notes and what is coming next.
          </p>
          <form
            action="mailto:changelog@foundation.dev"
            method="post"
            encType="text/plain"
            className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@company.com"
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/30"
            />
            <button
              type="submit"
              className="rounded-lg bg-[#6366F1] px-5 py-3 font-medium text-white transition hover:bg-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/50"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-white/40">
            Unsubscribe anytime. We never share your email.
          </p>
        </div>
      </section>
    </main>
  );
}
