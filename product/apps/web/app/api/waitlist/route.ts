import { Resend } from "resend";
import type { NextRequest } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email =
    body !== null && typeof body === "object" && "email" in body
      ? String((body as { email: unknown }).email).trim().toLowerCase()
      : "";

  if (!EMAIL_RE.test(email)) {
    return Response.json({ error: "Invalid email address." }, { status: 422 });
  }

  if (!process.env.RESEND_API_KEY) {
    return Response.json(
      { error: "Email service not configured." },
      { status: 503 }
    );
  }

  const { error } = await resend.emails.send({
    from: "OmniOS Early Access <hello@omnios.app>",
    to: [email],
    subject: "You're on the OmniOS waitlist 🎯",
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;background:#0A0A0F;color:#F8F8FF;padding:48px 40px;border-radius:12px">
        <div style="font-size:28px;font-weight:800;margin-bottom:24px">
          <span style="color:#6366F1">Omni</span>OS
        </div>
        <h1 style="font-size:22px;font-weight:700;margin:0 0 16px">You're in. Welcome to the waitlist.</h1>
        <p style="color:rgba(248,248,255,0.7);line-height:1.6;margin:0 0 24px">
          We're building the last workspace you'll ever need — an intent-native OS that replaces every fragmented SaaS tool with one command.
        </p>
        <div style="background:rgba(99,102,241,0.12);border:1px solid rgba(99,102,241,0.3);border-radius:8px;padding:20px 24px;margin-bottom:32px">
          <p style="margin:0;font-size:14px;color:rgba(248,248,255,0.6)">What you unlock early</p>
          <ul style="margin:8px 0 0;padding-left:20px;color:#F8F8FF;line-height:2">
            <li>50% founding-member discount — locked for life</li>
            <li>Local AI inference (your data never leaves your device)</li>
            <li>Direct access to the founders for feature input</li>
          </ul>
        </div>
        <p style="color:rgba(248,248,255,0.4);font-size:13px;margin:0">
          omnios.app · OmniOS, Inc. · You're receiving this because you signed up at omnios.app
        </p>
      </div>
    `,
  });

  if (error) {
    return Response.json(
      { error: "Failed to send confirmation." },
      { status: 500 }
    );
  }

  await resend.emails.send({
    from: "OmniOS Waitlist <hello@omnios.app>",
    to: ["hello@omnios.app"],
    subject: `New waitlist signup: ${email}`,
    html: `<p>New early access signup: <strong>${email}</strong></p>`,
  });

  return Response.json({ ok: true });
}
