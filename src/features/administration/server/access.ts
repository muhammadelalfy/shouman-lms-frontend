import "server-only";
import { redirect } from "next/navigation";
import { getSessionToken } from "@/lib/auth/session";
import { getCurrentUser } from "@/features/account/api";
import { ApiError, isApiError } from "@/lib/api/errors";
import type { Permission } from "@/features/auth/types";

export async function requireMutationAccess(permission: Permission) {
  const token = await getSessionToken();
  if (!token)
    throw new ApiError(401, "انتهت جلستك. سجّل الدخول مجددًا.", null, {});
  const user = await getCurrentUser(token);
  if (!user.permissions.includes(permission))
    throw new ApiError(403, "ليس لديك صلاحية لتنفيذ هذا الإجراء.", null, {});
  return { token, user };
}
export async function getAdminAccess(permission: Permission, destination = "/admin/offerings") {
  try {
    return await requireMutationAccess(permission);
  } catch (error) {
    if (isApiError(error) && error.status === 401)
      redirect(`/auth/login?redirectTo=${encodeURIComponent(destination)}&expired=1`);
    throw error;
  }
}
