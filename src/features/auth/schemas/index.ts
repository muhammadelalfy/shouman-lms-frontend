import * as z from "zod";

/*
 * Client-side validation mirrors the Laravel rules for fast feedback only.
 * The API stays authoritative and its 422 messages are shown as-is.
 */

const email = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: "يجب أن يكون البريد الإلكتروني بريدًا إلكترونيًا صحيحًا." }));

const strongPassword = z
  .string()
  .min(8, { error: "يجب أن يكون طول كلمة المرور 8 أحرف على الأقل." })
  .regex(/[a-z]/, { error: "يجب أن تحتوي كلمة المرور على حرف كبير وحرف صغير على الأقل." })
  .regex(/[A-Z]/, { error: "يجب أن تحتوي كلمة المرور على حرف كبير وحرف صغير على الأقل." })
  .regex(/[0-9]/, { error: "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل." });

const optionalPhone = z
  .string()
  .trim()
  .transform((value) => (value === "" ? undefined : value))
  .pipe(
    z
      .string()
      .regex(/^\+?[0-9]{8,15}$/, { error: "رقم الهاتف غير صالح. استخدم الصيغة الدولية مثل +201001234567." })
      .optional(),
  )
  .optional();

const passwordsMatch = <T extends { password: string; password_confirmation: string }>(data: T) =>
  data.password === data.password_confirmation;

const confirmationError = { error: "تأكيد كلمة المرور غير متطابق.", path: ["password_confirmation"] };

export const loginSchema = z.object({
  email,
  password: z.string().min(1, { error: "كلمة المرور مطلوبة." }),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { error: "يجب أن يكون طول الاسم حرفين على الأقل." })
      .max(150, { error: "يجب ألا يتجاوز طول الاسم 150 حرفًا." }),
    email,
    phone: optionalPhone,
    password: strongPassword,
    password_confirmation: z.string(),
  })
  .refine(passwordsMatch, confirmationError);

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    email,
    password: strongPassword,
    password_confirmation: z.string(),
  })
  .refine(passwordsMatch, confirmationError);

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
