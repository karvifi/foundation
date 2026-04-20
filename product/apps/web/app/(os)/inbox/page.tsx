"use client";

import { useState } from "react";
import {
  Inbox as InboxIcon,
  Send,
  FileText,
  Star,
  AlertOctagon,
  Trash2,
  Tag,
  Plus,
  Search,
  Reply,
  ReplyAll,
  Forward,
  Archive,
  MoreHorizontal,
  Sparkles,
  X,
  Paperclip,
  Pencil,
  Filter,
  Mail,
  Hash,
  MessageCircle,
  Smartphone,
  Webhook,
  Bot,
  Timer,
  ChevronDown,
} from "lucide-react";

type FolderId =
  | "inbox"
  | "sent"
  | "drafts"
  | "starred"
  | "spam"
  | "trash"
  | "label-clients"
  | "label-invoices"
  | "label-team";

type Channel = "email" | "slack" | "chat" | "sms" | "webhook";
type Priority = "urgent" | "high" | "normal";
type Sentiment = "positive" | "neutral" | "negative";
type Intent =
  | "Support request"
  | "Sales inquiry"
  | "Partnership"
  | "Billing question"
  | "Notification";

interface Email {
  id: string;
  from: string;
  email: string;
  subject: string;
  preview: string;
  body: string[];
  time: string;
  date: string;
  unread: boolean;
  starred: boolean;
  label?: "Client Updates" | "Invoices" | "Team";
  avatarColor: string;
  channel: Channel;
  aiPriority: Priority;
  aiIntent: Intent;
  aiSentiment: Sentiment;
  slaMinutes?: number;
  resolved?: boolean;
}

