import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { getAdminAccess } from "./server/access";
import { isApiError } from "@/lib/api/errors";
import { apiFailure } from "@/lib/forms";
import type { Permission } from "@/features/auth/types";
import type { AdminRoute } from "./route-resolution";
import { AdminShell } from "./components/admin-shell";
import { userFiltersSchema } from "./identity/schemas";
import { listUsers, getUser, listRoles } from "./identity/api";
import { UserList } from "./identity/user-list";
import { UserDetail } from "./identity/user-detail";
import { RoleEditor } from "./identity/role-editor";
import { listOfferings, getOffering } from "./courses/api";
import { offeringKinds } from "./courses/schemas";
import { contentStatuses } from "./schemas/common";
import { OfferingList } from "./courses/offering-list";
import { OfferingDetail } from "./courses/offering-detail";
import { OfferingEditor } from "./courses/offering-editor";
import { SubjectEditor } from "./courses/subject-editor";
import { LessonEditor } from "./courses/lesson-editor";
import "./administration.css";
const offeringFilters = z.object({
  kind: z.enum(offeringKinds).optional(),
  status: z.enum(contentStatuses).optional(),
  search: z.string().trim().min(2).max(100).optional(),
  cursor: z.string().max(4000).optional(),
});
export async function AdministrationPage({
  route,
  query,
}: {
  route: AdminRoute;
  query: Record<string, string | undefined>;
}) {
  const title =
    route.section === "users"
      ? "إدارة المستخدمين"
      : route.section === "roles"
        ? "الأدوار والصلاحيات"
        : route.editor === "subject"
          ? "تحرير المادة"
          : route.editor === "lesson"
            ? "تحرير الدرس"
            : route.mode === "new"
              ? "إنشاء محتوى تعليمي"
              : "إدارة المحتوى التعليمي";
  const permission: Permission =
    route.section === "users"
      ? "users.view"
      : route.section === "roles"
        ? "roles.manage-permissions"
        : route.mode === "new" || route.mode === "edit"
          ? "offerings.manage"
          : "offerings.view";
  // Authentication redirects must stay outside the rendering error boundary.
  let access;
  try {
    access = await getAdminAccess(permission);
  } catch (error) {
    if (!isApiError(error)) throw error;
    return (
      <AdminShell title={title}>
        <Failure error={error} />
      </AdminShell>
    );
  }
  const { token, user } = access;
  const result = await loadAdminData(route, query, token);
  if (result.type === "missing") notFound();
  const content =
    result.type === "failure" ? (
      <Failure error={result.error} />
    ) : result.type === "invalid" ? (
      <InvalidFilters base={`/admin/${route.section}`} />
    ) : result.type === "users" ? (
      <UserList result={result.data} query={result.query} />
    ) : result.type === "user" ? (
      <UserDetail
        user={result.data}
        actor={{
          id: user.id,
          roles: user.roles,
          permissions: user.permissions,
        }}
      />
    ) : result.type === "roles" ? (
      <RoleEditor roles={result.data} />
    ) : result.type === "offerings" ? (
      <OfferingList
        result={result.data}
        query={result.query}
        manage={user.permissions.includes("offerings.manage")}
      />
    ) : result.type === "subject" ? (
      <SubjectEditor
        key={`${result.subject?.id ?? "new"}:${result.offering.id}`}
        offeringId={result.offering.id}
        subject={result.subject}
      />
    ) : result.type === "lesson" ? (
      <LessonEditor
        key={`${result.lesson?.id ?? "new"}:${result.subjectId}`}
        offeringId={result.offeringId}
        subjectId={result.subjectId}
        lesson={result.lesson}
      />
    ) : result.type === "editor" ? (
      <OfferingEditor key={result.data?.id ?? "new"} offering={result.data} />
    ) : (
      <OfferingDetail offering={result.data} permissions={user.permissions} />
    );
  return (
    <AdminShell title={title} permissions={user.permissions}>
      {route.mode !== "list" && (
        <p>
          <Link
            className="xp-button xp-button-outline"
            href={
              route.id &&
              route.section === "offerings" &&
              (route.editor || route.mode === "edit")
                ? `/admin/offerings/${route.id}`
                : `/admin/${route.section}`
            }
          >
            العودة إلى{" "}
            {route.editor || route.mode === "edit" ? "المحتوى" : "القائمة"}
          </Link>
        </p>
      )}
      {content}
    </AdminShell>
  );
}
async function loadAdminData(
  route: AdminRoute,
  query: Record<string, string | undefined>,
  token: string,
) {
  try {
    if (route.section === "users") {
      if (route.id)
        return { type: "user" as const, data: await getUser(token, route.id) };
      const filters = userFiltersSchema.safeParse(cleanQuery(query));
      if (!filters.success) return { type: "invalid" as const };
      return {
        type: "users" as const,
        data: await listUsers(token, filters.data),
        query: filters.data,
      };
    }
    if (route.section === "roles")
      return { type: "roles" as const, data: await listRoles(token) };
    if (route.mode === "list") {
      const filters = offeringFilters.safeParse(cleanQuery(query));
      if (!filters.success) return { type: "invalid" as const };
      return {
        type: "offerings" as const,
        data: await listOfferings(token, filters.data),
        query: filters.data,
      };
    }
    if (!route.id) return { type: "editor" as const, data: undefined };
    const offering = await getOffering(token, route.id);
    const subject = route.subjectId
      ? offering.subjects?.find(
          (s) => s.id === route.subjectId && s.offering_id === offering.id,
        )
      : undefined;
    if (route.subjectId && !subject) return { type: "missing" as const };
    if (route.editor === "subject")
      return { type: "subject" as const, offering, subject };
    if (route.editor === "lesson") {
      const lesson = route.lessonId
        ? subject?.lessons?.find(
            (l) => l.id === route.lessonId && l.subject_id === subject.id,
          )
        : undefined;
      if (!subject || (route.lessonId && !lesson))
        return { type: "missing" as const };
      return {
        type: "lesson" as const,
        offeringId: offering.id,
        subjectId: subject.id,
        lesson,
      };
    }
    return {
      type: route.mode === "edit" ? ("editor" as const) : ("detail" as const),
      data: offering,
    };
  } catch (error) {
    return isApiError(error) && error.status === 404
      ? { type: "missing" as const }
      : { type: "failure" as const, error };
  }
}

