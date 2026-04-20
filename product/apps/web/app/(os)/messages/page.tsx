"use client";

import { useState } from "react";
import {
  Settings,
  Hash,
  Plus,
  Search,
  Smile,
  Paperclip,
  Send,
  MessageSquare,
  Sparkles,
  ChevronDown,
  Pin,
  Bell,
  Users,
  X,
  Circle,
  Bookmark,
  AtSign,
  Reply,
} from "lucide-react";

interface Reaction {
  emoji: string;
  count: number;
}

interface ThreadReply {
  id: string;
  author: string;
  initials: string;
  color: string;
  time: string;
  text: string;
}

interface Message {
  id: string;
  author: string;
  initials: string;
  color: string;
  time: string;
  text?: string;
  code?: { lang: string; content: string };
  reactions?: Reaction[];
  replies?: ThreadReply[];
  pinned?: boolean;
}

interface Channel {
  id: string;
  name: string;
  unread: number;
  description: string;
  members: number;
  kind: "channel" | "ai";
}

interface DM {
  id: string;
  name: string;
  initials: string;
  color: string;
  online: boolean;
}

const CHANNELS: Channel[] = [
  { id: "omnimind", name: "OmniMind", unread: 0, description: "Context-aware assistant for your workspace", members: 1, kind: "ai" },
  { id: "general", name: "general", unread: 0, description: "Company-wide announcements and chatter", members: 42, kind: "channel" },
  { id: "engineering", name: "engineering", unread: 3, description: "Shipping the product. PRs, incidents, deploys.", members: 14, kind: "channel" },
  { id: "sales", name: "sales", unread: 1, description: "Pipeline, deals, customer wins", members: 9, kind: "channel" },
  { id: "product", name: "product", unread: 0, description: "Roadmap, specs, priorities", members: 11, kind: "channel" },
  { id: "design", name: "design", unread: 0, description: "Mocks, critiques, design system", members: 6, kind: "channel" },
  { id: "announcements", name: "announcements", unread: 0, description: "Read-only company updates", members: 42, kind: "channel" },
];

const DMS: DM[] = [
  { id: "sarah", name: "Sarah Chen", initials: "SC", color: "bg-rose-500", online: true },
  { id: "marcus", name: "Marcus Alvarez", initials: "MA", color: "bg-amber-500", online: true },
  { id: "priya", name: "Priya Patel", initials: "PP", color: "bg-emerald-500", online: false },
  { id: "jordan", name: "Jordan Kim", initials: "JK", color: "bg-sky-500", online: true },
  { id: "lee", name: "Lee Nakamura", initials: "LN", color: "bg-fuchsia-500", online: false },
];

