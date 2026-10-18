import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiRequest } from "./client";
import { ApiError } from "./errors";

function jsonResponse(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

describe("apiRequest", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.stubEnv("API_BASE_URL", "http://api.test/api/v1/");
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
  });

  it("sends JSON with bearer token, Arabic locale and a correlation id", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { data: { id: 1 } }));

    const result = await apiRequest<{ data: { id: number } }>("/me", {
      method: "PATCH",
      token: "secret-token",
      body: { name: "أحمد" },
    });

    expect(result).toEqual({ data: { id: 1 } });
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("http://api.test/api/v1/me");
    expect(init?.method).toBe("PATCH");
    expect(init?.body).toBe(JSON.stringify({ name: "أحمد" }));
    const headers = init?.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer secret-token");
    expect(headers["Accept-Language"]).toBe("ar");
    expect(headers["Content-Type"]).toBe("application/json");
    expect(headers["X-Request-Id"]).toMatch(/^[0-9a-f-]{36}$/);
  });

  it("omits empty query parameters and the auth header for guests", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { data: [] }));

    await apiRequest("/admin/users", { query: { status: "active", role: undefined, search: "", per_page: 25 } });

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("http://api.test/api/v1/admin/users?status=active&per_page=25");
    expect((init?.headers as Record<string, string>).Authorization).toBeUndefined();
  });

  it("returns undefined for 204 No Content", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await expect(apiRequest("/auth/logout", { method: "POST", token: "t" })).resolves.toBeUndefined();
  });

  it("turns a 422 into an ApiError carrying the field errors", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(422, {
        message: "البريد الإلكتروني مستخدم من قبل.",
        errors: { email: ["البريد الإلكتروني مستخدم من قبل."] },
      }),
    );

    const error = await apiRequest("/auth/register", { method: "POST", body: {} }).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).isValidation).toBe(true);
    expect((error as ApiError).fieldErrors).toEqual({ email: ["البريد الإلكتروني مستخدم من قبل."] });
  });

  it("keeps the domain error code and the server correlation id", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(403, { message: "تم تعطيل هذا الحساب.", code: "account_disabled" }, { "X-Request-Id": "srv-123456" }),
    );

    const error = (await apiRequest("/auth/login", { method: "POST", body: {} }).catch((e: unknown) => e)) as ApiError;

    expect(error.status).toBe(403);
    expect(error.code).toBe("account_disabled");
    expect(error.requestId).toBe("srv-123456");
  });

  it("falls back to a safe Arabic message when the error body is not JSON", async () => {
    fetchMock.mockResolvedValue(new Response("<html>Bad Gateway</html>", { status: 502 }));

    const error = (await apiRequest("/me", { token: "t" }).catch((e: unknown) => e)) as ApiError;

    expect(error.status).toBe(502);
    expect(error.message).toBe("حدث خطأ غير متوقع. حاول مرة أخرى، وإن استمرت المشكلة تواصل معنا.");
  });

  it("reports an unreachable API as status 0", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));

    const error = (await apiRequest("/me").catch((e: unknown) => e)) as ApiError;

    expect(error.isUnreachable).toBe(true);
    expect(error.code).toBe("network_error");
  });

  it("refuses to run with a missing API base URL", async () => {
    vi.stubEnv("API_BASE_URL", "");

    await expect(apiRequest("/me")).rejects.toThrow(/Invalid server environment/);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
