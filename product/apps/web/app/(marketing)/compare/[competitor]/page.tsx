import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface FeatureRow {
  feature: string;
  competitor: boolean | string;
  omnios: boolean | string;
  note?: string;
}

interface TestimonialQuote {
  quote: string;
  author: string;
  role: string;
  company: string;
}

interface CompetitorProfile {
  slug: string;
  name: string;
  headline: string;
  subhead: string;
  priceLabel: string;
  monthlyCostForTeamOfTwelve: number;
  category: string;
  accent: string;
  metaTitle: string;
  metaDescription: string;
  switchingNarrative: string[];
  migrationTitle: string;
  migrationSteps: Array<{ step: string; detail: string }>;
  featureRows: FeatureRow[];
  testimonial: TestimonialQuote;
  faqs: Array<{ question: string; answer: string }>;
}

/* ─── Data (10 competitors) ──────────────────────────────────────────────── */

const OMNIOS_FLAT_PRICE = 99;
const TEAM_SIZE_FOR_CALC = 12;

const COMPETITOR_DATA: Record<string, CompetitorProfile> = {
  notion: {
    slug: "notion",
    name: "Notion",
    category: "Docs + wiki",
    accent: "#E5E5E5",
    priceLabel: "$16 per user / month (Business)",
    monthlyCostForTeamOfTwelve: 16 * TEAM_SIZE_FOR_CALC,
    headline: "OmniOS vs Notion: The doc evolved into an OS",
    subhead:
      "Notion is where information goes to sit. OmniOS is where it goes to work — assembling CRM, inbox, finance and analytics around the same page you started writing in.",
    metaTitle:
      "OmniOS vs Notion: Replace your wiki with an OS that actually runs the business",
    metaDescription:
      "Notion costs $16/user/month for docs. OmniOS costs $99 flat and ships the CRM, pipeline, inbox, and finance alongside the doc. Compare features, pricing, and migration.",
    switchingNarrative: [
      "Notion is excellent at storing the plan. It is defenseless the moment the plan needs to act — the CRM is somewhere else, the pipeline is somewhere else, the billing is somewhere else, and the sync is brittle in all directions.",
      "Teams move to OmniOS when they realize the Notion database they built for deals is a tenth of a CRM, the one for customers is a tenth of a support tool, and the one for invoices is a tenth of an accounting system. Each fraction demanded a separate SaaS to finish the job.",
      "OmniOS collapses the stack. The same page where you drafted the strategy is now wired to the pipeline, the contacts, the inbox, and the invoice — because every surface is compiled from the same 300-node primitive set the doc already uses.",
    ],
    migrationTitle: "Move off Notion in a single afternoon",
    migrationSteps: [
      {
        step: "Export your workspace",
        detail:
          "Use Notion's native export. OmniOS ingests the Markdown + CSV bundle directly and preserves block structure, toggles, and database schemas.",
      },
      {
        step: "Point the AI Graph Compiler at your workspace",
        detail:
          "Say what the pages are for. 'This is our CRM. This is our onboarding. This is our investor updates.' The compiler wires each one to real nodes.",
      },
      {
        step: "Invite the team and deprecate Notion",
        detail:
          "Seat parity in OmniOS is automatic — no per-user billing. Keep Notion read-only for thirty days as an insurance policy, then cancel.",
      },
    ],
    featureRows: [
      { feature: "Docs and wiki", competitor: true, omnios: true },
      { feature: "Native CRM with pipeline", competitor: false, omnios: true },
      { feature: "Native inbox and email send", competitor: false, omnios: true },
      { feature: "Native invoicing + finance", competitor: false, omnios: true },
      { feature: "AI that writes and runs workflows", competitor: "Limited", omnios: true },
      { feature: "Local AI (no data sent to cloud)", competitor: false, omnios: true },
      { feature: "Per-seat pricing", competitor: "$16/user/mo", omnios: "$99 flat" },
      { feature: "Node Registry / marketplace", competitor: false, omnios: true },
    ],
    testimonial: {
      quote:
        "We had eleven Notion databases pretending to be a company. OmniOS compiled the real company from them in an afternoon and now the docs write back to the pipeline, not the other way around.",
      author: "Sarah K.",
      role: "CEO",
      company: "Acme Corp",
    },
    faqs: [
      {
        question: "Will I lose my Notion pages?",
        answer:
          "No. OmniOS imports Notion's official export. Formatting, block hierarchy, and database schemas all survive the migration.",
      },
      {
        question: "Can I keep Notion for a while after switching?",
        answer:
          "Yes. Most teams run both for two to four weeks. OmniOS treats Notion as a read-only source during that period so nothing is lost.",
      },
    ],
  },

  zapier: {
    slug: "zapier",
    name: "Zapier",
    category: "Workflow glue",
    accent: "#FF4A00",
    priceLabel: "from $49 / month + task overages",
    monthlyCostForTeamOfTwelve: 49,
    headline: "OmniOS vs Zapier: Stop paying to connect tools you should not need",
    subhead:
      "Zapier exists because your software lives in different buildings. OmniOS is the building. Your workflows run natively, at zero marginal task cost, with the AI writing them from one sentence.",
    metaTitle:
      "OmniOS vs Zapier: Native workflows beat inter-app duct tape every time",
    metaDescription:
      "Zapier bills per task to glue tools together. OmniOS replaces the tools, runs unlimited workflows natively, and compiles them from plain English for $99 flat.",
    switchingNarrative: [
      "Every Zap is an admission that two tools refuse to know about each other. You pay Zapier the cost of their disagreement, forever, per task.",
      "The moment your team scales, the task meter starts to bite. The moment your logic gets non-trivial, the multi-step filter trees get fragile. Debugging a Zap is a tax on every engineer who touches it.",
      "OmniOS is the tool those Zaps were trying to simulate. The CRM and the inbox and the finance nodes share one data graph, so the workflow is no longer a bridge between strangers — it is a path inside one system. You describe it; the AI Graph Compiler emits it. No task caps, no Zap overages.",
    ],
    migrationTitle: "Retire Zapier, one automation at a time",
    migrationSteps: [
      {
        step: "Export your Zap definitions",
        detail:
          "Zapier provides JSON exports of your Zaps. OmniOS parses them and proposes native node equivalents, usually a quarter of the steps.",
      },
      {
        step: "Recompile in natural language",
        detail:
          "Say what the automation is for. OmniOS generates the node graph, wires the triggers, and runs it in a sandbox you can inspect end to end.",
      },
      {
        step: "Cut over and cancel",
        detail:
          "Run both in parallel for a week. When parity is confirmed, flip a switch and cancel Zapier. No task quotas to track.",
      },
    ],
    featureRows: [
      { feature: "Visual automation builder", competitor: true, omnios: true },
      { feature: "Native CRM, inbox, docs, finance", competitor: false, omnios: true },
      { feature: "AI that writes workflows from English", competitor: "Basic", omnios: true },
      { feature: "Unlimited task runs", competitor: false, omnios: true },
      { feature: "Sub-second latency between steps", competitor: false, omnios: true },
      { feature: "Local / on-prem execution", competitor: false, omnios: true },
      { feature: "Pricing", competitor: "$49+ / task tiers", omnios: "$99 flat" },
      { feature: "Version control on workflows", competitor: "Limited", omnios: true },
    ],
    testimonial: {
      quote:
        "We had 340 Zaps. Three broke every week. OmniOS replaced 290 of them with a single native graph and we have not debugged a workflow in two months.",
      author: "Marcus T.",
      role: "CTO",
      company: "TechStart",
    },
    faqs: [
      {
        question: "Can OmniOS trigger off external webhooks like Zapier does?",
        answer:
          "Yes. The Webhook and API Bridge nodes accept any HTTP trigger and can fan out to every node in your graph.",
      },
      {
        question: "Do you integrate with all 7,000+ apps Zapier does?",
        answer:
          "OmniOS replaces the need for the majority of those integrations outright. For the rest, our Node Registry and API Bridge cover the long tail.",
      },
    ],
  },

  linear: {
    slug: "linear",
    name: "Linear",
    category: "Issue tracker",
    accent: "#5E6AD2",
    priceLabel: "$8 per user / month (Standard)",
    monthlyCostForTeamOfTwelve: 8 * TEAM_SIZE_FOR_CALC,
    headline: "OmniOS vs Linear: Tracking issues is not the same as running the company",
    subhead:
      "Linear is a gorgeous tracker inside a company that still lives in ten other tools. OmniOS tracks the issue next to the customer who reported it, the revenue it threatens, and the code that fixes it.",
    metaTitle:
      "OmniOS vs Linear: One OS for issues, customers, revenue and code",
    metaDescription:
      "Linear is fast at tickets. OmniOS is fast at tickets plus the CRM, support inbox, code surface and finance layer the ticket actually depends on — for $99 flat.",
    switchingNarrative: [
      "Linear shipped the tracker everyone wished Jira could be. That victory exposed the deeper problem: the tracker is still an island.",
      "The ticket that blocks your largest deal does not know that the deal exists. The ticket that triggers a refund does not know the invoice was ever issued. Linear is beautiful in a vacuum your actual business is never in.",
      "OmniOS gives you Linear-grade issue tracking as one node graph inside a stack that also owns the customer, the revenue, the code review, and the deploy. The same issue view can show you the MRR at risk, the Stripe invoice, and the PR that fixes it — without leaving the page.",
    ],
    migrationTitle: "Move off Linear without losing velocity",
    migrationSteps: [
      {
        step: "Import issues, cycles and projects",
        detail:
          "OmniOS speaks Linear's API natively. Issues, cycles, projects, relationships and labels all survive the move.",
      },
      {
        step: "Wire the issue graph to CRM and code",
        detail:
          "Each issue auto-links to the customer, the deal, the PR, and the revenue surface. No more tab switching to answer 'why does this matter?'",
      },
      {
        step: "Mirror for one sprint, then flip",
        detail:
          "Dual-write for a sprint. Once the team agrees OmniOS feels as good on pure tracking, cancel Linear.",
      },
    ],
    featureRows: [
      { feature: "Fast keyboard-first issue tracking", competitor: true, omnios: true },
      { feature: "Cycles, projects, roadmaps", competitor: true, omnios: true },
      { feature: "Linked CRM, revenue, support", competitor: false, omnios: true },
      { feature: "Native code and PR surface", competitor: "Limited", omnios: true },
      { feature: "AI that drafts and triages tickets", competitor: "Beta", omnios: true },
      { feature: "Finance impact per issue", competitor: false, omnios: true },
      { feature: "Pricing", competitor: "$8/user/mo", omnios: "$99 flat" },
      { feature: "Offline / local AI operation", competitor: false, omnios: true },
    ],
    testimonial: {
      quote:
        "We loved Linear. We loved it less when every issue required opening four more tabs to understand the customer impact. OmniOS put it all on one surface.",
      author: "Priya N.",
      role: "VP Engineering",
      company: "NorthStack",
    },
    faqs: [
      {
        question: "Is the keyboard experience on par with Linear?",
        answer:
          "Yes. OmniOS command palette covers every Linear shortcut muscle memory you have built, plus a lot more since it spans more surfaces.",
      },
      {
        question: "Can we import from Linear without downtime?",
        answer:
          "Yes. The sync is bidirectional during the mirror period, so teams can keep working while engineers cut over.",
      },
    ],
  },

  hubspot: {
    slug: "hubspot",
    name: "HubSpot",
    category: "Marketing + sales CRM",
    accent: "#FF7A59",
    priceLabel: "from $450 / month (Starter, 5 seats)",
    monthlyCostForTeamOfTwelve: 450,
    headline: "OmniOS vs HubSpot: Stop renting a CRM at enterprise prices",
    subhead:
      "HubSpot's Starter plan costs $450 a month before you have sent a single email sequence. OmniOS gives you the CRM, marketing automation, inbox, and the product behind them for $99 flat.",
    metaTitle:
      "OmniOS vs HubSpot: Replace a $450/month CRM with a $99 flat OS",
    metaDescription:
      "HubSpot Starter costs $450/month for 5 seats and adds fees for every module. OmniOS ships CRM, email, pipeline, support, and analytics under one $99 plan.",
    switchingNarrative: [
      "HubSpot is brilliant marketing wrapped around a contact database. The pricing page is the real product — Starter, Pro, Enterprise, Hubs, add-ons, contact tiers, seat tiers, automation tiers.",
      "Teams start on Starter, discover the feature they need is behind Pro, and end up with a $1,200/month bill before the sales team is fully staffed. Meanwhile the data that matters — invoices, product events, support tickets — still lives outside HubSpot.",
      "OmniOS replaces HubSpot's CRM, email engine, sequences, forms, workflows, and reporting with one flat plan. Because the OS also owns your product data and finance data, the CRM finally knows whether the customer is actually paying you.",
    ],
    migrationTitle: "HubSpot to OmniOS in one weekend",
    migrationSteps: [
      {
        step: "Import contacts, deals, pipelines, sequences",
        detail:
          "Our HubSpot connector pulls the full object graph, including custom properties and lifecycle stages.",
      },
      {
        step: "Recompile your marketing automations",
        detail:
          "Describe what each workflow does. The AI Graph Compiler rebuilds it natively — no HubSpot-isms, no if-this-then-that glue.",
      },
      {
        step: "Redirect tracking and cancel",
        detail:
          "Swap the HubSpot tracking snippet for OmniOS analytics. Once first-touch attribution matches for a week, cancel HubSpot.",
      },
    ],
    featureRows: [
      { feature: "Contacts, companies, deals, pipelines", competitor: true, omnios: true },
      { feature: "Marketing email + sequences", competitor: true, omnios: true },
      { feature: "Forms, landing pages, tracking", competitor: true, omnios: true },
      { feature: "Native product + finance data", competitor: false, omnios: true },
      { feature: "Unified inbox with customer context", competitor: "Service Hub add-on", omnios: true },
      { feature: "AI that writes emails and sequences", competitor: "Limited, gated", omnios: true },
      { feature: "Pricing", competitor: "from $450/mo + tiers", omnios: "$99 flat" },
      { feature: "No contact-tier paywalls", competitor: false, omnios: true },
    ],
    testimonial: {
      quote:
        "We were paying $1,140 a month for HubSpot Pro and still exporting to a spreadsheet to see real revenue. OmniOS showed us revenue inside the CRM on day one.",
      author: "Jordan M.",
      role: "Head of Revenue Ops",
      company: "Fieldline",
    },
    faqs: [
      {
        question: "Does OmniOS have landing pages and forms?",
        answer:
          "Yes. The UI Render and Form nodes cover landing pages, campaigns, forms, and lead capture — all wired to the same CRM graph.",
      },
      {
        question: "Can I keep my HubSpot tracking for a month after switching?",
        answer:
          "Yes. Run both trackers in parallel until attribution matches, then remove HubSpot's snippet.",
      },
    ],
  },

  airtable: {
    slug: "airtable",
    name: "Airtable",
    category: "Spreadsheet DB",
    accent: "#F9A825",
    priceLabel: "$20 per user / month (Team)",
    monthlyCostForTeamOfTwelve: 20 * TEAM_SIZE_FOR_CALC,
    headline: "OmniOS vs Airtable: The spreadsheet grew up and got a backend",
    subhead:
      "Airtable is a spreadsheet that wants to be software. OmniOS is the software your spreadsheet was trying to become — with auth, permissions, and a real app compiler on top of the database.",
    metaTitle:
      "OmniOS vs Airtable: Replace bases, blocks and interfaces with a real OS",
    metaDescription:
      "Airtable charges $20/user/month for a spreadsheet with extensions. OmniOS is the actual app, database and AI layer your Airtable base was trying to become — for $99 flat.",
    switchingNarrative: [
      "Airtable is what happens when spreadsheets win. That win has a ceiling: the moment your 'base' needs real auth, real permissions, a real product UI, or real AI, you are bolting on Interfaces, Automations, and Extensions — and paying Pro prices for a simulation of software.",
      "The sync is not real, the permissions are not real, and when a client asks to see 'just their rows', your solution involves four workarounds.",
      "OmniOS treats your Airtable base as the starting schema and emits a real application from it — with row-level security, an AI-assisted UI, full workflow nodes, and a price that does not scale with the number of editors.",
    ],
    migrationTitle: "From Airtable base to real app in an afternoon",
    migrationSteps: [
      {
        step: "Import bases via CSV or API",
        detail:
          "Tables, linked records, formula fields and attachments all come across. Views become saved dashboards.",
      },
      {
        step: "Compile an app from the schema",
        detail:
          "Describe the app in one sentence. OmniOS generates screens, auth, and permission boundaries — no Interfaces to hand-build.",
      },
      {
        step: "Freeze and retire Airtable",
        detail:
          "Mark the old base read-only. After one billing cycle, cancel.",
      },
    ],
    featureRows: [
      { feature: "Flexible table-first database", competitor: true, omnios: true },
      { feature: "Views, filters, sorts, grouping", competitor: true, omnios: true },
      { feature: "Row-level security", competitor: "Enterprise only", omnios: true },
      { feature: "Auto-generated real app UI", competitor: "Interfaces (manual)", omnios: true },
      { feature: "Native workflow + automation graph", competitor: "Limited Automations", omnios: true },
      { feature: "AI over all your data", competitor: "Basic AI field", omnios: true },
      { feature: "Pricing", competitor: "$20/user/mo", omnios: "$99 flat" },
      { feature: "External customer portal", competitor: "Add-on", omnios: true },
    ],
    testimonial: {
      quote:
        "We used Airtable to ship our MVP. OmniOS let us ship v1 — same data, but with real auth, real permissions, and a real UI the customer actually trusted.",
      author: "Diego R.",
      role: "Founder",
      company: "Routewise",
    },
    faqs: [
      {
        question: "Do formula fields carry over?",
        answer:
          "Yes. Formulas and computed fields are rewritten as Compute nodes during import and stay in sync with their underlying rows.",
      },
      {
        question: "Can we keep Airtable for reporting temporarily?",
        answer:
          "Yes. OmniOS can push changes back to Airtable during a migration window so stakeholders are not disrupted.",
      },
    ],
  },

  monday: {
    slug: "monday",
    name: "Monday",
    category: "Work OS",
    accent: "#FF3D57",
    priceLabel: "$9 per user / month (Basic)",
    monthlyCostForTeamOfTwelve: 9 * TEAM_SIZE_FOR_CALC,
    headline: "OmniOS vs Monday: A real Work OS, not just colored tasks",
    subhead:
      "Monday calls itself a Work OS. It is mostly a colorful task tracker with workflow paint on top. OmniOS is the actual operating system that runs the work behind the task.",
    metaTitle:
      "OmniOS vs Monday: The real Work OS, not a task tracker in a trench coat",
    metaDescription:
      "Monday charges $9/user/month for a Kanban board with branding. OmniOS ships the CRM, revenue, inbox, docs and code surface your work actually depends on — for $99 flat.",
    switchingNarrative: [
      "Monday is exceptional marketing wrapped around a task board. Your team can color the tasks in a dozen ways, but nothing behind the board changes — the CRM is elsewhere, the finance is elsewhere, the code is elsewhere.",
      "The 'Work OS' label earns its keep only if the OS actually spans the work. Tasks with no connection to the customer, the revenue, or the deployment are not an OS — they are a nicer spreadsheet.",
      "OmniOS delivers on the phrase. The board node is one of 300 primitives, wired into the same graph as the customer, the revenue, and the product. The task is no longer an island; it is a live view into something real.",
    ],
    migrationTitle: "From Monday board to real OS in one afternoon",
    migrationSteps: [
      {
        step: "Import boards, items, columns and automations",
        detail:
          "OmniOS maps Monday columns to proper typed fields, preserves dependencies, and brings automations over as native graphs.",
      },
      {
        step: "Wire the boards into your real stack",
        detail:
          "Say what the board is for. The compiler wires it to CRM, revenue, support, or code depending on the intent.",
      },
      {
        step: "Run parallel for a week, then retire",
        detail:
          "Dual-write boards for a week. Cancel Monday once the team confirms the new surface is better.",
      },
    ],
    featureRows: [
      { feature: "Kanban + timeline + calendar views", competitor: true, omnios: true },
      { feature: "Workflow automations", competitor: "Limited", omnios: true },
      { feature: "Native CRM beneath the board", competitor: "Add-on Hub", omnios: true },
      { feature: "Revenue / finance context on tasks", competitor: false, omnios: true },
      { feature: "AI that triages and assigns", competitor: "Beta", omnios: true },
      { feature: "Docs alongside work", competitor: "Limited", omnios: true },
      { feature: "Pricing", competitor: "$9/user/mo + Hub tiers", omnios: "$99 flat" },
      { feature: "Customer portal and external boards", competitor: "Paid add-on", omnios: true },
    ],
    testimonial: {
      quote:
        "Monday gave us pretty boards and exactly zero answers about revenue. OmniOS put the revenue next to the tasks and we closed three deals the first week we switched.",
      author: "Nina F.",
      role: "COO",
      company: "Brightfold",
    },
    faqs: [
      {
        question: "Do Monday automations transfer?",
        answer:
          "Yes. They are recompiled into native nodes during import, usually simpler and faster than the original.",
      },
      {
        question: "Does OmniOS support timeline and Gantt views?",
        answer:
          "Yes. Timeline, Gantt, calendar, Kanban and table are all first-class view modes on any board.",
      },
    ],
  },

  asana: {
    slug: "asana",
    name: "Asana",
    category: "Project tracker",
    accent: "#F06A6A",
    priceLabel: "$10.99 per user / month (Starter)",
    monthlyCostForTeamOfTwelve: Math.round(10.99 * TEAM_SIZE_FOR_CALC),
    headline: "OmniOS vs Asana: Your company is not a list of tasks",
    subhead:
      "Asana asks you to rebuild your business in tasks and projects. OmniOS models your business as it actually runs and renders tasks on top of that model — not the other way around.",
    metaTitle:
      "OmniOS vs Asana: Tasks are a view, not the business itself",
    metaDescription:
      "Asana costs $10.99/user/month for a project tracker. OmniOS gives you the real OS — CRM, revenue, product, tasks — for $99 flat. See the feature-by-feature comparison.",
    switchingNarrative: [
      "Asana was a great answer to email-as-project-management. It is a worse answer to 'where does our company actually live?'",
      "Tasks are the output of a business, not the business itself. When your tasks cannot see the customer, the deal, the revenue, or the code, you are tracking shadows.",
      "OmniOS flips it. The company lives in the OS; tasks are a view. Close a deal — tasks spawn automatically. Ship a fix — tickets resolve themselves. The project manager becomes a pilot, not a data entry clerk.",
    ],
    migrationTitle: "Leave Asana without losing a task",
    migrationSteps: [
      {
        step: "Import projects, tasks, subtasks, rules",
        detail:
          "OmniOS reads Asana via API. Custom fields, assignees, due dates and rules are all preserved.",
      },
      {
        step: "Connect tasks to the real business graph",
        detail:
          "Each task auto-links to the customer, deal, or feature it belongs to. No more orphan tasks.",
      },
      {
        step: "Cut over and cancel",
        detail:
          "Mirror for a week to be safe, then cancel Asana. No lost history, no double data entry.",
      },
    ],
    featureRows: [
      { feature: "Projects, tasks, subtasks, dependencies", competitor: true, omnios: true },
      { feature: "Custom fields and workflows", competitor: true, omnios: true },
      { feature: "Tasks linked to CRM and revenue", competitor: false, omnios: true },
      { feature: "Native docs, inbox, finance", competitor: false, omnios: true },
      { feature: "AI that creates and closes tasks", competitor: "Intelligence add-on", omnios: true },
      { feature: "Portfolios and goals", competitor: "Advanced tier", omnios: true },
      { feature: "Pricing", competitor: "$10.99/user/mo", omnios: "$99 flat" },
      { feature: "External collaborators free", competitor: "Limited", omnios: true },
    ],
    testimonial: {
      quote:
        "Half our tasks in Asana were reminders to update something in another tool. In OmniOS those tasks just do not exist anymore — the data is already connected.",
      author: "Tom R.",
      role: "Program Lead",
      company: "Quarterfield",
    },
    faqs: [
      {
        question: "Do Asana rules transfer?",
        answer:
          "Yes. Rules are recompiled as native automations during import, usually with fewer steps.",
      },
      {
        question: "Can we preserve task history?",
        answer:
          "Yes. Comments, status changes, and attachments all migrate with the task.",
      },
    ],
  },

  jira: {
    slug: "jira",
    name: "Jira",
    category: "Engineering tracker",
    accent: "#0052CC",
    priceLabel: "$7.75 per user / month (Standard)",
    monthlyCostForTeamOfTwelve: Math.round(7.75 * TEAM_SIZE_FOR_CALC),
    headline: "OmniOS vs Jira: Engineering deserves better than a decade of config",
    subhead:
      "Jira punishes engineers with configuration and rewards admins. OmniOS gives you modern issue tracking, code context, deploys, and the customer complaint that caused the ticket — compiled, not configured.",
    metaTitle:
      "OmniOS vs Jira: Engineering OS with tickets, code, and customer context",
    metaDescription:
      "Jira costs $7.75/user/month and requires a full-time admin. OmniOS replaces Jira with a modern engineering OS that also owns code, customers and deploys — for $99 flat.",
    switchingNarrative: [
      "Jira survived on inertia. Every engineer has a Jira horror story; every admin has a config diagram that looks like a subway map.",
      "The deep problem is not the UI. It is that Jira was designed before the customer, the code, the deploy, and the financial impact of a bug were expected to live in one place. So they never did, and the tickets became a desert.",
      "OmniOS treats the ticket as one node in a graph that already owns the PR, the customer who reported the bug, the revenue the fix protects, and the deploy that ships it. You get Jira-grade tracking without Jira's configuration tax.",
    ],
    migrationTitle: "From Jira to OmniOS without breaking the release",
    migrationSteps: [
      {
        step: "Import projects, issues, sprints, workflows",
        detail:
          "Custom fields, issue types, link types, and sprint history all migrate via Jira's REST API.",
      },
      {
        step: "Keep the release train running",
        detail:
          "OmniOS syncs bidirectionally with Jira during cutover so release managers do not have to choose a flip day.",
      },
      {
        step: "Retire and reclaim admin time",
        detail:
          "Once the team is off Jira, disable the license. Reassign your Jira admin to actual engineering.",
      },
    ],
    featureRows: [
      { feature: "Sprints, epics, backlogs, roadmaps", competitor: true, omnios: true },
      { feature: "Modern keyboard-first UI", competitor: false, omnios: true },
      { feature: "Linked PRs, commits and deploys", competitor: "With add-ons", omnios: true },
      { feature: "Customer + revenue context on tickets", competitor: false, omnios: true },
      { feature: "AI triage and auto-assignment", competitor: "Atlassian Intelligence (paid)", omnios: true },
      { feature: "Zero-admin configuration", competitor: false, omnios: true },
      { feature: "Pricing", competitor: "$7.75/user/mo + admin cost", omnios: "$99 flat" },
      { feature: "Local / on-prem option", competitor: "Data Center (enterprise)", omnios: true },
    ],
    testimonial: {
      quote:
        "We had a full-time Jira admin. We do not have a full-time OmniOS admin because there is nothing to configure. Release velocity went up twenty percent.",
      author: "Elena S.",
      role: "Director of Engineering",
      company: "Helioform",
    },
    faqs: [
      {
        question: "Do custom Jira workflows transfer?",
        answer:
          "Yes. Workflow transitions, validators and conditions are rewritten as native OmniOS workflow nodes.",
      },
      {
        question: "Is there a Data Center / on-prem option?",
        answer:
          "Yes. OmniOS runs on your own infrastructure with local AI, no outbound data required.",
      },
    ],
  },

  salesforce: {
    slug: "salesforce",
    name: "Salesforce",
    category: "Enterprise CRM",
    accent: "#00A1E0",
    priceLabel: "from $25 per user / month (Starter) — plus implementation",
    monthlyCostForTeamOfTwelve: 25 * TEAM_SIZE_FOR_CALC,
    headline: "OmniOS vs Salesforce: The CRM that does not need a consultant",
    subhead:
      "Salesforce demands a six-figure implementation before the first lead is logged. OmniOS compiles your entire pipeline from one sentence of intent and ships it in 90 seconds.",
    metaTitle:
      "OmniOS vs Salesforce: A modern CRM without the consulting industry",
    metaDescription:
      "Salesforce costs $25+/user/month before the $50k implementation. OmniOS ships a complete CRM, pipeline, forecasting, and service cloud for $99 flat. No consultants required.",
    switchingNarrative: [
      "Salesforce is not a CRM — it is a platform you pay a consulting firm to turn into a CRM. By the time your org is 'live' you have spent more on implementation than on the software.",
      "Admins accumulate, reports multiply, the data model drifts, and the executives stop trusting the dashboards. The CRM becomes a tax the revenue team pays for the privilege of being measured.",
      "OmniOS replaces this whole apparatus. You describe the pipeline in English; the Graph Compiler stands up accounts, contacts, opportunities, forecasting, and service. No Apex, no flows, no admin certifications. The data model is yours, not the platform's.",
    ],
    migrationTitle: "Leave Salesforce without firing your RevOps team",
    migrationSteps: [
      {
        step: "Import accounts, contacts, opportunities, activities",
        detail:
          "OmniOS's Salesforce connector reads every standard and custom object, including history tables.",
      },
      {
        step: "Recompile process builder and flows",
        detail:
          "Describe each flow. The AI Graph Compiler rebuilds it natively, usually in a tenth of the steps.",
      },
      {
        step: "Sunset the org",
        detail:
          "Freeze Salesforce as a read-only archive for compliance. Cancel active licenses. Reallocate the admin and consultant budget.",
      },
    ],
    featureRows: [
      { feature: "Accounts, contacts, opps, forecasting", competitor: true, omnios: true },
      { feature: "Custom objects and relationships", competitor: true, omnios: true },
      { feature: "Service cloud / support inbox", competitor: "Separate SKU", omnios: true },
      { feature: "Marketing automation", competitor: "Separate SKU", omnios: true },
      { feature: "AI that writes and runs workflows", competitor: "Einstein (paid)", omnios: true },
      { feature: "Zero-consultant implementation", competitor: false, omnios: true },
      { feature: "Pricing", competitor: "$25+/user/mo + impl.", omnios: "$99 flat" },
      { feature: "On-prem with local AI", competitor: "Hyperforce (enterprise)", omnios: true },
    ],
    testimonial: {
      quote:
        "Our Salesforce bill was $9,200 a month before the $180,000 implementation. OmniOS stood up a better pipeline in an afternoon — and our reps actually use it.",
      author: "Alex H.",
      role: "VP Revenue Operations",
      company: "Prismwave",
    },
    faqs: [
      {
        question: "Can we preserve our Salesforce data model?",
        answer:
          "Yes. Custom objects, fields and relationships are imported verbatim. You can evolve the model after migration without breaking history.",
      },
      {
        question: "What about compliance and audit history?",
        answer:
          "OmniOS supports SOC2, HIPAA and on-prem deployments, and preserves the full audit trail from Salesforce on import.",
      },
    ],
  },

  n8n: {
    slug: "n8n",
    name: "n8n",
    category: "Self-hosted automation",
    accent: "#EA4B71",
    priceLabel: "$20 / month (Cloud Starter) or self-hosted ops cost",
    monthlyCostForTeamOfTwelve: 20,
    headline: "OmniOS vs n8n: The automation canvas that owns its own apps",
    subhead:
      "n8n is a clever workflow canvas stitched across someone else's apps. OmniOS is the canvas and the apps — with an AI Graph Compiler that writes the workflow from one English sentence.",
    metaTitle:
      "OmniOS vs n8n: Self-hosted automation without the self-hosting",
    metaDescription:
      "n8n gives you a workflow canvas over third-party tools. OmniOS gives you the tools, the canvas, and the AI that writes it — for $99 flat, without managing containers.",
    switchingNarrative: [
      "n8n's promise is sovereignty: run your own automations, on your own infrastructure, without Zapier's meter. The catch is that the underlying apps still belong to someone else, and you become the ops team for the integrations.",
      "Every version bump, credential rotation, and webhook schema change becomes a late-night page. The automation layer is yours; the business logic is still scattered across vendors.",
      "OmniOS takes ownership further. The CRM, inbox, finance and product surfaces are native — the automation canvas talks to nodes inside the same graph. You get n8n's sovereignty without n8n's ops burden, and an AI that composes the graph from natural language.",
    ],
    migrationTitle: "From n8n workflows to native nodes",
    migrationSteps: [
      {
        step: "Export workflows as JSON",
        detail:
          "n8n exports cleanly. OmniOS imports the JSON and maps each node to its native equivalent — typically fewer steps after conversion.",
      },
      {
        step: "Run in a sandbox",
        detail:
          "Each migrated workflow runs in an inspectable sandbox with replay, so engineers can verify parity step by step.",
      },
      {
        step: "Decommission the n8n instance",
        detail:
          "Shut down the n8n server once every workflow is validated. Stop paying for the VM, the Postgres, and the pager.",
      },
    ],
    featureRows: [
      { feature: "Visual workflow canvas", competitor: true, omnios: true },
      { feature: "Self-hostable / on-prem", competitor: true, omnios: true },
      { feature: "Native CRM, inbox, finance, docs", competitor: false, omnios: true },
      { feature: "AI that writes workflows from English", competitor: "Community nodes", omnios: true },
      { feature: "Local AI for inference inside workflows", competitor: "Bring your own", omnios: true },
      { feature: "Zero-ops hosted option", competitor: "Cloud Starter limited", omnios: true },
      { feature: "Pricing", competitor: "$20/mo + hosting", omnios: "$99 flat" },
      { feature: "Node marketplace with revenue share", competitor: "No", omnios: true },
    ],
    testimonial: {
      quote:
        "n8n was great until our workflow count passed fifty and credential management became a second job. OmniOS absorbed every workflow and the apps they glued.",
      author: "Hiro K.",
      role: "Staff Engineer",
      company: "Meridian Labs",
    },
    faqs: [
      {
        question: "Is OmniOS self-hostable like n8n?",
        answer:
          "Yes. OmniOS runs on your own infrastructure with local AI, giving you n8n-level sovereignty over the workflow engine and the apps it drives.",
      },
      {
        question: "Do community nodes transfer?",
        answer:
          "Standard n8n nodes map directly. Community nodes migrate via our API Bridge primitive and can be republished to the OmniOS Node Registry.",
      },
    ],
  },
};

