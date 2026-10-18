import "server-only";
import { cookies } from "next/headers";

const SESSION_COOKIE = "lms_session";

/**
 * The Laravel API token lives only in an httpOnly cookie on the Next.js
 * origin. Browser JavaScript can never read it (XSS cannot exfiltrate it);
 * server components, server actions and route handlers attach it to API calls.
 */
export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();

  return store.get(SESSION_COOKIE)?.value ?? null;
}

/** Only callable from a Server Action or Route Handler. */
export async function startSession(token: string, expiresAt: string | null): Promise<void> {
  const store = await cookies();

  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    ...(expiresAt ? { expires: new Date(expiresAt) } : {}),
  });
}

/** Only callable from a Server Action or Route Handler. */
export async function endSession(): Promise<void> {
  const store = await cookies();

  store.delete(SESSION_COOKIE);
}
