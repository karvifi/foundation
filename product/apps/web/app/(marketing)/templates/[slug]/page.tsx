import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Persona {
  title: string;
  description: string;
}

interface TemplateStep {
  name: string;
  description: string;
}

interface TemplateDetail {
  slug: string;
  title: string;
  category: string;
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  longDescription: string;
  features: readonly string[];
  preview: string;
  personas: readonly Persona[];
  workflow: readonly TemplateStep[];
  related: readonly string[];
}

const TEMPLATES: Record<string, TemplateDetail> = {
  "sales-pipeline-crm": {
    slug: "sales-pipeline-crm",
    title: "Sales Pipeline CRM",
    category: "CRM",
    tagline: "Track every deal from first touch to closed-won.",
    metaTitle: "Free Sales Pipeline CRM Template | OmniOS",
    metaDescription:
      "A complete CRM template with deal stages, forecasting, AI follow-up drafts, and call logging. Free forever on OmniOS Community.",
    longDescription:
      "The Sales Pipeline CRM is the exact template our own GTM team uses to run outbound and inbound pipeline across twelve stages, from cold outreach through renewal. It ships with five opinionated pipeline stages (Lead, Qualified, Demo, Proposal, Closed), but every stage, field, and automation is editable in a single keystroke because everything is built on OmniCore primitives — the same primitives that power the rest of OmniOS. Deals are automatically enriched with company data, every email and call is logged without a browser extension, and OmniMind drafts follow-up messages whenever a deal has been idle for more than 72 hours. Forecasts update in real time as deals move between stages, and the weighted revenue view gives finance a defensible number without a spreadsheet export. Unlike Salesforce, there are no per-seat licenses, no hidden add-ons for email sync, and no implementation consultant required. Unlike HubSpot, the data never leaves your device when you run OmniOS locally. Import your existing pipeline from any CSV, Salesforce export, or HubSpot sync in under three minutes, or start from a blank canvas and let OmniMind generate sensible defaults based on your industry and deal size. Teams from two-person startups to hundred-person revenue organizations run their entire sales operation on this template, and every field, automation, and report is yours to own and fork.",
    features: [
      "Five pipeline stages pre-configured with win-rate defaults",
      "Automatic email and call logging — no browser extension",
      "AI-drafted follow-ups when deals sit idle beyond 72 hours",
      "Weighted revenue forecast with confidence bands",
      "Company enrichment from domain (firmographics, employee count, funding)",
      "Deal rooms with shared documents and guest access for prospects",
      "Slack and Teams notifications on stage changes",
      "CSV, Salesforce, and HubSpot importers",
      "Custom properties with field-level permissions",
      "Reporting dashboard with pipeline velocity and conversion rates",
    ],
    preview:
      "A kanban board with columns for each pipeline stage. Each deal card shows company logo, amount, close date, and last activity. A right-hand inspector opens when you click a deal, showing the full timeline, linked contacts, email threads, and AI-suggested next step. The top of the page shows weighted pipeline value, forecast vs. quota, and deals at risk.",
    personas: [
      {
        title: "Founding Account Executive",
        description:
          "You sell the product and close the deals yourself. You need a CRM that stays out of the way and doesn't demand 30 minutes of admin per day.",
      },
      {
        title: "Head of Revenue at a Series B startup",
        description:
          "You manage a team of 6-20 reps and need forecast accuracy without paying $165/user/month to Salesforce.",
      },
      {
        title: "Agency Owner",
        description:
          "You run retainers and project work. You need pipeline clarity across multiple clients without juggling five tools.",
      },
    ],
    workflow: [
      { name: "Import your contacts", description: "Upload a CSV or sync from your existing CRM in under three minutes." },
      { name: "Configure pipeline stages", description: "Accept the defaults or rename stages to match your sales motion." },
      { name: "Connect email and calendar", description: "Gmail, Outlook, and any CalDAV provider sync two-way automatically." },
      { name: "Create your first deal", description: "Type a company name. OmniMind enriches firmographics and links existing contacts." },
      { name: "Let OmniMind follow up", description: "Idle deals receive AI-drafted follow-ups ready for your review and send." },
    ],
    related: ["recruiting-pipeline", "customer-support-queue", "monthly-financial-report"],
  },
  "sprint-planning-board": {
    slug: "sprint-planning-board",
    title: "Sprint Planning Board",
    category: "Projects",
    tagline: "Ship two-week sprints without the ceremony tax.",
    metaTitle: "Free Sprint Planning Board Template | OmniOS",
    metaDescription:
      "Plan sprints, track velocity, generate standup notes, and ship on time. Jira alternative, free on OmniOS.",
    longDescription:
      "The Sprint Planning Board replaces Jira for teams who want agile structure without agile theater. It's built around two-week iterations with automatic velocity calculation, burndown charts that update as you complete tasks, and a daily standup generator that reads the board state and drafts a three-bullet update for each engineer. Stories support the full workflow: backlog, ready, in progress, code review, QA, done. Epics group related stories across sprints, and roadmap view shows what's shipping in the next quarter. Every story can be tagged with a component owner, estimated in story points or hours, and linked to a GitHub or GitLab pull request. When the PR merges, the story moves itself to Done. Sprint retrospectives are baked in as a collaborative document that captures what went well, what didn't, and action items that carry forward. Unlike Jira, the board is fast — sub-50ms interactions even with thousands of stories — and unlike Linear, it's free forever on the Community tier. Every project manager who has used both Jira and this template has chosen this one. The board ships with sensible defaults pulled from the most successful engineering teams we've studied, but every column, field, and automation is editable. Import existing tickets from Jira, Linear, GitHub Issues, or Shortcut with a one-click migrator that preserves history, comments, and attachments.",
    features: [
      "Two-week iteration model with automatic velocity calculation",
      "Real-time burndown chart updated as stories complete",
      "AI standup generator reads the board and drafts updates per person",
      "Component ownership with auto-assignment rules",
      "GitHub and GitLab PR linking with auto-transitions",
      "Retrospective document template for every sprint",
      "Roadmap view grouping epics across quarters",
      "Story point or hours-based estimation with confidence intervals",
      "Slack integration for standup delivery and PR notifications",
      "Migrators from Jira, Linear, GitHub Issues, and Shortcut",
    ],
    preview:
      "A horizontal kanban with six columns (Backlog, Ready, In Progress, Code Review, QA, Done). Each story card shows title, assignee avatar, estimate, and linked PR status. The top strip shows sprint goal, days remaining, burndown trend, and velocity over the last five sprints. A left sidebar shows epics and filters by component.",
    personas: [
      {
        title: "Engineering Manager at a growth-stage startup",
        description:
          "You have 5-25 engineers and need visibility without running sync meetings all day.",
      },
      {
        title: "Solo technical founder",
        description:
          "You're building the MVP and need a list more serious than a Notion page but less heavy than Jira.",
      },
      {
        title: "Platform team lead",
        description:
          "You maintain shared infrastructure and need component ownership to route incoming requests correctly.",
      },
    ],
    workflow: [
      { name: "Import your backlog", description: "One-click migration from Jira, Linear, or GitHub Issues preserves comments and history." },
      { name: "Set your first sprint goal", description: "Define a single-sentence outcome the team is committing to." },
      { name: "Drag stories into the sprint", description: "Capacity indicator warns when you exceed average velocity." },
      { name: "Connect your GitHub repo", description: "Merged PRs transition stories to Done automatically." },
      { name: "Run standup from the board", description: "OmniMind drafts per-engineer updates. Review, edit, and ship to Slack." },
    ],
    related: ["bug-tracker", "product-roadmap", "customer-support-queue"],
  },
  "client-invoice-tracker": {
    slug: "client-invoice-tracker",
    title: "Client Invoice Tracker",
    category: "Finance",
    tagline: "Get paid 14 days faster without chasing invoices.",
    metaTitle: "Free Client Invoice Tracker Template | OmniOS",
    metaDescription:
      "Generate invoices, automate dunning, reconcile bank feeds, and track cash flow. QuickBooks alternative, free on OmniOS.",
    longDescription:
      "The Client Invoice Tracker replaces $50/month accounting tools for service businesses, agencies, and contractors who need to invoice clients professionally without subscribing to four different SaaS products. Generate branded PDF invoices from project hours, fixed-fee templates, or a blank line-item editor. Send invoices via email with a hosted payment link, and clients can pay by card or ACH with zero transaction fees on the first $10,000 per month. When an invoice goes unpaid past net terms, OmniMind automatically drafts a polite reminder on day 3, a firm follow-up on day 7, and a final notice on day 14 — all ready for your review or sent automatically depending on your preference. Bank feeds reconcile incoming payments against open invoices, so you always know who has paid and who hasn't. The aging report breaks outstanding revenue into current, 30, 60, and 90+ day buckets, and the cash flow forecast shows next month's expected receipts based on billing cadence. Tax support covers US sales tax, EU VAT, and UK VAT with rate lookup by customer address. Every invoice exports to QuickBooks, Xero, or a standard accountant-ready CSV. Teams running this template report median days-sales-outstanding dropping from 42 days to 28 days in the first quarter.",
    features: [
      "Branded PDF invoice generation with line items or fixed fees",
      "Hosted payment links with card and ACH",
      "Automatic dunning sequence (day 3, 7, 14) with AI-drafted copy",
      "Bank feed reconciliation against open invoices",
      "Aging report with current, 30, 60, 90+ day buckets",
      "Cash flow forecast based on billing cadence and payment history",
      "US sales tax, EU VAT, UK VAT with rate lookup",
      "QuickBooks, Xero, and CSV export",
      "Time-tracking integration for project-based billing",
      "Client portal with invoice history and payment receipts",
    ],
    preview:
      "A list of invoices with status chips (Draft, Sent, Paid, Overdue). Click an invoice to open a live PDF preview with editable line items. The top of the page shows outstanding revenue, cash collected this month, and average days-to-pay. A right panel lists clients sorted by outstanding balance.",
    personas: [
      {
        title: "Freelance consultant",
        description:
          "You bill 3-10 clients and need invoicing that doesn't cost $30/month for features you never use.",
      },
      {
        title: "Agency operations lead",
        description:
          "You manage billing for 20+ retainers and want automated dunning without sounding rude.",
      },
      {
        title: "Bootstrapped SaaS founder",
        description:
          "You have a handful of enterprise contracts paid via invoice and don't want to add Stripe complexity yet.",
      },
    ],
    workflow: [
      { name: "Add your first client", description: "Enter name, billing address, and tax ID. OmniMind auto-fills company registry data." },
      { name: "Create an invoice template", description: "Line items, fixed fees, or hours-based. Brand with your logo in 30 seconds." },
      { name: "Connect your bank", description: "Plaid-backed feeds reconcile payments automatically (US, UK, EU supported)." },
      { name: "Send your first invoice", description: "Email with hosted payment link. Clients pay in one click." },
      { name: "Set dunning preferences", description: "Choose auto-send or draft-for-review. Recover overdue invoices without friction." },
    ],
    related: ["monthly-financial-report", "agency-client-portal", "sales-pipeline-crm"],
  },
  "content-calendar": {
    slug: "content-calendar",
    title: "Content Calendar",
    category: "Marketing",
    tagline: "Plan, brief, and publish content without a Google Doc graveyard.",
    metaTitle: "Free Content Calendar Template | OmniOS",
    metaDescription:
      "Plan posts across blog, email, and social. Brief writers, run approval loops, and publish on schedule. Free on OmniOS.",
    longDescription:
      "The Content Calendar is a single source of truth for every piece of content your team publishes — blog posts, newsletters, social posts, podcasts, video — across every channel. The month view shows everything scheduled or in flight. The pipeline view shows what's in ideation, briefing, drafting, review, and scheduled. Every content item has a brief template that OmniMind pre-fills from a topic and target keyword, a writer and editor assignment, a reference library of past top-performing content, and a structured approval flow that captures legal, brand, and executive sign-off with a single click. When the content is scheduled, it syncs to your blog CMS, ESP, and social schedulers automatically. Performance data flows back: organic traffic, email open rate, social engagement, and assisted conversions all surface against the original brief so you learn what actually works. Unlike Airtable-based calendars, the approval flow is real, not a status column. Unlike Asana, briefs are structured and searchable. Unlike Trello, performance data closes the loop. Marketing teams at content-led SaaS companies report saving 6-8 hours per week on coordination after moving to this template.",
    features: [
      "Month and pipeline views with one-click switching",
      "AI-drafted briefs from topic and keyword",
      "Writer and editor assignment with calendar integration",
      "Structured approval flow (legal, brand, executive)",
      "CMS sync (WordPress, Ghost, Webflow, custom)",
      "Email sync (Mailchimp, Customer.io, Loops)",
      "Social scheduler integration (Buffer, Typefully, native X)",
      "Performance data flow back into original briefs",
      "Reference library of past high-performing content",
      "Editorial guidelines and brand voice document",
    ],
    preview:
      "A month calendar with colored dots representing different channels (blog, email, social, video). Click a date to see all content scheduled. A pipeline view groups items by stage. Every content card opens a full brief with writer notes, references, performance data, and approval signatures.",
    personas: [
      {
        title: "Content marketing manager",
        description:
          "You publish 8-20 pieces per month across channels and need to stop losing track in Google Docs.",
      },
      {
        title: "Solo founder doing marketing",
        description:
          "You write one blog post a week and need structure to stay consistent.",
      },
      {
        title: "Agency content lead",
        description:
          "You produce content for 5+ clients and need white-labeled briefs and approvals.",
      },
    ],
    workflow: [
      { name: "Import your content plan", description: "Paste a Google Doc, CSV, or Airtable export. OmniMind parses it into structured items." },
      { name: "Connect your publishing channels", description: "Blog CMS, email platform, and social scheduler." },
      { name: "Draft your first brief", description: "Type a topic. OmniMind fills in target audience, outline, and reference links." },
      { name: "Assign writers and editors", description: "Calendar availability surfaces so you don't over-commit anyone." },
      { name: "Publish and measure", description: "Performance syncs back. Learn what works. Iterate." },
    ],
    related: ["social-media-scheduler", "product-roadmap", "agency-client-portal"],
  },
  "employee-onboarding-flow": {
    slug: "employee-onboarding-flow",
    title: "Employee Onboarding Flow",
    category: "HR",
    tagline: "Get new hires productive in days, not months.",
    metaTitle: "Free Employee Onboarding Template | OmniOS",
    metaDescription:
      "30/60/90 day plans, equipment requests, training schedules, and compliance checklists. Free on OmniOS.",
    longDescription:
      "The Employee Onboarding Flow handles every step from offer acceptance to 90-day review. The template ships with a pre-built checklist: equipment procurement, software accounts, Slack channels, reading list, buddy assignment, first-week schedule, and manager 1:1 cadence. Hiring managers complete a simple intake form and the rest is automated. Equipment requests fire to IT with vendor links. Software provisioning creates accounts in SSO-connected apps (Google Workspace, GitHub, Figma, Notion, and 80+ others). Buddy assignments match by role similarity and location. The 30/60/90 day plan template is customized per role family (engineering, product, design, sales, success) and the new hire receives a personalized weekly digest of what's next. Compliance checklists cover I-9 verification, handbook acknowledgment, and any role-specific certifications. Everything is auditable for legal and compliance teams. Unlike BambooHR or Rippling, this template is free and fully editable. Unlike a Notion page, it actually executes — tasks complete themselves when systems confirm provisioning. Companies using this template report new hire ramp time dropping by 40% and manager onboarding load dropping by 60%.",
    features: [
      "Pre-built 30/60/90 day plans by role family",
      "Equipment procurement with vendor links and approval routing",
      "SSO-backed software provisioning (80+ apps)",
      "Buddy matching by role and location",
      "Handbook acknowledgment with version tracking",
      "Compliance checklists (I-9, state-specific, role-specific)",
      "Weekly digest email personalized for the new hire",
      "Manager onboarding checklist separate from employee checklist",
      "Audit log for compliance reviews",
      "Exit workflow for offboarding",
    ],
    preview:
      "A timeline view from offer accepted through day 90. Each milestone has a checklist, owner, and due date. A dashboard shows all current onboardings, progress bars, and any overdue items. Hiring managers see their personal queue of approvals.",
    personas: [
      {
        title: "People operations lead",
        description:
          "You onboard 5-15 people per month and are tired of chasing managers for checklist completion.",
      },
      {
        title: "Startup founder",
        description:
          "You're hiring your 5th employee and need a real onboarding process before it breaks.",
      },
      {
        title: "IT operations manager",
        description:
          "You receive equipment and access requests from HR and want structured intake instead of Slack DMs.",
      },
    ],
    workflow: [
      { name: "Define role families", description: "Group roles that share onboarding patterns (engineering, sales, etc.)." },
      { name: "Customize the 30/60/90 plan", description: "Edit the defaults or let OmniMind generate from a job description." },
      { name: "Connect your SSO and IT tools", description: "Google Workspace, Okta, and equipment vendors." },
      { name: "Run your first onboarding", description: "Hiring manager submits intake. Everything else executes automatically." },
      { name: "Review at 90 days", description: "Structured performance check-in with feedback captured and routed." },
    ],
    related: ["recruiting-pipeline", "sprint-planning-board", "agency-client-portal"],
  },
  "bug-tracker": {
    slug: "bug-tracker",
    title: "Bug Tracker",
    category: "Engineering",
    tagline: "Triage faster. Fix with context. Ship stable software.",
    metaTitle: "Free Bug Tracker Template | OmniOS",
    metaDescription:
      "Triage incoming bugs, auto-assign by component owner, and link to GitHub PRs. Free bug tracking for any team size.",
    longDescription:
      "The Bug Tracker replaces spreadsheet triage meetings with an automated intake and routing system. Bugs come in from anywhere — users submitting a form, Slack reports from the support team, Sentry alerts, customer emails — and land in a unified triage queue with automatic de-duplication. Each bug captures reproduction steps, affected environments, severity, user impact, and linked customer accounts. OmniMind inspects the stack trace or description and suggests which component the bug belongs to. Component owners defined in the team directory receive automatic assignment, and severity SLAs drive surface priority: P0 surfaces to the on-call engineer immediately, P1 within four hours, P2 within the next sprint. Every bug links to a GitHub or GitLab pull request when a fix is opened, and the bug transitions through states (triage, assigned, in progress, fixed, verified, closed) automatically as the PR progresses. The customers affected by each bug are linked, and when the fix ships, everyone affected receives an optional notification. Unlike Jira, triage is fast and structured. Unlike Linear, it's free on the Community tier. Engineering teams report reducing time-to-fix by 35% and eliminating the weekly triage meeting.",
    features: [
      "Unified intake from forms, Slack, Sentry, and email",
      "Automatic de-duplication based on stack trace signature",
      "AI component suggestion from description or error",
      "Component owner auto-assignment from team directory",
      "P0-P3 severity with SLA-driven prioritization",
      "GitHub and GitLab PR linking with auto-transitions",
      "Customer account linking for impact measurement",
      "Weekly bug metrics: time-to-triage, time-to-fix, regression rate",
      "Sentry, Datadog, and Rollbar integrations",
      "Customer notification on resolution",
    ],
    preview:
      "A triage queue on the left sorted by severity and age. A detail pane on the right shows reproduction steps, stack trace, affected customers, and linked PR. A dashboard shows open bugs by component, SLA compliance, and regression rate over time.",
    personas: [
      {
        title: "Platform engineer on call",
        description:
          "You need immediate surfacing of P0 bugs and fast context when you're 30 seconds into a page.",
      },
      {
        title: "Engineering manager",
        description:
          "You want weekly metrics on bug volume and time-to-fix without building reports.",
      },
      {
        title: "Customer support lead",
        description:
          "You submit bugs on behalf of users and need to see when each one ships so you can notify affected customers.",
      },
    ],
    workflow: [
      { name: "Define your components", description: "List the systems your team owns. Assign owners from the team directory." },
      { name: "Connect error monitoring", description: "Sentry, Datadog, or Rollbar pipe bugs into the triage queue automatically." },
      { name: "Set SLA targets", description: "P0: 1 hour. P1: 4 hours. P2: next sprint. Editable per team." },
      { name: "Triage your first bug", description: "OmniMind suggests component. Accept or reassign. It routes instantly." },
      { name: "Review weekly metrics", description: "Time-to-triage, time-to-fix, regression rate. Adjust SLAs if needed." },
    ],
    related: ["sprint-planning-board", "customer-support-queue", "product-roadmap"],
  },
  "customer-support-queue": {
    slug: "customer-support-queue",
    title: "Customer Support Queue",
    category: "Support",
    tagline: "Answer every customer faster with AI-drafted responses.",
    metaTitle: "Free Customer Support Queue Template | OmniOS",
    metaDescription:
      "SLA-aware support queue with AI response drafting, macro library, and CSAT tracking. Zendesk alternative, free on OmniOS.",
    longDescription:
      "The Customer Support Queue replaces Zendesk or Intercom for teams who need fast, organized support without paying $150/agent/month. Tickets come in from email, web form, Slack, and live chat. Each ticket captures customer info, recent account activity, previous tickets, and linked subscription or billing data. OmniMind drafts a first-response suggestion based on the macro library and the customer's specific context — ready for the agent to review, edit, and send. SLA timers surface priority: first response targets, full-resolution targets, and escalation triggers when an agent doesn't respond in time. Tickets route automatically by product area, language, or customer tier. The macro library is searchable and version-controlled, with AI that improves macros based on which variations perform best. CSAT surveys fire after resolution, and the dashboard shows agent performance, SLA compliance, and top ticket drivers. Teams moving from Zendesk report response times dropping by 45% and CSAT rising by 8 points in the first quarter.",
    features: [
      "Unified intake: email, web form, Slack, live chat",
      "AI first-response drafting from macro library and customer context",
      "SLA timers for first response, resolution, and escalation",
      "Auto-routing by product area, language, or customer tier",
      "Searchable macro library with version control",
      "CSAT surveys with trend analysis",
      "Agent dashboard: SLA compliance, CSAT, ticket volume",
      "Top ticket driver analytics for product improvement",
      "Linked billing and subscription context per ticket",
      "Live chat widget with AI handoff to human agent",
    ],
    preview:
      "A queue of tickets sorted by SLA timer with color-coded priority. Click a ticket to see the full conversation, customer context (subscription, past tickets), and an AI-drafted response in the reply box. A dashboard shows team performance and SLA compliance.",
    personas: [
      {
        title: "First support hire",
        description:
          "You're the first dedicated CS person and need structure that scales from 10 to 500 tickets per week.",
      },
      {
        title: "Support team lead",
        description:
          "You manage 3-15 agents and want SLA visibility without building BI dashboards.",
      },
      {
        title: "Product manager",
        description:
          "You want to see top ticket drivers to inform the roadmap.",
      },
    ],
    workflow: [
      { name: "Connect your support channels", description: "Email, web form, Slack, and live chat — all route into the queue." },
      { name: "Seed the macro library", description: "Import from Zendesk, Intercom, or paste from a doc. OmniMind structures them." },
      { name: "Set SLA targets", description: "First response and resolution targets per ticket tier." },
      { name: "Route to agents", description: "Product area, language, and tier-based routing. Agents get only their tickets." },
      { name: "Measure and improve", description: "CSAT, SLA compliance, and top drivers surface weekly." },
    ],
    related: ["bug-tracker", "sales-pipeline-crm", "agency-client-portal"],
  },
  "social-media-scheduler": {
    slug: "social-media-scheduler",
    title: "Social Media Scheduler",
    category: "Marketing",
    tagline: "Post consistently across channels without babysitting tools.",
    metaTitle: "Free Social Media Scheduler Template | OmniOS",
    metaDescription:
      "Queue posts for X, LinkedIn, and Instagram with engagement prediction and optimal timing. Buffer alternative, free.",
    longDescription:
      "The Social Media Scheduler queues posts for X, LinkedIn, Instagram, Threads, Bluesky, and any platform with a public API. Unlike Buffer or Hootsuite, OmniMind predicts engagement for each post before it ships, suggesting edits, hashtags, and optimal posting time based on your own historical performance. The calendar view shows everything scheduled across channels with a week and month toggle. The composer supports platform-specific character limits, image cropping, alt text, and carousel layouts. Best-time-to-post analysis learns from your audience activity and adjusts recommendations weekly. When a post performs above or below prediction, OmniMind notes it and adjusts future recommendations. Every post links back to the original brief in your content calendar if you use the Content Calendar template together, closing the loop from idea to published to measured. Agencies running client social on this template report time savings of 6-10 hours per week per client compared to Buffer + Later + a spreadsheet.",
    features: [
      "Multi-channel scheduling (X, LinkedIn, Instagram, Threads, Bluesky)",
      "AI engagement prediction per post",
      "Optimal posting time recommendations",
      "Platform-specific composers with character limits and media previews",
      "Hashtag and mention suggestions",
      "Calendar and queue views",
      "Approval workflow for client or agency use",
      "Performance analytics with prediction vs. actual",
      "Content recycling queue for evergreen posts",
      "Integration with Content Calendar template",
    ],
    preview:
      "A calendar showing posts across channels with platform icons. Click a post to open the composer with platform-specific previews. The composer shows engagement prediction, suggested posting time, and hashtag recommendations in real time as you edit.",
    personas: [
      {
        title: "Solo content creator",
        description:
          "You post across 3+ platforms and want to batch your week in one sitting.",
      },
      {
        title: "Social media manager",
        description:
          "You manage 1-5 brand accounts and need engagement prediction to improve over time.",
      },
      {
        title: "Agency social lead",
        description:
          "You run social for 5+ clients with approval flows and white-labeled reporting.",
      },
    ],
    workflow: [
      { name: "Connect your accounts", description: "OAuth flows for X, LinkedIn, Instagram, and more. Takes 2 minutes." },
      { name: "Import your historical posts", description: "OmniMind trains engagement prediction on your past performance." },
      { name: "Queue your first week", description: "Batch content. OmniMind suggests optimal times per platform." },
      { name: "Review and approve", description: "Solo or with a client approval flow. Edit or ship as-is." },
      { name: "Measure vs. prediction", description: "Weekly report shows what beat prediction and what didn't. Recommendations adapt." },
    ],
    related: ["content-calendar", "agency-client-portal", "product-roadmap"],
  },
  "monthly-financial-report": {
    slug: "monthly-financial-report",
    title: "Monthly Financial Report",
    category: "Finance",
    tagline: "Board-ready financials with AI-written commentary.",
    metaTitle: "Free Monthly Financial Report Template | OmniOS",
    metaDescription:
      "P&L, cash flow, and variance analysis with AI executive summary. Replace your monthly close spreadsheet.",
    longDescription:
      "The Monthly Financial Report generates board-ready financials from connected accounting data. Connect QuickBooks, Xero, or NetSuite, and the template pulls P&L, cash flow statement, balance sheet, and KPI dashboards automatically. Variance analysis compares actuals against budget and prior period with plain-English explanations generated by OmniMind. The executive summary section is AI-drafted from the data: top revenue drivers, biggest expense moves, cash runway projection, and risks flagged for the board. Every number drills down to source transactions for audit. Support for multiple currencies, multi-entity consolidation, and custom KPIs like LTV, CAC, and payback period. The template exports as a branded PDF or live web page for board sharing. Unlike paying a fractional CFO $3,000/month for this output, the template costs nothing and runs in under 15 minutes after setup. Finance leaders at Series A through Series C startups report that month-end close commentary time drops from 8 hours to 90 minutes.",
    features: [
      "QuickBooks, Xero, NetSuite connectors",
      "Auto-generated P&L, cash flow, balance sheet",
      "Variance analysis vs. budget and prior period",
      "AI-drafted executive summary",
      "Drill-down to source transactions",
      "Multi-currency and multi-entity consolidation",
      "Custom KPIs (LTV, CAC, payback, gross margin)",
      "Cash runway projection with scenario modeling",
      "Branded PDF and live web page export",
      "Board-ready formatting out of the box",
    ],
    preview:
      "A structured report with sections for executive summary, P&L, cash flow, balance sheet, and KPIs. Each number is hoverable to show source transactions. A branded cover page and table of contents generate automatically.",
    personas: [
      {
        title: "Fractional CFO",
        description:
          "You serve 5+ startups and want to 3x the clients you can handle without sacrificing quality.",
      },
      {
        title: "Finance lead at a Series A startup",
        description:
          "You close books monthly and spend too much time writing board commentary by hand.",
      },
      {
        title: "Founder doing their own finance",
        description:
          "You need investor-grade reporting without hiring anyone yet.",
      },
    ],
    workflow: [
      { name: "Connect your accounting system", description: "QuickBooks, Xero, or NetSuite. OAuth in under a minute." },
      { name: "Define your KPIs", description: "LTV, CAC, burn, runway. Accept defaults or customize." },
      { name: "Import prior periods", description: "12 months of history enables variance analysis and trend charts." },
      { name: "Generate your first report", description: "Select the month. OmniMind drafts commentary. Review and edit." },
      { name: "Share with the board", description: "Branded PDF or live web page with access controls." },
    ],
    related: ["client-invoice-tracker", "sales-pipeline-crm", "product-roadmap"],
  },
  "product-roadmap": {
    slug: "product-roadmap",
    title: "Product Roadmap",
    category: "Strategy",
    tagline: "Align the company around what ships when.",
    metaTitle: "Free Product Roadmap Template | OmniOS",
    metaDescription:
      "Quarterly roadmap with theme-based planning, confidence scoring, and stakeholder sharing. Free on OmniOS.",
    longDescription:
      "The Product Roadmap organizes what your team is shipping across quarters with a theme-based planning model that actually scales. Themes are multi-quarter investment areas (reliability, growth, new markets). Under each theme, initiatives are specific projects with confidence scores, owner assignment, and rough timelines. Confidence scores force honest communication: 90% means it's committed, 60% means we plan to, 30% means we'd like to. External stakeholders see only what you choose to share. The roadmap updates automatically as linked sprint data progresses, so the published view reflects reality instead of optimistic slides. Dependencies between initiatives surface explicitly. When an initiative slips, all downstream work highlights automatically. The template ships with three views: timeline (Gantt-style), now-next-later (the classic SVPG format), and stakeholder (filtered for external sharing). Product leaders at Series B through pre-IPO companies use this template to replace Productboard plus a collection of decks.",
    features: [
      "Theme-based investment planning across quarters",
      "Initiative confidence scoring (90/60/30)",
      "Owner assignment and team capacity awareness",
      "Now-next-later, timeline, and stakeholder views",
      "Linked sprint data for automatic progress updates",
      "Dependency visualization with downstream impact",
      "Stakeholder access controls for external sharing",
      "Customer feedback linking to initiatives",
      "Quarterly OKR integration",
      "Slack digest on roadmap changes",
    ],
    preview:
      "A horizontal timeline of themes across four quarters. Under each theme, initiatives appear with confidence chips (committed, planned, exploring). Click an initiative to see owner, dependencies, linked sprint progress, and customer feedback. A stakeholder view filters sensitive detail.",
    personas: [
      {
        title: "Head of Product",
        description:
          "You present the roadmap to the board quarterly and need it to stay current between presentations.",
      },
      {
        title: "Product manager",
        description:
          "You want to stop maintaining the roadmap in three tools (Productboard, deck, spreadsheet).",
      },
      {
        title: "Engineering director",
        description:
          "You need capacity visibility so you can push back on overcommitment early.",
      },
    ],
    workflow: [
      { name: "Define your themes", description: "3-5 investment areas that span multiple quarters." },
      { name: "Break themes into initiatives", description: "Specific projects with scope, owner, and target quarter." },
      { name: "Assign confidence", description: "Committed (90%), planned (60%), exploring (30%). Force honesty." },
      { name: "Link to sprint data", description: "Progress updates flow in automatically as work ships." },
      { name: "Share with stakeholders", description: "Pick a filtered view. Share a link. Update automatically." },
    ],
    related: ["sprint-planning-board", "content-calendar", "bug-tracker"],
  },
  "recruiting-pipeline": {
    slug: "recruiting-pipeline",
    title: "Recruiting Pipeline",
    category: "HR",
    tagline: "Hire great people without a $15k/month ATS.",
    metaTitle: "Free Recruiting Pipeline Template | OmniOS",
    metaDescription:
      "Track candidates end-to-end, schedule interviews across timezones, and score with a rubric. Free ATS alternative.",
    longDescription:
      "The Recruiting Pipeline handles the full hiring funnel from sourcing to offer. Every candidate moves through stages: sourced, applied, phone screen, technical, onsite, offer, hired, or archived. Each candidate has a profile with resume, links, notes from every interviewer, and scored feedback against a structured rubric. Interviews schedule across timezones with automatic calendar invites and feedback reminders. The rubric scoring forces interviewers to rate against specific dimensions (role competency, raising the bar, communication, culture add) rather than leaving hand-wavy notes. After each interview, interviewers are prompted within 2 hours to submit scored feedback. A hiring manager dashboard shows all open roles, pipeline health per role (candidates per stage), time-in-stage, and source-of-hire analytics. EEOC reporting ships built in for US companies. Unlike Greenhouse at $15,000/year, this template costs nothing and ships with every primitive an ATS needs. Recruiting teams report time-to-hire dropping by 18% after moving from spreadsheets to this template.",
    features: [
      "Full-funnel candidate tracking",
      "Structured rubric scoring (role competency, communication, culture add)",
      "Automatic interview scheduling across timezones",
      "Feedback reminder 2 hours after interview",
      "Hiring manager dashboard per role",
      "Pipeline health and time-in-stage analytics",
      "Source-of-hire reporting",
      "EEOC compliance reporting (US)",
      "Resume parsing and candidate de-duplication",
      "Offer letter templates with e-signature",
    ],
    preview:
      "A kanban board with columns per stage. Each candidate card shows name, role, recruiter, and days in stage. Click to open a profile with resume, rubric scores per interviewer, notes, and next-step suggestions.",
    personas: [
      {
        title: "First recruiter hire",
        description:
          "You're the first dedicated recruiter and need a real ATS without a $15k annual bill.",
      },
      {
        title: "Hiring manager",
        description:
          "You have 2-4 open roles and want visibility without drowning in spreadsheets.",
      },
      {
        title: "Head of People",
        description:
          "You want EEOC-compliant reporting and source-of-hire analytics.",
      },
    ],
    workflow: [
      { name: "Define open roles", description: "Role, location, level, hiring manager, and rubric." },
      { name: "Build the rubric", description: "4-6 dimensions scored 1-4. OmniMind suggests defaults per role family." },
      { name: "Connect calendars", description: "Interviewer availability surfaces for scheduling." },
      { name: "Add candidates", description: "Paste a LinkedIn URL or upload a resume. Profile populates automatically." },
      { name: "Move through stages", description: "Scheduled interviews trigger calendar invites and feedback reminders." },
    ],
    related: ["employee-onboarding-flow", "sales-pipeline-crm", "sprint-planning-board"],
  },
  "agency-client-portal": {
    slug: "agency-client-portal",
    title: "Agency Client Portal",
    category: "Agency",
    tagline: "Deliverables, feedback, time tracking, and invoices — branded for each client.",
    metaTitle: "Free Agency Client Portal Template | OmniOS",
    metaDescription:
      "White-labeled client portals with deliverables, feedback, time tracking, and invoices. Free for unlimited clients.",
    longDescription:
      "The Agency Client Portal gives each of your clients a branded workspace where they see everything that matters: active deliverables with status and due dates, files for review with structured feedback, time tracked against their retainer, and a list of paid and open invoices. Your agency sees the same data consolidated across every client. When you ship a deliverable, the client gets a notification with a preview and a feedback box. Feedback is captured per deliverable so it never gets lost in email threads. Time tracking integrates with retainer caps, so you and the client always know how many hours remain in the month. Invoices auto-generate from tracked time or fixed-fee schedules. Unlike buying Teamwork, Productive, and ClickUp separately, every surface lives in one portal that clients actually log into. Agencies running 10+ retainers report saving 8-12 hours per week on client reporting after switching.",
    features: [
      "White-labeled per-client portals with custom branding",
      "Deliverable tracking with due dates and preview",
      "Structured feedback per deliverable",
      "Time tracking with retainer cap visibility",
      "Auto-generated invoices from tracked time",
      "Client notifications for deliverables and invoices",
      "File sharing with version history",
      "Slack or email digest to client weekly",
      "Team member capacity across clients",
      "Retainer burn rate analytics",
    ],
    preview:
      "A client-side view: a dashboard showing active deliverables, hours used vs. retainer cap, and recent files. Click a deliverable to leave structured feedback. The agency view is a roll-up across all clients with profitability per account.",
    personas: [
      {
        title: "Agency founder",
        description:
          "You have 5-15 retainer clients and want to stop sending PDF status reports.",
      },
      {
        title: "Freelance designer",
        description:
          "You work with 3-8 clients and want professional delivery without subscribing to four tools.",
      },
      {
        title: "Agency operations lead",
        description:
          "You want profitability per account to decide who to keep and who to fire.",
      },
    ],
    workflow: [
      { name: "Add your first client", description: "Name, logo, brand color. Portal generates instantly." },
      { name: "Define the retainer", description: "Hours per month or fixed-fee. Cap and rollover rules." },
      { name: "Add deliverables", description: "Due date, owner, scope. Client sees immediately." },
      { name: "Track time", description: "Start a timer or enter hours manually. Rolls up to the retainer." },
      { name: "Invoice monthly", description: "Auto-generated from tracked time. Client pays via hosted link." },
    ],
    related: ["client-invoice-tracker", "content-calendar", "sales-pipeline-crm"],
  },
};

