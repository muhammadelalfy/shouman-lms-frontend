"use client";

import { useState } from "react";
import { EmptyState, SearchField } from "@/features/experience/shared/ui";
import { sampleLearning } from "./fixtures";
import { StudyCard } from "./study-card";

const filters = [{ id: "all", label: "الكل" }, { id: "current", label: "قيد التعلم" }, { id: "completed", label: "المكتمل" }, { id: "purchased", label: "المشتريات" }] as const;

export function LearningList() {
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const filtered = sampleLearning.filter((item) => (filter === "all" || item.state === filter) && `${item.title} ${item.description}`.includes(query.trim()));
  return <div className="xp-stack">
    <div className="learner-list-toolbar">
      <div className="xp-tabs" aria-label="حالة التعلم">{filters.map((item) => <button key={item.id} type="button" aria-pressed={filter === item.id} onClick={() => setFilter(item.id)}>{item.label}</button>)}</div>
      <SearchField value={query} onChange={setQuery} label="ابحث في أمثلة تعلمي" placeholder="اسم المسار أو الدورة" />
    </div>
    <p className="xp-muted learner-small" role="status">{filtered.length} من أمثلة التعلم · الفلاتر محلية ولا تغيّر سجلك.</p>
    {filtered.length ? <div className="xp-grid xp-grid-2">{filtered.map((item) => <StudyCard key={item.id} item={item} />)}</div> : <EmptyState title="لا توجد أمثلة مطابقة" description="جرّب اسمًا آخر أو اعرض كل الحالات." />}
    {(query || filter !== "all") && <button className="xp-button xp-button-outline learner-fit" type="button" onClick={() => { setQuery(""); setFilter("all"); }}>مسح الفلاتر</button>}
  </div>;
}
