/**
 * Secret Detector Hook
 * Scans staged files for accidentally committed secrets.
 */

const { execSync } = require("child_process");

const SECRET_PATTERNS = [
  { pattern: /sk-[a-zA-Z0-9]{48}/, description: "OpenAI API key" },
  { pattern: /sk-ant-[a-zA-Z0-9-_]{95}/, description: "Anthropic API key" },
  { pattern: /AIza[0-9A-Za-z-_]{35}/, description: "Google API key" },
  { pattern: /AKIA[0-9A-Z]{16}/, description: "AWS Access Key ID" },
  { pattern: /[a-zA-Z_]*[Ss][Ee][Cc][Rr][Ee][Tt][a-zA-Z_]*\s*=\s*["'][^"']{8,}["']/, description: "Possible secret assignment" },
  { pattern: /[a-zA-Z_]*[Pp][Aa][Ss][Ss][Ww][Oo][Rr][Dd][a-zA-Z_]*\s*=\s*["'][^"']{4,}["']/, description: "Possible hardcoded password" },
  { pattern: /postgres:\/\/[^:]+:[^@]+@/, description: "PostgreSQL connection string with credentials" },
];

function getStagedContent() {
  try { return execSync("git diff --staged", { encoding: "utf8" }); }
  catch { return ""; }
}

function getStagedFiles() {
  try {
    return execSync("git diff --staged --name-only", { encoding: "utf8" })
      .split("\n").filter(Boolean);
  } catch { return []; }
}

function scan() {
  const stagedFiles = getStagedFiles();
  
  const envFiles = stagedFiles.filter((f) => {
    const basename = f.split("/").pop();
    return basename === ".env" || basename.startsWith(".env.");
  });
  
  if (envFiles.length > 0) {
    console.error(`\n🚨 BLOCKED: Attempting to commit .env files!`);
    console.error(`Files: ${envFiles.join(", ")}`);
    console.error(`\nRun: git reset HEAD ${envFiles.join(" ")}`);
    process.exit(1);
  }
  
  const diff = getStagedContent();
  const violations = [];
  const addedLines = diff.split("\n").filter((line) => line.startsWith("+") && !line.startsWith("+++"));
  
  for (const line of addedLines) {
    for (const { pattern, description } of SECRET_PATTERNS) {
      if (pattern.test(line)) {
        violations.push({ line: line.slice(1), description });
        break;
      }
    }
  }
  
  if (violations.length > 0) {
    console.error(`\n⚠️  POTENTIAL SECRETS DETECTED in staged changes:`);
    violations.forEach(({ line, description }) => {
      console.error(`\n  ${description}:`);
      const displayLine = line.length > 80 ? line.slice(0, 80) + "..." : line;
      console.error(`  ${displayLine}`);
    });
    console.error(`\nIf these are false positives, use environment variables instead.`);
    console.error(`If you are SURE this is not a secret, run: git commit --no-verify\n`);
    process.exit(1);
  }
  
  console.log("✓ No secrets detected in staged files");
}

scan();
