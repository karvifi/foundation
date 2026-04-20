"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    emailRef.current?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = (await res.json()) as { accessToken?: string; error?: string };
      if (!res.ok || !data.accessToken) {
        throw new Error(data.error ?? "Invalid credentials");
      }
      setAuth(data.accessToken);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
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
            Secure Access
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
            Welcome back
          </h1>
          <p style={{ fontSize: 14, color: "oklch(48% 0.01 265)", lineHeight: 1.5 }}>
            Sign in to your OmniOS workspace
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              style={{ display: "block", fontSize: 12, fontWeight: 600, color: "oklch(58% 0.01 265)", marginBottom: 6, letterSpacing: "0.02em" }}
            >
              Email address
            </label>
            <input
              ref={emailRef}
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
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <label
                htmlFor="password"
                style={{ fontSize: 12, fontWeight: 600, color: "oklch(58% 0.01 265)", letterSpacing: "0.02em" }}
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                style={{ fontSize: 12, color: "oklch(63% 0.22 265)", textDecoration: "none", fontWeight: 500 }}
              >
                Forgot password?
              </Link>
            </div>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
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
          </div>

          {/* Remember me */}
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}>
            <div
              onClick={() => setRemember((v) => !v)}
              style={{
                width: 18,
                height: 18,
                borderRadius: 5,
                border: `1.5px solid ${remember ? "oklch(63% 0.22 265)" : "oklch(30% 0.01 265)"}`,
                background: remember ? "oklch(63% 0.22 265)" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
            >
              {remember && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span style={{ fontSize: 13, color: "oklch(55% 0.01 265)" }}>Keep me signed in</span>
          </label>

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
                Signing in…
              </>
            ) : (
              <>
                Sign in
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
          <div style={{ flex: 1, height: 1, background: "oklch(100% 0 0 / 0.06)" }} />
          <span style={{ fontSize: 12, color: "oklch(36% 0.01 265)" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "oklch(100% 0 0 / 0.06)" }} />
        </div>

        {/* SSO */}
        <button
          type="button"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 12,
            border: "1px solid oklch(100% 0 0 / 0.07)",
            background: "oklch(14% 0.01 265)",
            color: "oklch(68% 0.01 265)",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "border-color 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "oklch(100% 0 0 / 0.14)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "oklch(100% 0 0 / 0.07)"; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          Continue with SSO
        </button>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "oklch(42% 0.01 265)" }}>
          Don&apos;t have an account?{" "}
          <Link href="/register" style={{ color: "oklch(63% 0.22 265)", textDecoration: "none", fontWeight: 600 }}>
            Request access
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
