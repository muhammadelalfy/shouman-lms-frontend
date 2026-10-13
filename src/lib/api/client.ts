import "server-only";
import { getServerEnv } from "@/config/server-env";
import { ApiError, type FieldErrors } from "./errors";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRequestOptions {
  method?: HttpMethod;
  body?: unknown;
  /** Bearer token; omit for guest endpoints. */
  token?: string | null;
  query?: Record<string, string | number | undefined | null>;
  signal?: AbortSignal;
}

const UNREACHABLE_MESSAGE = "تعذر الاتصال بالخادم. تحقق من اتصالك ثم حاول مرة أخرى.";
const UNEXPECTED_MESSAGE = "حدث خطأ غير متوقع. حاول مرة أخرى، وإن استمرت المشكلة تواصل معنا.";

/**
 * Server-side client for the Laravel API (backend-for-frontend). Tokens are
 * read from the httpOnly session cookie by callers and never reach browser JS.
 * Every call carries a correlation ID (CLAUDE.md §107) and a hard timeout.
 */
export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { API_BASE_URL, API_TIMEOUT_MS } = getServerEnv();
  const requestId = crypto.randomUUID();

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Accept-Language": "ar",
    "X-Request-Id": requestId,
  };
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const timeout = AbortSignal.timeout(API_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(buildUrl(API_BASE_URL, path, options.query), {
      method: options.method ?? "GET",
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: options.signal ? AbortSignal.any([options.signal, timeout]) : timeout,
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, UNREACHABLE_MESSAGE, "network_error", {}, requestId);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await readJson(response);

  if (!response.ok) {
    throw toApiError(response, payload, requestId);
  }

  return payload as T;
}

function buildUrl(baseUrl: string, path: string, query: ApiRequestOptions["query"]): string {
  const url = new URL(`${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function toApiError(response: Response, payload: unknown, requestId: string): ApiError {
  const body = isRecord(payload) ? payload : {};
  const message = typeof body.message === "string" && body.message !== "" ? body.message : UNEXPECTED_MESSAGE;
  const code = typeof body.code === "string" ? body.code : null;
  const fieldErrors = isRecord(body.errors) ? normalizeFieldErrors(body.errors) : {};

  return new ApiError(response.status, message, code, fieldErrors, response.headers.get("X-Request-Id") ?? requestId);
}

function normalizeFieldErrors(errors: Record<string, unknown>): FieldErrors {
  const normalized: FieldErrors = {};

  for (const [field, messages] of Object.entries(errors)) {
    if (Array.isArray(messages)) {
      normalized[field] = messages.filter((message): message is string => typeof message === "string");
    }
  }

  return normalized;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

