"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { DemoDataLabel, EmptyState, SearchField, StatusBadge } from "@/features/experience/shared/ui";
import type { AdminTableDefinition } from "./admin-fixtures";

/** Deliberately local: these bounded fixtures never represent an administrative dataset. */
export function AdminTable({ definition }: { definition: AdminTableDefinition }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [descending, setDescending] = useState(false);
  const [page, setPage] = useState(1);
  const filterId = useId();
  const pageSize = 5;
  const statuses = [...new Set(definition.rows.map((item) => item.cells[2]))];
  const filtered = useMemo(() => definition.rows.filter((item) =>
    item.cells.join(" ").includes(query.trim()) && (!status || item.cells[2] === status),
  ).sort((a, b) => a.cells[0].localeCompare(b.cells[0], "ar") * (descending ? -1 : 1)), [definition.rows, query, status, descending]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const shown = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return <section className="xp-card admin-table-panel" aria-label={`قائمة ${definition.title} التجريبية`}>
    <div className="admin-table-toolbar">
      <SearchField value={query} onChange={(value) => { setQuery(value); setPage(1); }} label={`ابحث في ${definition.title} التجريبية`} placeholder="ابحث في الأمثلة المعروضة" />
      <div className="xp-field"><label htmlFor={filterId}>حالة المثال</label><select id={filterId} value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="">جميع الحالات</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select></div>
      {(query || status) && <button className="xp-button xp-button-outline" type="button" onClick={() => { setQuery(""); setStatus(""); setPage(1); }}>مسح المرشحات</button>}
    </div>
    <div className="admin-table-caption"><DemoDataLabel /><span className="xp-muted" role="status">{filtered.length} أمثلة مطابقة — البحث والتصفية محليان</span></div>
    {shown.length ? <div className="xp-table-wrap" tabIndex={0} aria-label="جدول الأمثلة، يمكن تمريره أفقيًا"><table className="admin-table"><caption className="admin-visually-hidden">{definition.title} — بيانات اصطناعية للمعاينة</caption><thead><tr>{definition.columns.map((column, index) => <th key={column} scope="col" aria-sort={index === 0 ? (descending ? "descending" : "ascending") : undefined}>{index === 0 ? <button type="button" className="admin-sort-button" onClick={() => setDescending(!descending)}>{column}<span aria-hidden="true">{descending ? " ↓" : " ↑"}</span></button> : column}</th>)}<th scope="col">الإجراء</th></tr></thead><tbody>{shown.map((item) => <tr key={item.id}>{item.cells.map((value, index) => <td key={index}>{index === 0 ? <Link className="admin-record-link" href={item.href}>{value}</Link> : index === 2 ? <StatusBadge tone={value.includes("مراجعة") ? "warning" : "neutral"}>{value}</StatusBadge> : <span dir={/^[A-Z]/.test(value) ? "ltr" : undefined}>{value}</span>}</td>)}<td><Link className="admin-text-link" href={item.href} aria-label={`فتح معاينة ${item.cells[0]}`}>فتح المعاينة ←</Link></td></tr>)}</tbody></table></div> : <EmptyState title="لا توجد أمثلة مطابقة" description="غيّر كلمة البحث أو حالة المثال، أو امسح المرشحات لعرض القائمة التجريبية كاملة." />}
    <nav className="admin-pagination" aria-label="صفحات الأمثلة المحلية"><p>الصفحة {currentPage} من {pageCount} · {filtered.length ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, filtered.length)} من {filtered.length}</p><div className="xp-row"><button className="xp-button xp-button-outline" type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>السابق</button><button className="xp-button xp-button-outline" type="button" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>التالي</button></div></nav>
  </section>;
}
