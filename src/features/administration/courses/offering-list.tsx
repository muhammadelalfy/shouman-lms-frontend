import Link from "next/link";
import { CsvControls } from "../csv/controls";
import type { AdminOffering } from "../types";
import type { CursorPaginated } from "@/lib/api/types";
import { kindNames, statusNames } from "../schemas/common";
import {
  ListFilters,
  CursorNavigation,
  type ListQuery,
} from "../components/list-controls";
export function OfferingList({
  result,
  query,
  manage,
}: {
  result: CursorPaginated<AdminOffering>;
  query: ListQuery;
  manage: boolean;
}) {
  return (
    <>
      <CsvControls resource="offerings" label="المحتوى التعليمي" canImport={manage} filters={query} />
      {manage && (
        <Link className="xp-button" href="/admin/offerings/new">
          إنشاء محتوى تعليمي
        </Link>
      )}
      <ListFilters base="/admin/offerings" query={query} />
      {result.data.length ? (
        <div
          className="xp-table-wrap"
          tabIndex={0}
          role="region"
          aria-label="جدول المحتوى التعليمي"
        >
          <table>
            <caption>محتوى الأكاديمية · بيانات من السجل</caption>
            <thead>
              <tr>
                <th>العنوان</th>
                <th>النوع</th>
                <th>الحالة</th>
                <th>المواد</th>
                <th>التفاصيل</th>
              </tr>
            </thead>
            <tbody>
              {result.data.map((o) => (
                <tr key={o.id}>
                  <td>{o.title}</td>
                  <td>{kindNames[o.kind]}</td>
                  <td>{statusNames[o.status]}</td>
                  <td>{o.subjects_count ?? "—"}</td>
                  <td>
                    <Link
                      className="xp-button xp-button-outline"
                      href={`/admin/offerings/${o.id}`}
                      aria-label={`فتح المحتوى ${o.title}`}
                    >
                      فتح المحتوى
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
              : "لم يضف محتوى بعد"}
          </h2>
          <p>غيّر المرشحات أو أضف محتوى إن كانت لديك صلاحية التحرير.</p>
        </section>
      )}
      <CursorNavigation
        base="/admin/offerings"
        query={query}
        next={result.meta.next_cursor}
        previous={result.meta.prev_cursor}
      />
    </>
  );
}
