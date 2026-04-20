"use client";

import { useState, useEffect } from "react";
import {
  CreditCard,
  Download,
  Plus,
  Minus,
  Check,
  X,
  AlertTriangle,
  Crown,
  Zap,
  Building2,
  Users,
  HardDrive,
  Activity,
  Receipt,
  Shield,
  Bell,
  Sparkles,
  TrendingUp,
  FileText,
  ChevronRight,
  Star,
} from "lucide-react";

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  description: string;
}

interface PlanTier {
  id: "starter" | "pro" | "enterprise";
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  features: string[];
  icon: typeof Zap;
  accent: string;
}

const PLANS: PlanTier[] = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 29,
    annualPrice: 24,
    description: "For small teams getting started",
    features: ["Up to 5 seats", "20GB storage", "10K API calls/mo", "Email support", "Basic analytics"],
    icon: Zap,
    accent: "#6366F1",
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 89,
    annualPrice: 74,
    description: "For growing teams replacing their stack",
    features: ["Up to 15 seats", "100GB storage", "100K API calls/mo", "Priority support", "Advanced analytics", "Custom domains", "API access"],
    icon: Crown,
    accent: "#D4AF37",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: 299,
    annualPrice: 249,
    description: "For organizations at scale",
    features: ["Unlimited seats", "1TB+ storage", "Unlimited API calls", "24/7 dedicated support", "SSO / SAML", "Custom contracts", "SLA guarantee"],
    icon: Building2,
    accent: "#A78BFA",
  },
];

const INVOICES: Invoice[] = [
  { id: "INV-2026-04", date: "Apr 1, 2026", amount: 89, status: "paid", description: "Pro Plan — Monthly" },
  { id: "INV-2026-03", date: "Mar 1, 2026", amount: 89, status: "paid", description: "Pro Plan — Monthly" },
  { id: "INV-2026-02", date: "Feb 1, 2026", amount: 89, status: "paid", description: "Pro Plan — Monthly" },
  { id: "INV-2026-01", date: "Jan 1, 2026", amount: 89, status: "paid", description: "Pro Plan — Monthly" },
  { id: "INV-2025-12", date: "Dec 1, 2025", amount: 89, status: "paid", description: "Pro Plan — Monthly" },
  { id: "INV-2025-11", date: "Nov 1, 2025", amount: 89, status: "paid", description: "Pro Plan — Monthly" },
  { id: "INV-2025-10", date: "Oct 1, 2025", amount: 89, status: "paid", description: "Pro Plan — Monthly" },
  { id: "INV-2025-09", date: "Sep 1, 2025", amount: 89, status: "paid", description: "Pro Plan — Monthly" },
  { id: "INV-2025-08", date: "Aug 1, 2025", amount: 89, status: "paid", description: "Pro Plan — Monthly" },
  { id: "INV-2025-07", date: "Jul 1, 2025", amount: 89, status: "paid", description: "Pro Plan — Monthly" },
  { id: "INV-2025-06", date: "Jun 1, 2025", amount: 89, status: "paid", description: "Pro Plan — Monthly" },
  { id: "INV-2025-05", date: "May 1, 2025", amount: 49, status: "paid", description: "Starter Plan — Monthly" },
];

type BillingCycle = "monthly" | "annual";

