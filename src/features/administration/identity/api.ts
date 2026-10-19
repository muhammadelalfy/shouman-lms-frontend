import "server-only";
import { apiRequest } from "@/lib/api/client";
import type { ApiResource, CursorPaginated } from "@/lib/api/types";
import type { AdminUser, AdminRole } from "../types";
import type { AccountStatus, Role, Permission } from "@/features/auth/types";
export type UserFilters = {
  search?: string;
  status?: AccountStatus;
  role?: Role;
  cursor?: string;
};
export async function listUsers(token: string, filters: UserFilters = {}) {
  return apiRequest<CursorPaginated<AdminUser>>("/admin/users", {
    token,
    query: filters,
  });
}
export async function getUser(token: string, id: number) {
  return (
    await apiRequest<ApiResource<AdminUser>>(`/admin/users/${id}`, { token })
  ).data;
}
export async function listRoles(token: string) {
  return (await apiRequest<ApiResource<AdminRole[]>>("/admin/roles", { token }))
    .data;
}
export async function setUserStatus(
  token: string,
  id: number,
  status: AccountStatus,
) {
  return (
    await apiRequest<ApiResource<AdminUser>>(`/admin/users/${id}/status`, {
      token,
      method: "PUT",
      body: { status },
    })
  ).data;
}
export async function setUserRoles(token: string, id: number, roles: Role[]) {
  return (
    await apiRequest<ApiResource<AdminUser>>(`/admin/users/${id}/roles`, {
      token,
      method: "PUT",
      body: { roles },
    })
  ).data;
}
export async function setRolePermissions(
  token: string,
  role: Role,
  permissions: Permission[],
) {
  return (
    await apiRequest<ApiResource<AdminRole>>(
      `/admin/roles/${encodeURIComponent(role)}/permissions`,
      { token, method: "PUT", body: { permissions } },
    )
  ).data;
}
