import type { NextRequest } from "next/server";
import { fail, isRecord, ok, readJson } from "../_lib/response";

export interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  title: string;
  phone: string;
  tags: string[];
  engagementScore: number;
  createdAt: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const contacts: Contact[] = [
  {
    id: "ctc_001",
    name: "Ada Lin",
    email: "ada.lin@northwind.io",
    company: "Northwind Labs",
    title: "Head of RevOps",
    phone: "+14155550101",
    tags: ["enterprise", "champion"],
    engagementScore: 0.92,
    createdAt: "2025-11-03T14:22:00.000Z",
  },
  {
    id: "ctc_002",
    name: "Marcus Reed",
    email: "marcus@helio.dev",
    company: "Helio",
    title: "CTO",
    phone: "+12065550199",
    tags: ["mid-market", "evaluator"],
    engagementScore: 0.74,
    createdAt: "2025-12-19T09:11:42.000Z",
  },
  {
    id: "ctc_003",
    name: "Priya Shah",
    email: "priya.shah@orbitalhq.com",
    company: "Orbital HQ",
    title: "VP Marketing",
    phone: "+442071838750",
    tags: ["enterprise"],
    engagementScore: 0.81,
    createdAt: "2026-01-08T18:40:11.000Z",
  },
  {
    id: "ctc_004",
    name: "Diego Alvarez",
    email: "diego@plumecloud.com",
    company: "Plume Cloud",
    title: "Founder",
    phone: "+34915550123",
    tags: ["smb", "trial"],
    engagementScore: 0.55,
    createdAt: "2026-02-14T11:05:00.000Z",
  },
  {
    id: "ctc_005",
    name: "Yuki Tanaka",
    email: "yuki@meridian-ai.jp",
    company: "Meridian AI",
    title: "Product Lead",
    phone: "+81335550110",
    tags: ["mid-market", "champion"],
    engagementScore: 0.88,
    createdAt: "2026-03-02T07:50:30.000Z",
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const pageRaw = Number(searchParams.get("page") ?? "1");
  const limitRaw = Number(searchParams.get("limit") ?? String(DEFAULT_LIMIT));
  const search = (searchParams.get("search") ?? "").trim().toLowerCase();

  const page = Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : 1;
  const limit =
    Number.isFinite(limitRaw) && limitRaw >= 1
      ? Math.min(Math.floor(limitRaw), MAX_LIMIT)
      : DEFAULT_LIMIT;

  const filtered = search
    ? contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.email.toLowerCase().includes(search) ||
          c.company.toLowerCase().includes(search) ||
          c.tags.some((t) => t.toLowerCase().includes(search))
      )
    : contacts;

  const start = (page - 1) * limit;
  const paged = filtered.slice(start, start + limit);

  return ok(
    { contacts: paged, total: filtered.length, page, limit },
    { total: filtered.length, page, limit }
  );
}

export async function POST(req: NextRequest) {
  const body = await readJson(req);
  if (!isRecord(body)) return fail("Invalid JSON body", 400);

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!name) return fail("Field 'name' is required", 400);
  if (!EMAIL_RE.test(email)) return fail("Field 'email' must be a valid email", 422);

  const tagsInput = Array.isArray(body.tags)
    ? body.tags.filter((t): t is string => typeof t === "string")
    : [];

  const created: Contact = {
    id: `ctc_${Math.random().toString(36).slice(2, 10)}`,
    name,
    email,
    company: typeof body.company === "string" ? body.company : "",
    title: typeof body.title === "string" ? body.title : "",
    phone: typeof body.phone === "string" ? body.phone : "",
    tags: tagsInput,
    engagementScore: 0,
    createdAt: new Date().toISOString(),
  };

  return ok(created, undefined, 201);
}
