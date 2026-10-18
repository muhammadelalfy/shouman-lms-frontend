"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, FileText, Headphones, Info, LockKeyhole, Play, StickyNote, Video } from "lucide-react";
import { PreviewAction, StatusBadge } from "@/features/experience/shared/ui";
import { sampleLessons } from "./fixtures";

export function LessonWorkspace() {
  const [selected, setSelected] = useState(1);
  const [section, setSection] = useState<"summary" | "notes" | "resources">("summary");
  const [notes, setNotes] = useState("");
  const lesson = sampleLessons[selected];
  const MediaIcon = lesson.kind === "صوتي" ? Headphones : lesson.kind === "مستند" ? FileText : Video;
  return <div className="learner-lesson-layout">
    <div className="xp-stack">
      <section className="learner-player" aria-label="معاينة مشغل الدرس">
        <div className="learner-player-stage">
          <span className="learner-player-icon">
            <MediaIcon size={34} aria-hidden="true" />
          </span>
          <p>{lesson.kind === "صوتي" ? "مساحة الدرس الصوتي" : lesson.kind === "مستند" ? "مساحة مستند الدرس" : "مساحة الدرس المرئي"}</p>
          <strong>{lesson.title}</strong>
          <PreviewAction className="learner-play-button" title="الوسائط غير متصلة" description="هذا نموذج لواجهة المحتوى. لا يوجد بث أو ملف متصل، ولا تُسجل مشاهدة أو نسبة تقدم.">
            <Play size={24} aria-hidden="true" /> استعرض حالة المشغل</PreviewAction>
          <small>لا يوجد ملف تعليمي متصل بهذه المعاينة</small>
        </div>
        <div className="learner-player-caption">
          <span>
            <Info size={16} aria-hidden="true" />مشغل توضيحي دون تتبع مشاهدة</span>
          <span>{lesson.kind} · {lesson.duration}</span>
        </div>
      </section>
      <div className="xp-card learner-lesson-info">
        <div className="xp-row">
          <StatusBadge tone="info">درس تجريبي</StatusBadge>
          <span className="xp-muted learner-small">المادة الأولى · رحلة التأسيس</span>
        </div>
        <h1>{lesson.title}</h1>
        <p className="xp-muted">اقرأ ملخص الواجهة، وجرّب تدوين ملاحظات مؤقتة، واستعرض ترتيب الدروس.</p>
        <div className="learner-lesson-navigation">
          <button className="xp-button xp-button-outline" type="button" disabled={selected === 0} onClick={() => setSelected(selected - 1)}>
            <ChevronRight size={17} aria-hidden="true" />الدرس السابق</button>
          <button className="xp-button xp-button-outline" type="button" disabled={selected === sampleLessons.length - 1} onClick={() => setSelected(selected + 1)}>الدرس التالي<ChevronLeft size={17} aria-hidden="true" />
          </button>
        </div>
      </div>
      <section className="xp-card learner-reading-panel">
        <div className="xp-tabs" aria-label="محتوى الدرس">
          <button type="button" aria-pressed={section === "summary"} onClick={() => setSection("summary")}>
            <BookOpen size={17} aria-hidden="true" />الملخص</button>
          <button type="button" aria-pressed={section === "notes"} onClick={() => setSection("notes")}>
            <StickyNote size={17} aria-hidden="true" />ملاحظاتي المؤقتة</button>
          <button type="button" aria-pressed={section === "resources"} onClick={() => setSection("resources")}>
            <FileText size={17} aria-hidden="true" />المرفقات</button>
        </div>
        {section === "summary" && <div className="learner-reading-copy">
          <h2>مساحة للتعلّم والتأمل</h2>
          <p>هذه عينة من ترتيب ملخص الدرس: فكرة رئيسية واضحة، ونقاط مختصرة تساعد على المراجعة، وسؤال للتأمل بعد القراءة.</p>
          <h3>في هذا الدرس التجريبي</h3>
          <ul>
            <li>نتعرّف على بنية مساحة الدرس وأدواتها.</li>
            <li>نرتّب الأفكار في ملاحظات شخصية مؤقتة.</li>
            <li>ننتقل بين أمثلة الدروس دون تسجيل إنجاز.</li>
          </ul>
          <blockquote>ما الفكرة التي تريد العودة إليها في قراءتك التالية؟</blockquote>
          <p className="xp-muted learner-small">النص توضيحي لتصميم الصفحة، وليس مادة علمية معتمدة.</p>
        </div>}
        {section === "notes" && <div className="xp-stack learner-note-form">
          <label className="xp-field" htmlFor="lesson-notes">ملاحظات هذه المعاينة<textarea className="resize-none" id="lesson-notes" value={notes} onChange={(event) => setNotes(event.target.value)} rows={8} placeholder="دوّن فكرة أو سؤالًا لتجربة مساحة الكتابة…" aria-describedby="lesson-notes-help" />
          </label>
          <p id="lesson-notes-help" className="xp-muted learner-small" role="status">{notes.length} حرف · النص مؤقت داخل هذه الصفحة؛ لم يتم الحفظ وسيُفقد عند مغادرتها.</p>
          <button className="xp-button xp-button-outline learner-fit" type="button" onClick={() => setNotes("")} disabled={!notes}>مسح النص المؤقت</button>
        </div>}
        {section === "resources" && <div className="learner-resource">
          <span className="learner-icon-tile">
            <FileText size={24} aria-hidden="true" />
          </span>
          <div>
            <h2>ورقة التأمل والمراجعة</h2>
            <p className="xp-muted">نموذج بطاقة مرفق · لا يوجد ملف متصل.</p>
          </div>
          <PreviewAction title="المرفق غير متاح" description="لم يتم تنزيل ملف. تعرض المعاينة شكل بطاقة المصادر فقط.">تفاصيل المرفق</PreviewAction>
        </div>}
      </section>
    </div>
    <aside className="xp-stack learner-outline" aria-label="محتوى المسار">
      <section className="xp-card">
        <div className="learner-panel-heading">
          <h2>خريطة التعلّم</h2>
          <BookOpen size={20} aria-hidden="true" />
        </div>
        <p className="xp-muted learner-small">المادة الأولى · 4 أمثلة دروس</p>
        <ol>{sampleLessons.map((item, index) => <li key={item.title}>
          <button type="button" className={selected === index ? "is-active" : ""} aria-label={`الدرس ${index + 1}: ${item.title} — ${item.kind}، ${item.duration}`} aria-pressed={selected === index} onClick={() => setSelected(index)}>
            <span className="learner-outline-number">{index + 1}</span>
            <span>
              <strong>{item.title}</strong>
              <small>{item.kind === "صوتي" && <Headphones size={13} aria-hidden="true" />} {item.kind} · {item.duration}</small>
            </span>
          </button>
        </li>)}</ol>
        <details className="learner-lock-example">
          <summary>
            <LockKeyhole size={16} aria-hidden="true" />نموذج محتوى غير متاح</summary>
          <p>هنا يظهر سبب القفل الذي تعيده الخدمة. لا يوجد شرط إتمام أو نجاح مفترض في هذه المعاينة.</p>
        </details>
        <div className="learner-outline-note">
          <Info size={17} aria-hidden="true" />
          <p>ترتيب توضيحي فقط. قواعد فتح الدروس واستكمالها تحددها الخدمة بعد اعتمادها.</p>
        </div>
      </section>
      <section className="xp-card learner-side-prompt">
        <CheckCircle2 size={26} aria-hidden="true" />
        <h2>راجع ما تعلّمته</h2>
        <p className="xp-muted">جرّب شكل الأسئلة واختيار الإجابات محليًا.</p>
        <Link href="/quizzes/demo-quiz" className="xp-button xp-button-outline">افتح نموذج الاختبار</Link>
      </section>
    </aside>
  </div>;
}
