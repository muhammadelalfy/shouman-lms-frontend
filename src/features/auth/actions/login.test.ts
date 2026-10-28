import { beforeEach, expect, it, vi } from "vitest";

const deps = vi.hoisted(() => ({ login: vi.fn(), startSession: vi.fn() }));
vi.mock("../api", () => ({ login: deps.login }));
vi.mock("@/lib/auth/session", () => ({ startSession: deps.startSession, getSessionToken: vi.fn(), endSession: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: (path: string) => { throw new Error(`REDIRECT:${path}`); } }));
import { loginAction } from "./index";

beforeEach(() => vi.resetAllMocks());

it.each([
  [["system-administrator"], undefined, "/admin/dashboard"],
  [["academy-manager"], undefined, "/admin/dashboard"],
  [["student"], undefined, "/dashboard"],
  [["student", "system-administrator"], undefined, "/admin/dashboard"],
  [["system-administrator"], "/admin/homepage/needs", "/admin/homepage/needs"],
  [["system-administrator"], "https://example.invalid", "/admin/dashboard"],
  [["student"], "//example.invalid", "/dashboard"],
])("routes verified roles %j with return path %s to %s", async (roles, returnPath, destination) => {
  deps.login.mockResolvedValue({ user: { roles }, token: "test-session", expires_at: null });
  const form = new FormData();
  form.set("email", "test@example.invalid");
  form.set("password", "test-password");
  if (returnPath) form.set("redirectTo", returnPath);
  await expect(loginAction({ status: "idle" }, form)).rejects.toThrow(`REDIRECT:${destination}`);
  expect(deps.startSession).toHaveBeenCalledWith("test-session", null);
});
