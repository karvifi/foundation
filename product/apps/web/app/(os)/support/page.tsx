"use client";

import { useState } from "react";
import {
  Headphones,
  Plus,
  Search,
  Filter,
  Inbox,
  Clock,
  Star,
  CheckCircle2,
  AlertCircle,
  Circle,
  Send,
  Sparkles,
  BookOpen,
  Tag,
  UserCheck,
  StickyNote,
  X,
  ChevronDown,
  MessageSquare,
  Calendar,
  Flag,
  Zap,
  FileText,
  ArrowUpRight,
  Bot,
  BarChart3,
  Timer,
  Target,
} from "lucide-react";

type Priority = "urgent" | "high" | "normal" | "low";
type Status = "open" | "pending" | "resolved";
type Sender = "customer" | "agent";
type Topic = "billing" | "bug" | "feature" | "onboarding" | "account";

interface Message {
  id: string;
  sender: Sender;
  author: string;
  initials: string;
  body: string;
  timestamp: string;
}

interface Ticket {
  id: string;
  customer: string;
  email: string;
  initials: string;
  subject: string;
  priority: Priority;
  status: Status;
  assignedTo: string;
  assigneeInitials: string;
  updatedAt: string;
  topic: Topic;
  aiSuggestion: string;
  kbMatch: number;
  thread: Message[];
}

interface KbArticle {
  id: string;
  title: string;
  topic: Topic;
  views: number;
}

interface AgentLoad {
  name: string;
  initials: string;
  tickets: number;
  capacity: number;
  isBot?: boolean;
}

const AGENTS = ["All Agents", "Maya Chen", "Devon Park", "Isabela Rossi", "Kai Nakamura", "Priya Shah"];

const AGENT_LOAD: AgentLoad[] = [
  { name: "Maya Chen", initials: "MC", tickets: 8, capacity: 12 },
  { name: "Devon Park", initials: "DP", tickets: 5, capacity: 12 },
  { name: "Isabela Rossi", initials: "IR", tickets: 6, capacity: 12 },
  { name: "Kai Nakamura", initials: "KN", tickets: 3, capacity: 12 },
  { name: "OmniAI Bot", initials: "AI", tickets: 147, capacity: 200, isBot: true },
];

const SLA_DATA = [
  { tier: "P1", met: 100, target: "1h" },
  { tier: "P2", met: 94, target: "4h" },
  { tier: "P3", met: 88, target: "24h" },
];

const RESPONSE_TEMPLATES: Record<Topic, { label: string; body: string }[]> = {
  billing: [
    { label: "Refund duplicate charge", body: "Hi — thanks for reaching out. I've located the duplicate charge and have processed a refund. You should see it back on your card in 3-5 business days. Let me know if anything else looks off." },
    { label: "VAT invoice reissue", body: "Hi — to add VAT lines we need a validated VAT ID on file. Could you confirm yours? Once added I'll regenerate the invoice straight away." },
    { label: "Plan pause offer", body: "Hi — annual plans aren't prorated, but we can pause your workspace for up to 60 days at no cost. Would that work as a middle ground?" },
  ],
  bug: [
    { label: "Request reproduction details", body: "Thanks for reporting this. To investigate further could you share: (1) browser/OS, (2) workspace ID, (3) a screen recording if possible? I'll loop in engineering as soon as I have those." },
    { label: "Known issue acknowledgement", body: "This matches a known regression we're tracking. A hotfix is in review and should ship this week. I'll notify you the moment it lands." },
    { label: "Escalate to engineering", body: "I've escalated this to our engineering team with full context. You'll get an update within one business day. Apologies for the friction." },
  ],
  feature: [
    { label: "Log on roadmap", body: "Appreciate the detailed request — I've logged it against the relevant roadmap epic. We review these monthly with product. I'll follow up if it gets prioritized." },
    { label: "Early access invite", body: "Good news — this is on our roadmap. I've added you to the early-access list, so you'll be among the first to try it when it ships." },
    { label: "Workaround suggestion", body: "While we evaluate this, here's a workaround that might help in the meantime. Happy to walk you through it on a quick call if useful." },
  ],
  onboarding: [
    { label: "Setup walkthrough", body: "Welcome aboard. Here's the quickest path to get set up: (1) invite your team, (2) connect your data source, (3) pick a starter template. I'll be here if anything trips you up." },
    { label: "Doc clarification", body: "Thanks for flagging — I've requested a doc update. In the meantime here's the exact step you need..." },
    { label: "Schedule onboarding call", body: "Happy to walk you through this live. Here's my calendar — pick whatever works best for you." },
  ],
  account: [
    { label: "Verify identity", body: "Before making changes I'll need to verify your identity. Please reply from your registered email and confirm your workspace ID." },
    { label: "Ownership transfer", body: "Sure — ownership transfers happen under Settings → Ownership → Transfer. Detailed steps just sent. Let me know if the recipient runs into any issues." },
    { label: "2FA reset", body: "I've reset 2FA on your account. Please log back in and re-enroll your authenticator. New backup codes will be available immediately after." },
  ],
};

