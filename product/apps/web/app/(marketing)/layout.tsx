import type { ReactNode } from "react";
import Link from "next/link";

interface MarketingLayoutProps {
  children: ReactNode;
}

interface DropdownLinkProps {
  href: string;
  label: string;
  caption?: string;
  highlight?: boolean;
}

function DropdownLink({ href, label, caption, highlight }: DropdownLinkProps) {
  return (
    <Link
      href={href}
      className={`block rounded-lg px-3 py-2 text-sm transition ${
        highlight
          ? "text-[#D4AF37] hover:bg-[#D4AF37]/5"
          : "text-white/80 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className="font-medium">{label}</span>
      {caption ? (
        <span className="mt-0.5 block text-xs text-white/40">{caption}</span>
      ) : null}
    </Link>
  );
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white antialiased">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0A0F]/80 backdrop-blur-xl">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6"
        >
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold tracking-tight"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-xs font-bold text-white">
              O
            </span>
            <span>OmniOS</span>
          </Link>

          <ul className="hidden items-center gap-7 text-sm text-white/70 md:flex">
            <li>
              <Link href="/features" className="transition-colors hover:text-white">
                Features
              </Link>
            </li>

            <li className="group relative">
              <button
                type="button"
                aria-haspopup="true"
                className="inline-flex items-center gap-1 transition-colors hover:text-white group-focus-within:text-white group-hover:text-white"
              >
                Compare
                <svg
                  aria-hidden="true"
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  className="transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
                >
                  <path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="invisible absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="rounded-xl border border-white/10 bg-[#0A0A0F]/95 p-2 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                  <DropdownLink href="/compare" label="vs All competitors" caption="Side-by-side matrix" />
                  <DropdownLink href="/compare/notion" label="vs Notion" />
                  <DropdownLink href="/compare/salesforce" label="vs Salesforce" />
                  <DropdownLink href="/compare/hubspot" label="vs HubSpot" />
                  <DropdownLink href="/compare/airtable" label="vs Airtable" />
                  <DropdownLink href="/compare/asana" label="vs Asana" />
                </div>
              </div>
            </li>

            <li className="group relative">
              <button
                type="button"
                aria-haspopup="true"
                className="inline-flex items-center gap-1 transition-colors hover:text-white group-focus-within:text-white group-hover:text-white"
              >
                Solutions
                <svg
                  aria-hidden="true"
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  className="transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
                >
                  <path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="invisible absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="rounded-xl border border-white/10 bg-[#0A0A0F]/95 p-2 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                  <DropdownLink href="/solutions/freelancers" label="Freelancers" caption="Solo operators & consultants" />
                  <DropdownLink href="/solutions/startups" label="Startups" caption="Pre-seed to Series B" />
                  <DropdownLink href="/solutions/agencies" label="Agencies" caption="Client-facing teams" />
                  <DropdownLink href="/solutions/enterprises" label="Enterprises" caption="500+ seats" />
                </div>
              </div>
            </li>

            <li className="group relative">
              <button
                type="button"
                aria-haspopup="true"
                className="inline-flex items-center gap-1 transition-colors hover:text-white group-focus-within:text-white group-hover:text-white"
              >
                Resources
                <svg
                  aria-hidden="true"
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  className="transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
                >
                  <path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="rounded-xl border border-white/10 bg-[#0A0A0F]/95 p-2 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                  <DropdownLink href="/blog" label="Blog" caption="Essays & product thinking" />
                  <DropdownLink href="/templates" label="Templates" caption="Pre-built workspaces" />
                  <DropdownLink href="/changelog" label="Changelog" caption="What shipped this week" />
                  <DropdownLink href="/ai" label="OmniMind AI" caption="Our AI layer" />
                  <DropdownLink href="/integrations" label="Integrations" caption="Connect your stack" />
                  <div className="my-1 h-px bg-white/5" />
                  <DropdownLink
                    href="/tools/saas-cost-calculator"
                    label="SaaS Cost Calculator"
                    caption="Free · See what you're overpaying"
                    highlight
                  />
                  <DropdownLink href="/tools" label="All free tools" />
                </div>
              </div>
            </li>

            <li>
              <Link href="/pricing" className="transition-colors hover:text-white">
                Pricing
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm text-white/70 transition-colors hover:text-white sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1 rounded-lg bg-[#6366F1] px-4 py-2 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(99,102,241,0.4),0_8px_24px_-8px_rgba(99,102,241,0.6)] transition-all hover:bg-[#5558E3]"
            >
              Get started free
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </nav>
      </header>

      <main>{children}</main>

      <footer className="border-t border-white/5 bg-[#07070C]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-xs font-bold">
                  O
                </span>
                <span>OmniOS</span>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-white/50">
                The AI-powered business platform. Replace $43,000/year of
                disconnected SaaS with one AI-native OS.
              </p>
              <p className="mt-6 text-xs text-white/30">
                A product of OmniOS.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
                Product
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-white/60">
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/ai" className="hover:text-white">OmniMind AI</Link></li>
                <li><Link href="/integrations" className="hover:text-white">Integrations</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/changelog" className="hover:text-white">Changelog</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
                Solutions
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-white/60">
                <li><Link href="/solutions/freelancers" className="hover:text-white">Freelancers</Link></li>
                <li><Link href="/solutions/startups" className="hover:text-white">Startups</Link></li>
                <li><Link href="/solutions/agencies" className="hover:text-white">Agencies</Link></li>
                <li><Link href="/solutions/enterprises" className="hover:text-white">Enterprises</Link></li>
                <li><Link href="/enterprise" className="hover:text-white">Enterprise plan</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
                Resources
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-white/60">
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/templates" className="hover:text-white">Templates</Link></li>
                <li><Link href="/tools" className="hover:text-white">Free tools</Link></li>
                <li><Link href="/tools/saas-cost-calculator" className="hover:text-[#D4AF37]">SaaS cost calculator</Link></li>
                <li><Link href="/compare" className="hover:text-white">Compare</Link></li>
                <li><Link href="/customers" className="hover:text-white">Customers</Link></li>
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/security" className="hover:text-white">Security</Link></li>
                <li><a href="mailto:hello@omnios.app" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-8 text-xs text-white/40 md:flex-row md:items-center">
            <p>© {currentYear} OmniOS, Inc. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/legal/privacy" className="hover:text-white/70">Privacy</Link>
              <Link href="/legal/terms" className="hover:text-white/70">Terms</Link>
              <Link href="/security" className="hover:text-white/70">Security</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
