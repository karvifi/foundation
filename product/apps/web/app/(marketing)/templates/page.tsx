import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Templates — Hit the ground running',
  description:
    'Production-ready templates for CRM, project management, finance, HR, marketing, operations, and AI workflows. Install in one click.',
  alternates: { canonical: 'https://foundation.dev/templates' },
  openGraph: {
    title: 'Templates — Foundation',
    description: 'Ten production-ready templates to hit the ground running.',
    url: 'https://foundation.dev/templates',
    type: 'website',
  },
};

type Category =
  | 'CRM'
  | 'Project Management'
  | 'Finance'
  | 'HR'
  | 'Marketing'
  | 'Operations'
  | 'AI-powered';

interface Template {
  slug: string;
  title: string;
  description: string;
  category: Category;
  blocks: number;
  gradient: string;
}

const CATEGORIES: ReadonlyArray<{ id: string; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'crm', label: 'CRM' },
  { id: 'project-management', label: 'Project Management' },
  { id: 'finance', label: 'Finance' },
  { id: 'hr', label: 'HR' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'operations', label: 'Operations' },
  { id: 'ai-powered', label: 'AI-powered' },
];

const CATEGORY_COLOR: Record<Category, string> = {
  CRM: 'text-sky-300 border-sky-500/30 bg-sky-500/10',
  'Project Management':
    'text-violet-300 border-violet-500/30 bg-violet-500/10',
  Finance: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10',
  HR: 'text-rose-300 border-rose-500/30 bg-rose-500/10',
  Marketing: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
  Operations: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10',
  'AI-powered': 'text-[#A5B4FC] border-[#6366F1]/40 bg-[#6366F1]/15',
};

const TEMPLATES: readonly Template[] = [
  {
    slug: 'agency-operations',
    title: 'Agency Operations',
    description:
      'Run a full-service agency end-to-end: clients, projects, retainers, time tracking, and invoicing in one workspace.',
    category: 'Operations',
    blocks: 42,
    gradient: 'from-cyan-500/40 via-sky-500/20 to-[#6366F1]/30',
  },
  {
    slug: 'crm-starter',
    title: 'CRM Starter',
    description:
      'A lightweight sales CRM with contacts, companies, deals, and a pipeline view. Perfect for small teams.',
    category: 'CRM',
    blocks: 18,
    gradient: 'from-sky-500/40 via-blue-500/20 to-indigo-500/30',
  },
  {
    slug: 'founder-dashboard',
    title: 'Founder Dashboard',
    description:
      'Weekly review, OKRs, investor updates, fundraising tracker, and hiring pipeline in one single pane.',
    category: 'Operations',
    blocks: 24,
    gradient: 'from-indigo-500/40 via-[#6366F1]/30 to-fuchsia-500/20',
  },
  {
    slug: 'sales-pipeline',
    title: 'Sales Pipeline',
    description:
      'Kanban-style pipeline with weighted forecasts, activity timeline, and automated stage reminders.',
    category: 'CRM',
    blocks: 22,
    gradient: 'from-blue-500/40 via-cyan-500/20 to-teal-500/30',
  },
  {
    slug: 'customer-support-desk',
    title: 'Customer Support Desk',
    description:
      'Ticket queue, SLA tracking, macros, and a customer-facing status page powered by one database.',
    category: 'Operations',
    blocks: 28,
    gradient: 'from-teal-500/40 via-cyan-500/20 to-blue-500/30',
  },
  {
    slug: 'content-calendar',
    title: 'Content Calendar',
    description:
      'Editorial calendar with briefs, drafts, approvals, and multi-channel publishing schedules.',
    category: 'Marketing',
    blocks: 20,
    gradient: 'from-amber-500/40 via-orange-500/20 to-rose-500/30',
  },
  {
    slug: 'hr-onboarding',
    title: 'HR Onboarding',
    description:
      'Structured 30-60-90 day onboarding plans, document checklists, and new-hire feedback loops.',
    category: 'HR',
    blocks: 26,
    gradient: 'from-rose-500/40 via-pink-500/20 to-fuchsia-500/30',
  },
  {
    slug: 'project-command-center',
    title: 'Project Command Center',
    description:
      'Portfolio view across all active projects with milestones, blockers, and weekly status rollups.',
    category: 'Project Management',
    blocks: 34,
    gradient: 'from-violet-500/40 via-purple-500/20 to-indigo-500/30',
  },
  {
    slug: 'finance-close',
    title: 'Finance Close',
    description:
      'Month-end close checklist, reconciliations, journal entry log, and audit-ready export.',
    category: 'Finance',
    blocks: 30,
    gradient: 'from-emerald-500/40 via-green-500/20 to-teal-500/30',
  },
  {
    slug: 'ai-personal-assistant',
    title: 'AI Personal Assistant',
    description:
      'A daily briefing, inbox triage, meeting prep, and goal tracker — all orchestrated by AI agents.',
    category: 'AI-powered',
    blocks: 16,
    gradient: 'from-[#6366F1]/50 via-fuchsia-500/20 to-violet-500/30',
  },
];

