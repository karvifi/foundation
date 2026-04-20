"use client";

import { useState, useRef } from "react";

type State = "idle" | "loading" | "success" | "error";

export function WaitlistForm({ className = "" }: { className?: string }) {
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = inputRef.current?.value.trim() ?? "";
    if (!email) return;

    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (data.ok) {
        setState("success");
      } else {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setState("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className={`waitlist-success ${className}`}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          style={{ color: "#6366F1", flexShrink: 0 }}
        >
          <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.15" />
          <path
            d="M6 10l3 3 5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p style={{ margin: 0 }}>
          <strong>You're on the list.</strong> Check your inbox — we sent you
          early access details.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`waitlist-form ${className}`}>
      <input
        ref={inputRef}
        type="email"
        name="email"
        placeholder="your@email.com"
        required
        disabled={state === "loading"}
        className="waitlist-input"
        aria-label="Email address for early access"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="waitlist-btn"
      >
        {state === "loading" ? "Joining…" : "Get early access →"}
      </button>
      {state === "error" && (
        <p className="waitlist-error" role="alert">
          {errorMsg}
        </p>
      )}
    </form>
  );
}