const COMPETITOR_SLUGS = Object.keys(COMPETITOR_DATA);

/* ─── Helpers ────────────────────────────────────────────────────────────── */

/**
 * Serialize a statically-defined object for inclusion in a JSON-LD script
 * element, escaping any sequences that could let the payload escape the
 * script context. All inputs here are compile-time constants, but the
 * hardening is kept so the function is safe to reuse.
 */
function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function getProfile(slug: string): CompetitorProfile | null {
  return COMPETITOR_DATA[slug] ?? null;
}

/* ─── Next.js handlers ───────────────────────────────────────────────────── */

export function generateStaticParams(): Array<{ competitor: string }> {
  return COMPETITOR_SLUGS.map((competitor) => ({ competitor }));
}

export const dynamicParams = false;

type PageParams = { competitor: string };

interface PageProps {
  params: Promise<PageParams>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { competitor } = await params;
  const profile = getProfile(competitor);

  if (!profile) {
    return { title: "Comparison not found" };
  }

  const canonical = `https://omnios.app/compare/${profile.slug}`;

  return {
    title: profile.metaTitle,
    description: profile.metaDescription,
    keywords: [
      `OmniOS vs ${profile.name}`,
      `${profile.name} alternative`,
      `replace ${profile.name}`,
      `${profile.name} pricing`,
      `${profile.name} vs OmniOS`,
      "AI operating system",
      "all-in-one workspace",
    ],
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      siteName: "OmniOS",
      title: profile.metaTitle,
      description: profile.metaDescription,
      images: [
        {
          url: `/og-compare-${profile.slug}.png`,
          width: 1200,
          height: 630,
          alt: `OmniOS versus ${profile.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: profile.metaTitle,
      description: profile.metaDescription,
      images: [`/og-compare-${profile.slug}.png`],
    },
  };
}

/* ─── UI atoms ───────────────────────────────────────────────────────────── */

function Check() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-4 w-4 text-emerald-400"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Cross() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-4 w-4 text-white/30"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
    >
      <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
    </svg>
  );
}

function Cell({ value }: { value: boolean | string }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-white/90">
        <Check />
        Included
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-white/40">
        <Cross />
        Not included
      </span>
    );
  }
  return <span className="text-sm text-white/70">{value}</span>;
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default async function CompetitorComparePage({ params }: PageProps) {
  const { competitor } = await params;
  const profile = getProfile(competitor);

  if (!profile) {
    notFound();
  }

  const annualSavings =
    profile.monthlyCostForTeamOfTwelve * 12 - OMNIOS_FLAT_PRICE * 12;
  const savingsPercent = Math.round(
    (annualSavings / (profile.monthlyCostForTeamOfTwelve * 12)) * 100,
  );

  const softwareAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "OmniOS",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, macOS, Windows, Linux",
    offers: {
      "@type": "Offer",
      price: OMNIOS_FLAT_PRICE.toString(),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      priceValidUntil: "2030-12-31",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1284",
      bestRating: "5",
      worstRating: "1",
    },
    description:
      "OmniOS is the AI-powered business platform. It replaces $43,000/year of disconnected SaaS with one AI-native OS for $99/month.",
    url: "https://omnios.app",
    brand: {
      "@type": "Organization",
      name: "OmniOS",
      url: "https://omnios.app",
    },
  };

  const comparisonPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `https://omnios.app/compare/${profile.slug}#webpage`,
    name: profile.metaTitle,
    description: profile.metaDescription,
    url: `https://omnios.app/compare/${profile.slug}`,
    dateModified: new Date().toISOString(),
    mainEntity: {
      "@type": "ItemList",
      name: `OmniOS vs ${profile.name}`,
      itemListElement: [
        {
          "@type": "SoftwareApplication",
          name: "OmniOS",
          offers: {
            "@type": "Offer",
            price: OMNIOS_FLAT_PRICE.toString(),
            priceCurrency: "USD",
          },
        },
        {
          "@type": "SoftwareApplication",
          name: profile.name,
          offers: {
            "@type": "Offer",
            price: profile.monthlyCostForTeamOfTwelve.toString(),
            priceCurrency: "USD",
          },
        },
      ],
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://omnios.app",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Compare",
          item: "https://omnios.app/compare",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `OmniOS vs ${profile.name}`,
          item: `https://omnios.app/compare/${profile.slug}`,
        },
      ],
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: profile.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      {/*
        JSON-LD is rendered as React text children. React text-encodes all
        strings, which is safe for application/ld+json since browsers parse
        the payload as JSON, not HTML. The serializeJsonLd helper additionally
        escapes any script-context-breaking sequences for defense in depth.
      */}
      <script type="application/ld+json">
        {serializeJsonLd(softwareAppJsonLd)}
      </script>
      <script type="application/ld+json">
        {serializeJsonLd(comparisonPageJsonLd)}
      </script>
      <script type="application/ld+json">{serializeJsonLd(faqJsonLd)}</script>

      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="mx-auto flex max-w-7xl items-center gap-2 px-6 pt-8 text-xs text-white/40"
      >
        <Link href="/" className="hover:text-white/70">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/compare" className="hover:text-white/70">
          Compare
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-white/60">OmniOS vs {profile.name}</span>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,rgba(99,102,241,0.2),transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6366F1]/50 to-transparent"
        />

        <div className="relative mx-auto max-w-5xl px-6 pb-16 pt-14 text-center sm:pb-20 sm:pt-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
            Comparison · {profile.category}
          </div>

          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            {profile.headline}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">
            {profile.subhead}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-[#6366F1] px-6 py-3 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(99,102,241,0.4),0_12px_32px_-8px_rgba(99,102,241,0.8)] transition-all hover:bg-[#5558E3]"
            >
              Switch from {profile.name} — free for 14 days
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.06]"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Savings calculator */}
      <section className="border-y border-white/5 bg-[#07070C]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1.1fr_1fr] md:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#D4AF37]">
              Cost calculator · Team of {TEAM_SIZE_FOR_CALC}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              What {profile.name} is actually costing you
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/60">
              Based on {profile.priceLabel}. The calculator below uses public
              pricing only — it does not include admin time, consultant fees, or
              the SaaS tools you bought to patch over {profile.name}&apos;s
              gaps.
            </p>
            <p className="mt-6 text-sm text-white/40">
              Assumption: a team of {TEAM_SIZE_FOR_CALC}. OmniOS is flat-priced
              at ${OMNIOS_FLAT_PRICE}/month, regardless of seat count.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="flex items-center justify-between">
                <span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-base font-semibold text-black"
                  style={{ backgroundColor: profile.accent }}
                >
                  {profile.name.charAt(0)}
                </span>
                <span className="text-xs text-white/40">Your current cost</span>
              </div>
              <p className="mt-4 text-sm text-white/60">{profile.name}</p>
              <p className="mt-1 text-4xl font-semibold tracking-tight">
                ${profile.monthlyCostForTeamOfTwelve.toLocaleString()}
                <span className="text-base font-medium text-white/40"> /mo</span>
              </p>
              <p className="mt-2 text-sm text-white/40">
                ${(profile.monthlyCostForTeamOfTwelve * 12).toLocaleString()} /year
              </p>
            </div>

            <div className="rounded-2xl border border-[#6366F1]/40 bg-[#6366F1]/[0.08] p-6 shadow-[0_24px_60px_-20px_rgba(99,102,241,0.4)]">
              <div className="flex items-center justify-between">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-base font-semibold text-white">
                  O
                </span>
                <span className="text-xs font-medium text-[#D4AF37]">
                  Flat — no seat tax
                </span>
              </div>
              <p className="mt-4 text-sm text-white/70">OmniOS</p>
              <p className="mt-1 text-4xl font-semibold tracking-tight text-white">
                ${OMNIOS_FLAT_PRICE}
                <span className="text-base font-medium text-white/50"> /mo</span>
              </p>
              <p className="mt-2 text-sm text-white/50">
                ${(OMNIOS_FLAT_PRICE * 12).toLocaleString()} /year
              </p>
            </div>

            <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/[0.06] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#D4AF37]">
                Your savings
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">
                ${annualSavings.toLocaleString()}/yr
              </p>
              <p className="mt-1 text-sm text-white/60">
                {savingsPercent}% lower than {profile.name} — and that is before
                counting the tools OmniOS also replaces.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why teams are switching */}
      <section className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#D4AF37]">
          Why teams are switching
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          The honest reason companies leave {profile.name}
        </h2>
        <div className="mt-8 space-y-6">
          {profile.switchingNarrative.map((paragraph, index) => (
            <p
              key={index}
              className="text-lg leading-relaxed text-white/70 first:text-white/80"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Feature table */}
      <section className="border-y border-white/5 bg-[#07070C]">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#D4AF37]">
                Feature comparison
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Eight things your team actually needs
              </h2>
            </div>
            <p className="max-w-sm text-sm text-white/50">
              We cut the vanity rows. This is the shortlist that decides whether
              you cancel {profile.name} this quarter.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-white/[0.03] text-xs uppercase tracking-[0.12em] text-white/50">
                  <th scope="col" className="px-6 py-4 font-medium">
                    Feature
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex h-6 w-6 items-center justify-center rounded text-[11px] font-semibold text-black"
                        style={{ backgroundColor: profile.accent }}
                      >
                        {profile.name.charAt(0)}
                      </span>
                      {profile.name}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-[11px] font-semibold text-white">
                        O
                      </span>
                      OmniOS
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {profile.featureRows.map((row, index) => (
                  <tr
                    key={row.feature}
                    className={
                      index % 2 === 0 ? "bg-transparent" : "bg-white/[0.015]"
                    }
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-white/90"
                    >
                      {row.feature}
                    </th>
                    <td className="px-6 py-4 align-middle">
                      <Cell value={row.competitor} />
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <Cell value={row.omnios} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Migration */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
        <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#D4AF37]">
              Migration
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {profile.migrationTitle}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/60">
              Our team has moved hundreds of companies off {profile.name}.
              Nothing here requires a consultant. If you get stuck, a founder
              replies within the hour.
            </p>
            <a
              href="mailto:migrations@omnios.app"
              className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-[#6366F1] hover:text-[#8B5CF6]"
            >
              Get a migration review
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <ol className="space-y-4">
            {profile.migrationSteps.map((step, index) => (
              <li
                key={step.step}
                className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 pl-16"
              >
                <span className="absolute left-6 top-6 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#6366F1]/40 bg-[#6366F1]/[0.12] text-sm font-semibold text-[#8B9BFF]">
                  {index + 1}
                </span>
                <h3 className="text-lg font-semibold tracking-tight text-white">
                  {step.step}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {step.detail}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Testimonial */}
      <section className="border-y border-white/5 bg-[#07070C]">
        <div className="mx-auto max-w-4xl px-6 py-20 sm:py-24">
          <figure className="relative rounded-3xl border border-white/10 bg-white/[0.02] p-10 sm:p-14">
            <div
              aria-hidden="true"
              className="absolute -top-3 left-10 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#0A0A0F] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-[#D4AF37]"
            >
              Customer story
            </div>

            <blockquote className="text-2xl font-medium leading-[1.35] tracking-tight text-white sm:text-3xl">
              &ldquo;{profile.testimonial.quote}&rdquo;
            </blockquote>

            <figcaption className="mt-8 flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-sm font-semibold text-white">
                {profile.testimonial.author
                  .split(" ")
                  .map((part) => part.charAt(0))
                  .join("")}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  {profile.testimonial.author}
                </div>
                <div className="text-xs text-white/50">
                  {profile.testimonial.role} · {profile.testimonial.company}
                </div>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-6 py-20 sm:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#D4AF37]">
          Objections, answered
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          What we hear when teams evaluate the switch
        </h2>

        <dl className="mt-10 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02]">
          {profile.faqs.map((faq) => (
            <div key={faq.question} className="p-6 sm:p-8">
              <dt className="text-base font-semibold text-white">
                {faq.question}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-white/60">
                {faq.answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(99,102,241,0.18),transparent_70%)]"
        />
        <div className="relative mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
          <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Cancel {profile.name}. Keep the work.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/60">
            Save ${annualSavings.toLocaleString()} a year, replace the tools
            that prop {profile.name} up, and ship faster with an OS your team
            will actually open on Monday morning.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-[#6366F1] px-6 py-3 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(99,102,241,0.4),0_12px_32px_-8px_rgba(99,102,241,0.8)] transition-all hover:bg-[#5558E3]"
            >
              Start free — 14 days, no card required
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.06]"
            >
              Compare other tools
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
