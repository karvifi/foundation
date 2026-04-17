/**
 * Session End Hook
 * Saves context so the next session can resume seamlessly.
 */

const fs = require("fs");
const path = require("path");

const FOUNDATION_ROOT = path.join(__dirname, "..", "..");
const MEMORY_DIR = path.join(FOUNDATION_ROOT, ".memory");
const SESSION_FILE = path.join(MEMORY_DIR, "last-session.json");

if (!fs.existsSync(MEMORY_DIR)) fs.mkdirSync(MEMORY_DIR, { recursive: true });

const sessionData = {
  date: new Date().toISOString().split("T")[0],
  timestamp: new Date().toISOString(),
  current_task: process.env.CURRENT_TASK || "",
  completed: (process.env.COMPLETED_ITEMS || "").split("|").filter(Boolean),
  pending: (process.env.PENDING_ITEMS || "").split("|").filter(Boolean),
  blockers: (process.env.SESSION_BLOCKERS || "").split("|").filter(Boolean),
  notes: process.env.SESSION_NOTES || "",
};

fs.writeFileSync(SESSION_FILE, JSON.stringify(sessionData, null, 2));

console.log(`
💾 Session saved to .memory/last-session.json
   Task: ${sessionData.current_task || "(none recorded)"}
   Completed: ${sessionData.completed.length} items
   Pending: ${sessionData.pending.length} items

Next session will auto-restore this context.
`);