const ENGINEERING_MESSAGES: Message[] = [
  {
    id: "m1",
    author: "Sarah Chen",
    initials: "SC",
    color: "bg-rose-500",
    time: "9:02 AM",
    text: "Morning team. Sprint 24 kicks off today. Priorities: (1) auth rewrite, (2) workspace orchestrator ship, (3) billing webhook reliability.",
    reactions: [{ emoji: "👍", count: 4 }, { emoji: "🚀", count: 2 }],
    pinned: true,
  },
  {
    id: "m2",
    author: "Marcus Alvarez",
    initials: "MA",
    color: "bg-amber-500",
    time: "9:14 AM",
    text: "Opened #482 for the auth rewrite. Migrated away from the legacy session store. Needs two reviewers before merge.",
    reactions: [{ emoji: "✅", count: 2 }],
    replies: [
      { id: "r1", author: "Priya Patel", initials: "PP", color: "bg-emerald-500", time: "9:20 AM", text: "Taking a look now." },
      { id: "r2", author: "Jordan Kim", initials: "JK", color: "bg-sky-500", time: "9:27 AM", text: "I'll grab the second review. Quick question on the refresh token rotation logic." },
      { id: "r3", author: "Marcus Alvarez", initials: "MA", color: "bg-amber-500", time: "9:31 AM", text: "It rotates on every refresh call and invalidates the prior jti. Left inline comments." },
    ],
  },
  {
    id: "m3",
    author: "Priya Patel",
    initials: "PP",
    color: "bg-emerald-500",
    time: "9:28 AM",
    text: "Heads up — the staging deploy at 02:14 UTC failed health checks on the orchestrator pod. I rolled back. Root cause looks like a missing env var for the new queue binding.",
    reactions: [{ emoji: "👀", count: 3 }],
  },
  {
    id: "m4",
    author: "Jordan Kim",
    initials: "JK",
    color: "bg-sky-500",
    time: "9:33 AM",
    text: "Repro on the queue binding. Minimal fix:",
    code: {
      lang: "typescript",
      content: `// packages/workspace-orchestrator/src/queue.ts
const bindingName = process.env.QUEUE_BINDING_NAME;
if (!bindingName) {
  throw new Error("QUEUE_BINDING_NAME is required");
}
return env.QUEUE.bind(bindingName);`,
    },
    reactions: [{ emoji: "🔥", count: 2 }, { emoji: "✅", count: 2 }],
  },
  {
    id: "m5",
    author: "Lee Nakamura",
    initials: "LN",
    color: "bg-fuchsia-500",
    time: "9:41 AM",
    text: "Billing webhook reliability: I added idempotency keys keyed off Stripe event id, plus a dead-letter queue for anything that fails 5 retries. Dashboard wired up in Grafana.",
    reactions: [{ emoji: "🙌", count: 3 }],
  },
  {
    id: "m6",
    author: "Sarah Chen",
    initials: "SC",
    color: "bg-rose-500",
    time: "9:47 AM",
    text: "Perfect. Can we get a Loom walkthrough of the DLQ replay flow before Friday? Support team will own first-line triage.",
  },
  {
    id: "m7",
    author: "Lee Nakamura",
    initials: "LN",
    color: "bg-fuchsia-500",
    time: "9:49 AM",
    text: "On it. Will post by EOD Thursday.",
    reactions: [{ emoji: "👍", count: 1 }],
  },
  {
    id: "m8",
    author: "Marcus Alvarez",
    initials: "MA",
    color: "bg-amber-500",
    time: "10:02 AM",
    text: "Quick perf note — the new orchestrator cut p95 task dispatch from 340ms to 92ms under the load test. Full report in the thread.",
    reactions: [{ emoji: "📈", count: 5 }, { emoji: "🔥", count: 3 }],
    replies: [
      { id: "r4", author: "Sarah Chen", initials: "SC", color: "bg-rose-500", time: "10:05 AM", text: "That's a huge win. Let's add this to the next customer update." },
      { id: "r5", author: "Priya Patel", initials: "PP", color: "bg-emerald-500", time: "10:09 AM", text: "Numbers held at 10k concurrent workspaces. We have headroom." },
    ],
  },
  {
    id: "m9",
    author: "Priya Patel",
    initials: "PP",
    color: "bg-emerald-500",
    time: "10:15 AM",
    text: "Design review for the new onboarding at 11. @Jordan can you join? I want eng sign-off before we commit to the state machine.",
  },
  {
    id: "m10",
    author: "Jordan Kim",
    initials: "JK",
    color: "bg-sky-500",
    time: "10:17 AM",
    text: "Will be there.",
  },
  {
    id: "m11",
    author: "Sarah Chen",
    initials: "SC",
    color: "bg-rose-500",
    time: "10:24 AM",
    text: "Reminder: incident retro for the 02:14 staging failure is documented in Notion. Three action items assigned. Please finish by Wednesday.",
    reactions: [{ emoji: "📝", count: 2 }],
  },
  {
    id: "m12",
    author: "Marcus Alvarez",
    initials: "MA",
    color: "bg-amber-500",
    time: "10:38 AM",
    text: "Auth PR #482 is green. Both approvals in. Merging after I verify the migration script on a snapshot of prod.",
    reactions: [{ emoji: "✅", count: 4 }],
  },
  {
    id: "m13",
    author: "Lee Nakamura",
    initials: "LN",
    color: "bg-fuchsia-500",
    time: "10:51 AM",
    text: "Anyone seen flaky CI on the integration suite this morning? Third time I've seen the postgres container timeout.",
  },
  {
    id: "m14",
    author: "Jordan Kim",
    initials: "JK",
    color: "bg-sky-500",
    time: "10:53 AM",
    text: "Yes — GitHub runner region issue. Retrying usually clears it. I'll pin a status update once they post a fix.",
    reactions: [{ emoji: "🙏", count: 2 }],
  },
  {
    id: "m15",
    author: "Priya Patel",
    initials: "PP",
    color: "bg-emerald-500",
    time: "11:06 AM",
    text: "Design review done. State machine approved with one change: we collapse steps 3 and 4 into a single screen. I'll update the spec.",
    replies: [
      { id: "r6", author: "Jordan Kim", initials: "JK", color: "bg-sky-500", time: "11:09 AM", text: "Makes sense. Telemetry showed drop-off at step 4 anyway." },
    ],
  },
  {
    id: "m16",
    author: "Sarah Chen",
    initials: "SC",
    color: "bg-rose-500",
    time: "11:22 AM",
    text: "Heads up — board meeting Thursday. I'll need the latency chart and the cost-per-workspace breakdown. @Marcus @Lee.",
    reactions: [{ emoji: "👍", count: 2 }],
  },
  {
    id: "m17",
    author: "Marcus Alvarez",
    initials: "MA",
    color: "bg-amber-500",
    time: "11:30 AM",
    text: "Covered. I'll have a clean export by Wednesday noon.",
  },
  {
    id: "m18",
    author: "Lee Nakamura",
    initials: "LN",
    color: "bg-fuchsia-500",
    time: "11:34 AM",
    text: "Same. Cost numbers are looking healthier after we moved the cold tier to R2.",
    reactions: [{ emoji: "💰", count: 3 }],
  },
  {
    id: "m19",
    author: "Jordan Kim",
    initials: "JK",
    color: "bg-sky-500",
    time: "11:48 AM",
    text: "Small thing — I refactored the error handling in the API gateway. Removed three layers of nested try/catch. Net ~80 lines deleted.",
    code: {
      lang: "typescript",
      content: `// apps/api/src/gateway.ts
export const handle = async (req: Request): Promise<Response> => {
  const result = await route(req).catch(toApiError);
  return formatResponse(result);
};`,
    },
    reactions: [{ emoji: "🧹", count: 4 }, { emoji: "👍", count: 2 }],
  },
  {
    id: "m20",
    author: "Sarah Chen",
    initials: "SC",
    color: "bg-rose-500",
    time: "12:01 PM",
    text: "Great morning everyone. Lunch break. Back at 1.",
    reactions: [{ emoji: "🥪", count: 5 }],
  },
  {
    id: "m21",
    author: "Priya Patel",
    initials: "PP",
    color: "bg-emerald-500",
    time: "12:44 PM",
    text: "Posted the updated onboarding spec in #product. Engineering estimates by Tuesday please.",
  },
];

