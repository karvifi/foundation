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

interface SprintTask {
  title: string;
  priority: "high" | "medium" | "low";
  estimate: number;
}

function mockSprintTasks(): SprintTask[] {
  return [
    { title: "Define data model and persistence layer", priority: "high", estimate: 5 },
    { title: "Build REST API scaffolding and auth wiring", priority: "high", estimate: 3 },
    { title: "Implement core CRUD endpoints", priority: "high", estimate: 5 },
    { title: "Write integration tests for endpoints", priority: "medium", estimate: 3 },
    { title: "Design UI surfaces for primary flows", priority: "medium", estimate: 5 },
    { title: "Wire client data layer and optimistic updates", priority: "medium", estimate: 3 },
    { title: "Add observability (logs, metrics, traces)", priority: "low", estimate: 2 },
    { title: "Document public API and internal contracts", priority: "low", estimate: 2 },
  ];
}

async function generateSprintFromContent(contentText: string): Promise<SprintTask[]> {
  const apiKey = process.env["ANTHROPIC_API_KEY"];
  if (!apiKey) return mockSprintTasks();

  try {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey });
    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system:
        'Extract actionable engineering tasks. Return ONLY a JSON array: [{"title": string, "priority": "high"|"medium"|"low", "estimate": number}]. Max 10 tasks.',
      messages: [
        {
          role: "user",
          content: `Generate sprint tasks from this spec:\n\n${contentText.slice(0, 8000)}`,
        },
      ],
    });

    const text = msg.content
      .filter((block) => block.type === "text")
      .map((block) => ("text" in block ? (block.text as string) : ""))
      .join("\n");

    const match = text.match(/\[[\s\S]*\]/);
    if (!match) return mockSprintTasks();

    const parsed = JSON.parse(match[0]) as unknown;
    if (!Array.isArray(parsed)) return mockSprintTasks();

    const tasks: SprintTask[] = [];
    for (const item of parsed.slice(0, 10)) {
      if (!item || typeof item !== "object") continue;
      const record = item as Record<string, unknown>;
      const title = typeof record["title"] === "string" ? record["title"] : null;
      const priorityRaw = record["priority"];
      const priority: SprintTask["priority"] =
        priorityRaw === "high" || priorityRaw === "medium" || priorityRaw === "low"
          ? priorityRaw
          : "medium";
      const estimate = typeof record["estimate"] === "number" ? record["estimate"] : 3;
      if (!title) continue;
      tasks.push({ title, priority, estimate });
    }
    return tasks.length > 0 ? tasks : mockSprintTasks();
  } catch (err) {
    console.error("[documents/generate-sprint] anthropic error", err);
    return mockSprintTasks();
  }
}

export const documentsRouter = new Hono();

documentsRouter.get("/", async (c) => {
  try {
    const { workspaceId } = auth(c);
    const db = await getDb();
    if (!db) return c.json({ error: "Service unavailable" }, 503);

    const { documents } = await import("@sso/db");
    const { eq, and, isNull, isNotNull, desc } = await import("drizzle-orm");

    const search = c.req.query("search")?.trim();
    const starredQ = c.req.query("starred");
    const archivedQ = c.req.query("archived");

    const conditions = [eq(documents.workspaceId, workspaceId), isNull(documents.deletedAt)];
    if (starredQ === "true") conditions.push(eq(documents.starred, true));
    if (archivedQ === "true") conditions.push(isNotNull(documents.archivedAt));
    else if (archivedQ !== "all") conditions.push(isNull(documents.archivedAt));

    let rows = await db.select().from(documents).where(and(...conditions)).orderBy(desc(documents.updatedAt)).limit(200);

    if (search) {
      const needle = search.toLowerCase();
      rows = rows.filter((row) => {
        const title = row.title?.toLowerCase() ?? "";
        const body = row.contentText?.toLowerCase() ?? "";
        return title.includes(needle) || body.includes(needle);
      });
    }

    return c.json({ data: rows });
  } catch (err) {
    console.error("[documents/list]", err);
    return c.json({ error: "Failed to list documents" }, 500);
  }
});

documentsRouter.get("/:id", async (c) => {
  try {
    const { workspaceId } = auth(c);
    const db = await getDb();
    if (!db) return c.json({ error: "Service unavailable" }, 503);

    const { documents } = await import("@sso/db");
    const { eq, and } = await import("drizzle-orm");

    const [row] = await db
      .select()
      .from(documents)
      .where(and(eq(documents.id, c.req.param("id")), eq(documents.workspaceId, workspaceId)))
      .limit(1);

    if (!row || row.deletedAt) return c.json({ error: "Document not found" }, 404);
    return c.json({ data: row });
  } catch (err) {
    console.error("[documents/get]", err);
    return c.json({ error: "Failed to fetch document" }, 500);
  }
});