function cleanQuery(query: Record<string, string | undefined>) {
  return Object.fromEntries(
    Object.entries(query).filter(
      ([key, value]) =>
        ["kind", "status", "role", "search", "cursor"].includes(key) && value,
    ),
  );
}
function InvalidFilters({ base }: { base: string }) {
  return (
    <section className="xp-card" role="alert">
      <h2>راجع مرشحات البحث</h2>
      <p>
        يجب أن يتكون البحث من حرفين إلى مئة حرف، وأن تكون المرشحات ضمن الخيارات
        المتاحة.
      </p>
      <Link className="xp-button xp-button-outline" href={base}>
        إعادة ضبط المرشحات
      </Link>
    </section>
  );
}
function Failure({ error }: { error: unknown }) {
  const forbidden = isApiError(error) && error.status === 403;
  const expired = isApiError(error) && error.status === 401;
  const state = apiFailure(error);
  return (
    <section className="xp-card" role="alert">
      <h2>
        {forbidden
          ? "ليس لديك صلاحية لعرض هذه الصفحة"
          : expired
            ? "انتهت جلستك"
            : "تعذر تحميل السجل"}
      </h2>
      <p>
        {state.status === "error" ? state.message : "حاول مرة أخرى لاحقًا."}
      </p>
      <div className="xp-row">
        <Link className="xp-button xp-button-outline" href="/account">
          العودة إلى حسابي
        </Link>
        {expired ? (
          <Link
            className="xp-button"
            href="/auth/login?redirectTo=%2Fadmin%2Fofferings"
          >
            تسجيل الدخول
          </Link>
        ) : (
          <a className="xp-button xp-button-outline" href="">
            إعادة المحاولة
          </a>
        )}
      </div>
    </section>
  );
}
