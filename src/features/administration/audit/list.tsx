import Link from "next/link";
import { CursorNavigation } from "../components/list-controls";
import { CsvControls } from "../csv/controls";
import { roles } from "../schemas/common";
import { auditPath } from "./query";
import type { AuditLog, AuditLogCollection, AuditQuery } from "./types";

const actions: Record<string, { type: string; label: string; typeLabel: string }> = {
  "identity.user.status_changed": { type: "user", label: "تغيير حالة المستخدم", typeLabel: "مستخدم" },
  "identity.user.roles_changed": { type: "user", label: "تغيير أدوار المستخدم", typeLabel: "مستخدم" },
  "identity.role.permissions_changed": { type: "role", label: "تغيير صلاحيات الدور", typeLabel: "دور" },
  "course.offering.status_changed": { type: "offering", label: "تغيير حالة المحتوى التعليمي", typeLabel: "محتوى تعليمي" },
  "course.offering.pricing_changed": { type: "offering", label: "تغيير تسعير المحتوى التعليمي", typeLabel: "محتوى تعليمي" },
};
function knownAction(row: AuditLog) {
  const action = row.action && Object.hasOwn(actions, row.action) ? actions[row.action] : null;
  return action?.type === row.subject_type ? action : null;
}
function subjectId(row: AuditLog): string | null {
  if (!knownAction(row) || !row.subject_id) return null;
  if (row.subject_type === "role") return roles.some(role => role === row.subject_id) ? row.subject_id : null;
  return /^[1-9][0-9]*$/.test(row.subject_id) && (row.subject_id.length < 19 || (row.subject_id.length === 19 && row.subject_id <= "9223372036854775807")) ? row.subject_id : null;
}
function Identifier({ value }: { value: number | string | null }) {
  return value === null ? <>غير متاح</> : <bdi dir="ltr">{value}</bdi>;
}
export function AuditLogList({ result, query }: { result: AuditLogCollection; query: AuditQuery }) {
  return <>
    <p>بيانات التدقيق المسموح بعرضها، مرتبة من معرّف السجل الأحدث إلى الأقدم. قد تتغير السجلات بين الزيارات.</p>
    <CsvControls resource="audit-logs" label="سجل التدقيق" returnTo={auditPath} />
    {result.data.length ? <div className="xp-table-wrap audit-table-region" role="region" tabIndex={0} aria-label="جدول سجل التدقيق">
      <table dir="rtl">
        <caption>سجل التدقيق · بيانات من سجل المركز</caption>
        <thead><tr>{["معرّف السجل", "معرّف المنفذ", "الإجراء", "نوع السجل", "معرّف السجل المعني", "معرّف الطلب", "الوقت (UTC)"].map(heading => <th key={heading} scope="col">{heading}</th>)}</tr></thead>
        <tbody>{result.data.map(row => {
          const action = knownAction(row);
          return <tr key={row.id}>
            <td><Identifier value={row.id} /></td>
            <td><Identifier value={row.actor_id} /></td>
            <td>{action?.label ?? "غير متاح"}</td>
            <td>{action?.typeLabel ?? "غير متاح"}</td>
            <td><Identifier value={subjectId(row)} /></td>
            <td><Identifier value={row.request_id && /^[A-Za-z0-9._-]{8,64}$/.test(row.request_id) ? row.request_id : null} /></td>
            <td><bdi dir="ltr"><time dateTime={row.created_at}>{row.created_at} UTC</time></bdi></td>
          </tr>;
        })}</tbody>
      </table>
    </div> : <section className="xp-empty">
      <h2>لا توجد سجلات تدقيق للعرض</h2>
      <p>{query.cursor ? "لا توجد سجلات عند موضع التصفح الحالي. يمكنك العودة إلى بداية السجل." : "لم يُرجع سجل المركز أي سجلات تدقيق."}</p>
      {query.cursor && <Link className="xp-button xp-button-outline" href={auditPath}>العودة إلى بداية السجل</Link>}
    </section>}
    <CursorNavigation base={auditPath} query={query} next={result.meta.next_cursor} previous={result.meta.prev_cursor} />
  </>;
}
