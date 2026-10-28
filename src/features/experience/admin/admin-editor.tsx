"use client";

import Link from "next/link";
import { useId, useRef, useState, type FormEvent } from "react";
import { DemoDataLabel, PreviewAction } from "@/features/experience/shared/ui";
import { localChangeMessage } from "./admin-fixtures";

export type EditorKind = "users" | "offerings" | "subjects" | "lessons" | "quizzes" | "question-bank" | "coupons" | "offers" | "events" | "meetings" | "groups";
const config: Record<EditorKind, { titleLabel: string; bodyLabel: string; options: string[]; optionLabel: string; initial: string; returnHref: string }> = {
  users: { titleLabel: "الاسم المعروض في المثال", bodyLabel: "ملاحظة داخلية توضيحية", optionLabel: "نوع النموذج", options: ["متعلم تجريبي", "مدرّس تجريبي"], initial: "متعلم تجريبي 01", returnHref: "/preview/admin/users" },
  offerings: { titleLabel: "عنوان المحتوى", bodyLabel: "وصف المحتوى", optionLabel: "نوع المحتوى", options: ["مسار", "دورة", "مبادرة", "برنامج مكثف", "برنامج موسمي"], initial: "مدخل إلى العلوم الشرعية", returnHref: "/preview/admin/offerings" },
  subjects: { titleLabel: "عنوان المادة", bodyLabel: "وصف المادة", optionLabel: "المحتوى المرتبط", options: ["مدخل إلى العلوم الشرعية (مثال)"], initial: "مبادئ طلب العلم", returnHref: "/preview/admin/offerings/demo-offering" },
  lessons: { titleLabel: "عنوان الدرس", bodyLabel: "ملخص الدرس", optionLabel: "نوع العرض", options: ["فيديو", "صوت", "نص", "مستند"], initial: "كيف نبدأ رحلة التعلم؟", returnHref: "/preview/admin/subjects/demo-subject" },
  quizzes: { titleLabel: "عنوان الاختبار", bodyLabel: "تعليمات الاختبار", optionLabel: "موضع الاختبار", options: ["مراجعة درس (مثال)", "مراجعة مادة (مثال)"], initial: "مراجعة المفاهيم الأساسية", returnHref: "/preview/admin/quizzes" },
  "question-bank": { titleLabel: "نص السؤال", bodyLabel: "سياق السؤال وملاحظاته", optionLabel: "نوع السؤال", options: ["اختيار واحد", "اختيار متعدد", "إجابة نصية"], initial: "اختر المفهوم المناسب للنص", returnHref: "/preview/admin/question-bank" },
  coupons: { titleLabel: "اسم الكوبون التوضيحي", bodyLabel: "وصف الاستخدام المقترح", optionLabel: "نطاق المثال", options: ["محتوى يُحدّد لاحقًا", "حملة تجريبية"], initial: "كوبون توضيحي أ", returnHref: "/preview/admin/coupons" },
  offers: { titleLabel: "عنوان العرض", bodyLabel: "نص العرض", optionLabel: "موضع العرض", options: ["صفحة محتوى", "الفهرس"], initial: "مساحة عرض توضيحي", returnHref: "/preview/admin/offers" },
  events: { titleLabel: "عنوان الفعالية", bodyLabel: "وصف الفعالية", optionLabel: "تنسيق الفعالية", options: ["حضوري", "عبر الإنترنت"], initial: "ملتقى طلب العلم التجريبي", returnHref: "/preview/admin/events" },
  meetings: { titleLabel: "عنوان اللقاء", bodyLabel: "محاور اللقاء", optionLabel: "المجموعة", options: ["مجموعة تدبر تجريبية", "مجموعة الآداب التجريبية"], initial: "مناقشة أسبوعية تجريبية", returnHref: "/preview/admin/meetings" },
  groups: { titleLabel: "اسم المجموعة", bodyLabel: "وصف المجموعة", optionLabel: "المحتوى المرتبط", options: ["مهارات تدبر القرآن (مثال)", "آداب طلب العلم (مثال)"], initial: "مجموعة تدبر تجريبية", returnHref: "/preview/admin/groups" },
};