const OMNIMIND_MESSAGES: Message[] = [
  {
    id: "o1",
    author: "OmniMind",
    initials: "OM",
    color: "bg-gradient-to-br from-indigo-500 to-fuchsia-500",
    time: "8:55 AM",
    text: "Good morning. Overnight summary: 1 staging incident (resolved, rollback at 02:31 UTC), 4 PRs merged, 2 PRs awaiting review. The auth rewrite (#482) is your highest-leverage review today.",
  },
  {
    id: "o2",
    author: "OmniMind",
    initials: "OM",
    color: "bg-gradient-to-br from-indigo-500 to-fuchsia-500",
    time: "9:30 AM",
    text: "Context signal: three people mentioned the queue binding env var. I drafted a checklist for required env vars on the orchestrator deploy. Want me to post it to #engineering?",
    reactions: [{ emoji: "✅", count: 1 }],
  },
  {
    id: "o3",
    author: "OmniMind",
    initials: "OM",
    color: "bg-gradient-to-br from-indigo-500 to-fuchsia-500",
    time: "10:30 AM",
    text: "Sprint 24 health: 6 of 14 tasks in-flight, 0 blocked, 1 at risk (billing DLQ walkthrough, due Thursday). Velocity is tracking 12% above the last sprint.",
  },
  {
    id: "o4",
    author: "OmniMind",
    initials: "OM",
    color: "bg-gradient-to-br from-indigo-500 to-fuchsia-500",
    time: "11:45 AM",
    text: "Heads up for Thursday's board meeting: I can assemble the latency chart from the load-test run Marcus posted, and the cost-per-workspace breakdown from Lee's R2 migration report. Say the word.",
  },
];

