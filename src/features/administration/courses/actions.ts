"use server";
import { z } from "zod";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/errors";
import type { FormState } from "@/lib/forms";
import { mutate } from "../server/mutate";
import { positiveIdSchema } from "../schemas/common";
import {
  offeringSchema,
  offeringKinds,
  offeringInput,
  subjectSchema,
  subjectInput,
  lessonSchema,
  lessonInput,
  reorderSchema,
  contentStatusSchema,
  instructorSchema,
} from "./schemas";
import * as api from "./api";
import type { AdminOffering } from "../types";
const context = z.object({
  offering_id: positiveIdSchema,
  id: positiveIdSchema.optional(),
  subject_id: positiveIdSchema.optional(),
});
const absent = (f: FormData, key: string) => f.get(key) || undefined;
const contextInput = (f: FormData) => ({
  offering_id: f.get("offering_id"),
  id: absent(f, "id"),
  subject_id: absent(f, "subject_id"),
});
function subject(offering: AdminOffering, id: number) {
  const value = offering.subjects?.find(
    (s) => s.id === id && s.offering_id === offering.id,
  );
  if (!value)
    throw new ApiError(404, "المادة غير موجودة في هذا المحتوى.", null, {});
  return value;
}
function requireChild(offering: AdminOffering, entity: string, id: number) {
  if (entity === "offerings" && id === offering.id) return;
  if (
    entity === "subjects" &&
    offering.subjects?.some((s) => s.id === id && s.offering_id === offering.id)
  )
    return;
  if (
    entity === "lessons" &&
    offering.subjects?.some(
      (s) =>
        s.offering_id === offering.id &&
        s.lessons?.some((l) => l.id === id && l.subject_id === s.id),
    )
  )
    return;
  throw new ApiError(404, "المحتوى غير موجود في هذا المسار.", null, {});
}
export async function saveOfferingAction(
  _previous: FormState,
  f: FormData,
): Promise<FormState> {
  const create = !f.get("id");
  let savedId: number | undefined;
  const schema = z.object({
    id: positiveIdSchema.optional(),
    kind: z.enum(offeringKinds).optional(),
    input: offeringSchema,
  });
  const raw = offeringInput(f, create);
  const kind = raw.kind;
  delete raw.kind;
  const result = await mutate(
    "offerings.manage",
    schema,
    { id: absent(f, "id"), kind: create ? kind : undefined, input: raw },
    async (token, v) => {
      if (v.id) {
        const existing = await api.getOffering(token, v.id);
        if (v.input.season_name && existing.kind !== "seasonal_program")
          throw new ApiError(422, "اسم الموسم للبرامج الموسمية فقط.", null, {});
        await api.updateOffering(token, v.id, v.input);
      } else {
        const checked = z.enum(offeringKinds).parse(v.kind);
        if (v.input.season_name && checked !== "seasonal_program")
          throw new ApiError(422, "اسم الموسم للبرامج الموسمية فقط.", null, {});
        savedId = (
          await api.createOffering(token, { ...v.input, kind: checked })
        ).id;
      }
    },
  );
  if (result.status === "success" && savedId)
    redirect(`/admin/offerings/${savedId}`);
  return result;
}
export async function deleteContentAction(
  _previous: FormState,
  f: FormData,
): Promise<FormState> {
  const schema = context.extend({
    entity: z.enum(["offerings", "subjects", "lessons"]),
    id: positiveIdSchema,
  });
  const result = await mutate(
    "offerings.manage",
    schema,
    { ...contextInput(f), entity: f.get("entity") },
    async (token, v) => {
      const offering = await api.getOffering(token, v.offering_id);
      requireChild(offering, v.entity, v.id);
      if (v.entity === "offerings") await api.deleteOffering(token, v.id);
      else if (v.entity === "subjects") await api.deleteSubject(token, v.id);
      else await api.deleteLesson(token, v.id);
    },
  );
  if (result.status === "success" && f.get("entity") === "offerings")
    redirect("/admin/offerings");
  return result;
}
export async function changeContentStatusAction(
  _previous: FormState,
  f: FormData,
): Promise<FormState> {
  return mutate(
    "offerings.publish",
    contentStatusSchema.extend({ offering_id: positiveIdSchema }),
    {
      offering_id: f.get("offering_id"),
      entity: f.get("entity"),
      id: f.get("id"),
      status: f.get("status"),
    },
    async (token, v) => {
      requireChild(await api.getOffering(token, v.offering_id), v.entity, v.id);
      await api.setContentStatus(token, v.entity, v.id, v.status);
    },
  );
}
export async function updateInstructorsAction(
  _previous: FormState,
  f: FormData,
): Promise<FormState> {
  const raw = String(f.get("user_ids") ?? "").trim();
  return mutate(
    "offerings.manage",
    instructorSchema,
    { id: f.get("id"), user_ids: raw ? raw.split(/[\s,،]+/) : [] },
    (token, v) => api.setInstructors(token, v.id, v.user_ids),
  );
}
export async function saveSubjectAction(
  _previous: FormState,
  f: FormData,
): Promise<FormState> {
  return mutate(
    "offerings.manage",
    context.extend({ input: subjectSchema }),
    { ...contextInput(f), input: subjectInput(f) },
    async (token, v) => {
      const offering = await api.getOffering(token, v.offering_id);
      if (v.id) {
        subject(offering, v.id);
        await api.updateSubject(token, v.id, v.input);
      } else await api.createSubject(token, v.offering_id, v.input);
    },
  );
}
export async function saveLessonAction(
  _previous: FormState,
  f: FormData,
): Promise<FormState> {
  return mutate(
    "offerings.manage",
    context.extend({ subject_id: positiveIdSchema, input: lessonSchema }),
    { ...contextInput(f), input: lessonInput(f) },
    async (token, v) => {
      const parent = subject(
        await api.getOffering(token, v.offering_id),
        v.subject_id,
      );
      if (v.id) {
        if (
          !parent.lessons?.some(
            (l) => l.id === v.id && l.subject_id === parent.id,
          )
        )
          throw new ApiError(404, "الدرس غير موجود في هذه المادة.", null, {});
        await api.updateLesson(token, v.id, v.input);
      } else await api.createLesson(token, v.subject_id, v.input);
    },
  );
}
export async function reorderContentAction(
  _previous: FormState,
  f: FormData,
): Promise<FormState> {
  const ids = String(f.get("ids") ?? "").trim();
  return mutate(
    "offerings.manage",
    context.extend({
      entity: z.enum(["subjects", "lessons"]),
      ids: reorderSchema.shape.ids,
    }),
    {
      ...contextInput(f),
      entity: f.get("entity"),
      ids: ids ? ids.split(",") : [],
    },
    async (token, v) => {
      const offering = await api.getOffering(token, v.offering_id);
      const children =
        v.entity === "subjects"
          ? (offering.subjects ?? [])
          : v.subject_id
            ? (subject(offering, v.subject_id).lessons ?? [])
            : null;
      if (
        !children ||
        children.length !== v.ids.length ||
        children.some((c) => !v.ids.includes(c.id))
      )
        throw new ApiError(
          409,
          "تغيرت قائمة المحتوى. أعد تحميل الصفحة قبل الترتيب.",
          null,
          {},
        );
      if (v.entity === "subjects")
        await api.reorderSubjects(token, v.offering_id, v.ids);
      else await api.reorderLessons(token, v.subject_id!, v.ids);
    },
  );
}
