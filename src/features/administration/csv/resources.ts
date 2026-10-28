import type { Permission, Role } from "@/features/auth/types";
export const csvResources = ["users", "roles", "offerings", "subjects", "lessons", "homepage-needs", "homepage-faq", "homepage-seo", "audit-logs"] as const;
export type CsvResource = typeof csvResources[number];
export function isCsvResource(value: string): value is CsvResource {
  return csvResources.includes(value as CsvResource);
}
export function canUseCsv(resource: CsvResource, permissions: readonly Permission[], importing: boolean, roles: readonly Role[] = []): boolean {
  const has = (permission: Permission) => permissions.includes(permission);
  if (resource === "audit-logs") return !importing && roles.includes("system-administrator") && has("audit.view");
  if (resource.startsWith("homepage-")) return has("homepage.manage");
  if (resource === "users") return importing ? has("users.manage-status") || has("users.assign-roles") : has("users.view");
  if (resource === "roles") return has("roles.manage-permissions");
  return has(importing ? "offerings.manage" : "offerings.view");
}
