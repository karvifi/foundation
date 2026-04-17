/**
 * Env Guard Hook — Blocks access to secret-bearing file types.
 */
const filePath = process.env.FILE_PATH || process.argv[2] || "";
const blocked = /\.(env|pem|key|cert|p12|pfx)$/i;
if (blocked.test(filePath)) {
  console.error(`Blocked sensitive file read: ${filePath}`);
  process.exit(1);
}
process.exit(0);
