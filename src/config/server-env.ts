import "server-only";
import * as z from "zod";

const serverEnvSchema = z.object({
  /** Laravel API base URL including the version prefix, e.g. http://localhost:8000/api/v1 */
  API_BASE_URL: z.url(),
  /** Per-request timeout for calls to the Laravel API. */
  API_TIMEOUT_MS: z.coerce.number().int().positive().default(10_000),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

/**
 * Parsed lazily so `next build` does not require runtime secrets; the first
 * request fails loudly if configuration is missing or malformed.
 */
export function getServerEnv(): ServerEnv {
  const parsed = serverEnvSchema.safeParse({
    API_BASE_URL: process.env.API_BASE_URL,
    API_TIMEOUT_MS: process.env.API_TIMEOUT_MS,
  });

  if (!parsed.success) {
    throw new Error(`Invalid server environment: ${z.prettifyError(parsed.error)}`);
  }

  return parsed.data;
}

