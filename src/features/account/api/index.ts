import "server-only";
import type { CurrentUser } from "@/features/auth/types";
import { apiRequest } from "@/lib/api/client";
import type { ApiResource } from "@/lib/api/types";

export interface UpdateProfileInput {
  name?: string;
  phone?: string | null;
}

export interface ChangePasswordInput {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export async function getCurrentUser(token: string): Promise<CurrentUser> {
  const response = await apiRequest<ApiResource<CurrentUser>>("/me", { token });

  return response.data;
}

export async function updateProfile(token: string, input: UpdateProfileInput): Promise<CurrentUser> {
  const response = await apiRequest<ApiResource<CurrentUser>>("/me", { method: "PATCH", token, body: input });

  return response.data;
}

/** Signs out every other device; the current session stays valid. */
export async function changePassword(token: string, input: ChangePasswordInput): Promise<void> {
  await apiRequest<void>("/me/password", { method: "PUT", token, body: input });
}
