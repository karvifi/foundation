import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security | OmniOS",
  description:
    "Security-first, compliance-ready AI OS. SOC 2, HIPAA, GDPR, ISO 27001. AES-256 encryption, TLS 1.3, zero-trust architecture, regional data residency.",
  alternates: { canonical: "/security" },
};

interface Cert {
  name: string;
  desc: string;
}

interface Control {
  title: string;
  desc: string;
}

interface ResidencyRegion {
  region: string;
  notes: string;
}

const certifications: Cert[] = [
  {
    name: "SOC 2 Type II",
    desc: "Independently audited annually across security, availability, confidentiality, and privacy trust services criteria.",
  },
  {
    name: "HIPAA",
    desc: "Business Associate Agreements available. PHI handling meets the HIPAA Security Rule and Breach Notification Rule.",
  },
  {
    name: "GDPR",
    desc: "Data Processing Addendum, EU Standard Contractual Clauses, and EU-hosted deployments for data subject rights.",
  },
  {
    name: "ISO 27001",
    desc: "Certified Information Security Management System covering risk treatment, asset handling, and supplier controls.",
  },
];

const accessControls: Control[] = [
  { title: "Single Sign-On", desc: "SAML 2.0 and OIDC. Works with Okta, Azure AD, Google, OneLogin, Ping." },
  { title: "Multi-Factor Auth", desc: "TOTP, WebAuthn/Passkeys, and hardware keys (YubiKey)." },
  { title: "RBAC", desc: "Roles scoped to workspace, collection, document, and action." },
  { title: "IP Allowlisting", desc: "CIDR-level restrictions for workspaces and admin console." },
  { title: "Session Management", desc: "Configurable idle and absolute timeouts, device binding, revoke-all." },
  { title: "SCIM Provisioning", desc: "Automated joiner/mover/leaver flows from your IdP." },
];

const residencyRegions: ResidencyRegion[] = [
  { region: "United States", notes: "us-east-1, us-west-2" },
  { region: "European Union", notes: "eu-central-1 (Frankfurt), eu-west-1 (Dublin)" },
  { region: "Asia-Pacific", notes: "ap-southeast-1 (Singapore), ap-northeast-1 (Tokyo)" },
];

