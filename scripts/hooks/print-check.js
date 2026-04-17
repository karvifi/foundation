/**
 * Print Check Hook
 */
const fs = require("fs");
const filePath = process.env.FILE_PATH || process.argv[2] || "";
if (!filePath || !fs.existsSync(filePath)) process.exit(0);
if (/test_/i.test(filePath)) process.exit(0);
const content = fs.readFileSync(filePath, "utf8");
if (/\bprint\(/.test(content)) {
  console.warn(`Warning: print() detected in ${filePath}`);
}
process.exit(0);
