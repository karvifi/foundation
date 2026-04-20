import { Hono } from "hono";
import type { Context } from "hono";

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

function authUserId(c: Context): string {
  return c.get("auth")?.userId ?? "usr_demo";
}

async function getStripe() {
  const { default: Stripe } = await import("stripe");
  return new Stripe(requireEnv("STRIPE_SECRET_KEY"), { apiVersion: "2025-02-24.acacia" });
}

async function getRedis() {
  const { Redis } = await import("@upstash/redis");
  return new Redis({
    url: requireEnv("UPSTASH_REDIS_REST_URL"),
    token: requireEnv("UPSTASH_REDIS_REST_TOKEN"),
  });
}

const CUSTOMER_KEY = (userId: string) => `stripe:customer:${userId}`;
const SUB_KEY = (userId: string) => `stripe:sub:${userId}`;

export const billingRouter = new Hono();

billingRouter.post("/checkout", async (c) => {
  const userId = authUserId(c);
  const body = (await c.req.json()) as { priceId?: string; successUrl?: string; cancelUrl?: string };

  if (!body.priceId) return c.json({ error: "priceId is required" }, 400);

  const stripe = await getStripe();
  const redis = await getRedis();

  let customerId = await redis.get<string>(CUSTOMER_KEY(userId));

  if (!customerId) {
    const customer = await stripe.customers.create({ metadata: { userId } });
    customerId = customer.id;
    await redis.set(CUSTOMER_KEY(userId), customerId);
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: body.priceId, quantity: 1 }],
    success_url: body.successUrl ?? `${process.env["ALLOWED_ORIGIN"] ?? "http://localhost:3000"}/billing?success=1`,
    cancel_url: body.cancelUrl ?? `${process.env["ALLOWED_ORIGIN"] ?? "http://localhost:3000"}/billing?canceled=1`,
    subscription_data: { metadata: { userId } },
    allow_promotion_codes: true,
  });

  return c.json({ url: session.url });
});

billingRouter.post("/portal", async (c) => {
  const userId = authUserId(c);
  const body = (await c.req.json()) as { returnUrl?: string };

  const redis = await getRedis();
  const customerId = await redis.get<string>(CUSTOMER_KEY(userId));
  if (!customerId) return c.json({ error: "No billing account found" }, 404);

  const stripe = await getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: body.returnUrl ?? `${process.env["ALLOWED_ORIGIN"] ?? "http://localhost:3000"}/billing`,
  });

  return c.json({ url: session.url });
});

billingRouter.post("/webhook", async (c) => {
  const sig = c.req.header("stripe-signature");
  const webhookSecret = requireEnv("STRIPE_WEBHOOK_SECRET");
  const rawBody = await c.req.text();

  const stripe = await getStripe();

  let event: Awaited<ReturnType<typeof stripe.webhooks.constructEventAsync>>;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, sig ?? "", webhookSecret);
  } catch {
    return c.json({ error: "Invalid webhook signature" }, 400);
  }

  const redis = await getRedis();

  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
    const sub = event.data.object as { id: string; customer: string; status: string; metadata?: Record<string, string>; items?: { data: Array<{ price: { id: string } }> }; current_period_end?: number };
    const userId = sub.metadata?.["userId"];
    if (userId) {
      await redis.set(SUB_KEY(userId), {
        subscriptionId: sub.id,
        status: sub.status,
        planId: sub.items?.data[0]?.price.id ?? "",
        currentPeriodEnd: new Date((sub.current_period_end ?? 0) * 1000).toISOString(),
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as { metadata?: Record<string, string> };
    const userId = sub.metadata?.["userId"];
    if (userId) {
      await redis.del(SUB_KEY(userId));
    }
  }

  return c.json({ received: true });
});

billingRouter.get("/status", async (c) => {
  const userId = authUserId(c);
  const redis = await getRedis();

  const [customerId, subscription] = await Promise.all([
    redis.get<string>(CUSTOMER_KEY(userId)),
    redis.get<{ subscriptionId: string; status: string; planId: string; currentPeriodEnd: string }>(SUB_KEY(userId)),
  ]);

  return c.json({
    hasAccount: !!customerId,
    subscription: subscription ?? null,
    isActive: subscription?.status === "active" || subscription?.status === "trialing",
  });
});