export default function MessagesPage() {
  const [selectedChannelId, setSelectedChannelId] = useState<string>("engineering");
  const [threadMessageId, setThreadMessageId] = useState<string | null>(null);
  const [draft, setDraft] = useState<string>("");

  const selectedChannel = CHANNELS.find((c) => c.id === selectedChannelId) ?? CHANNELS[1];
  const messages: Message[] =
    selectedChannelId === "omnimind" ? OMNIMIND_MESSAGES : selectedChannelId === "engineering" ? ENGINEERING_MESSAGES : [];

  const threadMessage = messages.find((m) => m.id === threadMessageId) ?? null;

  const handleSend = (): void => {
    if (!draft.trim()) return;
    setDraft("");
  };

  return (
    <div className="flex h-screen w-full bg-[#0A0A0F] text-white">
      <aside className="flex w-72 shrink-0 flex-col border-r border-white/5 bg-[#0D0D14]">
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-4">
          <div>
            <h1 className="text-sm font-semibold tracking-tight">OmniOS</h1>
            <p className="mt-0.5 text-[11px] text-white/40">karvifi · Pro plan</p>
          </div>
          <button className="rounded-md p-1.5 text-white/50 transition hover:bg-white/5 hover:text-white">
            <Settings size={16} />
          </button>
        </div>

        <div className="px-3 pt-4">
          <button
            onClick={() => {
              setSelectedChannelId("omnimind");
              setThreadMessageId(null);
            }}
            className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition ${
              selectedChannelId === "omnimind"
                ? "bg-gradient-to-r from-indigo-500/20 to-fuchsia-500/10 ring-1 ring-indigo-500/30"
                : "hover:bg-white/5"
            }`}
          >
            <div className="relative flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-fuchsia-500">
              <Sparkles size={13} />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-fuchsia-400 ring-2 ring-[#0D0D14]" />
            </div>
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-medium">OmniMind</span>
              <span className="text-[10px] text-white/40">AI · context-aware</span>
            </div>
            <Pin size={11} className="text-white/30" />
          </button>
        </div>

        <div className="mt-5 px-3">
          <div className="mb-1 flex items-center justify-between px-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
            <span className="inline-flex items-center gap-1">
              <ChevronDown size={11} /> Channels
            </span>
            <button className="rounded p-0.5 hover:bg-white/5 hover:text-white">
              <Plus size={12} />
            </button>
          </div>
          <div className="flex flex-col gap-0.5">
            {CHANNELS.filter((c) => c.kind === "channel").map((ch) => {
              const active = selectedChannelId === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => {
                    setSelectedChannelId(ch.id);
                    setThreadMessageId(null);
                  }}
                  className={`flex items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition ${
                    active ? "bg-indigo-500/15 text-white ring-1 ring-indigo-500/30" : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <Hash size={13} className="text-white/40" />
                    <span className={ch.unread > 0 && !active ? "font-semibold text-white" : ""}>{ch.name}</span>
                  </span>
                  {ch.unread > 0 && (
                    <span className="rounded-full bg-indigo-500 px-1.5 py-0.5 text-[10px] font-semibold">{ch.unread}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 px-3">
          <div className="mb-1 flex items-center justify-between px-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
            <span className="inline-flex items-center gap-1">
              <ChevronDown size={11} /> Direct Messages
            </span>
            <button className="rounded p-0.5 hover:bg-white/5 hover:text-white">
              <Plus size={12} />
            </button>
          </div>
          <div className="flex flex-col gap-0.5">
            {DMS.map((dm) => (
              <button
                key={dm.id}
                className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
              >
                <div className="relative">
                  <div className={`flex h-5 w-5 items-center justify-center rounded text-[10px] font-semibold ${dm.color}`}>
                    {dm.initials}
                  </div>
                  <span
                    className={`absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-full ring-2 ring-[#0D0D14] ${
                      dm.online ? "bg-emerald-400" : "bg-white/20"
                    }`}
                  />
                </div>
                <span>{dm.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto border-t border-white/5 p-3">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 px-3 py-2 text-xs font-medium text-white/60 transition hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-white">
            <Plus size={13} /> New channel
          </button>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-white/5 px-6 py-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {selectedChannel.kind === "ai" ? (
                <Sparkles size={16} className="text-fuchsia-400" />
              ) : (
                <Hash size={16} className="text-white/60" />
              )}
              <h2 className="truncate text-base font-semibold">{selectedChannel.name}</h2>
              <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-white/50">
                <Users size={10} className="mr-1 inline" />
                {selectedChannel.members}
              </span>
            </div>
            <p className="mt-0.5 truncate text-xs text-white/45">{selectedChannel.description}</p>
          </div>
          <div className="flex items-center gap-1">
            <button className="rounded-md p-2 text-white/60 transition hover:bg-white/5 hover:text-white">
              <Bell size={15} />
            </button>
            <button className="rounded-md p-2 text-white/60 transition hover:bg-white/5 hover:text-white">
              <Bookmark size={15} />
            </button>
            <button className="rounded-md p-2 text-white/60 transition hover:bg-white/5 hover:text-white">
              <Search size={15} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center text-sm text-white/40">
              No messages in this channel yet.
            </div>
          )}
          <div className="flex flex-col gap-5">
            {messages.map((m) => (
              <MessageRow
                key={m.id}
                message={m}
                onOpenThread={() => setThreadMessageId(m.id)}
              />
            ))}
          </div>
        </div>

        <div className="border-t border-white/5 px-6 py-4">
          <div className="rounded-xl border border-white/10 bg-[#12121A] focus-within:border-indigo-500/60 focus-within:ring-2 focus-within:ring-indigo-500/20">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Message #${selectedChannel.name}`}
              rows={2}
              className="block w-full resize-none bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none"
            />
            <div className="flex items-center justify-between border-t border-white/5 px-3 py-2">
              <div className="flex items-center gap-1 text-white/50">
                <button className="rounded p-1.5 transition hover:bg-white/5 hover:text-white">
                  <Paperclip size={15} />
                </button>
                <button className="rounded p-1.5 transition hover:bg-white/5 hover:text-white">
                  <Smile size={15} />
                </button>
                <button className="rounded p-1.5 transition hover:bg-white/5 hover:text-white">
                  <AtSign size={15} />
                </button>
              </div>
              <button
                onClick={handleSend}
                disabled={!draft.trim()}
                className="inline-flex items-center gap-1.5 rounded-md bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
              >
                Send <Send size={12} />
              </button>
            </div>
          </div>
          <p className="mt-1.5 text-[10px] text-white/30">Enter to send · Shift+Enter for new line</p>
        </div>
      </main>

      {threadMessage && (
        <aside className="flex w-96 shrink-0 flex-col border-l border-white/5 bg-[#0D0D14]">
          <header className="flex items-center justify-between border-b border-white/5 px-4 py-3">
            <div>
              <h3 className="text-sm font-semibold">Thread</h3>
              <p className="mt-0.5 text-[11px] text-white/40">#{selectedChannel.name}</p>
            </div>
            <button
              onClick={() => setThreadMessageId(null)}
              className="rounded-md p-1.5 text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              <X size={15} />
            </button>
          </header>
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <MessageRow message={threadMessage} onOpenThread={() => {}} compact />
            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-[11px] text-white/40">
                {threadMessage.replies?.length ?? 0} repl{(threadMessage.replies?.length ?? 0) === 1 ? "y" : "ies"}
              </span>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <div className="flex flex-col gap-4">
              {threadMessage.replies?.map((r) => (
                <div key={r.id} className="flex gap-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-semibold ${r.color}`}>
                    {r.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold">{r.author}</span>
                      <span className="text-[10px] text-white/40">{r.time}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-white/80">{r.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-white/5 p-3">
            <div className="rounded-lg border border-white/10 bg-[#12121A] focus-within:border-indigo-500/60">
              <textarea
                placeholder="Reply..."
                rows={2}
                className="block w-full resize-none bg-transparent px-3 py-2 text-sm placeholder:text-white/30 focus:outline-none"
              />
              <div className="flex items-center justify-end border-t border-white/5 px-2 py-1.5">
                <button className="inline-flex items-center gap-1.5 rounded-md bg-indigo-500 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-indigo-400">
                  Reply <Send size={11} />
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

interface MessageRowProps {
  message: Message;
  onOpenThread: () => void;
  compact?: boolean;
}

function MessageRow({ message, onOpenThread, compact = false }: MessageRowProps) {
  return (
    <div className={`group relative flex gap-3 rounded-lg px-2 py-1.5 transition hover:bg-white/[0.02] ${message.pinned ? "ring-1 ring-amber-500/10" : ""}`}>
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-xs font-semibold ${message.color}`}>
        {message.initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-white">{message.author}</span>
          <span className="text-[10px] text-white/40">{message.time}</span>
          {message.pinned && (
            <span className="inline-flex items-center gap-1 rounded-sm bg-amber-500/10 px-1 py-0.5 text-[9px] font-medium text-amber-300">
              <Pin size={9} /> Pinned
            </span>
          )}
        </div>
        {message.text && <p className="mt-0.5 whitespace-pre-wrap text-[13.5px] leading-relaxed text-white/85">{message.text}</p>}
        {message.code && (
          <div className="mt-2 overflow-hidden rounded-lg border border-white/10 bg-[#06060A]">
            <div className="flex items-center justify-between border-b border-white/5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-white/40">
              <span>{message.code.lang}</span>
              <Circle size={4} className="fill-white/20 text-white/20" />
            </div>
            <pre className="overflow-x-auto px-3 py-2.5 font-mono text-[12px] leading-relaxed text-emerald-300/90">
              <code>{message.code.content}</code>
            </pre>
          </div>
        )}
        {message.reactions && message.reactions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {message.reactions.map((r) => (
              <button
                key={r.emoji}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11px] text-white/80 transition hover:border-indigo-500/50 hover:bg-indigo-500/10"
              >
                <span>{r.emoji}</span>
                <span className="font-medium">{r.count}</span>
              </button>
            ))}
            <button className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.02] px-1.5 py-0.5 text-[11px] text-white/50 opacity-0 transition hover:bg-white/5 hover:text-white group-hover:opacity-100">
              <Smile size={11} />
            </button>
          </div>
        )}
        {!compact && message.replies && message.replies.length > 0 && (
          <button
            onClick={onOpenThread}
            className="mt-2 inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[11px] font-medium text-indigo-300 transition hover:bg-indigo-500/10"
          >
            <Reply size={11} />
            {message.replies.length} {message.replies.length === 1 ? "reply" : "replies"}
            <span className="text-white/40">· View thread</span>
          </button>
        )}
      </div>
      {!compact && (
        <div className="absolute right-3 top-1 hidden items-center gap-0.5 rounded-md border border-white/10 bg-[#12121A] px-0.5 py-0.5 shadow-lg group-hover:flex">
          <button className="rounded p-1 text-white/60 hover:bg-white/5 hover:text-white" title="React">
            <Smile size={13} />
          </button>
          <button
            onClick={onOpenThread}
            className="rounded p-1 text-white/60 hover:bg-white/5 hover:text-white"
            title="Reply in thread"
          >
            <MessageSquare size={13} />
          </button>
          <button className="rounded p-1 text-white/60 hover:bg-white/5 hover:text-white" title="Bookmark">
            <Bookmark size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
