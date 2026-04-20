import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "./_data/posts";
import type { Post, Category, Author } from "./_data/posts";

export const metadata: Metadata = {
  title: "OmniOS Blog — AI productivity, AI-powered software, and SMB software",
  description:
    "The OmniOS blog. Tutorials, case studies, product updates, and honest takes on the future of AI-native work. Written by the team building the AI-powered business platform.",
  keywords: [
    "OmniOS blog",
    "AI productivity blog",
    "AI-powered software",
    "AI workspace tutorials",
    "SMB software case studies",
    "SaaS consolidation",
  ],
  alternates: { canonical: "https://omnios.app/blog" },
  openGraph: {
    type: "website",
    url: "https://omnios.app/blog",
    title: "OmniOS Blog — AI productivity and AI-powered software",
    description:
      "Tutorials, case studies, product updates, and industry insights from the team building OmniOS.",
  },
  twitter: {
    card: "summary_large_image",
    title: "OmniOS Blog — AI productivity and AI-powered software",
    description:
      "Tutorials, case studies, product updates, and industry insights from the team building OmniOS.",
  },
};


const CATEGORIES: Array<{ id: Category | "all"; label: string }> = [
  { id: "all", label: "All posts" },
  { id: "tutorials", label: "Tutorials" },
  { id: "case-studies", label: "Case studies" },
  { id: "product-updates", label: "Product updates" },
  { id: "industry-insights", label: "Industry insights" },
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

const blogLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "OmniOS Blog",
  url: "https://omnios.app/blog",
  description:
    "Tutorials, case studies, product updates, and industry insights from the team building OmniOS.",
  publisher: {
    "@type": "Organization",
    name: "OmniOS, Inc.",
    url: "https://omnios.app",
  },
  blogPost: POSTS.map((post) => ({
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    url: `https://omnios.app/blog/${post.slug}`,
    author: { "@type": "Person", name: post.author.name },
    publisher: {
      "@type": "Organization",
      name: "OmniOS, Inc.",
    },
    mainEntityOfPage: `https://omnios.app/blog/${post.slug}`,
  })),
};

export default function BlogIndexPage() {
  const featured = POSTS.find((p) => p.featured) ?? POSTS[0];
  const rest = POSTS.filter((p) => p.slug !== featured.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }}
      />

      <section className="mx-auto max-w-7xl px-6 pt-24 pb-8 sm:pt-32">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
              OmniOS Journal
            </p>
            <h1 className="mt-3 text-5xl font-semibold tracking-tight sm:text-6xl">
              Ideas for the AI era.
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white/60">
              Tutorials, case studies, product updates, and honest industry takes from the people
              building the operating system that replaces your SaaS stack.
            </p>
          </div>
          <Link
            href="/blog/rss.xml"
            className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/70 hover:text-white sm:self-end"
          >
            <span aria-hidden="true">❋</span> Subscribe via RSS
          </Link>
        </div>

        <div
          className="mt-8 flex flex-wrap gap-2"
          role="navigation"
          aria-label="Filter blog posts by category"
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.id === "all" ? "/blog" : `/blog?category=${cat.id}`}
              className="rounded-full border border-white/10 bg-[#13131A] px-4 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-[#6366F1]/40 hover:text-white"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <Link
          href={`/blog/${featured.slug}`}
          className="group grid gap-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#13131A] via-[#13131A] to-[#1C1C26] p-6 transition-all hover:border-[#6366F1]/40 md:grid-cols-5 md:p-10"
        >
          <div className="md:col-span-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#D4AF37]">
              Featured · {featured.categoryLabel}
            </span>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white group-hover:text-[#C7CBFE] md:text-4xl">
              {featured.title}
            </h2>
            <p className="mt-4 text-base text-white/60 md:text-lg">{featured.excerpt}</p>

            <div className="mt-8 flex items-center gap-4 text-sm text-white/50">
              <AuthorBadge author={featured.author} />
              <span aria-hidden="true">·</span>
              <time dateTime={featured.publishedAt}>{formatDate(featured.publishedAt)}</time>
              <span aria-hidden="true">·</span>
              <span>{featured.readingMinutes} min read</span>
            </div>
          </div>
          <div className="relative md:col-span-2">
            <div className="flex h-full min-h-[220px] items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-[#6366F1]/20 via-[#8B5CF6]/10 to-transparent">
              <span className="text-6xl font-bold tracking-tighter text-white/20">OS</span>
            </div>
          </div>
        </Link>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-32">
        <h2 className="sr-only">Recent posts</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col rounded-2xl border border-white/10 bg-[#13131A] p-6 transition-all hover:-translate-y-0.5 hover:border-[#6366F1]/40"
            >
              <span className="inline-flex w-fit items-center rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/60">
                {post.categoryLabel}
              </span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-white transition-colors group-hover:text-[#C7CBFE]"
                >
                  {post.title}
                </Link>
              </h3>
              <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-white/55">
                {post.excerpt}
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4 text-xs text-white/50">
                <AuthorBadge author={post.author} size="sm" />
                <span className="flex items-center gap-2">
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  <span aria-hidden="true">·</span>
                  <span>{post.readingMinutes} min</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function AuthorBadge({ author, size = "md" }: { author: Author; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "h-6 w-6 text-[10px]" : "h-9 w-9 text-xs";
  return (
    <span className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className={`${dim} flex items-center justify-center rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] font-semibold text-white`}
      >
        {author.initials}
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-medium text-white/80">{author.name}</span>
        {size === "md" ? (
          <span className="text-[11px] text-white/40">{author.role}</span>
        ) : null}
      </span>
    </span>
  );
}
