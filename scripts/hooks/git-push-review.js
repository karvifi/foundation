/**
 * Git Push Review Hook
 */
const ack = (process.env.PUSH_REVIEW_ACK || "").toLowerCase();
if (ack !== "yes") {
  console.error("Push blocked: set PUSH_REVIEW_ACK=yes after confirming tests/security/docs.");
  process.exit(1);
}
process.exit(0);
