import { z } from "zod";
import { positiveIdSchema, contentStatuses } from "../schemas/common";
const text = (max: number) =>
  z.string().trim().max(max).nullable().optional().default(null);
const minutes = (max: number) =>
  z.number().int().min(1).max(max).nullable().optional().default(null);
const iso = z
  .string()
  .datetime({ offset: true })
  .nullable()
  .optional()
  .default(null);
export const offeringKinds = [
  "track",
  "course",
  "initiative",
  "intensive_program",
  "seasonal_program",
] as const;
export const offeringSchema = z
  .object({
    title: z.string().trim().min(3).max(200),
    slug: z
      .string()
      .max(200)
      .regex(/^[\p{Ll}\p{Lo}\p{N}]+(?:-[\p{Ll}\p{Lo}\p{N}]+)*$/u)
      .nullable()
      .optional()
      .default(null),
    summary: text(500),
    description: text(20000),
    goals: z.array(z.string().min(1).max(300)).max(20).optional().default([]),
    target_audience: text(500),
    estimated_duration_minutes: minutes(100000),
    starts_at: iso,
    ends_at: iso,
    visible_from: iso,
    visible_until: iso,
    is_featured: z.boolean(),
    season_name: text(100),
    sequencing_mode: z.enum([
      "open",
      "after_previous_completed",
      "after_previous_quiz_passed",
    ]),
    outline_style: z.enum(["subjects", "lessons"]),
    pricing: z.enum(["free", "paid"]),
    price_amount: z.number().int().min(1).max(100000000).optional(),
    discounted_price_amount: z.number().int().min(0).optional(),
    currency: z.literal("EGP").optional(),
  })
  .superRefine((v, ctx) => {
    const issue = (path: string, message: string) =>
      ctx.addIssue({ code: "custom", path: [path], message });
    if (v.pricing === "paid" && (!v.price_amount || !v.currency))
      issue("price_amount", "أدخل السعر الصحيح والعملة.");
    if (
      v.pricing === "free" &&
      (v.price_amount !== undefined ||
        v.discounted_price_amount !== undefined ||
        v.currency !== undefined)
    )
      issue("pricing", "المحتوى المجاني لا يقبل سعرًا.");
    if (
      v.discounted_price_amount !== undefined &&
      v.price_amount !== undefined &&
      v.discounted_price_amount >= v.price_amount
    )
      issue(
        "discounted_price_amount",
        "السعر المخفض يجب أن يقل عن السعر الأصلي.",
      );
    for (const [start, end] of [
      ["starts_at", "ends_at"],
      ["visible_from", "visible_until"],
    ] as const)
      if (v[start] && v[end] && Date.parse(v[end]) <= Date.parse(v[start]))
        issue(end, "وقت النهاية يجب أن يأتي بعد البداية.");
  });
export const subjectSchema = z.object({
  title: z.string().trim().min(2).max(200),
  description: text(5000),
});
export const lessonSchema = subjectSchema.extend({
  summary: text(20000),
  key_points: z
    .array(z.string().min(1).max(300))
    .max(30)
    .optional()
    .default([]),
  estimated_duration_minutes: minutes(10000),
});
export const reorderSchema = z.object({
  ids: z
    .array(positiveIdSchema)
    .max(500)
    .refine((a) => new Set(a).size === a.length, "المعرفات مكررة"),
});
export const contentStatusSchema = z.object({
  entity: z.enum(["offerings", "subjects", "lessons"]),
  id: positiveIdSchema,
  status: z.enum(contentStatuses),
});
export const instructorSchema = z.object({
  id: positiveIdSchema,
  user_ids: z
    .array(positiveIdSchema)
    .max(20)
    .refine((a) => new Set(a).size === a.length, "المعرفات مكررة"),
});
export type OfferingInput = z.infer<typeof offeringSchema>;
export type SubjectInput = z.input<typeof subjectSchema>;
export type LessonInput = z.input<typeof lessonSchema>;
const nullable = (f: FormData, key: string) => {
  const value = f.get(key);
  return typeof value === "string" && value.trim() !== "" ? value : null;
};
const number = (f: FormData, key: string) => {
  const v = nullable(f, key);
  return v === null ? null : Number(v);
};
export const lines = (value: FormDataEntryValue | null) =>
  typeof value === "string"
    ? value
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
export function offeringInput(f: FormData, create: boolean) {
  const v: Record<string, unknown> = {};
  for (const name of [
    "title",
    "slug",
    "summary",
    "description",
    "target_audience",
    "starts_at",
    "ends_at",
    "visible_from",
    "visible_until",
    "season_name",
  ])
    v[name] = nullable(f, name);
  v.goals = lines(f.get("goals"));
  v.estimated_duration_minutes = number(f, "estimated_duration_minutes");
  v.is_featured =
    f.get("is_featured") === "on" || f.get("is_featured") === "true";
  for (const name of ["sequencing_mode", "outline_style", "pricing"])
    v[name] = f.get(name);
  if (f.get("pricing") === "paid") {
    v.price_amount = number(f, "price_amount");
    v.currency = f.get("currency");
    const discount = number(f, "discounted_price_amount");
    if (discount !== null) v.discounted_price_amount = discount;
  }
  if (create) v.kind = f.get("kind");
  return v;
}
export function subjectInput(f: FormData) {
  return { title: f.get("title"), description: nullable(f, "description") };
}
export function lessonInput(f: FormData) {
  return {
    ...subjectInput(f),
    summary: nullable(f, "summary"),
    key_points: lines(f.get("key_points")),
    estimated_duration_minutes: number(f, "estimated_duration_minutes"),
  };
}