const MOCK_EMAILS: Email[] = [
  {
    id: "e1",
    from: "Sarah Chen",
    email: "sarah@acme.com",
    subject: "Re: Enterprise proposal — quick question on SSO",
    preview:
      "Thanks for the detailed proposal. We have a few questions about the SSO implementation before we sign off…",
    body: [
      "Thanks for the detailed proposal. Our security team has reviewed everything and we're broadly aligned, but we have a few questions about the SSO implementation before we can sign off.",
      "Specifically: does your SCIM endpoint support nested groups from Okta, and what's the expected provisioning latency at our scale (roughly 4,200 seats)? We'd also like to understand the failure mode if the IdP becomes unreachable mid-session.",
      "Happy to jump on a call Thursday or Friday if easier. Looking forward to getting this across the line.",
    ],
    time: "10:24 AM",
    date: "Today, 10:24 AM",
    unread: true,
    starred: true,
    label: "Client Updates",
    avatarColor: "#6366F1",
    channel: "email",
    aiPriority: "urgent",
    aiIntent: "Sales inquiry",
    aiSentiment: "positive",
    slaMinutes: 47,
  },
  {
    id: "e2",
    from: "Marcus Williams",
    email: "marcus@techstart.io",
    subject: "Demo request — next week?",
    preview:
      "Hi, we reviewed your product and would love to schedule a 30-minute demo with our engineering leads…",
    body: [
      "Hi Karti, we reviewed OmniOS after your Product Hunt launch and the team is genuinely impressed. We'd love to schedule a 30-minute demo with our engineering leads next week.",
      "Our main interest is the unified workspace model — we're currently stitching together four separate tools and it's killing our team's focus. Tuesday or Wednesday afternoon work?",
    ],
    time: "9:02 AM",
    date: "Today, 9:02 AM",
    unread: true,
    starred: false,
    avatarColor: "#EC4899",
    channel: "email",
    aiPriority: "high",
    aiIntent: "Sales inquiry",
    aiSentiment: "positive",
  },
  {
    id: "e3",
    from: "Priya Raman",
    email: "priya@northwind.co",
    subject: "Invoice request for Q2 consulting work",
    preview:
      "Could you send over the invoice for the Q2 consulting engagement? Finance is closing the books Friday…",
    body: [
      "Hi Karti, could you send over the invoice for the Q2 consulting engagement? Finance is closing the books Friday and I want to make sure we don't push into next quarter.",
      "Total should be $2,400 based on the scope we agreed in April. Let me know if you need the PO number again.",
    ],
    time: "8:45 AM",
    date: "Today, 8:45 AM",
    unread: true,
    starred: false,
    label: "Invoices",
    avatarColor: "#F59E0B",
    channel: "email",
    aiPriority: "high",
    aiIntent: "Billing question",
    aiSentiment: "neutral",
  },
  {
    id: "e4",
    from: "Stripe",
    email: "billing@stripe.com",
    subject: "Invoice INV-2026-0042 paid — $4,200.00",
    preview: "Your invoice for $4,200.00 has been paid by Globalmedia Co. View receipt…",
    body: [
      "Your invoice INV-2026-0042 for $4,200.00 has been paid by Globalmedia Co.",
      "Funds will settle to your account in 2 business days. View the receipt or download a PDF copy from your dashboard.",
    ],
    time: "8:02 AM",
    date: "Today, 8:02 AM",
    unread: true,
    starred: false,
    label: "Invoices",
    avatarColor: "#635BFF",
    channel: "webhook",
    aiPriority: "normal",
    aiIntent: "Notification",
    aiSentiment: "positive",
    resolved: true,
  },
  {
    id: "e5",
    from: "Elena Rodriguez",
    email: "elena@globalmedia.co",
    subject: "Following up on revised pricing",
    preview:
      "Hi Karti, I wanted to follow up on the revised pricing we discussed last Thursday. Legal has cleared…",
    body: [
      "Hi Karti, I wanted to follow up on the revised pricing we discussed last Thursday. Legal has cleared the redlines on the MSA and we're ready to countersign.",
      "One last item: can you confirm the 90-day data retention clause applies only to production logs and not customer-generated content? Once that's squared away we can wire the deposit.",
      "Following up again — any movement on this? We'd love to wrap before our board meeting.",
    ],
    time: "Yesterday",
    date: "Yesterday, 4:48 PM",
    unread: false,
    starred: true,
    label: "Client Updates",
    avatarColor: "#10B981",
    channel: "email",
    aiPriority: "urgent",
    aiIntent: "Sales inquiry",
    aiSentiment: "neutral",
    slaMinutes: 12,
  },
  {
    id: "e6",
    from: "Daniel Okafor",
    email: "daniel@foundry.vc",
    subject: "Intro: Ravi at Sequent Capital",
    preview:
      "Karti — making the intro to Ravi as discussed. He leads Series A at Sequent and has been looking…",
    body: [
      "Karti — making the intro to Ravi as discussed. He leads Series A at Sequent and has been looking specifically at vertical AI workspaces for SMB teams.",
      "Ravi, Karti is the founder of OmniOS — one of the sharpest product thinkers I've met this year. I'll let you two take it from here.",
    ],
    time: "Yesterday",
    date: "Yesterday, 2:10 PM",
    unread: false,
    starred: true,
    avatarColor: "#8B5CF6",
    channel: "email",
    aiPriority: "high",
    aiIntent: "Partnership",
    aiSentiment: "positive",
  },
  {
    id: "e7",
    from: "Aiko Tanaka",
    email: "aiko@designcollective.jp",
    subject: "Brand refresh — round 2 concepts attached",
    preview:
      "Here's round 2 of the brand concepts. We leaned into the editorial direction you liked best…",
    body: [
      "Here's round 2 of the brand concepts. We leaned into the editorial direction you liked best in our last call — more type-forward, less illustrative.",
      "Would love your feedback by end of week so we can move into production for the launch page.",
    ],
    time: "Mon",
    date: "Monday, 11:20 AM",
    unread: false,
    starred: false,
    avatarColor: "#F43F5E",
    channel: "slack",
    aiPriority: "normal",
    aiIntent: "Support request",
    aiSentiment: "positive",
  },
  {
    id: "e8",
    from: "GitHub",
    email: "noreply@github.com",
    subject: "[omnios/app] PR #142 merged: Kanban drag-and-drop",
    preview: "PR #142 was merged into main by @karvifi. 14 files changed, +847 -23 lines…",
    body: [
      "Pull request #142 has been merged into main by @karvifi.",
      "Summary: 14 files changed, +847 additions, -23 deletions. CI passed in 2m 41s. Deploy to staging triggered automatically.",
    ],
    time: "Mon",
    date: "Monday, 9:14 AM",
    unread: false,
    starred: false,
    label: "Team",
    avatarColor: "#24292F",
    channel: "webhook",
    aiPriority: "normal",
    aiIntent: "Notification",
    aiSentiment: "positive",
    resolved: true,
  },
  {
    id: "e9",
    from: "Nadia Pavlova",
    email: "nadia@pavlova.design",
    subject: "Contract renewal — same terms?",
    preview:
      "Hey, my contract with OmniOS wraps at the end of the month. Happy to renew on the same terms…",
    body: [
      "Hey, my contract with OmniOS wraps at the end of the month. Happy to renew on the same terms — 20 hours a week, same rate.",
      "Let me know and I'll send over the paperwork. Also, the new settings UI is looking fantastic.",
    ],
    time: "Sun",
    date: "Sunday, 6:02 PM",
    unread: false,
    starred: false,
    label: "Team",
    avatarColor: "#14B8A6",
    channel: "slack",
    aiPriority: "normal",
    aiIntent: "Partnership",
    aiSentiment: "positive",
  },
  {
    id: "e10",
    from: "Linear",
    email: "notifications@linear.app",
    subject: "Weekly digest: 23 issues closed, 8 opened",
    preview:
      "Your team closed 23 issues this week and opened 8. Top contributors: Karti, Nadia, Daniel…",
    body: [
      "Your team closed 23 issues this week and opened 8. Velocity is up 14% week-over-week.",
      "Top contributors: Karti (9), Nadia (7), Daniel (5). Two issues have been open longer than 14 days — consider triaging.",
    ],
    time: "Sun",
    date: "Sunday, 8:00 AM",
    unread: false,
    starred: false,
    avatarColor: "#5E6AD2",
    channel: "webhook",
    aiPriority: "normal",
    aiIntent: "Notification",
    aiSentiment: "neutral",
  },
  {
    id: "e11",
    from: "Jordan Reeves",
    email: "jordan@harborlegal.com",
    subject: "MSA redlines — final version attached",
    preview:
      "Attached is the final version of the MSA with all redlines resolved. Please review Section 7.2…",
    body: [
      "Attached is the final version of the MSA with all redlines resolved. Please review Section 7.2 (limitation of liability) — we moved the cap to 12 months of fees as discussed.",
      "If everything looks good, I'll circulate for signature via DocuSign tomorrow.",
    ],
    time: "Sat",
    date: "Saturday, 3:30 PM",
    unread: false,
    starred: false,
    label: "Client Updates",
    avatarColor: "#0EA5E9",
    channel: "email",
    aiPriority: "high",
    aiIntent: "Partnership",
    aiSentiment: "neutral",
  },
  {
    id: "e12",
    from: "+1 (415) 555-0142",
    email: "sms",
    subject: "Login broken — locked out after reset",
    preview: "Hey, password reset isn't working. Tried clearing cache. Still 401. Help?",
    body: [
      "Hey, password reset isn't working. Tried clearing cache. Still getting a 401 on every login attempt.",
      "Tried Chrome and Safari. Same result. Coming up on a customer demo in an hour.",
      "Any chance someone can take a look? Pretty stuck here.",
    ],
    time: "Sat",
    date: "Saturday, 10:11 AM",
    unread: false,
    starred: false,
    avatarColor: "#000000",
    channel: "sms",
    aiPriority: "urgent",
    aiIntent: "Support request",
    aiSentiment: "negative",
    slaMinutes: 23,
  },
  {
    id: "e13",
    from: "Hana Müller",
    email: "hana@weissagency.de",
    subject: "Project kickoff — rebrand timeline",
    preview:
      "Excited to kick off the rebrand project Monday. Here's the proposed 8-week timeline…",
    body: [
      "Excited to kick off the rebrand project Monday. Here's the proposed 8-week timeline broken into discovery, concept, refinement, and production.",
      "We've blocked our senior team for the full engagement. Let me know if the milestones look right and we'll send the kickoff invite.",
    ],
    time: "Fri",
    date: "Friday, 1:45 PM",
    unread: false,
    starred: true,
    label: "Client Updates",
    avatarColor: "#EAB308",
    channel: "chat",
    aiPriority: "normal",
    aiIntent: "Partnership",
    aiSentiment: "positive",
  },
  {
    id: "e14",
    from: "AWS Billing",
    email: "no-reply@aws.com",
    subject: "Your April 2026 invoice is available — $1,284.22",
    preview:
      "Your AWS invoice for April 2026 is now available. Total: $1,284.22 across 14 services…",
    body: [
      "Your AWS invoice for April 2026 is now available. Total: $1,284.22 across 14 services.",
      "Largest line items: EC2 ($612), RDS ($318), CloudFront ($141). No unexpected usage anomalies detected.",
    ],
    time: "Apr 14",
    date: "April 14, 2026",
    unread: false,
    starred: false,
    label: "Invoices",
    avatarColor: "#FF9900",
    channel: "webhook",
    aiPriority: "normal",
    aiIntent: "Billing question",
    aiSentiment: "neutral",
    resolved: true,
  },
  {
    id: "e15",
    from: "Theo Laurent",
    email: "theo@laurentpartners.fr",
    subject: "Partnership proposal — distribution in EU",
    preview:
      "We'd like to propose a distribution partnership for the EU market. Our network covers 11 countries…",
    body: [
      "We'd like to propose a distribution partnership for the EU market. Our network covers 11 countries and ~3,400 SMB accounts that map closely to your ICP.",
      "Standard arrangement is a 20% rev-share with a 12-month exclusivity on specific verticals. Open to discussing a pilot if that feels heavy upfront.",
    ],
    time: "Apr 12",
    date: "April 12, 2026",
    unread: false,
    starred: false,
    avatarColor: "#DC2626",
    channel: "email",
    aiPriority: "high",
    aiIntent: "Partnership",
    aiSentiment: "positive",
  },
];