const KB_ARTICLES: KbArticle[] = [
  { id: "kb-1", title: "Updating your billing method and invoices", topic: "billing", views: 4821 },
  { id: "kb-2", title: "Refund policy for annual subscriptions", topic: "billing", views: 2314 },
  { id: "kb-3", title: "Resolving failed card charges", topic: "billing", views: 1902 },
  { id: "kb-4", title: "Exporting data from the CRM module", topic: "bug", views: 1567 },
  { id: "kb-5", title: "Troubleshooting Slack integration errors", topic: "bug", views: 988 },
  { id: "kb-6", title: "Roadmap: how we evaluate feature requests", topic: "feature", views: 742 },
  { id: "kb-7", title: "Quickstart: setting up your first workspace", topic: "onboarding", views: 6110 },
  { id: "kb-8", title: "Inviting teammates and managing roles", topic: "onboarding", views: 3401 },
  { id: "kb-9", title: "Two-factor authentication setup", topic: "account", views: 2208 },
];

const TICKETS: Ticket[] = [
  { id: "OMNI-4821", customer: "Sarah Lindqvist", email: "sarah@acme.io", initials: "SL", subject: "Double-charged for Pro plan upgrade last Tuesday", priority: "urgent", status: "open", assignedTo: "Maya Chen", assigneeInitials: "MC", updatedAt: "12 min ago", topic: "billing", kbMatch: 94, aiSuggestion: "This appears to be a duplicate charge from the plan upgrade retry flow. Refund the duplicate line item and confirm the card issuer will release the hold within 3 business days.", thread: [
    { id: "m1", sender: "customer", author: "Sarah Lindqvist", initials: "SL", body: "Hey team — I upgraded to Pro on Tuesday and I see two charges of $49 on my statement. Can you refund the duplicate?", timestamp: "Today, 9:12 AM" },
    { id: "m2", sender: "agent", author: "Maya Chen", initials: "MC", body: "Hi Sarah — thanks for flagging. I can see both charges on our side. Pulling up the transaction now and will process the refund within the hour.", timestamp: "Today, 9:41 AM" },
    { id: "m3", sender: "customer", author: "Sarah Lindqvist", initials: "SL", body: "Thank you. Just worried because it pushed me over my card limit.", timestamp: "Today, 9:44 AM" },
  ] },
  { id: "OMNI-4820", customer: "Marcus Okoye", email: "marcus@techstart.io", initials: "MO", subject: "CSV export from CRM returns empty file for large segments", priority: "high", status: "pending", assignedTo: "Devon Park", assigneeInitials: "DP", updatedAt: "1 hr ago", topic: "bug", kbMatch: 71, aiSuggestion: "Likely the 50k-row streaming bug fixed in release 2.14. Ask the customer to retry, then escalate to engineering with the workspace ID if the issue persists.", thread: [
    { id: "m1", sender: "customer", author: "Marcus Okoye", initials: "MO", body: "Any segment above ~50k contacts gives me a 0-byte CSV. Smaller segments export fine.", timestamp: "Today, 8:02 AM" },
    { id: "m2", sender: "agent", author: "Devon Park", initials: "DP", body: "Thanks Marcus — this matches a known streaming edge case. Can you try once more after refreshing? If it still fails I'll loop in engineering.", timestamp: "Today, 8:30 AM" },
  ] },
  { id: "OMNI-4819", customer: "Elena Ferraro", email: "elena@globalmedia.co", initials: "EF", subject: "Invoice PDF missing tax line items for EU billing", priority: "normal", status: "open", assignedTo: "Isabela Rossi", assigneeInitials: "IR", updatedAt: "3 hr ago", topic: "billing", kbMatch: 88, aiSuggestion: "EU VAT lines require the workspace to have a validated VAT ID on file. Confirm the VAT ID and regenerate the invoice.", thread: [
    { id: "m1", sender: "customer", author: "Elena Ferraro", initials: "EF", body: "Our finance team needs VAT lines on the invoice for this to be reimbursable. Current PDF has none.", timestamp: "Yesterday, 4:14 PM" },
  ] },
  { id: "OMNI-4818", customer: "James Whitaker", email: "james@financeflow.co", initials: "JW", subject: "SAML SSO setup docs unclear for Okta federation", priority: "normal", status: "resolved", assignedTo: "Kai Nakamura", assigneeInitials: "KN", updatedAt: "Yesterday", topic: "onboarding", kbMatch: 82, aiSuggestion: "Customer resolved after following the updated Okta guide. Consider pinning the Okta section higher in the SSO doc based on ticket volume.", thread: [
    { id: "m1", sender: "customer", author: "James Whitaker", initials: "JW", body: "Got it working after matching the ACS URL format. The docs could be more explicit about the trailing slash.", timestamp: "Yesterday, 2:02 PM" },
    { id: "m2", sender: "agent", author: "Kai Nakamura", initials: "KN", body: "Glad it worked! Filing a doc update now — appreciate the feedback.", timestamp: "Yesterday, 2:10 PM" },
  ] },
  { id: "OMNI-4817", customer: "Priya Shah", email: "priya@cloudbase.ai", initials: "PS", subject: "Mobile app crashes on launch after iOS 18.2 update", priority: "urgent", status: "open", assignedTo: "Devon Park", assigneeInitials: "DP", updatedAt: "22 min ago", topic: "bug", kbMatch: 62, aiSuggestion: "Matches the iOS 18.2 push-token regression. Ask for a crash log and tag the mobile team — hotfix 3.9.1 is in review.", thread: [
    { id: "m1", sender: "customer", author: "Priya Shah", initials: "PS", body: "App opens then immediately closes. Happened right after the iOS update this morning.", timestamp: "Today, 7:45 AM" },
  ] },
  { id: "OMNI-4816", customer: "Hiro Tanaka", email: "hiro@northmarket.jp", initials: "HT", subject: "Feature request: recurring automations on custom schedules", priority: "low", status: "pending", assignedTo: "Isabela Rossi", assigneeInitials: "IR", updatedAt: "6 hr ago", topic: "feature", kbMatch: 45, aiSuggestion: "Log against the Automations roadmap epic. Two similar asks this quarter — worth a product check-in.", thread: [
    { id: "m1", sender: "customer", author: "Hiro Tanaka", initials: "HT", body: "Would love cron-style scheduling for automations — current presets are too coarse.", timestamp: "Today, 3:11 AM" },
  ] },
  { id: "OMNI-4815", customer: "Amelia Okafor", email: "amelia@brightpath.org", initials: "AO", subject: "Cannot invite new teammates — role dropdown empty", priority: "high", status: "open", assignedTo: "Maya Chen", assigneeInitials: "MC", updatedAt: "45 min ago", topic: "onboarding", kbMatch: 91, aiSuggestion: "The workspace likely has no custom roles defined. Suggest selecting from the default role set or creating a role under Settings → Roles.", thread: [
    { id: "m1", sender: "customer", author: "Amelia Okafor", initials: "AO", body: "Trying to onboard three new people but the role dropdown on the invite modal is empty.", timestamp: "Today, 9:02 AM" },
  ] },
  { id: "OMNI-4814", customer: "Noah Bergmann", email: "noah@alpenlabs.ch", initials: "NB", subject: "Webhook retries not honoring exponential backoff", priority: "normal", status: "pending", assignedTo: "Devon Park", assigneeInitials: "DP", updatedAt: "4 hr ago", topic: "bug", kbMatch: 76, aiSuggestion: "Retry interval config moved to workspace-level settings in 2.13. Confirm the customer isn't relying on the legacy per-hook setting.", thread: [
    { id: "m1", sender: "customer", author: "Noah Bergmann", initials: "NB", body: "Our webhook is retrying every 10 seconds regardless of backoff config. Expecting exponential.", timestamp: "Today, 6:18 AM" },
  ] },
  { id: "OMNI-4813", customer: "Valentina Cruz", email: "vale@studioluz.mx", initials: "VC", subject: "How do I migrate my workspace to a new owner?", priority: "low", status: "resolved", assignedTo: "Kai Nakamura", assigneeInitials: "KN", updatedAt: "2 days ago", topic: "account", kbMatch: 96, aiSuggestion: "Walked customer through ownership transfer flow. Consider adding a self-serve prompt in Settings → Ownership.", thread: [
    { id: "m1", sender: "customer", author: "Valentina Cruz", initials: "VC", body: "Leaving the company — need to hand off workspace ownership to my cofounder.", timestamp: "2 days ago" },
    { id: "m2", sender: "agent", author: "Kai Nakamura", initials: "KN", body: "Happy to help. Use Settings → Ownership → Transfer. I've sent the detailed steps over.", timestamp: "2 days ago" },
  ] },
  { id: "OMNI-4812", customer: "Derek Malone", email: "derek@portmetrics.io", initials: "DM", subject: "Dashboard charts render blank on Safari 17", priority: "high", status: "open", assignedTo: "Devon Park", assigneeInitials: "DP", updatedAt: "2 hr ago", topic: "bug", kbMatch: 84, aiSuggestion: "Known Canvas compositing issue on Safari 17.0–17.2. Suggest upgrading Safari; mobile Safari is unaffected.", thread: [
    { id: "m1", sender: "customer", author: "Derek Malone", initials: "DM", body: "Charts show blank rectangles only on Safari — Chrome is fine.", timestamp: "Today, 7:21 AM" },
  ] },
  { id: "OMNI-4811", customer: "Linh Pham", email: "linh@vertexco.vn", initials: "LP", subject: "Can I cancel my annual plan mid-term and prorate?", priority: "normal", status: "pending", assignedTo: "Maya Chen", assigneeInitials: "MC", updatedAt: "5 hr ago", topic: "billing", kbMatch: 89, aiSuggestion: "Annual plans are non-prorated per policy. Offer plan pause (up to 60 days) as a middle ground.", thread: [
    { id: "m1", sender: "customer", author: "Linh Pham", initials: "LP", body: "Our needs changed — is there any way to cancel and recover some of the annual fee?", timestamp: "Today, 4:30 AM" },
  ] },
  { id: "OMNI-4810", customer: "Omar Haddad", email: "omar@dunestudio.ae", initials: "OH", subject: "Feature request: multi-currency invoices", priority: "low", status: "open", assignedTo: "Isabela Rossi", assigneeInitials: "IR", updatedAt: "Yesterday", topic: "feature", kbMatch: 38, aiSuggestion: "Currently tracked as BILL-204 on the billing roadmap. Share ETA Q3 and add customer to the early-access list.", thread: [
    { id: "m1", sender: "customer", author: "Omar Haddad", initials: "OH", body: "Clients want invoices in AED and EUR, not just USD. Any plans?", timestamp: "Yesterday, 11:05 AM" },
  ] },
  { id: "OMNI-4809", customer: "Rachel Bloom", email: "rachel@heronanalytics.com", initials: "RB", subject: "Welcome email tour not triggering for new seats", priority: "normal", status: "resolved", assignedTo: "Priya Shah", assigneeInitials: "PS", updatedAt: "3 days ago", topic: "onboarding", kbMatch: 79, aiSuggestion: "Caused by opt-out flag inherited at workspace level. Flag now cleared on the account.", thread: [
    { id: "m1", sender: "customer", author: "Rachel Bloom", initials: "RB", body: "New hires aren't getting the welcome email tour.", timestamp: "3 days ago" },
    { id: "m2", sender: "agent", author: "Priya Shah", initials: "PS", body: "Cleared the workspace-level opt-out. New invitees should receive the tour going forward.", timestamp: "3 days ago" },
  ] },
  { id: "OMNI-4808", customer: "Tomasz Wójcik", email: "tomasz@krakowsoft.pl", initials: "TW", subject: "API rate limit hit during nightly sync job", priority: "high", status: "pending", assignedTo: "Devon Park", assigneeInitials: "DP", updatedAt: "8 hr ago", topic: "bug", kbMatch: 67, aiSuggestion: "Rate limit upgrade available on Scale tier. Alternatively stagger the sync with a 250ms delay between calls.", thread: [
    { id: "m1", sender: "customer", author: "Tomasz Wójcik", initials: "TW", body: "Sync job tripped the 429 limit overnight. Can we raise the ceiling?", timestamp: "Today, 1:02 AM" },
  ] },
  { id: "OMNI-4807", customer: "Ines Oliveira", email: "ines@lisboalabs.pt", initials: "IO", subject: "Two-factor backup codes not generating", priority: "urgent", status: "open", assignedTo: "Maya Chen", assigneeInitials: "MC", updatedAt: "34 min ago", topic: "account", kbMatch: 92, aiSuggestion: "Reset 2FA from the admin console and regenerate backup codes. Confirm customer identity via registered email first.", thread: [
    { id: "m1", sender: "customer", author: "Ines Oliveira", initials: "IO", body: "Locked out — backup codes screen is blank. Please help, I have a demo in 2 hours.", timestamp: "Today, 8:50 AM" },
  ] },
];