documentsRouter.post("/", async (c) => {
  try {
    const { workspaceId, userId } = auth(c);
    const db = await getDb();
    if (!db) return c.json({ error: "Service unavailable" }, 503);

    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    if (typeof body !== "object" || body === null) return c.json({ error: "Invalid body" }, 400);

    const { title, icon, parentId } = body as Record<string, unknown>;

    const { documents } = await import("@sso/db");
    const [row] = await db
      .insert(documents)
      .values({
        workspaceId,
        ownerId: userId,
        title: typeof title === "string" && title.length > 0 ? title : "Untitled",
        icon: typeof icon === "string" ? icon : undefined,
        parentId: typeof parentId === "string" ? parentId : null,
      })
      .returning();

    if (!row) return c.json({ error: "Failed to create document" }, 500);
    return c.json({ data: row }, 201);
  } catch (err) {
    console.error("[documents/create]", err);
    return c.json({ error: "Failed to create document" }, 500);
  }
});

documentsRouter.patch("/:id", async (c) => {
  try {
    const { workspaceId } = auth(c);
    const db = await getDb();
    if (!db) return c.json({ error: "Service unavailable" }, 503);

    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }
    if (typeof body !== "object" || body === null) return c.json({ error: "Invalid body" }, 400);

    const { title, content, icon, starred, isPublished } = body as Record<string, unknown>;
    const patch: Record<string, unknown> = { updatedAt: new Date() };
    if (typeof title === "string") patch["title"] = title;
    if (content !== undefined) {
      patch["content"] = content;
      if (typeof content === "string") patch["contentText"] = content;
      else if (content && typeof content === "object") {
        patch["contentText"] = JSON.stringify(content).slice(0, 50000);
      }
    }
    if (typeof icon === "string") patch["icon"] = icon;
    if (typeof starred === "boolean") patch["starred"] = starred;
    if (typeof isPublished === "boolean") patch["isPublished"] = isPublished;

    const { documents } = await import("@sso/db");
    const { eq, and } = await import("drizzle-orm");

    const [row] = await db
      .update(documents)
      .set(patch)
      .where(and(eq(documents.id, c.req.param("id")), eq(documents.workspaceId, workspaceId)))
      .returning();

    if (!row) return c.json({ error: "Document not found" }, 404);
    return c.json({ data: row });
  } catch (err) {
    console.error("[documents/update]", err);
    return c.json({ error: "Failed to update document" }, 500);
  }
});

documentsRouter.delete("/:id", async (c) => {
  try {
    const { workspaceId } = auth(c);
    const db = await getDb();
    if (!db) return c.json({ error: "Service unavailable" }, 503);

    const { documents } = await import("@sso/db");
    const { eq, and } = await import("drizzle-orm");

    const [row] = await db
      .update(documents)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(documents.id, c.req.param("id")), eq(documents.workspaceId, workspaceId)))
      .returning();

    if (!row) return c.json({ error: "Document not found" }, 404);
    return c.json({ data: { id: row.id, deletedAt: row.deletedAt } });
  } catch (err) {
    console.error("[documents/delete]", err);
    return c.json({ error: "Failed to delete document" }, 500);
  }
});

documentsRouter.post("/:id/generate-sprint", async (c) => {
  try {
    const { workspaceId } = auth(c);
    const db = await getDb();
    if (!db) return c.json({ error: "Service unavailable" }, 503);

    const { documents } = await import("@sso/db");
    const { eq, and } = await import("drizzle-orm");

    const [doc] = await db
      .select()
      .from(documents)
      .where(and(eq(documents.id, c.req.param("id")), eq(documents.workspaceId, workspaceId)))
      .limit(1);

    if (!doc || doc.deletedAt) return c.json({ error: "Document not found" }, 404);

    const source = doc.contentText ?? (doc.content ? JSON.stringify(doc.content) : doc.title ?? "");
    const tasks = await generateSprintFromContent(source);
    return c.json({ data: { tasks } });
  } catch (err) {
    console.error("[documents/generate-sprint]", err);
    return c.json({ error: "Failed to generate sprint" }, 500);
  }
});

export { generateSprintFromContent };
