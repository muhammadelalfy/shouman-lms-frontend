"use server";

import { refresh } from "next/cache";
import { getSessionToken } from "@/lib/auth/session";
import { apiFailure, type FormState, validationFailure } from "@/lib/forms";
import * as accountApi from "../api";
import { changePasswordSchema, updateProfileSchema } from "../schemas";

const SESSION_EXPIRED = "انتهت جلستك. سجّل الدخول مرة أخرى للمتابعة.";

export async function updateProfileAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const token = await getSessionToken();
  if (!token) {
    return { status: "error", message: SESSION_EXPIRED, fieldErrors: {} };
  }

  const parsed = updateProfileSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
  });
  if (!parsed.success) {
    return validationFailure(parsed.error);
  }

  try {
    await accountApi.updateProfile(token, parsed.data);
    refresh();

    return { status: "success", message: "تم حفظ بياناتك." };
  } catch (error) {
    return apiFailure(error);
  }
}

export async function changePasswordAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const token = await getSessionToken();
  if (!token) {
    return { status: "error", message: SESSION_EXPIRED, fieldErrors: {} };
  }

  const parsed = changePasswordSchema.safeParse({
    current_password: formData.get("current_password"),
    password: formData.get("password"),
    password_confirmation: formData.get("password_confirmation"),
  });
  if (!parsed.success) {
    return validationFailure(parsed.error);
  }

  try {
    await accountApi.changePassword(token, parsed.data);

    return { status: "success", message: "تم تغيير كلمة المرور، وتم تسجيل الخروج من الأجهزة الأخرى. ستظل مسجلًا على هذا الجهاز." };
  } catch (error) {
    return apiFailure(error);
  }
}
