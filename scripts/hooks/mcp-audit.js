/**
 * MCP Audit Hook
 */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..", "..");
const outDir = path.join(root, ".memory");
const outFile = path.join(outDir, "mcp-audit.log");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const evt = process.env.MCP_EVENT || "unknown-event";
const detail = process.env.MCP_DETAIL || "";
const line = `[${new Date().toISOString()}] ${evt} ${detail}`.trim() + "\n";
fs.appendFileSync(outFile, line);
process.exit(0);
