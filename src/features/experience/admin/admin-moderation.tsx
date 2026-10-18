"use client";

import { useState } from "react";
import { DemoDataLabel, EmptyState, PreviewAction, SearchField, StatusBadge } from "@/features/experience/shared/ui";
import { localChangeMessage } from "./admin-fixtures";

const exampleReports = [
  {
    id: "demo-report-01",
    title: "طلب مراجعة منشور توضيحي",
    author: "متعلم تجريبي 01",
    reporter: "متعلم تجريبي 02",
    group: "مجموعة تدبر تجريبية",
    context: "منشور توضيحي عن تنظيم الملاحظات أثناء القراءة.",
    note: "ملاحظة اصطناعية لشرح مكان سياق البلاغ. لا تتضمن اتهامًا أو مخالفة حقيقية.",
  },
  {
    id: "demo-report-02",
    title: "طلب مراجعة تعليق توضيحي",
    author: "متعلم تجريبي 03",
    reporter: "متعلم تجريبي 04",
    group: "مجموعة الآداب التجريبية",
    context: "تعليق توضيحي يسأل عن ترتيب الأفكار في ملخص الدرس.",
    note: "مثال ثانٍ لعرض سياق نقاش وملاحظة مراجعة، دون تصنيف مخالفة أو قرار إشراف.",
  },
];

/** Anonymous examples; selecting or filtering never changes moderation records. */
export function AdminModeration() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(exampleReports[0].id);
  const [feedback, setFeedback] = useState("");
  const shown = exampleReports.filter((report) => `${report.title} ${report.group}`.includes(query.trim()));
  const selected = shown.find((report) => report.id === selectedId) || shown[0];

  return <div className="xp-stack">
    <section className="xp-card admin-inline-note">
      <DemoDataLabel />
      <h2>المراجعة البشرية وسياسة المجتمع</h2>
      <p>قواعد النشر والبلاغات وإجراءات الإشراف تنتظر اعتماد الأكاديمية ضمن OP-9. لا نفترض مخالفة أو عقوبة، ولا يُخفى أو يُحذف أو يُعتمد محتوى من هذه المعاينة.</p>
      <StatusBadge tone="warning">سياسة المجتمع بانتظار الاعتماد</StatusBadge>
    </section>
    <div className="admin-editor-layout">
      <section className="xp-card">
        <h2>قائمة طلبات المراجعة التوضيحية</h2>
        <SearchField value={query} onChange={setQuery} label="ابحث في طلبات المراجعة التجريبية" placeholder="عنوان الطلب أو المجموعة" />
        <p className="xp-muted">{shown.length} أمثلة مطابقة · لا بلاغات حقيقية</p>
        <div className="admin-candidate-list" role="group" aria-label="طلبات المراجعة المحلية">
          {shown.map((report) => <button
            key={report.id}
            className="admin-candidate"
            type="button"
            aria-pressed={selected?.id === report.id}
            onClick={() => { setSelectedId(report.id); setFeedback(localChangeMessage); }}
          >
            <span className="admin-avatar" aria-hidden="true">م</span>
            <span><strong>{report.title}</strong><small>{report.group}</small></span>
            <span aria-hidden="true">←</span>
          </button>)}
        </div>
        {!shown.length && <EmptyState title="لا توجد أمثلة مطابقة" description="غيّر البحث أو امسحه لعرض طلبات المراجعة التوضيحية." />}
        <p className="admin-local-feedback" role="status">{feedback || "البحث واختيار الطلب محليان ولا يغيّران أي سجل."}</p>
      </section>
      <section className="xp-card" aria-label="سياق طلب المراجعة">
        {selected ? <>
          <p className="admin-eyebrow">سياق اصطناعي · غير منشور</p>
          <h2>{selected.title}</h2>
          <dl className="admin-definition-list">
            <div><dt>صاحب المحتوى التوضيحي</dt><dd>{selected.author}</dd></div>
            <div><dt>مقدم الطلب التوضيحي</dt><dd>{selected.reporter}</dd></div>
            <div><dt>المجموعة</dt><dd>{selected.group}</dd></div>
          </dl>
          <article className="admin-moderation-item"><h3>سياق المحتوى</h3><p>{selected.context}</p><h3>ملاحظة الطلب</h3><p>{selected.note}</p></article>
          <div className="admin-form-actions"><PreviewAction
            title="لا قرار إشراف في المعاينة"
            description="لم يُحذف أو يُخفَ محتوى، ولم يُعتمد بلاغ أو يتغير حساب. يتطلب القرار البشري سياسة معتمدة وصلاحية وسجل تدقيق. تغيير محلي للمعاينة فقط؛ لم يُحفظ."
          >استكشاف خيارات المراجعة</PreviewAction></div>
        </> : <><h2>اختر طلبًا توضيحيًا</h2><p className="xp-muted">لا يوجد طلب مطابق للبحث الحالي. امسح البحث لعرض السياق الاصطناعي.</p></>}
      </section>
    </div>
  </div>;
}