interface Folder {
  id: FolderId;
  name: string;
  icon: React.ReactNode;
  count?: number;
}

const FOLDERS: Folder[] = [
  { id: "inbox", name: "Inbox", icon: <InboxIcon size={15} />, count: 12 },
  { id: "sent", name: "Sent", icon: <Send size={15} /> },
  { id: "drafts", name: "Drafts", icon: <FileText size={15} />, count: 3 },
  { id: "starred", name: "Starred", icon: <Star size={15} /> },
  { id: "spam", name: "Spam", icon: <AlertOctagon size={15} /> },
  { id: "trash", name: "Trash", icon: <Trash2 size={15} /> },
];

const LABELS: { id: FolderId; name: string; color: string }[] = [
  { id: "label-clients", name: "Client Updates", color: "#6366F1" },
  { id: "label-invoices", name: "Invoices", color: "#10B981" },
  { id: "label-team", name: "Team", color: "#F59E0B" },
];

type FilterTab = "all" | "unread" | "starred";
type ChannelTab = "all" | Channel;

const CHANNEL_TABS: { id: ChannelTab; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "All", icon: <InboxIcon size={12} /> },
  { id: "email", label: "Email", icon: <Mail size={12} /> },
  { id: "slack", label: "Slack", icon: <Hash size={12} /> },
  { id: "chat", label: "Chat", icon: <MessageCircle size={12} /> },
  { id: "sms", label: "SMS", icon: <Smartphone size={12} /> },
  { id: "webhook", label: "Webhook", icon: <Webhook size={12} /> },
];

