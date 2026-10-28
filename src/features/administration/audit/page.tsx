import "server-only";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionToken } from "@/lib/auth/session";
import { isApiError } from "@/lib/api/errors";
import { AdminShell } from "../components/admin-shell";
import { getAdminAccess } from "../server/access";
import { canUseCsv } from "../csv/resources";
import { listAuditLogs } from "./api";
import { AuditLogList } from "./list";
import { auditHref, auditPath, parseAuditQuery } from "./query";
import type { AuditPageQuery } from "./types";

export async function AuditLogPage({ query }: { query: AuditPageQuery }) {
  // A missing cookie is a guest, while /me revalidates current active access.
  if (!await getSessionToken()) redirect(`/auth/login?redirectTo=${encodeURIComponent(auditPath)}`);
  let access;
  try {
    access = await getAdminAccess("audit.view", auditPath);
  } catch (error) {
    if (!isApiError(error)) throw error;
    return <AdminShell title="سجل التدقيق"><AuditFailure forbidden={error.status === 403} retryHref={auditPath} /></AdminShell>;
  }
  const { token, user } = access;
  if (user.status !== "active" || !canUseCsv("audit-logs", user.permissions, false, user.roles)) {
    return <AdminShell title="سجل التدقيق"><AuditFailure forbidden retryHref={auditPath} /></AdminShell>;
  }
  const parsed = parseAuditQuery(query);
  let content;
  if (!parsed.success) content = <InvalidQuery />;
  else {
    let result;
    let errorStatus;
    try {
      result = await listAuditLogs(token, parsed.values);
    } catch (error) {
      if (!isApiError(error)) throw error;
      if (error.status === 401) redirect(`/auth/login?redirectTo=${encodeURIComponent(auditPath)}&expired=1`);
      errorStatus = error.status;
    }
    content = result ? <AuditLogList result={result} query={parsed.values} />
      : errorStatus === 422 ? <InvalidQuery /> : <AuditFailure forbidden={errorStatus === 403} retryHref={auditHref(parsed.values)} />;
  }
  return <AdminShell title="سجل التدقيق" permissions={user.permissions} roles={user.roles} currentSection="audit">{content}</AdminShell>;
}
function InvalidQuery() {
  return <section className="xp-card" role="alert">
    <h2>تعذر تطبيق رابط سجل التدقيق</h2>
    <p>رابط التصفح غير صالح أو يتضمن خيارات غير مدعومة. أعد ضبط الرابط لعرض بداية السجل.</p>
    <Link className="xp-button xp-button-outline" href={auditPath}>إعادة ضبط الرابط</Link>
  </section>;
}
function AuditFailure({ forbidden = false, retryHref }: { forbidden?: boolean; retryHref: string }) {
  return <section className="xp-card" role="alert">
    <h2>{forbidden ? "ليس لديك صلاحية لعرض سجل التدقيق" : "تعذر تحميل سجل التدقيق"}</h2>
    <p>{forbidden ? "يتطلب عرض السجل حسابًا نشطًا لديه دور وصلاحية الوصول المعتمدان." : "تعذر إتاحة السجل الآن. أعد المحاولة لاحقًا."}</p>
    <div className="xp-row">
      {!forbidden && <Link className="xp-button xp-button-outline" href={retryHref}>إعادة المحاولة</Link>}
      <Link className="xp-button xp-button-outline" href="/account">العودة إلى حسابي</Link>
    </div>
  </section>;
}