export default function SecurityPage() {
  return (
    <main className="bg-[#0A0A0F] text-neutral-100">
      <section className="relative overflow-hidden border-b border-white/5">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 30% 0%, rgba(99,102,241,0.2), transparent 60%), radial-gradient(ellipse 60% 40% at 90% 30%, rgba(212,175,55,0.08), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 pb-28 pt-32 md:pt-40">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
            <span className="h-1 w-1 rounded-full bg-[#D4AF37]" />
            Trust center
          </p>
          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            Security-first.
            <br />
            <span className="bg-gradient-to-r from-[#6366F1] to-[#D4AF37] bg-clip-text text-transparent">
              Compliance-ready.
            </span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-neutral-400 md:text-xl">
            OmniOS is designed for teams whose auditors ask hard questions. Every byte is encrypted, every action is logged, and every deployment model is under your control.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="mailto:security@omnios.app" className="rounded-lg bg-[#6366F1] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#5457e0]">
              Contact security team
            </a>
            <a href="#compliance" className="rounded-lg border border-white/10 px-6 py-3 text-sm font-medium text-neutral-200 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]">
              Review certifications
            </a>
          </div>
        </div>
      </section>

      <section id="compliance" className="border-b border-white/5 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 max-w-2xl">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">Compliance</p>
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Certified by the frameworks your auditors already recognize.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {certifications.map((c) => (
              <div key={c.name} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition hover:border-[#D4AF37]/30">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#6366F1]/10 blur-3xl transition group-hover:bg-[#D4AF37]/10" />
                <div className="relative">
                  <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#D4AF37]/30 bg-[#D4AF37]/5">
                    <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{c.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-400">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 max-w-2xl">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">Data protection</p>
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Encryption by default. Everywhere.
            </h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:grid-cols-3">
            <div className="bg-[#0A0A0F] p-8">
              <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">At rest</div>
              <div className="mt-4 text-2xl font-semibold text-white">AES-256</div>
              <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                All persistent storage encrypted with AES-256-GCM. Per-tenant data encryption keys.
              </p>
            </div>
            <div className="bg-[#0A0A0F] p-8">
              <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">In transit</div>
              <div className="mt-4 text-2xl font-semibold text-white">TLS 1.3</div>
              <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                TLS 1.3 only, with HSTS preload. Internal service-to-service traffic uses mTLS.
              </p>
            </div>
            <div className="bg-[#0A0A0F] p-8">
              <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Key management</div>
              <div className="mt-4 text-2xl font-semibold text-white">HSM-backed</div>
              <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                FIPS 140-2 Level 3 HSMs. BYOK and external KMS integrations (AWS KMS, GCP KMS, Azure Key Vault).
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 max-w-2xl">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">Architecture</p>
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Zero-trust by construction.
            </h2>
            <p className="mt-4 text-neutral-400">
              Every request is authenticated, authorized, and logged. No implicit trust between services, networks, or identities.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-6 md:p-10">
            <div className="grid gap-6 md:grid-cols-5 md:items-stretch">
              <div className="rounded-xl border border-white/10 bg-[#0A0A0F] p-5 text-center">
                <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Identity</div>
                <div className="mt-2 font-medium text-white">IdP / SSO</div>
              </div>
              <div className="flex items-center justify-center text-[#6366F1]">
                <span className="hidden md:inline">&rarr;</span>
                <span className="md:hidden">&darr;</span>
              </div>
              <div className="rounded-xl border border-[#6366F1]/40 bg-[#6366F1]/5 p-5 text-center">
                <div className="text-xs uppercase tracking-[0.2em] text-[#6366F1]">Policy engine</div>
                <div className="mt-2 font-medium text-white">Per-request authZ</div>
              </div>
              <div className="flex items-center justify-center text-[#D4AF37]">
                <span className="hidden md:inline">&rarr;</span>
                <span className="md:hidden">&darr;</span>
              </div>
              <div className="rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-5 text-center">
                <div className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]">Workload</div>
                <div className="mt-2 font-medium text-white">mTLS + attestation</div>
              </div>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-[#0A0A0F] p-6">
                <div className="text-sm font-semibold text-white">Standard deployment</div>
                <p className="mt-2 text-sm text-neutral-400">
                  Multi-tenant with logical isolation, per-tenant keys, and private VPC peering for ingress.
                </p>
              </div>
              <div className="rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/[0.04] p-6">
                <div className="text-sm font-semibold text-[#D4AF37]">Air-gapped deployment</div>
                <p className="mt-2 text-sm text-neutral-400">
                  Fully isolated, customer-operated environments with signed update bundles and offline model loading.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 max-w-2xl">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">Access controls</p>
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Least privilege, enforced.
            </h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:grid-cols-2 lg:grid-cols-3">
            {accessControls.map((c) => (
              <div key={c.title} className="bg-[#0A0A0F] p-8 transition hover:bg-[#0F0F18]">
                <h3 className="text-base font-semibold text-white">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 md:p-10">
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">Responsible disclosure</p>
              <h3 className="text-2xl font-semibold text-white">Vulnerability disclosure policy</h3>
              <p className="mt-4 text-sm leading-relaxed text-neutral-400">
                We welcome coordinated disclosure from independent researchers. Submit findings to{" "}
                <a href="mailto:security@omnios.app" className="text-[#D4AF37] hover:underline">security@omnios.app</a>{" "}
                with a clear reproduction and impact statement. We acknowledge within 24 hours and target triage within 72 hours.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-neutral-400">
                <li>- Safe harbor for good-faith research</li>
                <li>- Public hall-of-fame recognition</li>
                <li>- Paid bounty program for qualifying reports</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 md:p-10">
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">Offensive testing</p>
              <h3 className="text-2xl font-semibold text-white">Penetration testing schedule</h3>
              <p className="mt-4 text-sm leading-relaxed text-neutral-400">
                Third-party penetration tests are conducted twice per year against production and staging. Executive summary reports are available under NDA.
              </p>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-neutral-400">Q1</span>
                  <span className="text-white">Application + API</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-neutral-400">Q3</span>
                  <span className="text-white">Infrastructure + network</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Continuous</span>
                  <span className="text-white">Automated DAST/SAST</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 max-w-2xl">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">Residency</p>
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Your data, pinned to your region.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {residencyRegions.map((r) => (
              <div key={r.region} className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
                <div className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]">{r.region}</div>
                <div className="mt-4 font-medium text-white">{r.notes}</div>
                <p className="mt-3 text-sm text-neutral-400">
                  Storage, compute, and inference stay within region. No cross-region replication without explicit tenant opt-in.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#6366F1]/10 via-transparent to-[#D4AF37]/10 p-10 text-center md:p-16">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">Security contact</p>
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Report a vulnerability.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-neutral-400">
              Reach our security team directly. PGP key available on request.
            </p>
            <div className="mt-8">
              <a href="mailto:security@omnios.app" className="inline-flex rounded-lg bg-[#6366F1] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#5457e0]">
                security@omnios.app
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
