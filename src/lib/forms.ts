import type * as z from "zod";
import { type FieldErrors, isApiError } from "./api/errors";

/**
 * Result shape for Server Actions used with React's useActionState. Designed
 * forms render `message` as a banner and `fieldErrors[name][0]` under inputs.
 */
export type FormState =
  | { status: "idle" }
  | { status: "success"; message?: string }
  | { status: "error"; message: string; fieldErrors: FieldErrors };

export const initialFormState: FormState = { status: "idle" };

const RATE_LIMITED = "محاولات كثيرة. يرجى المحاولة مرة أخرى بعد قليل.";
const UNEXPECTED = "حدث خطأ غير متوقع. حاول مرة أخرى، وإن استمرت المشكلة تواصل معنا.";
const INVALID_INPUT = "يرجى مراجعة الحقول المظللة.";

export function validationFailure(error: z.ZodError): FormState {
  const fieldErrors: FieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path.join(".");
    (fieldErrors[field] ??= []).push(issue.message);
  }

  return { status: "error", message: INVALID_INPUT, fieldErrors };
}

/** Maps an API failure to safe, specific user-facing copy (CLAUDE.md §125). */
export function apiFailure(error: unknown): FormState {
  if (!isApiError(error)) {
    return { status: "error", message: UNEXPECTED, fieldErrors: {} };
  }

  if (error.isRateLimited) {
    return { status: "error", message: RATE_LIMITED, fieldErrors: {} };
  }

  if (error.isValidation) {
    const firstFieldMessage = Object.values(error.fieldErrors)[0]?.[0];

    return { status: "error", message: firstFieldMessage ?? error.message, fieldErrors: error.fieldErrors };
  }

  if (error.status >= 500) {
    return { status: "error", message: UNEXPECTED, fieldErrors: {} };
  }

  return { status: "error", message: error.message, fieldErrors: {} };
}
