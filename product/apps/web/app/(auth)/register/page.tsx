"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function passwordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map: [string, string][] = [
    ["Too weak", "oklch(55% 0.2 20)"],
    ["Weak", "oklch(65% 0.18 40)"],
    ["Fair", "oklch(72% 0.15 80)"],
    ["Strong", "oklch(68% 0.17 155)"],
    ["Excellent", "oklch(63% 0.22 265)"],
  ];
  const [label, color] = map[Math.min(score, 4)]!;
  return { score, label, color };
}

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const strength = password.length > 0 ? passwordStrength(password) : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (strength && strength.score < 2) {
      setError("Please choose a stronger password");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: email.trim(), password, inviteCode: inviteCode.trim() }),
      });
      const data = (await res.json()) as { accessToken?: string; error?: string };
      if (!res.ok || !data.accessToken) {
        throw new Error(data.error ?? "Registration failed");
      }
      setAuth(data.accessToken);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div
        style={{
          background: "oklch(11% 0.014 265 / 0.9)",
          border: "1px solid oklch(100% 0 0 / 0.07)",
          borderRadius: 20,
          padding: "40px 36px",
          backdropFilter: "blur(20px)",
          boxShadow: "0 40px 80px oklch(0% 0 0 / 0.5), 0 0 0 1px oklch(63% 0.22 265 / 0.08)",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 12px",
              borderRadius: 100,
              background: "oklch(63% 0.22 265 / 0.12)",
              border: "1px solid oklch(63% 0.22 265 / 0.2)",
              fontSize: 11,
              fontWeight: 600,
              color: "oklch(72% 0.18 265)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "oklch(72% 0.18 265)", display: "inline-block" }} />
            Invite Only
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: "-0.035em",
              color: "oklch(96% 0.005 265)",
              marginBottom: 8,
              lineHeight: 1.1,
            }}
          >
            Request access
          </h1>
          <p style={{ fontSize: 14, color: "oklch(48% 0.01 265)", lineHeight: 1.5 }}>
            OmniOS is invite-only. Enter your code below.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Invite Code */}
          <div>
            <label
              htmlFor="invite"
              style={{ display: "block", fontSize: 12, fontWeight: 600, color: "oklch(58% 0.01 265)", marginBottom: 6, letterSpacing: "0.02em" }}
            >
              Invite code
            </label>
            <input
              id="invite"
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              required
              placeholder="OMNI-XXXX-XXXX"
              autoComplete="off"
              spellCheck={false}
              style={{
                width: "100%",
                padding: "11px 14px",
                background: "oklch(15% 0.01 265)",
                border: "1px solid oklch(100% 0 0 / 0.08)",
                borderRadius: 10,
                fontSize: 14,
                color: "oklch(94% 0.005 265)",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
                letterSpacing: "0.08em",
                fontFamily: "monospace",
              }}
              onFocus={(e) => { e.target.style.borderColor = "oklch(63% 0.22 265 / 0.5)"; }}
              onBlur={(e) => { e.target.style.borderColor = "oklch(100% 0 0 / 0.08)"; }}
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              style={{ display: "block", fontSize: 12, fontWeight: 600, color: "oklch(58% 0.01 265)", marginBottom: 6, letterSpacing: "0.02em" }}
            >
              Work email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@company.com"
              style={{
                width: "100%",
                padding: "11px 14px",
                background: "oklch(15% 0.01 265)",
                border: "1px solid oklch(100% 0 0 / 0.08)",
                borderRadius: 10,
                fontSize: 14,
                color: "oklch(94% 0.005 265)",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => { e.target.style.borderColor = "oklch(63% 0.22 265 / 0.5)"; }}
              onBlur={(e) => { e.target.style.borderColor = "oklch(100% 0 0 / 0.08)"; }}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              style={{ display: "block", fontSize: 12, fontWeight: 600, color: "oklch(58% 0.01 265)", marginBottom: 6, letterSpacing: "0.02em" }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
                style={{
                  width: "100%",
                  padding: "11px 44px 11px 14px",
                  background: "oklch(15% 0.01 265)",
                  border: "1px solid oklch(100% 0 0 / 0.08)",
                  borderRadius: 10,
                  fontSize: 14,
                  color: "oklch(94% 0.005 265)",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => { e.target.style.borderColor = "oklch(63% 0.22 265 / 0.5)"; }}
                onBlur={(e) => { e.target.style.borderColor = "oklch(100% 0 0 / 0.08)"; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  color: "oklch(45% 0.01 265)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {/* Strength bar */}
            {strength && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 5 }}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: 3,
                        borderRadius: 2,
                        background: i < strength.score ? strength.color : "oklch(22% 0.01 265)",
                        transition: "background 0.3s",
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: 11, color: strength.color, fontWeight: 600 }}>{strength.label}</span>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                background: "oklch(45% 0.2 20 / 0.12)",
                border: "1px solid oklch(55% 0.2 20 / 0.25)",
                fontSize: 13,
                color: "oklch(70% 0.18 20)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: 12,
              border: "none",
              background: loading
                ? "oklch(40% 0.15 265)"
                : "linear-gradient(135deg, oklch(63% 0.22 265), oklch(52% 0.25 285))",
              color: "white",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.01em",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 8px 32px oklch(63% 0.22 265 / 0.35)",
              transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontFamily: "inherit",
            }}
          >
            {loading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  style={{ animation: "spin 0.8s linear infinite" }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Creating account…
              </>
            ) : (
              <>
                Create account
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Terms */}
        <p style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "oklch(36% 0.01 265)", lineHeight: 1.6 }}>
          By creating an account you agree to our{" "}
          <Link href="/terms" style={{ color: "oklch(55% 0.01 265)", textDecoration: "none" }}>Terms</Link>
          {" "}and{" "}
          <Link href="/privacy" style={{ color: "oklch(55% 0.01 265)", textDecoration: "none" }}>Privacy Policy</Link>
        </p>

        <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "oklch(42% 0.01 265)" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "oklch(63% 0.22 265)", textDecoration: "none", fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: oklch(32% 0.01 265); }
      `}</style>
    </div>
  );
}
