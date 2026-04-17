/**
 * Suggest Compact Hook
 * Suggests /compact when approaching context limits.
 */
const COMPACT_THRESHOLD = 0.70;
const CONTEXT_WINDOWS = {
  "claude-opus-4-5": 200000,
  "claude-sonnet-4-5": 200000,
  "claude-haiku-4-5": 200000,
  default: 200000,
};

if (process.env.COMPACT_SUGGESTER_DISABLED === "true") process.exit(0);

const used = parseInt(process.env.CONTEXT_TOKENS_USED || "0");
const model = process.env.MODEL || "default";
const maxTokens = CONTEXT_WINDOWS[model] || CONTEXT_WINDOWS.default;

if (used === 0) process.exit(0);

if (used / maxTokens >= COMPACT_THRESHOLD) {
  const percent = Math.round((used / maxTokens) * 100);
  console.log(`
⚡ CONTEXT AT ${percent}% (${used.toLocaleString()} / ${maxTokens.toLocaleString()} tokens)

Consider compacting: /compact
Why compact at 70%? Compacting at 95% degrades quality.
`);
}
process.exit(0);
