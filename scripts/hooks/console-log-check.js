/**
 * Console Log Check Hook
 */
const fs = require("fs");
const filePath = process.env.FILE_PATH || process.argv[2] || "";
if (!filePath || !fs.existsSync(filePath)) process.exit(0);
const content = fs.readFileSync(filePath, "utf8");
if (content.includes("console.log(")) {
  console.warn(`Warning: console.log detected in ${filePath}`);
}
process.exit(0);
