/** Mirrors Modules\Identity\Enums\Role on the backend. */
export type Role =
  | "student"
  | "instructor"
  | "supervisor"
  | "evaluator"
  | "academy-manager"
  | "system-administrator";

/** Mirrors Modules\Identity\Enums\AccountStatus. */
export type AccountStatus = "active" | "disabled";

/** Every permission registered in the backend PermissionRegistry (grows as modules add theirs). */
export type Permission =
  | "users.view"
  | "users.manage-status"
  | "users.assign-roles"
  | "roles.manage-permissions"
  | "offerings.view"
  | "offerings.manage"
  | "offerings.publish";

/** GET /me — Modules\Identity\Http\Resources\CurrentUserResource */
export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  status: AccountStatus;
  roles: Role[];
  permissions: Permission[];
  email_verified_at: string | null;
  last_login_at: string | null;
  created_at: string | null;
}

/** POST /auth/login and /auth/register — IssuedTokenResource */
export interface IssuedToken {
  token: string;
  token_type: "Bearer";
  expires_at: string | null;
  user: CurrentUser;
}
