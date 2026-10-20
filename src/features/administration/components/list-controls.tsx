import Link from "next/link";
import { Field, SelectField } from "./fields";
import { roles, roleNames, statusNames, kindNames } from "../schemas/common";
export type ListQuery = Record<string, string | undefined>;
export function ListFilters({
  base,
  query,
  users = false,
}: {
  base: string;
  query: ListQuery;
  users?: boolean;
}) {
  return (
    <form action={base} className="admin-toolbar" noValidate>
      <Field
        name="search"
        label="البحث"
        value={query.search}
        hint="اكتب حرفين على الأقل"
      />
      <SelectField name="status" label="الحالة" value={query.status ?? ""}>
        <option value="">كل الحالات</option>
        {(users
          ? ["active", "disabled"]
          : ["draft", "published", "hidden", "archived"]
        ).map((s) => (
          <option key={s} value={s}>
            {statusNames[s]}
          </option>
        ))}
      </SelectField>
      <SelectField
        name={users ? "role" : "kind"}
        label={users ? "الدور" : "نوع المحتوى"}
        value={(users ? query.role : query.kind) ?? ""}
      >
        <option value="">الكل</option>
        {(users ? roles : Object.keys(kindNames)).map((s) => (
          <option key={s} value={s}>
            {users ? roleNames[s] : kindNames[s]}
          </option>
        ))}
      </SelectField>
      <button className="xp-button" type="submit">
        تطبيق
      </button>
      <Link className="xp-button xp-button-outline" href={base}>
        مسح المرشحات
      </Link>
    </form>
  );
}
export function CursorNavigation({
  base,
  query,
  next,
  previous,
}: {
  base: string;
  query: ListQuery;
  next: string | null;
  previous: string | null;
}) {
  const href = (cursor: string) => {
    const p = new URLSearchParams();
    for (const [key, value] of Object.entries(query))
      if (value && key !== "cursor") p.set(key, value);
    p.set("cursor", cursor);
    return `${base}?${p}`;
  };
  return (
    <nav className="admin-pagination" aria-label="صفحات النتائج">
      {previous && (
        <Link className="xp-button xp-button-outline" href={href(previous)}>
          النتائج السابقة
        </Link>
      )}
      {next && (
        <Link className="xp-button xp-button-outline" href={href(next)}>
          المزيد من النتائج
        </Link>
      )}
    </nav>
  );
}
