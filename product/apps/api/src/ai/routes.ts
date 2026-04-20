import { Hono } from "hono";
import { stream } from "hono/streaming";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  messages?: ChatMessage[];
  workspaceContext?: string;
}

const SYSTEM_PROMPT = [
  "You are OmniMind, an AI operating system intelligence for OmniOS.",
  "You reason across the user's entire workspace: docs, tasks, CRM records, email, calendar, and running workflows.",
  "Always ground answers in the workspace context when it is supplied. If context is missing, say so plainly.",
  "Respond in concise Markdown. Use bold for entity names, short lists for enumerations, and inline code for identifiers.",
  "Never invent data, hallucinate documents, or fabricate metrics. Prefer 'I don't have that yet' over guessing.",
].join(" ");

const MAX_TOKENS = 2048;
const MODEL_ID = "claude-haiku-4-5-20251001";
const SSE_DONE = "data: [DONE]\n\n";

function isValidMessage(value: unknown): value is ChatMessage {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<ChatMessage>;
  return (
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string"
  );
}

function buildSystemPrompt(workspaceContext?: string): string {
  if (!workspaceContext || workspaceContext.trim().length === 0) {
    return SYSTEM_PROMPT;
  }
  return `${SYSTEM_PROMPT}\n\n<workspace-context>\n${workspaceContext.trim()}\n</workspace-context>`;
}

function encodeSseData(payload: Record<string, unknown>): string {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

export const aiRouter = new Hono();

aiRouter.post("/chat", async (c) => {
  const auth = c.get("auth");
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  let body: ChatRequestBody;
  try {
    body = (await c.req.json()) as ChatRequestBody;
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const rawMessages = body.messages;
  if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
    return c.json({ error: "messages is required and must be a non-empty array" }, 400);
  }

  const messages = rawMessages.filter(isValidMessage);
  if (messages.length === 0) {
    return c.json({ error: "messages must contain valid role/content entries" }, 400);
  }

  const apiKey = process.env["ANTHROPIC_API_KEY"];
  if (!apiKey) {
    return c.json({ error: "AI service not configured" }, 500);
  }

  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic({ apiKey });
  const systemPrompt = buildSystemPrompt(body.workspaceContext);

  c.header("Content-Type", "text/event-stream");
  c.header("Cache-Control", "no-cache");
  c.header("X-Accel-Buffering", "no");
  c.header("Connection", "keep-alive");

  return stream(c, async (sseStream) => {
    try {
      const response = client.messages.stream({
        model: MODEL_ID,
        max_tokens: MAX_TOKENS,
        system: systemPrompt,
        messages: messages.map((msg) => ({ role: msg.role, content: msg.content })),
      });

      for await (const event of response) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta" &&
          typeof event.delta.text === "string" &&
          event.delta.text.length > 0
        ) {
          await sseStream.write(encodeSseData({ content: event.delta.text }));
        }
      }

      await sseStream.write(SSE_DONE);
    } catch (err) {
      const message = err instanceof Error ? err.message : "AI stream failed";
      await sseStream.write(encodeSseData({ error: message }));
      await sseStream.write(SSE_DONE);
    }
  });
});
