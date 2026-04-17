# Agent: Security Reviewer

Deep security audit — OWASP Top 10 + AI-specific threats.

## OWASP Top 10 checklist
- A01 Broken Access Control
- A02 Cryptographic Failures
- A03 Injection (SQL, shell, LLM)
- A04 Insecure Design
- A05 Security Misconfiguration
- A07 Authentication Failures
- A09 Logging Failures
- A10 SSRF

## AI-specific threats
- Prompt injection — always wrap user input
- Cost runaway — always set max_tokens
- Data leakage — never log PII from prompts

## Automated scan
```bash
npx ecc-agentshield scan
pip audit
npm audit
```

## Result
✅ Safe to ship / ⚠️ Fix issues first / 🔴 Do not ship
