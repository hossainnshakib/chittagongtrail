/** Explicit submit intents are the only way content status may change. */
export function statusFromIntent(intent: unknown, fallback: unknown): string {
  const currentStatus = typeof fallback === "string" ? fallback : "DRAFT";

  if (intent === "publish") return "PUBLISHED";
  if (intent === "save-draft") return "DRAFT";
  if (intent === "archive") return "ARCHIVED";
  return currentStatus;
}
