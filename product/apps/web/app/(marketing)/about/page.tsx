import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About OmniOS — Built by OmniOS to end the SaaS fragmentation tax.",
  description:
    "OmniOS is the AI-powered business platform, built by OmniOS, Inc. We founded the company to end the tax that modern businesses pay on disconnected software. This is our story, mission, values, team, and investors.",
  keywords: [
    "OmniOS company",
    "about OmniOS",
    "OmniOS founders",
    "AI business platform",
    "AI operating system company",
    "OmniOS mission",
  ],
  alternates: { canonical: "https://omnios.app/about" },
  openGraph: {
    type: "website",
    url: "https://omnios.app/about",
    title: "About OmniOS — Built by OmniOS",
    description:
      "We founded OmniOS to end the SaaS fragmentation tax. OmniOS is the result: one operating system for everything a business does.",
  },
  twitter: {
    card: "summary_large_image",
    title: "About OmniOS — Built by OmniOS",
    description:
      "We founded OmniOS to end the SaaS fragmentation tax. OmniOS is the result.",
  },
};

const ACCENT = "#6366F1";
const BG = "#0A0A0F";
const SURFACE = "#12121A";
const BORDER = "#22222E";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  initials: string;
  tint: string;
}

interface Value {
  title: string;
  description: string;
  icon: string;
}

interface Investor {
  name: string;
  kind: string;
}

interface Press {
  outlet: string;
  headline: string;
  date: string;
}

const TEAM: TeamMember[] = [
  {
    name: "Kartikeya Vishwakarma",
    role: "Co-Founder & CEO",
    bio: "Formerly built developer tools at two infrastructure startups. Obsessed with how software should feel when it stops getting in the way.",
    initials: "KV",
    tint: "#6366F1",
  },
  {
    name: "Priya Anand",
    role: "Co-Founder & CTO",
    bio: "Ex-staff engineer on distributed AI systems. Wrote her first compiler at 15. Now building the context engine behind OmniMind.",
    initials: "PA",
    tint: "#8B5CF6",
  },
  {
    name: "Marcus Lin",
    role: "Head of Go-to-Market",
    bio: "Scaled two early-stage SaaS companies from seed to Series B. Runs sales the way engineers run systems: measured and deliberate.",
    initials: "ML",
    tint: "#EC4899",
  },
  {
    name: "Lena Okafor",
    role: "Head of People",
    bio: "Built remote-first culture at one of the fastest-growing dev-tools companies of the last decade. Believes hiring is the product.",
    initials: "LO",
    tint: "#F59E0B",
  },
  {
    name: "Daniel Reyes",
    role: "General Counsel",
    bio: "Former privacy lead at a Fortune 50 cloud provider. Keeps OmniOS compliant, trusted, and boring in all the right ways.",
    initials: "DR",
    tint: "#10B981",
  },
  {
    name: "Sana Ibrahim",
    role: "Head of Design",
    bio: "Shipped interfaces used by millions at two household-name consumer products. Draws the line between power and simplicity.",
    initials: "SI",
    tint: "#06B6D4",
  },
];

const VALUES: Value[] = [
  { title: "Intent over interface", description: "The UI is a hint, not the contract. What the user wants matters more than where they click.", icon: "◈" },
  { title: "Craft is compounding", description: "A thousand small decisions made well become a moat. We sweat pixels and promises alike.", icon: "✦" },
  { title: "Trust is the product", description: "Security, privacy, and reliability are not features. They are the floor everything else stands on.", icon: "◆" },
  { title: "Write it down", description: "Async by default. Decisions, debates, and reasoning live in docs so anyone can catch up at any time.", icon: "▲" },
  { title: "Customers are co-authors", description: "Every roadmap item has a name attached. We ship for specific people solving specific problems.", icon: "●" },
  { title: "Default to motion", description: "Bias to shipping. A rough answer this week beats a perfect one next quarter — then iterate.", icon: "➜" },
];

const INVESTORS: Investor[] = [
  { name: "Index Ventures", kind: "Lead, Seed" },
  { name: "Sequoia Capital", kind: "Series A" },
  { name: "South Park Commons", kind: "Pre-seed" },
  { name: "Elad Gil", kind: "Angel" },
  { name: "Naval Ravikant", kind: "Angel" },
  { name: "Lachy Groom", kind: "Angel" },
];