const FEATURED_SLUG = 'agency-operations';

export default function TemplatesPage() {
  const featured = TEMPLATES.find((t) => t.slug === FEATURED_SLUG);
  const rest = TEMPLATES.filter((t) => t.slug !== FEATURED_SLUG);

  if (!featured) {
    throw new Error(`Featured template "${FEATURED_SLUG}" not found`);
  }

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
        <div className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-[#6366F1]" />
            10 templates, one-click install
          </div>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight sm:text-7xl">
            Hit the ground running.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/60">
            Start from a proven setup instead of a blank page. Every template is
            production-ready, fully customizable, and installs into your
            workspace in seconds.
          </p>
        </div>
      </section>

      <nav
        aria-label="Template categories"
        className="sticky top-0 z-10 border-b border-white/5 bg-[#0A0A0F]/80 backdrop-blur"
      >
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-6 py-4">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 transition hover:border-[#6366F1]/50 hover:bg-[#6366F1]/10 hover:text-white"
            >
              {cat.label}
            </a>
          ))}
        </div>
      </nav>

      <section id="all" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-6 text-sm font-medium uppercase tracking-widest text-white/50">
          Featured
        </h2>
        <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
          <div
            aria-hidden
            className={`absolute inset-0 bg-gradient-to-br ${featured.gradient} opacity-60`}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/60 to-transparent"
          />
          <div className="relative grid gap-8 p-10 sm:p-14 lg:grid-cols-2">
            <div>
              <span
                className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs ${CATEGORY_COLOR[featured.category]}`}
              >
                {featured.category}
              </span>
              <h3 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                {featured.title}
              </h3>
              <p className="mt-5 max-w-xl text-lg text-white/70">
                {featured.description}
              </p>
              <div className="mt-6 flex items-center gap-4 text-sm text-white/60">
                <span>{featured.blocks} blocks</span>
                <span aria-hidden>·</span>
                <span>Free</span>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="rounded-lg bg-[#6366F1] px-5 py-3 font-medium text-white transition hover:bg-[#4F46E5]"
                >
                  Use template
                </Link>
                <Link
                  href={`/templates/${featured.slug}`}
                  className="rounded-lg border border-white/15 bg-white/5 px-5 py-3 font-medium text-white/90 transition hover:border-white/30 hover:bg-white/10"
                >
                  Preview
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/0 backdrop-blur-sm" />
            </div>
          </div>
        </article>

        <div className="mt-16">
          <h2 className="mb-6 text-sm font-medium uppercase tracking-widest text-white/50">
            All templates
          </h2>
          <ul role="list" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((t) => (
              <li
                key={t.slug}
                id={t.category.toLowerCase().replace(/\s+/g, '-')}
              >
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition hover:-translate-y-1 hover:border-[#6366F1]/40 hover:bg-white/[0.04]">
                  <div
                    aria-hidden
                    className={`relative h-36 bg-gradient-to-br ${t.gradient}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F]/60 to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs ${CATEGORY_COLOR[t.category]}`}
                      >
                        {t.category}
                      </span>
                      <span className="text-xs text-white/50">
                        {t.blocks} blocks
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold tracking-tight">
                      {t.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">
                      {t.description}
                    </p>
                    <div className="mt-6">
                      <Link
                        href="/register"
                        className="inline-flex w-full items-center justify-center rounded-lg bg-[#6366F1] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#4F46E5]"
                      >
                        Use template
                      </Link>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-white/5 bg-gradient-to-b from-transparent to-[#6366F1]/5">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-6 px-6 py-24 sm:items-center sm:text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Can&apos;t find what you need?
          </h2>
          <p className="max-w-xl text-white/60">
            Start from scratch — or let our AI assistant generate a custom
            template from a single prompt.
          </p>
          <Link
            href="/register"
            className="rounded-lg bg-[#6366F1] px-5 py-3 font-medium text-white transition hover:bg-[#4F46E5]"
          >
            Start free
          </Link>
        </div>
      </section>
    </main>
  );
}
