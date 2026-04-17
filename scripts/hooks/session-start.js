/**
 * Session Start Hook
 * Restores context from memory, reminds about active tasks.
 */

const fs = require("fs");
const path = require("path");

const FOUNDATION_ROOT = path.join(__dirname, "..", "..");
const MEMORY_DIR = path.join(FOUNDATION_ROOT, ".memory");
const SESSION_FILE = path.join(MEMORY_DIR, "last-session.json");

function loadLastSession() {
  if (!fs.existsSync(SESSION_FILE)) return null;
  try { return JSON.parse(fs.readFileSync(SESSION_FILE, "utf8")); }
  catch { return null; }
}

function main() {
  const session = loadLastSession();
  
  if (session) {
    const lines = [`\n📋 CONTEXT RESTORED from last session (${session.date})`];
    if (session.current_task) lines.push(`\n🎯 Active task: ${session.current_task}`);
    if (session.completed?.length) {
      lines.push(`\n✅ Completed:`);
      session.completed.forEach((item) => lines.push(`  • ${item}`));
    }
    if (session.pending?.length) {
      lines.push(`\n⏳ Still pending:`);
      session.pending.forEach((item) => lines.push(`  • ${item}`));
    }
    if (session.blockers?.length) {
      lines.push(`\n⚠️ Known blockers:`);
      session.blockers.forEach((b) => lines.push(`  • ${b}`));
    }
    lines.push(`\nRun /recover to see the full checklist, or just continue working.`);
    console.log(lines.join("\n"));
  } else {
    console.log(`
🚀 Unified AI Foundation — Ready
   • Skills: ${path.join(FOUNDATION_ROOT, "skills/")}
   • Agents: ${path.join(FOUNDATION_ROOT, "agents/")}
   • Checklist: PRE_START_CHECKLIST.md

Starting a new project? Run: python scripts/bootstrap.py
`);
  }
}

main();
