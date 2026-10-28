import { positiveIdSchema } from "./schemas/common";
export type AdminRoute = {
  section: "users" | "roles" | "offerings";
  mode: "list" | "detail" | "new" | "edit";
  id?: number;
  subjectId?: number;
  lessonId?: number;
  editor?: "subject" | "lesson";
};
const id = (value: string) => {
  const result = positiveIdSchema.safeParse(value);
  return result.success ? result.data : undefined;
};
export function resolveAdminRoute(slug: string[]): AdminRoute | null {
  if (slug[0] !== "admin") return null;
  const [, raw, record, ...rest] = slug;
  const section =
    raw === "students"
      ? "users"
      : [
            "tracks",
            "courses",
            "programs",
            "seasonal-programs",
            "initiatives",
          ].includes(raw)
        ? "offerings"
        : raw;
  if (section !== "users" && section !== "roles" && section !== "offerings")
    return null;
  if (slug.length === 2) return { section, mode: "list" };
  if (section === "roles") return null;
  if (record === "new" && section === "offerings" && rest.length === 0)
    return { section, mode: "new" };
  const recordId = id(record);
  if (!recordId) return null;
  if (rest.length === 0) return { section, id: recordId, mode: "detail" };
  if (section !== "offerings") return null;
  if (rest.length === 1 && rest[0] === "edit")
    return { section, id: recordId, mode: "edit" };
  if (rest[0] !== "subjects" || !rest[1]) return null;
  if (rest[1] === "new" && rest.length === 2)
    return { section, id: recordId, mode: "new", editor: "subject" };
  const subjectId = id(rest[1]);
  if (!subjectId) return null;
  if (rest.length === 2)
    return {
      section,
      id: recordId,
      subjectId,
      mode: "edit",
      editor: "subject",
    };
  if (rest[2] !== "lessons" || rest.length !== 4) return null;
  if (rest[3] === "new")
    return { section, id: recordId, subjectId, mode: "new", editor: "lesson" };
  const lessonId = id(rest[3]);
  return lessonId
    ? {
        section,
        id: recordId,
        subjectId,
        lessonId,
        mode: "edit",
        editor: "lesson",
      }
    : null;
}

export function isLiveAdminPath(slug: string[]): boolean {
  return (
    slug[0] === "admin" &&
    [
      "users",
      "roles",
      "offerings",
      "subjects",
      "lessons",
      "students",
      "tracks",
      "courses",
      "programs",
      "seasonal-programs",
      "initiatives",
      "audit-logs",
    ].includes(slug[1])
  );
}
