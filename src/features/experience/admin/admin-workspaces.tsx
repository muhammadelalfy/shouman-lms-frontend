"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { DemoDataLabel, PreviewAction, StatusBadge } from "@/features/experience/shared/ui";
import { localChangeMessage } from "./admin-fixtures";

function LocalFeedback({ message }: { message: string }) {
  return <p className="admin-local-feedback" role="status" aria-live="polite">{message || "الاختيارات مؤقتة للعرض، ولا تُحدّث أي سجل."}</p>;
}

export function RoleMatrix() {
  const id = useId();
  const [role, setRole] = useState("مدرّس");
  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const permissions = ["استعراض المحتوى", "إعداد مسودة محتوى", "استعراض مجموعة", "مراجعة مشروع", "استعراض تقرير"];
  function toggle(permission: string) {
    setSelected(selected.includes(permission) ? selected.filter((item) => item !== permission) : [...selected, permission]); setFeedback(localChangeMessage);
  }
  return <div className="xp-stack"><section className="xp-card"><DemoDataLabel /><div className="admin-role-toolbar"><div className="xp-field"><label htmlFor={id}>الدور في النموذج</label><select id={id} value={role} onChange={(event) => { setRole(event.target.value); setSelected([]); setFeedback(""); }}><option>متعلم</option><option>مدرّس</option><option>مشرف</option><option>مقيّم</option><option>مدير الأكاديمية</option></select></div><div><h2>مصفوفة صلاحيات توضيحية</h2><p className="xp-muted">كل الخيارات غير محددة مبدئيًا؛ لا تمثل الصلاحيات الحالية لهذا الدور.</p></div></div><div className="xp-table-wrap"><table className="admin-table"><caption>أمثلة قابلة للاختيار محليًا — الدور: {role}</caption><thead><tr><th scope="col">القدرة التوضيحية</th><th scope="col">اختيار محلي</th><th scope="col">الأثر الحقيقي</th></tr></thead><tbody>{permissions.map((permission) => <tr key={permission}><th scope="row">{permission}</th><td><input className="admin-checkbox" type="checkbox" checked={selected.includes(permission)} onChange={() => toggle(permission)} aria-label={`اختيار ${permission} محليًا`} /></td><td>لا تغيير في الصلاحيات</td></tr>)}</tbody></table></div><LocalFeedback message={feedback} /><PreviewAction title="تغيير الصلاحيات غير متصل" description="تتطلب تغييرات الأدوار تحقق صلاحيات Laravel وموانع التصعيد وسجل تدقيق. لم تتغير أي صلاحية.">استكشاف مراجعة الصلاحيات</PreviewAction></section><section className="xp-card admin-inline-note"><h2>ضمانات مسؤول النظام</h2><p>دور مسؤول النظام محمي وتظل صلاحياته مقفلة. لا يمكن تعطيل آخر مسؤول نشط أو إزالة حمايته عبر الواجهة. تمنع سياسات الخادم تعديل حالة الحساب الذاتية والتصعيد غير المصرح.</p><StatusBadge tone="info">قرار معماري معتمد — ADR 004</StatusBadge></section></div>;
}

export function MessageComposer({ campaign = false }: { campaign?: boolean }) {
  const id = useId();
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("");
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) { setError("اكتب عنوانًا للرسالة التجريبية."); titleRef.current?.focus(); return; }
    if (!body.trim()) { setError("اكتب نصًا لعرض معاينة الرسالة."); bodyRef.current?.focus(); return; }
    setError(""); setFeedback(`${localChangeMessage}، ولم تُرسل أي رسالة.`);
  }
  return <div className="admin-editor-layout"><section className="xp-card"><DemoDataLabel /><h2>{campaign ? "محتوى الحملة" : "محتوى الإشعار"}</h2><form onSubmit={submit} noValidate><div className="xp-field"><label htmlFor={`${id}-title`}>عنوان الرسالة (مطلوب للمعاينة)</label><input ref={titleRef} id={`${id}-title`} value={title} onChange={(event) => setTitle(event.target.value)} required aria-invalid={!!error && !title.trim()} aria-describedby={error ? `${id}-error` : undefined} /></div><div className="xp-field"><label htmlFor={`${id}-body`}>نص الرسالة (مطلوب للمعاينة)</label><textarea className="resize-none" ref={bodyRef} id={`${id}-body`} rows={7} value={body} onChange={(event) => setBody(event.target.value)} required aria-invalid={!!error && !!title.trim() && !body.trim()} aria-describedby={error ? `${id}-error` : undefined} /></div><fieldset className="admin-fieldset"><legend>الجمهور التوضيحي</legend>{["متعلمون تجريبيون", "مجموعة تعليمية تجريبية", "فريق تجريبي"].map((item) => <label className="admin-radio-label" key={item}><input type="radio" name={`${id}-audience`} value={item} checked={audience === item} onChange={() => setAudience(item)} />{item}</label>)}</fieldset>{error && <p id={`${id}-error`} className="admin-field-error" role="alert">{error}</p>}<div className="admin-form-actions"><button type="submit" className="xp-button">تطبيق محلي للمعاينة</button><PreviewAction title="الجدولة غير متصلة" description="لا يتم إرسال أو جدولة رسائل. تحديد القناة والمزود وسياسة الجمهور يحتاج إلى اعتماد وربط الخدمة.">استكشاف الجدولة</PreviewAction></div></form><LocalFeedback message={feedback} /></section><aside className="xp-stack"><section className="xp-card admin-message-preview"><p className="admin-eyebrow">شكل الرسالة لدى المستلم</p><span className="admin-message-symbol" aria-hidden="true">✉</span><h2>{title || "عنوان الرسالة"}</h2><p>{body || "سيظهر النص الذي تكتبه هنا لمعاينة شكله فقط."}</p><hr /><p className="xp-muted">الجمهور: {audience || "لم يُحدد"}</p><StatusBadge>معاينة — لم تُرسل</StatusBadge></section><section className="xp-card"><h2>القنوات والتسليم</h2><p>مزود الرسائل غير متصل. لا أعداد حقيقية للمستلمين أو حالات وصول أو فتح.</p><p className="xp-muted">لا تدخل بيانات اتصال أو روابط خاصة في هذه المعاينة.</p></section></aside></div>;
}

