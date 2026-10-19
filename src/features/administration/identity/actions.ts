"use server";
import type { FormState } from "@/lib/forms";
import { mutate } from "../server/mutate";
import {
  userStatusSchema,
  userRolesSchema,
  rolePermissionsSchema,
} from "./schemas";
import { setUserStatus, setUserRoles, setRolePermissions } from "./api";
export async function updateUserStatusAction(
  _previous: FormState,
  data: FormData,
): Promise<FormState> {
  return mutate(
    "users.manage-status",
    userStatusSchema,
    { id: data.get("id"), status: data.get("status") },
    (token, v) => setUserStatus(token, v.id, v.status),
  );
}
export async function updateUserRolesAction(
  _previous: FormState,
  data: FormData,
): Promise<FormState> {
  return mutate(
    "users.assign-roles",
    userRolesSchema,
    { id: data.get("id"), roles: data.getAll("roles") },
    (token, v) => setUserRoles(token, v.id, v.roles),
  );
}
export async function updateRolePermissionsAction(
  _previous: FormState,
  data: FormData,
): Promise<FormState> {
  return mutate(
    "roles.manage-permissions",
    rolePermissionsSchema,
    { role: data.get("role"), permissions: data.getAll("permissions") },
    (token, v) => setRolePermissions(token, v.role, v.permissions),
  );
}
