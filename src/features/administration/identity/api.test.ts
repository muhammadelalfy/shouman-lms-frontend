import { expect, it, vi } from "vitest";
vi.mock("@/lib/api/client", () => ({ apiRequest: vi.fn() }));
import { apiRequest } from "@/lib/api/client";
import { listUsers, setUserRoles, setRolePermissions } from "./api";
it("passes supported cursor filters without invented pagination", async () => {
  vi.mocked(apiRequest).mockResolvedValue({ data: [] });
  await listUsers("token", { search: "علي", cursor: "next", status: "active" });
  expect(apiRequest).toHaveBeenLastCalledWith("/admin/users", {
    token: "token",
    query: { search: "علي", cursor: "next", status: "active" },
  });
});
it("allows deliberate role clearing and encodes role path", async () => {
  vi.mocked(apiRequest).mockResolvedValue({ data: {} });
  await setUserRoles("token", 42, []);
  expect(apiRequest).toHaveBeenLastCalledWith("/admin/users/42/roles", {
    token: "token",
    method: "PUT",
    body: { roles: [] },
  });
  await setRolePermissions("token", "academy-manager", []);
  expect(apiRequest).toHaveBeenLastCalledWith(
    "/admin/roles/academy-manager/permissions",
    { token: "token", method: "PUT", body: { permissions: [] } },
  );
});
