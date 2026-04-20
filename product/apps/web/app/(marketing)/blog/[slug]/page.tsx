import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS } from "../_data/posts";
import { POST_BODIES } from "../_content/posts";

const FULL_POST_LEGACY = {
  toc: [
    { id: "the-bill-we-refused-to-pay", label: "The bill we refused to pay" },
    { id: "the-one-command", label: "The one command" },
    { id: "day-one-the-crm", label: "Day one: the CRM" },
    { id: "day-two-docs-and-project-management", label: "Day two: docs and PM" },
    { id: "day-three-finance-and-calendaring", label: "Day three: finance and calendaring" },
    { id: "what-broke-and-what-did-not", label: "What broke (and what did not)" },
    { id: "the-receipts", label: "The receipts" },
    { id: "what-we-learned", label: "What we learned" },
  ],
  html: `
    <p class="lead">We are a sixteen-person company. Last quarter we were paying $4,812 a month for software. Most of it was plumbing — tools that existed to keep other tools honest. This is the story of how we retired seven of them in a single afternoon, what we saved, what broke, and what we would do differently.</p>

    <h2 id="the-bill-we-refused-to-pay">The bill we refused to pay</h2>
    <p>The bill came on the first of the month, the way bills do. What made this one different was the second page. There were twenty-three line items. Every one of them was a tool somebody on the team had signed up for — with genuine need, at the time — and which had since become slightly more expensive, slightly less loved, and absolutely critical to somebody's daily work.</p>
    <p>We did the audit the way most teams do: a spreadsheet, a column for each tool, a column for what it replaced when we bought it, and a column for how many people actually logged in that month. The answers were ugly.</p>
    <ul>
      <li><strong>Notion</strong>: 16 seats. 4 daily actives. $288/mo.</li>
      <li><strong>Asana Advanced</strong>: 16 seats. 3 daily actives. $399/mo.</li>
      <li><strong>HubSpot Starter</strong>: 3 seats. Mostly used as a glorified address book. $180/mo.</li>
      <li><strong>QuickBooks Online Advanced</strong>: 2 seats, but billed 5. $200/mo.</li>
      <li><strong>Slack Business+</strong>: $240/mo, used mostly to link to other tools.</li>
      <li><strong>Zapier Professional</strong>: $149/mo, running 14 zaps nobody had audited in a year.</li>
      <li><strong>Calendly Teams</strong>: $144/mo, for scheduling that our CRM should have done.</li>
    </ul>
    <p>Total: $1,600/mo in plumbing. None of it producing. All of it needing attention — logins, seat adjustments, permission clean-up when somebody left, the Zapier failures that woke the on-call engineer at 3 a.m. last Tuesday.</p>

    <h2 id="the-one-command">The one command</h2>
    <p>We had been building OmniOS for nine months. It was meant to end exactly this — to take the work that was sloshing between dashboards and put it inside a single surface that ran on intent. We had been using it ourselves, but carefully, in parallel with everything else. A dogfooding safety net.</p>
    <p>On a Thursday, we cut the net.</p>
    <p>The command, typed into OmniOS's omnibar at 1:42 p.m.:</p>
    <blockquote>Migrate us off Notion, Asana, HubSpot, QuickBooks, Slack, Zapier, and Calendly. Preserve history. Map roles. Confirm before anything destructive. Start with what's lowest risk.</blockquote>
    <p>OmniOS did what it does. It proposed a plan. It asked three clarifying questions — which QuickBooks entity was the real one, whether to keep Slack archives readable after the cutover, and which of our Zapier zaps we wanted to rebuild as OmniOS Workflows instead of letting die. We answered. It started working.</p>

    <h2 id="day-one-the-crm">Day one: the CRM</h2>
    <p>HubSpot went first. It was the easiest. Three users, a few hundred contacts, a pipeline that had never really been used the way pipelines are supposed to be used. OmniOS connected via the HubSpot API, pulled contacts, deals, companies, and activities, and rebuilt the pipeline inside its own CRM in twelve minutes.</p>
    <p>The interesting part was the merge. We had duplicates across HubSpot and Notion (yes, we used Notion as a second CRM, which should tell you everything). OmniOS noticed, asked which record was canonical, and merged on our confirmation. An hour later, the CRM was live, the old HubSpot seats were parked on read-only, and two salespeople said they felt a kind of unfamiliar calm.</p>

    <h2 id="day-two-docs-and-project-management">Day two: docs and project management</h2>
    <p>Notion and Asana went together. This was the scary one. We had 1,840 Notion pages and 612 active Asana tasks. OmniOS imported the Notion tree as-is, preserved the hierarchy, and kept the Asana task ownership intact. Then it did something we had not specifically asked for: it linked tasks to the doc pages that mentioned them. Sprint goals, specs, and their children all wound up in the same query-able graph.</p>
    <p>This is where the AI-native thing starts to feel unavoidable. Inside Notion, a task was a copy of a task. Inside OmniOS, a task <em>is</em> the task. Moving the status in one place moves it everywhere. We spent the rest of the afternoon watching tasks we had forgotten about auto-close because their parent deals had been marked lost weeks earlier. Twenty-three phantom tasks evaporated. Nobody missed them.</p>

    <h2 id="day-three-finance-and-calendaring">Day three: finance and calendaring</h2>
    <p>QuickBooks was the longest conversation. Accounting data is the one place where &ldquo;it looked fine&rdquo; is never enough. OmniOS imported the chart of accounts, mapped our categories, and pulled twenty-four months of transactions. The reconciliation it did on arrival caught four miscategorized expenses and a credit we had never applied. Our bookkeeper, who was sceptical at 9 a.m., was enthusiastic by lunch.</p>
    <p>Calendly was a five-minute job: booking pages became OmniOS scheduling links, attached to the right CRM contacts, with automatic follow-up drafts prepared the moment a meeting ended. Slack was the hardest emotionally and easiest mechanically — exporting history, granting it a read-only afterlife, and flipping conversation into OmniOS threads tied to the records they were about.</p>
    <p>The last thing to die was Zapier. We had fourteen zaps. OmniOS rebuilt nine of them as native Workflows, flagged three as redundant, and told us two were doing nothing at all because the API on the other end had been deprecated four months ago. We cancelled Zapier on the spot.</p>

    <h2 id="what-broke-and-what-did-not">What broke (and what did not)</h2>
    <p>Two things broke. The first: a Calendly embed on our public site that pointed to a URL that no longer existed. It was a fifteen-second fix, but it was down for an hour before anyone noticed. The second: one of our sales reps had been using a specific Notion database view as her personal CRM, and when it became a first-class OmniOS view, the sort order changed. She was cheerful about it. We added it to the migration checklist.</p>
    <p>What did not break: everything customer-facing. The CRM kept answering emails. The calendar kept booking meetings. Invoices kept going out. We flipped the old tools to read-only for ninety days as a safety net. We have not opened them since week two.</p>

    <h2 id="the-receipts">The receipts</h2>
    <p>Exact savings, monthly:</p>
    <ul>
      <li>Retired SaaS: <strong>$1,600/mo</strong></li>
      <li>Replaced Zapier volume in Workflows: <strong>$149/mo</strong></li>
      <li>Retired duplicate seats and surprise upgrades: <strong>$412/mo</strong></li>
      <li>OmniOS Team (16 seats, annual): <strong>$720/mo</strong></li>
      <li><strong>Net savings: $1,441/mo, or $17,292/yr</strong></li>
    </ul>
    <p>The dollar savings are real. The time savings are bigger. Our ops lead tracked her context-switching count for a week before and a week after. Before: 197 app switches per day. After: 34. She estimates — conservatively — that she reclaimed six hours a week. Across the company, that is an entire additional engineer we did not have to hire.</p>

    <h2 id="what-we-learned">What we learned</h2>
    <p>Three lessons, in order of importance.</p>
    <p><strong>One: the cost of plumbing is the cost that compounds.</strong> Every dashboard you run is a small, infinite request for your attention. The money is the visible bill. The time is the invisible one. Both stop the moment you stop running the plumbing.</p>
    <p><strong>Two: merge-on-import is the whole ball game.</strong> A tool that swallows your existing data but keeps its own copy of the world is not consolidating your stack — it is just joining it. OmniOS succeeded because the pipeline is not a bag of tools behind one login. It is one system that happens to look like the tools you used to use.</p>
    <p><strong>Three: you can do this in an afternoon.</strong> You do not need a quarterly migration plan and a steering committee. You need ninety minutes, the right command, and the willingness to ignore the voice in your head saying this is reckless. It is less reckless than the status quo. The status quo is what sent you the bill.</p>
    <p>If you want the full migration checklist we used — including the read-only afterlife policy, the permission-map template, and the Zapier audit sheet — <a href="/register">start a free OmniOS trial</a> and we will send it to your inbox on day one.</p>
  `,
};

