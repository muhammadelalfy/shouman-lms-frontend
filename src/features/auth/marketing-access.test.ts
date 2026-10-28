import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/api/errors";
const deps = vi.hoisted(() => ({ token: vi.fn(), me: vi.fn() }));
vi.mock("@/lib/auth/session", () => ({ getSessionToken: deps.token }));
vi.mock("@/features/account/api", () => ({ getCurrentUser: deps.me }));
vi.mock("next/navigation", () => ({ redirect: (url: string) => { throw new Error(`REDIRECT:${url}`); } }));
import { verifyMarketingAccess } from "./marketing-access";
beforeEach(() => { vi.resetAllMocks(); deps.token.mockResolvedValue(null); });
describe("landing marketing authentication", () => {
  it.each(["orientation", "tracks", "challenges", "scholarships"])("requires login for %s with its exact return destination", async id => {
    await expect(verifyMarketingAccess(id)).rejects.toThrow(`REDIRECT:/auth/login?redirectTo=${encodeURIComponent('/preview/marketing/' + id)}`);
    expect(deps.me).not.toHaveBeenCalled();
  });
  it("verifies a session with the backend instead of trusting a cookie", async () => {
    deps.token.mockResolvedValue("private"); deps.me.mockResolvedValue({ id: 1 });
    expect(await verifyMarketingAccess("tracks")).toBe("available"); expect(deps.me).toHaveBeenCalledWith("private");
  });
  it("redirects expired or invalid sessions without exposing content", async () => {
    deps.token.mockResolvedValue("invalid"); deps.me.mockRejectedValue(new ApiError(401, "private error"));
    await expect(verifyMarketingAccess("tracks")).rejects.toThrow("REDIRECT:/auth/login?redirectTo=%2Fpreview%2Fmarketing%2Ftracks&expired=1");
  });
  it.each([403, 503, 0])("keeps protected content unavailable on backend status %s", async status => {
    deps.token.mockResolvedValue("private"); deps.me.mockRejectedValue(new ApiError(status, "private error"));
    expect(await verifyMarketingAccess("tracks")).toBe(status === 403 ? "forbidden" : "unavailable");
  });
  it("preserves other preview routes including public QR verification", async () => {
    expect(await verifyMarketingAccess("verify")).toBe("available"); expect(deps.token).not.toHaveBeenCalled();
  });
});