export function EvaluationWorkspace() {
  const id = useId();
  const [notes, setNotes] = useState("");
  const [tab, setTab] = useState("submission");
  const [feedback, setFeedback] = useState("");
  return <div className="admin-evaluator-layout"><section className="xp-card"><DemoDataLabel /><div className="xp-tabs" role="group" aria-label="محتوى المشروع"><button type="button" aria-pressed={tab === "submission"} onClick={() => setTab("submission")}>التسليم التوضيحي</button><button type="button" aria-pressed={tab === "history"} onClick={() => setTab("history")}>خطوات المراجعة</button></div>{tab === "submission" ? <article className="admin-project-paper"><p className="admin-eyebrow">مشروع توضيحي · متعلم تجريبي 01</p><h2>خطة قراءة وتأمل</h2><h3>وصف النموذج</h3><p>نموذج لتخطيط القراءة وربط الأفكار بالعمل. هذا النص اصطناعي ولا يمثل تسليم متعلم أو ملفًا مرفوعًا.</p><h3>مساحة المستند</h3><p>تُعرض هنا نسخة آمنة من المستند بعد توفير خدمة الملفات والصلاحيات. لا يوجد ملف حقيقي في المعاينة.</p><PreviewAction title="المرفق غير متصل" description="لا يوجد ملف للتحميل أو استعراض محتوى خاص في هذه الصفحة.">استكشاف معاينة المرفق</PreviewAction></article> : <ol className="admin-timeline"><li><strong>استلام التسليم</strong><p>تحتاج هذه الخطوة إلى مصدر تسليم موثوق.</p></li><li><strong>مراجعة بشرية</strong><p>يتحقق المقيّم من المحتوى والمعايير المعتمدة.</p></li><li><strong>قرار موثق</strong><p>لا يُتخذ أو يُسجل قرار داخل هذه المعاينة.</p></li></ol>}</section><aside className="xp-stack"><section className="xp-card"><h2>ملاحظات المقيّم</h2><p className="xp-muted">لم تُعتمد معايير التقييم أو أوزانها. لا تُحسب درجة أو توصية هنا.</p><div className="xp-field"><label htmlFor={id}>ملاحظات توضيحية</label><textarea className="resize-none" id={id} rows={6} value={notes} onChange={(event) => setNotes(event.target.value)} /></div><button className="xp-button" type="button" onClick={() => setFeedback(localChangeMessage)}>تطبيق الملاحظات محليًا</button><LocalFeedback message={feedback} /></section><section className="xp-card admin-inline-note"><h2>التحليل المساعد</h2><StatusBadge tone="warning">غير متصل — لا تحليل آلي</StatusBadge><p>تُفصل المساعدة الاستشارية عن قرار المقيّم البشري. لا يثبت هذا النموذج اجتيازًا أو أهلية لشهادة.</p><PreviewAction title="القرار البشري غير متصل" description="لا قبول أو رفض أو درجة في المعاينة. يحتاج القرار إلى معايير معتمدة وصلاحية وسجل تدقيق.">استكشاف مراجعة القرار</PreviewAction></section></aside></div>;
}

export function RubricBuilder() {
  const id = useId();
  const [criteria, setCriteria] = useState(["معيار توضيحي أ", "معيار توضيحي ب"]);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  function add(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!value.trim()) { setError("اكتب اسم معيار توضيحي."); ref.current?.focus(); return; } setCriteria([...criteria, value.trim()]); setValue(""); setError(""); setFeedback(localChangeMessage); }
  return <div className="xp-grid xp-grid-2"><section className="xp-card"><DemoDataLabel /><h2>بنية نموذج التقييم</h2><p>العناوين أمثلة حرة؛ لا معايير أو درجات أو أوزان معتمدة.</p><ol className="admin-criteria-list">{criteria.map((item, index) => <li key={`${index}-${item}`}><strong>{item}</strong><span className="xp-muted">الوزن والوصف ينتظران الاعتماد</span></li>)}</ol><form noValidate onSubmit={add}><div className="xp-field"><label htmlFor={id}>عنوان معيار توضيحي</label><input ref={ref} id={id} value={value} onChange={(event) => setValue(event.target.value)} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} required />{error && <p id={`${id}-error`} role="alert" className="admin-field-error">{error}</p>}</div><button type="submit" className="xp-button xp-button-outline">إضافة محلية للمعاينة</button></form><LocalFeedback message={feedback} /></section><section className="xp-card"><p className="admin-eyebrow">قرار مفتوح · OP-1</p><h2>معايير تنتظر اعتماد الأكاديمية</h2><p>تحديد المعايير والأوزان ومستويات الأداء يسبق تشغيل التقييم البشري أو المساعدة الآلية.</p><ul className="admin-checklist"><li>وصف واضح لكل معيار.</li><li>مراجعة اتساق الأوزان ومستويات الأداء.</li><li>اعتماد نسخة قابلة للتتبع.</li></ul><PreviewAction title="لا اعتماد أو نشر" description="هذا نموذج محلي فقط. لم تُعتمد معايير تقييم ولم تُربط بأي مشروع.">استكشاف مسار الاعتماد</PreviewAction></section></div>;
}
