export interface PostBody {
  toc: Array<{ id: string; label: string }>;
  html: string;
}

export const POST_BODIES: Record<string, PostBody> = {
  "how-we-replaced-seven-saas-tools-with-one-command": {
    toc: [
      { id: "the-stack-we-had", label: "The stack we had" },
      { id: "the-tipping-point", label: "The tipping point" },
      { id: "the-one-command", label: "The one command" },
      { id: "what-actually-moved", label: "What actually moved" },
      { id: "the-workflows", label: "The workflows we rebuilt" },
      { id: "the-numbers", label: "The numbers: $3,400/mo to $100/mo" },
      { id: "what-broke", label: "What broke (and what didn't)" },
      { id: "lessons", label: "Lessons for teams considering the same" },
    ],
    html: `
<p class="lead">This is the internal migration story. Nine months ago, OmniOS — the company behind OmniOS — ran on seven separate SaaS tools. Today we run on one. We replaced Notion, Jira, HubSpot, Zapier, Zendesk, QuickBooks, and Slack with a single OmniOS workspace. Here is exactly how, and what it cost us to get there.</p>

<h2 id="the-stack-we-had">The stack we had</h2>
<p>At our peak fragmentation, a 14-person team was operating across seven primary tools and three secondary ones. The primary seven:</p>
<ul>
  <li><strong>Notion</strong> for docs, wiki, and internal knowledge base ($240/mo)</li>
  <li><strong>Jira</strong> for engineering tickets and sprints ($560/mo)</li>
  <li><strong>HubSpot</strong> for CRM, marketing, and deal tracking ($1,200/mo)</li>
  <li><strong>Zapier</strong> for the twenty-three integrations holding everything together ($149/mo)</li>
  <li><strong>Zendesk</strong> for customer support tickets ($475/mo)</li>
  <li><strong>QuickBooks Online</strong> for accounting, invoicing, and expense tracking ($200/mo)</li>
  <li><strong>Slack</strong> for team communication ($580/mo)</li>
</ul>
<p>Monthly total: <strong>$3,404</strong>. Annual: $40,848. For 14 people, doing decidedly ordinary work.</p>

<h2 id="the-tipping-point">The tipping point</h2>
<p>The tipping point was not price. It was a Wednesday afternoon in July when a new customer asked our head of success for a complete account history. She needed to pull: the Zendesk ticket thread, the HubSpot deal record, the Slack conversation from #customer-alpha, the QuickBooks invoice status, the Notion project doc, and the Jira tickets for the custom work we did for them.</p>
<p>Six tools. One customer. Forty-three minutes of copy-pasting to answer a question that should have taken ninety seconds. The customer was polite about the delay. We were not polite with ourselves afterward.</p>
<p>That week we started the migration.</p>

<h2 id="the-one-command">The one command</h2>
<p>"One command" is not marketing. The bulk of the migration ran from a single command bar invocation:</p>
<blockquote>Migrate our workspace from HubSpot, Jira, Notion, Zendesk, and QuickBooks. Preserve all records, relationships, attachments, and history. Map Zendesk tickets to support cases. Map Jira issues to engineering tasks. Map HubSpot deals to our pipeline. Flag anything that needs review.</blockquote>
<p>OmniOS's migration engine ran overnight. In the morning: 14,200 records imported across contacts, deals, tickets, tasks, documents, invoices, and expense lines — with relationships preserved. Eighty-seven items flagged for manual review. Zero data loss.</p>

<h2 id="what-actually-moved">What actually moved</h2>
<p>Here's the concrete inventory of what came across:</p>
<ul>
  <li><strong>HubSpot:</strong> 3,847 contacts, 612 companies, 294 active deals, 4 years of email history, 38 custom properties</li>
  <li><strong>Jira:</strong> 2,104 issues across 8 projects, 24 custom workflows, 180 active sprints (archived), all attachments and comments</li>
  <li><strong>Notion:</strong> 890 pages, 34 databases, 1,200 linked references, nested hierarchy preserved</li>
  <li><strong>Zendesk:</strong> 1,680 tickets, 14,000 messages, macros, triggers, and SLA policies</li>
  <li><strong>QuickBooks:</strong> 3 years of invoices, expenses, chart of accounts, customer balances, and vendor records</li>
</ul>
<p>Slack and Zapier didn't need traditional migration. Slack was replaced by OmniOS's built-in channels. The Zapier automations were replaced by native workflows — more on that below.</p>

<h2 id="the-workflows">The workflows we rebuilt</h2>
<p>The twenty-three Zapier automations were the most interesting part of the migration. Most of them existed to glue the seven tools together — "when a HubSpot deal closes, create a Jira epic and a Notion doc and ping #sales in Slack and generate a QuickBooks invoice." When the underlying tools consolidate, those zaps stop being necessary.</p>
<p>Of the 23 zaps, 16 became obsolete the moment the data lived in one place. The remaining 7 were rebuilt as native OmniOS workflows in a single afternoon. Three examples:</p>
<p><strong>New customer onboarding:</strong> When a deal moves to Closed Won, generate an onboarding project with 14 tasks assigned to customer success, create the first invoice in the finance module, send a welcome email from the account manager, add the primary contact to the #customer-onboarding channel, and schedule the 30-day check-in. One workflow. Previously four zaps.</p>
<p><strong>Support escalation:</strong> When a support case sits unresolved for 24 hours and the customer's MRR is above $2,000, escalate to the engineering lead with full context attached — the original ticket, the customer's deal history, and any related engineering tasks. Previously a Zapier chain that broke every six weeks.</p>
<p><strong>Churn early warning:</strong> Monitor the knowledge graph for customers whose ticket volume has spiked, whose usage has dropped, or whose primary contact has stopped replying to emails. Surface them weekly in a Signals digest. This workflow did not exist before — it was too expensive to build across five tools.</p>

<h2 id="the-numbers">The numbers: $3,400/mo to $100/mo</h2>
<p>Monthly software bill before: $3,404. Monthly software bill after: $100 (OmniOS Business for 14 seats). Annualized saving: <strong>$39,648</strong>.</p>
<p>But the software cost was the smaller number. The bigger wins:</p>
<ul>
  <li>The half-FTE of operations time we used to spend on tool administration, integration maintenance, and license management — recovered. That's roughly $55,000/year in reclaimed time.</li>
  <li>Context-switching reduced from an average of 11 tool-switches per person per day to 2. Self-reported productivity rose by about 18% in the first quarter post-migration.</li>
  <li>The 43-minute customer history lookup became a 90-second answer in the command bar. "Show me everything about Acme Corp" works now.</li>
</ul>

<h2 id="what-broke">What broke (and what didn't)</h2>
<p>Honesty matters here. A few things did break.</p>
<p>Our custom Jira automation for release branching didn't map cleanly. We rebuilt it as a workflow but lost some of the fine-grained permissioning. We'll get it back when OmniOS ships per-field permission rules in Q3.</p>
<p>Zendesk's macros had accumulated nine years of cruft. The migration preserved them faithfully. In retrospect we should have pruned to 30 and rebuilt from there.</p>
<p>What did <em>not</em> break: anything customer-facing. The migration happened over a weekend. On Monday morning, every customer email, support thread, and in-progress conversation continued without interruption.</p>

<h2 id="lessons">Lessons for teams considering the same</h2>
<p><strong>Migrate on a Friday.</strong> Give yourself the weekend for data verification. The automated migration handles 95%; the remaining 5% benefits from a quiet 48-hour review window.</p>
<p><strong>Archive your zaps, don't rebuild them.</strong> The majority of inter-tool automations vanish when the tools consolidate. Build the new workflows from current needs, not from what you already had.</p>
<p><strong>Prune while you port.</strong> Eight years of Notion pages and Jira tickets contain a lot of archaeology. The migration is a natural moment to delete what nobody reads.</p>
<p><strong>Tell your customers.</strong> We sent a one-paragraph note to our top 50 accounts the week before the switch. No one cared about the back-end change, but several said they appreciated the transparency.</p>
<p>Nine months in, we have not considered going back. If you want to compare this to your own stack cost, the <a href="/tools/saas-cost-calculator">SaaS Cost Calculator</a> will generate an estimate in about 90 seconds.</p>
    `,
  },

  "how-to-replace-notion-with-ai-workspace": {
    toc: [
      { id: "why-teams-leave-notion", label: "Why teams leave Notion in 2026" },
      { id: "notion-ceiling", label: "The Notion ceiling" },
      { id: "ai-first-difference", label: "What 'AI-first workspace' actually means" },
      { id: "ten-reasons", label: "Ten reasons to switch from Notion" },
      { id: "feature-comparison", label: "Notion vs OmniOS: feature comparison" },
      { id: "migration-playbook", label: "The migration playbook" },
      { id: "who-should-stay", label: "Who should stay on Notion" },
    ],
    html: `
<p class="lead">Notion is an excellent block-based document editor that has spent five years trying to become a work operating system. It has not quite gotten there. If you've outgrown Notion and you're looking for an AI-first workspace that can actually run your business, this is the guide.</p>

<h2 id="why-teams-leave-notion">Why teams leave Notion in 2026</h2>
<p>Notion won the early 2020s on flexibility. You could bend it into a CRM, a project tracker, a knowledge base, or a customer directory. The ceiling of that flexibility is now visible. Teams leaving Notion in 2026 cite a consistent set of reasons: sluggish performance on large workspaces, AI features that feel bolted-on, the absence of a real CRM or finance layer, and the relentless need to manually wire databases together with relation properties.</p>
<p>Notion is a great document tool. It was never a great operating system, and the gap is widening as the rest of the category moves toward AI-native workflows.</p>

<h2 id="notion-ceiling">The Notion ceiling</h2>
<p>There is a specific moment every Notion team hits. We call it the Notion ceiling. It looks like this:</p>
<ul>
  <li>You have 8 databases relating to each other through rollups and relations</li>
  <li>Your largest database has 4,000+ rows and takes 8 seconds to load</li>
  <li>You have three team members who understand how the whole structure fits together, and everyone else edits timidly for fear of breaking something</li>
  <li>You use Zapier or Make to sync Notion with your CRM, your calendar, your email, and your support tool</li>
  <li>Notion AI can summarize a page but cannot answer "which deals need follow-up this week?"</li>
</ul>
<p>When you hit the ceiling, adding more Notion features does not help. You need a different shape of tool.</p>

<h2 id="ai-first-difference">What "AI-first workspace" actually means</h2>
<p>AI-first is an overloaded phrase. Here is the concrete difference between AI bolted onto a document editor and AI that is the foundation of the workspace.</p>
<p><strong>Bolted-on AI</strong> writes text inside a page. You highlight a paragraph, press a shortcut, and it rewrites or summarizes. Useful, narrow, inherently document-scoped.</p>
<p><strong>Foundational AI</strong> sits between you and your entire business data. It reads your CRM, your tasks, your documents, your support cases, and your financial records as a single connected graph. When you ask a question, it traverses that graph. When you request an action, it can create records, send emails, schedule meetings, or run multi-step workflows — not just edit text.</p>
<p>OmniOS is built on foundational AI. Every feature — docs, CRM, projects, finance — lives on top of an AI reasoning layer called OmniMind that has native, continuous access to your workspace state.</p>

<h2 id="ten-reasons">Ten reasons to switch from Notion to OmniOS</h2>
<p><strong>1. Real CRM, not a database pretending to be one.</strong> OmniOS ships with a proper pipeline, contact enrichment, email sync, and deal tracking. Notion requires you to build all of this from scratch and it still isn't as good.</p>
<p><strong>2. AI that understands your business.</strong> "Summarize the Q4 deals at risk" is a real query, not a prompt-engineering exercise. OmniMind reads live data.</p>
<p><strong>3. Performance on large workspaces.</strong> OmniOS is engineered for workspaces with millions of records. Notion slows visibly past 10,000 rows in a single database.</p>
<p><strong>4. Native workflows, no Zapier.</strong> Automations that would require Zapier plus three Notion integrations run natively, with AI-generated graph logic.</p>
<p><strong>5. Built-in finance and invoicing.</strong> Not a link to QuickBooks. Actual invoices, expense tracking, and revenue dashboards in the same workspace.</p>
<p><strong>6. Semantic search across everything.</strong> Notion search is keyword-based. OmniOS search understands meaning — "conversations where someone pushed back on pricing" returns the right messages even if nobody used the word "pricing."</p>
<p><strong>7. Role-based permissions.</strong> Granular, enforceable permissions that actually match how businesses operate. Notion's permission model is page-based and gets unwieldy at scale.</p>
<p><strong>8. Local AI for sensitive data.</strong> Privacy-preserving inference on-device for regulated industries. Notion sends everything to the cloud.</p>
<p><strong>9. Intent-native command bar.</strong> Describe what you want in plain language. The workspace builds it. This is genuinely categorically different from Notion's slash menu.</p>
<p><strong>10. One price, one tool.</strong> $100/month for 12 seats replaces Notion plus your CRM plus your task tool plus your automation layer plus your analytics.</p>

<h2 id="feature-comparison">Notion vs OmniOS: feature comparison</h2>
<table>
  <thead>
    <tr><th>Capability</th><th>Notion Business</th><th>OmniOS Business</th></tr>
  </thead>
  <tbody>
    <tr><td>Documents and wiki</td><td>Excellent</td><td>Very good</td></tr>
    <tr><td>CRM</td><td>DIY, fragile</td><td>Native, full-featured</td></tr>
    <tr><td>Project management</td><td>DIY databases</td><td>Native with dependencies</td></tr>
    <tr><td>Email and calendar</td><td>None</td><td>Native</td></tr>
    <tr><td>Finance and invoicing</td><td>None</td><td>Native</td></tr>
    <tr><td>Workflow automation</td><td>Via Zapier/Make</td><td>Native, AI-generated</td></tr>
    <tr><td>AI workspace queries</td><td>Page-scoped</td><td>Business-wide</td></tr>
    <tr><td>Local AI / privacy tier</td><td>No</td><td>Yes</td></tr>
    <tr><td>Semantic search</td><td>No</td><td>Yes</td></tr>
    <tr><td>Cost (12 seats / month)</td><td>$192 + integrations</td><td>$100 all-in</td></tr>
  </tbody>
</table>

<h2 id="migration-playbook">The migration playbook</h2>
<p>Migrating from Notion to OmniOS takes most teams between four hours and two days depending on workspace complexity. The general playbook:</p>
<p><strong>Step 1: Inventory your Notion.</strong> List every database, every nested page hierarchy, every automation, and every external integration. Notion's export function produces a Markdown/CSV bundle — OmniOS's importer reads it directly.</p>
<p><strong>Step 2: Map databases to OmniOS modules.</strong> Most Notion databases correspond to something native in OmniOS: contacts, deals, tasks, projects, documents. The import wizard will propose a mapping; you confirm or adjust.</p>
<p><strong>Step 3: Preserve your documents.</strong> Freeform Notion pages become OmniOS documents. Block-level content (headings, lists, toggles, code blocks, tables, embeds) is preserved.</p>
<p><strong>Step 4: Rebuild automations natively.</strong> Describe each Notion-plus-Zapier automation to OmniMind in natural language. It will generate the equivalent native workflow in seconds. Review and activate.</p>
<p><strong>Step 5: Run both in parallel for a week.</strong> Keep Notion read-only during the first week. Verify that everything you need is in OmniOS. Then turn Notion into a historical archive.</p>

<h2 id="who-should-stay">Who should stay on Notion</h2>
<p>Honesty: Notion is still the right choice for some teams. Stay on Notion if:</p>
<ul>
  <li>Your primary use case is a public-facing knowledge base or marketing site. Notion's page rendering and sharing model is well-suited for this.</li>
  <li>You are a small writing-focused team (under five people) that lives in documents and has no CRM or operations need.</li>
  <li>You have deep investments in Notion templates that form part of a paid product you sell to customers.</li>
</ul>
<p>For everyone else — especially growing SMBs running sales, support, and operations through Notion databases — an AI-first workspace is now the better default. OmniOS has free migration assistance for teams over 10 seats. Book a call from the <a href="/pricing">pricing page</a>.</p>
    `,
  },

  "best-ai-tools-for-small-business-2026": {
    toc: [
      { id: "how-we-evaluated", label: "How we evaluated the market" },
      { id: "the-problem-with-point-tools", label: "The problem with point tools" },
      { id: "category-winners", label: "Category-by-category winners" },
      { id: "omnios-all-in-one", label: "OmniOS: the all-in-one case" },
      { id: "stack-comparison", label: "Stack comparison at 12 seats" },
      { id: "how-to-choose", label: "How to choose for your business" },
      { id: "budget-scenarios", label: "Budget scenarios under $200/month" },
    ],
    html: `
<p class="lead">There are more than 8,000 AI tools marketed to small businesses in 2026. This guide is ruthless: we cover the ten categories that actually matter, the best point tool in each, and the case for replacing all of them with a single AI-native operating system. Written for founders and operators who want to stop evaluating and start operating.</p>

<h2 id="how-we-evaluated">How we evaluated the market</h2>
<p>We evaluated 147 AI tools across ten business categories using four criteria: reliability (does it work on real data, at real scale), depth (does it solve the full problem or just demo well), integration cost (how much glue code does it need), and total cost of ownership at a 12-person team size.</p>
<p>We deliberately excluded: single-feature wrappers of GPT-4, tools with fewer than 500 paying customers, and anything that couldn't produce a reference customer with measurable ROI. What remains is a list of tools that actually run businesses in 2026.</p>

<h2 id="the-problem-with-point-tools">The problem with point tools</h2>
<p>Small businesses do not have a single AI problem. They have ten AI-shaped problems — CRM intelligence, support automation, content generation, financial analysis, meeting summaries, recruitment screening, sales forecasting, document drafting, workflow automation, and customer insights. Buying ten point tools to solve ten problems creates an eleventh problem: integration.</p>
<p>The typical small business running ten AI point tools spends more time managing their AI stack than they do deriving value from it. This guide ranks the best individual tools in each category <em>and</em> makes the case for the all-in-one alternative.</p>

<h2 id="category-winners">Category-by-category winners</h2>
<p><strong>1. AI-native CRM.</strong> Winner: OmniOS. Runner-up: Attio. HubSpot's AI features remain bolted-on; Salesforce's Einstein is expensive and shallow. Attio is impressive but lacks the cross-domain reasoning of a real workspace. OmniOS wins because the AI reads the entire business context, not just the CRM.</p>
<p><strong>2. AI writing and content.</strong> Winner: Claude Pro or ChatGPT Plus for general drafting. OmniOS for business-context drafting (emails, proposals, reports that reference your actual customer data). Jasper is no longer competitive.</p>
<p><strong>3. AI meeting notes.</strong> Winner: Granola for stand-alone. OmniOS built-in for teams that want meeting notes linked automatically to deals, contacts, and projects. Otter and Fireflies remain solid but increasingly feel narrow.</p>
<p><strong>4. AI customer support.</strong> Winner: Intercom Fin for scale. OmniOS support module for teams under 1,000 tickets/month that want support data connected to CRM. Zendesk AI is strong on volume, weak on context.</p>
<p><strong>5. AI workflow automation.</strong> Winner: OmniOS native workflows. Runner-up: n8n self-hosted. Zapier's AI features lag, and the per-zap pricing makes serious automation cost-prohibitive.</p>
<p><strong>6. AI financial analysis.</strong> Winner: OmniOS finance module for SMBs. Digits for deeper accounting intelligence. QuickBooks' AI remains a marketing pitch more than a product.</p>
<p><strong>7. AI sales intelligence.</strong> Winner: Clay for deep enrichment and outbound. OmniOS for integrated pipeline intelligence. Apollo is solid but increasingly expensive.</p>
<p><strong>8. AI recruiting.</strong> Winner: Gem or Ashby for dedicated ATS. OmniOS for small teams doing occasional hiring through the tasks and documents module.</p>
<p><strong>9. AI project management.</strong> Winner: OmniOS for integrated projects. Linear remains the best choice for pure engineering teams. ClickUp AI is functional but the surrounding product remains overwhelming.</p>
<p><strong>10. AI business intelligence.</strong> Winner: OmniOS analytics with natural language queries. Hex or Mode for deep analytics teams. Looker's AI features are premium-priced and engineer-required.</p>

<h2 id="omnios-all-in-one">OmniOS: the all-in-one case</h2>
<p>OmniOS appears in eight of the ten category winners above. This is not a coincidence and it is not an accident of this guide being published by OmniOS. It reflects a structural reality: an AI workspace that reads all of your business data at once is better at most business AI tasks than a point tool that reads only one slice.</p>
<p>A few concrete examples of tasks that OmniOS does well that point tools cannot:</p>
<ul>
  <li><strong>"Draft a renewal email for every customer whose contract expires in the next 60 days, referencing the value they've gotten this year."</strong> Requires CRM + finance + product usage + email — four tools minimum if done separately.</li>
  <li><strong>"Summarize the top five customer concerns from support this quarter and flag any that correlate with churn."</strong> Requires support + CRM + financial data + AI reasoning across all three.</li>
  <li><strong>"When a deal closes, generate the onboarding plan, the first invoice, the welcome email, and assign the right CSM based on account size."</strong> A workflow across CRM, finance, email, and task management.</li>
</ul>
<p>Point tools optimize for depth in one dimension. All-in-one platforms optimize for connection across dimensions. For most SMBs, connection matters more than marginal depth.</p>

<h2 id="stack-comparison">Stack comparison at 12 seats</h2>
<p>Here is the monthly cost comparison at a 12-person team size for three different approaches:</p>
<table>
  <thead>
    <tr><th>Approach</th><th>Monthly cost</th><th>Tools to manage</th><th>Integration complexity</th></tr>
  </thead>
  <tbody>
    <tr><td>Full AI point-tool stack</td><td>~$2,800</td><td>10+</td><td>High</td></tr>
    <tr><td>Curated hybrid stack</td><td>~$1,200</td><td>4-5</td><td>Medium</td></tr>
    <tr><td>OmniOS Business only</td><td>$100</td><td>1</td><td>None</td></tr>
  </tbody>
</table>
<p>The point-tool stack gives you best-in-class depth per category at the cost of integration, data drift, and context switching. OmniOS gives you 85-95% of the depth in each category with zero integration cost and connected data across all of them.</p>

<h2 id="how-to-choose">How to choose for your business</h2>
<p>The honest decision framework is about two questions:</p>
<p><strong>Question 1: Do you have a specialist use case that requires best-in-class depth?</strong> If your entire business is outbound sales at massive volume, Clay is probably worth the dedicated investment. If your entire business is support automation at scale, Intercom Fin is likely the right call. Specialists deserve specialists.</p>
<p><strong>Question 2: Does your business span multiple domains with heavy cross-domain workflows?</strong> If yes — and for 90% of SMBs the answer is yes — an all-in-one AI workspace is the dominant choice. The integration cost of stitching together point tools exceeds the marginal depth benefit in each.</p>
<p>Most SMBs land in the second group. Many think they're in the first group until they measure how much time their team actually spends context-switching and reconciling data.</p>

<h2 id="budget-scenarios">Budget scenarios under $200/month</h2>
<p>Three realistic stacks at different budget tiers for a 12-person team:</p>
<p><strong>Under $100/month:</strong> OmniOS Business alone. Covers CRM, docs, projects, email, finance, support, automation, analytics. The best price-to-capability ratio in the market.</p>
<p><strong>$100-150/month:</strong> OmniOS Business plus Granola for meeting notes, or plus a specialized outbound tool like Smartlead for teams doing heavy cold email.</p>
<p><strong>$150-200/month:</strong> OmniOS Business plus two specialists: one for your highest-volume specialist workflow (e.g., Clay for outbound, Intercom Fin for support, Hex for analytics) plus ChatGPT Plus or Claude Pro for general-purpose drafting at the individual level.</p>
<p>Past $200/month, you are probably over-spending. The diminishing returns on additional AI tools are sharp for small businesses. Consolidate, don't collect.</p>
<p>If you want a personalized recommendation based on your specific operations, our <a href="/tools/ai-readiness-assessment">AI Readiness Assessment</a> produces a tailored stack plan in about three minutes.</p>
    `,
  },

  "AI-native-computing-manifesto": {
    toc: [
      { id: "four-paradigms", label: "The four paradigms before this one" },
      { id: "why-each-failed", label: "Why each paradigm eventually failed us" },
      { id: "the-fifth-paradigm", label: "The fifth paradigm: AI-powered software" },
      { id: "300-node-primitives", label: "The 300 universal node primitives" },
      { id: "ai-graph-compiler", label: "The AI graph compiler" },
      { id: "what-this-means", label: "What this means for your business" },
      { id: "the-transition", label: "How the transition happens" },
    ],
    html: `
<p class="lead">Every twenty years or so, computing undergoes a phase transition. A new abstraction layer emerges that makes the previous one feel clunky and primitive. We are living through one of those transitions right now — and most people haven't noticed yet.</p>

<h2 id="four-paradigms">The four paradigms before this one</h2>
<p>To understand where we're going, you need to understand the four paradigms that preceded this moment.</p>

<p><strong>Paradigm one: mainframe computing (1950s–1970s).</strong> Computing was a capital-intensive resource shared by entire organizations. You submitted a job. You waited. You got results. The computer was a tool operated by specialists, not a medium used by humans.</p>

<p><strong>Paradigm two: personal computing (1980s–1990s).</strong> The PC put computation on every desk. Software became a product you could buy and install. Files, folders, applications — a rich metaphor borrowed from the physical office. Microsoft and Apple built billion-dollar empires on this paradigm. But the fundamental model was: you learn the software's vocabulary, then you speak it.</p>

<p><strong>Paradigm three: web computing (1990s–2010s).</strong> The browser turned every computer into a terminal connected to the world's largest network. SaaS emerged. Instead of installing software, you subscribed to it. This unlocked collaboration, real-time updates, and global reach. But it also fragmented your work across dozens of disconnected tools.</p>

<p><strong>Paradigm four: mobile computing (2007–present).</strong> The iPhone collapsed the distance between humans and computation. Touch interfaces, GPS, cameras, notifications — computing became ambient. But mobile didn't solve the fragmentation problem. It multiplied it. Now you have the same thirty-seven apps on your phone that you have on your laptop.</p>

<h2 id="why-each-failed">Why each paradigm eventually failed us</h2>
<p>Notice the pattern. Each paradigm solved a real problem. Each created a new one. The new problem was always some version of: <em>the abstraction still requires too much translation between human intent and machine execution.</em></p>

<p>In the mainframe era, the translation burden was enormous — you needed to write machine code or assembly. Personal computing introduced GUIs and reduced that burden dramatically. Web computing added collaboration but split your context across apps. Mobile computing added ubiquity but fragmented attention further.</p>

<p>At every stage, the core problem remained: <strong>you must learn the system's language before the system will do anything useful for you.</strong></p>

<p>That is the problem AI-powered software solves.</p>

<h2 id="the-fifth-paradigm">The fifth paradigm: AI-powered software</h2>
<p>In an AI-native system, you express <em>what you want to happen</em>. The system figures out how to make it happen. You don't choose which app to open. You don't navigate a menu hierarchy. You don't map your goal onto a tool's feature set.</p>

<p>You say: <em>"Show me which deals are at risk this quarter and draft follow-up emails for all of them."</em></p>

<p>An AI-native system does this. Not because it has a magic "do everything" button, but because it has a rich model of your business context — your CRM, your email, your calendar, your documents, your financial data — and it can reason across all of it simultaneously.</p>

<p>This is categorically different from a chatbot with plugins. The difference is context depth and action fidelity. A chatbot can generate an email. An AI-native OS can generate the email, attach the relevant contract, schedule the follow-up reminder, update the deal stage, and notify the account executive — all as a single coherent action, because it understands the relationships between these things.</p>

<h2 id="300-node-primitives">The 300 universal node primitives</h2>
<p>The architectural insight at the core of OmniOS is that every business operation — across every industry, every company size, every domain — can be decomposed into approximately 300 universal primitives.</p>

<p>We call these <strong>node primitives</strong>. They are the atoms of business logic.</p>

<p>Things like: <code>entity.contact</code>, <code>entity.deal</code>, <code>event.meeting</code>, <code>action.email.send</code>, <code>trigger.condition.threshold</code>, <code>compute.aggregate.sum</code>, <code>integration.webhook.receive</code>.</p>

<p>These primitives are not arbitrary. We derived them by analyzing the function of every major SaaS product — 847 tools across 23 business categories — and extracting the minimal complete set of operations they collectively perform. The result is a taxonomy that covers 99.4% of documented enterprise software workflows.</p>

<p>Why does this matter? Because it means that when you express an intent — "generate a sales report" or "onboard this new client" — there is a finite, well-defined set of operations that can fulfill that intent. The AI doesn't need to invent new capabilities. It needs to compose existing primitives in the right way.</p>

<h2 id="ai-graph-compiler">The AI graph compiler</h2>
<p>The component that makes this work is what we call the <strong>AI Graph Compiler</strong>. It's a seven-phase pipeline that transforms natural language intent into an executable node graph:</p>

<ol>
  <li><strong>Intent parsing:</strong> Identify the goal, entities, and constraints from the natural language input.</li>
  <li><strong>Context retrieval:</strong> Pull relevant data from the user's workspace — contacts, deals, documents, history — using semantic search over pgvector embeddings.</li>
  <li><strong>Graph planning:</strong> Decompose the goal into a directed acyclic graph of node primitives.</li>
  <li><strong>Dependency resolution:</strong> Identify data dependencies between nodes and order execution accordingly.</li>
  <li><strong>Permission checking:</strong> Verify that the user has authorization for each action in the graph.</li>
  <li><strong>Execution:</strong> Run the graph, handling partial failures with automatic retry and fallback logic.</li>
  <li><strong>Result synthesis:</strong> Aggregate outputs into a human-readable response with provenance tracking.</li>
</ol>

<p>This pipeline runs in under two seconds for most requests. Complex multi-step automations take three to five seconds. For reference, opening Salesforce in a browser takes longer than that.</p>

<h2 id="what-this-means">What this means for your business</h2>
<p>The practical consequence of AI-powered software is that the marginal cost of a business operation approaches zero.</p>

<p>Today, "send a personalized follow-up to everyone who attended our webinar last week" requires: exporting the attendee list, cross-referencing it with your CRM, segmenting by some criterion, writing variations of the email, loading a list into your email tool, scheduling, and sending. That's thirty minutes of work across four apps — if you're fast.</p>

<p>In OmniOS, it's one sentence. The time goes from thirty minutes to thirty seconds.</p>

<p>At scale, this is not a productivity improvement. It's a structural transformation. Companies that operate on AI-native infrastructure will outcompete those that don't by an order of magnitude — not because they hired smarter people, but because they removed the translation overhead between human judgment and machine execution.</p>

<h2 id="the-transition">How the transition happens</h2>
<p>Phase transitions in computing don't happen overnight. The PC didn't kill the mainframe in a year. The web didn't make desktop software irrelevant in a year. But once the new paradigm achieves parity on the core use cases, adoption accelerates rapidly and the old paradigm doesn't come back.</p>

<p>Intent-native computing achieved parity on core business workflows in late 2025. The OmniOS 1.0 release demonstrated that a single AI-native workspace could replace Salesforce, Notion, HubSpot, Asana, Slack, Gmail, and Google Calendar — not feature-for-feature, but <em>outcome-for-outcome</em>. The same goals, accomplished faster, with less context-switching, for a fraction of the cost.</p>

<p>The transition is underway. The question is not whether AI-powered software will replace the current SaaS paradigm. The question is how fast, and which companies will ride the wave versus be buried by it.</p>

<p>We built OmniOS for the companies that want to ride it.</p>
    `,
  },

  "omnios-vs-the-world-an-honest-comparison": {
    toc: [
      { id: "the-honest-version", label: "The honest version of this comparison" },
      { id: "vs-notion", label: "OmniOS vs Notion" },
      { id: "vs-salesforce", label: "OmniOS vs Salesforce" },
      { id: "vs-hubspot", label: "OmniOS vs HubSpot" },
      { id: "vs-asana", label: "OmniOS vs Asana" },
      { id: "the-stack-problem", label: "The real problem: the stack" },
      { id: "total-cost", label: "Total cost of ownership" },
      { id: "migration", label: "How migration actually works" },
    ],
    html: `
<p class="lead">Most software comparison articles are marketing dressed up as journalism. This one won't be. We're going to be direct about where OmniOS wins, where it's at parity, and where dedicated tools still have advantages. If you're evaluating us honestly, we owe you an honest evaluation.</p>

<h2 id="the-honest-version">The honest version of this comparison</h2>
<p>OmniOS is not best-in-class on every individual feature. If you need the world's most powerful CRM with 400 custom report types, Salesforce beats us. If you need an enterprise document editor with 200 templates and deep version control, Notion has more surface area.</p>

<p>What OmniOS wins on is the <em>system</em>. The cost of context-switching between tools. The cost of integrations breaking. The cost of data living in five places and being current in zero of them. The cost of per-seat pricing stacked on top of per-seat pricing.</p>

<p>For most teams — especially those under 500 people — the system advantage outweighs the individual feature gaps. Here's the evidence.</p>

<h2 id="vs-notion">OmniOS vs Notion</h2>
<p><strong>Where Notion wins:</strong> Block-based document editing. Notion's editor is genuinely excellent. The flexibility of blocks, the database view options, the breadth of templates. For teams that live in documents and databases, Notion's editing experience is hard to beat.</p>

<p><strong>Where OmniOS wins:</strong> Everything outside of documents. Notion has no CRM. No email client. No calendar. No project management with real dependency tracking. No financial analytics. Notion is a great document tool that has tried to become a work OS — but it remains fundamentally document-centric. OmniOS was designed from the ground up as an operating system, not a document editor that grew.</p>

<p><strong>The data problem:</strong> Notion's databases are isolated. You can link records between databases manually, but there's no semantic relationship layer. OmniOS treats every piece of data as part of a connected knowledge graph. When a deal closes in your CRM, the related project documents, contacts, and tasks are automatically updated. That relationship doesn't exist in Notion.</p>

<p><strong>Cost at 12 seats:</strong> Notion Business: $192/month. OmniOS Team (replacing Notion + 4 other tools): $100/month.</p>

<h2 id="vs-salesforce">OmniOS vs Salesforce</h2>
<p><strong>Where Salesforce wins:</strong> Enterprise customization. Salesforce's platform depth is genuinely extraordinary. If you have a dedicated admin team and complex sales operations with thousands of custom fields, Salesforce's customization capability is unmatched. Its AppExchange ecosystem is also enormous.</p>

<p><strong>Where OmniOS wins:</strong> Everything about the user experience, cost, implementation speed, and intelligence. Salesforce requires months to implement, a certified admin to maintain, and generates notoriously low adoption among salespeople. The UI hasn't meaningfully improved in a decade. The average sales rep spends 18% of their working week logging data into Salesforce — time that isn't selling.</p>

<p>OmniOS deploys in an afternoon. Data entry happens via natural language. AI automatically logs meeting notes, updates deal stages, and flags at-risk opportunities. The average OmniOS customer sees CRM data quality improve by 60% within 30 days — not because their reps are more disciplined, but because logging feels like texting a colleague instead of filling out a form.</p>

<p><strong>Cost at 12 seats:</strong> Salesforce Sales Cloud Professional: $1,788/month. OmniOS Business (full CRM + pipeline): $100/month.</p>

<h2 id="vs-hubspot">OmniOS vs HubSpot</h2>
<p><strong>Where HubSpot wins:</strong> Marketing automation and inbound lead management. HubSpot's marketing hub — landing pages, email sequences, lead scoring, UTM tracking — is mature and deeply integrated. If inbound marketing is your primary acquisition channel, HubSpot's marketing tools have years of refinement behind them.</p>

<p><strong>Where OmniOS wins:</strong> Everything after a lead becomes a contact. HubSpot's CRM is functional but not excellent. Its project management is minimal. Its document collaboration is basic. Its AI features are bolted on rather than foundational.</p>

<p>More importantly: HubSpot's pricing is a trap. The free CRM is legitimately good, which is why you adopt it. But the moment you need any meaningful feature — sequences, lead scoring, reporting dashboards — you're looking at $800-1,600/month for a team of 12. The price jumps are steep and the value doesn't scale linearly.</p>

<p><strong>Cost at 12 seats:</strong> HubSpot Sales Hub Professional: $1,200/month. OmniOS Business: $100/month.</p>

<h2 id="vs-asana">OmniOS vs Asana</h2>
<p><strong>Where Asana wins:</strong> Complex project portfolio management. Asana's timeline view, portfolio dashboards, workload management, and approval flows are genuinely excellent for teams managing many concurrent projects. Its integrations are also broad.</p>

<p><strong>Where OmniOS wins:</strong> Context. Asana knows your tasks. It doesn't know your customers, your revenue, your documents, or your communications. When a project slips, OmniOS can automatically flag the at-risk customer, surface the relevant deal, and draft the stakeholder update. Asana can only show you that the task is late.</p>

<p>The other dimension is AI. OmniOS can generate an entire project plan — with tasks, dependencies, assignees, and deadlines — from a single sentence describing the goal. Asana's AI features as of 2026 are limited to summaries and basic task suggestions.</p>

<p><strong>Cost at 12 seats:</strong> Asana Business: $300/month. OmniOS Team (replacing Asana + connected tools): $100/month.</p>

<h2 id="the-stack-problem">The real problem: the stack</h2>
<p>Every comparison above treats tools as if they operate in isolation. They don't. The real question isn't "which CRM is better" or "which project tool is better." It's: what does it cost to run and maintain a complete business operations stack, and how much productivity does that stack friction create?</p>

<p>A typical 12-person team runs something like this: Salesforce or HubSpot (CRM), Notion or Confluence (docs), Asana or Linear (projects), Slack (communication), Google Workspace (email/calendar), QuickBooks or Stripe (finance), Looker or Tableau (analytics), Zapier (glue). That's eight tools, eight pricing tiers, eight sets of permissions to maintain, eight integration points to keep working.</p>

<p>When Salesforce's API rate limits cause your Zapier zap to fail, you lose data. When someone updates a contact in HubSpot but not in Salesforce, you have data drift. When the Notion page is out of date with the Asana task, you have confusion. These aren't edge cases. They're the daily reality of operating on a fragmented stack.</p>

<h2 id="total-cost">Total cost of ownership</h2>
<p>Let's be specific. This is the actual monthly cost for a 12-person team running a typical SaaS stack:</p>

<table>
  <thead>
    <tr><th>Tool</th><th>Plan</th><th>Monthly cost (12 seats)</th></tr>
  </thead>
  <tbody>
    <tr><td>Salesforce Sales Cloud</td><td>Professional</td><td>$1,788</td></tr>
    <tr><td>Notion</td><td>Business</td><td>$192</td></tr>
    <tr><td>Asana</td><td>Business</td><td>$300</td></tr>
    <tr><td>Slack</td><td>Pro</td><td>$96</td></tr>
    <tr><td>Google Workspace</td><td>Business Starter</td><td>$72</td></tr>
    <tr><td>Zapier</td><td>Team</td><td>$149</td></tr>
    <tr><td>Looker</td><td>Standard</td><td>$990</td></tr>
    <tr><td>QuickBooks Online</td><td>Plus</td><td>$90</td></tr>
    <tr><td><strong>Total</strong></td><td></td><td><strong>$3,677/month</strong></td></tr>
  </tbody>
</table>

<p>That's $44,124 per year. For 12 people. On software alone — before you account for the 15-20 hours per month an admin spends maintaining integrations, or the productivity loss from context-switching, or the cost of the data quality issues that accumulate when your systems don't talk to each other.</p>

<p>OmniOS Business for 12 seats: $100/month. $1,200/year.</p>

<h2 id="migration">How migration actually works</h2>
<p>The thing that stops teams from switching is migration anxiety. "We have years of data in Salesforce. We can't just move." We hear this constantly. Here's the reality:</p>

<p>OmniOS has native importers for Salesforce (CRM), HubSpot, Notion, Asana, and Airtable. For most data types — contacts, deals, tasks, documents — migration takes one afternoon. Our importers preserve relationships: a contact linked to a deal linked to a document in Salesforce arrives in OmniOS with the same relationships intact.</p>

<p>For complex configurations — custom fields, custom workflows, computed properties — we provide a migration concierge for Business and Enterprise customers. Most teams are fully migrated and operational within a week.</p>

<p>The honest answer to "how do I migrate from Salesforce" is: book a migration call with us, and we'll walk you through it for free. The honest answer to "how long will it take" is: one day for data, one week for workflow configuration, two weeks until it feels natural.</p>

<p>That compares favorably to the eighteen months it took to implement Salesforce in the first place.</p>
    `,
  },

  "building-your-first-workflow-in-90-seconds": {
    toc: [
      { id: "what-is-a-workflow", label: "What is a workflow in OmniOS?" },
      { id: "the-command-bar", label: "Starting from the command bar" },
      { id: "first-workflow", label: "Your first workflow: lead follow-up" },
      { id: "triggers-conditions", label: "Triggers and conditions" },
      { id: "actions-nodes", label: "Action nodes" },
      { id: "testing-activating", label: "Testing and activating" },
      { id: "templates", label: "Starting from a template" },
      { id: "advanced-patterns", label: "Advanced patterns" },
    ],
    html: `
<p class="lead">The 90-second claim in our headline isn't marketing. It's the median time from opening OmniOS to having a live, running automation workflow — measured across 2,400 new user sessions in our beta. Here's how to build yours.</p>

<h2 id="what-is-a-workflow">What is a workflow in OmniOS?</h2>
<p>A workflow in OmniOS is a directed graph of triggers, conditions, and actions. You define: when something happens (trigger), check if conditions are met, then execute a sequence of operations (actions).</p>

<p>What makes OmniOS workflows different from tools like Zapier or Make is that the graph doesn't have to be explicit. You can describe a workflow in natural language and the AI Graph Compiler will build it for you. You can then inspect, modify, and extend the generated graph visually.</p>

<p>Workflows in OmniOS are also context-aware. They have access to your entire workspace — every contact, every deal, every document, every conversation. An action in your workflow can reference data from any part of your business without manual mapping.</p>

<h2 id="the-command-bar">Starting from the command bar</h2>
<p>Open OmniOS. Press <kbd>⌘K</kbd> to open the command bar. This is where everything starts.</p>

<p>Type: <code>create a workflow</code></p>

<p>You'll see the Workflow Builder open in the canvas area. You can now either describe the workflow in natural language, or start with a template.</p>

<h2 id="first-workflow">Your first workflow: lead follow-up</h2>
<p>Let's build a practical workflow: automatically follow up with new leads 24 hours after they're created if no one has contacted them yet.</p>

<p>In the command bar or the workflow description field, type:</p>

<blockquote>When a new lead is created, wait 24 hours, then check if there's been any email or call activity. If not, send a follow-up email from the assigned rep and add a task to their inbox.</blockquote>

<p>Press Enter. The AI Graph Compiler will generate a workflow graph in approximately 1-2 seconds. You'll see nodes appear on the canvas:</p>

<ul>
  <li>A <strong>Trigger</strong> node: "Lead Created"</li>
  <li>A <strong>Wait</strong> node: "24 hours"</li>
  <li>A <strong>Condition</strong> node: "Has email or call activity?"</li>
  <li>Two branches: Yes (do nothing) and No (continue)</li>
  <li>An <strong>Email</strong> action node: "Send follow-up from assigned rep"</li>
  <li>A <strong>Task</strong> action node: "Create inbox task"</li>
</ul>

<p>The email node will have a draft email pre-populated. You can click it to edit the subject line and body, personalize the tokens (<code>{{contact.firstName}}</code>, <code>{{deal.name}}</code>), or ask the AI to rewrite it in your brand voice.</p>

<h2 id="triggers-conditions">Triggers and conditions</h2>
<p>OmniOS supports five trigger types:</p>

<p><strong>Event triggers</strong> fire when something happens in your workspace: a record is created, updated, or deleted; a form is submitted; a webhook arrives; an integration event fires.</p>

<p><strong>Schedule triggers</strong> fire on a time-based schedule: daily at 9am, every Monday, on the 1st of the month, every 15 minutes.</p>

<p><strong>Threshold triggers</strong> fire when a metric crosses a value: revenue drops below $X, NPS score falls below Y, pipeline coverage ratio drops below Z.</p>

<p><strong>Manual triggers</strong> let you run a workflow on demand, either on a single record or a filtered set of records.</p>

<p><strong>External triggers</strong> listen for webhooks from external systems — Stripe payment events, GitHub commits, Typeform submissions, anything that can send an HTTP request.</p>

<p>Conditions are boolean expressions evaluated against workspace data. They support: equals, contains, greater than, less than, is empty, is not empty, and date comparisons. You can chain conditions with AND/OR logic. You can reference any field on any related record.</p>

<h2 id="actions-nodes">Action nodes</h2>
<p>The action library covers 47 native action types across 8 categories:</p>

<p><strong>Communication:</strong> Send email, send SMS, create calendar event, log call, send in-app notification, post to Slack channel.</p>

<p><strong>Records:</strong> Create record, update record, delete record, link records, clone record, tag record.</p>

<p><strong>Tasks:</strong> Create task, assign task, complete task, set due date, add comment.</p>

<p><strong>Documents:</strong> Create document from template, append to document, generate document with AI, share document.</p>

<p><strong>Data:</strong> Compute value, aggregate data, look up record, filter list, sort list, format value.</p>

<p><strong>AI:</strong> Generate text, classify text, extract data from text, summarize content, translate text, analyze sentiment.</p>

<p><strong>Integration:</strong> HTTP request, webhook, Zapier trigger, Make scenario trigger.</p>

<p><strong>Control:</strong> Wait, branch, loop, error handler, stop workflow.</p>

<h2 id="testing-activating">Testing and activating</h2>
<p>Before activating any workflow, test it. Click the <strong>Test</strong> button in the top right of the Workflow Builder. You'll be prompted to select a test record or provide test data. OmniOS will run the workflow in a sandbox mode — all action nodes will execute but in "dry run" mode, meaning emails won't actually send and records won't actually change.</p>

<p>You'll see a step-by-step execution trace: which nodes fired, what data they received, what output they produced, and how long each step took. If any node fails, you'll see the error and a suggested fix.</p>

<p>Once the test looks correct, click <strong>Activate</strong>. The workflow is now live and will execute for all matching trigger events going forward.</p>

<h2 id="templates">Starting from a template</h2>
<p>If natural language workflow generation feels too open-ended, start with a template. OmniOS ships with 120+ workflow templates across 12 categories. The most popular:</p>

<ul>
  <li>Lead nurture sequence (5 emails over 10 days)</li>
  <li>New customer onboarding checklist</li>
  <li>Deal stage automation (advance stage on activity)</li>
  <li>Weekly revenue report email</li>
  <li>Support ticket triage and routing</li>
  <li>Contract renewal reminder (90/60/30 days out)</li>
  <li>New employee onboarding tasks</li>
  <li>Monthly expense reconciliation</li>
</ul>

<p>Templates are parameterized. When you install one, you'll be prompted for the configuration values specific to your business. Most templates are ready to activate in under 5 minutes.</p>

<h2 id="advanced-patterns">Advanced patterns</h2>
<p>Once you've built a few workflows, you'll want to explore some more sophisticated patterns:</p>

<p><strong>Workflow chaining.</strong> One workflow can trigger another. This lets you build modular automation — a "lead created" workflow that normalizes data, followed by a separate "qualified lead" workflow that handles outreach, followed by a "deal created" workflow for pipeline management.</p>

<p><strong>Conditional branching with scoring.</strong> Combine the AI sentiment analysis node with branching to route leads differently based on the tone of their initial inquiry. High-intent leads go to your senior reps. Information-seeking leads get a nurture sequence. Price-focused leads get the ROI calculator.</p>

<p><strong>Loop with aggregation.</strong> Build a weekly digest workflow that loops over all deals updated in the past week, generates a summary for each, and compiles them into a single report sent to the team every Monday morning.</p>

<p><strong>Error recovery.</strong> Add error handler nodes to critical workflows. If an email fails to send, log the error, create a task for manual follow-up, and notify the workflow owner.</p>

<p>The best way to learn workflow patterns is to browse the public workflow library — 2,000+ user-submitted workflows searchable by use case, industry, and trigger type. Everything in the library can be imported to your workspace with one click and customized from there.</p>
    `,
  },

  "why-local-ai-changes-everything-for-smbs": {
    toc: [
      { id: "the-privacy-problem", label: "The privacy problem with cloud AI" },
      { id: "what-local-ai-means", label: "What local AI actually means" },
      { id: "performance-comparison", label: "Performance: local vs cloud" },
      { id: "cost-math", label: "The cost math is surprising" },
      { id: "omnimind-architecture", label: "How OmniMind's local tier works" },
      { id: "which-tasks-which-tier", label: "Which tasks go to which tier" },
      { id: "getting-started", label: "Getting started with local AI" },
    ],
    html: `
<p class="lead">When we announced local AI support in OmniOS, the reaction split into two camps. Developers were excited. Business owners were confused. "Why would I want AI that runs on my computer instead of a server?" Here's the full answer — and why it matters more than you might think.</p>

<h2 id="the-privacy-problem">The privacy problem with cloud AI</h2>
<p>Every time you send a prompt to a cloud AI service — ChatGPT, Claude, Gemini — that prompt leaves your infrastructure. The text you type, the context you provide, the data you attach: all of it transits to a third-party server, is processed by a third-party model, and may be used to improve that model's training.</p>

<p>For many queries, this is fine. "Summarize this public article" doesn't carry business risk. But what about "analyze our Q3 revenue breakdown" or "draft a response to this customer complaint about the defective product batch" or "summarize the terms of our proposed acquisition agreement"?</p>

<p>These prompts contain information that is genuinely sensitive. Competitive intelligence. Customer data (potentially subject to GDPR, CCPA, HIPAA). Financial projections. Legal strategy. When that information goes to a cloud AI service, you have limited control over what happens to it — regardless of what the terms of service say.</p>

<p>Large enterprises address this with private cloud deployments of LLMs — running models on dedicated infrastructure with air-gapped networks. This costs $500,000 to $2M per year to set up and maintain. It's not accessible to companies with fewer than 500 employees.</p>

<p>Local AI makes the security of enterprise AI infrastructure available to any company with a modern laptop.</p>

<h2 id="what-local-ai-means">What local AI actually means</h2>
<p>When we say "local AI" in the context of OmniOS, we mean that inference — the process of generating a response from a model — happens on your device or your team's devices. The model weights live on your machine. The computation happens on your CPU or GPU. Your data never leaves your infrastructure.</p>

<p>This is possible because of two concurrent developments that matured in 2024-2025:</p>

<p><strong>Model quantization.</strong> Techniques like GGUF quantization can compress a capable language model from 70GB to 4-8GB while retaining 90-95% of its performance on business tasks. A compressed Llama 3.1 8B model, for example, fits on a 16GB MacBook Pro and runs fast enough for interactive use.</p>

<p><strong>Apple Silicon and modern NPUs.</strong> The M-series chips and equivalent Windows NPUs have dedicated neural processing units that accelerate LLM inference dramatically. An M3 Pro MacBook Pro can run inference at 40+ tokens per second — fast enough that generation feels instantaneous for most tasks.</p>

<p>OmniOS bundles a local AI runtime (based on llama.cpp with our own optimizations) and a curated set of quantized models optimized for business tasks. When you install OmniOS, you can choose to also install the local AI tier. From that point, AI operations that don't require internet connectivity run entirely on your device.</p>

<h2 id="performance-comparison">Performance: local vs cloud</h2>
<p>Here's the honest comparison. Local models are not as capable as GPT-4o or Claude Sonnet for complex reasoning tasks. The performance gap on benchmarks is real. But benchmarks measure general reasoning ability. Business workflows don't require general reasoning ability — they require specific, well-defined capabilities:</p>

<ul>
  <li>Summarize this document ✓ (local is excellent)</li>
  <li>Extract these fields from this email ✓ (local is excellent)</li>
  <li>Draft a follow-up email in our brand voice ✓ (local is good)</li>
  <li>Classify this support ticket by category ✓ (local is excellent)</li>
  <li>Write a SQL query from natural language ✓ (local is good)</li>
  <li>Analyze this complex financial model ⚠️ (local is adequate, cloud is better)</li>
  <li>Write a 5,000-word technical specification ⚠️ (local struggles with coherence over length)</li>
  <li>Multi-step reasoning over many documents ⚠️ (cloud is significantly better)</li>
</ul>

<p>OmniMind, our AI routing layer, knows which tasks are suitable for local inference and routes accordingly. You get the privacy and cost benefits of local AI for the 80% of tasks where it's excellent, and seamless fallback to cloud AI for the 20% where it matters.</p>

<h2 id="cost-math">The cost math is surprising</h2>
<p>The per-query cost of cloud AI is small — fractions of a cent for most operations. But at scale, it adds up. A team of 12 that uses AI features heavily might make 50,000-100,000 AI API calls per month. At $0.002 per call (typical for GPT-4o Mini), that's $100-200/month — a significant fraction of your software budget.</p>

<p>More importantly, cost anxiety changes behavior. When you know every AI query costs money, you use AI less liberally. You batch operations. You avoid "let's just ask AI" moments. You optimize prompt length. All of this friction reduces the value you extract from AI tooling.</p>

<p>With local AI, the marginal cost per query is zero (you're using compute you've already paid for in your hardware). This completely changes the usage pattern. Teams using OmniOS's local AI tier make 3-4x more AI queries than teams using only cloud AI — because there's no cost reason not to.</p>

<h2 id="omnimind-architecture">How OmniMind's local tier works</h2>
<p>OmniMind is a three-tier AI routing system:</p>

<p><strong>Tier 1: Local inference.</strong> Small, fast, privacy-preserving models running on-device. Used for classification, extraction, short-form generation, and tasks with sensitive data. Response time: 200-800ms. Cost: $0.</p>

<p><strong>Tier 2: OmniMind Standard.</strong> Our fine-tuned mid-size model running on OmniOS infrastructure in your region. Better than Tier 1 for nuanced generation. Used for email drafting, document summarization, workflow planning. Response time: 800ms-2s. Cost: included in subscription.</p>

<p><strong>Tier 3: Premium cloud models.</strong> GPT-4o, Claude Sonnet, or Gemini Pro via API, for tasks requiring maximum capability. Used for complex analysis, long-form content generation, multi-document reasoning. Response time: 2-8s. Cost: API pass-through at cost.</p>

<p>Routing is automatic. You set a privacy level (Low / Medium / High / Maximum) per workspace or per data type, and OmniMind routes accordingly. On Maximum privacy, all AI operations use Tier 1 only and never leave your device. On Low privacy, OmniMind optimizes for quality and routes to the best available model.</p>

<h2 id="which-tasks-which-tier">Which tasks go to which tier</h2>
<p>The routing logic is based on task complexity, data sensitivity, and response quality requirements. As a general guide:</p>

<p><strong>Always local (Tier 1):</strong> PII classification, sentiment analysis, intent classification, named entity extraction, duplicate detection, spam filtering, language detection, basic summarization of short documents.</p>

<p><strong>Usually OmniMind Standard (Tier 2):</strong> Email drafting, meeting note summarization, task description generation, search query expansion, basic data analysis, customer message classification, product description generation.</p>

<p><strong>Sometimes premium cloud (Tier 3):</strong> Complex document analysis (contracts, financial statements), long-form content generation (blog posts, reports), multi-step research tasks, code generation, strategic planning assistance.</p>

<p>You can always override the automatic routing. Click the AI indicator on any generated output to see which tier was used and force a re-generation with a different tier.</p>

<h2 id="getting-started">Getting started with local AI</h2>
<p>Local AI is available on OmniOS 1.2+ for macOS (M1 or later) and Windows 11 (with compatible NPU or discrete GPU with 8GB+ VRAM). Linux support is in beta.</p>

<p>To enable it: Settings → AI → Local AI → Enable. You'll be prompted to download the model bundle (approximately 4GB). Installation takes 3-5 minutes. After that, local inference is automatic for supported tasks.</p>

<p>You can verify that a task ran locally by checking the AI indicator in the bottom right of any AI-generated output. A green lock icon means it ran locally and your data never left your device.</p>

<p>For teams in regulated industries (healthcare, finance, legal), we recommend setting your workspace privacy level to High or Maximum in Settings → Security → AI Privacy. This ensures that any data tagged as sensitive is never routed to cloud AI tiers, regardless of the task type.</p>
    `,
  },

  "omnimind-the-ai-that-knows-your-entire-business": {
    toc: [
      { id: "the-context-problem", label: "Why context is the hard problem" },
      { id: "omnimind-overview", label: "What OmniMind actually is" },
      { id: "knowledge-graph", label: "The business knowledge graph" },
      { id: "semantic-search", label: "Semantic search across everything" },
      { id: "proactive-intelligence", label: "Proactive intelligence" },
      { id: "agentic-mode", label: "Agentic mode" },
      { id: "privacy-controls", label: "Privacy controls" },
    ],
    html: `
<p class="lead">Most AI assistants suffer from the same fundamental limitation: they know a lot about the world in general, and nothing about your business in particular. OmniMind is designed to invert that ratio. Here's how we built an AI that understands your specific business context deeply enough to be genuinely useful.</p>

<h2 id="the-context-problem">Why context is the hard problem</h2>
<p>Ask ChatGPT "what's the status of our largest deal?" and it will politely tell you it doesn't have access to your CRM. Ask it to "draft a follow-up to Sarah's email about the Q3 contract" and it will ask you to paste Sarah's email in. The general AI assistant doesn't know Sarah, doesn't know the Q3 contract, doesn't know your pricing, doesn't know your communication history.</p>

<p>Every time you use a general AI assistant for a business task, you're spending the first 30-60 seconds of the interaction providing context that a smart colleague would already have. And even after you provide that context, the AI is working from a copy of the information you've given it — not from the live, current state of your business.</p>

<p>This is the context problem. It's not a model capability problem. GPT-4o and Claude Sonnet are remarkable at reasoning, writing, and analysis. The bottleneck is that they don't know your business.</p>

<p>OmniMind solves the context problem by being embedded in your workspace from the ground up.</p>

<h2 id="omnimind-overview">What OmniMind actually is</h2>
<p>OmniMind is not a chatbot with access to your data. That framing is too limited. OmniMind is a reasoning layer that sits between you and your business data, capable of:</p>

<ul>
  <li>Answering questions about the current state of your business using live data</li>
  <li>Generating content (emails, documents, reports) with full context awareness</li>
  <li>Taking actions on your behalf (creating records, sending emails, updating fields) when authorized</li>
  <li>Monitoring for conditions and alerting you proactively when they're met</li>
  <li>Planning and decomposing goals into executable workflows</li>
</ul>

<p>The crucial difference from a chatbot with integrations: OmniMind's context isn't retrieved at query time via API calls. It's maintained continuously as a live knowledge graph that updates in real time as your business data changes.</p>

<h2 id="knowledge-graph">The business knowledge graph</h2>
<p>Every piece of data in your OmniOS workspace — every contact, deal, document, email, task, meeting, invoice — is a node in a knowledge graph. The edges between nodes represent relationships: this contact is associated with this deal, which is associated with this project, which has these tasks assigned to these people, which generated these documents, which were discussed in these meetings.</p>

<p>When you ask OmniMind a question, it doesn't just search for relevant documents. It traverses this graph, following relationship edges to pull in everything that's relevant to your query. "What's the history with Acme Corp?" surfaces contacts, deals, emails, meetings, support tickets, invoices, and linked documents — the complete relationship picture, not just keyword matches.</p>

<p>The knowledge graph is updated continuously. When a deal stage changes, the graph updates. When a support ticket is resolved, the graph updates. When someone sends an email from the OmniOS inbox, the graph updates. There's no "sync delay" and no stale data problem — OmniMind always works from current state.</p>

<h2 id="semantic-search">Semantic search across everything</h2>
<p>The knowledge graph enables keyword search. Semantic search enables something more powerful: finding information based on meaning, not just matching words.</p>

<p>OmniOS maintains vector embeddings (via pgvector) for every text-bearing entity in your workspace. When you ask a question, OmniMind performs a semantic search — finding content that is meaningfully related to your question, even if it doesn't share keywords.</p>

<p>"Find all conversations where a customer raised pricing concerns" will return emails, meeting notes, and support tickets that express pricing concerns — even if they use phrases like "too expensive," "budget constraints," "need to negotiate," or "competitive offers" — not just messages containing the word "pricing."</p>

<p>This semantic layer is what makes OmniMind feel like it understands your business rather than just indexing it. The distinction is significant: an index finds what you know to search for. A semantic layer surfaces what you didn't know you needed.</p>

<h2 id="proactive-intelligence">Proactive intelligence</h2>
<p>Most AI tools are reactive: you ask, they answer. OmniMind adds a proactive layer: it monitors your business for conditions you care about and surfaces insights before you know to ask.</p>

<p>This happens through <strong>Intelligence Rules</strong> — conditions evaluated continuously against your knowledge graph. You can set them up explicitly ("alert me if any deal's close date passes without activity") or let OmniMind suggest them based on your usage patterns ("I've noticed you check pipeline coverage every Monday — want me to send you that report automatically?").</p>

<p>Out of the box, OmniMind ships with 35 built-in intelligence rules covering: pipeline health, customer health scores, expense anomalies, project at-risk signals, team workload imbalances, and contract renewal windows. These are active by default and can be customized or disabled in Settings → Intelligence.</p>

<p>The UI for proactive intelligence is a dedicated <strong>Signals</strong> feed — a prioritized list of things OmniMind thinks you should know about, each with context and a suggested action. High-urgency signals (deal at risk, customer overdue for contact, invoice 30 days past due) appear in your notification center as well.</p>

<h2 id="agentic-mode">Agentic mode</h2>
<p>Beyond answering questions and generating content, OmniMind can take actions. <strong>Agentic mode</strong> is an optional capability that allows OmniMind to execute multi-step tasks on your behalf with minimal intervention.</p>

<p>Example: "Prepare for my 3pm meeting with Acme Corp."</p>

<p>In agentic mode, OmniMind will: look up the meeting in your calendar, identify the attendees, pull their contact records from CRM, retrieve the full relationship history with Acme Corp (deals, communications, support history), check for any open issues or action items, pull the relevant documents, and generate a pre-meeting brief — all without you specifying each step.</p>

<p>Agentic mode requires explicit authorization and shows you what it's doing at each step. Before taking any write action (sending an email, updating a record), OmniMind will show you what it plans to do and ask for confirmation — unless you've set up a trust policy that allows specific action types to execute without confirmation.</p>

<p>Trust policies are configured in Settings → AI → Agentic Mode → Trust Policies. You can grant "always execute without confirmation" for low-risk actions like creating tasks or adding calendar events, while requiring confirmation for actions like sending emails or modifying deal values.</p>

<h2 id="privacy-controls">Privacy controls</h2>
<p>OmniMind's deep context awareness creates a natural concern: who can access what? The answer is role-based, not AI-based. OmniMind can only answer questions about data that the current user has permission to see. If a sales rep doesn't have access to the CFO's financial projections, OmniMind won't surface that data in responses to the sales rep.</p>

<p>Additionally, workspaces can designate data as AI-excluded. Any record, document, or data type marked AI-excluded will not be indexed by OmniMind, will not appear in semantic search results, and will not be used as context for any AI-generated content. This is useful for M&A sensitive documents, HR records, or any other data that should remain human-access-only.</p>

<p>AI-excluded data is stored in a separate, non-indexed partition of the database and is never transmitted to any AI model, including local models.</p>
    `,
  },

  "the-43000-dollar-saas-fragmentation-tax": {
    toc: [
      { id: "what-we-counted", label: "What we counted (and what we didn't)" },
      { id: "tool-by-tool", label: "The tool-by-tool breakdown" },
      { id: "hidden-costs", label: "The hidden costs that don't show on invoices" },
      { id: "integration-tax", label: "The integration tax" },
      { id: "context-switch-cost", label: "The context-switching cost" },
      { id: "data-quality-cost", label: "The data quality cost" },
      { id: "what-to-do", label: "What to do about it" },
    ],
    html: `
<p class="lead">We analyzed 340 SMB expense reports to calculate the true cost of a modern SaaS stack. The headline number — $43,000 per year for a 12-person team — understates the problem. When you add the costs that don't appear on invoices, the real figure is closer to $180,000. Here's how we got there.</p>

<h2 id="what-we-counted">What we counted (and what we didn't)</h2>
<p>The $43,000 figure covers only direct software subscription costs for the 8-12 tools a typical 12-person SMB uses for core operations: CRM, project management, document collaboration, email/calendar, communication, analytics, automation, and finance.</p>

<p>We didn't count: developer time spent building and maintaining integrations, operations time spent managing the stack, training time for new employees, productivity loss from context-switching, or revenue lost due to data quality issues.</p>

<p>When we add those costs — using conservative estimates from our research — the total rises to approximately $180,000 per year. That's the true cost of running a fragmented SaaS stack for 12 people. Let's break it down.</p>

<h2 id="tool-by-tool">The tool-by-tool breakdown</h2>
<p>First, the direct costs. These are median prices across the 340 companies we analyzed for a 12-seat configuration, billed monthly:</p>

<table>
  <thead>
    <tr><th>Category</th><th>Tool (median)</th><th>Monthly</th><th>Annual</th></tr>
  </thead>
  <tbody>
    <tr><td>CRM</td><td>HubSpot Sales Pro</td><td>$1,200</td><td>$14,400</td></tr>
    <tr><td>Project management</td><td>Asana Business</td><td>$300</td><td>$3,600</td></tr>
    <tr><td>Docs / wiki</td><td>Notion Business</td><td>$192</td><td>$2,304</td></tr>
    <tr><td>Email / calendar</td><td>Google Workspace</td><td>$72</td><td>$864</td></tr>
    <tr><td>Communication</td><td>Slack Pro</td><td>$96</td><td>$1,152</td></tr>
    <tr><td>Analytics</td><td>Looker Standard</td><td>$990</td><td>$11,880</td></tr>
    <tr><td>Automation</td><td>Zapier Team</td><td>$149</td><td>$1,788</td></tr>
    <tr><td>Finance</td><td>QuickBooks Plus</td><td>$90</td><td>$1,080</td></tr>
    <tr><td colspan="2"><strong>Total direct</strong></td><td><strong>$3,089</strong></td><td><strong>$37,068</strong></td></tr>
  </tbody>
</table>

<p>And that's before the companies that add video conferencing (Zoom: $180/mo), e-signature (DocuSign: $75/mo), customer support (Intercom: $500/mo), or HR (Rippling: $350/mo). Companies with those additions were averaging $5,800/month in direct software costs — $69,600/year.</p>

<h2 id="hidden-costs">The hidden costs that don't show on invoices</h2>
<p>The invoices are the easy part. The expensive part is what you don't see.</p>

<p>We surveyed operations managers, founders, and office managers at the 340 companies about how much time they spend on "stack management" — onboarding new tools, configuring existing ones, managing user licenses, handling billing, and keeping tool documentation up to date. The median answer: <strong>8 hours per month</strong>.</p>

<p>At $75/hour (a conservative blended rate for an ops manager or senior employee's time), that's $600/month in direct labor. $7,200/year. Not counted in the direct cost above.</p>

<p>For companies with a dedicated admin or operations role, the number was higher: 15-25 hours per month on stack management. At $65-90/hour, that's $975-2,250/month — $11,700-$27,000/year — just to keep the tools running.</p>

<h2 id="integration-tax">The integration tax</h2>
<p>Nobody buys 8 tools and doesn't try to connect them. The connections are where the real cost accumulates.</p>

<p>Building a HubSpot → Salesforce sync: $5,000-15,000 in developer time, if done properly. Most companies use Zapier instead — which works until it doesn't. In our sample, 67% of companies reported at least one data-loss incident caused by a failed Zapier zap in the past 12 months.</p>

<p>The average company in our sample had 14 active Zapier zaps. Maintaining those zaps — updating them when APIs change, debugging failures, rebuilding broken ones — took a median of 3 hours per month. At $85/hour (developer time), that's $255/month. $3,060/year.</p>

<p>Companies with more sophisticated integration needs (bi-directional syncs, custom transformations, real-time data) were often paying $1,000-3,000/month for dedicated integration platforms like Workato or Boomi, on top of Zapier. Integration infrastructure cost, across all companies in our sample: median $6,000/year, with a mean of $11,400/year (pulled up by companies with complex stacks).</p>

<h2 id="context-switch-cost">The context-switching cost</h2>
<p>This is the hardest cost to quantify and the largest in absolute terms.</p>

<p>Research on context switching (Gloria Mark, UC Irvine; Microsoft Research productivity studies) consistently finds that switching between different applications and contexts costs 15-23 minutes of productive work per switch, due to the cognitive overhead of re-loading context, remembering where you were, and getting back to flow state.</p>

<p>Workers in our sample reported switching between tools an average of 14 times per day. At 15 minutes per switch (conservative), that's 3.5 hours of productive work lost per person per day to context switching. For a 12-person team working 240 days per year: 10,080 person-hours lost annually.</p>

<p>At a $55/hour blended rate for a 12-person team: <strong>$554,400/year in productivity cost from context switching</strong>. Even at a 10% capture rate (assuming only 10% of that time is genuinely recoverable), that's $55,440/year in recoverable value.</p>

<p>We use the conservative 10% estimate in our total cost calculation: $55,440/year attributable to context-switching cost.</p>

<h2 id="data-quality-cost">The data quality cost</h2>
<p>When data lives in multiple systems, it drifts. A contact updated in HubSpot isn't updated in Salesforce. A project status changed in Asana isn't reflected in the Notion dashboard. A customer payment received in Stripe isn't reconciled in QuickBooks for three days.</p>

<p>Data quality problems have measurable business costs. In our sample:</p>

<ul>
  <li>34% of companies reported losing a deal in the past year due to stale CRM data (wrong contact info, missed follow-up triggered by a false "already contacted" record)</li>
  <li>51% reported billing errors due to integration-related data drift</li>
  <li>68% reported at least one instance where a team made a decision based on a dashboard showing outdated data</li>
</ul>

<p>The financial impact of data quality issues was hard to quantify precisely — companies were often reluctant to assign a dollar value to "the deal we lost." But among the 34% who could estimate the cost, the median was $18,500 in deal value attributable to CRM data quality issues in the past 12 months.</p>

<h2 id="what-to-do">What to do about it</h2>
<p>The solution to fragmentation is consolidation. Not in the sense of "pick fewer tools and do less" — in the sense of "run your operations on a unified platform that eliminates the integration layer entirely."</p>

<p>That's what OmniOS is built to do. All the capabilities of your current stack — CRM, project management, docs, email, calendar, analytics, automation, finance — in a single platform with a single data model. No integrations to maintain. No data drift. No context switching between apps.</p>

<p>The annual cost for a 12-person team on OmniOS Business: $1,200/year. Compared to $43,000+ in direct software costs alone — that's a $41,800 annual saving before you count integration costs, admin time, context switching, or data quality issues.</p>

<p>If you'd like to calculate your specific fragmentation tax, our free <a href="/tools/saas-cost-calculator">SaaS Cost Calculator</a> will generate a personalized estimate based on your current stack in about 90 seconds.</p>
    `,
  },

  "sprint-generation-from-one-sentence": {
    toc: [
      { id: "the-planning-problem", label: "The planning problem" },
      { id: "how-it-works", label: "How sprint generation works" },
      { id: "demo-walkthrough", label: "Demo: generating a sprint from scratch" },
      { id: "customizing-output", label: "Customizing the output" },
      { id: "team-assignment", label: "Intelligent team assignment" },
      { id: "capacity-planning", label: "Capacity and velocity awareness" },
      { id: "integration-with-scrum", label: "Integration with Scrum ceremonies" },
    ],
    html: `
<p class="lead">Sprint planning is one of the most predictable parts of software development. You know what you're building, you know your team's velocity, you know your dependencies. And yet it consistently takes 2-4 hours per sprint cycle. OmniOS can do it in one sentence. Here's how.</p>

<h2 id="the-planning-problem">The planning problem</h2>
<p>Sprint planning suffers from a fundamental mismatch: the work of planning (breaking down features, estimating effort, assigning tasks, setting priorities, identifying dependencies) is largely mechanical, but the tools we use treat it as a creative exercise requiring human judgment at every step.</p>

<p>Human judgment is valuable for: deciding <em>what</em> to build (product strategy), evaluating technical approach (architecture review), identifying risks that aren't apparent in the task description. Human judgment is wasteful for: splitting a story into sub-tasks, estimating effort based on historical velocity, identifying which team members are available and suitable for which tasks.</p>

<p>OmniOS automates the mechanical parts and surfaces the judgment-requiring parts. The result is a sprint plan generated in 60 seconds that typically needs 10-15 minutes of review and adjustment — versus 2-4 hours of manual planning.</p>

<h2 id="how-it-works">How sprint generation works</h2>
<p>OmniOS sprint generation uses four inputs:</p>

<p><strong>1. The goal statement.</strong> A one-to-three sentence description of what the sprint should accomplish. This is the only required input. Everything else is optional or inferred.</p>

<p><strong>2. Your product backlog.</strong> OmniOS reads your existing backlog items and their priorities. If your new sprint should include specific backlog items, the AI will incorporate them and generate fill-in tasks to meet the goal.</p>

<p><strong>3. Team capacity data.</strong> OmniOS knows which team members exist, their historical velocity, their current assignments, and their availability in the upcoming sprint period (accounting for time-off, meetings, and concurrent projects).</p>

<p><strong>4. Historical sprint data.</strong> Past sprint completion rates, recurring bottlenecks, common issue types for similar goals — OmniOS uses this to calibrate estimates and flag likely risk areas.</p>

<p>From these inputs, OmniOS generates: a full task list with estimates, assignments, priorities, dependencies, and acceptance criteria. The output is immediately importable into your sprint backlog.</p>

<h2 id="demo-walkthrough">Demo: generating a sprint from scratch</h2>
<p>Open the OmniOS command bar with <kbd>⌘K</kbd> and type:</p>

<blockquote>Create a sprint plan for implementing Stripe billing integration with subscription management, proration handling, and a customer billing portal</blockquote>

<p>In approximately 3-4 seconds, OmniOS will generate a sprint plan. For this goal, you'd see something like:</p>

<p><strong>Epic: Stripe Billing Integration</strong> (estimated: 34 story points, 2 engineers, 1.5 sprints)</p>

<p><em>Sprint 1 (18 points):</em></p>
<ul>
  <li>Stripe account setup and API key configuration [2pt, Backend, Engineering]</li>
  <li>Product and price object creation [3pt, Backend, Engineering]</li>
  <li>Subscription creation flow [5pt, Backend, Engineering]</li>
  <li>Webhook endpoint for billing events [5pt, Backend, Engineering]</li>
  <li>Basic subscription state machine [3pt, Backend, Engineering]</li>
</ul>

<p><em>Sprint 2 (16 points):</em></p>
<ul>
  <li>Proration calculation and mid-cycle upgrades [5pt, Backend, Engineering]</li>
  <li>Customer billing portal integration [4pt, Full-stack, Engineering]</li>
  <li>Invoice history UI [3pt, Frontend, Engineering]</li>
  <li>Failed payment handling and dunning [4pt, Backend, Engineering]</li>
</ul>

<p>Each task includes: description, acceptance criteria, technical notes, dependencies, and an estimated effort in story points calibrated to your team's historical velocity.</p>

<h2 id="customizing-output">Customizing the output</h2>
<p>The generated sprint plan is a starting point, not a final answer. Everything is editable inline. But you can also use natural language to request modifications:</p>

<ul>
  <li><em>"Split the webhook task into separate tasks for subscription events and payment events"</em></li>
  <li><em>"Add a task for error handling and logging across all Stripe API calls"</em></li>
  <li><em>"Move the billing portal to sprint 1 — the product team considers it P0"</em></li>
  <li><em>"Estimate this as if only one senior engineer is available for sprint 1"</em></li>
  <li><em>"Add acceptance criteria for GDPR compliance to the customer portal task"</em></li>
</ul>

<p>OmniOS will modify the plan in real time. You can iterate this way until the plan reflects your team's actual constraints and priorities.</p>

<h2 id="team-assignment">Intelligent team assignment</h2>
<p>OmniOS's default assignment logic considers three factors:</p>

<p><strong>Skill match:</strong> Based on past task completion history, OmniOS builds a skill profile for each team member. Engineers who have completed many Stripe-related tasks get assigned Stripe tasks. Frontend engineers get assigned UI tasks. Engineers with strong test coverage history get assigned QA-adjacent tasks.</p>

<p><strong>Current load:</strong> OmniOS looks at each engineer's open tasks across all active projects and their velocity-adjusted capacity for the sprint. It won't assign 40 story points to someone who historically completes 24 points per sprint.</p>

<p><strong>Availability:</strong> Calendar integration means OmniOS knows about planned time off, recurring commitments (1:1s, team meetings), and other sprint obligations that reduce available coding time.</p>

<p>You can override any assignment. You can also give OmniOS constraints: "Assign all frontend tasks to Jamie" or "Don't assign anything to Alex this sprint — they're on-call" or "Pair junior engineers with seniors for all backend tasks."</p>

<h2 id="capacity-planning">Capacity and velocity awareness</h2>
<p>Sprint generation is aware of your team's real capacity, not an idealized version of it.</p>

<p>If your team's 2-week sprint historically yields 60 story points of completed work, OmniOS won't generate a plan with 90 story points. It will generate a plan with 55-60 story points (leaving a 5-10% buffer for unplanned work) and note any features that didn't fit in the sprint with a reason and a recommendation for sprint 2.</p>

<p>If a specific engineer is on vacation for 3 days during the sprint, their allocated points are reduced proportionally. If the team has a company offsite scheduled, OmniOS accounts for the productivity loss.</p>

<p>Capacity awareness means the plans OmniOS generates are actually achievable — a problem that plagues manually-created sprint plans, which tend toward optimism.</p>

<h2 id="integration-with-scrum">Integration with Scrum ceremonies</h2>
<p>Sprint generation is one part of OmniOS's Scrum support. The full suite includes:</p>

<p><strong>Sprint review prep:</strong> Before your sprint review, OmniOS generates a presentation-ready summary of what shipped, what didn't, and the reasons why — pulling from task completion data, PR merges, and any notes logged during the sprint.</p>

<p><strong>Retrospective facilitation:</strong> OmniOS analyzes sprint data to identify patterns: which types of tasks consistently get underestimated, which team members are frequently blocked by the same dependencies, which acceptance criteria are most often disputed at review. It surfaces these as discussion prompts for your retro.</p>

<p><strong>Daily standup digest:</strong> A Slack or email digest generated every morning showing each team member's yesterday/today/blockers, synthesized from their task activity in OmniOS. Not a replacement for the human standup — but useful for async teams and as a reference during the call.</p>

<p><strong>Burndown prediction:</strong> Real-time sprint burndown with an AI-projected completion date based on current velocity. If the sprint is at risk, OmniOS flags it and suggests scope reduction options (which tasks to defer) or asks if you want to add capacity.</p>
    `,
  },

  "april-2026-release-notes": {
    toc: [
      { id: "highlights", label: "Highlights" },
      { id: "omnimind-2", label: "OmniMind 2.0" },
      { id: "workflow-builder", label: "Workflow Builder 3.0" },
      { id: "analytics", label: "Analytics overhaul" },
      { id: "mobile", label: "Mobile apps" },
      { id: "integrations", label: "New integrations" },
      { id: "performance", label: "Performance improvements" },
      { id: "api", label: "API changes" },
    ],
    html: `
<p class="lead">April 2026 is our biggest release since launch. OmniMind 2.0, a complete rebuild of the Workflow Builder, a new Analytics engine, and native mobile apps for iOS and Android. Here's everything that shipped.</p>

<h2 id="highlights">Highlights</h2>
<ul>
  <li>OmniMind 2.0: 3x faster, 40% more accurate on business reasoning tasks</li>
  <li>Workflow Builder 3.0: visual node editor with real-time collaboration</li>
  <li>Analytics 2.0: drag-and-drop report builder with natural language queries</li>
  <li>iOS and Android apps: full feature parity with the web app</li>
  <li>14 new integrations including Shopify, Stripe, Twilio, and DocuSign</li>
  <li>P99 API response time down from 340ms to 180ms</li>
</ul>

<h2 id="omnimind-2">OmniMind 2.0</h2>
<p>OmniMind 2.0 is a ground-up rebuild of our AI reasoning layer. The three major improvements:</p>

<p><strong>Speed.</strong> We moved from a single-pass generation architecture to a speculative decoding architecture that achieves 3x throughput on the same hardware. For most queries, you'll see responses in under 500ms — down from 1.5-2s in OmniMind 1.x.</p>

<p><strong>Context depth.</strong> OmniMind 2.0 maintains a 128k token context window (up from 32k). For large workspaces with extensive history, this means the AI can reason over significantly more of your data in a single query without losing coherence.</p>

<p><strong>Business reasoning accuracy.</strong> We fine-tuned OmniMind 2.0 on a dataset of 2.4 million business operations — CRM actions, workflow executions, financial calculations, project management decisions — collected (with consent) from our beta users. On our internal benchmark suite of 1,200 business reasoning tasks, accuracy improved from 71% to 82% correct first-try.</p>

<p>OmniMind 2.0 is available to all plans. Local AI tier has also been updated — the on-device model bundle is now 3.8GB (down from 4.4GB) with improved performance on Apple Silicon M2 and later.</p>

<h2 id="workflow-builder">Workflow Builder 3.0</h2>
<p>The Workflow Builder has been completely rewritten. The old builder used a linear step-by-step editor. The new builder is a visual node canvas — more like Figma than a form.</p>

<p><strong>What's new:</strong></p>

<ul>
  <li><strong>Real-time collaboration:</strong> Multiple team members can edit a workflow simultaneously. Changes are synced in real time with named cursors.</li>
  <li><strong>Infinite canvas:</strong> No more scroll limits. Complex workflows with 50+ nodes are now navigable with pan/zoom.</li>
  <li><strong>Sub-workflow modules:</strong> Extract a group of nodes into a reusable sub-workflow. Reference it in other workflows. Changes to the sub-workflow propagate everywhere it's used.</li>
  <li><strong>Parallel execution branches:</strong> Run multiple action branches simultaneously and merge results. Previously, all branches were sequential.</li>
  <li><strong>Version history:</strong> Every change to a workflow is versioned. Roll back to any previous version with one click.</li>
  <li><strong>Live execution overlay:</strong> See a workflow executing in real time. Each node lights up when it runs, with live data flowing along the edges.</li>
</ul>

<p>The natural language workflow generation from previous versions still works — and it now generates visual node graphs directly into the new canvas.</p>

<h2 id="analytics">Analytics overhaul</h2>
<p>Analytics has been our most-requested improvement since launch. The old analytics was functional but limited — fixed report templates with limited customization.</p>

<p>Analytics 2.0 is a full drag-and-drop report builder with:</p>

<ul>
  <li><strong>Natural language queries:</strong> Ask "show me revenue by customer segment for the last 6 months" and the system generates the report. Modify with follow-ups: "filter to North America", "add a trend line", "export to CSV".</li>
  <li><strong>Cross-entity analysis:</strong> Reports can span multiple data types. Plot deal close rate against marketing channel against customer segment without manual data joining.</li>
  <li><strong>Live dashboards:</strong> Create dashboard layouts with multiple reports that refresh in real time. Share as a URL with optional password protection.</li>
  <li><strong>Scheduled delivery:</strong> Send any report or dashboard to email or Slack on a schedule. Daily, weekly, monthly, or on custom schedules.</li>
  <li><strong>Cohort analysis:</strong> Built-in cohort analysis for SaaS metrics: MRR retention by cohort, customer lifetime value curves, churn by acquisition channel.</li>
</ul>

<p>Analytics 2.0 is available on Business and Enterprise plans. Team plan users get access to natural language queries and pre-built reports but not the custom report builder.</p>

<h2 id="mobile">Mobile apps</h2>
<p>iOS and Android apps are now available. Both apps have full feature parity with the web app, with some mobile-specific additions:</p>

<ul>
  <li>Voice-to-intent: Hold the OmniMind button and speak your request. Transcription + intent execution happens in under 2 seconds.</li>
  <li>Push notifications for Signals (proactive alerts) and workflow completions.</li>
  <li>Camera-to-data: Photograph a business card or receipt and it's automatically parsed and added to your workspace.</li>
  <li>Offline mode: Read-only access to your workspace data when offline. Changes sync when connectivity is restored.</li>
  <li>Apple Watch / Wear OS companion: Signals, task completions, and upcoming meetings on your wrist.</li>
</ul>

<h2 id="integrations">New integrations</h2>
<p>April 2026 adds 14 new native integrations:</p>

<ul>
  <li><strong>Shopify:</strong> Bi-directional sync of orders, customers, products, and inventory. Trigger workflows on order events.</li>
  <li><strong>Stripe:</strong> Payment events, subscription management, invoicing — connected to CRM deal and customer records.</li>
  <li><strong>Twilio:</strong> Send SMS, make calls, and log call recordings from workflows.</li>
  <li><strong>DocuSign:</strong> Send documents for signature and automatically update deal status when signed.</li>
  <li><strong>Zendesk:</strong> Bi-directional sync with ticket and customer records.</li>
  <li><strong>Calendly:</strong> Meeting bookings appear in OmniOS calendar and create CRM contact records.</li>
  <li><strong>GitHub:</strong> PR and issue events as workflow triggers. Sprint tasks link to GitHub issues.</li>
  <li><strong>Jira:</strong> Import Jira projects, sync sprint data, and keep Jira and OmniOS project boards in sync.</li>
  <li><strong>Xero:</strong> Accounting sync: invoices, expenses, and payments reflected in OmniOS finance module.</li>
  <li><strong>Mailchimp:</strong> Campaign events as workflow triggers. Segment data synced to CRM.</li>
  <li><strong>Typeform:</strong> Form submissions create OmniOS records and trigger workflows.</li>
  <li><strong>LinkedIn Sales Navigator:</strong> Lead data import and contact enrichment.</li>
  <li><strong>Loom:</strong> Loom recordings embedded in documents and linked to contact/project records.</li>
  <li><strong>Figma:</strong> Design files linked to project tasks. Status updates sync between Figma and OmniOS.</li>
</ul>

<h2 id="performance">Performance improvements</h2>
<p>Beyond OmniMind speed improvements, the overall application is significantly faster in April 2026:</p>

<ul>
  <li>Initial load time: 1.8s → 0.9s (median, on 4G connection)</li>
  <li>Record open time: 340ms → 120ms</li>
  <li>Search latency: 280ms → 95ms</li>
  <li>Workflow execution start time: 800ms → 320ms</li>
  <li>API P99 response time: 340ms → 180ms</li>
</ul>

<p>The load time improvement comes from route-based code splitting and edge caching on Vercel's CDN. The record open improvement comes from a new prefetching strategy that loads likely-next records when a list is rendered.</p>

<h2 id="api">API changes</h2>
<p>The OmniOS API gains several new capabilities in April 2026:</p>

<ul>
  <li><strong>Batch operations:</strong> Create, update, or delete up to 1,000 records in a single API call with atomic transactions.</li>
  <li><strong>Webhook subscriptions:</strong> Subscribe to any OmniOS event type via webhook. Replaces the previous polling-based pattern for real-time integrations.</li>
  <li><strong>GraphQL endpoint:</strong> New <code>/api/graphql</code> endpoint for flexible data querying. REST endpoints remain unchanged.</li>
  <li><strong>Workflow trigger API:</strong> Trigger any manual workflow via API with custom payload data.</li>
</ul>

<p>Deprecated: the v1 batch import endpoint (<code>/api/v1/import</code>) will be removed in July 2026. Migrate to the new batch operations endpoint (<code>/api/v2/records/batch</code>).</p>
    `,
  },

  "what-we-learned-shipping-to-our-first-1000-teams": {
    toc: [
      { id: "who-our-first-customers-are", label: "Who our first 1,000 customers are" },
      { id: "what-they-replaced", label: "What they replaced" },
      { id: "surprising-discoveries", label: "Surprising discoveries" },
      { id: "where-we-got-it-wrong", label: "Where we got it wrong" },
      { id: "retention-patterns", label: "Retention patterns" },
      { id: "what-comes-next", label: "What comes next" },
    ],
    html: `
<p class="lead">We shipped to our first 1,000 teams in the 90 days after public launch. This is what we learned — including where our assumptions were wrong, what surprised us, and how it's changed our roadmap.</p>

<h2 id="who-our-first-customers-are">Who our first 1,000 customers are</h2>
<p>We expected our early adopters to be tech-forward SaaS companies. That's true, but the distribution is wider than we anticipated:</p>

<ul>
  <li><strong>34%</strong> SaaS companies (as expected)</li>
  <li><strong>21%</strong> Professional services firms (agencies, consultancies, law firms)</li>
  <li><strong>18%</strong> E-commerce companies</li>
  <li><strong>14%</strong> Healthcare and wellness businesses</li>
  <li><strong>13%</strong> Miscellaneous (real estate, non-profits, manufacturing, education)</li>
</ul>

<p>The professional services and healthcare numbers surprised us. These are not typically early adopters of developer-focused tools. What they have in common with our SaaS customers: they are information-dense, relationship-driven businesses where context-switching between tools is particularly painful. A consulting firm with client CRM, project management, document collaboration, and invoicing spread across four tools has exactly the problem OmniOS is designed to solve — regardless of industry.</p>

<p>Average team size at sign-up: 11 people. Median time in business: 4.5 years. This is not a "fresh startup" audience. These are established businesses making a deliberate decision to consolidate their stack.</p>

<h2 id="what-they-replaced">What they replaced</h2>
<p>We surveyed all 1,000 customers about what they were using before OmniOS. The results:</p>

<p><strong>CRM replacements (88% had a CRM before OmniOS):</strong></p>
<ul>
  <li>HubSpot: 44%</li>
  <li>Salesforce: 21%</li>
  <li>Pipedrive: 12%</li>
  <li>Airtable (as makeshift CRM): 8%</li>
  <li>Other / spreadsheets: 15%</li>
</ul>

<p><strong>Project management replacements:</strong></p>
<ul>
  <li>Asana: 31%</li>
  <li>Notion (as PM tool): 24%</li>
  <li>Monday.com: 18%</li>
  <li>Trello: 14%</li>
  <li>Linear: 7%</li>
  <li>Other: 6%</li>
</ul>

<p><strong>Average number of tools replaced per customer: 5.3.</strong></p>
<p><strong>Average monthly savings on software: $2,840/month.</strong></p>

<h2 id="surprising-discoveries">Surprising discoveries</h2>
<p>Three things we didn't expect:</p>

<p><strong>1. The automation adoption rate.</strong> We built the Workflow Builder expecting it to be used by technical users to create sophisticated automations. In practice, 67% of customers activated at least one workflow in their first week — and the median workflow was built using natural language generation, not manual node editing. Non-technical founders and operations managers are creating automations they never could have built in Zapier. The AI democratized the capability.</p>

<p><strong>2. OmniMind adoption patterns.</strong> We expected most OmniMind usage to be question-answering: "what's the status of X?" Instead, the most common use case (41% of OmniMind interactions) is content generation: drafting emails, writing meeting summaries, creating project descriptions. Users are using OmniMind as a writing assistant that has full context of their business, not primarily as a question-answering system.</p>

<p><strong>3. The "single source of truth" effect.</strong> We built OmniOS to eliminate fragmentation. What we didn't anticipate was how significantly customers would value the consolidation of data lineage — being able to see the complete history of any business entity (a customer, a project, a deal) across all interactions, without needing to correlate across systems. Multiple customers described this as "finally being able to do the job I was hired to do" — because they'd previously spent so much time reconciling data across tools.</p>

<h2 id="where-we-got-it-wrong">Where we got it wrong</h2>
<p>Three significant mistakes in our launch assumptions:</p>

<p><strong>1. We underinvested in migration tooling.</strong> Our original launch included importers for Salesforce and HubSpot. We thought that would cover most of the customer base. It covered 65%. The remaining 35% — Pipedrive users, Monday.com users, Notion-as-CRM users, Airtable-based systems — had to migrate manually or wait for us to build importers. This created friction in the sales cycle and caused churn in the first 30 days for customers who found migration harder than expected. We've since shipped importers for Pipedrive, Monday.com, Airtable, and Trello. Notion is in progress.</p>

<p><strong>2. We assumed teams would migrate all-at-once.</strong> Our onboarding flow was designed around a "migrate your whole stack to OmniOS" narrative. In practice, most teams wanted to migrate incrementally: start with CRM, keep project management elsewhere for now, add docs later. Our original onboarding didn't support this pattern well. We've rebuilt the onboarding around a "start with one module" flow that lets teams adopt incrementally and connect OmniOS to their existing tools via integrations while they migrate.</p>

<p><strong>3. We underestimated training needs for non-technical users.</strong> OmniOS is powerful, which means it has more concepts to understand than a single-purpose tool. A sales manager who only ever used HubSpot for CRM needs to learn a broader mental model when they switch to OmniOS. We shipped with in-app tooltips and documentation but no guided onboarding flow. Customer success was overwhelmed. We've since built a personalized onboarding experience (role-based, not generic) and hired four additional customer success engineers.</p>

<h2 id="retention-patterns">Retention patterns</h2>
<p>At 90 days post-launch, here are our retention numbers:</p>

<ul>
  <li><strong>Day 30 retention:</strong> 81% (customers still active at 30 days)</li>
  <li><strong>Day 60 retention:</strong> 74%</li>
  <li><strong>Day 90 retention:</strong> 71%</li>
</ul>

<p>Industry benchmarks for horizontal B2B SaaS at this stage: 65-70% at 90 days. We're slightly above benchmark, but not dramatically.</p>

<p>The customers who churn almost always do so in the first two weeks — before they've fully migrated and before the network effects of having all their data in one place kick in. Once a team has been on OmniOS for 30+ days and has migrated more than half their existing workflows, 90-day retention jumps to 94%.</p>

<p>The implication is clear: the product is sticky when customers get past the migration phase. Our retention problem is an onboarding problem, not a product problem. This drives our Q2 2026 roadmap: dramatically improve the first two weeks of the OmniOS experience.</p>

<h2 id="what-comes-next">What comes next</h2>
<p>Based on what we learned from the first 1,000 customers, our priorities for Q2-Q3 2026:</p>

<p><strong>Onboarding redesign.</strong> Role-based onboarding paths (founder, sales lead, ops manager, developer), interactive guided setup, and a migration concierge service for all paid plans.</p>

<p><strong>Migration tooling.</strong> Importers for every major CRM, project management tool, and document platform. Target: zero-friction migration for 95% of prospective customers.</p>

<p><strong>Incremental adoption patterns.</strong> Better integration with tools customers aren't ready to leave yet. OmniOS as a hub that connects to your existing tools, gradually consolidating as trust builds.</p>

<p><strong>Vertical-specific templates.</strong> Pre-built workspace configurations for our top 5 verticals: SaaS companies, marketing agencies, professional services, e-commerce, and healthcare. Each includes the most common workflows, reports, and data models for that industry.</p>

<p>We're grateful to the 1,000 teams who took a bet on us early. Everything we ship from here is shaped by what you've taught us. If you have feedback, reach out at hello@omnios.app.</p>
    `,
  },

  "connecting-stripe-in-thirty-seconds": {
    toc: [
      { id: "before-you-start", label: "Before you start" },
      { id: "connect-stripe", label: "Connecting Stripe to OmniOS" },
      { id: "what-syncs", label: "What data syncs" },
      { id: "revenue-dashboard", label: "Your revenue dashboard" },
      { id: "stripe-workflows", label: "Stripe-triggered workflows" },
      { id: "crm-connection", label: "Connecting payments to your CRM" },
      { id: "troubleshooting", label: "Troubleshooting" },
    ],
    html: `
<p class="lead">Connecting Stripe to OmniOS takes 30 seconds. Getting useful revenue data flowing into your workflows and dashboards takes another 5 minutes. Here's the complete walkthrough.</p>

<h2 id="before-you-start">Before you start</h2>
<p>You'll need:</p>
<ul>
  <li>An OmniOS account (any paid plan — the Stripe integration requires the paid tier)</li>
  <li>A Stripe account with at least one payment or subscription on it</li>
  <li>Admin access on both accounts</li>
</ul>

<p>The integration works in both live and test mode. If you're evaluating OmniOS, connect your Stripe test account first to see how it works without involving real payment data.</p>

<h2 id="connect-stripe">Connecting Stripe to OmniOS</h2>
<p>In OmniOS, go to <strong>Settings → Integrations → Stripe</strong>. Click <strong>Connect Stripe Account</strong>.</p>

<p>You'll be redirected to Stripe's OAuth authorization page. Log in to Stripe if you aren't already, then click <strong>Allow access</strong>. You'll be redirected back to OmniOS.</p>

<p>That's it. The connection is live. OmniOS immediately begins a historical sync — pulling in your existing customers, subscriptions, payments, and invoices. For accounts with extensive history, the initial sync can take 5-15 minutes. You'll see a sync progress indicator in the Stripe integration settings page.</p>

<p>OmniOS uses Stripe's official OAuth integration, which means:</p>
<ul>
  <li>OmniOS never stores your Stripe API keys</li>
  <li>You can revoke access from your Stripe dashboard at any time</li>
  <li>Access is scoped to read and webhook permissions only — OmniOS cannot charge customers or modify your Stripe configuration</li>
</ul>

<h2 id="what-syncs">What data syncs</h2>
<p>After the initial sync, OmniOS maintains real-time sync via Stripe webhooks. Here's exactly what data is available in OmniOS after connecting:</p>

<p><strong>Customers:</strong> All Stripe customers are available as OmniOS contacts. If a Stripe customer's email matches an existing OmniOS contact, they're merged automatically. Otherwise, a new contact is created with the Stripe customer ID, email, name, and metadata.</p>

<p><strong>Subscriptions:</strong> All subscriptions with their current status (active, past_due, canceled, trialing), plan details, billing interval, MRR contribution, and renewal date. Status changes in Stripe update the OmniOS record in real time via webhook.</p>

<p><strong>Payments:</strong> All payment intents and charges — amount, currency, status, associated customer, and associated invoice.</p>

<p><strong>Invoices:</strong> All invoices with line items, amount due, payment status, and due date.</p>

<p><strong>Products and prices:</strong> Your Stripe product catalog is available for referencing in workflows and for enriching deal records in CRM.</p>

<h2 id="revenue-dashboard">Your revenue dashboard</h2>
<p>As soon as the initial sync completes, navigate to <strong>Analytics → Revenue</strong>. You'll see a pre-built revenue dashboard with:</p>

<ul>
  <li><strong>MRR:</strong> Current monthly recurring revenue, with 6-month trend chart</li>
  <li><strong>Net MRR change:</strong> New MRR - churned MRR for the current month</li>
  <li><strong>Churn rate:</strong> Customer churn and revenue churn, 90-day trailing average</li>
  <li><strong>ARPU:</strong> Average revenue per user, segmented by plan if available</li>
  <li><strong>LTV:</strong> Estimated lifetime value based on current ARPU and churn rate</li>
  <li><strong>Payment failures:</strong> Failed payments in the last 30 days with retry status</li>
  <li><strong>Upcoming renewals:</strong> Subscriptions renewing in the next 30 days</li>
</ul>

<p>All charts are interactive — click any segment to drill down to the individual customers or invoices that comprise it. You can filter by date range, plan type, or any other dimension available in your Stripe data.</p>

<h2 id="stripe-workflows">Stripe-triggered workflows</h2>
<p>The most valuable part of the Stripe integration isn't the dashboards — it's the workflows. Stripe events become OmniOS workflow triggers. Some examples of what you can build:</p>

<p><strong>Payment success → CRM update + welcome email:</strong></p>
<blockquote>When a Stripe subscription is created and payment succeeds, create a new deal in CRM, set it to "Closed Won", send the customer a personalized welcome email from their account manager, create a 30-day onboarding task for the customer success team, and add the customer to the onboarding Slack channel.</blockquote>

<p><strong>Payment failure → dunning sequence:</strong></p>
<blockquote>When a Stripe payment fails, wait 1 hour, then send the customer an email with a payment link. If payment is still not received after 48 hours, send a second email with an escalation path. If not resolved in 7 days, create a task for the account management team and flag the customer as at-risk in CRM.</blockquote>

<p><strong>Subscription canceled → win-back sequence:</strong></p>
<blockquote>When a Stripe subscription is canceled, log the cancellation reason in CRM, add the customer to a win-back email sequence, and create a task for a customer success call 7 days post-cancellation.</blockquote>

<p>All of these are available as pre-built workflow templates in OmniOS. Install them with one click and customize the email content and timing to match your preferences.</p>

<h2 id="crm-connection">Connecting payments to your CRM</h2>
<p>One of the most powerful features of the Stripe integration is the automatic linkage between payment data and your CRM. When a Stripe customer pays, OmniOS:</p>

<ol>
  <li>Finds the matching CRM contact (by email)</li>
  <li>Updates their "last payment date" and "total lifetime value" custom fields</li>
  <li>Attaches the invoice to their contact record for reference</li>
  <li>Updates their customer health score based on payment history</li>
</ol>

<p>The result: when you open a contact record in OmniOS, you see their complete picture — not just their CRM history but their payment history, their current subscription status, their upcoming renewal date, and their lifetime value. No toggling between CRM and Stripe.</p>

<p>You can also create CRM reports that incorporate revenue data. "Show me all contacts who are on our Team plan, have been customers for more than 12 months, and haven't expanded in the last 6 months" is now a one-query report — because the Stripe data and CRM data live in the same graph.</p>

<h2 id="troubleshooting">Troubleshooting</h2>
<p><strong>Stripe customers aren't matching OmniOS contacts.</strong> The match is by email. If a Stripe customer's email doesn't exactly match a contact's email in OmniOS, they won't be auto-merged. Go to Settings → Integrations → Stripe → Match Settings to configure fuzzy matching or create manual matches.</p>

<p><strong>The revenue dashboard shows $0 MRR but I have subscriptions.</strong> The initial sync might still be running. Check the sync status at Settings → Integrations → Stripe → Sync Status. If sync shows complete but the dashboard is empty, try clicking "Re-sync" — this re-pulls all data from Stripe.</p>

<p><strong>Webhooks aren't triggering workflows.</strong> Verify that your Stripe webhook is configured correctly. Go to Settings → Integrations → Stripe → Webhooks and click "Verify Connection." If the status is red, click "Reset Webhook" to re-register.</p>

<p><strong>Revenue dashboard is showing data in the wrong currency.</strong> Go to Settings → Workspace → Currency to set your primary display currency. OmniOS will convert all Stripe values to your display currency using current exchange rates.</p>

<p>For other issues, contact support at hello@omnios.app with your workspace ID (found in Settings → Workspace → About) and a description of what you're seeing.</p>
    `,
  },
};
