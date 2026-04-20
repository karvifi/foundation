import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title =
    searchParams.get("title") ??
    "OmniOS — The Intent-Native Operating System";
  const subtitle =
    searchParams.get("subtitle") ??
    "Replace $43,000/year in SaaS tools with one AI-native OS from $20/month.";
  const tag = searchParams.get("tag") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#0A0A0F",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Indigo glow */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-80px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)",
          }}
        />
        {/* Gold glow bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-60px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Top: logo + tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1,
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              O
            </div>
            <span
              style={{
                fontSize: "26px",
                fontWeight: "700",
                color: "#F8F8FF",
                letterSpacing: "-0.5px",
              }}
            >
              OmniOS
            </span>
          </div>

          {/* Tag badge */}
          {tag ? (
            <div
              style={{
                background: "rgba(99,102,241,0.2)",
                border: "1px solid rgba(99,102,241,0.4)",
                borderRadius: "999px",
                padding: "6px 18px",
                fontSize: "14px",
                color: "#A5B4FC",
                letterSpacing: "0.5px",
              }}
            >
              {tag}
            </div>
          ) : null}
        </div>

        {/* Middle: main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            zIndex: 1,
          }}
        >
          <h1
            style={{
              fontSize: title.length > 50 ? "42px" : "52px",
              fontWeight: "800",
              color: "#F8F8FF",
              lineHeight: "1.1",
              letterSpacing: "-1px",
              margin: 0,
              maxWidth: "900px",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: "22px",
              color: "rgba(248,248,255,0.65)",
              margin: 0,
              maxWidth: "760px",
              lineHeight: "1.4",
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Bottom: stats strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", gap: "40px" }}>
            {[
              { val: "$43K", label: "annual SaaS savings" },
              { val: "1 OS", label: "for every workflow" },
              { val: "0 data", label: "leaves your device" },
            ].map((stat) => (
              <div
                key={stat.val}
                style={{ display: "flex", flexDirection: "column", gap: "2px" }}
              >
                <span
                  style={{
                    fontSize: "28px",
                    fontWeight: "800",
                    color: "#D4AF37",
                  }}
                >
                  {stat.val}
                </span>
                <span style={{ fontSize: "13px", color: "rgba(248,248,255,0.5)" }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          <span
            style={{
              fontSize: "18px",
              color: "#D4AF37",
              fontWeight: "600",
              letterSpacing: "0.5px",
            }}
          >
            omnios.app
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