const PRIORITY_STYLES: Record<Priority, string> = {
  urgent: "bg-red-500/15 text-red-300 border-red-500/30",
  high: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  normal: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  low: "bg-white/5 text-white/60 border-white/10",
};

const STATUS_STYLES: Record<Status, string> = {
  open: "bg-red-500/15 text-red-300 border-red-500/30",
  pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  resolved: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

const STATUS_ICON: Record<Status, typeof Circle> = {
  open: AlertCircle,
  pending: Clock,
  resolved: CheckCircle2,
};

interface AvatarProps {
  initials: string;
  tone?: "indigo" | "emerald" | "amber" | "red" | "neutral";
  size?: number;
}

function Avatar({ initials, tone = "indigo", size = 32 }: AvatarProps) {
  const toneMap: Record<string, string> = {
    indigo: "bg-indigo-500/20 text-indigo-200",
    emerald: "bg-emerald-500/20 text-emerald-200",
    amber: "bg-amber-500/20 text-amber-200",
    red: "bg-red-500/20 text-red-200",
    neutral: "bg-white/10 text-white/70",
  };
  return (
    <div className={`rounded-full grid place-items-center font-medium ${toneMap[tone]}`} style={{ width: size, height: size, fontSize: size * 0.38 }}>
      {initials}
    </div>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${PRIORITY_STYLES[priority]}`}>
      <Flag size={9} />
      {priority}
    </span>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const Icon = STATUS_ICON[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${STATUS_STYLES[status]}`}>
      <Icon size={10} />
      {status}
    </span>
  );
}