const TEMPLATE_SLUGS = Object.keys(TEMPLATES);

export function generateStaticParams(): { slug: string }[] {
  return TEMPLATE_SLUGS.map((slug) => ({ slug }));
}

interface TemplatePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: TemplatePageProps): Promise<Metadata> {
  const { slug } = await params;
  const template = TEMPLATES[slug];
  if (!template) {
    return { title: "Template not found | OmniOS" };
  }
  return {
    title: template.metaTitle,
    description: template.metaDescription,
    alternates: { canonical: `/templates/${template.slug}` },
    openGraph: {
      title: template.metaTitle,
      description: template.metaDescription,
      url: `/templates/${template.slug}`,
      type: "article",
    },
  };
}

function buildTemplateJsonLd(template: TemplateDetail): string {
  const payload = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: template.title,
      applicationCategory: "BusinessApplication",
      description: template.metaDescription,
      operatingSystem: "Web, macOS, Windows, Linux",
      url: `https://omnios.app/templates/${template.slug}`,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: `How to set up the ${template.title}`,
      description: template.tagline,
      step: template.workflow.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step.name,
        text: step.description,
      })),
    },
  ];
  return JSON.stringify(payload).replace(/</g, "\\u003c");
}

export default async function TemplateDetailPage({ params }: TemplatePageProps) {
  const { slug } = await params;
  const template = TEMPLATES[slug];
  if (!template) {
    notFound();
  }

  const related = template.related
    .map((relatedSlug) => TEMPLATES[relatedSlug])
    .filter((value): value is TemplateDetail => Boolean(value));

  const jsonLd = buildTemplateJsonLd(template);

  return (
    <div className="relative">
      <script
        type="application/ld+json"
        // JSON-LD generated server-side from typed constants. No user input.
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.2),transparent_55%)]" />
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-white/50">
            <Link href="/templates" className="hover:text-white">
              Templates
            </Link>
            <span aria-hidden="true">/</span>
            <span>{template.category}</span>
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
            {template.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70">{template.tagline}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={`/register?template=${template.slug}`}
              className="inline-flex items-center gap-2 rounded-lg bg-[#6366F1] px-5 py-3 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(99,102,241,0.4),0_8px_24px_-8px_rgba(99,102,241,0.6)] transition-all hover:bg-[#5558E3]"
            >
              Use this template free
              <span aria-hidden="true">→</span>
            </Link>
            <span className="text-sm text-white/40">
              Free on the Community tier. No credit card required.
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr]">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">What this template does</h2>
            <p className="mt-6 text-base leading-relaxed text-white/70">
              {template.longDescription}
            </p>
          </div>
          <aside className="rounded-2xl border border-white/10 bg-[#13131A] p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/50">
              Preview
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/70">{template.preview}</p>
            <div className="mt-6 grid grid-cols-4 gap-1.5">
              {Array.from({ length: 16 }).map((_, index) => (
                <div
                  key={index}
                  className="h-6 rounded bg-gradient-to-br from-[#6366F1]/40 to-[#8B5CF6]/30"
                  style={{ opacity: 0.3 + ((index * 37) % 70) / 100 }}
                />
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="border-y border-white/5 bg-[#0A0A0F]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">What&apos;s included</h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {template.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 rounded-xl border border-white/5 bg-[#13131A] p-4 text-sm text-white/80"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6366F1]/20 text-xs text-[#6366F1]">
                  ✓
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-semibold tracking-tight">Who uses this</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {template.personas.map((persona) => (
            <div
              key={persona.title}
              className="rounded-2xl border border-white/5 bg-[#13131A] p-6 transition-colors hover:bg-[#1C1C26]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-sm font-semibold">
                {persona.title.charAt(0)}
              </div>
              <h3 className="mt-5 text-base font-semibold">{persona.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {persona.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/5 bg-[#0A0A0F]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">
            Setup in five steps
          </h2>
          <ol className="mt-8 space-y-4">
            {template.workflow.map((step, index) => (
              <li
                key={step.name}
                className="flex gap-5 rounded-xl border border-white/5 bg-[#13131A] p-5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/15 text-sm font-semibold text-[#D4AF37]">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-base font-semibold">{step.name}</h3>
                  <p className="mt-1 text-sm text-white/60">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">Related templates</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/templates/${item.slug}`}
                className="group rounded-2xl border border-white/5 bg-[#13131A] p-5 transition-colors hover:border-white/10 hover:bg-[#1C1C26]"
              >
                <span className="text-xs uppercase tracking-[0.14em] text-white/40">
                  {item.category}
                </span>
                <h3 className="mt-2 text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-white/60">{item.tagline}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm text-[#6366F1] group-hover:text-white">
                  View template
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#6366F1]/10 via-[#13131A] to-[#D4AF37]/10 p-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Ship {template.title} today.
          </h2>
          <p className="mt-3 text-white/60">
            Free on Community. Upgrade only when your team needs enterprise controls.
          </p>
          <Link
            href={`/register?template=${template.slug}`}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-[#0A0A0F] transition-colors hover:bg-white/90"
          >
            Use this template free
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
