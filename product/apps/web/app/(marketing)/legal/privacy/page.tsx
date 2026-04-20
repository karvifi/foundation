import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | OmniOS",
  description:
    "OmniOS Privacy Policy. Learn how we collect, use, and protect your data. Local-first AI means most of your data never leaves your device.",
  alternates: { canonical: "/legal/privacy" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "April 19, 2026";

interface Section {
  id: string;
  title: string;
  content: string[];
}

const SECTIONS: Section[] = [
  {
    id: "information-we-collect",
    title: "1. Information We Collect",
    content: [
      "Account information: When you register, we collect your name, email address, company name, and billing information.",
      "Usage data: We collect anonymized telemetry about feature usage (e.g., which modules are opened, workflow run counts) to improve the product. This data is aggregated and never tied to individual users in analytics.",
      "Local AI processing: When you use OmniMind with local model inference enabled (the default), your prompts, documents, and business data are processed entirely on your device. They are never transmitted to OmniOS servers or third-party AI providers.",
      "Cloud AI processing: If you opt in to cloud AI routing for specific queries, those prompts are transmitted to our AI routing layer under our data processing agreements with model providers. You can view and revoke consent at any time in Settings → AI → Processing Mode.",
      "Support communications: If you contact support, we retain the content of those communications to resolve your issue and improve our help documentation.",
    ],
  },
  {
    id: "how-we-use-information",
    title: "2. How We Use Your Information",
    content: [
      "To provide and operate the OmniOS service, including authentication, billing, and feature delivery.",
      "To send transactional emails: account confirmations, payment receipts, security alerts, and product update notices.",
      "To send product newsletters and marketing communications. You may opt out at any time via the unsubscribe link or in Account Settings.",
      "To analyze aggregate usage patterns and improve product features. We never sell individual usage data.",
      "To detect and prevent fraudulent activity, abuse, and security threats.",
      "To comply with applicable laws and respond to lawful requests from public authorities.",
    ],
  },
  {
    id: "data-sharing",
    title: "3. Data Sharing and Disclosure",
    content: [
      "We do not sell your personal data. We do not share it with advertisers or data brokers.",
      "Service providers: We share data with sub-processors who help us deliver the service (Stripe for payments, AWS for hosting, Postmark for transactional email). All sub-processors are bound by data processing agreements.",
      "Business transfers: If OmniOS is acquired or merged, your data may transfer to the successor entity. We will notify you by email and provide 30 days to export and delete your data before any transfer.",
      "Legal requirements: We may disclose data when required by a court order or applicable law. We will notify you of any such request unless legally prohibited.",
    ],
  },
  {
    id: "data-retention",
    title: "4. Data Retention",
    content: [
      "Your data is retained for as long as your account is active. When you delete your account, your personal data and workspace content are permanently deleted within 30 days.",
      "Encrypted backups are retained for 90 days before permanent deletion.",
      "Billing records are retained for 7 years to comply with accounting regulations.",
    ],
  },
  {
    id: "security",
    title: "5. Security",
    content: [
      "All data in transit is encrypted with TLS 1.3. All data at rest is encrypted with AES-256.",
      "We maintain SOC 2 Type II certification, audited annually by an independent third party.",
      "If we become aware of a data breach affecting your personal data, we will notify you within 72 hours.",
    ],
  },
  {
    id: "your-rights",
    title: "6. Your Rights",
    content: [
      "Access: Request a complete export of your personal data at any time via Account Settings → Privacy → Export Data.",
      "Deletion: Delete your account and all associated data via Account Settings → Privacy → Delete Account.",
      "Portability: Data exports are provided in JSON and CSV formats.",
      "Opt-out of marketing: Use the unsubscribe link in any marketing email or toggle off in Account Settings → Notifications.",
      "For GDPR or CCPA requests, email privacy@omnios.app. We respond within 30 days.",
    ],
  },
  {
    id: "cookies",
    title: "7. Cookies and Tracking",
    content: [
      "Essential cookies: We use session cookies for authentication. These cannot be disabled without logging out.",
      "Analytics: We use privacy-first analytics with no third-party tracking pixels and no cross-site tracking.",
      "No advertising cookies: We do not use retargeting pixels or behavioral tracking for ad purposes.",
    ],
  },
  {
    id: "international-transfers",
    title: "8. International Data Transfers",
    content: [
      "OmniOS is operated from the United States. If you are located in the European Economic Area, United Kingdom, or Switzerland, we transfer your data to the US under Standard Contractual Clauses approved by the European Commission.",
    ],
  },
  {
    id: "children",
    title: "9. Children's Privacy",
    content: [
      "OmniOS is not directed to children under 16. We do not knowingly collect personal information from children under 16. Contact privacy@omnios.app if you believe we have inadvertently done so.",
    ],
  },
  {
    id: "changes",
    title: "10. Changes to This Policy",
    content: [
      "We will notify you of material changes by email and in-product notice at least 30 days before the change takes effect. Continued use after the effective date constitutes acceptance.",
    ],
  },
  {
    id: "contact",
    title: "11. Contact",
    content: [
      "Data Controller: OmniOS, Inc.",
      "Privacy inquiries: privacy@omnios.app",
      "EU Representative: eu-privacy@omnios.app",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-4xl px-6 pb-14 pt-20">
          <nav className="mb-6 flex items-center gap-2 text-xs text-white/40">
            <Link href="/" className="transition hover:text-white/70">OmniOS</Link>
            <span>/</span>
            <span className="text-white/70">Privacy Policy</span>
          </nav>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-white/50">Last updated: {LAST_UPDATED}</p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
            OmniOS is built on a simple principle: your business data is yours.
            Local-first AI means most processing happens on your device. This
            policy explains the rest.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="flex gap-16">
          <aside className="hidden w-52 shrink-0 lg:block">
            <nav className="sticky top-24 space-y-2">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                Contents
              </p>
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block text-xs text-white/40 transition hover:text-white/70"
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>

          <div className="min-w-0 flex-1 space-y-12">
            {SECTIONS.map((s) => (
              <div key={s.id} id={s.id}>
                <h2 className="mb-4 text-xl font-semibold text-white">{s.title}</h2>
                <ul className="space-y-3">
                  {s.content.map((line, i) => (
                    <li key={i} className="text-sm leading-relaxed text-white/60">
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="rounded-2xl border border-[#6366F1]/20 bg-[#6366F1]/5 px-6 py-5">
              <p className="text-sm leading-relaxed text-white/70">
                Questions?{" "}
                <a
                  href="mailto:privacy@omnios.app"
                  className="font-semibold text-[#6366F1] transition hover:text-[#818CF8]"
                >
                  privacy@omnios.app
                </a>{" "}
                — we respond within 2 business days.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <div className="flex flex-wrap gap-6 text-xs text-white/40">
            <Link href="/legal/terms" className="transition hover:text-white/70">Terms of Service</Link>
            <Link href="/security" className="transition hover:text-white/70">Security</Link>
            <a href="mailto:privacy@omnios.app" className="transition hover:text-white/70">
              privacy@omnios.app
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
