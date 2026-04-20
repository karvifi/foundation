import { Hono } from "hono";
import type { Context } from "hono";

async function getDb() {
  if (!process.env["DATABASE_URL"]) return null;
  try {
    const { createDb } = await import("@sso/db");
    return await createDb();
  } catch {
    return null;
  }
}

function auth(c: Context): { userId: string; workspaceId: string } {
  const a = c.get("auth");
  return {
    userId: a?.userId ?? "usr_demo",
    workspaceId: a?.workspaceId ?? "ws_demo",
  };
}

type ContactStage = "lead" | "qualified" | "customer" | "churned";
type DealStage = "prospect" | "qualified" | "proposal" | "negotiation" | "won" | "lost";

interface ContactRecord {
  id: string;
  workspaceId: string;
  name: string;
  email: string;
  company: string;
  title: string;
  phone: string;
  stage: ContactStage;
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface DealRecord {
  id: string;
  workspaceId: string;
  title: string;
  contactId: string;
  amount: number;
  currency: string;
  stage: DealStage;
  probability: number;
  closeDate: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

function mockContacts(): ContactRecord[] {
  const now = new Date().toISOString();
  return [
    { id: "ct_1", workspaceId: "ws_demo", name: "Sarah Chen", email: "sarah@northwind.io", company: "Northwind Labs", title: "VP Engineering", phone: "+1 415 555 0142", stage: "customer", tags: ["enterprise", "champion"], notes: "Renewed Q3, exploring add-ons.", createdAt: now, updatedAt: now, deletedAt: null },
    { id: "ct_2", workspaceId: "ws_demo", name: "Marcus Weber", email: "marcus@hexcore.dev", company: "Hexcore", title: "CTO", phone: "+49 30 5550 8821", stage: "qualified", tags: ["warm"], notes: "POC running until Apr 30.", createdAt: now, updatedAt: now, deletedAt: null },
    { id: "ct_3", workspaceId: "ws_demo", name: "Priya Nair", email: "priya@lumenops.com", company: "Lumen Ops", title: "Director of Platform", phone: "+1 650 555 0199", stage: "lead", tags: ["inbound"], notes: "Replied to nurture sequence.", createdAt: now, updatedAt: now, deletedAt: null },
    { id: "ct_4", workspaceId: "ws_demo", name: "Alex Kim", email: "alex@fieldwise.co", company: "Fieldwise", title: "Head of Product", phone: "+1 212 555 0178", stage: "qualified", tags: ["mid-market"], notes: "Demo scheduled Tuesday.", createdAt: now, updatedAt: now, deletedAt: null },
    { id: "ct_5", workspaceId: "ws_demo", name: "Jordan Rivera", email: "jordan@soundwave.fm", company: "Soundwave", title: "CEO", phone: "+1 310 555 0133", stage: "customer", tags: ["smb"], notes: "Loves the product, vocal advocate.", createdAt: now, updatedAt: now, deletedAt: null },
    { id: "ct_6", workspaceId: "ws_demo", name: "Tomás Álvarez", email: "tomas@puerto.ai", company: "Puerto AI", title: "Founder", phone: "+34 91 555 4412", stage: "lead", tags: ["inbound", "ai"], notes: "Needs compliance review.", createdAt: now, updatedAt: now, deletedAt: null },
    { id: "ct_7", workspaceId: "ws_demo", name: "Linh Tran", email: "linh@archstack.io", company: "Archstack", title: "VP Sales", phone: "+1 425 555 0108", stage: "churned", tags: ["winback"], notes: "Churned last quarter, budget cut.", createdAt: now, updatedAt: now, deletedAt: null },
    { id: "ct_8", workspaceId: "ws_demo", name: "Nina Costa", email: "nina@brightfork.com", company: "Brightfork", title: "COO", phone: "+1 646 555 0122", stage: "qualified", tags: ["procurement"], notes: "Reviewing contract redlines.", createdAt: now, updatedAt: now, deletedAt: null },
  ];
}

function mockDeals(): DealRecord[] {
  const now = new Date().toISOString();
  const plus = (d: number) => new Date(Date.now() + d * 86400000).toISOString();
  return [
    { id: "dl_1", workspaceId: "ws_demo", title: "Northwind — Enterprise expansion", contactId: "ct_1", amount: 120000, currency: "USD", stage: "negotiation", probability: 75, closeDate: plus(14), ownerId: "usr_demo", createdAt: now, updatedAt: now },
    { id: "dl_2", workspaceId: "ws_demo", title: "Hexcore — Initial annual", contactId: "ct_2", amount: 48000, currency: "USD", stage: "proposal", probability: 55, closeDate: plus(21), ownerId: "usr_demo", createdAt: now, updatedAt: now },
    { id: "dl_3", workspaceId: "ws_demo", title: "Lumen Ops — Pilot", contactId: "ct_3", amount: 12000, currency: "USD", stage: "qualified", probability: 30, closeDate: plus(45), ownerId: "usr_demo", createdAt: now, updatedAt: now },
    { id: "dl_4", workspaceId: "ws_demo", title: "Fieldwise — Mid-market", contactId: "ct_4", amount: 36000, currency: "USD", stage: "qualified", probability: 40, closeDate: plus(30), ownerId: "usr_demo", createdAt: now, updatedAt: now },
    { id: "dl_5", workspaceId: "ws_demo", title: "Soundwave — Upgrade", contactId: "ct_5", amount: 8400, currency: "USD", stage: "won", probability: 100, closeDate: plus(-3), ownerId: "usr_demo", createdAt: now, updatedAt: now },
    { id: "dl_6", workspaceId: "ws_demo", title: "Puerto AI — Intro", contactId: "ct_6", amount: 18000, currency: "USD", stage: "prospect", probability: 15, closeDate: plus(60), ownerId: "usr_demo", createdAt: now, updatedAt: now },
    { id: "dl_7", workspaceId: "ws_demo", title: "Brightfork — COO sponsor", contactId: "ct_8", amount: 72000, currency: "USD", stage: "proposal", probability: 60, closeDate: plus(18), ownerId: "usr_demo", createdAt: now, updatedAt: now },
  ];
}

export const crmRouter = new Hono();

/* ── Contacts ────────────────────────────────────────────────────────── */

crmRouter.get("/contacts", async (c) => {
  try {
    const { workspaceId } = auth(c);
    const search = c.req.query("search")?.trim().toLowerCase();
    const stage = c.req.query("stage")?.trim();

    const db = await getDb();
    let rows: ContactRecord[] = mockContacts();

    if (db) {
      try {
        const mod = (await import("@sso/db")) as Record<string, unknown>;
        const contactsTable = mod["contacts"];
        if (contactsTable && typeof contactsTable === "object") {
          const { eq, and, isNull, desc } = await import("drizzle-orm");
          const table = contactsTable as { workspaceId: unknown; deletedAt: unknown; updatedAt: unknown };
          const dbRows = (await db
            .select()
            .from(contactsTable as never)
            .where(and(eq(table.workspaceId as never, workspaceId), isNull(table.deletedAt as never)))
            .orderBy(desc(table.updatedAt as never))
            .limit(200)) as ContactRecord[];
          if (dbRows.length > 0) rows = dbRows;
        }
      } catch {
        // fall back to mock
      }
    }

    let filtered = rows.filter((r) => r.workspaceId === workspaceId || r.workspaceId === "ws_demo");
    if (stage) filtered = filtered.filter((r) => r.stage === stage);
    if (search) {
      filtered = filtered.filter((r) =>
        r.name.toLowerCase().includes(search) ||
        r.email.toLowerCase().includes(search) ||
        r.company.toLowerCase().includes(search),
      );
    }

    return c.json({ data: filtered, meta: { total: filtered.length } });
  } catch (err) {
    console.error("[crm/contacts/list]", err);
    return c.json({ error: "Failed to list contacts" }, 500);
  }
});

crmRouter.get("/contacts/:id", async (c) => {
  try {
    const { workspaceId } = auth(c);
    const id = c.req.param("id");
    const row = mockContacts().find((r) => r.id === id);
    if (!row) return c.json({ error: "Contact not found" }, 404);
    if (row.workspaceId !== workspaceId && row.workspaceId !== "ws_demo") {
      return c.json({ error: "Contact not found" }, 404);
    }
    return c.json({ data: row });
  } catch (err) {
    console.error("[crm/contacts/get]", err);
    return c.json({ error: "Failed to fetch contact" }, 500);
  }
});

crmRouter.post("/contacts", async (c) => {
  try {
    const { workspaceId } = auth(c);
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    if (typeof body !== "object" || body === null) return c.json({ error: "Invalid body" }, 400);

    const rec = body as Record<string, unknown>;
    const name = typeof rec["name"] === "string" ? rec["name"] : "";
    const email = typeof rec["email"] === "string" ? rec["email"] : "";
    if (!name.trim() || !email.trim()) {
      return c.json({ error: "name and email are required" }, 400);
    }

    const stageRaw = rec["stage"];
    const stage: ContactStage =
      stageRaw === "lead" || stageRaw === "qualified" || stageRaw === "customer" || stageRaw === "churned"
        ? stageRaw
        : "lead";

    const now = new Date().toISOString();
    const created: ContactRecord = {
      id: `ct_${Date.now().toString(36)}`,
      workspaceId,
      name: name.trim(),
      email: email.trim(),
      company: typeof rec["company"] === "string" ? rec["company"] : "",
      title: typeof rec["title"] === "string" ? rec["title"] : "",
      phone: typeof rec["phone"] === "string" ? rec["phone"] : "",
      stage,
      tags: Array.isArray(rec["tags"]) ? (rec["tags"] as unknown[]).filter((t): t is string => typeof t === "string") : [],
      notes: typeof rec["notes"] === "string" ? rec["notes"] : "",
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    return c.json({ data: created }, 201);
  } catch (err) {
    console.error("[crm/contacts/create]", err);
    return c.json({ error: "Failed to create contact" }, 500);
  }
});

crmRouter.patch("/contacts/:id", async (c) => {
  try {
    const { workspaceId } = auth(c);
    const id = c.req.param("id");
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    if (typeof body !== "object" || body === null) return c.json({ error: "Invalid body" }, 400);

    const base = mockContacts().find((r) => r.id === id);
    if (!base) return c.json({ error: "Contact not found" }, 404);

    const rec = body as Record<string, unknown>;
    const stageRaw = rec["stage"];
    const stage: ContactStage =
      stageRaw === "lead" || stageRaw === "qualified" || stageRaw === "customer" || stageRaw === "churned"
        ? stageRaw
        : base.stage;

    const updated: ContactRecord = {
      ...base,
      workspaceId,
      name: typeof rec["name"] === "string" ? rec["name"] : base.name,
      email: typeof rec["email"] === "string" ? rec["email"] : base.email,
      company: typeof rec["company"] === "string" ? rec["company"] : base.company,
      title: typeof rec["title"] === "string" ? rec["title"] : base.title,
      phone: typeof rec["phone"] === "string" ? rec["phone"] : base.phone,
      stage,
      notes: typeof rec["notes"] === "string" ? rec["notes"] : base.notes,
      updatedAt: new Date().toISOString(),
    };

    return c.json({ data: updated });
  } catch (err) {
    console.error("[crm/contacts/update]", err);
    return c.json({ error: "Failed to update contact" }, 500);
  }
});

crmRouter.delete("/contacts/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const base = mockContacts().find((r) => r.id === id);
    if (!base) return c.json({ error: "Contact not found" }, 404);
    const deletedAt = new Date().toISOString();
    return c.json({ data: { id, deletedAt } });
  } catch (err) {
    console.error("[crm/contacts/delete]", err);
    return c.json({ error: "Failed to delete contact" }, 500);
  }
});

/* ── Deals ───────────────────────────────────────────────────────────── */

const DEAL_STAGES: DealStage[] = ["prospect", "qualified", "proposal", "negotiation", "won", "lost"];

crmRouter.get("/deals", async (c) => {
  try {
    const { workspaceId } = auth(c);
    const stage = c.req.query("stage")?.trim();
    const all = mockDeals().filter((d) => d.workspaceId === workspaceId || d.workspaceId === "ws_demo");
    const filtered = stage ? all.filter((d) => d.stage === stage) : all;

    const pipeline = DEAL_STAGES.map((s) => {
      const items = filtered.filter((d) => d.stage === s);
      const total = items.reduce((acc, d) => acc + d.amount, 0);
      return { stage: s, count: items.length, total, deals: items };
    });

    return c.json({ data: { pipeline, deals: filtered }, meta: { total: filtered.length } });
  } catch (err) {
    console.error("[crm/deals/list]", err);
    return c.json({ error: "Failed to list deals" }, 500);
  }
});

crmRouter.post("/deals", async (c) => {
  try {
    const { workspaceId, userId } = auth(c);
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    if (typeof body !== "object" || body === null) return c.json({ error: "Invalid body" }, 400);

    const rec = body as Record<string, unknown>;
    const title = typeof rec["title"] === "string" ? rec["title"] : "";
    const contactId = typeof rec["contactId"] === "string" ? rec["contactId"] : "";
    if (!title.trim() || !contactId.trim()) {
      return c.json({ error: "title and contactId are required" }, 400);
    }

    const stageRaw = rec["stage"];
    const stage: DealStage = DEAL_STAGES.includes(stageRaw as DealStage) ? (stageRaw as DealStage) : "prospect";

    const now = new Date().toISOString();
    const created: DealRecord = {
      id: `dl_${Date.now().toString(36)}`,
      workspaceId,
      title: title.trim(),
      contactId,
      amount: typeof rec["amount"] === "number" ? rec["amount"] : 0,
      currency: typeof rec["currency"] === "string" ? rec["currency"] : "USD",
      stage,
      probability: typeof rec["probability"] === "number" ? rec["probability"] : 20,
      closeDate: typeof rec["closeDate"] === "string" ? rec["closeDate"] : now,
      ownerId: userId,
      createdAt: now,
      updatedAt: now,
    };

    return c.json({ data: created }, 201);
  } catch (err) {
    console.error("[crm/deals/create]", err);
    return c.json({ error: "Failed to create deal" }, 500);
  }
});

crmRouter.patch("/deals/:id", async (c) => {
  try {
    const id = c.req.param("id");
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    if (typeof body !== "object" || body === null) return c.json({ error: "Invalid body" }, 400);

    const base = mockDeals().find((d) => d.id === id);
    if (!base) return c.json({ error: "Deal not found" }, 404);

    const rec = body as Record<string, unknown>;
    const stageRaw = rec["stage"];
    const stage: DealStage = DEAL_STAGES.includes(stageRaw as DealStage) ? (stageRaw as DealStage) : base.stage;

    const updated: DealRecord = {
      ...base,
      title: typeof rec["title"] === "string" ? rec["title"] : base.title,
      amount: typeof rec["amount"] === "number" ? rec["amount"] : base.amount,
      stage,
      probability: typeof rec["probability"] === "number" ? rec["probability"] : base.probability,
      closeDate: typeof rec["closeDate"] === "string" ? rec["closeDate"] : base.closeDate,
      updatedAt: new Date().toISOString(),
    };

    return c.json({ data: updated });
  } catch (err) {
    console.error("[crm/deals/update]", err);
    return c.json({ error: "Failed to update deal" }, 500);
  }
});
