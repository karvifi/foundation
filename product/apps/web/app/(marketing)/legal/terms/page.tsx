import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | OmniOS",
  description:
    "OmniOS Terms of Service. The rules for using OmniOS — written in plain language. No dark patterns, no surprise clauses.",
  alternates: { canonical: "/legal/terms" },
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
    id: "agreement",
    title: "1. Agreement to Terms",
    content: [
      "By creating an OmniOS account or using any OmniOS service, you agree to these Terms of Service ('Terms'). If you are using OmniOS on behalf of a company or organization, you represent that you have authority to bind that entity to these Terms.",
      "These Terms form a binding legal agreement between you (or your organization) and OmniOS, Inc. ('OmniOS', 'we', 'our'). If you do not agree to these Terms, do not use the service.",
    ],
  },
  {
    id: "the-service",
    title: "2. The Service",
    content: [
      "OmniOS provides a cloud-based, AI-native operating system for businesses. The service includes the web application, mobile applications, APIs, and any associated software, documentation, and support.",
      "We may update, modify, or discontinue features of the service at any time. Material changes that reduce core functionality will be communicated with at least 30 days' notice.",
      "Some features are gated by plan tier. Feature availability is documented at omnios.app/pricing. We may change pricing with 30 days' notice for monthly plans and at renewal time for annual plans.",
    ],
  },
  {
    id: "your-account",
    title: "3. Your Account",
    content: [
      "You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.",
      "You must provide accurate and complete information when registering. Accounts registered with false information may be suspended.",
      "You must be at least 16 years old to use OmniOS.",
      "You may not share your account with others. Team plans must be used through the Workspace Members feature.",
      "Notify security@omnios.app immediately if you believe your account has been compromised.",
    ],
  },
  {
    id: "acceptable-use",
    title: "4. Acceptable Use",
    content: [
      "You may use OmniOS for any lawful business or personal purpose.",
      "You may not: use the service to violate any law or regulation; upload or transmit malicious software, spam, or unsolicited communications; attempt to gain unauthorized access to the service or other users' accounts; use the service to build a competing product using our proprietary AI routing or node execution infrastructure; reverse engineer, decompile, or disassemble any part of the service; use automated scraping tools against the service without our written consent.",
      "We reserve the right to suspend or terminate accounts that violate these restrictions without prior notice.",
    ],
  },
  {
    id: "your-content",
    title: "5. Your Content",
    content: [
      "You retain ownership of all content you create or import into OmniOS ('Your Content'). We claim no intellectual property rights over Your Content.",
      "By uploading or creating content in OmniOS, you grant us a limited, non-exclusive license to host, process, and transmit Your Content solely to provide the service to you.",
      "You are solely responsible for Your Content. You represent that you have the rights necessary to upload and use any content you bring into OmniOS.",
      "We do not use Your Content to train AI models without your explicit written consent.",
    ],
  },
  {
    id: "payment",
    title: "6. Payment and Billing",
    content: [
      "Paid plans are billed in advance on a monthly or annual basis. All fees are non-refundable except as required by applicable law or as stated in our refund policy.",
      "Refund policy: If you cancel within 14 days of starting a new paid plan and have not used the service for substantial productive work, you may request a full refund by contacting billing@omnios.app.",
      "Annual plans: We offer a pro-rated refund for unused months if you cancel an annual plan within the first 3 months.",
      "If your payment fails, we will retry over 7 days and notify you by email. If payment is not resolved, your account will be downgraded to the free tier and your data preserved for 90 days.",
      "All prices are in USD. Taxes may apply based on your location.",
    ],
  },
  {
    id: "intellectual-property",
    title: "7. Intellectual Property",
    content: [
      "OmniOS and its underlying technology, including the AI Graph Compiler, Node Engine, OmniMind routing layer, and all associated patents, trademarks, and trade secrets, are owned by OmniOS, Inc.",
      "We grant you a limited, non-exclusive, non-transferable license to use the OmniOS service as described in these Terms.",
      "The OmniOS name, logo, and product names are trademarks of OmniOS, Inc. You may not use them without our written consent.",
    ],
  },
  {
    id: "disclaimers",
    title: "8. Disclaimers and Limitation of Liability",
    content: [
      "THE SERVICE IS PROVIDED 'AS IS' WITHOUT WARRANTY OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.",
      "WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE. YOU USE THE SERVICE AT YOUR OWN RISK.",
      "TO THE MAXIMUM EXTENT PERMITTED BY LAW, OmniOS'S TOTAL LIABILITY FOR ANY CLAIMS ARISING FROM OR RELATED TO THESE TERMS IS LIMITED TO THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM.",
      "WE ARE NOT LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.",
    ],
  },
  {
    id: "termination",
    title: "9. Termination",
    content: [
      "You may cancel your account at any time in Account Settings. Cancellation takes effect at the end of your current billing period.",
      "We may suspend or terminate your account for violation of these Terms, non-payment, or as required by law. We will provide advance notice where practical.",
      "Upon termination, you may export your data for 30 days. After 30 days, your data will be permanently deleted.",
    ],
  },
  {
    id: "governing-law",
    title: "10. Governing Law and Disputes",
    content: [
      "These Terms are governed by the laws of the State of Delaware, USA, without regard to conflict of law principles.",
      "For disputes under $10,000, you agree to resolve them through binding arbitration administered by the American Arbitration Association. For disputes over $10,000, either party may elect litigation in state or federal courts in Delaware.",
      "CLASS ACTION WAIVER: You agree to resolve disputes with OmniOS individually, not as part of a class action.",
    ],
  },
  {
    id: "changes",
    title: "11. Changes to These Terms",
    content: [
      "We may update these Terms at any time. We will notify you of material changes by email and in-product notice at least 30 days before the effective date.",
      "Your continued use of the service after the effective date constitutes acceptance of the updated Terms.",
    ],
  },
  {
    id: "contact",
    title: "12. Contact",
    content: [
      "Legal inquiries: legal@omnios.app",
      "Billing questions: billing@omnios.app",
      "General: hello@omnios.app",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-4xl px-6 pb-14 pt-20">
          <nav className="mb-6 flex items-center gap-2 text-xs text-white/40">
            <Link href="/" className="transition hover:text-white/70">OmniOS</Link>
            <span>/</span>
            <span className="text-white/70">Terms of Service</span>
          </nav>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-sm text-white/50">Last updated: {LAST_UPDATED}</p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
            Plain language. No dark patterns. No surprise clauses. If something
            is unclear, email{" "}
            <a
              href="mailto:legal@omnios.app"
              className="text-[#6366F1] transition hover:text-[#818CF8]"
            >
              legal@omnios.app
            </a>{" "}
            and we will explain it.
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
                Questions about these terms?{" "}
                <a
                  href="mailto:legal@omnios.app"
                  className="font-semibold text-[#6366F1] transition hover:text-[#818CF8]"
                >
                  legal@omnios.app
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
            <Link href="/legal/privacy" className="transition hover:text-white/70">Privacy Policy</Link>
            <Link href="/security" className="transition hover:text-white/70">Security</Link>
            <a href="mailto:legal@omnios.app" className="transition hover:text-white/70">
              legal@omnios.app
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
