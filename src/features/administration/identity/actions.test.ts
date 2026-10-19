import { beforeEach, expect, it, vi } from "vitest";
vi.mock("@/features/administration/server/access", () => ({
  requireMutationAccess: vi.fn(),
}));
vi.mock("./api", () => ({
  setUserStatus: vi.fn(),
  setUserRoles: vi.fn(),
  setRolePermissions: vi.fn(),
}));
vi.mock("next/cache", () => ({ refresh: vi.fn() }));
import { requireMutationAccess } from "../server/access";
import { setUserStatus } from "./api";
import { updateUserStatusAction } from "./actions";
import { ApiError } from "@/lib/api/errors";
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireMutationAccess).mockResolvedValue({
    token: "secret",
    user: {},
  } as never);
});
function data(id = "42") {
  const f = new FormData();
  f.set("id", id);
  f.set("status", "disabled");
  return f;
}
it("rejects forged identifiers before any mutation", async () => {
  const state = await updateUserStatusAction(
    { status: "idle" },
    data("demo-user"),
  );
  expect(state.status).toBe("error");
  expect(setUserStatus).not.toHaveBeenCalled();
  expect(JSON.stringify(state)).not.toContain("secret");
});
it.each([401, 403, 409, 422, 429, 500, 0])(
  "reports backend failure %i without false success",
  async (status) => {
    vi.mocked(setUserStatus).mockRejectedValue(
      new ApiError(status, "rejected", null, {}),
    );
    expect(
      (await updateUserStatusAction({ status: "idle" }, data())).status,
    ).toBe("error");
  },
);
it("rechecks capability before mutation", async () => {
  vi.mocked(requireMutationAccess).mockRejectedValue(
    new ApiError(403, "forbidden", null, {}),
  );
  expect(
    (await updateUserStatusAction({ status: "idle" }, data())).status,
  ).toBe("error");
  expect(setUserStatus).not.toHaveBeenCalled();
});
it("only acknowledges backend success", async () => {
  vi.mocked(setUserStatus).mockResolvedValue({ id: 42 } as never);
  expect(
    (await updateUserStatusAction({ status: "idle" }, data())).status,
  ).toBe("success");
  expect(requireMutationAccess).toHaveBeenCalledWith("users.manage-status");
});
