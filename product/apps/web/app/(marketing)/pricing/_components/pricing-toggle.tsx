"use client";

import { useState } from "react";
import Link from "next/link";

interface Tier {
  name: string;
  tagline: string;
  priceMonthly: number;
  priceAnnual: number;
  ctaLabel: string;
  ctaHref: string;
  highlight?: boolean;
  badge?: string;
  features: string[];
  includes: string;
}

interface PricingToggleProps {
  tiers: Tier[];
}

const ANNUAL_DISCOUNT_PERCENT = 10;

export function PricingToggle({ tiers }: PricingToggleProps) {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  return (
    <div>
      <div className="flex items-center justify-center" role="group" aria-label="Billing cycle">
        <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-[#13131A] p-1 text-sm">
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            aria-pressed={billing === "monthly"}
            className={`rounded-full px-5 py-2 font-medium transition-colors ${
              billing === "monthly"
                ? "bg-white text-[#0A0A0F]"
                : "text-white/70 hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBilling("annual")}
            aria-pressed={billing === "annual"}
            className={`flex items-center gap-2 rounded-full px-5 py-2 font-medium transition-colors ${
              billing === "annual"
                ? "bg-white text-[#0A0A0F]"
                : "text-white/70 hover:text-white"
            }`}
          >
            Annual
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                billing === "annual"
                  ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                  : "bg-[#6366F1]/15 text-[#818CF8]"
              }`}
            >
              Save {ANNUAL_DISCOUNT_PERCENT}%
            </span>
          </button>
        </div>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {tiers.map((tier) => {
          const price = billing === "monthly" ? tier.priceMonthly : tier.priceAnnual;
          const suffix = billing === "monthly" ? "/mo" : "/mo, billed annually";

          return (
            <article
              key={tier.name}
              className={`relative flex flex-col rounded-2xl border p-6 transition-colors ${
                tier.highlight
                  ? "border-[#6366F1]/50 bg-gradient-to-b from-[#6366F1]/10 to-[#13131A] shadow-[0_0_40px_-12px_rgba(99,102,241,0.4)]"
                  : "border-white/10 bg-[#13131A]"
              }`}
            >
              {tier.badge ? (
                <span className="absolute -top-3 left-6 rounded-full bg-[#D4AF37] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#0A0A0F]">
                  {tier.badge}
                </span>
              ) : null}

              <header>
                <h3 className="text-lg font-semibold tracking-tight">{tier.name}</h3>
                <p className="mt-1 text-sm text-white/50">{tier.tagline}</p>
              </header>

              <div className="mt-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight">${price}</span>
                  <span className="text-sm text-white/50">{suffix}</span>
                </div>
                {billing === "annual" && tier.priceMonthly > 0 ? (
                  <p className="mt-1 text-xs text-white/40">
                    <span className="line-through">${tier.priceMonthly}/mo</span>{" "}
                    <span className="text-[#D4AF37]">
                      Save ${(tier.priceMonthly - tier.priceAnnual) * 12}/yr
                    </span>
                  </p>
                ) : null}
              </div>

              <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-white/40">
                {tier.includes}
              </p>

              <ul className="mt-5 flex-1 space-y-3 text-sm text-white/70">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span aria-hidden="true" className="mt-0.5 text-[#6366F1]">
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={tier.ctaHref}
                className={`mt-6 inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                  tier.highlight
                    ? "bg-[#6366F1] text-white shadow-[0_8px_24px_-8px_rgba(99,102,241,0.6)] hover:bg-[#5558E3]"
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {tier.ctaLabel}
              </Link>

              {tier.priceMonthly === 0 ? (
                <p className="mt-3 text-center text-xs text-white/40">
                  No credit card required
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
