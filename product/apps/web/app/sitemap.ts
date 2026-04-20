import type { MetadataRoute } from "next";

const SITE_URL = "https://omnios.app";

const COMPETITORS = [
  "notion",
  "zapier",
  "linear",
  "hubspot",
  "airtable",
  "monday",
  "asana",
  "jira",
  "salesforce",
  "n8n",
] as const;

const SOLUTIONS = [
  "freelancers",
  "startups",
  "agencies",
  "enterprises",
] as const;

const BLOG_SLUGS = [
  "how-we-replaced-seven-saas-tools-with-one-command",
  "intent-native-computing-manifesto",
  "omnios-vs-the-world-an-honest-comparison",
  "building-your-first-workflow-in-90-seconds",
  "why-local-ai-changes-everything-for-smbs",
  "omnimind-the-ai-that-knows-your-entire-business",
  "the-43000-dollar-saas-fragmentation-tax",
  "sprint-generation-from-one-sentence",
  "how-tempo-creative-cut-ops-time-by-63-percent",
  "april-2026-release-notes",
  "what-we-learned-shipping-to-our-first-1000-teams",
  "connecting-stripe-in-thirty-seconds",
  "how-to-replace-notion-with-ai-workspace",
  "best-ai-tools-for-small-business-2026",
] as const;

const TOOL_SLUGS = [
  "saas-cost-calculator",
  "workflow-roi-calculator",
  "ai-readiness-assessment",
  "sprint-velocity-calculator",
] as const;

const TEMPLATE_SLUGS = [
  "crm-starter",
  "agency-operations",
  "founder-dashboard",
  "sales-pipeline",
  "customer-support-desk",
  "content-calendar",
  "hr-onboarding",
  "project-command-center",
  "finance-close",
  "ai-personal-assistant",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/features`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/ai`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/integrations`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/pricing`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/enterprise`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/security`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/changelog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/compare`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/solutions`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/templates`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/login`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/register`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/customers`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/legal/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/legal/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const comparisonPages: MetadataRoute.Sitemap = COMPETITORS.map(
    (competitor) => ({
      url: `${SITE_URL}/compare/${competitor}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }),
  );

  const solutionPages: MetadataRoute.Sitemap = SOLUTIONS.map((solution) => ({
    url: `${SITE_URL}/solutions/${solution}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = BLOG_SLUGS.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const templatePages: MetadataRoute.Sitemap = TEMPLATE_SLUGS.map((slug) => ({
    url: `${SITE_URL}/templates/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  const toolPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/tools`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    ...TOOL_SLUGS.map((slug) => ({
      url: `${SITE_URL}/tools/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  return [
    ...staticPages,
    ...comparisonPages,
    ...solutionPages,
    ...blogPages,
    ...templatePages,
    ...toolPages,
  ];
}
