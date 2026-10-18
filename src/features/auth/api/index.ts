import "server-only";
import { apiRequest } from "@/lib/api/client";
import type { ApiResource, MessageResponse } from "@/lib/api/types";
import type { ForgotPasswordInput, LoginInput, RegisterInput, ResetPasswordInput } from "../schemas";
import type { IssuedToken } from "../types";

export async function register(input: RegisterInput): Promise<IssuedToken> {
  const response = await apiRequest<ApiResource<IssuedToken>>("/auth/register", { method: "POST", body: input });

  return response.data;
}

export async function login(input: LoginInput): Promise<IssuedToken> {
  const response = await apiRequest<ApiResource<IssuedToken>>("/auth/login", {
    method: "POST",
    body: { ...input, device_name: "web" },
  });

  return response.data;
}

export async function logout(token: string): Promise<void> {
  await apiRequest<void>("/auth/logout", { method: "POST", token });
}

export async function requestPasswordReset(input: ForgotPasswordInput): Promise<MessageResponse> {
  return apiRequest<MessageResponse>("/auth/forgot-password", { method: "POST", body: input });
}

export async function resetPassword(input: ResetPasswordInput): Promise<MessageResponse> {
  return apiRequest<MessageResponse>("/auth/reset-password", { method: "POST", body: input });
}