export default function BillingPage() {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [seats, setSeats] = useState<number>(8);
  const [usageBars, setUsageBars] = useState<{ seats: number; storage: number; api: number }>({ seats: 0, storage: 0, api: 0 });
  const [alerts, setAlerts] = useState<{ at80: boolean; at90: boolean; at100: boolean }>({ at80: true, at90: true, at100: true });
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState<boolean>(false);
  const [billingContact, setBillingContact] = useState<{ name: string; email: string; company: string; taxId: string; address: string }>({
    name: "Alex Morgan",
    email: "billing@acme.co",
    company: "Acme Inc.",
    taxId: "US-48-1234567",
    address: "500 Market St, San Francisco, CA 94105",
  });

  useEffect(() => {
    const t = setTimeout(() => setUsageBars({ seats: (8 / 15) * 100, storage: (42 / 100) * 100, api: (45 / 100) * 100 }), 120);
    return () => clearTimeout(t);
  }, []);

  const currentPrice = cycle === "monthly" ? 89 : 74;
  const savings = Math.round(((89 - 74) / 89) * 100);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-neutral-200">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[600px] w-[600px] rounded-full bg-[#6366F1]/10 blur-[120px]" />
        <div className="absolute -bottom-40 right-1/4 h-[500px] w-[500px] rounded-full bg-[#D4AF37]/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-8 py-12">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-3 py-1">
              <Sparkles className="h-3 w-3 text-[#D4AF37]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#D4AF37]">Billing & Subscription</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-white">Manage your plan</h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-neutral-500">
              Review usage, adjust seats, update billing details, and upgrade whenever the team outgrows the current tier.
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-xl border border-white/5 bg-white/[0.02] p-1">
            <button
              onClick={() => setCycle("monthly")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${cycle === "monthly" ? "bg-[#6366F1] text-white shadow-lg shadow-[#6366F1]/30" : "text-neutral-400 hover:text-white"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setCycle("annual")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${cycle === "annual" ? "bg-[#6366F1] text-white shadow-lg shadow-[#6366F1]/30" : "text-neutral-400 hover:text-white"}`}
            >
              Annual
              <span className="rounded-full bg-[#D4AF37]/20 px-2 py-0.5 text-[10px] font-bold text-[#D4AF37]">SAVE {savings}%</span>
            </button>
          </div>
        </div>

        <div className="mb-10 grid gap-6 lg:grid-cols-3">
          <div className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37]/[0.08] via-[#0A0A0F] to-[#6366F1]/[0.05] p-8 lg:col-span-2">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[#D4AF37]/10 blur-3xl" />
            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">
                    <Crown className="h-3.5 w-3.5" />
                    Current Plan
                  </div>
                  <div className="mt-3 flex items-baseline gap-3">
                    <h2 className="text-4xl font-bold text-white">Pro</h2>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-white">${currentPrice}</span>
                      <span className="text-sm text-neutral-500">/{cycle === "monthly" ? "mo" : "mo billed annually"}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-neutral-400">Renews on May 1, 2026 · Invoice paid</p>
                </div>
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
                  Active
                </div>
              </div>

              <div className="mt-8 space-y-5">
                <UsageBar icon={Users} label="Team seats" used={8} total={15} unit="seats" progress={usageBars.seats} accent="#6366F1" />
                <UsageBar icon={HardDrive} label="Storage" used={42} total={100} unit="GB" progress={usageBars.storage} accent="#D4AF37" />
                <UsageBar icon={Activity} label="API calls" used={45} total={100} unit="K this month" progress={usageBars.api} accent="#A78BFA" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
              <div className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                <CreditCard className="h-3.5 w-3.5" />
                Payment Method
              </div>
              <div className="rounded-xl border border-white/5 bg-gradient-to-br from-[#0A0A0F] to-neutral-900 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-12 items-center justify-center rounded bg-gradient-to-br from-[#1A1F71] to-[#0C1028] text-[10px] font-black text-white">
                    VISA
                  </div>
                  <Shield className="h-4 w-4 text-[#D4AF37]" />
                </div>
                <div className="mt-6 font-mono text-sm tracking-widest text-white">•••• •••• •••• 4242</div>
                <div className="mt-3 flex justify-between text-[11px] text-neutral-500">
                  <span>Alex Morgan</span>
                  <span>12/28</span>
                </div>
              </div>
              <button
                onClick={() => setShowAddPaymentModal(true)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/10 bg-transparent py-2.5 text-xs font-medium text-neutral-400 transition hover:border-[#6366F1]/40 hover:bg-[#6366F1]/5 hover:text-white"
              >
                <Plus className="h-3.5 w-3.5" />
                Add payment method
              </button>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
              <div className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                <Users className="h-3.5 w-3.5" />
                Team Seats
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-white">{seats}</div>
                  <div className="text-xs text-neutral-500">active seats · $12/seat</div>
                </div>
                <div className="flex items-center gap-1 rounded-lg border border-white/5 bg-[#0A0A0F] p-1">
                  <button
                    onClick={() => setSeats((s) => Math.max(1, s - 1))}
                    className="flex h-7 w-7 items-center justify-center rounded text-neutral-400 transition hover:bg-white/5 hover:text-white"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="min-w-[1.5rem] text-center text-sm font-semibold text-white">{seats}</span>
                  <button
                    onClick={() => setSeats((s) => Math.min(15, s + 1))}
                    className="flex h-7 w-7 items-center justify-center rounded text-neutral-400 transition hover:bg-white/5 hover:text-white"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="mt-4 text-[11px] text-neutral-500">
                Prorated · next charge <span className="font-semibold text-neutral-300">${seats * 12}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Bell className="h-4 w-4 text-[#6366F1]" />
                Usage Alerts
              </div>
              <p className="mt-1 text-xs text-neutral-500">Get notified by email before you hit usage limits.</p>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {([
              { key: "at80" as const, label: "At 80% usage", color: "#6366F1" },
              { key: "at90" as const, label: "At 90% usage", color: "#D4AF37" },
              { key: "at100" as const, label: "At 100% usage", color: "#EF4444" },
            ]).map((t) => (
              <label
                key={t.key}
                className="flex cursor-pointer items-center justify-between rounded-xl border border-white/5 bg-[#0A0A0F] px-4 py-3 transition hover:border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full" style={{ background: t.color, boxShadow: `0 0 8px ${t.color}` }} />
                  <span className="text-sm text-neutral-200">{t.label}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAlerts((a) => ({ ...a, [t.key]: !a[t.key] }))}
                  className={`relative h-5 w-9 rounded-full transition ${alerts[t.key] ? "bg-[#6366F1]" : "bg-white/10"}`}
                >
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${alerts[t.key] ? "left-4" : "left-0.5"}`} />
                </button>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Compare plans</h2>
              <p className="mt-1 text-sm text-neutral-500">Upgrade, downgrade, or switch billing cycles at any time.</p>
            </div>
            <div className="hidden items-center gap-1 text-xs text-neutral-500 md:flex">
              <TrendingUp className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>Save {savings}% annually</span>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {PLANS.map((plan) => {
              const Icon = plan.icon;
              const isCurrent = plan.id === "pro";
              const price = cycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;
              return (
                <div
                  key={plan.id}
                  className={`relative overflow-hidden rounded-2xl border p-7 transition ${
                    isCurrent
                      ? "border-[#D4AF37]/30 bg-gradient-to-br from-[#D4AF37]/[0.06] to-transparent"
                      : "border-white/5 bg-white/[0.02] hover:border-white/10"
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                      <Star className="h-3 w-3 fill-[#D4AF37]" />
                      Current
                    </div>
                  )}
                  <div
                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: `${plan.accent}15`, border: `1px solid ${plan.accent}30` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: plan.accent }} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="mt-1 text-xs text-neutral-500">{plan.description}</p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">${price}</span>
                    <span className="text-sm text-neutral-500">/mo</span>
                  </div>
                  {cycle === "annual" && <div className="mt-1 text-[11px] text-[#D4AF37]">Billed ${price * 12}/year</div>}
                  <ul className="mt-6 space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-neutral-300">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: plan.accent }} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    disabled={isCurrent}
                    className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition ${
                      isCurrent
                        ? "cursor-not-allowed border border-white/5 bg-white/5 text-neutral-500"
                        : plan.id === "enterprise"
                        ? "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                        : "bg-[#6366F1] text-white shadow-lg shadow-[#6366F1]/30 hover:bg-[#5558E3]"
                    }`}
                  >
                    {isCurrent ? "Current plan" : plan.id === "enterprise" ? "Contact sales" : `Upgrade to ${plan.name}`}
                    {!isCurrent && <ChevronRight className="h-4 w-4" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-10 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Receipt className="h-4 w-4 text-[#D4AF37]" />
              Invoice History
            </div>
            <button className="text-xs font-medium text-[#6366F1] hover:text-[#818CF8]">Export all (CSV)</button>
          </div>
          <div className="overflow-hidden rounded-xl border border-white/5">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02] text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                  <th className="px-5 py-3">Invoice</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Description</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {INVOICES.map((inv, idx) => (
                  <tr key={inv.id} className={`text-sm ${idx < INVOICES.length - 1 ? "border-b border-white/5" : ""} transition hover:bg-white/[0.02]`}>
                    <td className="px-5 py-3.5 font-mono text-xs text-neutral-300">{inv.id}</td>
                    <td className="px-5 py-3.5 text-neutral-400">{inv.date}</td>
                    <td className="px-5 py-3.5 text-neutral-300">{inv.description}</td>
                    <td className="px-5 py-3.5 font-semibold text-white">${inv.amount.toFixed(2)}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Paid
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="inline-flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-1.5 text-xs text-neutral-300 transition hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 hover:text-[#D4AF37]">
                        <Download className="h-3 w-3" />
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-10 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-white">
            <FileText className="h-4 w-4 text-[#6366F1]" />
            Billing Contact & Tax Information
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <LuxField label="Full name" value={billingContact.name} onChange={(v) => setBillingContact((c) => ({ ...c, name: v }))} />
            <LuxField label="Billing email" value={billingContact.email} onChange={(v) => setBillingContact((c) => ({ ...c, email: v }))} />
            <LuxField label="Company" value={billingContact.company} onChange={(v) => setBillingContact((c) => ({ ...c, company: v }))} />
            <LuxField label="Tax ID / VAT" value={billingContact.taxId} onChange={(v) => setBillingContact((c) => ({ ...c, taxId: v }))} />
            <div className="md:col-span-2">
              <LuxField label="Billing address" value={billingContact.address} onChange={(v) => setBillingContact((c) => ({ ...c, address: v }))} />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button className="rounded-lg bg-[#6366F1] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#6366F1]/30 transition hover:bg-[#5558E3]">
              Save changes
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.02] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
                <AlertTriangle className="h-4 w-4 text-red-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Cancel subscription</div>
                <p className="mt-1 text-xs text-neutral-500">You&apos;ll keep access until the end of your current billing period.</p>
              </div>
            </div>
            <button
              onClick={() => setShowCancelModal(true)}
              className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
            >
              Cancel plan
            </button>
          </div>
        </div>
      </div>

      {showCancelModal && (
        <Modal onClose={() => setShowCancelModal(false)}>
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10">
            <Crown className="h-6 w-6 text-[#D4AF37]" />
          </div>
          <h3 className="text-2xl font-bold text-white">Wait — here&apos;s an exclusive offer</h3>
          <p className="mt-2 text-sm leading-relaxed text-neutral-400">
            Stay on Pro and get <span className="font-semibold text-[#D4AF37]">30% off</span> your next 3 months. That&apos;s $80 back in your pocket, no strings attached.
          </p>
          <div className="mt-6 rounded-xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37]/5 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-neutral-500">Your next bill</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">$62.30</span>
                  <span className="text-sm text-neutral-500 line-through">$89</span>
                </div>
              </div>
              <div className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-[11px] font-bold text-[#D4AF37]">-30%</div>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setShowCancelModal(false)}
              className="flex-1 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8941F] py-3 text-sm font-semibold text-[#0A0A0F] shadow-lg shadow-[#D4AF37]/20 transition hover:shadow-[#D4AF37]/40"
            >
              Accept offer & stay
            </button>
            <button
              onClick={() => setShowCancelModal(false)}
              className="flex-1 rounded-xl border border-white/10 bg-transparent py-3 text-sm font-medium text-neutral-400 transition hover:bg-white/5 hover:text-white"
            >
              Cancel anyway
            </button>
          </div>
        </Modal>
      )}

      {showAddPaymentModal && (
        <Modal onClose={() => setShowAddPaymentModal(false)}>
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#6366F1]/20 bg-[#6366F1]/10">
            <CreditCard className="h-6 w-6 text-[#6366F1]" />
          </div>
          <h3 className="text-2xl font-bold text-white">Add payment method</h3>
          <p className="mt-2 text-sm text-neutral-400">Securely stored and PCI-DSS compliant.</p>
          <div className="mt-6 space-y-4">
            <LuxField label="Card number" value="" onChange={() => undefined} placeholder="1234 5678 9012 3456" />
            <div className="grid grid-cols-2 gap-4">
              <LuxField label="Expiry" value="" onChange={() => undefined} placeholder="MM/YY" />
              <LuxField label="CVC" value="" onChange={() => undefined} placeholder="123" />
            </div>
            <LuxField label="Cardholder name" value="" onChange={() => undefined} placeholder="Alex Morgan" />
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setShowAddPaymentModal(false)}
              className="flex-1 rounded-xl bg-[#6366F1] py-3 text-sm font-semibold text-white shadow-lg shadow-[#6366F1]/30 transition hover:bg-[#5558E3]"
            >
              Add card
            </button>
            <button
              onClick={() => setShowAddPaymentModal(false)}
              className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-medium text-neutral-400 transition hover:bg-white/5 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

interface UsageBarProps {
  icon: typeof Users;
  label: string;
  used: number;
  total: number;
  unit: string;
  progress: number;
  accent: string;
}

function UsageBar({ icon: Icon, label, used, total, unit, progress, accent }: UsageBarProps) {
  const pct = (used / total) * 100;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5" style={{ color: accent }} />
          <span className="text-sm font-medium text-neutral-300">{label}</span>
        </div>
        <div className="text-xs text-neutral-500">
          <span className="font-semibold text-white">{used}</span> / {total} {unit} · <span style={{ color: accent }}>{Math.round(pct)}%</span>
        </div>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-[1200ms] ease-out"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${accent}, ${accent}AA)`,
            boxShadow: `0 0 12px ${accent}66`,
          }}
        />
      </div>
    </div>
  );
}

interface LuxFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function LuxField({ label, value, onChange, placeholder }: LuxFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-neutral-500">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-white/5 bg-[#0A0A0F] px-4 py-2.5 text-sm text-white placeholder-neutral-600 transition focus:border-[#6366F1]/40 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20"
      />
    </label>
  );
}

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ onClose, children }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0A0A0F]/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-br from-[#12121A] to-[#0A0A0F] p-8 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-neutral-500 transition hover:text-white">
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}
