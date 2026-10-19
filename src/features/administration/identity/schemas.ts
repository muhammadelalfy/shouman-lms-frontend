import { z } from "zod";
import { positiveIdSchema, roles, permissions } from "../schemas/common";
export const userStatusSchema = z.object({
  id: positiveIdSchema,
  status: z.enum(["active", "disabled"]),
});
export const userRolesSchema = z.object({
  id: positiveIdSchema,
  roles: z
    .array(z.enum(roles))
    .refine((a) => new Set(a).size === a.length, "الأدوار مكررة"),
});
export const rolePermissionsSchema = z.object({
  role: z.enum(roles),
  permissions: z
    .array(z.enum(permissions))
    .refine((a) => new Set(a).size === a.length, "الصلاحيات مكررة"),
});
export const userFiltersSchema = z.object({
  search: z.string().trim().min(2).max(100).optional(),
  status: z.enum(["active", "disabled"]).optional(),
  role: z.enum(roles).optional(),
  cursor: z.string().max(4000).optional(),
});
