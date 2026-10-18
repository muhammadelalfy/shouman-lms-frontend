"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ClipboardList, RotateCcw } from "lucide-react";
import { StatusBadge } from "@/features/experience/shared/ui";
import { sampleQuestions } from "./fixtures";

export function QuizWorkspace() {
  const [question, setQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [reviewing, setReviewing] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const active = sampleQuestions[question];
  const answered = Object.keys(answers).length;
  function navigate(next: number) {
    setQuestion(next);
    requestAnimationFrame(() => headingRef.current?.focus());
  }
  return <div className="learner-quiz-layout">
    <section className="xp-card learner-quiz-panel">
      <div className="xp-row">
        <StatusBadge tone="info">أسئلة تدريبية · دون تقييم</StatusBadge>
        <span className="xp-muted learner-small">{reviewing ? "مراجعة محلية" : `السؤال ${question + 1} من ${sampleQuestions.length}`}</span>
      </div>
      {reviewing ? <div className="xp-stack">
        <h2 tabIndex={-1} ref={headingRef}>مراجعة اختياراتك</h2>
        <p className="xp-muted">اخترت إجابة عن {answered} من {sampleQuestions.length} أسئلة. لا تُحسب درجة ولا تُسجّل محاولة أو نتيجة.</p>{sampleQuestions.map((item, index) => <article className="learner-answer-review" key={item.id}>
          <span className="learner-outline-number">{index + 1}</span>
          <div>
            <h3>{item.question}</h3>
            <p>{answers[item.id] === undefined ? "لم تحدد إجابة" : item.options[answers[item.id]]}</p>
          </div>
          <button className="learner-text-button" type="button" onClick={() => { setReviewing(false); navigate(index); }}>تعديل الاختيار</button>
        </article>)}<div className="learner-neutral-result">
          <ClipboardList size={27} aria-hidden="true" />
          <div>
            <h3>تجربة الواجهة فقط</h3>
            <p>الدرجة، ومدة الاختبار، والمحاولات، والنجاح وفتح المحتوى تنتظر سياسة وخدمة معتمدتين.</p>
          </div>
        </div>
        <div className="learner-actions">
          <button className="xp-button xp-button-outline" type="button" onClick={() => { setAnswers({}); setReviewing(false); navigate(0); }}>
            <RotateCcw size={17} aria-hidden="true" />مسح الاختيارات والبدء مجددًا</button>
          <Link className="xp-button" href="/quizzes/demo-quiz/result">استعرض صفحة ملخص النموذج<ArrowLeft size={17} aria-hidden="true" />
          </Link>
        </div>
      </div> : <div className="xp-stack">
        <div className="learner-question-progress" aria-hidden="true">{sampleQuestions.map((item, index) => <span key={item.id} className={question === index ? "is-current" : answers[item.id] !== undefined ? "is-selected" : ""} />)}</div>
        <h2 tabIndex={-1} ref={headingRef} id="quiz-question">{active.question}</h2>
        <fieldset className="learner-quiz-options" aria-labelledby="quiz-question">
          <legend className="learner-sr-only">اختر إجابة واحدة</legend>{active.options.map((option, index) => <label key={option} className={answers[active.id] === index ? "is-selected" : ""}>
            <input type="radio" name={active.id} value={index} checked={answers[active.id] === index} onChange={() => setAnswers((current) => ({ ...current, [active.id]: index }))} />
            <span className="learner-option-letter">{"أبجد"[index]}</span>
            <span>{option}</span>
          </label>)}</fieldset>
        <div className="learner-actions">
          <button className="xp-button xp-button-outline" type="button" disabled={question === 0} onClick={() => navigate(question - 1)}>السؤال السابق</button>{question < sampleQuestions.length - 1 ? <button className="xp-button" type="button" onClick={() => navigate(question + 1)}>السؤال التالي<ArrowLeft size={17} aria-hidden="true" />
          </button> : <button className="xp-button" type="button" onClick={() => { setReviewing(true); requestAnimationFrame(() => headingRef.current?.focus()); }}>مراجعة الاختيارات</button>}</div>
        <p className="xp-muted learner-small">تستطيع التنقل دون إجابة. لا يوجد مؤقت أو حد محاولات مفترض.</p>
      </div>}
    </section>
    <aside className="xp-stack">
      <section className="xp-card">
        <h2>خريطة الأسئلة</h2>
        <p className="xp-muted learner-small">انتقل إلى أي سؤال لمراجعته.</p>
        <div className="learner-question-map">{sampleQuestions.map((item, index) => <button type="button" key={item.id} aria-label={`السؤال ${index + 1}${answers[item.id] !== undefined ? " — له اختيار" : " — دون اختيار"}`} aria-pressed={question === index && !reviewing} onClick={() => { setReviewing(false); navigate(index); }}>{index + 1}{answers[item.id] !== undefined && <span className="learner-answer-dot" />}</button>)}</div>
        <p className="learner-small xp-muted" role="status">اختيارات محلية: {answered} / {sampleQuestions.length}</p>
      </section>
      <section className="learner-quiet-note">
        <h2>تعلّم على مهل</h2>
        <p>الغرض من النموذج تجربة وضوح السؤال وسهولة التنقل، وليس قياس مستواك.</p>
        <Link href="/learning/lessons/demo-lesson">العودة إلى نموذج الدرس</Link>
      </section>
    </aside>
  </div>;
}