export function AdminRecordEditor({ kind, isNew = false }: { kind: EditorKind; isNew?: boolean }) {
  const settings = config[kind];
  const prefix = useId();
  const titleRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(isNew ? "" : settings.initial);
  const [body, setBody] = useState(isNew ? "" : "نص توضيحي لبنية المحتوى. يمكن تعديله محليًا لاستكشاف المحرر، ولا يمثل محتوى معتمدًا من المركز.");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [tab, setTab] = useState("editor");
  const [items, setItems] = useState(["تمهيد توضيحي", "موضوع تعليمي تجريبي", "مراجعة وتأمل"]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) { setError("اكتب عنوانًا لعرض النموذج المحلي."); setFeedback(""); titleRef.current?.focus(); return; }
    setError(""); setFeedback(localChangeMessage);
  }

  function reorder(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items]; [next[index], next[target]] = [next[target], next[index]];
    setItems(next); setFeedback(localChangeMessage);
  }

  const structure = ["offerings", "subjects", "quizzes", "question-bank"].includes(kind);
  return <div className="admin-editor-layout"><section className="xp-card admin-editor"><div className="admin-editor-top"><DemoDataLabel /><div className="xp-tabs" role="group" aria-label="عرض المحرر"><button type="button" aria-pressed={tab === "editor"} onClick={() => setTab("editor")}>التحرير</button><button type="button" aria-pressed={tab === "preview"} onClick={() => setTab("preview")}>معاينة المحتوى</button></div></div>
    {tab === "preview" ? <article className="admin-content-preview"><p className="admin-eyebrow">معاينة محلية للنص</p><h2>{title || "عنوان غير مدخل"}</h2><p>{body || "أدخل وصفًا في المحرر لعرضه هنا."}</p><p className="xp-muted">التصنيف: {category || "لم يُحدّد"}</p><button className="xp-button xp-button-outline" type="button" onClick={() => setTab("editor")}>العودة للتحرير</button></article> : <form onSubmit={submit} noValidate><div className="xp-field"><label htmlFor={`${prefix}-title`}>{settings.titleLabel} <span className="xp-muted">(مطلوب للمعاينة)</span></label><input ref={titleRef} id={`${prefix}-title`} value={title} onChange={(event) => setTitle(event.target.value)} aria-invalid={!!error} aria-describedby={error ? `${prefix}-error` : undefined} required />{error && <p id={`${prefix}-error`} className="admin-field-error" role="alert">{error}</p>}</div><div className="xp-field"><label htmlFor={`${prefix}-body`}>{settings.bodyLabel}</label><textarea className="resize-none" id={`${prefix}-body`} rows={6} value={body} onChange={(event) => setBody(event.target.value)} /></div><div className="xp-field"><label htmlFor={`${prefix}-category`}>{settings.optionLabel}</label><select id={`${prefix}-category`} value={category} onChange={(event) => setCategory(event.target.value)}><option value="">اختر للمعاينة</option>{settings.options.map((option) => <option key={option}>{option}</option>)}</select></div>
    {(kind === "events" || kind === "meetings") && <div className="xp-field"><label htmlFor={`${prefix}-date`}>تاريخ توضيحي</label><input id={`${prefix}-date`} type="date" aria-describedby={`${prefix}-date-help`} /><p id={`${prefix}-date-help`} className="xp-muted">منتقي التاريخ الأصلي للمتصفح؛ لا ينشئ موعدًا أو حجزًا.</p></div>}
    {kind === "lessons" && <div className="admin-inline-note"><h3>وسائط الدرس ومرفقاته</h3><p>لم تُرفع ملفات. توصيل الوسائط الخاصة والتخزين الآمن يحتاج إلى خدمة معتمدة.</p><PreviewAction title="وسائط الدرس" description="لا تُرفع أو تُحمّل ملفات في هذه المعاينة.">استكشاف إرفاق وسيط</PreviewAction></div>}
    {(kind === "quizzes" || kind === "question-bank") && <div className="admin-inline-note"><h3>سياسة التقييم بانتظار الاعتماد</h3><p>لا قيمة افتراضية للنجاح أو المحاولات أو المؤقت أو إظهار الإجابات. هذه المعاينة لا تُصحح إجابات.</p></div>}
    {(kind === "coupons" || kind === "offers") && <div className="admin-inline-note"><h3>الشروط المالية غير معتمدة</h3><p>لم تُضبط قيمة خصم أو مدة أو حد استخدام. لا تُجرى حسابات مالية أو تغييرات أسعار.</p></div>}
    {kind === "users" && <div className="admin-inline-note"><h3>بيانات اصطناعية فقط</h3><p>لا تدخل أسماء أو بيانات اتصال حقيقية. تغيير الأدوار والحسابات يحتاج إلى سياسة Laravel وصلاحيات موثوقة.</p></div>}
    <div className="admin-form-actions"><button className="xp-button" type="submit">تطبيق محلي للمعاينة</button><Link className="xp-button xp-button-outline" href={settings.returnHref}>العودة دون حفظ</Link></div></form>}
    <p className="admin-local-feedback" role="status" aria-live="polite">{feedback || "أي تعديل هنا مؤقت ويُزال عند مغادرة الصفحة."}</p></section>
    <aside className="xp-stack">{structure && <section className="xp-card"><h2>{kind === "quizzes" || kind === "question-bank" ? "ترتيب الأسئلة التوضيحية" : "ترتيب عناصر المحتوى"}</h2><p className="xp-muted">أعد الترتيب لاستكشاف البنية، دون حفظ أو تغيير متطلبات التعلم.</p><ol className="admin-reorder-list">{items.map((item, index) => <li key={item}><span>{item}</span><div className="xp-row"><button type="button" className="admin-small-button" disabled={index === 0} onClick={() => reorder(index, -1)} aria-label={`رفع ${item}`}>↑</button><button type="button" className="admin-small-button" disabled={index === items.length - 1} onClick={() => reorder(index, 1)} aria-label={`خفض ${item}`}>↓</button></div></li>)}</ol>{kind === "offerings" && <Link className="admin-text-link" href="/preview/admin/subjects/demo-subject">افتح محرر المادة ←</Link>}{kind === "subjects" && <Link className="admin-text-link" href="/preview/admin/lessons/demo-lesson">افتح محرر الدرس ←</Link>}{kind === "quizzes" && <Link className="admin-text-link" href="/preview/admin/question-bank">استكشف بنك الأسئلة ←</Link>}</section>}
    <section className="xp-card"><p className="admin-eyebrow">قائمة المراجعة</p><h2>قبل التفعيل الفعلي</h2><ul className="admin-checklist"><li>مراجعة النصوص والحقول المطلوبة.</li><li>اعتماد السياسة والصلاحيات ذات الصلة.</li><li>ربط الخدمة والتحقق من النتيجة.</li></ul><PreviewAction title="النشر غير متصل" description="لا يُنشر هذا المثال أو يُرسل للمراجعة. أي تغيير محلي للمعاينة فقط؛ لم يُحفظ.">استكشاف مسار المراجعة</PreviewAction></section></aside></div>;
}