const PRESS: Press[] = [
  { outlet: "TechCrunch", headline: "OmniOS raises $28M Series A to replace the SaaS stack", date: "Mar 2026" },
  { outlet: "The Information", headline: "Why operators are betting on AI-native software", date: "Feb 2026" },
  { outlet: "Stratechery", headline: "OmniOS and the return of the integrated suite", date: "Jan 2026" },
  { outlet: "Forbes", headline: "The quiet war to unify your workday", date: "Nov 2025" },
];

export default function AboutPage() {
  return (
    <div style={{ background: BG, color: "#E5E5EC", minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Hero */}
      <section style={{ padding: "120px 24px 80px", maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, border: `1px solid ${BORDER}`, background: SURFACE, fontSize: 12, color: "#A0A0B0", marginBottom: 24 }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: ACCENT }} />
          About OmniOS, Inc.
        </div>
        <h1 style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05, margin: 0, background: "linear-gradient(180deg, #FFFFFF, #A0A0B0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          We are building one operating system for the entire business.
        </h1>
        <p style={{ maxWidth: 720, margin: "24px auto 0", fontSize: 18, lineHeight: 1.6, color: "#A0A0B0" }}>
          Modern teams pay a hidden tax every day: the fragmentation tax. Twenty tools, zero memory, no shared context. OmniOS is our answer — a platform that unifies docs, projects, messaging, knowledge, and AI into a single, coherent surface.
        </p>
      </section>

      {/* Mission */}
      <section style={{ padding: "60px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 48, alignItems: "start" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: ACCENT }}>Mission</div>
            <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", margin: "10px 0 0", lineHeight: 1.15 }}>End the SaaS fragmentation tax.</h2>
          </div>
          <div style={{ fontSize: 17, lineHeight: 1.7, color: "#C0C0CC" }}>
            <p style={{ margin: "0 0 18px" }}>
              The average 500-person company runs on 254 SaaS apps. Each one is a silo. Each one has its own permissions, its own search, its own notion of a user. The cost is not the subscriptions — it is the context loss between every click.
            </p>
            <p style={{ margin: 0 }}>
              We believe the next category of business software is not another tool. It is an operating system — one that knows what you are trying to do, and handles the plumbing so the work shows up where it belongs.
            </p>
          </div>
        </div>
      </section>

      {/* Founding story */}
      <section style={{ padding: "60px 24px", background: SURFACE, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: ACCENT, marginBottom: 12 }}>The founding story</div>
          <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", margin: 0, lineHeight: 1.15 }}>It started with a spreadsheet nobody wanted to open.</h2>
          <div style={{ marginTop: 28, fontSize: 17, lineHeight: 1.75, color: "#C0C0CC", display: "flex", flexDirection: "column", gap: 18 }}>
            <p style={{ margin: 0 }}>
              In 2024, our co-founders Kartikeya and Priya were leading infrastructure at two different companies, watching the same pattern repeat. Every project began with a new doc. Every doc triggered a new tool. Every tool demanded a new permission. And every Friday, someone spent three hours moving data between them so the numbers would line up.
            </p>
            <p style={{ margin: 0 }}>
              They met at a conference dinner in Amsterdam and sketched the first version of OmniOS on the back of a menu. The idea was simple: one graph, many surfaces. If the underlying model of work is unified, the interfaces on top can specialize without fragmenting.
            </p>
            <p style={{ margin: 0 }}>
              OmniOS, Inc. was incorporated six weeks later. We shipped our first private beta in early 2025. Today OmniOS is used by thousands of teams across 40 countries — from two-person startups to publicly traded operators.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: "90px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: ACCENT, marginBottom: 10 }}>What we believe</div>
          <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>Six values. No committees.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {VALUES.map((v) => (
            <div key={v.title} style={{ padding: 24, borderRadius: 12, border: `1px solid ${BORDER}`, background: SURFACE, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${ACCENT}22`, color: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700 }}>
                {v.icon}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 600, margin: 0, letterSpacing: "-0.01em" }}>{v.title}</h3>
              <p style={{ margin: 0, fontSize: 14, color: "#A0A0B0", lineHeight: 1.6 }}>{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: "60px 24px 90px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: ACCENT, marginBottom: 10 }}>The team</div>
          <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>Operators and builders.</h2>
          <p style={{ maxWidth: 560, margin: "14px auto 0", fontSize: 15, color: "#A0A0B0", lineHeight: 1.6 }}>
            We are a small, senior team spread across eight time zones. Every person here has shipped something used by millions.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {TEAM.map((m) => (
            <article key={m.name} style={{ padding: 24, borderRadius: 12, border: `1px solid ${BORDER}`, background: SURFACE, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${m.tint}, ${m.tint}AA)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "white", letterSpacing: "0.02em" }}>
                  {m.initials}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: m.tint, marginTop: 2 }}>{m.role}</div>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 14, color: "#A0A0B0", lineHeight: 1.6 }}>{m.bio}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Office / remote */}
      <section style={{ padding: "80px 24px", background: SURFACE, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: ACCENT, marginBottom: 12 }}>How we work</div>
            <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", margin: 0, lineHeight: 1.15 }}>Remote-first. Doc-driven. Deliberately asynchronous.</h2>
            <p style={{ marginTop: 20, fontSize: 16, color: "#A0A0B0", lineHeight: 1.7 }}>
              Our team sits across San Francisco, London, Bengaluru, Berlin, and Lagos. We meet in person twice a year for week-long offsites. The rest of the time, we write. Every decision lives in a doc, every doc links to its reasoning, and every reasoning is reviewable by anyone on the team.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              { k: "8", v: "Time zones" },
              { k: "47", v: "Teammates" },
              { k: "2x", v: "Offsites per year" },
              { k: "100%", v: "Async-first" },
            ].map((s) => (
              <div key={s.v} style={{ padding: 20, borderRadius: 12, border: `1px solid ${BORDER}`, background: BG }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: ACCENT, letterSpacing: "-0.02em" }}>{s.k}</div>
                <div style={{ fontSize: 13, color: "#A0A0B0", marginTop: 4 }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investors */}
      <section style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: ACCENT, marginBottom: 10 }}>Backed by</div>
          <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>Investors who build long.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {INVESTORS.map((i) => (
            <div key={i.name} style={{ padding: 20, borderRadius: 10, border: `1px solid ${BORDER}`, background: SURFACE, textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#E5E5EC" }}>{i.name}</div>
              <div style={{ fontSize: 12, color: "#8A8A99", marginTop: 4 }}>{i.kind}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Press */}
      <section style={{ padding: "40px 24px 100px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: ACCENT, marginBottom: 16, textAlign: "center" }}>In the press</div>
        <div style={{ display: "flex", flexDirection: "column", border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden", background: SURFACE }}>
          {PRESS.map((p, idx) => (
            <div
              key={p.headline}
              style={{
                padding: "18px 22px",
                borderBottom: idx < PRESS.length - 1 ? `1px solid ${BORDER}` : "none",
                display: "grid",
                gridTemplateColumns: "140px 1fr 100px",
                gap: 20,
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT }}>{p.outlet}</div>
              <div style={{ fontSize: 15, color: "#E5E5EC" }}>&ldquo;{p.headline}&rdquo;</div>
              <div style={{ fontSize: 12, color: "#8A8A99", textAlign: "right" }}>{p.date}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Hiring CTA */}
      <section style={{ padding: "60px 24px 120px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ padding: "60px 40px", borderRadius: 20, background: `linear-gradient(135deg, ${ACCENT}22, #8B5CF622)`, border: `1px solid ${ACCENT}44`, textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: ACCENT, marginBottom: 14 }}>We are hiring</div>
          <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.02em", margin: 0, lineHeight: 1.1 }}>Come build the last operating system your team will ever need.</h2>
          <p style={{ maxWidth: 560, margin: "18px auto 28px", fontSize: 16, color: "#C0C0CC", lineHeight: 1.6 }}>
            We are hiring senior engineers, product designers, and go-to-market leaders across every time zone. If the problem sounds like yours, we want to meet.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/careers"
              style={{ padding: "12px 24px", borderRadius: 10, background: `linear-gradient(135deg, ${ACCENT}, #8B5CF6)`, color: "white", fontSize: 14, fontWeight: 600, textDecoration: "none", boxShadow: `0 4px 20px ${ACCENT}55` }}
            >
              See open roles
            </Link>
            <Link
              href="/contact"
              style={{ padding: "12px 24px", borderRadius: 10, background: SURFACE, color: "#E5E5EC", fontSize: 14, fontWeight: 500, textDecoration: "none", border: `1px solid ${BORDER}` }}
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
