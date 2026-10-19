import "server-only";
import { apiRequest } from "@/lib/api/client";
import type { ApiResource, CursorPaginated } from "@/lib/api/types";
import type {
  AdminOffering,
  AdminSubject,
  AdminLesson,
  ContentStatus,
} from "../types";
import type { OfferingInput, SubjectInput, LessonInput } from "./schemas";
import type { OfferingKind } from "@/features/catalog/types";
export type OfferingFilters = {
  kind?: OfferingKind;
  status?: ContentStatus;
  search?: string;
  cursor?: string;
};
const resource = async <T>(
  path: string,
  token: string,
  method: "GET" | "POST" | "PUT" = "GET",
  body?: unknown,
) =>
  (
    await apiRequest<ApiResource<T>>(path, {
      token,
      ...(method !== "GET" ? { method, body } : {}),
    })
  ).data;
export async function listOfferings(
  token: string,
  filters: OfferingFilters = {},
) {
  return apiRequest<CursorPaginated<AdminOffering>>("/admin/offerings", {
    token,
    query: filters,
  });
}
export async function getOffering(token: string, id: number) {
  return resource<AdminOffering>(`/admin/offerings/${id}`, token);
}
export async function createOffering(
  token: string,
  input: OfferingInput & { kind: OfferingKind },
) {
  return resource<AdminOffering>("/admin/offerings", token, "POST", input);
}
export async function updateOffering(
  token: string,
  id: number,
  input: OfferingInput,
) {
  const body = { ...input } as Record<string, unknown>;
  delete body.kind;
  return resource<AdminOffering>(`/admin/offerings/${id}`, token, "PUT", body);
}
export async function deleteOffering(token: string, id: number) {
  await apiRequest<void>(`/admin/offerings/${id}`, { token, method: "DELETE" });
}
export async function setContentStatus(
  token: string,
  entity: "offerings" | "subjects" | "lessons",
  id: number,
  status: ContentStatus,
) {
  return resource<unknown>(`/admin/${entity}/${id}/status`, token, "PUT", {
    status,
  });
}
export async function setInstructors(
  token: string,
  id: number,
  userIds: number[],
) {
  return resource<unknown>(`/admin/offerings/${id}/instructors`, token, "PUT", {
    user_ids: userIds,
  });
}
export async function createSubject(
  token: string,
  offeringId: number,
  input: SubjectInput,
) {
  return resource<AdminSubject>(
    `/admin/offerings/${offeringId}/subjects`,
    token,
    "POST",
    input,
  );
}
export async function updateSubject(
  token: string,
  id: number,
  input: SubjectInput,
) {
  return resource<AdminSubject>(`/admin/subjects/${id}`, token, "PUT", input);
}
export async function deleteSubject(token: string, id: number) {
  await apiRequest<void>(`/admin/subjects/${id}`, { token, method: "DELETE" });
}
export async function createLesson(
  token: string,
  subjectId: number,
  input: LessonInput,
) {
  return resource<AdminLesson>(
    `/admin/subjects/${subjectId}/lessons`,
    token,
    "POST",
    input,
  );
}
export async function updateLesson(
  token: string,
  id: number,
  input: LessonInput,
) {
  return resource<AdminLesson>(`/admin/lessons/${id}`, token, "PUT", input);
}
export async function deleteLesson(token: string, id: number) {
  await apiRequest<void>(`/admin/lessons/${id}`, { token, method: "DELETE" });
}
export async function reorderSubjects(
  token: string,
  offeringId: number,
  ids: number[],
) {
  await apiRequest<unknown>(`/admin/offerings/${offeringId}/subjects/order`, {
    token,
    method: "PUT",
    body: { ids },
  });
}
export async function reorderLessons(
  token: string,
  subjectId: number,
  ids: number[],
) {
  await apiRequest<unknown>(`/admin/subjects/${subjectId}/lessons/order`, {
    token,
    method: "PUT",
    body: { ids },
  });
}