function KbBadge({ match }: { match: number }) {
  const autoResolve = match >= 80;
  return (
    <div className="flex items-center gap-1.5">
      <span className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${autoResolve ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : "bg-white/5 text-white/50 border-white/10"}`}>
        <FileText size={9} />
        KB {match}%
      </span>
      {autoResolve && (
        <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/15 text-indigo-200 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider">
          <Bot size={9} />
          Auto
        </span>
      )}
    </div>
  );
}

interface NewTicketModalProps {
  onClose: () => void;
  onCreate: (subject: string, priority: Priority, customer: string) => void;
}

function NewTicketModal({ onClose, onCreate }: NewTicketModalProps) {
  const [subject, setSubject] = useState("");
  const [customer, setCustomer] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-6">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0F0F15] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-lg font-semibold">New ticket</div>
            <div className="text-xs text-white/40 mt-0.5">Create a support ticket on behalf of a customer</div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-[11px] uppercase tracking-wider text-white/50">Customer email</label>
            <input value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="name@company.com" className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-indigo-500/50 focus:outline-none" />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wider text-white/50">Subject</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Short summary of the issue" className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-indigo-500/50 focus:outline-none" />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wider text-white/50">Priority</label>
            <div className="mt-1.5 grid grid-cols-4 gap-2">
              {(["low", "normal", "high", "urgent"] as Priority[]).map((p) => (
                <button key={p} onClick={() => setPriority(p)} className={`rounded-lg border px-3 py-2 text-xs capitalize transition-colors ${priority === p ? PRIORITY_STYLES[p] : "border-white/10 text-white/50 hover:text-white"}`}>{p}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wider text-white/50">Description</label>
            <textarea rows={4} placeholder="Describe what the customer is experiencing..." className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-indigo-500/50 focus:outline-none resize-none" />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70 hover:text-white transition-colors">Cancel</button>
          <button onClick={() => { if (subject.trim() && customer.trim()) onCreate(subject, priority, customer); }} className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400 transition-colors">Create ticket</button>
        </div>
      </div>
    </div>
  );
}

function DeflectionBar() {
  const items = [
    { icon: Inbox, label: "This week", value: "847 tickets", tone: "text-white" },
    { icon: Bot, label: "Auto-resolved by AI", value: "312 (37%)", tone: "text-indigo-300" },
    { icon: Timer, label: "Avg first response", value: "4.2 min", tone: "text-emerald-300" },
    { icon: Star, label: "CSAT", value: "4.8 / 5.0", tone: "text-amber-300" },
  ];
  return (
    <div className="border-b border-white/5 bg-gradient-to-r from-indigo-500/[0.05] via-white/[0.01] to-transparent px-8 py-3">
      <div className="flex items-center gap-6 overflow-x-auto">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-indigo-300/80 shrink-0">
          <Sparkles size={11} />
          AI Deflection
        </div>
        <div className="h-4 w-px bg-white/10 shrink-0" />
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-2 shrink-0">
            <it.icon size={12} className="text-white/40" />
            <span className="text-[11px] text-white/50">{it.label}:</span>
            <span className={`text-[12px] font-semibold ${it.tone}`}>{it.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentRoutingPanel() {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 size={13} className="text-indigo-300" />
          <span className="text-[11px] uppercase tracking-[0.14em] text-white/50">Queue Routing</span>
        </div>
        <span className="text-[10px] text-white/40">Live workload</span>
      </div>
      <div className="space-y-2.5">
        {AGENT_LOAD.map((a) => {
          const pct = Math.min(100, Math.round((a.tickets / a.capacity) * 100));
          const barColor = a.isBot ? "bg-indigo-400" : pct > 75 ? "bg-red-400" : pct > 50 ? "bg-amber-400" : "bg-emerald-400";
          return (
            <div key={a.name} className="flex items-center gap-3">
              <div className={`h-6 w-6 rounded-md grid place-items-center text-[10px] font-medium ${a.isBot ? "bg-indigo-500/25 text-indigo-200" : "bg-white/10 text-white/70"}`}>
                {a.isBot ? <Bot size={11} /> : a.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-white/80 truncate">{a.name}</span>
                  <span className="text-[10px] text-white/50 font-mono">{a.tickets}/{a.capacity}</span>
                </div>
                <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                  <div className={`h-full ${barColor} transition-all`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SlaPanel() {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target size={13} className="text-emerald-300" />
          <span className="text-[11px] uppercase tracking-[0.14em] text-white/50">SLA Compliance</span>
        </div>
        <span className="text-[10px] text-white/40">Avg resolution: <span className="text-white/80 font-medium">3.2h</span></span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {SLA_DATA.map((s) => {
          const color = s.met >= 95 ? "text-emerald-300" : s.met >= 90 ? "text-amber-300" : "text-red-300";
          const ring = s.met >= 95 ? "stroke-emerald-400" : s.met >= 90 ? "stroke-amber-400" : "stroke-red-400";
          const dash = (s.met / 100) * 100;
          return (
            <div key={s.tier} className="flex flex-col items-center gap-1.5">
              <div className="relative h-14 w-14">
                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" className="stroke-white/10" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" className={ring} strokeWidth="3" strokeDasharray={`${dash} 100`} strokeLinecap="round" />
                </svg>
                <div className={`absolute inset-0 grid place-items-center text-[11px] font-semibold ${color}`}>{s.met}%</div>
              </div>
              <div className="text-[10px] text-white/60 font-medium">{s.tier}</div>
              <div className="text-[9px] text-white/35">target {s.target}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>(TICKETS);
  const [selectedId, setSelectedId] = useState<string>(TICKETS[0].id);
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | Priority>("all");
  const [agentFilter, setAgentFilter] = useState<string>("All Agents");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [query, setQuery] = useState("");
  const [reply, setReply] = useState("");
  const [newTicketOpen, setNewTicketOpen] = useState(false);
  const [aiCollapsed, setAiCollapsed] = useState(false);

  const filtered = tickets.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
    if (agentFilter !== "All Agents" && t.assignedTo !== agentFilter) return false;
    if (query && !`${t.subject} ${t.customer} ${t.id}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const selected = tickets.find((t) => t.id === selectedId) ?? tickets[0];
  const relevantArticles = KB_ARTICLES.filter((a) => a.topic === selected.topic);
  const templates = RESPONSE_TEMPLATES[selected.topic];

  const handleResolve = () => setTickets((prev) => prev.map((t) => (t.id === selected.id ? { ...t, status: "resolved" } : t)));

  const handleSendReply = () => {
    if (!reply.trim()) return;
    const newMessage: Message = { id: `m-${Date.now()}`, sender: "agent", author: selected.assignedTo, initials: selected.assigneeInitials, body: reply.trim(), timestamp: "Just now" };
    setTickets((prev) => prev.map((t) => (t.id === selected.id ? { ...t, thread: [...t.thread, newMessage], updatedAt: "Just now", status: "pending" } : t)));
    setReply("");
  };

  const handleUseSuggestion = () => setReply(selected.aiSuggestion);
  const handleUseTemplate = (body: string) => setReply(body);

  const handleCreateTicket = (subject: string, priority: Priority, customer: string) => {
    const id = `OMNI-${4822 + (tickets.length - TICKETS.length)}`;
    const initials = customer.slice(0, 2).toUpperCase();
    const created: Ticket = { id, customer: customer.split("@")[0], email: customer, initials, subject, priority, status: "open", assignedTo: "Maya Chen", assigneeInitials: "MC", updatedAt: "Just now", topic: "account", kbMatch: 50, aiSuggestion: "Greet the customer and gather reproduction details before routing to the right specialist.", thread: [{ id: "m1", sender: "customer", author: customer.split("@")[0], initials, body: subject, timestamp: "Just now" }] };
    setTickets((prev) => [created, ...prev]);
    setSelectedId(id);
    setNewTicketOpen(false);
  };

  const openCount = tickets.filter((t) => t.status === "open").length;
  const pendingCount = tickets.filter((t) => t.status === "pending").length;
  const resolvedCount = tickets.filter((t) => t.status === "resolved").length;

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <DeflectionBar />

      <div className="border-b border-white/5 px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/15 text-indigo-300 grid place-items-center"><Headphones size={18} /></div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Customer Support</h1>
              <p className="text-xs text-white/40 mt-0.5">{openCount} open · {pendingCount} pending · {resolvedCount} resolved</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tickets, customers, IDs..." className="w-72 rounded-lg border border-white/10 bg-white/[0.03] pl-9 pr-3 py-2 text-sm focus:border-indigo-500/50 focus:outline-none" />
            </div>
            <button onClick={() => setNewTicketOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400 transition-colors">
              <Plus size={14} />New Ticket
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-4">
          <AgentRoutingPanel />
          <SlaPanel />
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Inbox size={13} className="text-amber-300" />
                <span className="text-[11px] uppercase tracking-[0.14em] text-white/50">Today's Snapshot</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><div className="text-[10px] uppercase tracking-wider text-white/40">Open</div><div className="mt-1 text-2xl font-semibold">{openCount}</div><div className="text-[10px] text-white/40 mt-0.5">+4 vs. yesterday</div></div>
              <div><div className="text-[10px] uppercase tracking-wider text-white/40">Resolved</div><div className="mt-1 text-2xl font-semibold text-emerald-300">{resolvedCount}</div><div className="text-[10px] text-white/40 mt-0.5">Target: 20</div></div>
              <div><div className="text-[10px] uppercase tracking-wider text-white/40">Avg response</div><div className="mt-1 text-2xl font-semibold">2.3h</div><div className="text-[10px] text-white/40 mt-0.5">-18m this week</div></div>
              <div><div className="text-[10px] uppercase tracking-wider text-white/40">Pending</div><div className="mt-1 text-2xl font-semibold text-amber-300">{pendingCount}</div><div className="text-[10px] text-white/40 mt-0.5">Awaiting reply</div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[220px_1fr_400px] gap-0 min-h-[calc(100vh-220px)]">
        <aside className="border-r border-white/5 p-5 space-y-5">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-white/40"><Filter size={11} />Filters</div>
          <div>
            <div className="text-xs font-medium text-white/60 mb-2">Status</div>
            <div className="space-y-1">
              {(["all", "open", "pending", "resolved"] as const).map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)} className={`w-full flex items-center justify-between rounded-md px-2 py-1.5 text-xs capitalize transition-colors ${statusFilter === s ? "bg-white/5 text-white" : "text-white/50 hover:text-white hover:bg-white/[0.03]"}`}>
                  <span>{s}</span>
                  <span className="text-[10px] text-white/30">{s === "all" ? tickets.length : tickets.filter((t) => t.status === s).length}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-white/60 mb-2">Priority</div>
            <div className="space-y-1">
              {(["all", "urgent", "high", "normal", "low"] as const).map((p) => (
                <button key={p} onClick={() => setPriorityFilter(p)} className={`w-full flex items-center justify-between rounded-md px-2 py-1.5 text-xs capitalize transition-colors ${priorityFilter === p ? "bg-white/5 text-white" : "text-white/50 hover:text-white hover:bg-white/[0.03]"}`}>
                  <span className="flex items-center gap-2">{p !== "all" && <Flag size={10} />}{p}</span>
                  <span className="text-[10px] text-white/30">{p === "all" ? tickets.length : tickets.filter((t) => t.priority === p).length}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-white/60 mb-2">Assigned agent</div>
            <div className="relative">
              <select value={agentFilter} onChange={(e) => setAgentFilter(e.target.value)} className="w-full appearance-none rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1.5 pr-7 text-xs focus:border-indigo-500/50 focus:outline-none">
                {AGENTS.map((a) => (<option key={a} value={a} className="bg-[#0F0F15]">{a}</option>))}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-white/40" />
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-white/60 mb-2">Date range</div>
            <div className="grid grid-cols-2 gap-1">
              {(["all", "today", "week", "month"] as const).map((d) => (
                <button key={d} onClick={() => setDateFilter(d)} className={`rounded-md px-2 py-1.5 text-[11px] capitalize transition-colors ${dateFilter === d ? "bg-indigo-500/15 text-indigo-200" : "text-white/50 hover:text-white hover:bg-white/[0.03]"}`}>{d}</button>
              ))}
            </div>
          </div>
        </aside>

        <section className="border-r border-white/5">
          <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between">
            <div className="text-xs text-white/50">Showing <span className="text-white font-medium">{filtered.length}</span> of {tickets.length} tickets</div>
            <div className="flex items-center gap-1 text-xs text-white/40"><Calendar size={11} />Sorted by last updated</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-white/40 border-b border-white/5">
                  <th className="text-left font-medium px-6 py-3">Ticket</th>
                  <th className="text-left font-medium py-3">Customer</th>
                  <th className="text-left font-medium py-3">Subject</th>
                  <th className="text-left font-medium py-3">AI / KB</th>
                  <th className="text-left font-medium py-3">Priority</th>
                  <th className="text-left font-medium py-3">Status</th>
                  <th className="text-left font-medium py-3 pr-6">Assigned</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} onClick={() => setSelectedId(t.id)} className={`border-b border-white/5 cursor-pointer transition-colors ${selectedId === t.id ? "bg-indigo-500/[0.06]" : "hover:bg-white/[0.02]"}`}>
                    <td className="px-6 py-3"><span className="font-mono text-[11px] text-white/50">{t.id}</span><div className="text-[10px] text-white/30 mt-0.5">{t.updatedAt}</div></td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Avatar initials={t.initials} size={26} />
                        <div>
                          <div className="text-xs font-medium">{t.customer}</div>
                          <div className="text-[10px] text-white/40">{t.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 max-w-[260px]"><div className="text-xs truncate">{t.subject}</div></td>
                    <td className="py-3"><KbBadge match={t.kbMatch} /></td>
                    <td className="py-3"><PriorityBadge priority={t.priority} /></td>
                    <td className="py-3"><StatusBadge status={t.status} /></td>
                    <td className="py-3 pr-6">
                      <div className="flex items-center gap-1.5">
                        <Avatar initials={t.assigneeInitials} tone="neutral" size={22} />
                        <span className="text-xs text-white/70">{t.assignedTo}</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-6 py-16 text-center text-sm text-white/40">No tickets match the current filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="flex flex-col bg-white/[0.01]">
          <div className="px-6 py-4 border-b border-white/5">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="font-mono text-[11px] text-white/40">{selected.id}</span>
                <PriorityBadge priority={selected.priority} />
                <StatusBadge status={selected.status} />
                <KbBadge match={selected.kbMatch} />
              </div>
              <h2 className="text-sm font-semibold leading-snug">{selected.subject}</h2>
              <div className="mt-2 flex items-center gap-2 text-xs text-white/50">
                <Avatar initials={selected.initials} size={20} />
                <span>{selected.customer}</span>
                <span className="text-white/20">·</span>
                <span className="text-white/40">{selected.email}</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-1.5">
              <button onClick={handleResolve} className="inline-flex items-center justify-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1.5 text-[11px] font-medium text-emerald-300 hover:bg-emerald-500/20 transition-colors"><CheckCircle2 size={12} />Resolve</button>
              <button className="inline-flex items-center justify-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1.5 text-[11px] font-medium text-white/70 hover:text-white transition-colors"><UserCheck size={12} />Assign</button>
              <button className="inline-flex items-center justify-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1.5 text-[11px] font-medium text-white/70 hover:text-white transition-colors"><Flag size={12} />Priority</button>
              <button className="inline-flex items-center justify-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1.5 text-[11px] font-medium text-white/70 hover:text-white transition-colors"><StickyNote size={12} />Note</button>
            </div>
          </div>

          <div className="mx-6 mt-4 rounded-xl border border-indigo-500/25 bg-gradient-to-br from-indigo-500/10 to-indigo-500/[0.02] p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-indigo-500/25 text-indigo-200 grid place-items-center"><Sparkles size={12} /></div>
                <div>
                  <div className="text-xs font-semibold text-indigo-100">OmniAI suggestion</div>
                  <div className="text-[10px] uppercase tracking-wider text-indigo-300/70">Topic: {selected.topic} · KB confidence {selected.kbMatch}%</div>
                </div>
              </div>
              <button onClick={() => setAiCollapsed((v) => !v)} className="text-indigo-300/60 hover:text-indigo-200">
                <ChevronDown size={14} className={`transition-transform ${aiCollapsed ? "-rotate-90" : ""}`} />
              </button>
            </div>
            {!aiCollapsed && (
              <>
                <p className="mt-2.5 text-xs text-white/80 leading-relaxed">{selected.aiSuggestion}</p>
                <button onClick={handleUseSuggestion} className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-indigo-500 px-3 py-1.5 text-[11px] font-medium hover:bg-indigo-400 transition-colors"><Zap size={11} />Use suggestion</button>
              </>
            )}
          </div>

          <div className="mx-6 mt-3">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-white/40 mb-2">
              <Bot size={11} className="text-indigo-300" />
              AI-drafted responses · {selected.topic}
            </div>
            <div className="space-y-1.5">
              {templates.map((t) => (
                <button key={t.label} onClick={() => handleUseTemplate(t.body)} className="w-full text-left rounded-lg border border-white/8 bg-white/[0.02] hover:border-indigo-500/30 hover:bg-indigo-500/[0.04] transition-colors p-2.5 group">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-medium text-white/85">{t.label}</span>
                    <span className="text-[9px] text-indigo-300/70 group-hover:text-indigo-200 inline-flex items-center gap-0.5"><Zap size={9} />Click to use</span>
                  </div>
                  <p className="text-[10.5px] text-white/50 leading-snug line-clamp-2">{t.body}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-white/40">
              <MessageSquare size={11} />Conversation · {selected.thread.length} messages
            </div>
            {selected.thread.map((m) => {
              const isAgent = m.sender === "agent";
              return (
                <div key={m.id} className={`flex gap-3 ${isAgent ? "flex-row-reverse" : ""}`}>
                  <Avatar initials={m.initials} tone={isAgent ? "indigo" : "neutral"} size={30} />
                  <div className={`flex-1 max-w-[85%] ${isAgent ? "items-end" : ""}`}>
                    <div className={`flex items-baseline gap-2 mb-1 ${isAgent ? "justify-end" : ""}`}>
                      <span className="text-xs font-medium">{m.author}</span>
                      <span className="text-[10px] text-white/35">{m.timestamp}</span>
                    </div>
                    <div className={`rounded-lg px-3 py-2 text-xs leading-relaxed ${isAgent ? "bg-indigo-500/15 border border-indigo-500/20 text-white/90" : "bg-white/[0.04] border border-white/5 text-white/80"}`}>{m.body}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-white/5 px-6 py-3">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-white/40 mb-2"><BookOpen size={11} />Relevant articles</div>
            <div className="space-y-1">
              {relevantArticles.length === 0 && <div className="text-xs text-white/30">No articles matched for this topic.</div>}
              {relevantArticles.slice(0, 3).map((a) => (
                <button key={a.id} className="w-full flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left hover:bg-white/[0.03] transition-colors group">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText size={11} className="text-white/40 shrink-0" />
                    <span className="text-[11px] truncate">{a.title}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-white/30">{a.views.toLocaleString()}</span>
                    <ArrowUpRight size={10} className="text-white/30 group-hover:text-white/70 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-white/5 p-4 bg-[#0A0A0F]">
            <div className="rounded-lg border border-white/10 bg-white/[0.02] focus-within:border-indigo-500/40 transition-colors">
              <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={3} placeholder={`Reply to ${selected.customer}...`} className="w-full bg-transparent px-3 py-2.5 text-xs leading-relaxed resize-none focus:outline-none placeholder:text-white/30" />
              <div className="flex items-center justify-between px-2 py-2 border-t border-white/5">
                <div className="flex items-center gap-1 text-white/40">
                  <button className="p-1.5 rounded hover:bg-white/5 hover:text-white transition-colors"><Tag size={12} /></button>
                  <button className="p-1.5 rounded hover:bg-white/5 hover:text-white transition-colors"><StickyNote size={12} /></button>
                </div>
                <button onClick={handleSendReply} disabled={!reply.trim()} className="inline-flex items-center gap-1.5 rounded-md bg-indigo-500 px-3 py-1.5 text-[11px] font-medium hover:bg-indigo-400 disabled:bg-white/5 disabled:text-white/30 transition-colors">
                  <Send size={11} />Send reply
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {newTicketOpen && <NewTicketModal onClose={() => setNewTicketOpen(false)} onCreate={handleCreateTicket} />}
    </div>
  );
}
