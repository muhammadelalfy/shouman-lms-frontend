"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Bell, BookOpen, Check, FileText, MessageCircle, Trash2, Upload, Video } from "lucide-react";
import { EmptyState, StatusBadge } from "@/features/experience/shared/ui";
import { sampleNotifications } from "./fixtures";

export function NotificationInbox() {
  const [filter, setFilter] = useState("all");
  const [read, setRead] = useState<string[]>([]);
  const unread = sampleNotifications.length - read.length;
  const visible = sampleNotifications.filter((item) => filter !== "unread" || !read.includes(item.id));
  const icons = { learning: BookOpen, meetings: Video, community: MessageCircle };
  return <div className="xp-stack">
    <div className="learner-list-toolbar">
      <div className="xp-tabs" aria-label="فلترة التنبيهات">
        <button type="button" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>كل التنبيهات</button>
        <button type="button" aria-pressed={filter === "unread"} onClick={() => setFilter("unread")}>غير المقروءة ({unread})</button>
      </div>
      <button className="xp-button xp-button-outline" type="button" disabled={!unread} onClick={() => setRead(sampleNotifications.map((item) => item.id))}>
        <Check size={17} aria-hidden="true" />تجربة تعليم الكل كمقروء</button>
    </div>
    <p className="xp-muted learner-small" role="status">حالة القراءة محلية في هذه المعاينة؛ لم يتم حفظها في حساب.</p>{visible.length ? <div className="xp-card learner-inbox">{visible.map((item) => {
      const Icon = icons[item.category]; const isRead = read.includes(item.id); return <article className={isRead ? "is-read" : ""} key={item.id}>
        <span className="learner-icon-tile">
          <Icon size={23} aria-hidden="true" />
        </span>
        <div className="learner-inbox-copy">
          <span className="xp-muted learner-small">{item.time}</span>
          <h2>
            <Link href={item.href}>{item.title}</Link>
          </h2>
          <p className="xp-muted">{item.description}</p>
          <div className="learner-actions">
            <StatusBadge tone={isRead ? "neutral" : "info"}>{isRead ? "مقروء محليًا" : "غير مقروء — نموذج"}</StatusBadge>
            <button className="learner-text-button" type="button" onClick={() => setRead((current) => isRead ? current.filter((id) => id !== item.id) : [...current, item.id])}>{isRead ? "إلغاء علامة القراءة" : "تعليم كمقروء محليًا"}</button>
          </div>
        </div>
      </article>;
    })}</div> : <EmptyState title="انتهت أمثلة غير المقروء" description="يمكنك الرجوع إلى كل التنبيهات أو إعادة تحميل الصفحة لاستعادة النموذج." />}</div>;
}

type SelectedFile = { name: string; size: number; type: string };

export function ProjectFilePicker() {
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [status, setStatus] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  function clear() {
    setFiles([]);
    if (inputRef.current) inputRef.current.value = "";
    setStatus("أُزيلت بيانات الاختيار المحلية. لم يتم رفع أي ملف.");
  }
  return <section className="xp-card xp-stack learner-project-picker">
    <div className="learner-panel-heading">
      <h2>جرّب اختيار ملفات المشروع</h2>
      <Upload size={21} aria-hidden="true" />
    </div>
    <p className="xp-muted">نعرض أسماء الملفات وأحجامها فقط. لا تُقرأ محتوياتها ولا تُرفع إلى أي خدمة. نوع الملف وحدوده ينتظران اعتماد متطلبات المشروع.</p>
    <label className="learner-file-zone" htmlFor="sample-project-files">
      <Upload size={30} aria-hidden="true" />
      <strong>اختر ملفات من جهازك لتجربة الواجهة</strong>
      <span>اختيار محلي فقط — دون رفع</span>
      <input ref={inputRef} id="sample-project-files" type="file" multiple onChange={(event) => { setFiles(Array.from(event.target.files ?? []).map((file) => ({ name: file.name, size: file.size, type: file.type }))); setStatus("تم عرض بيانات الاختيار محليًا فقط. لم يتم رفع أو إرسال أي ملف."); }} />
    </label>{files.length > 0 && <ul className="learner-selected-files">{files.map((file, index) => <li key={`${file.name}-${index}`}>
      <FileText size={21} aria-hidden="true" />
      <span>
        <strong dir="auto">{file.name}</strong>
        <small>{(file.size / 1024).toLocaleString("ar-EG", { maximumFractionDigits: 1 })} كيلوبايت · بيانات اختيار فقط</small>
      </span>
    </li>)}</ul>}<div className="learner-actions">
      <button className="xp-button" type="button" onClick={() => setStatus("لم يتم الإرسال أو الحفظ. لا توجد خدمة تسليم مشاريع متصلة بهذه المعاينة.")}>استعرض حالة التسليم</button>
      <button className="xp-button xp-button-outline" type="button" disabled={!files.length} onClick={clear}>
        <Trash2 size={16} aria-hidden="true" />مسح الاختيار</button>
    </div>
    <p role="status" className="learner-local-status">{status || "لم يتم اختيار ملفات؛ لا توجد عملية رفع أو تسليم."}</p>
  </section>;
}

export function PreviewPreferences() {
  const [email, setEmail] = useState(false);
  const [reminders, setReminders] = useState(true);
  const [density, setDensity] = useState("comfortable");
  const [message, setMessage] = useState("");
  return <form className="xp-card xp-stack learner-preferences" noValidate onSubmit={(event) => { event.preventDefault(); setMessage("لم يتم الإرسال أو الحفظ. اختيارات العرض مؤقتة داخل هذه المعاينة فقط."); }}>
    <div className="learner-panel-heading">
      <h2>تفضيلات تجربة العرض</h2>
      <Bell size={22} aria-hidden="true" />
    </div>
    <p className="xp-muted">جرّب ترتيب إعدادات الحساب دون تعديل حسابك الفعلي.</p>
    <label className="learner-preference-row">
      <span>
        <strong>تنبيهات التعلم بالبريد</strong>
        <small>نموذج تحكم؛ لن تُرسل رسائل.</small>
      </span>
      <input type="checkbox" checked={email} onChange={(event) => setEmail(event.target.checked)} />
    </label>
    <label className="learner-preference-row">
      <span>
        <strong>تذكيرات اللقاءات</strong>
        <small>اختيار توضيحي؛ لن يُنشأ تذكير.</small>
      </span>
      <input type="checkbox" checked={reminders} onChange={(event) => setReminders(event.target.checked)} />
    </label>
    <label className="xp-field" htmlFor="sample-density">نموذج كثافة العرض<select id="sample-density" value={density} onChange={(event) => setDensity(event.target.value)}>
      <option value="comfortable">مساحة مريحة</option>
      <option value="compact">مساحة مختصرة</option>
    </select>
    </label>
    <p className="xp-muted learner-small">هذا الاختيار يشرح نموذج حقل التفضيل ولا يغيّر النمط العام للموقع.</p>
    <button type="submit" className="xp-button learner-fit">استعرض التفضيلات المحددة</button>
    <p role="status" className="learner-local-status">{message || "كل الاختيارات محلية ولا تُحفظ عند مغادرة الصفحة."}</p>
  </form>;
}
