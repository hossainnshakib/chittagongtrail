import { z } from "zod";

export const META_DESCRIPTION_MAX_LENGTH = 160;
export const META_DESCRIPTION_MAX_ERROR = "Meta description must be 160 characters or fewer";

export const metaDescriptionSchema = z
  .string()
  .trim()
  .max(META_DESCRIPTION_MAX_LENGTH, META_DESCRIPTION_MAX_ERROR);

export function firstZodFieldError(error: unknown, fallback: string): string {
  if (error instanceof z.ZodError) {
    const issue = error.issues[0];
    if (issue) {
      const field = issue.path.join(".");
      return field ? `${field}: ${issue.message}` : issue.message;
    }
  }
  return error instanceof Error ? error.message : fallback;
}
