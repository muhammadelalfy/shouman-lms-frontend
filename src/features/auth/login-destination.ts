import type { CurrentUser } from "./types";
export function isCenterAdministrator(user: Pick<CurrentUser, "roles">): boolean {
  return user.roles.some(role => role === "system-administrator" || role === "academy-manager");
}
export function defaultLoginDestination(user: Pick<CurrentUser, "roles">): string {
  return isCenterAdministrator(user) ? "/admin/dashboard" : "/dashboard";
}
