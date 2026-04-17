---
name: legal-compliance
description: Legal structure, contracts, privacy (GDPR/CCPA), IP protection, compliance frameworks
triggers: [legal, compliance, GDPR, privacy, contract, terms, liability, IP, copyright, trademark]
---

# SKILL: Legal Compliance

## Purpose
Avoid legal problems that shut down companies. Know which legal foundations every product needs.

**⚠️ DISCLAIMER: This is educational information, not legal advice. Consult a licensed attorney for your specific situation. Laws vary by jurisdiction and change frequently.**

## Required Legal Documents for Most Products

### Terms of Service / Terms of Use

Must include:
```
1. Acceptance clause (how user agrees to the terms)
2. What the service is and is not
3. User obligations (what they can/cannot do)
4. Prohibited activities (specific list)
5. Intellectual property ownership (who owns what)
6. Limitation of liability (caps your damages exposure)
7. Disclaimer of warranties
8. Termination clause (how accounts get suspended)
9. Governing law and jurisdiction
10. How terms can change (notice requirement)
11. Dispute resolution (arbitration vs. courts)
```

### Privacy Policy (REQUIRED if you collect ANY user data)

Minimum required content:
```
1. What data you collect (exhaustive list)
2. How you collect it (forms, cookies, analytics, etc.)
3. Why you collect it (specific purposes)
4. How long you keep it (retention policy)
5. Who you share it with (third parties, with names)
6. User rights (access, delete, export, opt-out)
7. Cookie policy (types, purposes, opt-out)
8. How to contact you for privacy requests
9. Date of last update
10. How users will be notified of changes
```

### GDPR (EU) Compliance Checklist
```
□ Legal basis identified for each data processing activity
  (consent / contract / legitimate interest / legal obligation)
□ Data Processing Agreements (DPAs) signed with all data processors
  (AWS, Stripe, Intercom, analytics tools — all need DPAs)
□ Cookie consent banner with granular opt-in/out
□ Privacy by design: collect minimum data needed
□ Data retention periods defined and enforced
□ User rights implemented:
  □ Right to access (export their data within 30 days)
  □ Right to erasure (delete their account + data within 30 days)
  □ Right to portability (machine-readable export)
  □ Right to object (opt out of processing)
□ Data breach notification process (72-hour window to notify DPA)
□ Data Protection Officer appointed (if required — large scale processing)
□ Records of Processing Activities (ROPA) maintained
□ Privacy Impact Assessment for high-risk processing

Penalties for non-compliance: up to €20M or 4% of global annual revenue
```

### CCPA (California) Compliance Checklist
```
□ "Do Not Sell My Personal Information" link on homepage (if applicable)
□ Privacy notice at collection (at each data collection point)
□ Process for verifying consumer identity before honoring requests
□ Consumer rights implemented:
  □ Right to know (what data collected, why, who shared with)
  □ Right to delete
  □ Right to opt-out of sale
  □ Right to non-discrimination (can't penalize for exercising rights)
□ Respond to requests within 45 days

Applies to: California businesses with > $25M revenue OR processes data of 100k+ consumers
```

## Intellectual Property Protection

### Copyright (automatic — no registration needed)
```
What's protected automatically: code, content, graphics, documentation you create
Duration: life of author + 70 years (US)

What it protects: copying — NOT ideas or functionality
What to do: add copyright notice: "© [Year] [Company Name]. All rights reserved."

Work-for-hire: content created by employees = company owns it
Contractors: MUST have explicit IP assignment clause in contract
           Without it: contractor owns the IP, not you
```

### Trademark (register this)
```
What it protects: your brand name, logo, slogan
Duration: indefinitely with renewal

Why register:
  - Exclusive right to use mark in your category
  - Legal presumption of ownership
  - Can sue for damages + attorneys' fees
  - Blocks others from registering similar marks

US process: file with USPTO (~$250-350 per class)
  Timeline: 8-12 months
  Use "™" while pending, "®" after registration

Before filing: trademark search (check USPTO, Google, domain availability)
Conflicts: even unregistered marks can block registration if same category
```

