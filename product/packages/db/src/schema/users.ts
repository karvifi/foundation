import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

function ulid(): string {
  return `usr_${Math.random().toString(36).slice(2, 18)}`;
}

export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(ulid),
  orgId: text("org_id").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("member"),
  inviteToken: text("invite_token"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