const PRIORITY_STYLES: Record<Priority, { label: string; bg: string; text: string }> = {
  urgent: { label: "Urgent", bg: "rgba(239,68,68,0.15)", text: "#FCA5A5" },
  high: { label: "High", bg: "rgba(245,158,11,0.15)", text: "#FCD34D" },
  normal: { label: "Normal", bg: "rgba(255,255,255,0.06)", text: "rgba(255,255,255,0.55)" },
};

const SENTIMENT_EMOJI: Record<Sentiment, string> = {
  positive: "😊",
  neutral: "😐",
  negative: "😟",
};

const SMART_REPLIES: Record<Intent, string[]> = {
  "Support request": [
    "Acknowledged — investigating now and will update shortly.",
    "Can you share more details (browser, steps to reproduce, screenshots)?",
    "I'll escalate this to our engineering team and get back within the hour.",
  ],
  "Sales inquiry": [
    "Thanks for reaching out — happy to set up a 30-min call this week.",
    "Sharing a tailored proposal and pricing now, give me a few minutes.",
    "Quick question: how many seats are you sizing for?",
  ],
  Partnership: [
    "Appreciate the intro — let's set up a call to explore fit.",
    "Could you share a one-pager on the proposed structure?",
    "Looping in our partnerships lead to take this forward.",
  ],
  "Billing question": [
    "Sending the invoice over within the next hour.",
    "Confirming the amount and PO — will follow up by EOD.",
    "Could you share the billing email and PO reference?",
  ],
  Notification: [
    "Acknowledged.",
    "Marking as resolved.",
    "Snoozing until tomorrow.",
  ],
};

const CHANNEL_ICON: Record<Channel, React.ReactNode> = {
  email: <Mail size={11} />,
  slack: <Hash size={11} />,
  chat: <MessageCircle size={11} />,
  sms: <Smartphone size={11} />,
  webhook: <Webhook size={11} />,
};

