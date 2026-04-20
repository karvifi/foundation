"use client";

import { useEffect, useRef } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; alpha: number; r: number }[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function spawn() {
      if (!canvas) return;
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.4 + 0.05,
        r: Math.random() * 1.5 + 0.5,
      });
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(63% 0.22 265 / ${p.alpha})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    }

    resize();
    for (let i = 0; i < 80; i++) spawn();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "oklch(7% 0.012 265)", position: "relative", overflow: "hidden" }}>
      {/* Ambient glow */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60%)",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: "radial-gradient(circle, oklch(63% 0.22 265 / 0.07) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {/* Grid overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "linear-gradient(oklch(100% 0 0 / 0.025) 1px, transparent 1px), linear-gradient(90deg, oklch(100% 0 0 / 0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
      />

      {/* Logo */}
      <div
        style={{
          position: "fixed",
          top: 32,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "linear-gradient(135deg, oklch(63% 0.22 265), oklch(50% 0.25 290))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 20px oklch(63% 0.22 265 / 0.4)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2L15.5 5.75V12.25L9 16L2.5 12.25V5.75L9 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M9 6L12 7.75V11.25L9 13L6 11.25V7.75L9 6Z" fill="white" opacity="0.8" />
          </svg>
        </div>
        <span
          style={{
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "oklch(92% 0.01 265)",
          }}
        >
          OmniOS
        </span>
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 24px 48px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>{children}</div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 12,
          color: "oklch(36% 0.01 265)",
          zIndex: 10,
          letterSpacing: "0.02em",
        }}
      >
        © 2025 OmniOS · Enterprise Intelligence Platform
      </div>
    </div>
  );
}
