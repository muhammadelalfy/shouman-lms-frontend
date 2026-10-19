import Link from "next/link";
import type { AdminUser } from "../types";
import type { CursorPaginated } from "@/lib/api/types";
import { roleNames, statusNames } from "../schemas/common";
import {
  ListFilters,
  CursorNavigation,
  type ListQuery,
} from "../components/list-controls";
export function UserList({
  result,
  query,
}: {
  result: CursorPaginated<AdminUser>;
  query: ListQuery;
}) {
  return (
    <>
      <ListFilters base="/admin/users" query={query} users />
      {result.data.length ? (
        <div
          className="xp-table-wrap"
          tabIndex={0}
          role="region"
          aria-label="جدول المستخدمين"
        >
          <table>
            <caption>المستخدمون · بيانات من سجل الأكاديمية</caption>
            <thead>
              <tr>
                <th>الاسم</th>
                <th>البريد الإلكتروني</th>
                <th>الحالة</th>
                <th>الأدوار</th>
                <th>التفاصيل</th>
              </tr>
            </thead>
            <tbody>
              {result.data.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>
                    <bdi dir="ltr">{u.email}</bdi>
                  </td>
                  <td>{statusNames[u.status]}</td>
                  <td>
                    {u.roles?.map((r) => roleNames[r]).join("، ") ||
                      "بلا أدوار"}
                  </td>
                  <td>
                    <Link
                      className="xp-button xp-button-outline"
                      href={`/admin/users/${u.id}`}
                      aria-label={`فتح الملف ${u.name}`}
                    >
                      فتح الملف
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <section className="xp-empty">
          <h2>
            {Object.values(query).some(Boolean)
              ? "لا توجد نتائج مطابقة"
              : "لا يوجد مستخدمون للعرض"}
          </h2>
          <p>يمكنك تغيير المرشحات أو العودة إلى القائمة الكاملة.</p>
        </section>
      )}
      <CursorNavigation
        base="/admin/users"
        query={query}
        next={result.meta.next_cursor}
        previous={result.meta.prev_cursor}
      />
    </>
  );
}
