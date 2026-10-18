import * as z from "zod";
import { registerSchema } from "@/features/auth/schemas";

const phone = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : value))
  .pipe(
    z
      .string()
      .regex(/^\+?[0-9]{8,15}$/, { error: "رقم الهاتف غير صالح. استخدم الصيغة الدولية مثل +201001234567." })
      .nullable(),
  );

const passwordConfirmation = <T extends { password: string; password_confirmation: string }>(data: T) =>
  data.password === data.password_confirmation;

export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { error: "يجب أن يكون طول الاسم حرفين على الأقل." })
      .max(150, { error: "يجب ألا يتجاوز طول الاسم 150 حرفًا." }),
    phone,
  })
  .strict();

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, { error: "كلمة المرور الحالية مطلوبة." }),
    // Keep password strength aligned with account creation instead of cloning its rule.
    password: registerSchema.shape.password,
    password_confirmation: z.string(),
  })
  .strict()
  .refine(passwordConfirmation, {
    error: "تأكيد كلمة المرور غير متطابق.",
    path: ["password_confirmation"],
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