### Patents
```
What it protects: inventions, novel methods, new functionality
Duration: 20 years from filing (utility), 15 years (design)

Provisional patent: 
  - $320 for small entity (under 500 employees)
  - Gives "patent pending" status for 1 year
  - Low cost way to establish priority date

When to patent:
  - Core innovation that gives competitive advantage
  - Technology that can be reverse-engineered from the product
  - When investors/acquirers expect a patent portfolio

When NOT to patent (usually):
  - Software-only innovations (hard to enforce, narrow protection)
  - When speed-to-market + trade secrets are better strategy
  - When the cost ($15-50k with lawyer) isn't justified
```

### Trade Secrets
```
What it protects: any business information that gives competitive advantage
Requirements: must be kept confidential, reasonable steps to protect
Duration: unlimited as long as secrecy maintained

Protection measures:
  □ NDAs with employees, contractors, partners
  □ Access controls (need-to-know only)
  □ Exit interview reminders
  □ Clear labeling of confidential materials
  □ Secure storage and transmission
```

## Essential Contracts

### Employment Agreement (must have before first hire)
```
Key clauses:
  □ Compensation + benefits
  □ IP assignment (all work product belongs to company)
  □ Confidentiality / NDA (during and after employment)
  □ Non-solicitation (can't hire away team members for X years)
  □ At-will employment statement (if in US)
  □ Non-compete (if applicable and enforceable in your state)
  □ Dispute resolution
```

### Contractor Agreement (for freelancers)
```
Critical additions vs. employment:
  □ Independent contractor status (NOT employee — tax implications)
  □ IP assignment (contractors own their work by default without this)
  □ Payment terms and schedule
  □ Deliverables and acceptance criteria
  □ Confidentiality
  □ Right to terminate
```

### Customer/Service Agreement
```
For B2B SaaS:
  □ Subscription terms (price, term, renewal)
  □ Service level agreement (SLA — uptime, support response)
  □ Acceptable use policy
  □ Data processing agreement (if handling customer data — required for GDPR)
  □ Limitation of liability (cap damages at fees paid)
  □ Warranty disclaimer
  □ Indemnification
  □ Governing law
```

## Corporate Structure

### Entity Selection Guide
```
Sole Proprietorship: simplest but personal liability is unlimited — avoid for real businesses

LLC (Limited Liability Company):
  ✓ Personal liability protection
  ✓ Pass-through taxation (profits taxed to members, not entity)
  ✓ Flexible management
  Use for: small businesses, side businesses, real estate, not planning to raise VC

C-Corporation:
  ✓ Multiple stock classes (required for VC funding)
  ✓ Easier to grant options (QSBS tax benefit)
  ✓ Delaware C-Corp is standard for startups
  Use for: any company planning to raise venture capital

Delaware C-Corp: incorporate in Delaware even if operating elsewhere
  Reason: established corporate law, investor familiarity, court system
  Delaware agent: ~$50/year
  Delaware franchise tax: ~$400-$500/year minimum
```

### Equity and Vesting
```
Standard vesting schedule: 4 years with 1-year cliff
  - Nothing vests until month 12 (cliff)
  - After cliff: 25% vests immediately
  - Remaining 75% vests monthly over next 36 months

Stock option pool:
  - Typically 10-20% of fully diluted shares
  - Create BEFORE raising money (or investors will want it created from your shares)
  
83(b) election (critical for founders):
  - File within 30 days of receiving restricted stock
  - Locks in low valuation for tax purposes
  - Missing this = massive unexpected tax bill when stock vests
```

## Output
- Privacy policy (with jurisdiction-specific compliance)
- Terms of service
- Legal compliance checklist (GDPR/CCPA if applicable)
- IP protection plan (trademark, copyright, trade secrets)
- Essential contracts list with status

## Quality checks
- [ ] Privacy policy covers all data collected (run data audit first)
- [ ] GDPR compliance if any EU users (not just EU companies)
- [ ] IP assignment in all contractor agreements
- [ ] Trademark search done before launch
- [ ] 83(b) election filed within 30 days of receiving equity (if applicable)
- [ ] Legal review by licensed attorney before using any of these documents
