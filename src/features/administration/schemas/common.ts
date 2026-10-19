import { z } from "zod";
export const positiveIdSchema = z.union([
  z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
  z
    .string()
    .regex(/^[1-9]\d*$/)
    .transform(Number)
    .pipe(z.number().int().positive().max(Number.MAX_SAFE_INTEGER)),
]);
export const roles = [
  "student",
  "instructor",
  "supervisor",
  "evaluator",
  "academy-manager",
  "system-administrator",
] as const;
export const permissions = [
  "users.view",
  "users.manage-status",
  "users.assign-roles",
  "roles.manage-permissions",
  "offerings.view",
  "offerings.manage",
  "offerings.publish",
] as const;
export const roleNames: Record<string, string> = {
  student: "طالب",
  instructor: "مدرّس",
  supervisor: "مشرف",
  evaluator: "مقيّم",
  "academy-manager": "مدير الأكاديمية",
  "system-administrator": "مدير النظام",
};
export const permissionNames: Record<string, string> = {
  "users.view": "عرض المستخدمين",
  "users.manage-status": "تغيير حالة الحساب",
  "users.assign-roles": "تعيين الأدوار",
  "roles.manage-permissions": "إدارة الصلاحيات",
  "offerings.view": "عرض المحتوى",
  "offerings.manage": "تحرير المحتوى",
  "offerings.publish": "نشر المحتوى",
};
export const contentStatuses = [
  "draft",
  "published",
  "hidden",
  "archived",
] as const;
export const statusNames: Record<string, string> = {
  draft: "مسودة",
  published: "منشور",
  hidden: "مخفي",
  archived: "مؤرشف",
  active: "نشط",
  disabled: "معطّل",
};
export const kindNames: Record<string, string> = {
  track: "مسار",
  course: "دورة",
  initiative: "مبادرة",
  intensive_program: "برنامج مكثف",
  seasonal_program: "برنامج موسمي",
};
