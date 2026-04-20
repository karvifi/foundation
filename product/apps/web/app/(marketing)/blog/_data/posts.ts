export type Category = "tutorials" | "case-studies" | "product-updates" | "industry-insights";

export interface Author {
  name: string;
  role: string;
  initials: string;
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: Category;
  categoryLabel: string;
  publishedAt: string;
  readingMinutes: number;
  author: Author;
  featured?: boolean;
}

export const AUTHORS: Record<string, Author> = {
  kartik: { name: "Kartik Viswanathan", role: "Founder, OmniOS", initials: "KV" },
  maya: { name: "Maya Ostrowski", role: "Head of Product, OmniOS", initials: "MO" },
  jonas: { name: "Jonas Reinholt", role: "Principal Engineer", initials: "JR" },
  amara: { name: "Amara Okafor", role: "Customer Research", initials: "AO" },
};

export const POSTS: Post[] = [
  {
    slug: "best-ai-tools-for-small-business-2026",
    title: "The Best AI Tools for Small Business in 2026",
    excerpt:
      "We tested 147 AI tools across ten business categories. Here are the winners, the all-in-one option, and three realistic stacks for budgets under $200/month.",
    category: "industry-insights",
    categoryLabel: "Industry insight",
    publishedAt: "2026-04-15",
    readingMinutes: 13,
    author: AUTHORS.amara,
  },
  {
    slug: "how-to-replace-notion-with-ai-workspace",
    title: "How to Replace Notion with an AI-First Workspace",
    excerpt:
      "Ten reasons teams are leaving Notion in 2026, a full feature comparison with OmniOS, and the five-step migration guide we use with customers who switch.",
    category: "industry-insights",
    categoryLabel: "Industry insight",
    publishedAt: "2026-04-09",
    readingMinutes: 11,
    author: AUTHORS.maya,
  },
  {
    slug: "how-we-replaced-seven-saas-tools-with-one-command",
    title: "How We Replaced 7 SaaS Tools With One Command",
    excerpt:
      "The guide we used to retire Notion, Asana, HubSpot, QuickBooks, Slack, Zapier, and Calendly in a single afternoon. With real numbers.",
    category: "case-studies",
    categoryLabel: "Case study",
    publishedAt: "2026-04-04",
    readingMinutes: 9,
    author: AUTHORS.kartik,
    featured: true,
  },
  {
    slug: "omnios-vs-the-world-an-honest-comparison",
    title: "OmniOS vs The World: An Honest Comparison",
    excerpt:
      "Where OmniOS beats Notion, Salesforce, and ClickUp — and where it still loses. A frank, feature-by-feature comparison from the people who built it.",
    category: "industry-insights",
    categoryLabel: "Industry insight",
    publishedAt: "2026-03-20",
    readingMinutes: 14,
    author: AUTHORS.maya,
  },
  {
    slug: "building-your-first-workflow-in-90-seconds",
    title: "Building Your First Workflow in 90 Seconds",
    excerpt:
      "Step by step: from typing 'remind me to follow up with leads that went quiet' to a live, running workflow that watches your pipeline.",
    category: "tutorials",
    categoryLabel: "Tutorial",
    publishedAt: "2026-03-12",
    readingMinutes: 5,
    author: AUTHORS.jonas,
  },
  {
    slug: "why-local-ai-changes-everything-for-smbs",
    title: "Why Local AI Changes Everything for Small Businesses",
    excerpt:
      "On-device AI just crossed a price threshold. For small businesses, that means the end of the per-seat AI bill and the start of something much better.",
    category: "industry-insights",
    categoryLabel: "Industry insight",
    publishedAt: "2026-03-05",
    readingMinutes: 8,
    author: AUTHORS.jonas,
  },
  {
    slug: "omnimind-the-ai-that-knows-your-entire-business",
    title: "OmniMind: The AI That Knows Your Entire Business",
    excerpt:
      "Most AI tools can't see your data. OmniMind reads your pipeline, your docs, your finances, and your calendar — so it can actually help you get things done.",
    category: "product-updates",
    categoryLabel: "Product update",
    publishedAt: "2026-02-26",
    readingMinutes: 7,
    author: AUTHORS.maya,
  },
  {
    slug: "the-43000-dollar-saas-fragmentation-tax",
    title: "The $43,000 SaaS Bill (And How to Cut It)",
    excerpt:
      "We surveyed 312 growing companies. The average 10-person team spends $43,284/year on tools that overlap — and another $190K/year keeping them in sync.",
    category: "industry-insights",
    categoryLabel: "Industry insight",
    publishedAt: "2026-02-19",
    readingMinutes: 12,
    author: AUTHORS.amara,
  },
  {
    slug: "sprint-generation-from-one-sentence",
    title: "Turn One Sentence Into a Full Sprint",
    excerpt:
      "Type 'ship invoicing redesign by Friday' and OmniOS creates the tasks, assigns owners, writes acceptance criteria, and sets up a daily standup digest.",
    category: "tutorials",
    categoryLabel: "Tutorial",
    publishedAt: "2026-02-11",
    readingMinutes: 6,
    author: AUTHORS.jonas,
  },
  {
    slug: "how-tempo-creative-cut-ops-time-by-63-percent",
    title: "How Tempo Creative Cut Operations Time by 63%",
    excerpt:
      "A 22-person creative agency replaced six tools with OmniOS Business. Six months later, they reclaimed 840 hours of admin work and doubled their retainer revenue.",
    category: "case-studies",
    categoryLabel: "Case study",
    publishedAt: "2026-02-03",
    readingMinutes: 8,
    author: AUTHORS.amara,
  },
  {
    slug: "april-2026-release-notes",
    title: "April 2026: Branching Workflows, SOC 2 Type II, and 14 New Connectors",
    excerpt:
      "This month: conditional branching in Workflows, our SOC 2 Type II certification, and new connectors for Xero, DocuSign, Ramp, Mercury, and ten others.",
    category: "product-updates",
    categoryLabel: "Product update",
    publishedAt: "2026-01-31",
    readingMinutes: 4,
    author: AUTHORS.maya,
  },
  {
    slug: "what-we-learned-shipping-to-our-first-1000-teams",
    title: "What We Learned From Our First 1,000 Teams",
    excerpt:
      "Onboarding lessons, the feature we cut after 90 days, and the one request that came up in 71% of exit interviews. Everything we wish we knew at day zero.",
    category: "industry-insights",
    categoryLabel: "Industry insight",
    publishedAt: "2026-01-22",
    readingMinutes: 10,
    author: AUTHORS.kartik,
  },
];
