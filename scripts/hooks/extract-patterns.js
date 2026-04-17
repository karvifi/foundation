/**
 * Pattern Extractor Hook
 */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..", "..");
const outDir = path.join(root, ".memory");
const outFile = path.join(outDir, "pattern-capture.log");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const summary = process.env.SESSION_SUMMARY || "session completed";
const timestamp = new Date().toISOString();
fs.appendFileSync(outFile, `[${timestamp}] ${summary}\n`);
console.log("Pattern capture saved.");
process.exit(0);
