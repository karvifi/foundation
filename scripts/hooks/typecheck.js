/**
 * Typecheck Hook — Runs tsc --noEmit if tsconfig exists.
 */
const { spawnSync } = require("child_process");
const fs = require("fs");
if (!fs.existsSync("tsconfig.json")) process.exit(0);
const result = spawnSync("npx", ["tsc", "--noEmit"], { stdio: "inherit", shell: true });
process.exit(result.status || 0);
