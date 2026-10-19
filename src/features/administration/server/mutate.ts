import "server-only";
import { refresh } from "next/cache";
import type { z } from "zod";
import type { Permission } from "@/features/auth/types";
import { apiFailure, validationFailure, type FormState } from "@/lib/forms";
import { requireMutationAccess } from "./access";
export async function mutate<T>(
  permission: Permission,
  schema: z.ZodType<T>,
  input: unknown,
  operation: (token: string, data: T) => Promise<unknown>,
): Promise<FormState> {
  try {
    const { token } = await requireMutationAccess(permission);
    const parsed = schema.safeParse(input);
    if (!parsed.success) return validationFailure(parsed.error);
    await operation(token, parsed.data);
    refresh();
    return { status: "success", message: "تم حفظ التغيير." };
  } catch (error) {
    return apiFailure(error);
  }
}
