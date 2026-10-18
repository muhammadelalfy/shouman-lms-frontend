export type FieldErrors = Record<string, string[]>;

/**
 * Normalized failure from the Laravel API. `code` carries machine-readable
 * domain errors (e.g. "account_disabled", "last_system_administrator");
 * `status` 0 means the API could not be reached.
 */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly code: string | null = null,
    readonly fieldErrors: FieldErrors = {},
    readonly requestId: string | null = null,
  ) {
    super(message);
    this.name = "ApiError";
  }

  get isValidation(): boolean {
    return this.status === 422;
  }

  get isUnauthenticated(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }

  get isRateLimited(): boolean {
    return this.status === 429;
  }

  get isUnreachable(): boolean {
    return this.status === 0;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
