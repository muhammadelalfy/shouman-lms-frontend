"use server";

import { redirect } from "next/navigation";
import { getSessionToken, endSession, startSession } from "@/lib/auth/session";
import { apiFailure, type FormState, validationFailure } from "@/lib/forms";
import { safeRedirectPath } from "@/lib/navigation";
import * as authApi from "../api";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from "../schemas";

/*
 * Server Actions for useActionState. Designed forms submit FormData with
 * fields named exactly like the API (email, password, password_confirmation, …)
 * plus an optional hidden `redirectTo`.
 */

export async function loginAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return validationFailure(parsed.error);
  }

  try {
    const issued = await authApi.login(parsed.data);
    await startSession(issued.token, issued.expires_at);
  } catch (error) {
    return apiFailure(error);
  }

  redirect(safeRedirectPath(formData.get("redirectTo")));
}

export async function registerAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return validationFailure(parsed.error);
  }

  try {
    const issued = await authApi.register(parsed.data);
    await startSession(issued.token, issued.expires_at);
  } catch (error) {
    return apiFailure(error);
  }

  redirect(safeRedirectPath(formData.get("redirectTo")));
}

export async function forgotPasswordAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = forgotPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return validationFailure(parsed.error);
  }

  try {
    const { message } = await authApi.requestPasswordReset(parsed.data);

    return { status: "success", message };
  } catch (error) {
    return apiFailure(error);
  }
}

export async function resetPasswordAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = resetPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return validationFailure(parsed.error);
  }

  try {
    const { message } = await authApi.resetPassword(parsed.data);

    return { status: "success", message };
  } catch (error) {
    return apiFailure(error);
  }
}

export async function logoutAction(): Promise<void> {
  const token = await getSessionToken();

  if (token) {
    try {
      await authApi.logout(token);
    } catch {
      // The token may already be revoked or expired; the local session ends regardless.
    }
  }

  await endSession();
  redirect("/");
}
