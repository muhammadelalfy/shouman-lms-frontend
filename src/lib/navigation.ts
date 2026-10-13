/**
 * Accepts only same-origin relative paths so a crafted `?redirectTo=` cannot
 * send a user to another site after login (open redirect).
 */
export function safeRedirectPath(candidate: unknown, fallback = "/"): string {
  if (typeof candidate !== "string" || !candidate.startsWith("/")) {
    return fallback;
  }

  if (candidate.startsWith("//") || candidate.startsWith("/\\") || /[\r\n\t]/.test(candidate)) {
    return fallback;
  }

  return candidate;
}

