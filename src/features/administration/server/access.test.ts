import { beforeEach, expect, it, vi } from "vitest";
vi.mock("@/lib/auth/session", () => ({ getSessionToken: vi.fn() }));
vi.mock("@/features/account/api", () => ({ getCurrentUser: vi.fn() }));
import { getSessionToken } from "@/lib/auth/session";
import { getCurrentUser } from "@/features/account/api";
import { requireMutationAccess } from "./access";
beforeEach(() => vi.clearAllMocks());
it("rejects missing sessions before reading protected data", async () => {
  vi.mocked(getSessionToken).mockResolvedValue(null);
  await expect(requireMutationAccess("users.view")).rejects.toThrow();
  expect(getCurrentUser).not.toHaveBeenCalled();
});
it("rejects missing permissions even with a token", async () => {
  vi.mocked(getSessionToken).mockResolvedValue("secret");
  vi.mocked(getCurrentUser).mockResolvedValue({ permissions: [] } as never);
  await expect(requireMutationAccess("users.view")).rejects.toThrow();
});
it("rejects expired sessions", async () => {
  vi.mocked(getSessionToken).mockResolvedValue("expired");
  vi.mocked(getCurrentUser).mockRejectedValue(new Error("expired"));
  await expect(requireMutationAccess("users.view")).rejects.toThrow();
});
it("allows verified capabilities on each call", async () => {
  vi.mocked(getSessionToken).mockResolvedValue("secret");
  vi.mocked(getCurrentUser).mockResolvedValue({
    permissions: ["users.view"],
  } as never);
  expect((await requireMutationAccess("users.view")).token).toBe("secret");
  await requireMutationAccess("users.view");
  expect(getCurrentUser).toHaveBeenCalledTimes(2);
});