interface Params {
  slug: string;
}

export function generateStaticParams(): Params[] {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) {
    return { title: "Post not found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://omnios.app/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url: `https://omnios.app/blog/${post.slug}`,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const url = `https://omnios.app/blog/${post.slug}`;
  const twitterShare = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}`;
  const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const body =
    post.slug === "how-we-replaced-seven-saas-tools-with-one-command"
      ? FULL_POST_LEGACY
      : POST_BODIES[post.slug];
  const related = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: "OmniOS, Inc.",
      url: "https://omnios.app",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://omnios.app" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://omnios.app/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: post.author.name,
    jobTitle: post.author.role,
    worksFor: { "@type": "Organization", name: "OmniOS, Inc." },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />

      <article className="mx-auto max-w-3xl px-6 pt-24 pb-8 sm:pt-32">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/40">
          <Link href="/" className="hover:text-white/70">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/blog" className="hover:text-white/70">
            Blog
          </Link>
          <span aria-hidden="true">/</span>
          <span className="truncate text-white/60">{post.categoryLabel}</span>
        </nav>

        <header className="mt-8">
          <span className="inline-flex items-center rounded-full bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#D4AF37]">
            {post.categoryLabel}
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 text-lg text-white/60">{post.excerpt}</p>

          <div className="mt-8 flex flex-wrap items-center gap-4 border-b border-white/10 pb-8 text-sm text-white/50">
            <span className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-xs font-semibold text-white"
              >
                {post.author.initials}
              </span>
              <span className="flex flex-col leading-tight">
                <span className="font-medium text-white">{post.author.name}</span>
                <span className="text-xs text-white/40">{post.author.role}</span>
              </span>
            </span>
            <span aria-hidden="true" className="text-white/20">
              ·
            </span>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <span aria-hidden="true" className="text-white/20">
              ·
            </span>
            <span>{post.readingMinutes} min read</span>
          </div>
        </header>
      </article>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 pb-24 lg:grid-cols-[1fr_260px]">
        <div className="order-2 lg:order-1">
          {body ? (
            <div
              className="prose-invert prose-lg max-w-none text-white/80"
              style={{ lineHeight: 1.75 }}
            >
              <style>{`
                .prose-invert h2 { font-size: 1.5rem; font-weight: 600; letter-spacing: -0.01em; margin-top: 2.5rem; margin-bottom: 0.75rem; color: #fff; scroll-margin-top: 6rem; }
                .prose-invert h2::before { content: "§ "; color: #D4AF37; opacity: 0.6; }
                .prose-invert p { margin: 1.1rem 0; color: rgba(255,255,255,0.75); }
                .prose-invert p.lead { font-size: 1.125rem; color: rgba(255,255,255,0.9); }
                .prose-invert ul, .prose-invert ol { padding-left: 1.5rem; margin: 1rem 0; color: rgba(255,255,255,0.7); }
                .prose-invert ul { list-style: disc; }
                .prose-invert ol { list-style: decimal; }
                .prose-invert li { margin: 0.4rem 0; }
                .prose-invert strong { color: #fff; font-weight: 600; }
                .prose-invert a { color: #A5B4FC; text-decoration: underline; text-underline-offset: 3px; }
                .prose-invert a:hover { color: #C7CBFE; }
                .prose-invert blockquote { border-left: 3px solid #6366F1; padding: 0.5rem 0 0.5rem 1.25rem; margin: 1.5rem 0; color: rgba(255,255,255,0.85); font-style: italic; background: rgba(99,102,241,0.04); border-radius: 0 8px 8px 0; }
                .prose-invert em { color: rgba(255,255,255,0.85); }
                .prose-invert table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem; }
                .prose-invert th { text-align: left; padding: 0.6rem 0.75rem; background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.9); border-bottom: 1px solid rgba(255,255,255,0.1); }
                .prose-invert td { padding: 0.6rem 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.06); color: rgba(255,255,255,0.7); }
                .prose-invert code { font-family: 'JetBrains Mono', monospace; font-size: 0.85em; background: rgba(255,255,255,0.07); padding: 0.15em 0.4em; border-radius: 4px; color: #A5B4FC; }
                .prose-invert kbd { font-family: 'JetBrains Mono', monospace; font-size: 0.8em; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 0.1em 0.4em; border-radius: 4px; }
              `}</style>
              <div dangerouslySetInnerHTML={{ __html: body.html }} />
            </div>
          ) : (
            <div className="space-y-6 text-white/75">
              <p className="text-lg leading-relaxed">{post.excerpt}</p>
              <p className="leading-relaxed">
                This post is part of the OmniOS {post.categoryLabel.toLowerCase()} series. We are
                finalising the full write-up — if you want to be notified when it lands, subscribe
                via RSS or start a free OmniOS trial and we will email you when it goes live.
              </p>

              <div className="rounded-2xl border border-[#6366F1]/30 bg-[#6366F1]/5 p-6">
                <h2 className="text-lg font-semibold text-white">What you will learn</h2>
                <ul className="mt-4 space-y-2 text-sm text-white/70">
                  <li className="flex gap-2">
                    <span className="text-[#6366F1]">→</span>
                    <span>The concrete problem this post addresses for OmniOS customers.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#6366F1]">→</span>
                    <span>The architectural decision or product insight behind it.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#6366F1]">→</span>
                    <span>What it means for your team this quarter.</span>
                  </li>
                </ul>
              </div>

              <p className="leading-relaxed">
                Meanwhile, the best way to understand what we are talking about is to hold it in
                your hands. OmniOS is free to try for 14 days — no credit card, no retention call
                on cancel.
              </p>

              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-[#6366F1] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(99,102,241,0.6)] hover:bg-[#5558E3]"
              >
                Start your free trial
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}

          <section aria-labelledby="share-heading" className="mt-16 border-t border-white/10 pt-8">
            <h2 id="share-heading" className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
              Share this post
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={twitterShare}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
              >
                Share on X
              </a>
              <a
                href={linkedinShare}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
              >
                Share on LinkedIn
              </a>
              <a
                href={url}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
              >
                Copy link
              </a>
            </div>
          </section>

          <section
            aria-labelledby="author-bio-heading"
            className="mt-12 rounded-2xl border border-white/10 bg-[#13131A] p-6"
          >
            <h2 id="author-bio-heading" className="sr-only">
              About the author
            </h2>
            <div className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-base font-semibold text-white"
              >
                {post.author.initials}
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{post.author.name}</p>
                <p className="mt-0.5 text-xs text-white/50">{post.author.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {post.author.name.split(" ")[0]} writes about AI-powered software, SMB
                  software economics, and the long tail of dashboards no one should have to open.
                  Reach them at <span className="text-[#A5B4FC]">team@omnios.app</span>.
                </p>
              </div>
            </div>
          </section>
        </div>

        <aside className="order-1 lg:order-2" aria-label="Table of contents">
          <div className="sticky top-24 rounded-2xl border border-white/10 bg-[#13131A] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
              On this page
            </p>
            <ol className="mt-4 space-y-2 text-sm">
              {(body ? body.toc : [{ id: "top", label: post.title }]).map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="block border-l border-white/10 pl-3 text-white/60 hover:border-[#6366F1] hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>

      <section
        aria-labelledby="related-heading"
        className="border-t border-white/5 bg-[#07070C] py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <h2 id="related-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Keep reading
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="group flex flex-col rounded-2xl border border-white/10 bg-[#13131A] p-5 transition-all hover:-translate-y-0.5 hover:border-[#6366F1]/40"
              >
                <span className="inline-flex w-fit items-center rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/60">
                  {r.categoryLabel}
                </span>
                <h3 className="mt-4 text-base font-semibold text-white group-hover:text-[#C7CBFE]">
                  {r.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-white/55">{r.excerpt}</p>
                <span className="mt-auto pt-4 text-xs text-white/40">{r.readingMinutes} min read</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