function initials(name: string): string {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function summarize(e: Email): string {
  const sentiment =
    e.aiSentiment === "negative"
      ? "frustrated"
      : e.aiSentiment === "positive"
      ? "engaged"
      : "neutral";
  return `${e.from.split(" ")[0]} (${sentiment}) — ${e.aiIntent.toLowerCase()}. ${e.body[0].slice(0, 140)}${e.body[0].length > 140 ? "…" : ""} Thread has ${e.body.length} messages; latest action pending from our side.`;
}

export default function InboxPage() {
  const [emails, setEmails] = useState<Email[]>(MOCK_EMAILS);
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_EMAILS[0].id);
  const [activeFolder, setActiveFolder] = useState<FolderId>("inbox");
  const [filter, setFilter] = useState<FilterTab>("all");
  const [channelTab, setChannelTab] = useState<ChannelTab>("all");
  const [query, setQuery] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [summaryDismissed, setSummaryDismissed] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(true);

  const selected = emails.find((e) => e.id === selectedId) ?? null;

  const filteredEmails = emails.filter((e) => {
    if (filter === "unread" && !e.unread) return false;
    if (filter === "starred" && !e.starred) return false;
    if (channelTab !== "all" && e.channel !== channelTab) return false;
    if (activeFolder === "starred" && !e.starred) return false;
    if (activeFolder === "label-clients" && e.label !== "Client Updates") return false;
    if (activeFolder === "label-invoices" && e.label !== "Invoices") return false;
    if (activeFolder === "label-team" && e.label !== "Team") return false;
    if (query) {
      const q = query.toLowerCase();
      return (
        e.from.toLowerCase().includes(q) ||
        e.subject.toLowerCase().includes(q) ||
        e.preview.toLowerCase().includes(q)
      );
    }
    return true;
  });

  function toggleStar(id: string) {
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, starred: !e.starred } : e)));
  }

  function selectEmail(id: string) {
    setSelectedId(id);
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, unread: false } : e)));
    setReplyBody("");
    setSummaryDismissed(false);
    setSummaryOpen(true);
  }

  function archiveSelected() {
    if (!selected) return;
    setEmails((prev) => prev.filter((e) => e.id !== selected.id));
    setSelectedId(null);
  }

  function deleteSelected() {
    if (!selected) return;
    setEmails((prev) => prev.filter((e) => e.id !== selected.id));
    setSelectedId(null);
  }

  function sendReply() {
    if (!replyBody.trim()) return;
    setReplyBody("");
  }

  function sendCompose() {
    if (!composeTo.trim() || !composeSubject.trim()) return;
    setComposeOpen(false);
    setComposeTo("");
    setComposeSubject("");
    setComposeBody("");
  }

  const unreadCount = emails.filter((e) => e.unread).length;
  const showSummary = selected && !summaryDismissed && selected.body.length >= 3;
  const smartReplies = selected ? SMART_REPLIES[selected.aiIntent] : [];

  return (
    <div className="flex h-[calc(100vh-56px)] w-full bg-[#0A0A0F] text-white">
      {/* Left sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-white/5 bg-[#0C0C12]">
        <div className="p-4">
          <button
            onClick={() => setComposeOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#6366F1] px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition hover:bg-[#5558E3]"
          >
            <Pencil size={14} />
            Compose
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 pb-4">
          <div className="space-y-0.5">
            {FOLDERS.map((f) => {
              const active = activeFolder === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFolder(f.id)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition ${
                    active
                      ? "bg-[#6366F1]/15 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className={active ? "text-[#6366F1]" : ""}>{f.icon}</span>
                    {f.name}
                  </span>
                  {f.count ? (
                    <span
                      className={`text-xs font-medium ${
                        active ? "text-[#6366F1]" : "text-white/40"
                      }`}
                    >
                      {f.count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="mt-6 px-3">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-white/40">
              <span>Labels</span>
              <button className="text-white/40 hover:text-white">
                <Plus size={12} />
              </button>
            </div>
          </div>
          <div className="space-y-0.5">
            {LABELS.map((l) => {
              const active = activeFolder === l.id;
              return (
                <button
                  key={l.id}
                  onClick={() => setActiveFolder(l.id)}
                  className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition ${
                    active
                      ? "bg-white/5 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span
                    className="h-2 w-2 rounded-sm"
                    style={{ background: l.color }}
                  />
                  {l.name}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-white/5 p-4 text-xs text-white/40">
          <div className="flex items-center gap-2">
            <Tag size={12} />
            Storage: 3.2 GB of 15 GB
          </div>
          <div className="mt-2 h-1 rounded-full bg-white/5">
            <div className="h-full w-[22%] rounded-full bg-[#6366F1]" />
          </div>
        </div>
      </aside>

      {/* Email list */}
      <section className="flex w-full max-w-md flex-col border-r border-white/5">
        <div className="border-b border-white/5 px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-semibold capitalize">
                {activeFolder.startsWith("label-")
                  ? LABELS.find((l) => l.id === activeFolder)?.name
                  : activeFolder}
              </h1>
              <p className="text-xs text-white/40">{unreadCount} unread</p>
            </div>
            <button className="rounded-md p-1.5 text-white/50 hover:bg-white/5 hover:text-white">
              <Filter size={14} />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
            <Search size={14} className="text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search across all channels"
              className="w-full bg-transparent text-sm text-white placeholder-white/30 outline-none"
            />
          </div>

          {/* Channel tabs */}
          <div className="mt-3 -mx-1 flex gap-0.5 overflow-x-auto px-1 pb-0.5">
            {CHANNEL_TABS.map((c) => {
              const active = channelTab === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setChannelTab(c.id)}
                  className={`flex flex-shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium transition ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/45 hover:bg-white/5 hover:text-white/80"
                  }`}
                >
                  <span className={active ? "text-[#6366F1]" : ""}>{c.icon}</span>
                  {c.label}
                </button>
              );
            })}
          </div>

          <div className="mt-2 flex gap-1 text-xs">
            {(["all", "unread", "starred"] as FilterTab[]).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`rounded-md px-3 py-1.5 capitalize transition ${
                  filter === t
                    ? "bg-[#6366F1] text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredEmails.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center text-white/40">
              <InboxIcon size={32} className="mb-3 opacity-40" />
              <p className="text-sm">No threads match this view.</p>
            </div>
          ) : (
            filteredEmails.map((e) => {
              const active = selectedId === e.id;
              const pri = PRIORITY_STYLES[e.aiPriority];
              return (
                <button
                  key={e.id}
                  onClick={() => selectEmail(e.id)}
                  className={`flex w-full gap-3 border-b border-white/5 px-4 py-3 text-left transition ${
                    active
                      ? "bg-[#6366F1]/10"
                      : e.unread
                      ? "bg-white/[0.02] hover:bg-white/5"
                      : "hover:bg-white/5"
                  }`}
                >
                  <div className="relative mt-0.5 flex-shrink-0">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white"
                      style={{ background: e.avatarColor }}
                    >
                      {initials(e.from)}
                    </div>
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0A0A0F] text-white/70 ring-1 ring-white/10">
                      {CHANNEL_ICON[e.channel]}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {e.unread && (
                        <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#6366F1]" />
                      )}
                      <span
                        className={`flex-1 truncate text-sm ${
                          e.unread ? "font-semibold text-white" : "text-white/80"
                        }`}
                      >
                        {e.from}
                      </span>
                      <span className="flex-shrink-0 text-[11px] text-white/40">
                        {e.time}
                      </span>
                    </div>
                    <div
                      className={`mt-0.5 truncate text-sm ${
                        e.unread ? "text-white" : "text-white/70"
                      }`}
                    >
                      {e.subject}
                    </div>
                    <div className="mt-0.5 truncate text-xs text-white/40">
                      {e.preview}
                    </div>

                    {/* AI triage badges */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-1">
                      <span
                        className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                        style={{ background: pri.bg, color: pri.text }}
                      >
                        {e.aiPriority === "urgent" && <AlertOctagon size={9} />}
                        {pri.label}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-white/60">
                        <Bot size={9} /> {e.aiIntent}
                      </span>
                      <span
                        className="inline-flex items-center rounded px-1 text-[10px]"
                        title={`Sentiment: ${e.aiSentiment}`}
                      >
                        {SENTIMENT_EMOJI[e.aiSentiment]}
                      </span>
                      {e.aiPriority === "urgent" && e.slaMinutes !== undefined && !e.resolved && (
                        <span className="inline-flex items-center gap-1 rounded bg-red-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-red-300">
                          <Timer size={9} />
                          {e.slaMinutes}m
                        </span>
                      )}
                      {e.label && (
                        <span
                          className="inline-block rounded px-1.5 py-0.5 text-[10px] font-medium"
                          style={{
                            background: "rgba(99,102,241,0.12)",
                            color: "#A5B4FC",
                          }}
                        >
                          {e.label}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    onClick={(ev) => {
                      ev.stopPropagation();
                      toggleStar(e.id);
                    }}
                    className="flex-shrink-0 cursor-pointer self-start p-1 text-white/30 hover:text-[#F59E0B]"
                    aria-label="toggle star"
                  >
                    <Star
                      size={14}
                      fill={e.starred ? "#F59E0B" : "none"}
                      stroke={e.starred ? "#F59E0B" : "currentColor"}
                    />
                  </span>
                </button>
              );
            })
          )}
        </div>
      </section>

      {/* Reading pane */}
      <section className="hidden flex-1 flex-col md:flex">
        {selected ? (
          <>
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-3">
              <div className="flex items-center gap-1">
                <button
                  onClick={archiveSelected}
                  className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-white/60 hover:bg-white/5 hover:text-white"
                >
                  <Archive size={14} />
                  Archive
                </button>
                <button
                  onClick={deleteSelected}
                  className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-white/60 hover:bg-white/5 hover:text-white"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
                <div className="mx-1 h-4 w-px bg-white/10" />
                <button className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-white/60 hover:bg-white/5 hover:text-white">
                  <Reply size={14} />
                  Reply
                </button>
                <button className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-white/60 hover:bg-white/5 hover:text-white">
                  <ReplyAll size={14} />
                  Reply all
                </button>
                <button className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-white/60 hover:bg-white/5 hover:text-white">
                  <Forward size={14} />
                  Forward
                </button>
              </div>
              <div className="flex items-center gap-2">
                {selected.aiPriority === "urgent" && selected.slaMinutes !== undefined && !selected.resolved && (
                  <span className="flex items-center gap-1.5 rounded-md bg-red-500/15 px-2 py-1 text-xs font-semibold text-red-300">
                    <Timer size={12} />
                    {selected.slaMinutes}min until SLA breach
                  </span>
                )}
                {selected.resolved && (
                  <span className="flex items-center gap-1.5 rounded-md bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-300">
                    ✓ SLA met
                  </span>
                )}
                <button className="rounded-md p-1.5 text-white/50 hover:bg-white/5 hover:text-white">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6">
              {/* AI Summary */}
              {showSummary && (
                <div className="mb-5 overflow-hidden rounded-lg border border-[#6366F1]/25 bg-gradient-to-br from-[#6366F1]/10 via-[#8B5CF6]/5 to-transparent">
                  <div className="flex items-center justify-between px-4 py-2.5">
                    <button
                      onClick={() => setSummaryOpen((v) => !v)}
                      className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A5B4FC]"
                    >
                      <Sparkles size={12} />
                      AI Summary
                      <ChevronDown
                        size={12}
                        className={`transition ${summaryOpen ? "" : "-rotate-90"}`}
                      />
                    </button>
                    <button
                      onClick={() => setSummaryDismissed(true)}
                      className="rounded p-1 text-white/40 hover:bg-white/5 hover:text-white"
                      aria-label="Dismiss summary"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  {summaryOpen && (
                    <p className="px-4 pb-3 text-sm leading-relaxed text-white/80">
                      {summarize(selected)}
                    </p>
                  )}
                </div>
              )}

              <h2 className="text-2xl font-semibold leading-tight text-white">
                {selected.subject}
              </h2>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span
                  className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
                  style={{
                    background: PRIORITY_STYLES[selected.aiPriority].bg,
                    color: PRIORITY_STYLES[selected.aiPriority].text,
                  }}
                >
                  {selected.aiPriority === "urgent" && <AlertOctagon size={10} />}
                  {PRIORITY_STYLES[selected.aiPriority].label}
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-white/5 px-2 py-0.5 text-[11px] font-medium text-white/65">
                  <Bot size={10} /> {selected.aiIntent}
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-white/5 px-2 py-0.5 text-[11px] text-white/65">
                  {SENTIMENT_EMOJI[selected.aiSentiment]} {selected.aiSentiment}
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-white/5 px-2 py-0.5 text-[11px] font-medium text-white/65 capitalize">
                  {CHANNEL_ICON[selected.channel]} {selected.channel}
                </span>
                {selected.label && (
                  <span
                    className="inline-block rounded px-2 py-0.5 text-[11px] font-medium"
                    style={{
                      background: "rgba(99,102,241,0.12)",
                      color: "#A5B4FC",
                    }}
                  >
                    {selected.label}
                  </span>
                )}
              </div>

              <div className="mt-5 flex items-start gap-3 border-b border-white/5 pb-5">
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                  style={{ background: selected.avatarColor }}
                >
                  {initials(selected.from)}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-white">
                      {selected.from}
                    </span>
                    <span className="text-xs text-white/40">
                      &lt;{selected.email}&gt;
                    </span>
                  </div>
                  <div className="text-xs text-white/40">
                    to me · {selected.date}
                  </div>
                </div>
                <button
                  onClick={() => toggleStar(selected.id)}
                  className="p-1 text-white/40 hover:text-[#F59E0B]"
                >
                  <Star
                    size={16}
                    fill={selected.starred ? "#F59E0B" : "none"}
                    stroke={selected.starred ? "#F59E0B" : "currentColor"}
                  />
                </button>
              </div>

              <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-white/85">
                {selected.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                <p className="pt-2 text-white/60">
                  Best,
                  <br />
                  {selected.from.split(" ")[0]}
                </p>
              </div>
            </div>

            {/* Reply area */}
            <div className="border-t border-white/5 bg-[#0C0C12] px-6 py-4">
              {/* Smart reply suggestions */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[#A5B4FC]">
                  <Sparkles size={11} /> Smart replies
                </span>
                {smartReplies.map((s) => (
                  <button
                    key={s}
                    onClick={() => setReplyBody(s)}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/75 transition hover:border-[#6366F1]/40 hover:bg-[#6366F1]/10 hover:text-white"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.02] focus-within:border-[#6366F1]/50">
                <textarea
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  placeholder={`Reply to ${selected.from.split(" ")[0]}…`}
                  rows={3}
                  className="w-full resize-none bg-transparent px-4 py-3 text-sm text-white placeholder-white/30 outline-none"
                />
                <div className="flex items-center justify-between border-t border-white/5 px-3 py-2">
                  <div className="flex gap-1">
                    <button className="rounded-md p-1.5 text-white/50 hover:bg-white/5 hover:text-white">
                      <Paperclip size={14} />
                    </button>
                    <button className="rounded-md p-1.5 text-white/50 hover:bg-white/5 hover:text-white">
                      <Sparkles size={14} />
                    </button>
                  </div>
                  <button
                    onClick={sendReply}
                    disabled={!replyBody.trim()}
                    className="flex items-center gap-1.5 rounded-md bg-[#6366F1] px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-[#5558E3] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Send size={12} />
                    Send
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-white/40">
            <InboxIcon size={48} className="mb-4 opacity-30" />
            <p className="text-base">Select a thread to read</p>
            <p className="mt-1 text-sm text-white/30">
              Or compose a new message to get started.
            </p>
          </div>
        )}
      </section>

      {/* Compose modal */}
      {composeOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[520px] w-full max-w-md flex-col rounded-xl border border-white/10 bg-[#0C0C12] shadow-2xl shadow-black/60">
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <Pencil size={14} className="text-[#6366F1]" />
              <span className="text-sm font-semibold text-white">New message</span>
            </div>
            <button
              onClick={() => setComposeOpen(false)}
              className="rounded p-1 text-white/50 hover:bg-white/5 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>

          <div className="flex flex-1 flex-col">
            <input
              value={composeTo}
              onChange={(e) => setComposeTo(e.target.value)}
              placeholder="To"
              className="border-b border-white/5 bg-transparent px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none"
            />
            <input
              value={composeSubject}
              onChange={(e) => setComposeSubject(e.target.value)}
              placeholder="Subject"
              className="border-b border-white/5 bg-transparent px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none"
            />
            <textarea
              value={composeBody}
              onChange={(e) => setComposeBody(e.target.value)}
              placeholder="Write your message…"
              className="flex-1 resize-none bg-transparent px-4 py-3 text-sm text-white placeholder-white/30 outline-none"
            />
          </div>

          <div className="flex items-center justify-between border-t border-white/5 px-4 py-3">
            <button
              onClick={() => {
                setComposeTo("");
                setComposeSubject("");
                setComposeBody("");
                setComposeOpen(false);
              }}
              className="text-xs text-white/50 hover:text-white"
            >
              Discard
            </button>
            <div className="flex items-center gap-2">
              <button className="rounded-md p-1.5 text-white/50 hover:bg-white/5 hover:text-white">
                <Paperclip size={14} />
              </button>
              <button
                onClick={sendCompose}
                disabled={!composeTo.trim() || !composeSubject.trim()}
                className="flex items-center gap-1.5 rounded-md bg-[#6366F1] px-4 py-1.5 text-sm font-medium text-white transition hover:bg-[#5558E3] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={12} />
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
